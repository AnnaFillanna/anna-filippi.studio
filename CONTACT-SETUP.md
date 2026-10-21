# Kontaktformular – Einrichtung

Aktuelle Ergänzung für Supabase-Speicherung, Wiederholungen und Testfreigabe: [Kontakt-Supabase-Anbindung](docs/KONTAKT-SUPABASE.md). Die folgende ursprüngliche Versanddokumentation beschreibt die bisherige Basis.

## Stand
Nur der vorhandene Footer wird umgebaut. Hero, Services, About und App bleiben unverändert. Keine neuen Pakete oder kostenpflichtigen Dienste eingerichtet. Kein Deployment durchgeführt.
Der Versand ist vorbereitet, aber erst nach Konfiguration nutzbar. `npm run dev` stellt nur Vite bereit und führt `/api/contact` nicht aus. Ein HTML-Fallback oder fehlender Endpunkt wird vom Formular als Fehler behandelt, niemals als Erfolg.
Vercel-Hosting war aus den lokalen Dateien nicht belegbar; die Website-Adresse wurde als anna-filippi.studio angegeben. Die API ist für Vercel Node Functions vorbereitet. Auf anderem Hosting ist ein kompatibler Node-Endpunkt erforderlich; reines statisches Hosting genügt nicht.

## Dateien
- src/components/Footer/Footer.tsx und Footer.module.scss: bestehender Footer, Formular und responsive Gestaltung ohne Hintergrundbild.
- src/config/contact.ts: öffentliche WhatsApp-Nummer, Endpunkt und Datenschutz-Link.
- api/contact.js: Vercel Node Function, native fetch-Aufrufe ohne SDK.
- .env.contact.example: ausschließlich Konfigurationsvorlage, keine Geheimnisse.
- tests/contact.test.mjs: isolierte Tests mit gemockten Diensten, ohne echte E-Mails.

## Einrichtung vor Freischaltung
1. Vercel-Projekt mit Vite-Preset, Build `npm run build`, Output `dist`, Node 22 verwenden. `api/contact.js` muss mit deployed werden. Vorhandene externe Rewrite-Regeln darauf prüfen, dass `/api/contact` nicht zur index.html umgeschrieben wird.
2. Resend-Konto/Absenderdomain nach eigener Auswahl einrichten. Domain per DNS verifizieren. `annafilippi@web.de` ist Empfänger, kein von dir verifizierbarer web.de-Absender. CONTACT_FROM muss zu einer eigenen, in Resend verifizierten Domain gehören. Kein Dienst wurde gebucht.
3. Für instanzübergreifendes Rate-Limiting einen Upstash Redis REST-Zugang bereitstellen. Tarif/Kosten vorher selbst prüfen; nichts wurde abonniert. Ohne Redis-Konfiguration wird kein Versand ausgeführt.
4. Folgende Variablen NUR serverseitig in Vercel Environment Variables setzen, niemals mit VITE_-Präfix:
   - RESEND_API_KEY
   - CONTACT_FROM: verifizierte Absenderadresse
   - CONTACT_TO: annafilippi@web.de
   - CONTACT_ALLOWED_ORIGINS: https://annafilippi.studio (nur tatsächlich genutzte Origins; Preview-URL bei Bedarf ausdrücklich hinzufügen)
   - UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN
   - RATE_LIMIT_SECRET: zufälliges Geheimnis, mindestens 32 Zeichen (z.B. `openssl rand -hex 32` lokal)
   - CONTACT_ENABLED: zunächst false, nach Abschluss true
5. Geprüfte Datenschutzerklärung veröffentlichen und deren tatsächliche URL in `src/config/contact.ts` als privacyUrl eintragen. Ohne Link bleibt der Senden-Button deaktiviert. Es wurde kein Rechtstext erfunden.
6. Anschließend neu bauen/deployen und eine eigene Testanfrage senden. Posteingang, Spamordner und Zustellstatus bei Resend prüfen. Erfolg bedeutet Annahme durch den E-Mail-Dienst, nicht garantierte Posteingangszustellung.

## WhatsApp
`src/config/contact.ts` → whatsappNumber, aktuell die zuvor angegebene Nummer `4917662310068`, international ohne + oder Leerzeichen. Keine Telefonnummer wird im Formular sichtbar ausgegeben.

## Datenschutz – Informationen für die Prüfung, kein fertiger Rechtstext
Erfasst werden Name, E-Mail, Projektart, freiwilliges Budget und Nachricht. Resend verarbeitet diese Angaben für den Versand; Empfänger ist das konfigurierte Postfach. Hosting- und Mailanbieter können eigene Protokolle führen. Es wird keine Newsletter-Anmeldung oder Tracking-Funktion angelegt. Upstash speichert für das Rate-Limit einen HMAC der IP-Adresse und einen Zähler für 10 Minuten; keine Formularinhalte. Die IP wird vor dem Speichern mit einem serverseitigen Geheimnis pseudonymisiert. Vertragsgrundlagen, Aufbewahrung, Anbieterregionen, Auftragsverarbeitung und mögliche Drittlandübermittlungen müssen für die tatsächlich gewählten Dienste geprüft und in der Datenschutzerklärung berücksichtigt werden. Aufbewahrungsfristen im Postfach und bei Resend selbst konfigurieren.

## Schutz und Grenzen
Serverseitig: feste Auswahlwerte, E-Mail-Prüfung, 100/254/5000-Zeichenlimits, 16-KB-Payloadlimit, Origin-Allowlist, Honeypot, 5 valide Anfragen pro IP in 10 Minuten über atomaren Redis-Zähler. Bei Redis-Ausfall wird Versand blockiert. Kein Nutzer kann Empfänger oder Absender setzen. Inhalte werden als Plaintext versandt. Keine Eingaben oder Schlüssel werden durch den Handler geloggt. Vercels vertrauenswürdiger IP-Header wird verwendet; für andere Hosts muss die Proxy-Vertrauensgrenze angepasst werden. Gegen großflächigen Missbrauch zusätzlich Hosting-WAF verwenden; Honeypot/Origin-Prüfung sind kein vollständiger Bot-Schutz.
Doppelklicks werden verhindert. Wiederholte Versuche mit unveränderten Eingaben nutzen denselben Resend-Idempotenzschlüssel innerhalb der geöffneten Seite. Nach Neuladen oder Änderungen kann eine erneute E-Mail entstehen. Zeitüberschreitungen bestätigen keinen Erfolg; die Eingaben bleiben erhalten.

## Prüfung
- `npx tsc --noEmit` bzw. `npm run build`
- `node --test tests/contact.test.mjs` (gemockte APIs, kein echter Versand)
- `npm run lint`: im bestehenden Projekt nicht konfiguriert; keine neue Lint-Abhängigkeit installiert.
- Lokaler End-to-End-Test mit Vercel CLI (`vercel dev`) und lokalen serverseitigen Environment Variables, falls CLI bereits eingerichtet. Origins inklusive lokaler Adresse explizit konfigurieren. Geheimnisse niemals committen.
- Nach Konfiguration: leere Felder, falsche E-Mail, erfolgreiche Zustellung, Providerfehler, sechste Anfrage, Tastaturbedienung und mobile Darstellung überprüfen.

## Offizielle Referenzen
- https://vercel.com/docs/functions/runtimes/node-js
- https://resend.com/docs/api-reference/emails/send-email
- https://upstash.com/docs/redis/features/restapi
