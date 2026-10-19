import { legal } from '../../config/legal';
import { contact } from '../../config/contact';
import styles from './Footer.module.scss';
import AnimatedLetters from '../Animation/AnimatedLetters';

export default function Footer() {
  const links = [
    { label: 'Impressum', href: legal.impressumUrl },
    { label: 'Datenschutz', href: legal.privacyUrl || contact.privacyUrl },
    { label: 'Cookies', href: legal.cookiesUrl },
  ];
  return <footer className={styles.footer} aria-label="Seitenabschluss">
    <img className={styles.background} src="/images/footer.png" alt="" width="1456" height="816" loading="lazy" />
    <div className={styles.inner}>
      <div className={styles.topline}><span>DIGITAL ATELIER</span><span className={styles.location}>ANDERNACH · DE</span></div>
      <div className={styles.content}>
        <a href="/#start" className={styles.wordmark} aria-label="Anna Filippi – Startseite"><AnimatedLetters text="ANNA FILIPPI" /></a>
        <h2 className={styles.invitation}>Eine Idee. Eine Frage.<br /><em>Einfach ins Gespräch kommen.</em></h2>
        <div className={styles.channels}>
          <div className={styles.channel}>
            <p>Du hast eine Frage oder möchtest mir von deiner Idee erzählen?</p>
            {contact.email ? <a href={`mailto:${contact.email}`}>SCHREIB MIR PER E-MAIL </a> : <span className={styles.pending} aria-disabled="true">SCHREIB MIR PER E-MAIL </span>}
          </div>
          <div className={styles.channel}>
            <p>Du möchtest mich lieber direkt per WhatsApp erreichen?</p>
            <a href={`https://wa.me/${contact.whatsappNumber}`} target="_blank" rel="noopener noreferrer" aria-label="Schreib mir per WhatsApp (neuer Tab)">SCHREIB MIR PER WHATSAPP </a>
          </div>
        </div>
      </div>
      <div className={styles.bottom}>
        <span>© {new Date().getFullYear()} Anna Filippi</span>
        <nav className={styles.legal} aria-label="Rechtliche Informationen">
          {links.map(link => link.href ? <a key={link.label} href={link.href}>{link.label}</a> : <span key={link.label} aria-disabled="true">{link.label}</span>)}
        </nav>
        <a className={styles.up} href="/#start">NACH OBEN </a>
      </div>
    </div>
  </footer>;
}
