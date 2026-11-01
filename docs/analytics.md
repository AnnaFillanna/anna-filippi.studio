# GA4 – Integration und Freigabe

Measurement ID: G-9QF4VMGV2Y. Änderungen sind lokal; noch nicht veröffentlicht.

## Verhalten

Basic Consent Mode: kein Google-Skript, keine Analytics-Kommandos oder Consent-Pings vor Zustimmung oder nach Ablehnung. Gleich gestaltete Schaltflächen im Banner. Die versionierte Entscheidung liegt 180 Tage in localStorage (`afs.analytics-consent.v1`). Ungültige/abgelaufene Werte gelten als keine Zustimmung. Ohne verfügbaren Speicher gilt die Auswahl nur für das aktuelle Dokument. Der Footer öffnet die Einstellungen jederzeit. Widerruf setzt das GA-disable-Flag, entfernt GA-Cookies und lädt die Seite neu, um Google-Listener/Timer zu entfernen. Bereits versandte Daten werden dadurch nicht nachträglich gelöscht. Andere Tabs übernehmen Änderungen per Storage-Event; Ablauf wird auch bei Fokus und minütlich geprüft.

Einmalige Initialisierung pro Dokument; deduplizierte manuelle Seitenaufrufe über React Router, inklusive Zurück/Vorwärts. Reine Anker-/Querywechsel sind keine neuen Seiten. Keine rückwirkende Erfassung vor Zustimmung besuchter Seiten. Nur bekannte Seitenpfade und statische Seitentitel werden übergeben; Querystrings, Hashes, Formulardaten und externe Referrer werden nicht übergeben. Google Signals und Werbepersonalisierung sind im Code deaktiviert, alle Werbe-Consent-Typen bleiben denied.

## Vor Veröffentlichung in GA4 konfigurieren

Im Web-Datenstream **Erweiterte Analysen deaktivieren**, insbesondere automatische Seitenaufrufe bei Browser-Verlaufsänderungen. `send_page_view: false` allein deaktiviert diese History-Erfassung NICHT. Sonst drohen doppelte Seitenaufrufe und zusätzliche automatische Events. Google Signals, User-provided Data und Werbeverknüpfungen ausgeschaltet lassen. Datenaufbewahrung auf den notwendigen Zeitraum (z. B. 2 Monate) einstellen, Auftragsverarbeitung und Kontofreigaben prüfen. Diese Kontoeinstellungen wurden nicht aus dieser Sitzung verändert oder verifiziert.

## Datenschutzerklärung: konkreter Anpassungsbedarf

Der am 01.11.2026 abgerufene eingebundene Kanzleitext unter https://itrk.legal/1DBW.8V.1cWV-informal-iframe.html enthält keinen Google-Analytics-Abschnitt. Rechtstext und Einbindung blieben unverändert.

Vor Aktivierung über die IT-Recht Kanzlei aktualisieren lassen: GA4-Anbieter/Empfänger, Zweck und Datenkategorien, Einwilligungsgrundlage nach Art. 6 Abs. 1 lit. a DSGVO und § 25 Abs. 1 TDDDG, Cookies `_ga`/`_ga_*` (hier maximal 180 Tage), Consent-Speicherung, tatsächliche serverseitige Aufbewahrung, Widerruf über Footer, mögliche Drittlandübermittlung und passende Garantien/Vertragsgrundlagen. Banner und endgültigen Rechtstext aufeinander abstimmen. Technischer Consent allein bestätigt keine vollständige rechtliche Konformität.

## Prüfung im Browser

1. `npm run dev`, privates Fenster ohne Tracking-Erweiterungen öffnen. DevTools → Network → Preserve log; nach `googletagmanager`, `google-analytics` und `collect` filtern.
2. Vor Auswahl und nach Ablehnen: keinerlei GA-Skript/Collect-Anfrage; auch nach Seitenwechsel und Neuladen. Keine `_ga`-Cookies.
3. Akzeptieren: genau ein `gtag/js?id=G-9QF4VMGV2Y`; aktueller Seitenaufruf, weitere je echtem Seitenwechsel (inklusive Zurück/Vorwärts), keine Verdopplung durch Anker oder erneutes Akzeptieren. Die Anzahl der HTTP-Requests ist wegen Batching nicht gleich der Eventanzahl.
4. Footer → Datenschutzeinstellungen → Einwilligung widerrufen: automatisches Neuladen, keine neuen Analytics-Anfragen, GA-Cookies entfernt. Ablehnung bleibt nach Neuladen bestehen. Zweiten Tab mitprüfen.
5. GA4 → Echtzeit auf eingehende Seitenaufrufe prüfen. Für DebugView optional Google Analytics Debugger im eigenen Testbrowser aktivieren; kein dauerhafter Debug-Modus im Produktionscode.
6. Mobilansicht und Tastatur prüfen: beide Entscheidungen gleich sichtbar; Datenschutz-Link und Footer-Einstellungen erreichbar.

## Automatisierte Checks

`npm run typecheck`, `npm run lint`, `npm run build`, anschließend `node --test scripts/routing.test.mjs tests/*.test.mjs` (Routing-Tests benötigen den fertigen Build).

Die Analytics-Tests prüfen die tatsächliche Controller-Ausführung mit simuliertem DOM: keine Script-Injektion/Kommandos vor Einwilligung, Initialisierung, Deduplizierung, Navigation, Widerruf/Cookie-Löschung und ungültige Consent-Daten. Sie ersetzen keine Prüfung der realen Google-Netzwerkanfragen oder der GA4-Kontoeinstellungen; diese Live-Prüfung steht noch aus.

Quellen: https://developers.google.com/tag-platform/security/concepts/consent-mode und https://developers.google.com/analytics/devguides/collection/ga4/views
