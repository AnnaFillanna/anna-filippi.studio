import { motion, useReducedMotion } from 'motion/react';
import styles from './Services.module.scss';

const services = [
  { title: 'Webdesign & Webentwicklung', text: <>Individuelles <strong>Webdesign</strong>, Website-Erstellung und Redesign – von der Gestaltung bis zur technischen Entwicklung und Veröffentlichung.</> },
  { title: 'Software & Web-Apps', text: <>Individuelle <strong>Software und Web-Apps</strong> für Smartphone, Laptop und Tablet – von der Idee bis zur technischen Umsetzung. Geräteübergreifende App-Projekte sind in Planung.</> },
  { title: 'KI-Integration & Automatisierung', text: <>Intelligente <strong>Chatbots</strong>, digitale Assistenten, KI-Agenten und automatisierte Geschäftsprozesse.</> },
  { title: 'Shopify, WordPress & CMS', text: <>Ergänzend zur individuellen Entwicklung: Websites und Onlineshops mit <strong>Shopify und WordPress</strong> – individuell angepasst, responsiv und mit benutzerfreundlicher Content-Verwaltung. CMS-Integration, Shop-Anpassungen und die Einbindung in bestehende Websites nach Bedarf.</> },
  { title: 'SEO & Website-Betreuung', text: <><strong>Technisches SEO</strong> und verständliche Inhalte als Grundlage für deine Google-Sichtbarkeit. Dazu Performance-Optimierung, Website-Wartung und Weiterentwicklung – ohne Ranking-Versprechen.</> },
  { title: 'Produkt- & Schmuckfotografie', text: <>Ästhetische Schmuck- und <strong>Produktfotografie</strong> mit einem besonderen Gespür für Licht, Details und Bildkomposition.</> },
] as const;

export default function Services() {
  const reduced = useReducedMotion();
  return (
    <section id="leistungen" className={styles.services} aria-labelledby="services-title">
      <motion.div className={styles.intro}
        initial={reduced ? false : { opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .15 }}
        transition={{ duration: reduced ? 0 : .9 }}>
      <div className={styles.pricing} aria-labelledby="pricing-title">
        <p className={styles.eyebrow}>Preisgestaltung</p>
        <h2 id="pricing-title">So individuell wie <em>dein Projekt.</em></h2>
        <p>Jedes Projekt ist einzigartig – deshalb gibt es bei mir keine starren
          Preispakete. Gemeinsam finden wir eine Lösung, die zu deinen Vorstellungen,
          Anforderungen und deinem Budget passt.</p>
        <p>Nicht jedes Unternehmen braucht eine große Website. Manchmal genügt eine
          kleine, sorgfältig entwickelte Seite, die genau das zeigt, worauf es ankommt.</p>
        <p className={styles.pricingPromise}>Transparent. Persönlich. Unverbindlich.</p>
        <a href="#kontakt">Über dein Projekt sprechen</a>
      </div>
        <div className={styles.serviceHeading}>
        <p className={styles.eyebrow}>Meine Leistungen</p>
        <h2 id="services-title">
          <span>Digitale Ideen.</span>{" "}
          <em>Individuelle Lösungen.</em>
        </h2>
        </div>
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
                <li>WhatsApp- und Kontaktformular-Integration</li>
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
