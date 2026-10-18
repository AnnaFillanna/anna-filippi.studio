import { legal } from '../../config/legal';
import { contact } from '../../config/contact';
import styles from './Footer.module.scss';

export default function Footer() {
  const links = [
    { label: 'Impressum', href: legal.impressumUrl },
    { label: 'Datenschutz', href: legal.privacyUrl || contact.privacyUrl },
    { label: 'Cookies', href: legal.cookiesUrl },
  ];
  return <footer className={styles.footer} aria-label="Seitenabschluss">
    <img className={styles.background} src="/images/footer.png" alt="" width="1456" height="816" loading="lazy" />
    <div className={styles.inner}>
      <div className={styles.topline}><span>DIGITAL ATELIER</span><span>ANDERNACH · DE</span></div>
      <div className={styles.content}>
        <a href="#start" className={styles.wordmark} aria-label="Anna Filippi – Startseite">Anna<br /><em>Filippi.</em></a>
        <p>Webentwicklung. Fotografie.<br />Mit einem Blick für das Besondere.</p>
        <nav className={styles.navigation} aria-label="Navigation im Footer">
          <a href="#projekte">Projekte ↗</a>
          <a href="#fotografie">Fotografie ↗</a>
          <a href="#kontakt">Kontakt ↗</a>
        </nav>
      </div>
      <div className={styles.bottom}>
        <span>© {new Date().getFullYear()} Anna Filippi</span>
        <nav className={styles.legal} aria-label="Rechtliche Informationen">
          {links.map(link => link.href ? <a key={link.label} href={link.href}>{link.label}</a> : <span key={link.label} aria-disabled="true">{link.label}</span>)}
        </nav>
        <a className={styles.up} href="#start">NACH OBEN ↑</a>
      </div>
    </div>
  </footer>;
}
