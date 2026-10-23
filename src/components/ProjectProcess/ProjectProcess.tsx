import { motion, useReducedMotion } from 'motion/react';
import styles from './ProjectProcess.module.scss';
import { googleReviewHref } from '../../config/reviews';

const steps = [
  ['Beratung', 'Wir klären deine Idee, deine Ziele und den passenden Umfang.'],
  ['Konzeption', 'Struktur, Funktionen und Gestaltung bekommen eine klare Richtung.'],
  ['Entwicklung', 'Ich entwickle deine Website – responsiv und sorgfältig umgesetzt.'],
  ['Prüfung', 'Wir testen gemeinsam, stimmen Details ab und veröffentlichen deine Website.'],
  ['Betreuung', 'Auch nach dem Start begleite ich dich nach Absprache weiter.'],
] as const;

const lineVariants = { hidden: { pathLength: 0, opacity: 0 }, visible: { pathLength: 1, opacity: 1 } };
const arrowVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };

export default function ProjectProcess() {
  const reduced = useReducedMotion();
  const reviewHref = googleReviewHref();
  return (
    <section id="projektablauf" className={styles.process} aria-labelledby="process-title">
      <p className={styles.eyebrow}>Ablauf</p>
      <h2 id="process-title">Von der Idee<br />bis zum <em>ersten Klick.</em></h2>
      <p className={styles.intro}>Fünf Schritte. Ein persönlicher Weg zu deiner Website.</p>
      <motion.div className={styles.timeline}
        initial={reduced ? 'visible' : 'hidden'}
        whileInView="visible" viewport={{ once: true, amount: .15 }}>
        <svg className={styles.horizontalPath} viewBox="0 0 1200 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
          <motion.path d="M 8 58 C 70 58 105 20 180 35 S 300 85 345 55 C 385 27 350 12 332 30 C 310 55 400 76 470 51 S 595 20 665 47 C 720 72 755 78 785 53 C 815 27 780 15 770 35 C 755 66 870 75 935 46 S 1080 26 1190 51"
            variants={lineVariants} transition={{ duration: reduced ? 0 : 4.6, ease: 'easeInOut' }} />
          <motion.path d="M 1184 46 L 1190 51 L 1182 54" variants={arrowVariants}
            transition={{ duration: reduced ? 0 : .25, delay: reduced ? 0 : 4.6 }} />
        </svg>
        <svg className={styles.verticalPath} viewBox="0 0 44 1000" preserveAspectRatio="none" aria-hidden="true" focusable="false">
          <motion.path d="M 20 5 C 4 70 36 115 22 180 S 7 270 23 310 C 42 352 39 282 23 305 C 5 330 9 390 23 445 S 38 550 21 600 C 3 650 5 695 22 715 C 40 742 38 680 22 706 C 6 735 10 805 23 850 S 34 940 22 992"
            variants={lineVariants} transition={{ duration: reduced ? 0 : 4.6, ease: 'easeInOut' }} />
          <motion.path d="M 18 985 L 22 992 L 27 986" variants={arrowVariants}
            transition={{ duration: reduced ? 0 : .25, delay: reduced ? 0 : 4.6 }} />
        </svg>
      <ol className={styles.steps}>
        {steps.map(([title, text], index) => (
          <li key={title} className={styles.step}>
            <span className={styles.number} aria-hidden="true">0{index + 1}</span>
            <h3>{title}</h3>
            <p>{text}</p>
          </li>
        ))}
      </ol>
      </motion.div>
      {reviewHref && (
        <section className={styles.pricing} aria-labelledby="review-title">
          <h2 id="review-title">Deine Erfahrung ist mir wichtig.</h2>
          <p>Ich freue mich über deine ehrliche Bewertung auf Google.</p>
          <a href={reviewHref} target="_blank" rel="noopener noreferrer"
            aria-label="Bewertung auf Google schreiben (neuer Tab)">
            Bewertung auf Google schreiben
          </a>
        </section>
      )}
    </section>
  );
}
