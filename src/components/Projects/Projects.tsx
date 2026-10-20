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
  if (softwareOnly) return <section className={styles.projects} aria-labelledby="software-title">
    <a className={styles.back} href="/#leistungen">ZURÜCK ZUM ATELIER</a>
    <div className={styles.heading}><h1 id="software-title" tabIndex={-1}>Softwareentwicklung</h1></div>
    <p className={styles.eyebrow}>APP-ENTWICKLUNG</p>
    <div className={styles.grid}><article className={styles.card}>
      <a className={styles.cover} href={projects[0].href} target="_blank" rel="noopener noreferrer" aria-label="FilliCat öffnen (neuer Tab)"><img src={projects[0].image} alt="Startseite von FilliCat" width="1440" height="900" fetchPriority="high" /><span className={styles.previewLabel}>FILLICAT ANSEHEN</span></a>
      <div className={styles.copy}><h2>FilliCat</h2></div>
    </article></div>
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
