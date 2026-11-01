import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router';
import { applyConsent, readConsent, saveConsent, trackPage, CONSENT_KEY } from '../../analytics/analytics';
import { pages, pageForPath } from '../../routes';
import './consent.scss';

export default function Consent() {
  const location = useLocation();
  const current = useRef<string | null | undefined>(undefined);
  const [choice, setChoice] = useState<'granted' | 'denied' | null>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const synchronize = () => {
      const saved = readConsent();
      if (saved === current.current) return;
      current.current = saved;
      applyConsent(saved);
      setChoice(saved);
      setVisible(saved === null);
    };
    const open = () => setVisible(true);
    const storage = (event: StorageEvent) => { if (event.key === CONSENT_KEY || event.key === null) synchronize(); };
    synchronize();
    window.addEventListener('afs:privacy', open);
    window.addEventListener('storage', storage);
    window.addEventListener('focus', synchronize);
    const timer = window.setInterval(synchronize, 60000);
    return () => {
      window.removeEventListener('afs:privacy', open);
      window.removeEventListener('storage', storage);
      window.removeEventListener('focus', synchronize);
      window.clearInterval(timer);
    };
  }, []);
  useEffect(() => {
    if (choice !== 'granted') return;
    const path = pageForPath(location.pathname);
    trackPage(path, pages[path].title);
  }, [choice, location.pathname]);
  const decide = (next: 'granted' | 'denied') => {
    current.current = next;
    saveConsent(next);
    setChoice(next);
    setVisible(false);
  };
  if (!visible) return null;
  return <section className="consent-panel" aria-labelledby="consent-title" role="region">
    <h2 id="consent-title">Deine Datenschutzeinstellungen</h2>
    <p>Mit deiner Zustimmung verwenden wir Google Analytics 4 von Google Ireland Limited, um Seitenaufrufe und die Nutzung dieser Website auszuwerten. Dabei werden Cookies gespeichert und Nutzungs- und Geräteinformationen an Google übermittelt. Eine Verarbeitung in den USA ist möglich. Ohne Zustimmung bleibt Google Analytics ausgeschaltet.</p>
    <p>Deine Entscheidung speichern wir für 180 Tage. Du kannst sie jederzeit über „Datenschutzeinstellungen“ im Seitenfuß ändern oder widerrufen. <a href="/datenschutz">Zur Datenschutzerklärung</a></p>
    <p>Analytics: {choice === 'granted' ? 'aktiviert' : 'deaktiviert'}</p>
    <div className="consent-actions">
      <button type="button" onClick={() => decide('granted')}>Akzeptieren</button>
      <button type="button" onClick={() => decide('denied')}>{choice === 'granted' ? 'Einwilligung widerrufen' : 'Ablehnen'}</button>
      {choice && <button type="button" onClick={() => setVisible(false)}>Schließen</button>}
    </div>
  </section>;
}
