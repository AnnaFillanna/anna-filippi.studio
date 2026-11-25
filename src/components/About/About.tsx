import { imageProps } from "../../data/responsiveImage";
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
          {...imageProps("/images/about-anna-red.jpg", "(max-width: 760px) min(86vw, 440px), 460px")}
          alt="Anna Filippi in einem roten Kleid vor einer hellen Wand"
          loading="lazy"
          initial={reduced ? false : { scale: 1.04 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: reduced ? 0 : 1.3, ease: [0.22, 1, 0.36, 1] }}
        decoding="async" />
      </motion.div>
      <motion.div className={styles.content}
        initial={reduced ? false : { opacity: 0, x: 55 }}
        whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: .18 }}
        transition={{ duration: reduced ? 0 : 1.1, ease: [.22, 1, .36, 1] }}>
        <div>
          <p className={styles.label}>ÜBER MICH</p>
          <h2 id="about-title">Hallo, ich bin Anna.</h2>
          <p className={styles.subtitle}>Webentwicklung · Softwareentwicklung · Produktfotografie</p>
          <div className={styles.intro}>
            <p>Ich liebe es, kreative Ideen mit Technologie zu verbinden. Für mich erzählt eine Website deine Geschichte, zeigt, was dich besonders macht, und verbindet dich mit den richtigen Menschen.</p>
            <p>Mir ist wichtig, deine Wünsche zu verstehen und dir von der ersten Idee bis zur fertigen Umsetzung als direkte Ansprechpartnerin zur Seite zu stehen.</p>
            <a className={styles.projectLink} href="/kontakt">Erzähl mir von deiner Idee</a>
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
