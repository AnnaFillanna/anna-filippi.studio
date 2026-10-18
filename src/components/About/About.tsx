import { motion, useReducedMotion } from "motion/react";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import styles from "./About.module.scss";

export default function About() {
  const reveal = useScrollReveal();
  const reduced = useReducedMotion();

  return (
    <section id="ueber-mich" className={styles.about} aria-labelledby="about-title">
      <div className={styles.portrait}>
        <motion.img
          src="/images/about-anna.jpg"
          alt="Anna Filippi im schwarzen Pullover"
          loading="lazy"
          initial={reduced ? false : { scale: 1.04 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: reduced ? 0 : 1.3, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
      <div className={styles.content}>
        <motion.div {...reveal}>
          <p className={styles.label}>ÜBER MICH</p>
          <h2 id="about-title">MEHR ALS<br />NUR CODE.</h2>
          <p className={styles.subtitle}>Technologie trifft auf Ästhetik.</p>
          <p className={styles.intro}>
            Ich entwickle digitale Erlebnisse mit einem Blick für Details.
            Dabei verbinde ich technisches Denken, Kreativität und die
            Leidenschaft, aus Ideen etwas Besonderes zu machen.
          </p>
          <div className={styles.signature}>
            <span>Anna Filippi</span>
            <p>DIGITAL ATELIER · ANDERNACH</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
