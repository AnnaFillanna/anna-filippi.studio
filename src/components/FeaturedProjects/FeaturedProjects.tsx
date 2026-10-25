import { motion, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { projects } from '../../data/projects';
import styles from './FeaturedProjects.module.scss';

const featuredProjects = projects.filter(project => project.featuredCategory);

export default function FeaturedProjects() {
  const reduced = useReducedMotion();
  const track = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);
  useEffect(() => {
    const element = track.current;
    if (!element) return;
    const update = () => {
      const max = element.scrollWidth - element.clientWidth;
      const positions = Array.from(element.children, child => Math.min((child as HTMLElement).offsetLeft, max));
      const distances = positions.map(position => Math.abs(position - element.scrollLeft));
      setActive(max > 1 && element.scrollLeft >= max - 2 ? featuredProjects.length - 1 : distances.indexOf(Math.min(...distances)));
    };
    element.addEventListener('scroll', update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(element);
    update();
    return () => { element.removeEventListener('scroll', update); observer.disconnect(); };
  }, []);
  const goTo = (index: number) => {
    const element = track.current;
    const slide = element?.children[index] as HTMLElement | undefined;
    if (element && slide) element.scrollTo({ left: slide.offsetLeft, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  };
  const move = (direction: number) => {
    const element = track.current;
    const first = element?.children[0] as HTMLElement | undefined;
    const second = element?.children[1] as HTMLElement | undefined;
    if (element && first && second) element.scrollBy({ left: direction * (second.offsetLeft - first.offsetLeft), behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  };
  return (
    <motion.section
      initial={reduced ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .1 }}
      transition={{ duration: reduced ? 0 : .7, ease: [.22, 1, .36, 1] }}
      id="ausgewaehlte-projekte" className={styles.section} aria-labelledby="featured-projects-title">
      <header className={styles.heading}>
        <h2 id="featured-projects-title">Ausgewählte Projekte</h2>
        <p>Ein Einblick in meine Arbeit.</p>
      </header>
      <ul ref={track} id="featured-project-track" className={styles.grid} aria-label="Ausgewählte Projekte" tabIndex={0}
        onKeyDown={event => {
          if (event.target !== event.currentTarget) return;
          if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
            event.preventDefault();
            move(event.key === 'ArrowRight' ? 1 : -1);
          }
        }}>
        {featuredProjects.map(project => (
          <li key={project.imagePrefix}>
            <article>
              <a href={project.detailHref} className={styles.link}>
                <div className={styles.image}>
                  <img src={`/images/projects/${project.imagePrefix}-desktop.${project.imageExtension}`}
                    alt={`Website-Vorschau: ${project.name}`} width={1440} height={900}
                    loading="lazy" decoding="async" />
                  <span className={styles.badge}>{project.projectType}</span>
                </div>
                <div className={styles.copy}>
                  <p>{project.featuredCategory}</p>
                  <h3>{project.name}</h3>
                  <p className={styles.projectDescription}>{project.description}</p>
                </div>
              </a>
            </article>
          </li>
        ))}
      </ul>
      <div className={styles.pagination} role="group" aria-label="Projekt auswählen">
        <button className={styles.arrow} type="button" aria-label="Vorheriges Projekt" aria-controls="featured-project-track" disabled={active === 0} onClick={() => move(-1)}>←</button>
        {featuredProjects.map((project, index) => <button key={project.imagePrefix} type="button"
          aria-label={`${project.name} anzeigen`} aria-controls="featured-project-track"
          aria-current={active === index ? 'true' : undefined} onClick={() => goTo(index)}><span /></button>)}
        <button className={styles.arrow} type="button" aria-label="Nächstes Projekt" aria-controls="featured-project-track" disabled={active === featuredProjects.length - 1} onClick={() => move(1)}>→</button>
      </div>
      <a className={styles.allProjects} href="/projekte">Alle Projekte ansehen</a>
    </motion.section>
  );
}
