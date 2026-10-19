import { motion, useReducedMotion } from "motion/react";
import styles from "./About.module.scss";

export default function About() {
  const reduced = useReducedMotion();

  return (
    <section id="ueber-mich" className={styles.about} aria-labelledby="about-title">
      <motion.div className={styles.portrait}
        initial={reduced ? false : { opacity: 0, x: -55 }}
        whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: .18 }}
        transition={{ duration: reduced ? 0 : 1.1, ease: [.22, 1, .36, 1] }}>
        <motion.img
          src="/images/about-anna-red.jpg"
          alt="Anna Filippi in einem roten Kleid vor einer hellen Wand"
          loading="lazy"
          initial={reduced ? false : { scale: 1.04 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: reduced ? 0 : 1.3, ease: [0.22, 1, 0.36, 1] }}
        />
      </motion.div>
      <motion.div className={styles.content}
        initial={reduced ? false : { opacity: 0, x: 55 }}
        whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: .18 }}
        transition={{ duration: reduced ? 0 : 1.1, ease: [.22, 1, .36, 1] }}>
        <div>
          <p className={styles.label}>ÜBER MICH</p>
          <h2 id="about-title">MEHR ALS<br />NUR CODE</h2>
          <p className={styles.subtitle}>Full-Stack-Webentwicklerin</p>
          <div className={styles.intro}>
            <p>Ich bin Anna Filippi, auch bekannt als Fillanna. Ich entwickle individuelle Websites und Webanwendungen – vom ersten sichtbaren Detail bis zur Logik im Hintergrund.</p>
            <p>Mein Anspruch: aus Code etwas machen, das nicht nur gut aussieht, sondern für dich arbeitet. Mit klarem Design, durchdachter Funktion und der Ausdauer, auch für knifflige Fragen eine Lösung zu finden.</p>
            <a className={styles.projectLink} href="#kontakt">Erzähl mir von deiner Idee</a>
          </div>
          <div className={styles.signature}>
            <span>Anna Filippi</span>
            <p>DIGITAL ATELIER · ANDERNACH</p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
