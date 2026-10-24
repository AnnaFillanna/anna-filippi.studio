import { contact } from '../../config/contact';
import styles from './HomeContact.module.scss';

export default function HomeContact() {
  return (
    <section id="kontakt" className={styles.contact} aria-labelledby="home-contact-title">
      <h2 id="home-contact-title">Du hast eine Idee?</h2>
      <p>Erzähl mir davon. Ich freue mich auf deine Nachricht.</p>
      <div className={styles.actions}>
        <a href={`mailto:${contact.email}`}>Per E-Mail anfragen <span aria-hidden="true">→</span></a>
        <a href={`https://wa.me/${contact.whatsappNumber}`}>
          Per WhatsApp schreiben <span aria-hidden="true">→</span>
        </a>
      </div>
    </section>
  );
}
