import { projects } from "../../data/projects";
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import styles from "./Projects.module.scss";

export default function Projects({
  softwareOnly = false,
  danaOnly = false,
}: {
  softwareOnly?: boolean;
  danaOnly?: boolean;
}) {
  const reveal = useScrollReveal();
  const trackRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});


  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const cards = Array.from(track.children) as HTMLElement[];
    const count = projects.length;
    let frame = 0;
    let settleTimer = 0;
    let touching = false;
    let active = 0;
    const centerOn = (index: number) => cards[index].offsetLeft + cards[index].offsetWidth / 2 - track.clientWidth / 2;
    const nearestIndex = () => cards.reduce((best, _, index) =>
      Math.abs(centerOn(index) - track.scrollLeft) < Math.abs(centerOn(best) - track.scrollLeft) ? index : best, 0);
    const settle = () => {
      if (touching) return;
      const index = nearestIndex();
      active = index % count;
      if (index < count || index >= count * 2) {
        // The adjacent copy has identical neighbours, so this reset is invisible.
        track.scrollTo({ left: centerOn(count + active), behavior: "instant" });
        update();
      }
    };
    const pointerDown = () => { touching = true; };
    const pointerUp = () => {
      touching = false;
      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(settle, 180);
    };
    const update = () => {
      active = nearestIndex() % count;
      const center = track.scrollLeft + track.clientWidth / 2;
      track.style.setProperty("--ring-center", `${center}px`);
      const radius = track.clientWidth / (2 * Math.sin(16 * Math.PI / 180));
      for (const card of Array.from(track.children) as HTMLElement[]) {
        // View the outside of a large vertical ring: its sides recede from us.
        const distance = Math.max(-1, Math.min(1,
          (card.offsetLeft + card.offsetWidth / 2 - center) / (track.clientWidth / 2)));
        const angle = reducedMotion.matches ? 0 : distance * 16;
        const depth = reducedMotion.matches ? 0
          : 24 - radius * (1 - Math.cos(angle * Math.PI / 180));
        card.style.setProperty("--ring-angle", `${angle}deg`);
        card.style.setProperty("--ring-depth", `${depth}px`);
      }
    };
    const scheduleUpdate = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(settle, 180);
    };
    let width = track.clientWidth;
    const observer = new ResizeObserver(() => {
      if (track.clientWidth !== width) {
        width = track.clientWidth;
        track.scrollTo({ left: centerOn(count + active), behavior: "instant" });
      }
      update();
    });
    observer.observe(track);
    track.addEventListener("scroll", scheduleUpdate, { passive: true });
    reducedMotion.addEventListener("change", scheduleUpdate);
    track.addEventListener("scrollend", settle);
    track.addEventListener("pointerdown", pointerDown);
    window.addEventListener("pointerup", pointerUp);
    window.addEventListener("pointercancel", pointerUp);
    track.scrollTo({ left: centerOn(count), behavior: "instant" });
    update();
    return () => {
      observer.disconnect();
      track.removeEventListener("scroll", scheduleUpdate);
      reducedMotion.removeEventListener("change", scheduleUpdate);
      cancelAnimationFrame(frame);
      window.clearTimeout(settleTimer);
      track.removeEventListener("scrollend", settle);
      track.removeEventListener("pointerdown", pointerDown);
      window.removeEventListener("pointerup", pointerUp);
      window.removeEventListener("pointercancel", pointerUp);
    };
  }, [softwareOnly, danaOnly]);

  const moveProjects = (direction: number) => {
    const track = trackRef.current;
    if (!track) return;
    const cards = Array.from(track.children) as HTMLElement[];
    const center = track.scrollLeft + track.clientWidth / 2;
    const nearest = cards.reduce((best, card, index) =>
      Math.abs(card.offsetLeft + card.offsetWidth / 2 - center)
        < Math.abs(cards[best].offsetLeft + cards[best].offsetWidth / 2 - center) ? index : best, 0);
    const target = cards[Math.max(0, Math.min(cards.length - 1, nearest + direction))];
    if (!target) return;
    track.scrollTo({
      left: target.offsetLeft + target.offsetWidth / 2 - track.clientWidth / 2,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    });
  };
  const selected = projects.find(project => project.imagePrefix === (danaOnly ? "dana" : "fillicat"))!;
  const renderProject = (project: (typeof projects)[number], index: number) => (
    <motion.article
      initial={false}
      key={`${project.name}-${index}`}
      aria-hidden={index < projects.length || index >= projects.length * 2 ? true : undefined}
      inert={index < projects.length || index >= projects.length * 2 ? true : undefined}
      className={styles.card}
      aria-labelledby={`project-${index}`}
    >
      <a
        className={styles.caseButton}
        href={project.href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {project.buttonLabel}
        <span className={styles.visuallyHidden}>: {project.name} (neuer Tab)</span>
      </a>
      <a
        className={styles.devices}
        href={project.detailHref}
        target={project.detailHref.startsWith("https:") ? "_blank" : undefined}
        rel={project.detailHref.startsWith("https:") ? "noopener noreferrer" : undefined}
        aria-label={`${project.name}: Projekt ansehen`}
      >
        <div className={styles.laptop}>
          <div className={`${styles.laptopScreen} ${project.imagePrefix === "kavro" ? styles.kavroScreen : ""}`}>
            <img
              src={`/images/projects/${project.imagePrefix}-desktop.${project.imageExtension}`}
              alt={`Desktop-Ansicht von ${project.name}`}
              width="1440"
              height="900"
              loading={index % projects.length === 0 ? "eager" : "lazy"}
            />
          </div>
          <div className={styles.laptopBase} aria-hidden="true" />
        </div>
        <div className={`${styles.phone} ${project.imagePrefix === "kavro" ? styles.kavroPhone : ""}`}>
          <img
            src={`/images/projects/${project.imagePrefix}-mobile.${project.mobileImageExtension ?? project.imageExtension}`}
            alt={project.mobileImageAlt ?? `Mobile Ansicht von ${project.name}`}
            width="390"
            height="844"
            loading="lazy"
          />
        </div>
      </a>
      <div className={styles.copy}>
        <p className={styles.eyebrow}>{project.category} · {project.projectType}</p>
        <h2 id={`project-${index}`}>{project.name}</h2>
        {project.subtitle && <p className={styles.description}>{project.subtitle}</p>}
        <p className={styles.description}>{project.description}</p>
        <details className={styles.projectDetails} open={expanded[project.imagePrefix] ?? false}
          onToggle={event => {
            const open = event.currentTarget.open;
            setExpanded(previous => previous[project.imagePrefix] === open ? previous
              : { ...previous, [project.imagePrefix]: open });
          }}>
          <summary>Über das Projekt</summary>
          {project.details.map(([label, text]) => (
            <p key={label} className={styles.description}><strong>{label}:</strong> {text}</p>
          ))}
        </details>
        {project.status && (
          <p className={styles.projectStatus}>{project.status}</p>
        )}
      </div>
    </motion.article>
  );
  if (softwareOnly || danaOnly)
    return (
      <section className={`${styles.caseStudy} ${softwareOnly ? styles.softwarePage : ""}`} aria-labelledby="software-title">
        <div className={styles.caseInner}>
          <a className={styles.back} href="/#leistungen">
            <span aria-hidden="true">← </span>ZURÜCK ZUM ATELIER
          </a>
          <header className={styles.caseIntro}>
            {danaOnly && <p className={styles.caseEyebrow}>AUSGEWÄHLTES PROJEKT / 01 — 03</p>}
            <h1 id="software-title" tabIndex={-1}>
              {danaOnly ? (
                <>
                  Kunst auf der Haut.
                  <br />
                  Digital <em>erlebbar.</em>
                </>
              ) : (
                <>
                  Softwareentwicklung
                  <br />
                  für deine <em>Ideen.</em>
                </>
              )}
            </h1>
            <div className={styles.accent} aria-hidden="true" />
            <p className={styles.caseLead}>
              {danaOnly ? selected.description : "Ich entwickle individuelle Software und Web-Apps, die zu deinen Abläufen passen. Ein Beispiel: FilliCat, meine adaptive Lernplattform für Programmierung."}
            </p>
            <a
              className={styles.caseButton}
              href={selected.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              Projekt ansehen
              <span className={styles.visuallyHidden}> (neuer Tab)</span>
            </a>
          </header>
          <a
            className={styles.devices}
            href={selected.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={selected.name + " öffnen (neuer Tab)"}
          >
            <div className={styles.laptop}>
              <div className={styles.laptopScreen}>
                <img
                  src={`/images/projects/${selected.imagePrefix}-desktop.${selected.imageExtension}`}
                  alt={`Startseite von ${selected.name}`}
                  width="1440"
                  height="900"
                  fetchPriority="high"
                />
              </div>
              <div className={styles.laptopBase} aria-hidden="true" />
            </div>
            <div className={styles.phone}>
              <img
                src={`/images/projects/${selected.imagePrefix}-mobile.${selected.mobileImageExtension ?? selected.imageExtension}`}
                alt={selected.mobileImageAlt ?? `Mobile Ansicht von ${selected.name}`}
                width="390"
                height="844"
              />
            </div>
          </a>
          <div className={styles.caseDetails}>
            <p className={styles.caseEyebrow}>{selected.category} · {selected.projectType}</p>
            <h2>{selected.name}</h2>
            {selected.subtitle && <p>{selected.subtitle}</p>}
            {selected.details.map(([label, text]) => (
              <p key={label} className={styles.description}><strong>{label}:</strong> {text}</p>
            ))}
          </div>
        </div>
      </section>
    );
  return (
    <section
      id="projekte"
      className={styles.projects}
      aria-labelledby="projects-title"
    >
      <a className={styles.back} href="/#leistungen">
        {" "}
        ZURÜCK ZUM ATELIER
      </a>
      <motion.div {...reveal} className={styles.heading}>
        <h1 id="projects-title" tabIndex={-1}>
          Webentwicklung
          <br />
          <em>Meine Arbeiten.</em>
        </h1>
        <p className={styles.lead}>
          Websites und Onlineshops für dein Unternehmen – von der Gestaltung bis zur Veröffentlichung. Hier siehst du ausgewählte Webprojekte und interaktive Anwendungen.
        </p>
      </motion.div>
      <div className={styles.carouselControls} role="group" aria-label="Projekte durchblättern">
        <button type="button" aria-label="Vorherige Projekte" aria-controls="project-carousel"
          onClick={() => moveProjects(-1)}>
          <svg viewBox="0 0 32 20" fill="none" aria-hidden="true"><path d="M30 10H2m8-8-8 8 8 8" /></svg>
        </button>
        <button type="button" aria-label="Nächste Projekte" aria-controls="project-carousel"
          onClick={() => moveProjects(1)}>
          <svg viewBox="0 0 32 20" fill="none" aria-hidden="true"><path d="M2 10h28m-8-8 8 8-8 8" /></svg>
        </button>
      </div>
      <div ref={trackRef} id="project-carousel" className={`${styles.grid} ${styles.carousel}`}
        role="region" aria-label="Projektübersicht" aria-roledescription="Karussell" tabIndex={0}>
        {[...projects, ...projects, ...projects].map((project, index) => renderProject(project, index))}
      </div>
    </section>
  );
}
