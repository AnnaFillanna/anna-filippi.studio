# Kontaktformular: Supabase und E-Mail

Implementiert, nicht deployed. Kein echter INSERT und keine echte E-Mail wurden ausgeführt. Die produktive Datenbank und ihre Rechte wurden nicht verändert. Der bestehende Schalter `formEnabled: false` bleibt unverändert.

## Ablauf und Berechtigungen

`api/contact.js` behält POST/JSON-Prüfung, erlaubte Origins, 16-KB-Limit, Pflichtfelder, Zeichenlimits, feste Projekt-/Budgetoptionen, Honeypot, Trimmen und Upstash-Rate-Limit (5 je IP/10 Minuten). Die Request-ID muss jetzt das UUID-Layout besitzen. Öffentliche Formulare sind ohne Anmeldung erreichbar; Origin/Honeypot sind keine Authentifizierung und ersetzen keinen Missbrauchsschutz.

Nach der Validierung wird über `server/contact-delivery.js` zuerst ein Redis-Verarbeitungsstatus reserviert, dann in Supabase gespeichert, danach die unveränderte E-Mail-Nutzlast an Resend gesendet. Erfolg bedeutet: Supabase hat mit HTTP 201 bestätigt, Resend hat eine E-Mail-ID geliefert und der Abschluss wurde in Redis bestätigt. Das garantiert nicht die Zustellung im Posteingang.

Der Server nutzt einen direkten PostgREST-POST an `/rest/v1/kontaktanfragen` mit `Prefer: return=minimal`, ohne SELECT, RETURNING, upsert oder count. JSON enthält ausschließlich `name`, `email`, `project`, `budget`, `message`. UUID, Zeitpunkt und Status kommen aus PostgreSQL. Damit sind nur die vorhandenen INSERT-Spaltenrechte nötig. Der Secret Key wird als `apikey` gesendet, nicht als Benutzer-JWT. Es gibt keine React-Imports, Browser-Sessions oder Ausgabe von Schlüsseln/Personendaten in Logs.

## Wiederholungen und Teilfehler

Redis-Schlüssel `contact:delivery:v1:<SHA256 der Request-ID>` enthält nur HMAC-Fingerprint, Phase und gegebenenfalls den Beginn des E-Mail-Versuchs. Keine Namen, E-Mails oder Nachrichten. Der Fingerprint bindet die ID an die normalisierten Felder, das Supabase-Ziel und die vollständige E-Mail-Nutzlast einschließlich Empfänger. Andere Angaben unter derselben ID ergeben HTTP 409.

- `storing`: atomare Reservierung mit SET NX vor dem INSERT. Nur der Gewinner darf schreiben. Parallele Versuche werden vorläufig abgewiesen.
- `stored`: Supabase hat bestätigt und die Bestätigung wurde dauerhaft in Redis festgehalten. Kein weiterer INSERT für diese ID.
- `mail_pending`: vor dem Resend-Aufruf atomar gesetzt. Wiederholungen senden nur die E-Mail, mit identischem Resend-Idempotenzschlüssel. Gleichzeitige Mailversuche werden durch Resend dedupliziert.
- `done`: Wiederholung bestätigt Erfolg ohne erneuten INSERT oder Versand.

Redis-Zustandswechsel sind atomare Compare-and-Set-Lua-Befehle. Ein Verbindungsfehler kann trotzdem dazu führen, dass eine bereits ausgeführte Operation nicht bestätigt wurde. Deshalb:

| Störung | Verhalten |
| --- | --- |
| Fehlender Secret Key / ungültige Konfiguration | HTTP 503; keine externen Aufrufe |
| Redis vor Reservierung nicht erreichbar | HTTP 503; kein INSERT / Versand |
| Supabase nicht bestätigt (auch Timeout/5xx) | HTTP 503; kein Versand, kein automatischer erneuter INSERT |
| Supabase bestätigt, aber Redis-Status nicht bestätigt | HTTP 503; vor Wiederholung muss der tatsächliche Status geklärt werden |
| Resend-Fehler oder fehlende E-Mail-ID | HTTP 502 bzw. 503; Speicherung bleibt erhalten, Mail kann erneut versucht werden |
| Resend bestätigt, Redis-Abschluss nicht bestätigt | Kein Erfolg gemeldet; erneuter Mailversuch mit gleichem Schlüssel |
| E-Mail-Versuch 23 Stunden alt | Kein weiterer automatischer Versand; administrative Prüfung |

