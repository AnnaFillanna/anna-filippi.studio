# IT-Recht Kanzlei: Einrichtung und Test

Stand: 20.10.2026. Lokal integriert; kein Deployment und kein Git-Push ausgeführt.

## Implementierung

`POST /api/legal` empfängt UTF-8-XML mit `Content-Type: text/xml`. Grundlage:
https://github.com/it-recht-kanzlei/itrk-plugin-sdk/blob/main/docs/LTI_XML_Specification_de.md
https://github.com/it-recht-kanzlei/itrk-plugin-sdk/blob/main/docs/SDK_de.md

- API-Version 1.0; Authentifizierung ausschließlich über `user_auth_token` im XML, verglichen mit dem serverseitigen `IT_RECHT_API_TOKEN`.
- `getversion`, `getaccountlist`, `push`. Auch `version` wird akzeptiert, weil die Übersicht der Spezifikation diese abweichende Bezeichnung nennt.
- Einzelner Account 0 mit leerem Namen, Sprache de, Land DE. Kein Multishop.
- Unterstützt Impressum und Datenschutz. AGB/Widerruf werden mit Fehler 4 abgelehnt.
- Dokumentierte XML-Erfolgs-/Fehlerantworten mit Metadaten; `target_url` nach bestätigter Speicherung. Protokollantworten verwenden HTTP 200; der XML-Status ist maßgeblich.
- Strikter SAX-Parser, 2-MiB-Anfragelimit, UTF-8-Prüfung, keine DTDs/externen Entities, keine verschachtelten oder doppelten XML-Felder. Keine Tokens in Logs oder gespeicherten Dokumenten.
- Genutzt wird ausschließlich die vollständige `rechtstext_text`-Variante. HTML und PDF sind nicht implementiert und werden nicht ausgeführt, heruntergeladen oder gespeichert. Die Spezifikation erlaubt ungenutzte Felder. Kein selbst formulierter Rechtstext.
- Redis speichert Titel, Klartext, Typ und Empfangszeit atomar per SET, ohne Ablaufzeit. Fehler oder nicht bestätigte Schreibvorgänge ergeben Fehler 50; fehlende Konfiguration Fehler 80.
- `GET /api/legal?type=impressum` bzw. `datenschutz` ist eine eigene öffentliche JSON-Lese-API für das Frontend, kein zusätzlich erfundenes LTI-Protokoll.
- Seiten laden ohne Cache beim Öffnen und beim Wiederaktivieren des Tabs. Kein Neubau nach Textübertragung nötig. Bereits dauerhaft sichtbare Tabs werden beim nächsten Fokus/Öffnen aktualisiert.
- Nach zehn Sekunden wird eine hängende Anfrage abgebrochen. Netzwerkfehler, ungültige JSON-Antworten und Serverfehler zeigen eine deutsche Meldung mit Wiederholen-Schaltfläche statt technischer Fehlermeldungen.
- Texte erscheinen unverändert als React-Text mit erhaltenen Zeilenumbrüchen. Keine HTML-Ausführung. Darstellung benötigt JavaScript; der statische Build enthält den Ladezustand, nicht eine möglicherweise veraltete Textkopie.

## Speicher: noch nicht bestätigt/eingerichtet

Im Projekt ist Upstash für die Kontakt-API vorgesehen, aber eine aktive Datenbank ist nicht bestätigt. Es wurde kein Dienst eingerichtet oder bezahlt.

Die einfachste passende Lösung ist eine Upstash-Redis-Datenbank im Free-Tarif, sofern für das Konto verfügbar. Laut https://upstash.com/pricing/redis umfasst der Free-Tarif derzeit 250 MB und 500.000 Befehle pro Monat. Im Dashboard die aktuellen Konditionen prüfen und keine automatische kostenpflichtige Hochstufung aktivieren. Derselbe Speicher kann für Kontakt und Rechtstexte genutzt werden; deren Schlüssel bleiben getrennt. Keine TTL und keine Eviction für die Rechtstexte aktivieren; ein Backup vor manuellen Änderungen erstellen.

