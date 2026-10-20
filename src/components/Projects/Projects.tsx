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

export default function Projects({ softwareOnly = false }: { softwareOnly?: boolean }) {
  const reveal = useScrollReveal();
  const renderProject = (project: typeof projects[number], index: number) => (
<motion.article {...reveal} key={project.name} className={styles.card} aria-labelledby={`project-${index}`}>
      <a className={styles.cover} href={project.href} target="_blank" rel="noopener noreferrer" aria-label={`${project.name}: Website öffnen (neuer Tab)`}><img src={project.image} alt={`Startseite von ${project.name}`} width="1440" height="900" loading={index === 0 ? 'eager' : 'lazy'} /><span className={styles.previewLabel}>WEBSITE ANSEHEN </span></a>
      <div className={styles.copy}><p className={styles.eyebrow}>{project.category}</p><h3 id={`project-${index}`}>{project.name}</h3><p className={styles.description}>{project.description}</p><p className={styles.scope}>{project.scope}</p>{project.status && <p className={styles.description}>{project.status}</p>}</div>
    </motion.article>
  );
  if (softwareOnly) return <section className={styles.caseStudy} aria-labelledby="software-title">
    <div className={styles.caseInner}>
      <a className={styles.back} href="/#leistungen"><span aria-hidden="true">← </span>ZURÜCK ZUM ATELIER</a>
      <header className={styles.caseIntro}>
        <p className={styles.caseEyebrow}>AUSGEWÄHLTES PROJEKT / 01 — 02</p>
        <h1 id="software-title" tabIndex={-1}>Programmieren<br />verständlich <em>lernen.</em></h1>
        <div className={styles.accent} aria-hidden="true" />
        <p className={styles.caseLead}>FilliCat ist eine interaktive Lernplattform, die Programmieren einfach, motivierend und alltagsnah macht – mit personalisierten Übungen, perfekt für Einsteiger und alle, die ihr Wissen vertiefen möchten.</p>
        <a className={styles.caseButton} href={projects[0].href} target="_blank" rel="noopener noreferrer">
          PROJEKT ANSEHEN <span aria-hidden="true">→</span><span className={styles.visuallyHidden}> (neuer Tab)</span>
        </a>
      </header>
      <a className={styles.devices} href={projects[0].href} target="_blank" rel="noopener noreferrer" aria-label="FilliCat öffnen (neuer Tab)">
        <div className={styles.laptop}>
          <div className={styles.laptopScreen}><img src="/images/projects/fillicat-desktop.png" alt="Startseite von FilliCat mit JavaScript-Training und Lernweg" width="1440" height="900" fetchPriority="high" /></div>
          <div className={styles.laptopBase} aria-hidden="true" />
        </div>
        <div className={styles.phone}>
          <img src="/images/projects/fillicat-mobile.png" alt="Mobile Ansicht von FilliCat mit Lernbegleiter und Übungen" width="390" height="844" />
        </div>
      </a>
      <div className={styles.caseDetails}>
        <p className={styles.caseEyebrow}>EDTECH / SOFTWAREENTWICKLUNG</p>
        <h2>FilliCat</h2>
        <p>Eine moderne Lernplattform für JavaScript und TypeScript mit interaktiven Übungen, Fehleranalyse und gezielter Wiederholung. Mehrsprachig auf Deutsch, Englisch und Russisch.</p>
        <p>Aktuell im Browser verfügbar. Eine geräteübergreifende App für Smartphone, Laptop und Tablet ist geplant.</p>
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
