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
      <h2 id="home-contact-title">Du hast eine Idee? Lass uns darüber sprechen.</h2>
      <p>Ob neue Website, individuelle Anwendung oder Produktfotografie – erzähl mir von deinem Vorhaben. Gemeinsam finden wir heraus, welche Lösung zu dir passt.</p>
      <div className={styles.actions}>
        <a className={styles.primaryAction} href="/kontakt">Projekt unverbindlich anfragen <span aria-hidden="true">→</span></a>
        <a href={`mailto:${contact.email}`}>Per E-Mail anfragen <span aria-hidden="true">→</span></a>
        <a href={`https://wa.me/${contact.whatsappNumber}`}>
          Per WhatsApp schreiben <span aria-hidden="true">→</span>
        </a>
      </div>
    </motion.section>
  );
}
