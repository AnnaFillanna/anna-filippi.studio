# Kontaktformular: E-Mail über Resend

Aktueller Ablauf: `/api/contact` validiert die Anfrage, prüft Origin, Honeypot, Rate Limit (5 je IP/10 Minuten), `CONTACT_ENABLED` und den Redis-Schalter `contact:control:enabled`. Anschließend sendet `server/contact-delivery.js` ausschließlich an Resend. Es gibt keine Supabase-Konfiguration, SQL-Abfrage oder Speicherung in `kontaktanfragen` mehr im Kontaktprozess.

Die E-Mail enthält Name, E-Mail, Projekt, Budget und Nachricht. Die validierte Interessentenadresse ist `reply_to`. Erfolg erst nach bestätigter Resend-ID und bestätigtem Redis-Abschluss; dies bestätigt die Annahme des Versandauftrags, nicht die Zustellung im Postfach. Das Frontend verhindert paralleles Absenden und behält bei Fehlern die Angaben sowie die Anfrage-ID bei. Design und Formularfreigabe bleiben unverändert.

## Erforderliche Vercel-Variablen (serverseitig)

- `RESEND_API_KEY`: Sending-Key für eine verifizierte Absenderdomain.
- `CONTACT_EMAIL_FROM`: zulässiger Absender auf dieser Domain.
- `CONTACT_EMAIL_TO`: eigenes Empfangspostfach.
- `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`: REST-Zugang zur bestehenden Redis-Datenbank mit EVAL/GET/SET/INCR/EXPIRE.
- `RATE_LIMIT_SECRET`: mindestens 32 zufällige Zeichen; nicht bei jeder Veröffentlichung wechseln.
- `CONTACT_ALLOWED_ORIGINS`: exakte erlaubte Origins, kommasepariert, z.B. `https://annafilippi.studio` ohne abschließenden Slash.
- `CONTACT_ENABLED`: exakt `true` für aktivierten Versand.

Zusätzlich muss Redis `GET contact:control:enabled` exakt `true` liefern. Der bestehende Frontendschalter `formEnabled` bleibt erhalten. Alte Aliase `CONTACT_FROM`, `CONTACT_TO`, `UPSPLASH_REDIS_REST_TOKEN` bleiben kompatibel; die oben genannten Namen haben Vorrang. Keine Secrets mit `VITE_`-Präfix verwenden.

Nicht mehr für Kontakt benötigt: `SUPABASE_URL`, `SUPABASE_SECRET_KEY`, `VITE_SUPABASE_URL`. `VITE_SUPABASE_PUBLISHABLE_KEY` war für den serverseitigen Kontaktversand ohnehin nicht erforderlich. Der vorhandene allgemeine Supabase-Client, seine `VITE_SUPABASE_*`-Konfiguration und das Paket bleiben unverändert. Im aktuellen Anwendungscode ist kein Aufrufer dieses Clients vorhanden; seine Entfernung ist nicht Teil dieser Kontaktumstellung. Keine produktiven Variablen, Tabellen oder Altanfragen wurden gelöscht. Vor dem Entfernen weiterer Variablen andere Anwendungen und Integrationen prüfen.

## Wiederholungen und Umstellung

Redis enthält nur HMAC-Fingerprint, Phase und Zeitstempel, keine Klartext-Formularinhalte. Reservierung und Zustandswechsel bleiben atomar. Wiederholungen und parallele Aufrufe verwenden denselben Resend-Idempotenzschlüssel; abgeschlossene IDs senden nicht erneut. Nach 23 Stunden wird ein unbestätigter Versand nicht automatisch wiederholt (Resend hält Schlüssel 24 Stunden vor). Unklare Zustände administrativ prüfen, keine neue ID als automatischen Wiederholungsversuch erzeugen.

Bestehender Redis-Namensraum bleibt erhalten. Alte IDs aus dem Supabase-Ablauf haben einen anderen Fingerprint und werden abgewiesen, ohne deren Zustand zu ändern. So löst ein alter Browser-Retry nach dem Deployment keine zweite E-Mail aus. Vor manueller erneuter Anfrage Resend/Altbestand prüfen. Keine Redis-Schlüssel löschen oder flushen. Zustände behalten wie bisher keine TTL; Speicherbedarf beobachten. Eine neue Anfrage-ID ist weiterhin eine neue Anfrage; keine pauschale Exactly-once-Garantie.

## Datenschutz und Inbetriebnahme

Der Formularhinweis sagt nur, dass Angaben zur Bearbeitung der Anfrage verwendet werden; das bleibt zutreffend. Rechtstexte der Kanzlei werden nicht automatisch umformuliert. Falls die bereitgestellte Datenschutzerklärung die Speicherung von Kontaktanfragen in Supabase beschreibt, im IT-Recht-Kanzlei-Portal aktualisieren lassen. Resend, E-Mail-Aufbewahrung und Upstash-Sicherheitsverarbeitung bestehen weiterhin; nicht behaupten, dass keinerlei Speicherung stattfindet. Alte Supabase-Datensätze bleiben erhalten.

Nach Veröffentlichung die Variablen und Redis-Freigabe prüfen. Eine pausierte Supabase-Datenbank verhindert jetzt keine Kontaktanfrage mehr. Ein freigegebener manueller Test sollte einmalig mit eigenen Testangaben erfolgen; Resend-Status und Postfach prüfen. Automatisierte Tests senden keine echten E-Mails und greifen auf keine echten Datenbanken zu.

Prüfungen: `npm run typecheck`, `npm run lint`, `npm test` (einschließlich Production Build), zusätzlich `npx eslint api/contact.js server/contact-delivery.js tests/contact*.test.mjs --max-warnings 0`.

Offizielle Resend-Dokumentation: https://resend.com/docs/dashboard/emails/idempotency-keys und https://resend.com/docs/api-reference/emails/send-email.

Prüfergebnis: TypeScript, Frontend- und Server-ESLint, Production Build sowie alle 92 Tests erfolgreich. Keine echte E-Mail versendet; produktive Zugangsdaten und Zustellung wurden nicht live geprüft.
