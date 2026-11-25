import { imageProps } from "../../data/responsiveImage";
import { legal } from "../../config/legal";
import { contact } from "../../config/contact";
import styles from "./Footer.module.scss";
import AnimatedLetters from "../Animation/AnimatedLetters";


export default function Footer() {
  const links = [
    { label: "Impressum", href: legal.impressumUrl },
    { label: "Datenschutz", href: legal.privacyUrl || contact.privacyUrl },
  ];
  return (
    <footer className={styles.footer} aria-label="Seitenabschluss">
      <img
        className={styles.background}
        {...imageProps("/images/footer.png", "100vw")}
        alt=""
        loading="lazy"
      decoding="async" />
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
            Deine Idee.<br />
            <em>Meine Kreativität.</em>
          </h2>
          <p className={styles.personalNote}>Mit Kreativität, Technologie und einem Blick fürs Detail entwickle ich digitale Lösungen für dein Business.</p>
          <p className={styles.signature}>Mit Liebe,<br /><span>Anna Filippi</span></p>
        </div>
        <img className={styles.mobileFlower} {...imageProps("/images/footer-orchid-mobile.png", "100vw")} alt="" aria-hidden="true" loading="lazy" decoding="async" />
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
