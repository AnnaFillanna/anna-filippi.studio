import { useRef, useState } from "react";
import styles from "./Header.module.scss";

export default function Header() {
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);

  return (
    <header data-site-header className={`${styles.header} ${styles.atelier}`} onKeyDown={(event) => { if (event.key === "Escape") { setOpen(false); toggle.current?.focus(); } }}>
      <a
        href="/#start"
        className={styles.monogram}
        aria-label="Anna Filippi – Startseite"
      >
        A<span>F</span>
      </a>

      <button
        type="button"
        data-menu-toggle
        className={styles.menuToggle}
        ref={toggle}
        aria-controls="hauptnavigation"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        {open ? "SCHLIESSEN −" : "MENÜ +"}
      </button>

      <nav
        id="hauptnavigation"
        aria-label="Hauptnavigation"
        className={`${styles.nav} ${open ? styles.open : ""}`}
      >
        <a href="/softwareentwicklung" onClick={() => setOpen(false)}>Softwareentwicklung</a>
        <a href="/projekte" onClick={() => setOpen(false)}>
          Projekte
        </a>

        <a href="/#leistungen" onClick={() => setOpen(false)}>
          Leistungen
        </a>

        <a href="/ueber-mich" onClick={() => setOpen(false)}>Über mich</a>
        <a href="/insights" onClick={() => setOpen(false)}>Insights</a>
        <a href="/kontakt" onClick={() => setOpen(false)}>Kontakt</a>
      </nav>
    </header>
  );
}
