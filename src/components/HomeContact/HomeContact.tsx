import { motion, useReducedMotion } from 'motion/react';
import { contact } from '../../config/contact';
import styles from './HomeContact.module.scss';

export default function HomeContact() {
  const reduced = useReducedMotion();
  return (
    <motion.section
      initial={reduced ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .1 }}
      transition={{ duration: reduced ? 0 : .7, ease: [.22, 1, .36, 1] }}
      id="kontakt" className={styles.contact} aria-labelledby="home-contact-title">
      <h2 id="home-contact-title">Erzähl mir von deiner Idee.</h2>
      <p>Vielleicht weißt du schon genau, was du möchtest. Vielleicht stehst du noch ganz am Anfang. Beides ist völlig in Ordnung. Schreib mir einfach. Gemeinsam finden wir heraus, was zu dir und deinem Business passt.</p>
      <div className={styles.actions}>
        <a className={styles.primaryAction} href="/kontakt">Lass uns kennenlernen <span aria-hidden="true">→</span></a>
        <a href={`mailto:${contact.email}`}>Schreib mir eine E-Mail <span aria-hidden="true">→</span></a>
        <a href={`https://wa.me/${contact.whatsappNumber}`}>
          Schreib mir auf WhatsApp <span aria-hidden="true">→</span>
        </a>
      </div>
    </motion.section>
  );
}
