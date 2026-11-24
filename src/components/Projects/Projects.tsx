import { projects } from "../../data/projects";
import { useState } from "react";
import { motion } from "motion/react";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import styles from "./Projects.module.scss";
import ProjectRating from '../ProjectRating/ProjectRating';

export default function Projects({
  softwareOnly = false,
  danaOnly = false,
}: {
  softwareOnly?: boolean;
  danaOnly?: boolean;
}) {
  const reveal = useScrollReveal();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});


  const selected = projects.find(project => project.imagePrefix === (danaOnly ? "dana" : "fillicat"))!;
  const renderProject = (project: (typeof projects)[number], index: number) => (
    <motion.article
      initial={false}
      key={`${project.name}-${index}`}
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
        aria-label={`${project.name}: ${project.buttonLabel}`}
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
        <div className={styles.tablet} aria-hidden="true">
          <img src={project.tabletImage ?? `/images/projects/${project.imagePrefix}-mobile.${project.mobileImageExtension ?? project.imageExtension}`} alt="" loading="lazy" />
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
        <div className={styles.cardIntro}>
        <p className={styles.eyebrow}>{project.category} · {project.projectType}</p>
        <h2 id={`project-${index}`}>{project.name}</h2>
        {project.status.includes('In Entwicklung') && <span className={styles.developmentBadge}>In Entwicklung</span>}
        {project.subtitle && <p className={styles.description}>{project.subtitle}</p>}
        <p className={styles.description}>{project.description}</p>
        </div>
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
        {!project.status.includes('In Entwicklung') && (
          <details className={styles.ratingDisclosure}>
            <summary>Projekt bewerten</summary>
            <ProjectRating project={project.imagePrefix} name={project.name} />
          </details>
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
            {danaOnly && <p className={styles.caseEyebrow}>AUSGEWÄHLTES KUNDENPROJEKT</p>}
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
              {danaOnly ? selected.description : "Du möchtest eine individuelle Webanwendung entwickeln lassen? Ich entwickle Software für deine Abläufe – von Lernplattformen bis zu Kontaktformularen und Online-Terminbuchungen für deine Website."}
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
            {softwareOnly && <a className={styles.formsLink} href="#formularloesungen">Formulare & Terminbuchung entdecken <span aria-hidden="true">↓</span></a>}
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
            <div className={styles.tablet} aria-hidden="true">
              <img src={selected.tabletImage ?? `/images/projects/${selected.imagePrefix}-mobile.${selected.mobileImageExtension ?? selected.imageExtension}`} alt="" loading="lazy" />
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
            {selected.status.includes('In Entwicklung') && <span className={styles.developmentBadge}>In Entwicklung</span>}
            {selected.subtitle && <p>{selected.subtitle}</p>}
            {selected.details.map(([label, text]) => (
              <p key={label} className={styles.description}><strong>{label}:</strong> {text}</p>
            ))}
            <ProjectRating project={selected.imagePrefix} name={selected.name} inDevelopment={selected.status.includes('In Entwicklung')} />
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
          Ideen, die
          <br />
          <em>Wirklichkeit werden.</em>
        </h1>
        <p className={styles.lead}>
          Jedes Projekt erzählt eine eigene Geschichte. Entdecke, wie ich Design, Technologie und kreative Ideen miteinander verbinde.
        </p>
      </motion.div>
      <div className={styles.grid} role="region" aria-label="Projektübersicht">
        {projects.map((project, index) => renderProject(project, index))}
      </div>
    </section>
  );
}
