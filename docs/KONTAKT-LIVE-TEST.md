# Kontrollierter Kontakt-Live-Test – vorbereitet, nicht ausgeführt

Production bleibt unverändert: CONTACT_ENABLED=false und formEnabled:false.
Kein Commit, Push, Deployment oder Live-Aufruf ist Teil dieser Vorbereitung.

## Testumgebung

Eine separate Preview auf einem Testbranch verwenden, mit Vercel Deployment Protection (Vercel Authentication). Vor dem Aktivieren von CONTACT_ENABLED muss auch ein nicht angemeldeter Zugriff auf /api/contact durch die Deployment Protection blockiert werden. Eine unbekannte URL, Origin-Allowlist oder deaktivierte Schaltfläche allein schützt die API nicht.

Preview-Variablen nur für den Testbranch konfigurieren, nicht pauschal für alle Previews. Separate Supabase-Testdatenbank mit derselben vorhandenen Tabellenstruktur/Rechten und separate Upstash-Testdatenbank verwenden. Deren Einrichtung/Migration benötigt einen eigenen freigegebenen Schritt. Keine Produktionsschlüssel automatisch kopieren. Nur einen ausdrücklich festgelegten eigenen Testempfänger verwenden.

Benötigte Servervariablen:
- SUPABASE_URL oder VITE_SUPABASE_URL: HTTPS-URL des Testprojekts; SUPABASE_URL hat Vorrang.
- SUPABASE_SECRET_KEY: Secret Key desselben Testprojekts, ausschließlich serverseitig.
- RESEND_API_KEY: Versandberechtigung für die verifizierte Absenderdomain.
- CONTACT_FROM: freigegebener Absender.
- CONTACT_TO: eigener bestätigter Testempfänger.
- CONTACT_ALLOWED_ORIGINS: exakt die tatsächlich verwendete Preview-Origin, ohne Pfad/abschließenden Slash/Wildcards. Nach einer Änderung neu deployen und den tatsächlich verwendeten Host kontrollieren.
- CONTACT_ENABLED: erst in der geschützten Testumgebung true; Production bleibt false.
- UPSTASH_REDIS_REST_URL und UPSTASH_REDIS_REST_TOKEN: zusammengehöriger REST-Endpunkt und schreibfähiges Token der Testdatenbank, inklusive EVAL/GET/SET/INCR/EXPIRE.
- RATE_LIMIT_SECRET: eigenständiges zufälliges Geheimnis mit mindestens 32 Zeichen. Während der Wiederholungsprüfung nicht wechseln.

VITE_SUPABASE_PUBLISHABLE_KEY wird vom Browserclient verwendet, ist für den serverseitigen Kontakt-INSERT aber nicht erforderlich. Niemals einen Secret Key in eine VITE_-Variable schreiben.

Redis: persistente Zustände ohne TTL, keine Eviction oder Flush während des Tests. Die tatsächlichen Einstellungen und freie Kapazität kontrollieren. Keine Produktionsdatenbank dafür umkonfigurieren.

## Zwei Teststufen

1. API-Test: formEnabled bleibt false. Über eine authentifizierte Sitzung auf der geschützten Preview genau einen JSON-POST an deren /api/contact senden. Dies testet den Serverablauf, nicht die React-Formularbedienung.
2. Vollständiger Formular-E2E-Test: formEnabled ausschließlich auf dem isolierten Testbranch true setzen. Die Deployment Protection muss vorher bestätigt sein. Dieser Branch darf nicht mit aktiviertem Schalter nach main übernommen werden. Durch das echte Formular senden, um Browservalidierung, API und Erfolgsanzeige gemeinsam zu prüfen.

Nur eine der Stufen für den ersten Versand auswählen; beide auszuführen erzeugt zwei logische Testanfragen.

## Daten und Ablauf für genau eine logische Testanfrage

