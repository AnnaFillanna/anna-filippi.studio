# Serverseitiger Kontakt-Schalter

Lokal implementiert, noch nicht veröffentlicht. Production und src/config/contact.ts bleiben deaktiviert. Es wurden keine produktiven Redis-Werte geändert.

## Bedienung nach freigegebener Veröffentlichung

1. Im Upstash-Dashboard die Datenbank auswählen, deren REST-URL in Vercel Production verwendet wird. Nicht anhand eines ähnlichen Namens raten.
2. In deren Redis-Konsole ausschalten:
   ```redis
   SET contact:control:enabled false
   GET contact:control:enabled
   TTL contact:control:enabled
   ```
   Erwartet: OK, false, -1 (kein Ablauf). SET ohne EX entfernt eine eventuell vorhandene TTL. Keine anderen Schlüssel löschen, kein FLUSHDB/FLUSHALL.
3. Nur nach ausdrücklicher Aktivierungsfreigabe einschalten:
   ```redis
   SET contact:control:enabled true
   ```
   Der Redis-String muss exakt true sein, ohne Leerraum. TRUE, 1, false, fehlender Schlüssel und Redis-Fehler erlauben keinen neuen INSERT/Versand. Einen falschen Datentyp behebt SET ebenfalls, ohne andere Schlüssel anzutasten.
4. CONTACT_ENABLED=true ist weiterhin zusätzlich nötig. Bei false oder fehlender Umgebungsvariable bleibt der Server unabhängig von Redis gesperrt. Das Frontend bleibt separat durch formEnabled:false deaktiviert.

Nur berechtigte Administratoren bedienen die Upstash-Konsole. Es gibt keinen öffentlichen Verwaltungsendpunkt und keine neuen Secrets. Redis-Schalteränderungen benötigen nach Veröffentlichung dieses Codes keinen neuen Website-Build.

## Ablauf

Nach bestehender Validierung und Rate-Limit-Prüfung erfolgt ein einzelnes EVAL: Schalter lesen und nur bei true die dauerhafte Anfrage-Reservierung mit SET NX anlegen. Ausgeschaltet entsteht keine Reservierung. Rate-Limit-Zähler können trotzdem steigen; ungültige Anfragen behalten ihre bisherigen 4xx-Antworten, bereits limitierte Anfragen 429. Gültige, nicht limitierte Anfragen erhalten bei gesperrtem Schalter 503/ok:false.

Vor jedem Resend-Aufruf erfolgt ein zweites, nicht gecachtes EVAL. Abschaltung nach dem INSERT verhindert dann den Mailversand, sofern die Sperre sichtbar ist. Die Zeile und der Redis-Status bleiben erhalten. Nach Wiederfreigabe kann dieselbe ID innerhalb des bisherigen Retry-Fensters ohne zweiten INSERT fortgesetzt werden. Der 23-Stunden-Zähler wird nicht zurückgesetzt. Auch Wiederholungen abgeschlossener Anfragen werden bei ausgeschaltetem Schalter mit 503 gesperrt.

## Konsistenz und Grenzen

Lua verbindet Prüfung und Reservierung atomar innerhalb einer Redis-Skriptausführung. Das ist keine globale linearisierbare Transaktion zwischen Upstash, Supabase und Resend. Upstash dokumentiert eventual consistency und asynchrone Replikation; der Anwendungscode verwendet REST ohne gemeinsame kausale Sitzung mit der Dashboard-Änderung. Auch ein EVAL-Lesezugriff allein beweist keine sofortige Sichtbarkeit einer administrativen Änderung auf jeder Replica. Keine feste maximale Abschaltlatenz zugesichert.

Ein bereits freigegebener oder laufender INSERT/Mailaufruf kann nach dem Ausschalten noch enden. Die zweite Prüfung verkleinert dieses Fenster, beseitigt es nicht. Wenn ein hartes sofortiges Blockieren erforderlich ist, zusätzlich eine zuvor geprüfte Vercel-Firewall-Regel für /api/contact verwenden oder auf einen nachweislich deaktivierten Stand zurückrollen. Eine Änderung von CONTACT_ENABLED braucht ein neues Deployment und ist kein sofortiger Ersatz.

## Abschaltung später kontrolliert prüfen

Aktuell nur Mock-Tests. Für einen Live-Nachweis ist eine separate Freigabe nötig: solange CONTACT_ENABLED=false ist, beweist eine 503-Antwort nur die übergeordnete Sperre, nicht den Redis-Schalter.

Nach freigegebener Veröffentlichung zunächst false setzen und administrativ lesen. Erst in einem ausdrücklich freigegebenen Testfenster mit aktiver übergeordneter Freigabe eine synthetische gültige Anfrage einmal ausführen: erwartet 503/ok:false, keine passende Supabase-Zeile, keine Resend-Nachricht und keine neue Reservierung. Bestehende Kundenanfragen nicht als Test verwenden. Wegen möglicher Replikationsverzögerungen wäre ein solcher Live-Test nicht garantiert nebenwirkungsfrei; bei unerwartetem Erfolg sofort prüfen und nicht erneut senden. Kein automatisches Polling mit gültigen Anfragen.

Vercel Runtime Logs nach Deployment, Zeitpunkt und /api/contact filtern; keine Bodies, Tokens oder personenbezogenen Details protokollieren. Supabase und Resend administrativ anhand einer synthetischen Markierung abgleichen. Bereits laufende Anfragen gesondert berücksichtigen.

## Tests und Veröffentlichung

Mocks prüfen exakte Werte, fehlenden Schlüssel, Redis-Ausfälle, Abschaltung zwischen INSERT und Mail, gesperrte Wiederholungen und Wiederfreigabe ohne zweiten INSERT. Sie sind kein Beweis der tatsächlichen Upstash-Replikationslatenz.

Vor Veröffentlichung Diff und Tests prüfen, Freigabe für Commit/Push/Deployment einholen, danach in der richtigen Redis-Datenbank den Schlüssel zunächst auf false anlegen. Bis zur separaten Testfreigabe CONTACT_ENABLED=false und formEnabled:false behalten. Kein Datenbankumbau erforderlich.

Quelle: https://upstash.com/docs/redis/features/consistency

## Offener Prüfpunkt vor Aktivierung

Die Zuordnung der in Vercel Production hinterlegten UPSTASH_REDIS_REST_URL und UPSTASH_REDIS_REST_TOKEN zur Datenbank annafilippi-legal ist noch nicht unabhängig bestätigt. Laut Projektinhaberin ist dort contact:control:enabled=false gesetzt. Die Veröffentlichung bei deaktivierter Kontaktfunktion ist ausdrücklich freigegeben; die tatsächliche Zuordnung und Verbindung müssen vor Aktivierung überprüft werden. CONTACT_ENABLED=false und formEnabled:false bleiben bestehen.
