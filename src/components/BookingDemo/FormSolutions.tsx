import styles from './FormSolutions.module.scss';

const solutions = [
  { number: '01', title: 'Kontakt aufnehmen.', text: 'Ein übersichtliches Kontaktformular macht den ersten Schritt einfach. Mit passenden Feldern erhältst du die Informationen, die du für eine hilfreiche Antwort brauchst.', detail: 'Kontaktformular · Rückrufwunsch' },
  { number: '02', title: 'Anfragen konkretisieren.', text: 'Ein mehrstufiges Anfrageformular führt Interessierte durch dein Angebot – etwa mit Leistungswahl, Projektumfang und Wunschtermin. So kannst du Anfragen besser einschätzen.', detail: 'Projektanfrage · Angebotsanfrage' },
  { number: '03', title: 'Termine vereinbaren.', text: 'Eine Buchungsstrecke führt von der gewünschten Leistung zur Auswahl eines Termins. Verfügbarkeit und Bestätigung lassen sich auf deinen tatsächlichen Ablauf abstimmen.', detail: 'Beratung · Studio · Dienstleistungen' },
];

export default function FormSolutions() {
  return <section id="formularloesungen" className={styles.section} aria-labelledby="forms-title">
    <header className={styles.header}>
      <div><p className={styles.eyebrow}>FORMULARE & ONLINE-TERMINE</p><h2 id="forms-title">Deine Website kann<br /><em>mehr als informieren.</em></h2></div>
      <p>Ich entwickle Formulare, die zu deinem Angebot passen, und integriere sie in neue oder bestehende Websites. Klar gestaltet, auf dem Smartphone bequem bedienbar und auf die Informationen abgestimmt, die du wirklich brauchst.</p>
    </header>
    <div className={styles.cards}>{solutions.map(item => <article key={item.number}>
      <span className={styles.number} aria-hidden="true">{item.number}</span><h3>{item.title}</h3><p>{item.text}</p><p className={styles.detail}>{item.detail}</p>
    </article>)}</div>
    <div className={styles.integration}>
      <div><h3>Dein Design. Dein Ablauf.</h3><p>Farben, Texte, Formularfelder und Schritte werden individuell angepasst. Je nach Bedarf und technischer Grundlage können E-Mail-Versand, Kalender oder bestehende Systeme angebunden werden. Den Umfang stimmen wir gemeinsam ab.</p></div>
      <a href="/kontakt">Formular für meine Website anfragen</a>
    </div>
    <a className={styles.demoLink} href="#buchungsdemo">So könnte es aussehen: Buchungsdemo ausprobieren <span aria-hidden="true">↓</span></a>
  </section>;
}
