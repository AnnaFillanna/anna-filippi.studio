import { motion, useReducedMotion } from "motion/react";
import styles from "./About.module.scss";

const qualities = [
  {
    number: "01",
    title: "WEBENTWICKLUNG.",
    description:
      "Moderne Websites und Web-Applikationen mit Fokus auf Funktionalität, Design und Nutzererlebnis.",
    image: "/images/laptop.jpg",
  },
  {
    number: "02",
    title: "SOFTWAREENTWICKLUNG.",
    description:
      "Individuelle digitale Lösungen und moderne Technologien.",
    image: "/images/code.jpg",
  },
  {
    number: "03",
    title: "PRODUKTFOTOGRAFIE.",
    description:
      "Ausdrucksstarke Bildwelten für Marken, Produkte und Social Media.",
    image: "/images/jewelry.jpg",
  },
  {
    number: "04",
    title: "LERNEN & WACHSEN.",
    description:
      "Neugier, kontinuierliche Weiterentwicklung und Freude an neuen Ideen.",
    image: "/images/coffee.jpg",
  },
];

export default function About() {
  const reducedMotion = useReducedMotion();

  return (
    <section
      id="ueber-mich"
      className={styles.about}
      aria-labelledby="about-title"
    >
      <div className={styles.portrait}>
        <img
          src="/images/about-anna.jpg"
          alt="Anna Filippi"
          loading="lazy"
        />

        <span className={styles.vertical}>
          ANNA FILIPPI
        </span>
      </div>

      <div className={styles.content}>
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.8 }}
        >
          <div className={styles.label}>
            <span>03 / ÜBER MICH</span>
            <span className={styles.line} />
          </div>

          <h2 id="about-title">
            MEHR ALS
            <br />
            NUR CODE.
          </h2>

          <p className={styles.intro}>
            Ich verbinde Technologie, Ästhetik und
            unternehmerisches Denken, um digitale
            Projekte zu realisieren, die nicht nur
            funktional sind, sondern auch Menschen
            begeistern.
          </p>
        </motion.div>

        <div className={styles.qualities}>
          {qualities.map((item, index) => (
            <motion.div
              key={item.number}
              className={styles.quality}
              initial={
                reducedMotion
                  ? false
                  : { opacity: 0, y: 25 }
              }
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
              }}
            >
              <span className={styles.number}>
                {item.number}
              </span>

              <div className={styles.qualityText}>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>

              <img
                src={item.image}
                alt=""
                loading="lazy"
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />
            </motion.div>
          ))}
        </div>

        <div className={styles.signature}>
          <span>Anna Filippi</span>
          <p>DIGITAL ATELIER · ANDERNACH</p>
        </div>
      </div>
    </section>
  );
}