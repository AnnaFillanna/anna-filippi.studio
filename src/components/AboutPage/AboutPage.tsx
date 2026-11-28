import { imageProps } from "../../data/responsiveImage";
import { motion, useReducedMotion } from 'motion/react';
import { Link } from 'react-router';
import ExpertiseMap from '../ExpertiseMap/ExpertiseMap';
import styles from './AboutPage.module.scss';

const expertiseAreas = ['Technical SEO', 'Automation', 'Web Analytics', 'AEO & GEO', 'E-Commerce', 'KI-Integration', 'Markt- & Wettbewerbsanalyse'];

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
        <div className={styles.intro}>
          <p className={styles.eyebrow}>ANNA FILIPPI / PERSÖNLICH</p>
          <h1 id="about-page-title" tabIndex={-1}>Hallo, ich bin Anna.</h1>
          <div className={styles.text}>
            <p><strong>Technologie, Business und Kreativität</strong> – drei Bereiche, die mich begeistern und die ich miteinander verbinde.</p>
          </div>
        </div>
        <motion.div className={styles.portrait} {...reveal(30)}>
          <img {...imageProps("/images/about-anna-red.jpg", "(max-width: 1024px) min(86vw, 440px), 464px")} alt="Anna Filippi in einem roten Kleid vor einer hellen Wand" fetchPriority="high" decoding="async" />
          <ExpertiseMap title="Meine fachlichen Schwerpunkte" center="Full-Stack Webentwicklung" areas={expertiseAreas} />
        </motion.div>
        <motion.div className={styles.copy} {...reveal(-30)}>
          <div className={styles.text}>
            <p>Mein beruflicher Weg begann an einer Fachoberschule mit dem Schwerpunkt <strong>Technik und Elektronik</strong>. Nach einer Familienphase, in der ich mich meinen Kindern widmete, absolvierte ich eine Ausbildung zur Verkäuferin.</p>
            <p>Durch ein sechsmonatiges Praktikum im Bereich <strong>E-Commerce und Fulfillment</strong> sowie meinen eigenen Shopify-Onlineshop <strong>FILLANNA</strong> sammelte ich praktische und unternehmerische Erfahrungen im Onlinehandel. Aktuell arbeite ich am Relaunch meines Shops.</p>
            <p>Seit Februar 2026 absolviere ich eine Weiterbildung zur <strong>Full-Stack-Webentwicklerin</strong> und parallel eine zehnmonatige Weiterbildung zur E-Commerce-Managerin mit angestrebtem IHK-Zertifikat. Ergänzend habe ich Zertifikate der HubSpot Academy erworben und beschäftige mich mit <strong>SEO, GEO und AEO</strong>.</p>
            <p>Mein Ziel ist es, Technologie und unternehmerisches Denken miteinander zu verbinden, die Herausforderungen von Unternehmen zu verstehen und passende digitale Lösungen zu entwickeln. Dafür steht Anna Filippi Studio.</p>
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
        <section className={styles.approach}>
          <h2>So arbeite ich</h2>
          <div className={styles.text}>
            <p>Mir ist der <strong>persönliche Kontakt</strong> wichtig. Ich möchte wissen, was du mit deiner Webseite erreichen möchtest, bevor ich mit der Entwicklung beginne.</p>
            <p>Du musst dich dabei nicht mit technischen Details auskennen. Ich erkläre dir, welche Möglichkeiten es gibt und welche davon für dein Unternehmen sinnvoll sind.</p>
          </div>
        </section>
        <div className={styles.details}>
          <section id="qualifikationen" className={styles.qualifications}>
            <h2>Ausbildung &amp; Qualifikationen</h2>
            <div className={styles.qualificationGroups}>
              <section>
                <h3>Ausbildung &amp; praktische Erfahrung</h3>
                <ul>
                  <li>Fachoberschule – Technik und Elektronik</li>
                  <li>Abgeschlossene Ausbildung zur Verkäuferin</li>
                  <li>Sechsmonatiges Praktikum – E-Commerce &amp; Fulfillment</li>
                  <li>Eigenes E-Commerce-Projekt FILLANNA – Shopify, aktuell im Relaunch</li>
                </ul>
              </section>
              <section>
                <h3>Aktuelle Weiterbildungen</h3>
                <p className={styles.status}>In Weiterbildung</p>
                <ul>
                  <li>
                    <strong>Full-Stack-Webentwicklung</strong>
                    <span>2026–2027 · 20 Monate</span>
                    <span>Abschlussziel: internationales Zertifikat</span>
                  </li>
                  <li>E-Commerce Management (10 Monate; IHK-Zertifikat als Abschlussziel)</li>
                </ul>
              </section>
              <section>
                <h3>Zertifikate &amp; ergänzende Kenntnisse</h3>
                {/* Bestätigte Zertifikate können hier mit Titel und öffentlichem Nachweis ergänzt werden. */}
                <ul>
                  <li>Digitales Marketing, SEO, GEO und AEO</li>
                </ul>
              </section>
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
