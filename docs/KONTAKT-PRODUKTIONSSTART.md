# Kontrollierter Produktionsstart – nur Vorbereitung

Dieser Plan ersetzt die Preview-Strategie für den nächsten freizugebenden Test. Die ältere Preview-Anleitung bleibt als Dokument erhalten. Keine Aktivierung, Live-Anfrage, Migration, Änderung produktiver Variablen, kein Commit/Push/Deployment durchgeführt.

## Befund und Grenzen

Code und vorbereitete SQL-Rechte passen zusammen: INSERT nur name/email/project/budget/message, Prefer:return=minimal, keine Leseabfrage; Metadaten aus PostgreSQL. Secret Key nur serverseitig als apikey. Die tatsächlichen produktiven Rollenrechte und die Gültigkeit des Schlüssels sind nicht durch Codeprüfung bewiesen.

CONTACT_ENABLED muss exakt true sein, bevor irgendein externer Aufruf erfolgt. formEnabled bleibt in src/config/contact.ts false. Keine Layoutänderung erforderlich; die spätere Änderung besteht ausschließlich aus false → true in dieser Einstellung. Ein aktivierter Server bei deaktivierter Oberfläche ist trotzdem öffentlich aufrufbar: Origin ist keine Authentifizierung.

## Produktionskonfiguration vor Freigabe überprüfen

| Name | Prüfung ohne Veröffentlichung des Werts |
| --- | --- |
| VITE_SUPABASE_URL | URL des bestehenden Produktionsprojekts |
| SUPABASE_URL | optional; falls gesetzt, überschreibt sie VITE_SUPABASE_URL und muss auf dasselbe Projekt zeigen |
| SUPABASE_SECRET_KEY | Secret Key dieses Projekts, sb_secret_-Format; kein VITE_-Präfix |
| RESEND_API_KEY | gültiger Sending-Access-Key für verifizierte Domain |
| CONTACT_FROM | Adresse auf annafilippi.studio, bei Resend zulässig |
| CONTACT_TO | bestätigtes eigenes Empfangspostfach, keine versehentliche Kundenadresse |
| CONTACT_ALLOWED_ORIGINS | exakt https://annafilippi.studio ohne abschließenden Slash oder Wildcard |
| CONTACT_ENABLED | bleibt bis zur ausdrücklichen Freigabe false |
| UPSTASH_REDIS_REST_URL | HTTPS-REST-Endpunkt der vorgesehenen Redis-Datenbank |
| UPSTASH_REDIS_REST_TOKEN | zugehöriges schreibfähiges Token, EVAL/GET/SET/INCR/EXPIRE verfügbar |
| RATE_LIMIT_SECRET | zufällig, mindestens 32 Zeichen; nicht während des Tests wechseln |

Der alte Alias UPSPLASH_REDIS_REST_TOKEN wird noch unterstützt; der korrekt geschriebene Name hat Vorrang. VITE_SUPABASE_PUBLISHABLE_KEY ist nur für den Browserclient, nicht für den Kontakt-INSERT nötig. Keine geheimen Werte in Browservariablen oder Logs. Die Konfigurationsprüfungen prüfen Vorhandensein und teilweise Format, nicht die tatsächliche Berechtigung bei den Anbietern.

Lokale .env.local enthält nicht sämtliche Servervariablen; das ist kein Nachweis fehlender Production-Variablen. Laut Nutzer sind diese in Production eingerichtet. Aktuelle Werte und Infrastrukturkonfiguration müssen im Dashboard geprüft werden, ohne sie in Berichte zu kopieren. Die Datei bleibt von Git ignoriert.

## Redis: langfristiges Risiko und sichere Weiterentwicklung

Rate-Limit-Schlüssel haben 600 Sekunden TTL. Zustände contact:delivery:v1:* haben absichtlich keine TTL. Pro neuer gültiger Anfrage-ID wächst die Anzahl dauerhaft; auch gescheiterte INSERT-Versuche hinterlassen Reservierungen. Speicher-/Kostenwachstum und Quota können deshalb langfristig zu Ausfällen führen. Bei gemeinsamer Nutzung mit der Legal-API kann eine volle Redis-Datenbank auch deren Schreibzugriffe beeinträchtigen.

