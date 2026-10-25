import { motion, useReducedMotion } from 'motion/react';
import styles from './Services.module.scss';

const services = [
  { title: 'Webdesign & Webentwicklung', text: 'Webseiten, die professionell wirken, auf jedem Gerät überzeugen und Interessenten die Kontaktaufnahme erleichtern.', href: '/projekte', link: 'Webprojekte ansehen' },
  { title: 'Softwareentwicklung', text: 'Individuelle Anwendungen und smarte Automatisierungen, die Abläufe vereinfachen und Zeit sparen.', href: '/softwareentwicklung', link: 'Software & Projekt ansehen' },
  { title: 'KI & Automatisierung', text: 'KI-Agenten · Chatbots · Workflows' },
  { title: 'E-Commerce', text: 'Shopify · Online-Shops' },
  { title: 'SEO & Betreuung', text: 'Suchmaschinenoptimierung · Wartung' },
  { title: 'Produktfotografie', text: 'Hochwertige Produktbilder, die Details sichtbar machen und deine Marke stilvoll präsentieren.', href: '/fotografie', link: 'Fotografien ansehen' },
] as const;

export default function Services() {
  const reduced = useReducedMotion();
  return (
    <section id="leistungen" className={styles.services} aria-labelledby="services-title">
      <h2 id="services-title" className={styles.sectionLabel}>Meine Leistungen</h2>
      <p className={styles.serviceLead}>Was möchtest du umsetzen?</p>
      <ul className={styles.primaryList}>
        {services.map((service, index) => (
          <motion.li key={service.title} className={styles.primaryService}
            initial={reduced ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: .12 }}
            transition={{ duration: reduced ? 0 : .65, delay: reduced ? 0 : (index % 3) * .06, ease: [.22, 1, .36, 1] }}>
            <span className={styles.serviceNumber} aria-hidden="true">0{index + 1}</span>
            <h3>{service.title}</h3>
            <p className={styles.description}>{service.text}</p>
            {'href' in service && <a className={styles.galleryLink} href={service.href}>{service.link} <span aria-hidden="true">→</span></a>}
          </motion.li>
        ))}
      </ul>
      <motion.div className={styles.intro}
        initial={reduced ? false : { opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .15 }}
        transition={{ duration: reduced ? 0 : .9 }}>
      <div className={styles.pricing} aria-labelledby="pricing-title">
        <p className={styles.eyebrow}>Preisgestaltung</p>
        <h2 id="pricing-title">So individuell wie <em>dein Projekt.</em></h2>
        <p>Der Umfang richtet sich nach deinen Zielen und deinem Budget.
          Gemeinsam klären wir, was du wirklich brauchst – und was nicht.</p>
        <p className={styles.pricingNote}>Manchmal ist eine kleine, sorgfältig gestaltete Website genau richtig.</p>
      </div>
        <section className={styles.trust} aria-labelledby="trust-title">
          <p className={styles.eyebrow}>Warum mit mir arbeiten?</p>
          <h2 id="trust-title">Persönlich. Durchdacht. Individuell.</h2>
        <ul className={styles.benefits} aria-label="Unsere Zusammenarbeit">
          <li>
            <span className={styles.benefitIcon} aria-hidden="true">
              <svg viewBox="0 0 32 32" fill="none"><path d="M8 23C7 14 16 9 26 5c-2 10-6 20-16 19M6 28 22 10M11 22l1-7" /></svg>
            </span>
            <div><h3>Individuelle Lösungen</h3><p>Gestaltung und Funktionen richten sich nach deinem Vorhaben.</p></div>
          </li>
          <li>
            <span className={styles.benefitIcon} aria-hidden="true">
              <svg viewBox="0 0 32 32" fill="none"><path d="m13 4 6 0 1 4 3 2 4-1 3 5-3 3v3l1 3-5 3-3-2-3 1-2 3-5-2v-4l-2-2-4-1v-6l4-1 2-3 0-3Z"/><circle cx="16" cy="16" r="4"/></svg>
            </span>
            <div><h3>Transparente Zusammenarbeit</h3><p>Du weißt, was wir umsetzen und welcher Schritt als Nächstes folgt.</p></div>
          </li>
          <li>
            <span className={styles.benefitIcon} aria-hidden="true">
              <svg viewBox="0 0 32 32" fill="none"><path d="M16 27 5 16C-2 7 10 1 16 10 22 1 34 7 27 16Z"/></svg>
            </span>
            <div><h3>Direkter Kontakt</h3><p>Du sprichst direkt mit mir – von der ersten Frage bis zur Umsetzung.</p></div>
          </li>
        </ul>
        </section>
      </motion.div>
    </section>
  );
}
