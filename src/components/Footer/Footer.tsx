import { useRef, useState, type FormEvent } from 'react';
import { motion } from 'motion/react';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { contact, projectTypes, budgets } from '../../config/contact';
import styles from './Footer.module.scss';

export default function Footer() {
  const reveal = useScrollReveal();
  const busy = useRef(false);
  const attempt = useRef({ body: '', id: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy.current || !contact.privacyUrl) return;
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const data = Object.fromEntries(new FormData(form));
    const body = JSON.stringify(data);
    if (attempt.current.body !== body) attempt.current = { body, id: crypto.randomUUID() };
    busy.current = true;
    setStatus('sending'); setMessage('Ihre Anfrage wird gesendet …');
    try {
      const response = await fetch(contact.endpoint, {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'Idempotency-Key': attempt.current.id },
        body, signal: AbortSignal.timeout(25000),
      });
      const result = await response.json();
      if (!response.ok || result.ok !== true) throw new Error(result.message || 'Die Anfrage konnte nicht gesendet werden. Bitte versuchen Sie es erneut.');
      setStatus('success'); setMessage('Vielen Dank! Ihre Anfrage wurde erfolgreich gesendet. Ich melde mich so bald wie möglich bei Ihnen.');
      form.reset(); attempt.current = { body: '', id: '' };
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error && !['SyntaxError', 'TimeoutError', 'TypeError'].includes(error.name) ? error.message : 'Die Übermittlung konnte nicht bestätigt werden. Ihre Eingaben bleiben erhalten. Bitte versuchen Sie es erneut oder kontaktieren Sie mich per WhatsApp.');
    } finally { busy.current = false; }
  }
  return (
    <footer id="kontakt" className={styles.footer} aria-labelledby="contact-title">
      <div className={styles.layout}>
        <motion.div {...reveal} className={styles.intro}>
          <p className={styles.eyebrow}>04 / KONTAKT</p>
          <h2 id="contact-title">Lass uns etwas <em>Schönes schaffen.</em></h2>
          <p className={styles.description}>Erzählen Sie mir von Ihrer Idee. Je mehr ich über Ihr Projekt weiß, desto besser kann ich Ihre Anfrage einschätzen.</p>
        </motion.div>
        <motion.form {...reveal} className={styles.form} onSubmit={submit} aria-busy={status === 'sending'}>
          <fieldset disabled={status === 'sending'}>
            <legend className={styles.srOnly}>Projektanfrage</legend>
            <div className={styles.row}>
              <label>Ihr Name *<input name="name" autoComplete="name" required maxLength={100} pattern=".*\S.*" /></label>
              <label>Ihre E-Mail-Adresse *<input name="email" type="email" autoComplete="email" required maxLength={254} /></label>
            </div>
            <label>Was möchten Sie umsetzen? *<select name="project" required defaultValue=""><option value="" disabled>Bitte auswählen</option>{projectTypes.map(value => <option key={value}>{value}</option>)}</select></label>
            <label>Ihr ungefähres Budget<select name="budget" defaultValue="" aria-describedby="budget-note"><option value="">Optional auswählen</option>{budgets.map(value => <option key={value}>{value}</option>)}</select></label>
            <p id="budget-note" className={styles.note}>Die Budgetangabe ist freiwillig und stellt keine verbindliche Preisangabe dar.</p>
            <label>Erzählen Sie mir von Ihrem Projekt *<textarea name="message" required minLength={10} maxLength={5000} rows={5} placeholder="Was ist Ihre Idee? Was ist Ihnen besonders wichtig?" /></label>
            <div className={styles.trap} aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" maxLength={200} /></label></div>
            <p className={styles.note}>Ihre Angaben werden zur Bearbeitung Ihrer Anfrage verwendet. {contact.privacyUrl ? <a href={contact.privacyUrl}>Datenschutzerklärung</a> : 'Die Datenschutzerklärung wird noch ergänzt. Der Formularversand ist bis dahin deaktiviert.'}</p>
            <button className={styles.submit} type="submit" disabled={!contact.privacyUrl}>{status === 'sending' ? 'WIRD GESENDET …' : 'ANFRAGE ABSENDEN ↗'}</button>
          </fieldset>
          <p className={styles.status} role="status" aria-live="polite" data-error={status === 'error'}>{message}</p>
          <a className={styles.whatsapp} href={`https://wa.me/${contact.whatsappNumber}`} target="_blank" rel="noopener noreferrer" aria-label="Lieber per WhatsApp kontaktieren (öffnet einen neuen Tab)">LIEBER PER WHATSAPP KONTAKTIEREN <span aria-hidden="true">↗</span></a>
        </motion.form>
      </div>
      <div className={styles.bottom}><a href="#start" className={styles.signature}>Anna Filippi<span>Digital Atelier</span></a><span>© {new Date().getFullYear()} Anna Filippi</span><a href="#start">NACH OBEN</a></div>
    </footer>
  );
}
