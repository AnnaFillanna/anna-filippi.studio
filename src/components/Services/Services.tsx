import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import styles from './Services.module.scss';

const services = [
  { title: 'WEB', subtitle: 'Ideen werden Erlebnisse.', text: 'Websites, Web-Applikationen und KI-Integrationen.', detail: 'Klar im Design. Durchdacht in der Funktion.' },
  { title: 'FOTO', subtitle: 'Perspektiven werden Geschichten.', text: 'Produktfotografie, visuelles Storytelling und Markenästhetik.', detail: 'Ein Gespür für Licht, Material und Atmosphäre.' },
] as const;

export default function Services() {
  const reduced = useReducedMotion();
  const [desktop, setDesktop] = useState(() => window.matchMedia('(min-width: 761px)').matches);
  useEffect(() => {
    const query = window.matchMedia('(min-width: 761px)');
    const update = () => setDesktop(query.matches);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  return (
    <section id="leistungen" className={styles.services} aria-labelledby="services-title">
      <div className={styles.intro}>
        <p className={styles.eyebrow}>DAS ATELIER / LEISTUNGEN</p>
        <h2 id="services-title">
          {['Zwei Perspektiven', 'Eine Handschrift'].map((line, index) => <motion.span key={line} className={styles.headingLine}
            initial={reduced ? false : { clipPath: 'inset(-15% 100% -15% 0)', opacity: 0 }}
            whileInView={{ clipPath: 'inset(-15% -4% -15% 0)', opacity: 1 }}
            viewport={{ once: true, amount: .7 }}
            transition={{ duration: reduced ? 0 : 1, delay: reduced ? 0 : index * .65, ease: [.22, 1, .36, 1] }}
          >{index ? <em>{line}</em> : line}</motion.span>)}
        </h2>
      </div>
      <div className={styles.columns}>
        {services.map((service, index) => (
          <motion.article key={service.title} className={styles.service} initial={reduced ? false : { opacity: 0, x: desktop ? (index === 0 ? -70 : 70) : 0, y: desktop ? 0 : 18 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }} viewport={{ once: true, amount: .2 }}
            transition={{ duration: reduced ? 0 : 1.1, ease: [.22, 1, .36, 1] }} aria-labelledby={`title-${service.title.toLowerCase()}`}>
            <h3 id={`title-${service.title.toLowerCase()}`}>{service.title}</h3>
            <p className={styles.subtitle}>{service.subtitle}</p>
            <p className={styles.description}>{service.text}</p>
            <p className={styles.detail}>{service.detail}</p>
            {service.title === 'FOTO' ? <a className={styles.galleryLink} href="#fotografie">FOTOGRAFIEN ENTDECKEN</a> : <a className={styles.galleryLink} href="#projekte">PROJEKTE ENTDECKEN</a>}
          </motion.article>
        ))}
      </div>
    </section>
  );
}