Resend bewahrt Idempotenzschlüssel 24 Stunden auf. Die Anwendung stoppt nach 23 Stunden ab dem ersten Versuch, damit eine spät wiederholte E-Mail nicht außerhalb dieses Fensters doppelt gesendet wird.

**Keine Exactly-once-Garantie:** Ohne Datenbank-Idempotenzspalte/Unique-Constraint und ohne SELECT-Rechte kann ein unklarer INSERT nicht automatisch aufgelöst werden. Die Anwendung bevorzugt dann eine manuelle Klärung gegenüber einem möglichen Duplikat. Ein Prozessabbruch direkt nach Reservierung kann ebenfalls eine manuell zu klärende Anfrage hinterlassen. Bei einem eindeutig korrigierten Konfigurationsfehler trotzdem nicht pauschal Redis-Einträge löschen: erst Datenbank und Resend administrativ prüfen. Es gibt keine automatische Hintergrund-Nachsendung.

Der Schutz gilt für dieselbe Request-ID. Ein Neuladen der Formularseite erzeugt wie bisher eine neue ID; identische Inhalte mit einer neuen ID können erneut gespeichert werden. Dauerhafte browserseitige Speicherung von Kontaktinhalten wurde bewusst nicht hinzugefügt.

Die Redis-Zustände haben **keine TTL**. Sie müssen erhalten bleiben: keine Eviction, kein Flush und kein automatisches Löschen dieses Präfixes. Speicherbedarf/Quota und Aufbewahrung der pseudonymen Metadaten vor Freigabe festlegen und überwachen. Ein Verlust der Redis-Zustände kann trotz dieser Logik Duplikate erlauben. `RATE_LIMIT_SECRET` nicht unkoordiniert wechseln: vorhandene Fingerprints würden nicht mehr übereinstimmen (409). Preview und Production brauchen getrennte Redis-Datenbanken und Supabase-Testdaten, da dieselbe Request-ID sonst kollidieren kann.

## Fehlende Konfiguration / kontrollierter Test

Lokale Prüfung vom 21.10.2026: `SUPABASE_SECRET_KEY` ist vorhanden und das Format wird akzeptiert. Der Schlüssel wurde weder ausgegeben noch geändert. Keine Treffer seines tatsächlichen Wertes im Production-Bundle, in nicht ignorierten Projektdateien oder der erreichbaren Git-Historie. Vercel-Secrets wurden nicht ausgelesen. Lokal fehlen weiterhin Resend-, Upstash- und Kontaktvariablen einschließlich RATE_LIMIT_SECRET; CONTACT_ENABLED ist nicht true. Die lokale Gesamtumgebung ist daher noch nicht live-testbereit.

Vor einem ausdrücklich freigegebenen Test:

