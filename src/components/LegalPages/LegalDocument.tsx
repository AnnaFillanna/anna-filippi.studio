import { useEffect, useState } from 'react';
import './legal.scss';

type Props = { type: 'impressum' | 'datenschutz'; title: string };
type Document = { title: string; text: string };

export default function LegalDocument({ type, title }: Props) {
  const [legalDocument, setDocument] = useState<Document | null>(null);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    let controller: AbortController | undefined;
    const load = async () => {
      controller?.abort();
      controller = new AbortController();
      const signal = controller.signal;
      try {
        const response = await fetch(`/api/legal?type=${type}`, { cache: 'no-store', signal });
        const data = await response.json();
        if (!response.ok) throw new Error(response.status === 404 ? 'Dieser Rechtstext wurde noch nicht bereitgestellt.' : 'Der Rechtstext konnte nicht geladen werden. Bitte versuchen Sie es erneut.');
        if (typeof data.title !== 'string' || typeof data.text !== 'string' || !data.text.trim()) throw new Error('Der Rechtstext konnte nicht geladen werden.');
        if (active && !signal.aborted) { setDocument(data); setError(''); }
      } catch (cause) {
        if (active && !signal.aborted) {
          setDocument(null);
          setError(cause instanceof Error ? cause.message : 'Der Rechtstext konnte nicht geladen werden.');
        }
      }
    };
    void load();
    const refresh = () => { if (document.visibilityState === 'visible') void load(); };
    window.addEventListener('focus', refresh);
    window.addEventListener('pageshow', refresh);
    document.addEventListener('visibilitychange', refresh);
    return () => {
      active = false;
      controller?.abort();
      window.removeEventListener('focus', refresh);
      window.removeEventListener('pageshow', refresh);
      document.removeEventListener('visibilitychange', refresh);
    };
  }, [type, attempt]);
  return (
    <section className="legal-page" aria-labelledby="legal-title">
      <div className="legal-page__container">
        <h1 id="legal-title" tabIndex={-1}>{legalDocument?.title || title}</h1>
        {legalDocument ? <LegalText text={legalDocument.text} /> : error ? (
          <div role="status"><p>{error}</p><button type="button" onClick={() => { setError(''); setAttempt(value => value + 1); }}>Erneut laden</button></div>
        ) : <p role="status">Rechtstext wird geladen …</p>}
        <noscript><p>Bitte aktivieren Sie JavaScript, um den aktuellen Rechtstext abzurufen.</p></noscript>
      </div>
    </section>
  );
}

export function LegalText({ text }: { text: string }) {
  return <div className="legal-page__text">{text}</div>;
}
