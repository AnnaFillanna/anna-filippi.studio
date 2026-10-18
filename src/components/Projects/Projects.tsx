import { motion } from 'motion/react';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import styles from './Projects.module.scss';

const projects = [
  {
    "name": "FilliCat",
    "category": "EDTECH / SOFTWAREENTWICKLUNG",
    "description": "Eigenständig entwickelte, interaktive Lernplattform für JavaScript und TypeScript mit personalisierten Übungen, Fehleranalyse und gezielten Wiederholungen. Mehrsprachig auf Deutsch, Englisch und Russisch.",
    "scope": "React · TypeScript · Vite · KI-Integration",
    "status": "Eigenprojekt · In aktiver Entwicklung · KI-Lernassistent in Entwicklung",
    "image": "/images/projects/fillicat.png",
    "href": "https://fillicat.com"
  },
  {
    "name": "RUJOLY",
    "category": "SHOPIFY / E-COMMERCE DEVELOPMENT",
    "description": "Umfassendes Redesign der Startseite eines Shopify-Shops mit individueller Gestaltung, Anpassung der Theme-Struktur und Änderungen am Code. Optimierung von Layout, Produktdarstellung und responsivem Design.",
    "scope": "Shopify · Liquid · HTML · CSS · JavaScript",
    "status": "",
    "image": "/images/projects/rujoly.png",
    "href": "https://www.rujoly.de/"
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

export default function Projects() {
  const reveal = useScrollReveal();
  return <section id="projekte" className={styles.projects} aria-labelledby="projects-title">
    <a className={styles.back} href="#leistungen"> ZURÜCK ZUM ATELIER</a>
    <motion.div {...reveal} className={styles.heading}>
      <p className={styles.eyebrow}>AUSGEWÄHLTE ARBEITEN / 01 — 03</p>
      <h1 id="projects-title" tabIndex={-1}>Ideen werden digital.<br /><em>Meine Arbeiten.</em></h1>
      <p className={styles.lead}>Drei Projekte. Drei eigene Geschichten. Individuell entwickelt und mit einem Blick für das Detail umgesetzt.</p>
    </motion.div>
    <ul className={styles.categories} aria-label="Projektbereiche"><li>Softwareentwicklung</li><li>Websites</li><li>Shopify</li></ul>
    <div className={styles.grid}>{projects.map((project, index) => <motion.article {...reveal} key={project.name} className={styles.card} aria-labelledby={`project-${index}`}>
      <a className={styles.cover} href={project.href} target="_blank" rel="noopener noreferrer" aria-label={`${project.name}: Website öffnen (neuer Tab)`}><img src={project.image} alt={`Startseite von ${project.name}`} width="1440" height="900" loading={index === 0 ? 'eager' : 'lazy'} /><span className={styles.previewLabel}>WEBSITE ANSEHEN </span></a>
      <div className={styles.copy}><p className={styles.eyebrow}>{project.category}</p><h3 id={`project-${index}`}>{project.name}</h3><p className={styles.description}>{project.description}</p><p className={styles.scope}>{project.scope}</p>{project.status && <p className={styles.description}>{project.status}</p>}</div>
    </motion.article>)}</div>
  </section>;
}