1. `SUPABASE_SECRET_KEY` als **serverseitige** Vercel-Variable setzen, Format `sb_secret_…`. Niemals `VITE_SUPABASE_SECRET_KEY` oder Schlüssel im Frontend. Die bestehende `VITE_SUPABASE_URL` wird serverseitig gelesen; optional kann `SUPABASE_URL` dieselbe Projekt-URL explizit vorgeben. Der Publishable Key genügt hier nicht.
2. Resend, CONTACT_FROM/TO, Origin-Allowlist, Redis und RATE_LIMIT_SECRET erhalten. `CONTACT_ALLOWED_ORIGINS` muss die tatsächliche Origin enthalten (Production: `https://annafilippi.studio`, nicht der alte Beispielname mit Bindestrich). In Preview nur die bewusst verwendete Test-Origin zulassen. Die lokale Allowlist und die Konfigurationsvorlage enthalten jetzt ausdrücklich `https://annafilippi.studio`. `https://www.annafilippi.studio` leitet per HTTP 307 auf diese Origin weiter und benötigt daher keinen eigenen Eintrag. Die Vercel-Konfiguration wurde nicht verändert.
3. Getrennte Testumgebung und Testempfänger konfigurieren. Node 22 oder neuer und ausreichend Laufzeit für die sequenziellen Aufrufe bereitstellen (z.B. 60 Sekunden). Vite `npm run dev` allein führt keine Vercel-API aus; einen Vercel-kompatiblen lokalen Server bzw. eine freigegebene Preview verwenden. Lokale `.env.local` muss in der Serverumgebung geladen werden.
4. Zunächst `CONTACT_ENABLED=false` lassen. Erst nach Prüfung der Testkonfiguration auf true setzen. Die UI bleibt deaktiviert; ihre Freischaltung ist ein separater Schritt. Kontrollierte API-Tests können mit einer neuen Test-UUID und synthetischen Daten erfolgen. **In dieser Aufgabe wurden ausschließlich Mocks verwendet.**
5. Administrativ kontrollieren: exakt eine Tabellenzeile, automatisch gesetzte Metadaten, Resend-Bestätigung; erneuter Aufruf mit derselben ID/gleichen Daten ohne zusätzliche Zeile/E-Mail; Datenänderung mit gleicher ID → 409. Auch reale Spaltenberechtigungen, Upstash-Lua und Paketierung des Servermoduls im Vercel-Deployment prüfen. Keine zusätzlichen SELECT-Rechte zur Vereinfachung vergeben.
6. Vor Produktionsfreigabe Verhalten bei unklaren Zuständen sowie Aufbewahrung/Löschung und Datenschutzhinweise für zusätzliche Supabase-Speicherung abstimmen.

## Lokale Prüfungen

`npm run typecheck`, `npm run lint`, `npm run build`, `npm test`, `node --test tests/*.test.mjs`.
Zusätzlich ESLint für `api/contact.js`, `server/contact-delivery.js` und die Kontakttests ausführen. Tests simulieren Redis-CAS und externe APIs; sie sind kein Live-Nachweis der produktiven Datenbankrechte oder von Redis-Durability.

Quellen:
- https://supabase.com/docs/guides/api/api-keys
- https://resend.com/changelog/idempotency-keys

## Ergebnis der erneuten sicheren Prüfung (21.10.2026)

58 Tests bestanden (14 Routing, 44 weitere Tests), außerdem TypeScript, ESLint für Frontend und betroffenen Server-/Testcode sowie Production Build. Zusätzliche Mock-Fälle prüfen verlorene Redis-Reservierungsantworten, beschädigte Zustände, unveränderte Mail-Retry-Frist, fehlerhafte Eingaben, echte Domain-Schreibweise in der Origin-Allowlist und fehlende Erfolgsmeldungen bei Rate-Limits. Anwendungscode und SQL wurden bei dieser Prüfung nicht verändert.

Die beschriebenen Rechte sind konzeptionell kompatibel: Secret Keys verwenden die Rolle service_role, die RLS umgeht, aber die INSERT-Spaltenrechte weiterhin benötigt. Die Anwendung fordert keine zurückgegebenen Datensätze an. Die tatsächlichen Rollenrechte, Schlüsselgültigkeit, Resend-Absenderfreigabe, Vercel-Paketierung und Redis-Eviction/Persistenz wurden bewusst nicht live überprüft.

Freigabe: Code für einen kontrollierten Live-Test vorbereitet; die oben genannten Konfigurations- und Infrastrukturprüfungen müssen vorher abgeschlossen werden. Keine Live-Anfragen, Datenbankänderungen, Commits, Pushes oder Deployments durchgeführt.

## Veröffentlichungsstand

Die Veröffentlichung des geprüften Codes wurde am 21.10.2026 freigegeben. Die Formularoberfläche bleibt zunächst mit `formEnabled: false` gesperrt. Im Vercel-Production-Dashboard sind Supabase-, Resend-, Kontakt- und beide Upstash-Variablen eingetragen; `RATE_LIMIT_SECRET` fehlt bei dieser Prüfung noch. Schlüsselwerte und Funktionsfähigkeit der Dienste sind dadurch nicht bestätigt. Erst nach Ergänzung und kontrolliertem Test die Oberfläche freischalten. Die Datenbankmigration wurde laut Projektinhaberin bereits ausgeführt und darf nicht erneut angewendet werden.
