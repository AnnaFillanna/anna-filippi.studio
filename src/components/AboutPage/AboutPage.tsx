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
      <Link to="/#start" className={styles.back}>ZURÜCK ZUM ATELIER</Link>
      <div className={styles.layout}>
        <motion.div className={styles.copy} {...reveal(-30)}>
          <p className={styles.eyebrow}>ANNA FILIPPI / PERSÖNLICH</p>
          <h1 id="about-page-title" tabIndex={-1}>Über mich</h1>
          <p className={styles.greeting}>Hallo, ich bin Anna.</p>
          <div className={styles.text}>
            <p>Ich entwickle moderne Websites und digitale Lösungen mit Liebe zum Detail, einem klaren Blick für Ästhetik und Begeisterung für neue Technologien.</p>
            <p>Besonders faszinieren mich die Möglichkeiten der künstlichen Intelligenz und die Verbindung von Design und Funktionalität.</p>
            <p>Neben der Webentwicklung widme ich mich mit Leidenschaft der Schmuckfotografie. Was als Hobby begann, ist für mich eine kreative Möglichkeit, besondere Details, Licht und Ästhetik in Bildern festzuhalten.</p>
          </div>
          <p className={styles.signature}>Anna Filippi — Webentwicklung, digitale Ideen <span className={styles.ampersand}>&amp;</span> Fotografie aus Leidenschaft.</p>
        </motion.div>
        <motion.div className={styles.portrait} {...reveal(30)}>
          <img src="/images/about-anna-red.jpg" alt="Anna Filippi in einem roten Kleid vor einer hellen Wand" width="993" height="1600" fetchPriority="high" />
        </motion.div>
      </div>
    </section>
  );
}
