import { motion, useReducedMotion } from 'motion/react';
import styles from './ProjectProcess.module.scss';

const steps = [
  ['Beratung', 'Wir sprechen über deine Idee, deine Wünsche und die Ziele deines Projekts.'],
  ['Konzeption', 'Gemeinsam legen wir die Struktur, die Funktionen und die visuelle Richtung fest.'],
  ['Entwicklung', 'Ich setze deine Website technisch um und achte auf responsives Design, Performance und eine saubere Umsetzung.'],
  ['Veröffentlichung', 'Nach der gemeinsamen Prüfung unterstütze ich dich beim Launch, der Domain-Anbindung und der Veröffentlichung.'],
  ['Betreuung', 'Auch nach dem Launch sind Anpassungen, Erweiterungen und technische Unterstützung nach Absprache möglich.'],
] as const;

export default function ProjectProcess() {
  const reduced = useReducedMotion();
  return (
    <section id="projektablauf" className={styles.process} aria-labelledby="process-title">
      <h2 id="process-title">Von der Idee bis zur fertigen Website</h2>
      <p className={styles.intro}>Ein klarer Ablauf, persönliche Zusammenarbeit und eine digitale Lösung, die zu dir und deinem Unternehmen passt.</p>
      <ol className={styles.steps}>
        {steps.map(([title, text], index) => (
          <motion.li key={title} className={styles.step}
            initial={reduced ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .2 }}
            transition={{ duration: reduced ? 0 : .6, delay: reduced ? 0 : index * .06 }}>
            <span className={styles.number} aria-hidden="true">0{index + 1}</span>
            <h3>{title}</h3>
            <p>{text}</p>
          </motion.li>
        ))}
      </ol>
      <a className={styles.link} href="#kontakt">LASS UNS ÜBER DEINE IDEE SPRECHEN</a>
    </section>
  );
}
