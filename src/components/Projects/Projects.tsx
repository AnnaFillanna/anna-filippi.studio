import { motion } from "motion/react";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import styles from "./Projects.module.scss";

const fillicatSubtitle = "Adaptive Lernplattform für Programmierung";
const fillicatDetails = [
  ["Ziel", "Logisches Denken fördern, Programmierkenntnisse nachhaltig aufbauen und Wissenslücken gezielt schließen."],
  ["Lernsystem", "Adaptive Aufgabenauswahl, automatisierte Code-Tests, mehrstufige Hilfestellungen, Kompetenzanalyse und intelligente Wiederholungen."],
  ["Besonderheit", "Das System passt sich dem Lernfortschritt an und trainiert nicht nur einzelne Befehle, sondern echtes Problemlösungsdenken."],
  ["Programmiersprachen", "JavaScript und TypeScript, später Python und weitere Sprachen."],
  ["Status", "In Entwicklung."],
];

function FilliCatDetails() {
  return fillicatDetails.map(([label, text]) => (
    <p key={label} className={styles.description}>
      <strong>{label}:</strong> {text}
    </p>
  ));
}

const projects = [
  {
    name: "FilliCat",
    category: "EDTECH / SOFTWAREENTWICKLUNG",
    description:
      "FilliCat ist eine intelligente Lernplattform, die Programmieren durch praktische Aufgaben und individuelles Training vermittelt.",
    scope: "",
    status: "",
    image: "/images/projects/fillicat.png",
    href: "https://fillicat.com",
  },
  {
    name: "Dana Tattoo Studio",
    category: "FULL-STACK WEBENTWICKLUNG",
    description:
      "Konzeption und Entwicklung einer individuellen, responsiven Website mit modernen Animationen, interaktiven Galerien und direkter Terminanfrage. Integration von Supabase für die geschützte Verwaltung von Medieninhalten.",
    scope: "React · TypeScript · SCSS · Supabase",
    status: "",
    image: "/images/projects/dana.png",
    href: "https://tattoodana.de",
  },
];

export default function Projects({
  softwareOnly = false,
  danaOnly = false,
}: {
  softwareOnly?: boolean;
  danaOnly?: boolean;
}) {
  const reveal = useScrollReveal();
  const selected = projects[danaOnly ? 1 : 0];
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
        Projekt ansehen
        <span className={styles.visuallyHidden}>: {project.name} (neuer Tab)</span>
      </a>
      <a
        className={styles.devices}
        href={index === 0 ? "/softwareentwicklung" : "/dana-tattoo-studio"}
        aria-label={`${project.name}: Projekt ansehen`}
      >
        <div className={styles.laptop}>
          <div className={styles.laptopScreen}>
            <img
              src={`/images/projects/${index === 0 ? "fillicat" : "dana"}-desktop.png`}
              alt={`Desktop-Ansicht von ${project.name}`}
              width="1440"
              height="900"
              loading={index === 0 ? "eager" : "lazy"}
            />
          </div>
          <div className={styles.laptopBase} aria-hidden="true" />
        </div>
        <div className={styles.phone}>
          <img
            src={`/images/projects/${index === 0 ? "fillicat" : "dana"}-mobile.png`}
            alt={`Mobile Ansicht von ${project.name}`}
            width="390"
            height="844"
            loading="lazy"
          />
        </div>
      </a>
      <div className={styles.copy}>
        <p className={styles.eyebrow}>{project.category}</p>
        <h2 id={`project-${index}`}>{project.name}</h2>
        {index === 0 && <p className={styles.description}>{fillicatSubtitle}</p>}
        <p className={styles.description}>{project.description}</p>
        {index === 0 ? <FilliCatDetails /> : <p className={styles.scope}>{project.scope}</p>}
        {project.status && (
          <p className={styles.description}>{project.status}</p>
        )}
      </div>
    </motion.article>
  );
  if (softwareOnly || danaOnly)
    return (
      <section className={styles.caseStudy} aria-labelledby="software-title">
        <div className={styles.caseInner}>
          <a className={styles.back} href="/#leistungen">
            <span aria-hidden="true">← </span>ZURÜCK ZUM ATELIER
          </a>
          <header className={styles.caseIntro}>
            <p className={styles.caseEyebrow}>
              AUSGEWÄHLTES PROJEKT / {danaOnly ? "02" : "01"} — 02
            </p>
            <h1 id="software-title" tabIndex={-1}>
              {danaOnly ? (
                <>
                  Kunst auf der Haut.
                  <br />
                  Digital <em>erlebbar.</em>
                </>
              ) : (
                <>
                  Programmieren
                  <br />
                  verständlich <em>lernen.</em>
                </>
              )}
            </h1>
            <div className={styles.accent} aria-hidden="true" />
            <p className={styles.caseLead}>
              {danaOnly
                ? "Ein individueller Webauftritt für Dana Tattoo Studio in Andernach. Atmosphärisches Design, interaktive Galerien und direkte Kontaktmöglichkeiten machen die Arbeit des Studios digital erlebbar."
                : selected.description}
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
            <p>{selected.description}</p>
            {danaOnly ? <p>{selected.scope}</p> : <FilliCatDetails />}
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
          Ideen werden digital.
          <br />
          <em>Meine Arbeiten.</em>
        </h1>
        <p className={styles.lead}>
          Zwei Projekte. Zwei eigene Geschichten. Individuell entwickelt und mit
          einem Blick für das Detail umgesetzt.
        </p>
      </motion.div>
      <div className={styles.grid}>
        {projects.map((project, index) => renderProject(project, index))}
      </div>
    </section>
  );
}