Für einen einzelnen Test: freie Kapazität und deaktivierte Eviction bestätigen, kein Flush, keine unkoordinierten Löschungen. Redis-Ausfall führt zu 503 statt ungesichertem Versand. Speicherverbrauch und Fehlerquote überwachen; regulär Betriebsverantwortung und Bearbeitung unklarer Zustände festlegen. Schutz gilt nur bei gleicher UUID und erhaltenen Zuständen. Neue UUID nach Neuladen kann einen zweiten Datensatz erzeugen.

Nicht einfach TTL ergänzen: nach Ablauf kann dieselbe alte Anfrage erneut INSERT und Versand auslösen. Auch abgeschlossene Einträge sind dafür erforderlich.

Sichere spätere Lösung (separater Entwicklungsauftrag, keine aktuelle Datenbankänderung): dauerhafte Idempotenz-ID mit Unique-Constraint und Nutzlastbindung in PostgreSQL; atomare Registrierung von Anfrage und Versandauftrag (Outbox), separater Zustellstatus und definierte manuelle Klärung nach dem Resend-Idempotenzfenster. Dann Redis nur als begrenzten Cache/Rate-Limiter verwenden. Eine endliche Aufbewahrung braucht zusätzlich eine serverseitig überprüfbare Gültigkeitsfrist für alte Anfragen; sonst kehrt das Replay-Risiko nach Löschung zurück. Erfordert geplante Migration, Rechteänderung und Ausfalltests, keine Exactly-once-Zustellgarantie behaupten.

## Fehlerverhalten

- Redis vor Reservierung nicht erreichbar: 503, kein INSERT und keine Mail.
- Supabase lehnt INSERT ab oder Ergebnis ist unklar: 503, keine Mail; Reservierung bleibt zur Klärung. Nicht automatisch mit neuer UUID senden.
- Supabase erfolgreich, Redis-Bestätigung fehlt: mögliche vorhandene Zeile, keine sichere Erfolgsmeldung.
- Resend lehnt ab/Timeout: 502 oder 503; Zeile bleibt bestehen. Gleiche UUID kann innerhalb des vorgesehenen Fensters nur den Mailversuch wiederholen.
- Erfolg erst bei bestätigter Zeile, Resend-ID und bestätigtem Redis-Abschluss. Das beweist noch nicht die Zustellung im Postfach.
- Browser-Timeout nach 25 Sekunden kann auftreten, während der Server weiterarbeitet. Keine zweite Anfrage erzeugen. Vercel-Laufzeit passend zu den sequenziellen Redis-/Provider-Zeitlimits prüfen; nominaler erster Erfolgsweg hat bis zu 22 Sekunden Netzwerk-Timeoutbudget plus Laufzeit.

## Ablauf nach ausdrücklicher Freigabe: genau eine Testanfrage

