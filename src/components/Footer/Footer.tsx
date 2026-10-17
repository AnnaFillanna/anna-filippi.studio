import { motion, useReducedMotion } from 'motion/react';
import styles from './Footer.module.scss';

export default function Footer() {
  const reduced = useReducedMotion();
  return (
    <footer id="kontakt" className={styles.footer} aria-labelledby="contact-title">
      <img className={styles.background} src="images/footer-rose.jpg" alt="" width="1280" height="853" loading="lazy" />
      <div className={styles.topline}><span>KONTAKT</span><span>DIGITAL ATELIER · ANDERNACH</span></div>
      <motion.div className={styles.content} initial={reduced ? false : { opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .2 }} transition={{ duration: .8 }}>
        <h2 id="contact-title">Lass uns etwas<br /><em>Schönes schaffen.</em></h2>
        <a className={styles.whatsapp} href="https://wa.me/4917662310068" target="_blank" rel="noopener noreferrer" aria-label="Anna Filippi auf WhatsApp kontaktieren (öffnet einen neuen Tab)">
          <span><span className={styles.label}>SCHREIB MIR AUF WHATSAPP</span><span className={styles.number}>+49 176 62310068</span></span><span className={styles.arrow} aria-hidden="true">↗</span>
        </a>
      </motion.div>
      <div className={styles.bottom}><a href="#start" className={styles.signature}>Anna Filippi<span>Digital Atelier</span></a><span className={styles.copyright}>© {new Date().getFullYear()} Anna Filippi</span><a className={styles.back} href="#start">NACH OBEN <span aria-hidden="true">↑</span></a></div>
    </footer>
  );
}
