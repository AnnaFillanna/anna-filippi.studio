import { motion, useReducedMotion } from 'motion/react';
import type { InfoTopic } from '../../App';
import styles from './Services.module.scss';

const services = [
  { title: 'DIGITAL', number: '01', subtitle: 'Ideen werden Erlebnisse.', text: 'Websites, Web-Applikationen und KI-Integrationen.', detail: 'Klar im Design. Durchdacht in der Funktion.' },
  { title: 'VISUAL', number: '02', subtitle: 'Perspektiven werden Geschichten.', text: 'Produktfotografie, visuelles Storytelling und Markenästhetik.', detail: 'Ein Gespür für Licht, Material und Atmosphäre.' },
] as const;

export default function Services({ onInfo }: { onInfo: (topic: InfoTopic) => void }) {
  const reduced = useReducedMotion();
  return (
    <section id="leistungen" className={styles.services} aria-labelledby="services-title">
      <div className={styles.intro}>
        <p className={styles.eyebrow}>DAS ATELIER / LEISTUNGEN</p>
        <h2 id="services-title">Zwei Perspektiven.<br /><em>Eine Handschrift.</em></h2>
      </div>
      <div className={styles.columns}>
        {services.map((service, index) => (
          <motion.article key={service.title} className={styles.service} initial={reduced ? false : { opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .2 }} transition={{ duration: .8, delay: index * .12 }} aria-labelledby={`title-${service.title.toLowerCase()}`}>
            <span className={styles.number}>{service.number} /</span>
            <h3 id={`title-${service.title.toLowerCase()}`}>{service.title}<span>.</span></h3>
            <p className={styles.subtitle}>{service.subtitle}</p>
            <p className={styles.description}>{service.text}</p>
            <p className={styles.detail}>{service.detail}</p>
            <button type="button" onClick={() => onInfo(service.title)} aria-label={`Mehr erfahren über ${service.title}`}>MEHR ERFAHREN <span aria-hidden="true">↗</span></button>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
