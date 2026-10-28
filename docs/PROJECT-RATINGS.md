# Projektbewertungen

Die Sterne bewerten Portfolio-Projekte, keine bestätigte Kundenbeziehung. Keine Verbindung zu Google, keine erfundenen Stimmen und kein AggregateRating-Markup.

## Betrieb nach Prüfung und freigegebener Veröffentlichung

Die neue Vercel-Funktion `/api/project-ratings` nutzt den bereits vorhandenen Upstash-REST-Zugang. Kontakt-, Legal-API und Datenbanktabellen bleiben unverändert. Es wurden keine produktiven Umgebungsvariablen geändert und keine echten Stimmen gespeichert.

Serverseitig benötigt:

- Bestehende `UPSTASH_REDIS_REST_URL` (HTTPS) und `UPSTASH_REDIS_REST_TOKEN`; die bestehende alternative Schreibweise `UPSPLASH_REDIS_REST_TOKEN` wird unterstützt.
- `PROJECT_RATINGS_SECRET` mit mindestens 32 Zeichen; alternativ vorhandenes `RATE_LIMIT_SECRET`. Keine Secrets im Frontend hinterlegen.
- Optional `PROJECT_RATINGS_ENABLED=false` als Abschalter. Mit gültiger bestehender Redis-/Secret-Konfiguration ist keine neue Freischaltvariable erforderlich; ohne gültige Konfiguration wird keine Stimme angenommen.
- Optional `PROJECT_RATINGS_ALLOWED_ORIGINS`, kommaseparierte exakte Origins. Standard: `https://annafilippi.studio`. Vorschau- oder lokale Origins nur in getrennter Testumgebung konfigurieren.

Vite/Preview führt Vercel-Funktionen nicht aus. Ohne Backend ist „Bewertungen sind derzeit nicht verfügbar“ korrekt; es werden keine Nullbewertungen als angebliche Serverdaten ausgegeben.

## Verhalten und Speicherung

- Erlaubt: `dana`, `mamma-mia`, `kavro`, `velora`. FilliCat ist sowohl im Frontend als auch im serverseitigen Allowlisting ausgeschlossen.
- GET liest Durchschnitt, Anzahl und die bereits abgegebene Stimme dieses Netzwerks. POST akzeptiert ausschließlich Projekt-ID und eine ganze Sternzahl von 1 bis 5.
- Besucher wählen Sterne und bestätigen mit „Bewertung senden“. Alle Kartenkopien und Ansichten teilen denselben clientseitigen Zustand.
- Redis speichert pro Projekt einen Hash `ratings:v1:project:<id>` mit `count`, `sum` und pseudonymen Stimmenfeldern `v:<HMAC>`. Es werden weder Klartext-IP noch Name, E-Mail, Browser-ID oder Cookies gespeichert. Die IP wird serverseitig für HMAC und Missbrauchsschutz verarbeitet.
- Die Stimmen sind nicht zeitlich befristet. Keine Redis-Eviction/Flush für diesen Namespace; ein gelöschter Namespace verliert auch Wiederholungsschutz. Löschung oder Aufbewahrung muss entsprechend dem tatsächlichen Betrieb festgelegt werden.
- Pro Projekt und Netzwerk ist eine unveränderliche Stimme erlaubt. Derselbe Wert kann nach einer verlorenen Antwort sicher erneut gesendet werden. Ein anderer Wert erzeugt 409, ohne die erste Stimme zu ersetzen.
- Ein Lua-Skript führt Prüfung und Zählung atomar aus. Zusätzlich maximal zehn POST-Versuche pro Netzwerk in zehn Minuten; nur HMAC-Schlüssel mit 600 Sekunden TTL werden dafür gespeichert.
- Anonyme Bewertungen sind kein Nachweis einer Person oder Kundenbeziehung. Gemeinsames WLAN kann mehrere Personen zusammenfassen; VPN, wechselnde IPs oder Bots können den Schutz umgehen. Keine absolute „ein Mensch, eine Stimme“-Garantie.
- HMAC-Schlüssel hängen vom Secret ab. Dessen Rotation lässt alte Stimmen im Aggregat bestehen, erkennt frühere Netzwerke aber nicht mehr. Nicht unkoordiniert rotieren.
- Echte personenbezogene Verarbeitung und Aufbewahrung im Datenschutztext des genutzten Rechtstextdienstes berücksichtigen; der bestehende Rechtstext wurde nicht verändert.

## Verifikation

Produktions-Build vor den HTML-Tests ausführen:

```sh
npm run typecheck
npm run lint
npm run build
node --test scripts/routing.test.mjs tests/*.test.mjs
```

Backendtests verwenden ausschließlich synthetische Daten und einen lokalen Redis-Test bzw. gemockte REST-Antworten. Keine echten Kontaktanfragen oder produktiven Stimmen als Test erzeugen.
