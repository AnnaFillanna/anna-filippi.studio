import { motion, useReducedMotion } from 'motion/react';
import styles from './Services.module.scss';

const services = [
  { title: 'Webdesign & Websites', area: 'WEB', text: 'Ich gestalte Websites, die deine Persönlichkeit und dein Angebot verständlich vermitteln und auf allen Geräten funktionieren.', items: ['Unternehmenswebsites & Landingpages', 'Website-Relaunch und Weiterentwicklung', 'Responsive Gestaltung für Smartphone, Tablet & Desktop'], href: '/kontakt', link: 'Website-Projekt besprechen' },
  { title: 'Software & Web-Apps', area: 'SOFTWARE', text: 'Wenn Standardlösungen nicht ausreichen, entwickle ich passende Web-Anwendungen und digitale Funktionen für deine Abläufe.', items: ['Individuelle Web-Anwendungen', 'Interaktive Funktionen & Formulare', 'Online-Terminbuchung'], href: '/softwareentwicklung', link: 'Softwarelösungen entdecken' },
  { title: 'E-Commerce & Onlineshops', area: 'E-COMMERCE', text: 'Ich unterstütze dich bei der Planung und Umsetzung eines Onlineshops, der zu deinem Sortiment und deinen Abläufen passt.', items: ['Shopify-Onlineshops', 'Produktverwaltung & Bestellabläufe', 'Weiterentwicklung bestehender Shops'], href: '/kontakt', link: 'Onlineshop-Projekt besprechen' },
  { title: 'SEO, AEO & GEO', area: 'SUCHSYSTEME', text: 'Ich unterstütze dich dabei, die technischen und inhaltlichen Grundlagen für die Sichtbarkeit deiner Website in Suchsystemen zu stärken.', items: ['Technische Suchmaschinenoptimierung', 'Strukturierte Inhalte und Metadaten', 'AEO und GEO für Such- und Antwortsysteme'], href: '/kontakt', link: 'Sichtbarkeit besprechen' },
  { title: 'KI-Integration & Automatisierung', area: 'AUTOMATISIERUNG', text: 'Weniger Routine, mehr Zeit für dein Business. Gemeinsam finden wir heraus, welche Aufgaben sich sinnvoll automatisieren lassen.', items: ['KI-Chatbots für häufige Fragen', 'Automatisierte Kundenanfragen', 'Intelligente Workflows'], note: 'Bei komplexen KI-Lösungen klären wir Umfang und technische Machbarkeit gemeinsam.', href: '/kontakt', link: 'Lass uns darüber sprechen' },
  { title: 'Digitale Markt- & Wettbewerbsanalyse', area: 'ANALYSE', text: 'Ich ordne digitale Markt- und Wettbewerbsinformationen, damit du Chancen und Positionierung fundierter bewerten kannst.', items: ['Digitale Wettbewerbsauftritte vergleichen', 'Marktentwicklungen und Trends einordnen', 'Erkenntnisse als Entscheidungsgrundlage aufbereiten'], href: '/kontakt', link: 'Analyse besprechen' },
] as const;

export default function Services() {
  const reduced = useReducedMotion();
  return (
    <section id="leistungen" className={styles.services} aria-labelledby="services-title">
      <h2 id="services-title" className={styles.sectionLabel}>Meine Leistungen</h2>
      <p className={styles.serviceLead}>Was kann ich für dich tun?</p>
      <p className={styles.description}>Jedes Business ist anders. Deshalb möchte ich zuerst verstehen, was du brauchst, bevor ich etwas für dich entwickle.</p>
      <ul className={styles.primaryList}>
        {services.map((service, index) => (
          <motion.li key={service.title} className={styles.primaryService}
            initial={reduced ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: .12 }}
            transition={{ duration: reduced ? 0 : .65, delay: reduced ? 0 : (index % 3) * .06, ease: [.22, 1, .36, 1] }}>
            <div className={styles.serviceMeta}><span className={styles.serviceNumber} aria-hidden="true">0{index + 1}</span><span className={styles.serviceArea}>{service.area}</span></div>
            <h3>{service.title}</h3>
            <p className={styles.description}>{service.text}</p>
            <ul className={styles.serviceItems}>
              {service.items.map(item => <li key={item}>{item}</li>)}
            </ul>
            {'note' in service && <p className={styles.serviceNote}>{service.note}</p>}
            <a className={styles.serviceLink} href={service.href}>{service.link} <span aria-hidden="true">→</span></a>
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
        <p>Nicht jedes Projekt braucht dieselben Funktionen oder dasselbe Budget. Deshalb schauen wir gemeinsam, welche Lösung für dich sinnvoll ist.</p>
        <p>Du bekommst eine transparente Einschätzung des Aufwands und weißt, welche Leistungen du erwarten kannst.</p>
        <p className={styles.pricingNote}>Manchmal ist eine kleine, sorgfältig gestaltete Website genau das Richtige.</p>
      </div>
        <section className={styles.trust} aria-labelledby="trust-title">
          <p className={styles.eyebrow}>Warum mit mir arbeiten?</p>
          <h2 id="trust-title">Persönlich. Durchdacht. Individuell.</h2>
        <ul className={styles.benefits} aria-label="Deine Zusammenarbeit mit mir">
          <li>
            <span className={styles.benefitIcon} aria-hidden="true">
              <svg viewBox="0 0 32 32" fill="none"><path d="M8 23C7 14 16 9 26 5c-2 10-6 20-16 19M6 28 22 10M11 22l1-7" /></svg>
            </span>
            <div><h3>Deine Idee steht im Mittelpunkt</h3><p>Ich nehme mir Zeit, deine Wünsche zu verstehen und eine Lösung zu entwickeln, die zu dir und deinem Business passt.</p></div>
          </li>
          <li>
            <span className={styles.benefitIcon} aria-hidden="true">
              <svg viewBox="0 0 32 32" fill="none"><path d="m13 4 6 0 1 4 3 2 4-1 3 5-3 3v3l1 3-5 3-3-2-3 1-2 3-5-2v-4l-2-2-4-1v-6l4-1 2-3 0-3Z"/><circle cx="16" cy="16" r="4"/></svg>
            </span>
            <div><h3>Transparente Zusammenarbeit</h3><p>Du weißt jederzeit, woran ich arbeite und welcher Schritt als Nächstes folgt.</p></div>
          </li>
          <li>
            <span className={styles.benefitIcon} aria-hidden="true">
              <svg viewBox="0 0 32 32" fill="none"><path d="M16 27 5 16C-2 7 10 1 16 10 22 1 34 7 27 16Z"/></svg>
            </span>
            <div><h3>Direkter Kontakt</h3><p>Bei mir hast du eine persönliche Ansprechpartnerin – von deiner ersten Frage bis zur fertigen Umsetzung.</p></div>
          </li>
        </ul>
        </section>
      </motion.div>
    </section>
  );
}
