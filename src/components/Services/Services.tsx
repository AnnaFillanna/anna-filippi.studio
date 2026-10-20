import { motion, useReducedMotion } from 'motion/react';
import styles from './Services.module.scss';

const services = [
  { title: 'Webentwicklung & Redesign', text: 'Eine individuelle Website oder ein Redesign, das zu dir passt – von der technischen Umsetzung bis zur Veröffentlichung.' },
  { title: 'Softwareentwicklung', text: 'Individuelle Software und Web-Apps für Smartphone, Laptop und Tablet – von der Idee bis zur technischen Umsetzung. Geräteübergreifende App-Projekte sind in Planung.' },
  { title: 'KI-Integration & Automatisierung', text: 'Intelligente Chatbots, digitale Assistenten, KI-Agenten und automatisierte Geschäftsprozesse.' },
  { title: 'E-Commerce', text: 'Shopify-Shops, individuelle Shop-Anpassungen und Optimierung bestehender Onlineshops.' },
  { title: 'Optimierung & Betreuung', text: 'Technisches SEO, Performance-Optimierung, Wartung und Weiterentwicklung bestehender Websites.' },
  { title: 'Produktfotografie', text: 'Ästhetische Schmuck- und Produktfotografie mit einem besonderen Gespür für Licht, Details und Bildkomposition.' },
] as const;

export default function Services() {
  const reduced = useReducedMotion();
  return (
    <section id="leistungen" className={styles.services} aria-labelledby="services-title">
      <motion.div className={styles.intro}
        initial={reduced ? false : { opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .15 }}
        transition={{ duration: reduced ? 0 : .9 }}>
        <p className={styles.eyebrow}>DAS ATELIER / LEISTUNGEN</p>
        <h2 id="services-title">Meine Leistungen</h2>
        <p className={styles.subtitle}>Digitale Ideen. Individuelle Lösungen.</p>
      </motion.div>
      <ul className={styles.list}>
        {services.map((service, index) => (
          <motion.li key={service.title} className={styles.service}
            initial={reduced ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .15 }}
            transition={{ duration: reduced ? 0 : .85, delay: reduced ? 0 : index % 2 * .08 }}>
            <h3 id={index === 0 ? 'title-web' : index === 5 ? 'title-foto' : undefined}>{service.title}</h3>
            <p className={styles.description}>{service.text}</p>
            {index === 0 && <>
              <ul className={styles.webScope}>
                <li>Passende Darstellung auf Smartphone, Tablet und Desktop</li>
                <li>Kontaktformulare und gewünschte Funktionen</li>
                <li>Technische Grundlagen für Suchmaschinenoptimierung (SEO)</li>
                <li>Domain-Anbindung und Veröffentlichung (Deployment)</li>
                <li>Erweiterungen und Anpassungen nach Absprache</li>
              </ul>
              <p className={styles.scopeNote}>Den konkreten Leistungsumfang vereinbaren wir individuell.</p>
            </>}
            {index === 0 && <a className={styles.galleryLink} href="/projekte">PROJEKTE ENTDECKEN</a>}
            {index === 1 && <a className={styles.galleryLink} href="/softwareentwicklung">PROJEKTE ENTDECKEN</a>}
            {index === 5 && <a className={styles.galleryLink} href="/fotografie">FOTOGRAFIEN ENTDECKEN</a>}
          </motion.li>
        ))}
      </ul>
    </section>
  );
}
