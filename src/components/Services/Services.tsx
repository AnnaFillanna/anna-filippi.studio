import { motion, useReducedMotion } from 'motion/react';
import styles from './Services.module.scss';

const services = [
  { title: 'Websites & Webdesign', area: 'DIGITAL', text: 'Unternehmenswebsites und Landingpages, die dein Angebot verständlich zeigen und Kontakt leicht machen. Auch für den Relaunch deiner bestehenden Website – passend für Smartphone, Tablet und Desktop.', href: '/kontakt', link: 'Website anfragen' },
  { title: 'Webentwicklung & E-Commerce', area: 'DIGITAL', text: 'Individuelle Web-Anwendungen, interaktive Funktionen und Online-Buchungssysteme, die deine Abläufe erleichtern. Dazu Shopify-Shops, in denen Kunden deine Produkte einfach entdecken und kaufen können.', href: '/softwareentwicklung', link: 'Software & Projekt ansehen' },
  { title: 'KI & Automatisierung', area: 'DIGITAL', text: 'KI-Chatbots für häufige Fragen, automatisierte Kundenanfragen und intelligente Workflows: Wiederkehrende Aufgaben sinnvoll verbinden und digitale Abläufe vereinfachen.', note: 'Komplexe KI-Lösungen: Auf Anfrage. Umfang und Machbarkeit klären wir gemeinsam.', href: '/kontakt', link: 'Möglichkeiten besprechen' },
  { title: 'SEO & Website-Betreuung', area: 'DIGITAL', text: 'Technische Suchmaschinenoptimierung, Wartung und Performance-Optimierung: damit deine Website gut zugänglich ist, schnell lädt und zuverlässig funktioniert. Mit kontinuierlicher Weiterentwicklung nach Bedarf.', href: '/kontakt', link: 'Betreuung anfragen' },
  { title: 'Produktfotografie', area: 'VISUAL', text: 'Ästhetische Produkt- und Schmuckfotografie, die Materialien und feine Details sichtbar macht. Visuelles Storytelling verbindet deine Bilder zu einer stimmigen Geschichte für Website und Shop.', href: '/fotografie', link: 'Fotografien ansehen' },
  { title: 'Beratung & Website-Check', area: 'DIGITAL', text: 'Du hast bereits eine Website oder eine erste Idee? Gemeinsam schauen wir auf Gestaltung, Inhalte und Nutzerführung. Du erhältst konkrete Empfehlungen und einen klaren nächsten Schritt.', href: '/kontakt', link: 'Beratung anfragen' },
] as const;

export default function Services() {
  const reduced = useReducedMotion();
  return (
    <section id="leistungen" className={styles.services} aria-labelledby="services-title">
      <h2 id="services-title" className={styles.sectionLabel}>Meine Leistungen</h2>
      <p className={styles.serviceLead}>Was möchtest du umsetzen?</p>
      <p className={styles.description}>Professionelle Websites für kleine und mittelständische Unternehmen – ergänzt durch Online-Shops und individuelle digitale Lösungen. Von Andernach bei Koblenz aus begleite ich dein Projekt persönlich, in der Region und deutschlandweit.</p>
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
            {'note' in service && <p className={styles.serviceNote}>{service.note}</p>}
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
