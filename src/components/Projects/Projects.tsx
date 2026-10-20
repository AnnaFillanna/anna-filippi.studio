import { motion } from 'motion/react';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import styles from './Projects.module.scss';

const projects = [
  {
    "name": "FilliCat",
    "category": "EDTECH / SOFTWAREENTWICKLUNG",
    "description": "Eigenständig entwickelte, interaktive Lernplattform für JavaScript und TypeScript mit personalisierten Übungen, Fehleranalyse und gezielten Wiederholungen. Mehrsprachig auf Deutsch, Englisch und Russisch. FilliCat ist als App für Smartphone, Laptop und Tablet geplant; aktuell ist die Lernplattform im Browser erreichbar.",
    "scope": "React · TypeScript · Vite · KI-Integration",
    "status": "Eigenprojekt · In aktiver Entwicklung · Geräteübergreifende App geplant · KI-Lernassistent in Entwicklung",
    "image": "/images/projects/fillicat.png",
    "href": "https://fillicat.com"
  },
  {
    "name": "Dana Tattoo Studio",
    "category": "FULL-STACK WEBENTWICKLUNG",
    "description": "Konzeption und Entwicklung einer individuellen, responsiven Website mit modernen Animationen, interaktiven Galerien und direkter Terminanfrage. Integration von Supabase für die geschützte Verwaltung von Medieninhalten.",
    "scope": "React · TypeScript · SCSS · Supabase",
    "status": "",
    "image": "/images/projects/dana.png",
    "href": "https://tattoodana.de"
  }
];

export default function Projects({ softwareOnly = false, danaOnly = false }: { softwareOnly?: boolean; danaOnly?: boolean }) {
  const reveal = useScrollReveal();
  const selected = projects[danaOnly ? 1 : 0];
  const imagePrefix = danaOnly ? 'dana' : 'fillicat';
  const renderProject = (project: typeof projects[number], index: number) => (
<motion.article {...reveal} key={project.name} className={styles.card} aria-labelledby={`project-${index}`}>
      <a className={styles.cover} href={index === 0 ? '/softwareentwicklung' : '/dana-tattoo-studio'} aria-label={`${project.name}: Projekt ansehen`}><img src={project.image} alt={`Startseite von ${project.name}`} width="1440" height="900" loading={index === 0 ? 'eager' : 'lazy'} /><span className={styles.previewLabel}>PROJEKT ANSEHEN </span></a>
      <div className={styles.copy}><p className={styles.eyebrow}>{project.category}</p><h3 id={`project-${index}`}>{project.name}</h3><p className={styles.description}>{project.description}</p><p className={styles.scope}>{project.scope}</p>{project.status && <p className={styles.description}>{project.status}</p>}</div>
    </motion.article>
  );
  if (softwareOnly || danaOnly) return <section className={styles.caseStudy} aria-labelledby="software-title">
    <div className={styles.caseInner}>
      <a className={styles.back} href="/#leistungen"><span aria-hidden="true">← </span>ZURÜCK ZUM ATELIER</a>
      <header className={styles.caseIntro}>
        <p className={styles.caseEyebrow}>AUSGEWÄHLTES PROJEKT / {danaOnly ? '02' : '01'} — 02</p>
        <h1 id="software-title" tabIndex={-1}>{danaOnly ? <>Kunst auf der Haut.<br />Digital <em>erlebbar.</em></> : <>Programmieren<br />verständlich <em>lernen.</em></>}</h1>
        <div className={styles.accent} aria-hidden="true" />
        <p className={styles.caseLead}>{danaOnly ? 'Ein individueller Webauftritt für Dana Tattoo Studio in Andernach. Atmosphärisches Design, interaktive Galerien und direkte Kontaktmöglichkeiten machen die Arbeit des Studios digital erlebbar.' : 'FilliCat ist eine interaktive Lernplattform, die Programmieren einfach, motivierend und alltagsnah macht – mit personalisierten Übungen, perfekt für Einsteiger und alle, die ihr Wissen vertiefen möchten.'}</p>
        <a className={styles.caseButton} href={selected.href} target="_blank" rel="noopener noreferrer">
          PROJEKT ANSEHEN <span aria-hidden="true">→</span><span className={styles.visuallyHidden}> (neuer Tab)</span>
        </a>
      </header>
      <a className={styles.devices} href={selected.href} target="_blank" rel="noopener noreferrer" aria-label={selected.name + ' öffnen (neuer Tab)'}>
        <div className={styles.laptop}>
          <div className={styles.laptopScreen}><img src={`/images/projects/${imagePrefix}-desktop.png`} alt={`Startseite von ${selected.name}`} width="1440" height="900" fetchPriority="high" /></div>
          <div className={styles.laptopBase} aria-hidden="true" />
        </div>
        <div className={styles.phone}>
          <img src={`/images/projects/${imagePrefix}-mobile.png`} alt={`Mobile Ansicht von ${selected.name}`} width="390" height="844" />
        </div>
      </a>
      <div className={styles.caseDetails}>
        <p className={styles.caseEyebrow}>{selected.category}</p>
        <h2>{selected.name}</h2>
        <p>{danaOnly ? selected.description : 'Eine moderne Lernplattform für JavaScript und TypeScript mit interaktiven Übungen, Fehleranalyse und gezielter Wiederholung. Mehrsprachig auf Deutsch, Englisch und Russisch.'}</p>
        <p>{danaOnly ? selected.scope : 'Aktuell im Browser verfügbar. Eine geräteübergreifende App für Smartphone, Laptop und Tablet ist geplant.'}</p>
      </div>
    </div>
  </section>;
  return <section id="projekte" className={styles.projects} aria-labelledby="projects-title">
    <a className={styles.back} href="/#leistungen"> ZURÜCK ZUM ATELIER</a>
    <motion.div {...reveal} className={styles.heading}>
      <p className={`${styles.eyebrow} ${styles.sectionLabel}`}>AUSGEWÄHLTE ARBEITEN / 01 — 02</p>
      <h1 id="projects-title" tabIndex={-1}>Ideen werden digital.<br /><em>Meine Arbeiten.</em></h1>
      <p className={styles.lead}>Zwei Projekte. Zwei eigene Geschichten. Individuell entwickelt und mit einem Blick für das Detail umgesetzt.</p>
    </motion.div>
    <div className={styles.grid}>{projects.map((project, index) => renderProject(project, index))}</div>

  </section>;
}
