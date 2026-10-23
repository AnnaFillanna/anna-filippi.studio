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
          src="/images/hero-atelier.png"
          alt="Anna Filippi im schwarzen Blazer mit einem Laptop."
          width="1672"
          height="941"
          fetchPriority="high"
        />
      </div>
      <svg className={styles.curve} viewBox="0 0 1280 720" preserveAspectRatio="none" aria-hidden="true"><path d="M-20 515 C70 700 290 665 455 730 M1000 460 C1080 365 1160 325 1300 290" /></svg>
      <div className={styles.copy}>
        <motion.p {...intro(0.1)} className={styles.eyebrow}>
          DIGITAL ATELIER
        </motion.p>
        <div className={styles.titleGroup}>
        <motion.h1 id="hero-title"
          initial={reduced ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}>
          <span>ANNA</span><span>FILIPPI</span>
        </motion.h1>
        <motion.h2 {...intro(0.25)} className={styles.headline}>
          <span className={styles.service}><svg viewBox="0 0 36 36" aria-hidden="true"><rect x="4" y="6" width="28" height="21" rx="1"/><path d="M1 31h34"/></svg><span>Software<br />entwicklung</span></span>
          <span className={styles.separator} aria-hidden="true">·</span>
          <span className={styles.service}><svg viewBox="0 0 36 36" aria-hidden="true"><circle cx="18" cy="18" r="14"/><ellipse cx="18" cy="18" rx="6" ry="14"/><path d="M4 18h28"/></svg><span>Webseiten</span></span>
          <span className={styles.separator} aria-hidden="true">·</span>
          <span className={styles.service}><svg viewBox="0 0 36 36" aria-hidden="true"><path d="M5 10h6l3-4h8l3 4h6v21H5z"/><circle cx="18" cy="20" r="6"/></svg><span>Produktfotografie</span></span>
        </motion.h2>
        </div>
        <motion.p {...intro(0.4)} className={styles.description}>
          Ich entwickle individuelle Software und Webseiten<br className={styles.desktopBreak} /> und fotografiere Produkte für starke Markenauftritte.<br className={styles.desktopBreak} /> Persönlich. Kreativ. Mit Liebe zum Detail.
        </motion.p>
        <motion.div {...intro(0.55)} className={styles.actions}>
          <a href="#leistungen" className={styles.servicesLink}>Leistungen ansehen<span className={styles.arrow} aria-hidden="true">→</span></a>
          <a href="#kontakt" className={styles.projectLink}>Projekt anfragen<span className={styles.arrow} aria-hidden="true">→</span></a>
        </motion.div>
      </div>
      <p className={styles.aiCredit}>Bildhintergrund mit KI gestaltet</p>
    </section>
  );
}
