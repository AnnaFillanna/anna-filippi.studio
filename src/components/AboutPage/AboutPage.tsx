import { imageProps } from "../../data/responsiveImage";
import { motion, useReducedMotion } from 'motion/react';
import { Link } from 'react-router';
import ExpertiseMap from '../ExpertiseMap/ExpertiseMap';
import styles from './AboutPage.module.scss';

const expertiseAreas = ['Technical SEO', 'Automation', 'Analytics', 'AEO & GEO', 'E-Commerce', 'KI-Integration'];

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
          <h1 id="about-page-title" tabIndex={-1}>Hallo, ich bin Anna.</h1>
          <div className={styles.text}>
            <p>Ich komme aus <strong>Andernach</strong> und entwickle Webseiten für <strong>Selbstständige sowie kleine und mittlere Unternehmen</strong>.</p>
            <p>Mir gefällt die Verbindung von <strong>Gestaltung und Technik</strong>. Ich möchte verstehen, wie ein Unternehmen funktioniert, was seine Kunden brauchen und wie ich das auf einer Webseite sinnvoll umsetzen kann.</p>
            <p>Dabei geht es mir nicht nur um das Aussehen. Eine Webseite soll <strong>schnell laden, einfach zu bedienen sein</strong> und vor allem zum Unternehmen passen.</p>
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
          <img {...imageProps("/images/about-anna-red.jpg", "(max-width: 760px) min(86vw, 440px), 460px")} alt="Anna Filippi in einem roten Kleid vor einer hellen Wand" fetchPriority="high" decoding="async" />
          <ExpertiseMap title="Meine fachlichen Schwerpunkte" center="Full-Stack Webentwicklung" areas={expertiseAreas} />
        </motion.div>
        <section className={styles.journey}>
          <h2>Mein Weg zur Webentwicklung</h2>
          <div className={styles.text}>
            <p>Mein Interesse an Technik begann bereits während meiner Schulzeit. Ich absolvierte die <strong>Fachoberschule im Bereich Technik und Elektronik</strong>.</p>
            <p>Nach einer längeren Familienpause, in der ich mich meinen Kindern widmete, entschied ich mich für eine Ausbildung zur Verkäuferin. Durch meine Arbeit im Verkauf und meine eigenen Erfahrungen im E-Commerce habe ich gelernt, Kundenbedürfnisse zu verstehen und unternehmerisch zu denken.</p>
            <p>Mit der Zeit zog es mich wieder in Richtung Technik. Heute beschäftige ich mich intensiv mit Webentwicklung und absolviere eine <strong>Weiterbildung zur Full-Stack-Entwicklerin</strong>.</p>
            <p>Neben der Entwicklung eigener Projekte interessiere ich mich besonders für <strong>Suchmaschinenoptimierung, künstliche Intelligenz und die Automatisierung digitaler Prozesse</strong>.</p>
            <p>Was ich lerne, setze ich gerne direkt in meinen Projekten um.</p>
          </div>
        </section>
        <section className={styles.approach}>
          <h2>So arbeite ich</h2>
          <div className={styles.text}>
            <p>Mir ist der <strong>persönliche Kontakt</strong> wichtig. Ich möchte wissen, was du mit deiner Webseite erreichen möchtest, bevor ich mit der Entwicklung beginne.</p>
            <p>Du musst dich dabei nicht mit technischen Details auskennen. Ich erkläre dir, welche Möglichkeiten es gibt und welche davon für dein Unternehmen sinnvoll sind.</p>
          </div>
        </section>
        <div className={styles.details}>
          <section>
            <h2>Weiterbildung &amp; Zertifikate</h2>
            <div className={styles.text}>
              <p>Neben der <strong>Webentwicklung</strong> bilde ich mich in den Bereichen <strong>digitales Marketing</strong>, <strong>Suchmaschinenoptimierung</strong> und <strong>E-Commerce</strong> weiter.</p>
              <p>Meine abgeschlossenen Zertifizierungen und aktuellen Weiterbildungen findest du hier im Überblick.</p>
            </div>
          </section>
          <section>
            <h2>Lass uns über deine Idee sprechen.</h2>
            <div className={styles.text}>
              <p>Ob du eine neue Webseite brauchst oder deine bestehende verbessern möchtest – schreib mir einfach. Ich freue mich, von dir zu hören.</p>
            </div>
            <Link className={styles.back} to="/kontakt">Kontakt aufnehmen</Link>
          </section>
        </div>
      </div>
      <motion.div className={styles.portraitDivider} aria-hidden="true"
        initial={reduced ? false : { scaleX: 0 }} whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 1 }} transition={{ duration: reduced ? 0 : 1.4, ease: [.22, 1, .36, 1] }} />
    </section>
  );
}
