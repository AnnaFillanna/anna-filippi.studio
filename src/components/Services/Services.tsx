import { motion } from 'motion/react';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import type { InfoTopic } from '../../App';
import styles from './Services.module.scss';

const services = [
  { title: 'WEB', subtitle: 'Ideen werden Erlebnisse.', text: 'Websites, Web-Applikationen und KI-Integrationen.', detail: 'Klar im Design. Durchdacht in der Funktion.' },
  { title: 'FOTO', subtitle: 'Perspektiven werden Geschichten.', text: 'Produktfotografie, visuelles Storytelling und Markenästhetik.', detail: 'Ein Gespür für Licht, Material und Atmosphäre.' },
] as const;

export default function Services({ onInfo }: { onInfo: (topic: InfoTopic) => void }) {
  const reveal = useScrollReveal();
  return (
    <section id="leistungen" className={styles.services} aria-labelledby="services-title">
      <motion.div {...reveal} className={styles.intro}>
        <p className={styles.eyebrow}>DAS ATELIER / LEISTUNGEN</p>
        <h2 id="services-title">Zwei Perspektiven.<br /><em>Eine Handschrift.</em></h2>
      </motion.div>
      <div className={styles.columns}>
        {services.map((service, index) => (
          <motion.article key={service.title} className={styles.service} {...reveal} transition={{ ...reveal.transition, delay: reveal.transition.duration === 0 ? 0 : index * .1 }} aria-labelledby={`title-${service.title.toLowerCase()}`}>
            <h3 id={`title-${service.title.toLowerCase()}`}>{service.title}<span>.</span></h3>
            <p className={styles.subtitle}>{service.subtitle}</p>
            <p className={styles.description}>{service.text}</p>
            <p className={styles.detail}>{service.detail}</p>
            {service.title === 'FOTO' ? <a className={styles.galleryLink} href="#fotografie">FOTOGRAFIEN ENTDECKEN</a> : <button type="button" onClick={() => onInfo(service.title)} aria-label={`Mehr erfahren über ${service.title}`}>MEHR ERFAHREN</button>}
          </motion.article>
        ))}
      </div>
    </section>
  );
}
