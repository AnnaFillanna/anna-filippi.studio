import { useRef, useState, type FormEvent } from "react";
import { contact, projectTypes, budgets } from "../../config/contact";
import styles from "./Contact.module.scss";

export default function Contact() {
  const busy = useRef(false);
  const attempt = useRef({ body: "", id: "" });
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy.current || !contact.privacyUrl || !contact.formEnabled) return;
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const data = Object.fromEntries(new FormData(form));
    const body = JSON.stringify(data);
    if (attempt.current.body !== body)
      attempt.current = { body, id: crypto.randomUUID() };
    busy.current = true;
    setStatus("sending");
    setMessage("Deine Anfrage wird gesendet …");
    try {
      const response = await fetch(contact.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": attempt.current.id,
        },
        body,
        signal: AbortSignal.timeout(25000),
      });
      const result = await response.json();
      if (!response.ok || result.ok !== true)
        throw new Error(
          (typeof result.message === "string" ? personalMessage(result.message) : "") ||
            "Die Anfrage konnte nicht gesendet werden. Bitte versuche es erneut.",
        );
      setStatus("success");
      setMessage(
        "Vielen Dank! Deine Anfrage wurde erfolgreich gesendet. Ich melde mich so bald wie möglich bei dir.",
      );
      form.reset();
      attempt.current = { body: "", id: "" };
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error &&
          !["SyntaxError", "TimeoutError", "TypeError"].includes(error.name)
          ? error.message
          : "Die Übermittlung konnte nicht bestätigt werden. Deine Eingaben bleiben erhalten. Bitte versuche es erneut oder kontaktiere mich per WhatsApp.",
      );
    } finally {
      busy.current = false;
    }
  }
  return (
    <section
      id="kontakt"
      className={styles.footer}
      aria-labelledby="contact-title"
    >
      <span className="sunlight" aria-hidden="true" />
      <div className={styles.layout}>
        <div className={styles.intro}>
          <h1 id="contact-title" tabIndex={-1}>Dein Projekt. <em>Gemeinsam umgesetzt.</em></h1>
        </div>
        <form
          className={styles.form}
          onSubmit={submit}
          aria-busy={status === "sending"}
        >
          <fieldset disabled={status === "sending"}>
            <legend className={styles.srOnly}>Projektanfrage</legend>
            <div className={styles.row}>
              <label>
                Dein Name *
                <input
                  name="name"
                  autoComplete="name"
                  required
                  maxLength={100}
                  pattern=".*\S.*"
                />
              </label>
              <label>
                Deine E-Mail-Adresse *
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  maxLength={254}
                />
              </label>
            </div>
            <label>
              Was möchtest du umsetzen? *
              <select name="project" required defaultValue="">
                <option value="" disabled>
                  Bitte auswählen
                </option>
                {projectTypes.map((value) => (
                  <option key={value}>{value}</option>
                ))}
              </select>
            </label>
            <label>
              Dein ungefähres Budget
              <select
                name="budget"
                defaultValue=""
                aria-describedby="budget-note"
              >
                <option value="">Optional auswählen</option>
                {budgets.map((value) => (
                  <option key={value}>{value}</option>
                ))}
              </select>
            </label>
            <p id="budget-note" className={styles.note}>
              Die Budgetangabe ist freiwillig und stellt keine verbindliche
              Preisangabe dar.
            </p>
            <label>
              Erzähl mir von deinem Projekt *
              <textarea
                name="message"
                required
                minLength={10}
                maxLength={5000}
                rows={5}
                placeholder="Was ist deine Idee? Was ist dir besonders wichtig?"
              />
            </label>
            <div className={styles.trap} aria-hidden="true">
              <label>
                Website
                <input
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  maxLength={200}
                />
              </label>
            </div>
            <p className={styles.note}>
              Deine Angaben werden zur Bearbeitung deiner Anfrage verwendet.{" "}
              {contact.privacyUrl ? (
                <a href={contact.privacyUrl}>Datenschutzerklärung</a>
              ) : (
                "Die Datenschutzerklärung wird noch ergänzt. Der Formularversand ist bis dahin deaktiviert."
              )}
            </p>
            <div className={styles.actions}>
            <button
              className={styles.submit}
              type="submit"
              disabled={!contact.privacyUrl || !contact.formEnabled}
            >
              {status === "sending" ? "Wird gesendet …" : "Anfrage absenden"}
            </button>
          <a
            className={styles.whatsapp}
            href={`https://wa.me/${contact.whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Per WhatsApp kontaktieren (öffnet einen neuen Tab)"
          >
            Per WhatsApp kontaktieren
          </a>
            </div>
          </fieldset>
          {!contact.formEnabled && <p className={styles.note}>
            Der Formularversand ist noch nicht verfügbar. Schreib mir gerne per{' '}
            <a href={`mailto:${contact.email}`}>E-Mail</a> oder WhatsApp.
          </p>}
          <p
            className={styles.status}
            role="status"
            aria-live="polite"
            data-error={status === "error"}
          >
            {message}
          </p>

        </form>
      </div>
    </section>
  );
}

// Presentation-only translation of existing API messages; the API contract is unchanged.
function personalMessage(message: string) {
  return message
    .replaceAll('Bitte versuchen Sie', 'Bitte versuche')
    .replaceAll('nutzen Sie', 'nutze')
    .replaceAll('Bitte verwenden Sie', 'Bitte verwende')
    .replaceAll('Bitte prüfen Sie', 'Bitte prüfe')
    .replaceAll('Ihre Eingaben', 'deine Eingaben')
    .replaceAll('Bitte geben Sie', 'Bitte gib')
    .replaceAll('Bitte laden Sie', 'Bitte lade')
    .replaceAll('Bitte warten Sie', 'Bitte warte')
    .replaceAll('versuchen Sie', 'versuche')
    .replaceAll('Ihrer', 'deiner')
    .replaceAll('Ihre', 'Deine');
}
