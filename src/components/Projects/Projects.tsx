import { projects, fillicatDetails, danaDetails } from "../../data/projects";
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import styles from "./Projects.module.scss";

const fillicatSubtitle = "Adaptive Lernplattform für Programmierung";


function FilliCatDetails() {
  return fillicatDetails.map(([label, text]) => (
    <p key={label} className={styles.description}>
      <strong>{label}:</strong> {text}
    </p>
  ));
}



function DanaDetails() {
  return danaDetails.map(([label, text]) => (
    <p key={label} className={styles.description}>
      <strong>{label}:</strong> {text}
    </p>
  ));
}







export default function Projects({
  softwareOnly = false,
  danaOnly = false,
}: {
  softwareOnly?: boolean;
  danaOnly?: boolean;
}) {
  const reveal = useScrollReveal();
  const trackRef = useRef<HTMLDivElement>(null);
  const [navigation, setNavigation] = useState({ previous: false, next: true });

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const update = () => setNavigation({
      previous: track.scrollLeft > 2,
      next: track.scrollLeft + track.clientWidth < track.scrollWidth - 2,
    });
    const observer = new ResizeObserver(update);
    observer.observe(track);
    track.addEventListener("scroll", update, { passive: true });
    update();
    return () => {
      observer.disconnect();
      track.removeEventListener("scroll", update);
    };
  }, [softwareOnly, danaOnly]);

  const moveProjects = (direction: number) => {
    const track = trackRef.current;
    if (!track) return;
    const cards = Array.from(track.children) as HTMLElement[];
    const step = cards.length > 1
      ? cards[1].offsetLeft - cards[0].offsetLeft
      : track.clientWidth;
    track.scrollBy({
      left: direction * step,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    });
  };
  const selected = projects[danaOnly ? 0 : 2];
  const imagePrefix = danaOnly ? "dana" : "fillicat";
  const renderProject = (project: (typeof projects)[number], index: number) => (
    <motion.article
      {...reveal}
      key={project.name}
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
              loading={index === 0 ? "eager" : "lazy"}
            />
          </div>
          <div className={styles.laptopBase} aria-hidden="true" />
        </div>
        <div className={`${styles.phone} ${project.imagePrefix === "kavro" ? styles.kavroPhone : ""}`}>
          <img
            src={`/images/projects/${project.imagePrefix}-mobile.${project.imagePrefix === "kavro" ? "jpg" : project.imageExtension}`}
            alt={project.imagePrefix === "kavro" ? "Barber bei der Arbeit im KAVRO Studio" : `Mobile Ansicht von ${project.name}`}
            width="390"
            height="844"
            loading="lazy"
          />
        </div>
      </a>
      <div className={styles.copy}>
        <p className={styles.eyebrow}>{project.category}</p>
        <h2 id={`project-${index}`}>{project.name}</h2>
        {project.imagePrefix === "fillicat" && <p className={styles.description}>{fillicatSubtitle}</p>}
        <p className={styles.description}>{project.description}</p>
        <details className={styles.projectDetails}>
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
                  src={`/images/projects/${imagePrefix}-desktop.png`}
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
                src={`/images/projects/${imagePrefix}-mobile.png`}
                alt={`Mobile Ansicht von ${selected.name}`}
                width="390"
                height="844"
              />
            </div>
          </a>
          <div className={styles.caseDetails}>
            <p className={styles.caseEyebrow}>{selected.category}</p>
            <h2>{selected.name}</h2>
            {!danaOnly && <p>{fillicatSubtitle}</p>}
            {danaOnly ? <DanaDetails /> : <FilliCatDetails />}
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
          disabled={!navigation.previous} onClick={() => moveProjects(-1)}>
          <svg viewBox="0 0 32 20" fill="none" aria-hidden="true"><path d="M30 10H2m8-8-8 8 8 8" /></svg>
        </button>
        <button type="button" aria-label="Nächste Projekte" aria-controls="project-carousel"
          disabled={!navigation.next} onClick={() => moveProjects(1)}>
          <svg viewBox="0 0 32 20" fill="none" aria-hidden="true"><path d="M2 10h28m-8-8 8 8-8 8" /></svg>
        </button>
      </div>
      <div ref={trackRef} id="project-carousel" className={`${styles.grid} ${styles.carousel}`}
        role="region" aria-label="Projektübersicht" aria-roledescription="Karussell" tabIndex={0}>
        {projects.map((project, index) => renderProject(project, index))}
      </div>
    </section>
  );
}
