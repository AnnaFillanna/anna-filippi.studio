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
            <p>Ich liebe es, kreative Ideen mit Technologie zu verbinden. Für mich ist eine Website mehr als Design und Code: Sie erzählt deine Geschichte, zeigt, was dich besonders macht, und verbindet dich mit den richtigen Menschen.</p>
            <p>Mir ist wichtig, dass du dich während unserer Zusammenarbeit wohlfühlst, deine Wünsche einbringen kannst und verstehst, was wir gemeinsam entwickeln. Von der ersten Idee bis zur fertigen Umsetzung hast du in mir eine direkte Ansprechpartnerin.</p>
            <p>Meine Schwerpunkte liegen in der Webentwicklung, Softwareentwicklung und Produktfotografie. Besonders faszinieren mich die Möglichkeiten künstlicher Intelligenz und die Verbindung von Ästhetik und Technologie.</p>
            <p>Auch die Fotografie gehört zu meiner kreativen Arbeit. Ich liebe es, mit Licht, Materialien und kleinen Details die Besonderheiten eines Produkts sichtbar zu machen.</p>
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
      <a className={styles.back} href="/kontakt">Erzähl mir von deiner Idee</a>
      <motion.div className={styles.portraitDivider} aria-hidden="true"
        initial={reduced ? false : { scaleX: 0 }} whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 1 }} transition={{ duration: reduced ? 0 : 1.4, ease: [.22, 1, .36, 1] }} />
    </section>
  );
}
