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
          src="/images/anna-laptop-original.jpg"
          alt="Anna Filippi im schwarzen Blazer mit einem Laptop."
          width="853"
          height="1280"
          fetchPriority="high"
        />
      </div>
      <svg className={styles.curve} viewBox="0 0 1280 720" preserveAspectRatio="none" aria-hidden="true"><path d="M-20 515 C70 700 290 665 455 730 M1000 460 C1080 365 1160 325 1300 290" /></svg>
      <div className={styles.copy}>
        <motion.p {...intro(0.1)} className={styles.eyebrow}>
          ANNA FILIPPI STUDIO
        </motion.p>
        <div className={styles.titleGroup}>
        <motion.h1 id="hero-title"
          initial={reduced ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}>
          Websites, die dein Business voranbringen.
        </motion.h1>

        </div>
        <nav className={styles.mobileServices} aria-label="Leistungen im Überblick">
          <a href="/softwareentwicklung">SOFTWAREENTWICKLUNG<span aria-hidden="true">→</span></a>
          <a href="/projekte">WEBENTWICKLUNG<span aria-hidden="true">→</span></a>
          <a href="/fotografie">PRODUKTFOTOGRAFIE<span aria-hidden="true">→</span></a>
        </nav>
        <motion.p {...intro(0.4)} className={styles.description}>
          Individuelles Webdesign &amp; Webentwicklung aus Andernach bei Koblenz. Für Selbstständige und Unternehmen, die online professionell überzeugen möchten.
        </motion.p>
        <motion.div {...intro(0.55)} className={styles.actions}>
          <a href="/kontakt" className={styles.servicesLink}>Website anfragen<span className={styles.arrow} aria-hidden="true">→</span></a>
          <a href="/projekte" className={styles.projectLink}>Projekte ansehen<span className={styles.arrow} aria-hidden="true">→</span></a>
        </motion.div>
      </div>
    </section>
  );
}
