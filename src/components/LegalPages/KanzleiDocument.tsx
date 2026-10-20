import { useEffect, useRef } from 'react';
import './legal.scss';

const documents = {
  impressum: { title: 'Impressum', url: 'https://itrk.legal/1DBW.0.1cWV-de-iframe.html' },
  datenschutz: { title: 'Datenschutzerklärung', url: 'https://itrk.legal/1DBW.8V.1cWV-informal-iframe.html' },
} as const;
type DocumentType = keyof typeof documents;
const scriptUrl = 'https://www.it-recht-kanzlei.de/js/itrk-legaltext.js';
// The official script scans once. Retain its container across SPA navigation
// and React StrictMode remounts so it never needs duplicate execution.
const containers = new Map<DocumentType, HTMLDivElement>();

export default function KanzleiDocument({ type }: { type: DocumentType }) {
  const { title, url: legalUrl } = documents[type];
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!host.current) return;
    const firstMount = containers.size === 0;
    // Register both targets before the official script's single scan. Hidden
    // nodes survive route changes, including navigation during a pending fetch.
    if (firstMount) {
      for (const key of Object.keys(documents) as DocumentType[]) {
        const node = document.createElement('div');
        node.className = 'itrk-legaltext';
        node.dataset.itrkLegaltextUrl = documents[key].url;
        node.textContent = 'Rechtstext wird geladen …';
        node.hidden = true;
        containers.set(key, node);
        document.body.appendChild(node);
      }
    }
    const container = containers.get(type)!;
    container.hidden = false;
    host.current.replaceChildren(container);
    if (firstMount) {
      const script = document.createElement('script');
      script.src = scriptUrl;
      script.async = true;
      script.addEventListener('error', () => {
        for (const node of containers.values()) node.textContent = 'Der Rechtstext konnte nicht geladen werden. Bitte nutze den Direktlink unten oder lade die Seite erneut.';
      }, { once: true });
      document.body.appendChild(script);
    }
    // Keep the node attached until the official script has scanned it, even if
    // navigation happens before the script finishes downloading.
    return () => {
      container.hidden = true;
      document.body.appendChild(container);
    };
  }, [type]);
  return (
    <section className="legal-page" aria-labelledby="legal-title">
      <div className="legal-page__container">
        <h1 id="legal-title" tabIndex={-1}>{title}</h1>
        <div ref={host} className="legal-page__embed"><p role="status">Rechtstext wird geladen …</p></div>
        <p className="legal-page__direct"><a href={legalUrl} target="_blank" rel="noopener noreferrer">{title} direkt bei der IT-Recht Kanzlei öffnen (neuer Tab)</a></p>
        <noscript><p>Bitte nutze den Direktlink, um den Rechtstext ohne JavaScript zu lesen.</p></noscript>
      </div>
    </section>
  );
}
