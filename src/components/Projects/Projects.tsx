import { motion } from 'motion/react';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import styles from './Projects.module.scss';

const projects = [
  { name: 'FilliCat', category: 'WEBENTWICKLUNG', description: 'Ein eigenes Webprojekt — von der Idee bis zur Umsetzung im Browser.', scope: 'Konzept · Webentwicklung', href: 'https://fillicat.com' },
  { name: 'Red July', category: 'SHOPIFY / E-COMMERCE', description: 'Redesign eines Shopify-Shops mit überarbeiteten Produktkarten, Bannern und Kategorien sowie individuellen Anpassungen im Code.', scope: 'Shopify · Redesign · CSS', href: 'https://www.rujoly.de/' },
  { name: 'Dana Tattoo Studio', category: 'WEBENTWICKLUNG', description: 'Eine individuelle Website für ein Tattoo-Studio in Andernach. Mit Stilübersicht, Galerie und direktem Weg zur Terminanfrage.', scope: 'React · TypeScript · SCSS', href: 'https://tattoodana.de' },
];

export default function Projects() {
  const reveal = useScrollReveal();
  return <section id="projekte" className={styles.projects} aria-labelledby="projects-title">
    <motion.div {...reveal} className={styles.heading}>
      <p className={styles.eyebrow}>AUSGEWÄHLTE ARBEITEN / 01 — 03</p>
      <h2 id="projects-title">Ideen werden digital.<br /><em>Meine Arbeiten.</em></h2>
      <p className={styles.lead}>Drei Projekte. Drei eigene Geschichten. Individuell entwickelt und mit einem Blick für das Detail umgesetzt.</p>
    </motion.div>
    <div className={styles.grid}>{projects.map((project, index) => <motion.article {...reveal} key={project.name} className={styles.card} aria-labelledby={`project-${index}`}>
      <div className={`${styles.cover} ${styles[`cover${index}`]}`} aria-hidden="true"><span className={styles.eyebrow}>0{index + 1} / SELECTED WORK</span><span className={styles.mark}>{project.name === 'Dana Tattoo Studio' ? 'Dana' : project.name}<i>.</i></span><span className={styles.eyebrow}>{project.category}</span></div>
      <div className={styles.copy}><p className={styles.eyebrow}>{project.category}</p><h3 id={`project-${index}`}>{project.name}</h3><p className={styles.description}>{project.description}</p><p className={styles.scope}>{project.scope}</p>{project.href && <a className={styles.link} href={project.href} target="_blank" rel="noopener noreferrer" aria-label={`${project.name}: Website öffnen (neuer Tab)`}>WEBSITE ANSEHEN <span aria-hidden="true">↗</span></a>}</div>
    </motion.article>)}</div>
  </section>;
}
