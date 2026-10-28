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
    const slides = Array.from(element.children) as HTMLElement[];
    const count = featuredProjects.length;
    let activeIndex = 0;
    let touching = false;
    let timer = 0;
    let width = element.clientWidth;
    const nearest = () => slides.reduce((best, slide, index) =>
      Math.abs(slide.offsetLeft - element.scrollLeft) < Math.abs(slides[best].offsetLeft - element.scrollLeft) ? index : best, 0);
    const update = () => {
      const index = nearest();
      activeIndex = index % count;
      setActive(activeIndex);
      // Keep one accessible copy of each project, including visible neighbours.
      slides.forEach((slide, position) => {
        const hidden = position < index || position >= index + count;
        slide.inert = hidden;
        if (hidden) slide.setAttribute('aria-hidden', 'true');
        else slide.removeAttribute('aria-hidden');
      });
    };
    const settle = () => {
      if (touching) return;
      const index = nearest();
      if (index < count || index >= count * 2) {
        const destination = count + index % count;
        element.scrollTo({ left: slides[destination].offsetLeft, behavior: 'instant' });
      }
      update();
    };
    const onScroll = () => {
      update();
      window.clearTimeout(timer);
      timer = window.setTimeout(settle, 180);
    };
    const pointerDown = () => { touching = true; };
    const pointerUp = () => { touching = false; window.clearTimeout(timer); timer = window.setTimeout(settle, 180); };
    const observer = new ResizeObserver(() => {
      if (width !== element.clientWidth) {
        width = element.clientWidth;
        element.scrollTo({ left: slides[count + activeIndex].offsetLeft, behavior: 'instant' });
      }
      update();
    });
    element.scrollTo({ left: slides[count].offsetLeft, behavior: 'instant' });
    element.addEventListener('scroll', onScroll, { passive: true });
    element.addEventListener('scrollend', settle);
    element.addEventListener('pointerdown', pointerDown);
    window.addEventListener('pointerup', pointerUp);
    window.addEventListener('pointercancel', pointerUp);
    observer.observe(element);
    update();
    return () => {
      window.clearTimeout(timer);
      observer.disconnect();
      element.removeEventListener('scroll', onScroll);
      element.removeEventListener('scrollend', settle);
      element.removeEventListener('pointerdown', pointerDown);
      window.removeEventListener('pointerup', pointerUp);
      window.removeEventListener('pointercancel', pointerUp);
    };
  }, []);
  const scrollToSlide = (slide: HTMLElement) => {
    track.current?.scrollTo({ left: slide.offsetLeft, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  };
  const goTo = (index: number) => {
    const element = track.current;
    if (!element) return;
    const candidates = (Array.from(element.children) as HTMLElement[]).filter((_, position) => position % featuredProjects.length === index);
    const closest = candidates.reduce((best, slide) => Math.abs(slide.offsetLeft - element.scrollLeft) < Math.abs(best.offsetLeft - element.scrollLeft) ? slide : best);
    scrollToSlide(closest);
  };
  const move = (direction: number) => {
    const element = track.current;
    if (!element) return;
    const slides = Array.from(element.children) as HTMLElement[];
    const nearest = slides.reduce((best, slide, index) => Math.abs(slide.offsetLeft - element.scrollLeft) < Math.abs(slides[best].offsetLeft - element.scrollLeft) ? index : best, 0);
    const slide = slides[nearest + direction];
    if (slide) scrollToSlide(slide);
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
        {[...featuredProjects, ...featuredProjects, ...featuredProjects].map((project, index) => (
          <li key={`${project.imagePrefix}-${index}`}
            aria-hidden={index < featuredProjects.length || index >= featuredProjects.length * 2 ? true : undefined}
            inert={index < featuredProjects.length || index >= featuredProjects.length * 2 ? true : undefined}>
            <article>
              <a href={project.detailHref} className={styles.link}>
                <div className={styles.image}>
                  <div className={styles.deviceScene}>
                    <div className={styles.desktopDevice}>
                      <img src={`/images/projects/${project.imagePrefix}-desktop.${project.imageExtension}`}
                        alt={`Desktop-Vorschau: ${project.name}`} width={1440} height={900}
                        loading="lazy" decoding="async" />
                    </div>
                    <div className={styles.tabletDevice} aria-hidden="true">
                      <img src={project.tabletImage ?? `/images/projects/${project.imagePrefix}-mobile.${project.mobileImageExtension ?? project.imageExtension}`}
                        alt="" loading="lazy" decoding="async" />
                    </div>
                    <div className={styles.phoneDevice} aria-hidden="true">
                      <img src={`/images/projects/${project.imagePrefix}-mobile.${project.mobileImageExtension ?? project.imageExtension}`}
                        alt="" loading="lazy" decoding="async" />
                    </div>
                  </div>
                  <span className={styles.badge}>{project.projectType}</span>
                </div>
                <div className={styles.copy}>
                  <p>{project.featuredCategory}</p>
                  <h3>{project.name}</h3>
                  <p className={styles.projectDescription}>{project.description}</p>
                  <span className={styles.projectAction}>{project.buttonLabel} <span aria-hidden="true">→</span></span>
                </div>
              </a>
            </article>
          </li>
        ))}
      </ul>
      <div className={styles.pagination} role="group" aria-label="Projekt auswählen">
        <button className={styles.arrow} type="button" aria-label="Vorheriges Projekt" aria-controls="featured-project-track" onClick={() => move(-1)}>←</button>
        {featuredProjects.map((project, index) => <button key={project.imagePrefix} type="button"
          aria-label={`${project.name} anzeigen`} aria-controls="featured-project-track"
          aria-current={active === index ? 'true' : undefined} onClick={() => goTo(index)}><span /></button>)}
        <button className={styles.arrow} type="button" aria-label="Nächstes Projekt" aria-controls="featured-project-track" onClick={() => move(1)}>→</button>
      </div>
      <a className={styles.allProjects} href="/projekte">Alle Projekte ansehen</a>
    </motion.section>
  );
}