1. Eigenes Zielpostfach und verifizierten Absender im Dashboard bestätigen. Aktuelles deaktiviertes Deployment als Rücknahmeziel notieren. Produktionsrechte administrativ prüfen, keine Server-SELECT-Rechte hinzufügen.
2. Testfenster vereinbaren. Nach Freigabe CONTACT_ENABLED=true setzen, formEnabled in src/config/contact.ts auf true ändern, Checks ausführen und kontrolliert veröffentlichen. Erst bei Ready auf der richtigen Domain beginnen. Ab diesem Zeitpunkt ist die Form öffentlich; ohne zusätzlichen Zugriffsschutz lässt sich nicht garantieren, dass niemand anderes parallel sendet. Die Einmaligkeitsprüfung bezieht sich daher auf die eindeutige Testmarkierung.
3. Einmalig eine Markierung KONTAKT-E2E-<UTC-Zeitstempel> festlegen. Name: Test mit Markierung; E-Mail: eigenes Testpostfach; Projekt: Etwas anderes; Budget: leer; Nachricht: synthetischer Text mit Markierung, keine Kundendaten. Honeypot leer lassen.
4. Auf https://annafilippi.studio das echte Formular genau einmal absenden. Request-UUID, UTC-Zeit und HTTP-Status für die Zuordnung festhalten, keine Headers/Cookies/Secrets exportieren. Nicht doppelt klicken, nicht neu laden oder erneut absenden.
5. Bei 200/ok:true die sichtbare Erfolgsmeldung prüfen. Bei Fehler oder Timeout sofort weitere Versuche stoppen und die drei Dienste kontrollieren. Kein automatisches Retry in diesem Ein-Anfrage-Test.
6. Supabase: Table Editor administrativ nach der Testmarkierung filtern. Exakt eine passende Zeile, richtige fünf Felder, automatische UUID/created_at/status=neu. Keine fremden Datensätze exportieren.
7. Resend: Nachricht anhand Zeit, Empfänger und Markierung finden; genau ein Versand und Ereignis Delivered prüfen. Zusätzlich tatsächlichen Eingang und gegebenenfalls Spamordner prüfen. Delivered bedeutet Annahme durch den Empfängerserver, nicht zwingend Posteingang.
8. Redis: Schlüssel aus SHA256 der ursprünglichen Request-UUID identifizieren, phase=done und TTL=-1 prüfen. Keine Rohdaten in Reports. Rate-Limit-Zähler nicht manuell zurücksetzen.
9. Vercel: Project → Logs/Runtime Logs, Production-Deployment, Zeitfenster, Pfad /api/contact und Methode POST filtern. Status, Dauer, Invocation/Request-ID, Laufzeitfehler und Timeout prüfen. Der Code protokolliert bewusst keine Anbieterfehlertexte oder personenbezogenen Inhalte. Vercel-Logs allein können deshalb die Fehlerphase oder Zustellung nicht vollständig belegen; mit Supabase/Redis/Resend abgleichen. Keine vollständigen Request-Bodies, Cookies oder Authorization-Headers loggen.
10. Ergebnis dokumentieren, keine Testdaten automatisch löschen. Eine Duplikatprüfung wäre ein zusätzlicher ausdrücklich freizugebender HTTP-Aufruf mit exakt derselben UUID und Nutzlast; eine einzelne Anfrage beweist sie live nicht.

## Sofortige Rücknahme bei Problemen

CONTACT_ENABLED ist aktuell kein dynamischer Not-Aus: eine Änderung in Vercel wirkt erst in einem neuen Deployment. Nur den Dashboard-Wert auf false zu setzen stoppt das laufende Deployment nicht.

Vor Freigabe den Vercel-Rollback auf ein nachweislich deaktiviertes Deployment vorbereiten. Bei Störung auf dieses zurückrollen und CONTACT_ENABLED=false für zukünftige Deployments setzen; alternativ deaktivierten Stand neu deployen. Danach auch src/config/contact.ts wieder false halten. Alte aktivierte Deployment-URLs sind gesondert über Deployment Protection zu sperren; ein Domain-Rollback macht alte URLs nicht automatisch unwirksam. Bereits laufende Anfragen können trotz Rücknahme noch abgeschlossen werden und müssen abgeglichen werden.

Falls sofortiges Sperren vor Abschluss eines Deployments zwingend nötig ist: Verfügbarkeit einer gezielten Vercel-Firewall-Blockregel für /api/contact vorher prüfen und deren Anwendung separat freigeben. Keine globale Website-Sperre und keine pauschale Redis-/Supabase-/Resend-Key-Sperre, die andere Funktionen beeinträchtigt. Im jetzigen Code besteht kein redeploy-unabhängiger Kill-Switch.

## Freigabestatus

Für einen einzelnen überwachten Test konzeptionell vorbereitet, aber kein Live-Funktionsnachweis. Vor Aktivierung: tatsächliche Absender-/Empfängerwerte, Produktionsrechte, Redis-Kapazität/Eviction, Vercel-Laufzeit und Rücknahmemöglichkeit bestätigen. Für einen unbeaufsichtigten Dauerbetrieb müssen Wachstum und Klärung offener Zustände organisatorisch oder technisch gelöst werden.

Quellen:
- https://vercel.com/docs/environment-variables
- https://resend.com/changelog/improved-bounced-and-delivery-details
- https://upstash.com/docs/redis/features/eviction