Vorher eine eindeutige Testmarkierung festlegen, etwa KONTAKT-E2E-<UTC-Zeitstempel>. Diese in name und message aufnehmen. Nur synthetische Inhalte verwenden; email ist ein eigener bestätigter Testkontakt. project = Etwas anderes, budget = leerer String, website = leerer String, message mindestens 10 Zeichen.

Beim API-Test einmal eine UUID als Idempotency-Key erzeugen und zusammen mit dem exakten Request-Body lokal für den Test behalten. Beim Formular-Test den ursprünglichen Request einschließlich UUID aus den Browser-Netzwerkdetails für die kontrollierte Wiederholung verwenden. Keine Schlüssel in Screenshots, URLs oder Berichte übernehmen.

1. Vorher administrativ prüfen: null Datensätze mit der Testmarkierung.
2. Einmal senden. Erwartung: HTTP 200 und ok:true, beim Formular-Test sichtbare Erfolgsmeldung.
3. Supabase administrativ im Dashboard prüfen: genau eine Zeile mit den fünf Formularfeldern, automatisch erzeugter UUID, created_at und status=neu. Keine SELECT-Rechte für den Server hinzufügen.
4. Resend prüfen: genau eine Nachricht mit passender Testmarkierung und Status Delivered; Eingang im eigenen Postfach kontrollieren. HTTP 200/E-Mail-ID allein beweist noch keine Zustellung.
5. Redis administrativ prüfen: contact:delivery:v1:<SHA256 der UUID> hat phase=done und keine Ablaufzeit (TTL=-1). Keine personenbezogenen Formularwerte im Zustand.
6. Genau denselben POST mit demselben Body und derselben UUID einmal wiederholen. Erwartung: HTTP 200/ok:true, weiterhin nur eine Tabellenzeile und eine E-Mail. Dies sind zwei HTTP-Aufrufe für eine logische Anfrage. Das leere Formular nicht erneut ausfüllen: nach Erfolg wird eine neue UUID erzeugt.

Optionaler Rate-Limit-Test, separat freigeben: bei frischem IP-Zähler insgesamt sechs identische Aufrufe mit derselben UUID innerhalb von zehn Minuten; der sechste muss 429 liefern. Keine zusätzlichen UUIDs verwenden. Für den minimalen Live-Test genügt zunächst eine Wiederholung; Rate-Limit-Fehler sind bereits per Mock getestet.

## Abbruch und Abschluss

Bei 4xx/5xx, Timeout, fehlender Bestätigung oder unklarem Zustand stoppen. Nicht mit neuer UUID neu senden und keine Redis-Reservierung löschen. Supabase, Resend und Redis administrativ abgleichen. Es kann bereits eine Zeile vorhanden sein, obwohl der Browser einen Fehler zeigt.

Nach erfolgreichem Test Test-API wieder deaktivieren und die geschützte Preview entsprechend neu deployen oder entfernen. Production unverändert lassen. Ergebnis ohne Secrets dokumentieren: Deployment, Zeit, HTTP-Status, Zeilenanzahl, Zustellung und Duplikatprüfung. Keine automatische Löschung der Testdaten oder Idempotenzzustände.

Der isolierte Test bestätigt die Integration mit Testressourcen. Er bestätigt nicht automatisch die Produktionsschlüssel oder Produktionsrechte. Ein Test mit Produktionsressourcen wäre eine gesondert freizugebende echte Speicherung und E-Mail.

Referenz: https://vercel.com/docs/deployment-protection/methods-to-protect-deployments/vercel-authentication

## Konkreter Einrichtungsplan für die Projektinhaberin

### 1. Git und Freigabegrenzen

Geprüft: aktuell main; lokal noch kein test/contact-integration. Origin verwendet noch den alten Repositorynamen anna-filippi.git, GitHub leitete beim letzten Push auf anna-filippi.studio.git weiter. Kein Remote wurde verändert. vercel.json enthält Seiten-Rewrites, aber keine Ausnahme oder Rewrite-Regel für /api/contact. Deployment Protection ist eine Dashboard-Einstellung und nicht aus dieser Datei beweisbar.

