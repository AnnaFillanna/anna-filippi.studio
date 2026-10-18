import { motion } from 'motion/react';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import styles from './Projects.module.scss';

const projects = [
  { name: 'FilliCat', category: 'SOFTWAREENTWICKLUNG', description: 'Eine interaktive Lernanwendung für JavaScript und TypeScript. Mit Übungen, Lernpfaden und einem persönlichen Coding-Begleiter.', scope: 'Konzept · Webentwicklung', image: '/images/projects/fillicat.png', href: 'https://fillicat.com' },
  { name: 'RUJOLY', category: 'SHOPIFY / E-COMMERCE', description: 'Redesign eines Shopify-Shops mit überarbeiteten Produktkarten, Bannern und Kategorien sowie individuellen Anpassungen im Code.', scope: 'Shopify · Redesign · CSS', image: '/images/projects/rujoly.png', href: 'https://www.rujoly.de/' },
  { name: 'Dana Tattoo Studio', category: 'WEBENTWICKLUNG', description: 'Eine individuelle Website für ein Tattoo-Studio in Andernach. Mit Stilübersicht, Galerie und direktem Weg zur Terminanfrage.', scope: 'React · TypeScript · SCSS', image: '/images/projects/dana.png', href: 'https://tattoodana.de' },
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
      <div className={styles.copy}><p className={styles.eyebrow}>{project.category}</p><h3 id={`project-${index}`}>{project.name}</h3><p className={styles.description}>{project.description}</p><p className={styles.scope}>{project.scope}</p>{project.href && <a className={styles.link} href={project.href} target="_blank" rel="noopener noreferrer" aria-label={`${project.name}: Website öffnen (neuer Tab)`}>WEBSITE ANSEHEN </a>}</div>
    </motion.article>)}</div>
  </section>;
}
