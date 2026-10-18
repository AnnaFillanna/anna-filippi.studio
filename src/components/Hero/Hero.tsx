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
          width="1280"
          height="445"
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
        <h1 id="hero-title" aria-label="ANNA FILIPPI">
          <AnimatedLetters text="ANNA FILIPPI" flock />
        </h1>
        <motion.p {...intro(2.05)} className={styles.tagline}>
          Webentwicklung.
          <br />
          Produktfotografie.
          <br />
          Digitale Lösungen.
        </motion.p>
      </div>
      <motion.a {...intro(0.65)} href="#leistungen" className={styles.scroll}>
        SCROLL
        <span className={styles.srOnly}> zu den Leistungen</span>
      </motion.a>
      <p className={styles.location}>ANDERNACH · DE</p>
    </section>
  );
}
