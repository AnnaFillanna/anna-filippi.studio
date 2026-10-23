import { useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import styles from "./Hero.module.scss";
export default function Hero() {
  const section = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const intro = (delay: number) => ({
    initial: reduced ? false : { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1.1, delay, ease: [0.22, 1, 0.36, 1] as const },
  });
  return (
    <section
      id="start"
      ref={section}
      className={styles.hero}
      aria-labelledby="hero-title"
    >
      <div className={styles.portrait}>
        <img
          src="/images/hero-reference.png"
          alt="Anna Filippi im Profil, mit wehendem blondem Haar und bordeauxrotem Stoff, nach links blickend."
          width="1675"
          height="939"
          fetchPriority="high"
        />
      </div>
      <div className={styles.fabricExtension} aria-hidden="true">
        <img src="/images/hero-fabric-extension.png" alt="" width="2172" height="724" />
      </div>
      <div className={styles.copy}>
        <motion.p {...intro(0.1)} className={styles.eyebrow}>
          DIGITAL ATELIER
        </motion.p>
        <div className={styles.titleGroup}>
        <motion.h1 id="hero-title"
          initial={reduced ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}>
          ANNA FILIPPI
        </motion.h1>
        <motion.h2 {...intro(0.25)} className={styles.headline}>
          <span className={styles.service}><svg viewBox="0 0 36 36" aria-hidden="true"><rect x="4" y="6" width="28" height="21" rx="1"/><path d="M1 31h34"/></svg><span>Software</span></span>
          <span className={styles.separator} aria-hidden="true">·</span>
          <span className={styles.service}><svg viewBox="0 0 36 36" aria-hidden="true"><circle cx="18" cy="18" r="14"/><ellipse cx="18" cy="18" rx="6" ry="14"/><path d="M4 18h28"/></svg><span>Websites</span></span>
          <span className={styles.separator} aria-hidden="true">·</span>
          <span className={styles.service}><svg viewBox="0 0 36 36" aria-hidden="true"><path d="M5 10h6l3-4h8l3 4h6v21H5z"/><circle cx="18" cy="20" r="6"/></svg><span>Produktfotografie</span></span>
        </motion.h2>
        </div>
        <motion.p {...intro(0.4)} className={styles.description}>
          <span className={styles.mobileDescription}>Ich entwickle individuelle Software und Websites und fotografiere deine Produkte. Drei Schwerpunkte – persönlich mit dir umgesetzt.</span>
          <span className={styles.desktopDescription}>Ich entwickle individuelle Software und Websites<br />und fotografiere Produkte für starke Markenauftritte.<br />Drei Schwerpunkte – persönlich und mit Liebe zum Detail umgesetzt.</span>
        </motion.p>
        <motion.div {...intro(0.55)} className={styles.actions}>
          <a href="#leistungen" className={styles.servicesLink}>Leistungen ansehen<span className={styles.arrow} aria-hidden="true">→</span></a>
          <a href="#kontakt" className={styles.projectLink}>Projekt anfragen<span className={styles.arrow} aria-hidden="true">→</span></a>
        </motion.div>
      </div>
      <motion.a {...intro(0.65)} href="#leistungen" className={styles.scroll}>
        SCROLL
        <span className={styles.srOnly}> zu den Leistungen</span>
      </motion.a>
      <p className={styles.location}>MIT KI GENERIERT</p>
      <p className={styles.aiCredit}>MIT KI GENERIERT</p>
    </section>
  );
}
