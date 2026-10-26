import { legal } from "../../config/legal";
import { contact } from "../../config/contact";
import styles from "./Footer.module.scss";
import AnimatedLetters from "../Animation/AnimatedLetters";


export default function Footer() {
  const links = [
    { label: "Impressum", href: legal.impressumUrl },
    { label: "Datenschutz", href: legal.privacyUrl || contact.privacyUrl },
    { label: "Cookies", href: legal.cookiesUrl },
  ];
  return (
    <footer className={styles.footer} aria-label="Seitenabschluss">
      <img
        className={styles.background}
        src="/images/footer.png"
        alt=""
        width="1456"
        height="816"
        loading="lazy"
      />
      <div className={styles.inner} data-nosnippet="">
        <div className={styles.topline}>
          <span>DIGITAL ATELIER</span>
          <span className={styles.location}>ANDERNACH · DE</span>
        </div>
        <div className={styles.content}>
          <a
            href="/#start"
            className={styles.wordmark}
            aria-label="Anna Filippi – Startseite"
          >
            <AnimatedLetters text="ANNA FILIPPI" />
          </a>
          <h2 className={styles.invitation}>
            Ich liebe es, Code<br />
            <em>in etwas Schönes zu verwandeln.</em>
          </h2>
          <p className={styles.personalNote}>Websites zu gestalten und zum Leben zu erwecken macht mir einfach Freude. Vielleicht entsteht die nächste mit dir. Ich freue mich auf unsere Zusammenarbeit.</p>
          <p className={styles.signature}>Mit Liebe,<br /><span>Anna Filippi</span></p>
        </div>
        <div className={styles.bottom}>
          <span>© {new Date().getFullYear()} Anna Filippi</span>
          <nav className={styles.legal} aria-label="Rechtliche Informationen">
            {links.map((link) =>
              link.href ? (
                <a key={link.label} href={link.href}>
                  {link.label}
                </a>
              ) : (
                <span key={link.label} aria-disabled="true">
                  {link.label}
                </span>
              ),
            )}
          </nav>
          <a className={styles.up} href="/#start">
            Nach oben{" "}
          </a>
        </div>
      </div>
    </footer>
  );
}
