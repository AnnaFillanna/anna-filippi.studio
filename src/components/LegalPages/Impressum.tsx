import { useEffect, useRef } from 'react';
import './legal.scss';

const legalUrl = 'https://itrk.legal/1DBW.0.1cWV-de-iframe.html';
const scriptUrl = 'https://www.it-recht-kanzlei.de/js/itrk-legaltext.js';
// The official script scans once. Retain its container across SPA navigation
// and React StrictMode remounts so it never needs duplicate execution.
let legalContainer: HTMLDivElement | undefined;

export default function Impressum() {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!host.current) return;
    const firstMount = !legalContainer;
    if (!legalContainer) {
      legalContainer = document.createElement('div');
      legalContainer.className = 'itrk-legaltext';
      legalContainer.dataset.itrkLegaltextUrl = legalUrl;
      legalContainer.textContent = 'Rechtstext wird geladen …';
    }
    const container = legalContainer;
    container.hidden = false;
    host.current.replaceChildren(container);
    if (firstMount) {
      const script = document.createElement('script');
      script.src = scriptUrl;
      script.async = true;
      script.addEventListener('error', () => {
        container.textContent = 'Das Impressum konnte nicht geladen werden. Bitte nutze den Direktlink unten oder lade die Seite erneut.';
      }, { once: true });
      document.body.appendChild(script);
    }
    // Keep the node attached until the official script has scanned it, even if
    // navigation happens before the script finishes downloading.
    return () => {
      container.hidden = true;
      document.body.appendChild(container);
    };
  }, []);
  return (
    <section className="legal-page" aria-labelledby="legal-title">
      <div className="legal-page__container">
        <h1 id="legal-title" tabIndex={-1}>Impressum</h1>
        <div ref={host} className="legal-page__embed"><p role="status">Rechtstext wird geladen …</p></div>
        <p className="legal-page__direct"><a href={legalUrl} target="_blank" rel="noopener noreferrer">Impressum direkt bei der IT-Recht Kanzlei öffnen (neuer Tab)</a></p>
        <noscript><p>Bitte nutze den Direktlink, um das Impressum ohne JavaScript zu lesen.</p></noscript>
      </div>
    </section>
  );
}