Benötigte serverseitige Vercel-Variablen:

| Variable | Zweck |
| --- | --- |
| IT_RECHT_API_TOKEN | Laut Auftrag bereits gesetzt. Gleicher alphanumerischer Token im Kanzlei-Portal. Niemals VITE_-Prefix verwenden. |
| UPSTASH_REDIS_REST_URL | HTTPS REST-URL der Datenbank. |
| UPSTASH_REDIS_REST_TOKEN | REST-Token mit Lese- und Schreibzugriff, kein Read-only-Token. |
| IT_RECHT_STORAGE_PREFIX | Optional; Standard `legal:annafilippi.studio`. Für Preview z.B. `legal:annafilippi.studio:preview`. |

Produktions- und Testübertragungen müssen getrennte Präfixe oder Datenbanken verwenden. Testdaten niemals in die produktiven Rechtstext-Schlüssel schreiben. Die bestehenden Kontakt-Variablen nicht löschen/ändern. Neue Vercel-Variablen werden erst mit einem später ausdrücklich freigegebenen Deployment wirksam.

## Schritte im IT-Recht-Kanzlei-Portal

1. Zunächst den technischen Support kontaktieren: Die eigene React/Vercel-Schnittstelle muss als Übertragungsziel eingerichtet bzw. abgestimmt werden. Keine bestimmte Portal-Schaltfläche oder vorhandene Freischaltung wird vorausgesetzt.
2. Dem Support nennen: `https://annafilippi.studio/api/legal`, POST `text/xml`, API 1.0, Token-Authentifizierung, Account 0, de/DE, Typen impressum und datenschutz, Klartextdarstellung ohne PDF. Die dokumentierte Abweichung `version`/`getversion` ist berücksichtigt.
3. Den bereits vorhandenen Token selbst im dafür vorgesehenen Portal-Feld hinterlegen. Nicht per Chat versenden.
4. Nach Speicher-Einrichtung und freigegebenem Deployment beide echten Texte im Portal konfigurieren und an dieses Ziel übertragen. Zunächst die Zugangsdaten/Version und Accountabfrage prüfen.
5. Danach beide öffentlichen Seiten auf vollständigen Text prüfen. Eine erneute Übertragung muss auf der jeweiligen Seite ohne Neubau sichtbar werden.
6. Offizielles Testwerkzeug nach Abstimmung: https://www.it-recht-kanzlei.de/developer/sdk.php . Für Tests einen getrennten Preview-Speicher und Token verwenden. Falscher Token muss Fehler 3 liefern, ein Speicherfehler darf nie als Erfolg bestätigt werden.

## Prüfungen und Grenzen

Ausführen: `npm run build`, `npm test`, `npm run test:legal`, `node --test tests/contact.test.mjs`, `npm run typecheck`, `npm run lint`.

Automatisierte Tests decken XML, Authentifizierung, Validierung, Fehlercodes, persistente Lese-/Schreib-Semantik mit einem simulierten Redis-REST-Service, Updates, unveränderte Kontaktfunktion, vollständige sichere Textausgabe und Footer-Routen ab. Die Simulation ersetzt keinen realen Redis-/Kanzlei-Test.

Ein interaktiver Browser-Test war in dieser Arbeitsumgebung nicht möglich: Das Starten des lokalen Webservers wurde durch die Umgebung mit EPERM abgewiesen. Die Darstellung wurde über React-Rendering-Tests und Build geprüft; mobile/desktop Sichtprüfung bleibt vor Freigabe offen.

`src/config/legal.ts` verweist auf `/impressum` und `/datenschutz`. Das Kontaktformular wird durch diese Integration nicht automatisch aktiviert; seine bestehende Datenschutz-/Freigabekonfiguration bleibt erhalten.