Nach gesonderter Freigabe den Branch test/contact-integration aus dem geprüften main-Stand erstellen. Production Branch in Vercel bleibt main; keine Production-Domain dem Testbranch zuordnen. Ein Push kann automatisch ein Deployment auslösen und ist deshalb jetzt ausdrücklich ausgeschlossen.

Zur Freischaltung der echten Formularoberfläche später ausschließlich auf diesem Branch src/config/contact.ts ändern: formEnabled:true. main bleibt false. Kein neuer öffentlicher Schalter oder Bypass-Endpunkt nötig. Diese Teständerung nicht nach main mergen; vor jeder Veröffentlichung Branch und Diff prüfen. Der Server braucht unabhängig davon CONTACT_ENABLED=true in genau dieser geschützten Preview.

### 2. Supabase selbst vorbereiten

Im bestehenden Supabase-Konto ein neues leeres Projekt, etwa anna-filippi-contact-e2e, anlegen. Falls der Tarif dies nicht erlaubt, vor kostenpflichtigen Änderungen stoppen; die Produktionsdatenbank ist kein Ersatz. Keine Kundendaten kopieren.

Im SQL Editor ausschließlich dieses neuen Projekts die vorhandene Datei supabase/migrations/20261021000100_create_kontaktanfragen.sql vollständig ausführen. Vorher anhand von Projektname und Projekt-URL sicherstellen, dass es das Testprojekt ist. Die Rechteprüfungen in der Migration beibehalten. Danach administrativ prüfen: RLS und FORCE RLS aktiv, keine Browser-Policies, anon/authenticated ohne Rechte, service_role nur INSERT auf name/email/project/budget/message. Keine zusätzlichen SELECT-Rechte vergeben.

Projekt-URL, Publishable Key und einen Secret Key dieses Testprojekts für Preview bereitstellen. Das Datenbankpasswort gehört weder in Vercel noch ins Frontend. Ein Secret Key ist trotz eingeschränkter Tabellenrechte privilegiert; ausschließlich serverseitig speichern.

### 3. Upstash selbst vorbereiten

Im vorhandenen Konto eine eigene Redis-Datenbank anna-filippi-contact-e2e erstellen. Nicht die vorhandene Legal-/Production-Datenbank verwenden, auch nicht nur mit anderem Präfix. REST-URL und schreibfähiges REST-Token dieser neuen Datenbank übernehmen. Read-only-Token genügt nicht. EVAL, GET, SET, INCR und EXPIRE müssen verfügbar sein.

Eviction deaktiviert lassen, ausreichende Kapazität prüfen und während des Tests keinen Flush durchführen. Upstash hat persistente Speicherung; die nicht ablaufenden Idempotenzzustände dürfen trotzdem nicht durch Eviction oder administrative Löschung verschwinden. Rate-Limit-Schlüssel laufen nach 600 Sekunden ab, Zustände unter contact:delivery:v1: nicht.

### 4. Resend selbst vorbereiten

Das bestehende Konto und eine bereits verifizierte eigene Absenderdomain dürfen wiederverwendet werden. Keine DNS-Einträge der funktionierenden Produktionsdomain ändern. Ein separates Test-API-Key mit Sending Access erstellen und auf die verwendete Domain einschränken. Den Production-API-Key nicht übernehmen. Eine eigene Testsubdomain ist optional, falls auch Versand-Reputation getrennt werden soll.

CONTACT_FROM muss eine Adresse auf der verifizierten Domain sein. CONTACT_TO ausdrücklich als eigenes Testpostfach festlegen; auch reply_to im Test soll ein eigenes Testpostfach sein. Keine Kundenadresse verwenden. Sending Access beschränkt nicht automatisch den Empfänger: die feste CONTACT_TO-Konfiguration und der Preview-Zugangsschutz bleiben erforderlich. Der Code sendet keine automatische Antwort an den Formularabsender.

