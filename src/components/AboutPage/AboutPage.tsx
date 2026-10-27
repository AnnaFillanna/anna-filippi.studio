import { motion, useReducedMotion } from 'motion/react';
import { Link } from 'react-router';
import styles from './AboutPage.module.scss';

export default function AboutPage() {
  const reduced = useReducedMotion();
  const reveal = (x: number) => ({
    initial: reduced ? false as const : { opacity: 0, x },
    whileInView: { opacity: 1, x: 0 },
    viewport: { once: true, amount: .12 },
    transition: { duration: reduced ? 0 : 1, ease: [.22, 1, .36, 1] as const },
  });
  return (
    <section className={styles.aboutPage} aria-labelledby="about-page-title">
      <span className="sunlight" aria-hidden="true" />
      <Link to="/#start" className={styles.back}>ZURÜCK ZUM ATELIER</Link>
      <div className={styles.layout}>
        <motion.div className={styles.copy} {...reveal(-30)}>
          <p className={styles.eyebrow}>ANNA FILIPPI / PERSÖNLICH</p>
          <h1 id="about-page-title" tabIndex={-1}>Über mich</h1>
          <p className={styles.greeting}>Hallo, ich bin Anna.</p>
          <div className={styles.text}>
            <p>Meine drei Schwerpunkte sind Softwareentwicklung, Webentwicklung und Produktfotografie. Ich entwickle individuelle Anwendungen und Websites und setze Produkte fotografisch in Szene – mit Liebe zum Detail und einem klaren Blick für Ästhetik.</p>
            <p>Besonders faszinieren mich die Möglichkeiten der künstlichen Intelligenz und die Verbindung von Design und Funktionalität.</p>
            <p>Neben der <strong>Webentwicklung</strong> widme ich mich mit Leidenschaft der <strong>Schmuckfotografie</strong>. Was als Hobby begann, ist für mich eine kreative Möglichkeit, besondere Details, Licht und Ästhetik in Bildern festzuhalten.</p>
          </div>
          <ul className={styles.values} aria-label="Was meine Arbeit ausmacht">
            <li>
              <svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><circle cx="16" cy="9" r="5" /><path d="M6 28c0-7 4-11 10-11s10 4 10 11" /></svg>
              <h2>Persönlich</h2><p>Direkter Kontakt</p>
            </li>
            <li>
              <svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="m10 9-6 7 6 7m12-14 6 7-6 7m-4-17-4 20" /></svg>
              <h2>Individuell</h2><p>Passende Lösungen</p>
            </li>
            <li>
              <svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M16 28 5 17C-2 8 10 2 16 11 22 2 34 8 27 17Z" /></svg>
              <h2>Mit Liebe</h2><p>Zum Detail</p>
            </li>
          </ul>
        </motion.div>
        <motion.div className={styles.portrait} {...reveal(30)}>
          <img src="/images/about-anna-red.jpg" alt="Anna Filippi in einem roten Kleid vor einer hellen Wand" width="993" height="1600" fetchPriority="high" />
        </motion.div>
      </div>
      <motion.div className={styles.portraitDivider} aria-hidden="true"
        initial={reduced ? false : { scaleX: 0 }} whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 1 }} transition={{ duration: reduced ? 0 : 1.4, ease: [.22, 1, .36, 1] }} />
    </section>
  );
}
