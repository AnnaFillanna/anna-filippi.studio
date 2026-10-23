import { useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import styles from "./Hero.module.scss";
import AnimatedLetters from "../Animation/AnimatedLetters";
export default function Hero() {
  const section = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const intro = (delay: number) => ({
    initial: reduced ? false : { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1.1, delay, ease: [0.22, 1, 0.36, 1] as const },
  });
  return (
    <section
      id="start"
      ref={section}
      className={styles.hero}
      aria-labelledby="hero-title"
    >
      <div className={styles.portrait}>
        <img
          src="/images/anna-original.png"
          alt="Anna Filippi im Profil, mit wehendem blondem Haar und bordeauxrotem Stoff, nach links blickend."
          width="1675"
          height="939"
          fetchPriority="high"
        />
      </div>
      <div className={styles.fabricExtension} aria-hidden="true">
        <img
          src="images/hero-fabric-extension.png"
          alt=""
          width="2172"
          height="724"
        />
      </div>
      <div className={styles.copy}>
        <motion.p {...intro(0.1)} className={styles.eyebrow}>
          DIGITAL ATELIER
        </motion.p>
        <div className={styles.titleGroup}>
        <h1 id="hero-title" aria-label="ANNA FILIPPI">
          <AnimatedLetters text="ANNA FILIPPI" flock />
        </h1>
        <motion.h2 {...intro(0.25)} className={styles.headline}>
          <span>Software</span><span aria-hidden="true">·</span><span>Websites</span><span aria-hidden="true">·</span><span>Produktfotografie</span>
        </motion.h2>
        </div>
        <motion.p {...intro(0.4)} className={styles.description}>
          Ich entwickle individuelle Software und Websites und fotografiere deine Produkte. Drei Schwerpunkte – persönlich mit dir umgesetzt.
        </motion.p>
        <motion.div {...intro(0.55)} className={styles.actions}>
          <a href="#leistungen" className={styles.servicesLink}>Leistungen ansehen</a>
          <a href="#kontakt" className={styles.projectLink}>Projekt anfragen</a>
        </motion.div>
      </div>
      <motion.a {...intro(0.65)} href="#leistungen" className={styles.scroll}>
        SCROLL
        <span className={styles.srOnly}> zu den Leistungen</span>
      </motion.a>
      <p className={styles.location}>MIT KI GENERIERT</p>
      <p className={styles.aiCredit}>MIT KI GENERIERT</p>
    </section>
  );
}