### 5. Vercel selbst vorbereiten

Bestehendes Vercel-Projekt und Git-Verbindung wiederverwenden. Standard Protection laut Projektinhaberin eingeschaltet lassen. Keine Shareable Links, Protection-Bypass-Tokens, Domain-Ausnahmen oder öffentlich zugängliche Test-API einrichten.

Unter Environment Variables die folgenden Werte ausschließlich für Preview und Branch test/contact-integration anlegen. Falls der Branch erst nach einem freigegebenen Push auswählbar wird, das erste Preview ohne aktivierten Versand erstellen; erst danach branchspezifisch konfigurieren. Bestehende Variablen mit Scope All Environments/All Preview Branches auf ungewollte Produktionswerte prüfen; insbesondere SUPABASE_URL hat Vorrang vor VITE_SUPABASE_URL. Nicht pauschal Production-Konfiguration kopieren.

| Variable | Testwert / Regel |
| --- | --- |
| SUPABASE_URL | URL des separaten Testprojekts |
| VITE_SUPABASE_URL | dieselbe Testprojekt-URL |
| VITE_SUPABASE_PUBLISHABLE_KEY | öffentlicher Testprojekt-Key |
| SUPABASE_SECRET_KEY | Secret Key nur des Testprojekts |
| UPSTASH_REDIS_REST_URL | separate Redis-Testdatenbank |
| UPSTASH_REDIS_REST_TOKEN | zugehöriges schreibfähiges Token |
| RESEND_API_KEY | separater Sending-Access-Key |
| CONTACT_FROM | verifizierter Testabsender |
| CONTACT_TO | ausdrücklich festgelegtes eigenes Testpostfach |
| RATE_LIMIT_SECRET | neu und zufällig, mindestens 32 Zeichen |
| CONTACT_ALLOWED_ORIGINS | exakte geschützte Branch-Preview-Origin, kein Pfad/Wildcard |
| CONTACT_ENABLED | zunächst false; erst nach Zugangsschutzprüfung true |

Keine IT_RECHT_API_TOKEN- oder produktiven Redis-Secrets in Preview übernehmen. Die vorhandene Legal-API benötigt ebenfalls Redis: mit separatem Redis können dort Rechtstexte fehlen. Für den synthetischen Kontakt-Test dokumentieren, nicht durch Anbindung an produktive Speicher umgehen. Keine juristischen Texte als vermeintlich gültigen Ersatz erfinden.

Die erste geschützte Preview später mit CONTACT_ENABLED=false veröffentlichen. Deren stabile Branch-URL aus dem Dashboard verwenden, nicht erraten. Danach exakt diese Origin konfigurieren und neu deployen. Die veröffentlichte Production bleibt in allen Schritten deaktiviert.

### 6. Zugangsschutz tatsächlich beweisen – erst nach Deploymentfreigabe

Aktuell gibt es keinen für diese Aufgabe bereitgestellten Testbranch/Preview-Host. Daher ist der tatsächliche Schutz von /api/contact noch nicht verifiziert. Standard Protection soll auch API-Aufrufe abdecken; ein Anwendungsergebnis wie 405, 403 oder 503 allein beweist diesen vorgeschalteten Schutz nicht.

In einer frischen, nicht bei Vercel angemeldeten Sitzung zuerst Preview-Startseite und /api/contact öffnen. Zusätzlich einen POST mit leerem JSON und ohne Authentifizierung senden: die Vercel-Sperre muss vor dem Handler greifen, ohne Redis-/Supabase-/Resend-Aktivität. Keine Weiterleitung automatisch als erfolgreichen API-Test werten. Auch die verwendete Branch-URL und relevante Deployment-URL prüfen. Dann authentifiziert Zugriff bestätigen, während CONTACT_ENABLED=false weiterhin jeden Versand blockiert. Erst danach Testversand aktivieren. Ein GET allein beweist keinen POST-Schutz.

