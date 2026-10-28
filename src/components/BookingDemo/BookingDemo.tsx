import { useEffect, useRef, useState } from 'react';
import styles from './BookingDemo.module.scss';

const services = ['Website-Erstgespräch', 'Design-Beratung', 'Projekt-Check'];
const times = ['09:00', '10:30', '14:00', '15:30'];
const dateLabel = (value: string) => new Intl.DateTimeFormat('de-DE', { weekday: 'short', day: 'numeric', month: 'short' }).format(new Date(`${value}T12:00:00`));

export default function BookingDemo() {
  const [step, setStep] = useState(0);
  const [dates, setDates] = useState<string[]>([]);
  const [service, setService] = useState(services[0]);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const heading = useRef<HTMLHeadingElement>(null);
  const interacted = useRef(false);
  useEffect(() => {
    const next = new Date();
    const available: string[] = [];
    while (available.length < 5) {
      next.setDate(next.getDate() + 1);
      if (next.getDay() !== 0 && next.getDay() !== 6) {
        available.push(`${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, '0')}-${String(next.getDate()).padStart(2, '0')}`);
      }
    }
    setDates(available);
  }, []);
  useEffect(() => { if (interacted.current) heading.current?.focus(); }, [step]);
  function go(next: number) { interacted.current = true; setStep(next); }
  function reset() {
    setService(services[0]); setDate(''); setTime(''); setName(''); setEmail(''); go(0);
  }
  return (
    <section id="buchungsdemo" className={styles.demo} aria-labelledby="booking-title">
      <div className={styles.intro}>
        <p className={styles.eyebrow}>AUSPROBIEREN STATT NUR ANSEHEN</p>
        <h2 id="booking-title">Ein Termin.<br /><em>In wenigen Klicks.</em></h2>
        <p>So einfach kann Online-Terminbuchung sein. Probiere den Ablauf für ein fiktives Beratungsstudio aus – von der Auswahl bis zur Bestätigung.</p>
        <a className={styles.tryLink} href="#booking-panel">Demo ausprobieren</a>
        <ul><li>Klare Auswahl von Leistung und Termin</li><li>Formular mit Eingabeprüfung</li><li>Zusammenfassung vor dem Abschluss</li></ul>
        <p className={styles.note}>Portfolio-Demo: keine echte Buchung, keine E-Mail. Deine Eingaben werden weder versendet noch gespeichert.</p>
      </div>
      <div id="booking-panel" className={styles.panel}>
        <div className={styles.top}><span>STUDIO / TERMINE</span><span className={styles.badge}>DEMO</span></div>
        <ol className={styles.steps} aria-label="Buchungsschritte">
          {['Termin', 'Angaben', 'Prüfen'].map((label, index) => <li key={label} aria-current={step === index ? 'step' : undefined}><span>{index + 1}</span>{label}</li>)}
        </ol>
        <h3 ref={heading} tabIndex={-1}>{['Dein Wunschtermin', 'Wie heißt du?', 'Alles richtig?', 'Demo abgeschlossen'][step]}</h3>
        {step === 0 && <>
          <label className={styles.field}>Leistung<select value={service} onChange={event => setService(event.target.value)}>{services.map(item => <option key={item}>{item}</option>)}</select></label>
          <p className={styles.small}>30 Minuten · Online · Fiktive Verfügbarkeit</p>
          <fieldset><legend>Tag auswählen</legend><div className={styles.options}>{dates.map(item => <label key={item}><input type="radio" name="demo-date" value={item} checked={date === item} onChange={() => { setDate(item); setTime(''); }} /><span>{dateLabel(item)}</span></label>)}</div></fieldset>
          <fieldset disabled={!date}><legend>Uhrzeit auswählen</legend><div className={styles.options}>{times.map(item => <label key={item}><input type="radio" name="demo-time" value={item} checked={time === item} onChange={() => setTime(item)} /><span>{item}</span></label>)}</div></fieldset>
          <p className={styles.small}>Datum und Uhrzeit in deiner lokalen Zeitzone.</p>
          <button className={styles.primary} disabled={!date || !time} onClick={() => go(1)}>Weiter zu den Angaben →</button>
          <noscript>Bitte aktiviere JavaScript, um die Buchungsdemo auszuprobieren.</noscript>
        </>}
        {step === 1 && <form onSubmit={event => { event.preventDefault(); if (name.trim()) go(2); }}>
          <p className={styles.small}>Nutze gern die Beispieldaten für deinen Test.</p>
          <button type="button" className={styles.textButton} onClick={() => { setName('Alex Muster'); setEmail('alex@example.com'); }}>Beispieldaten einsetzen</button>
          <label className={styles.field}>Name<input required maxLength={100} pattern=".*\S.*" autoComplete="off" value={name} onChange={event => setName(event.target.value)} /></label>
          <label className={styles.field}>E-Mail<input type="email" required maxLength={254} autoComplete="off" value={email} onChange={event => setEmail(event.target.value)} /></label>
          <div className={styles.actions}><button type="button" onClick={() => go(0)}>Zurück</button><button className={styles.primary} type="submit">Angaben prüfen →</button></div>
        </form>}
        {step >= 2 && <>
          {step === 3 && <p role="status" className={styles.success}>Danke, {name}! Du hast die Demo erfolgreich durchgespielt. Es wurde kein Termin gebucht und keine E-Mail versendet.</p>}
          <dl className={styles.summary}><div><dt>Leistung</dt><dd>{service}</dd></div><div><dt>Termin</dt><dd>{dateLabel(date)} · {time} Uhr · 30 Min.</dd></div><div><dt>Name</dt><dd>{name}</dd></div><div><dt>E-Mail</dt><dd>{email}</dd></div></dl>
          {step === 2 ? <div className={styles.actions}><button onClick={() => go(1)}>Bearbeiten</button><button className={styles.primary} onClick={() => go(3)}>Demo-Buchung abschließen</button></div> : <button className={styles.primary} onClick={reset}>Demo erneut ausprobieren</button>}
        </>}
      </div>
    </section>
  );
}
