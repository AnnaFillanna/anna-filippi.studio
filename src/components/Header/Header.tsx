import { useRef, useState } from "react";
import styles from "./Header.module.scss";
import { motion } from "motion/react";
import { useMagnetic } from "../../hooks/useMagnetic";

export default function Header({ contactHref = '#kontakt' }: { contactHref?: string }) {
  const magnetic = useMagnetic();
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);

  return (
    <header className={styles.header} onKeyDown={(event) => { if (event.key === "Escape") { setOpen(false); toggle.current?.focus(); } }}>
      <a
        href="/#start"
        className={styles.monogram}
        aria-label="Anna Filippi – Startseite"
      >
        A<span>F</span>
      </a>

      <button
        type="button"
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
        <a href="/projekte" onClick={() => setOpen(false)}>
          Webentwicklung
        </a>

        <a href="/fotografie" onClick={() => setOpen(false)}>
          Produktfotografie
        </a>

        <a href="/ueber-mich" onClick={() => setOpen(false)}>Über mich</a>
        <a href={contactHref} onClick={() => setOpen(false)}>Kontakt</a>
      </nav>
      <motion.a {...magnetic} href={contactHref} className={styles.startProject} onClick={() => setOpen(false)}>PROJEKT STARTEN</motion.a>
    </header>
  );
}