## Vollständige Testmatrix nach ausdrücklicher Freigabe

| Prüfung | Durchführung | Erwartung |
| --- | --- | --- |
| Unberechtigter Zugriff | frische Sitzung, GET Seite/API und leerer POST | Vercel-Authentifizierung greift vor Anwendung; keine Seiteneffekte |
| Ungültige Daten | authentifiziert, ungültige E-Mail, Projekt, leere/zu lange Nachricht, Honeypot oder UUID | 400 bzw. 413; keine Zeile/E-Mail |
| Origin | fehlende/fremde Origin, authentifizierter API-Test | 403; keine Zeile/E-Mail |
| Echter Formularablauf | eine markierte synthetische Anfrage | 200/ok:true, Erfolg im Formular, eine Zeile, eine zugestellte E-Mail |
| Duplikat | ursprünglichen Body und UUID wiederverwenden | 200, weiterhin eine Zeile/E-Mail |
| Veränderte Nutzlast | dieselbe UUID, anderer Inhalt | 409, keine zusätzlichen Datensätze/Mails; zählt zum Rate-Limit |
| Rate Limit | eigenes frisches 10-Minuten-Fenster, sechsmal identischer bereits bestätigter Request | erste fünf 200 ohne neue Zeile/Mail; sechster 429 mit Retry-After:600 |
| Redis-Ausfall | lokaler Mock für Offline/Timeout/CAS-Verlust | kein falscher Erfolg; bei frühem Ausfall keine Speicherung/Mail |
| Supabase-Ausfall | lokaler Mock für 403/500/Timeout | 503, keine Mail, keine blinde Wiederholung des INSERT |
| Resend-Ausfall | lokaler Mock für Ablehnung/Timeout/fehlende ID | 502/503, gespeicherte Zeile bleibt, Wiederholung mit gleicher UUID sendet nur Mail |

Die Ausfalltests sind bewusst lokale Mocks, kein behaupteter Live-Ausfallnachweis. Realistische Fehlerprovokation in einer getrennten Testumgebung wäre ein weiterer freizugebender Schritt und kann zusätzliche Testzeilen erzeugen. Keine absichtlichen Störungen produktiver Dienste, keine Änderung von Production-Schlüsseln, keine unsicheren Fehler-Endpunkte. Keine Exactly-once-Garantie bei Redis-Datenverlust oder einer neuen UUID.

## Was darf wiederverwendet werden?

| Wiederverwendbar | Zwingend getrennt |
| --- | --- |
| Anbieter-Konten/Organisationen und Vercel-Projekt | Supabase-Projekt, Daten, URL und Schlüssel |
| Git-Repository, main als unveränderter Ausgangspunkt | Testbranch und dessen aktivierter Formularschalter |
| identische SQL-Struktur, Validierungen und Tests | Redis-Datenbank und deren Zugangsdaten |
| Resend-Konto und verifizierte Absenderdomain | Resend-API-Key und festgelegter Testempfänger statt Kunden |
| bestehende Vercel Authentication | Preview-RATE_LIMIT_SECRET und branchspezifische Variablen |

Stand der lokalen Qualitätssicherung: TypeScript, Frontend-/Server-ESLint, alle 58 Tests und Production Build erfolgreich. Nur diese Anleitung wurde ergänzt. Keine externen Ressourcen erstellt, keine Geheimnisse ausgegeben, keine echte Anfrage gesendet; kein Branch erstellt/gepusht, kein Commit und kein Deployment.

Quellen:
- https://vercel.com/docs/environment-variables
- https://vercel.com/docs/deployment-protection
- https://resend.com/changelog/new-api-key-permissions
- https://upstash.com/docs/redis/features/eviction
- https://upstash.com/docs/redis/features/durability
