# Technical SEO, Crawling und Indexierbarkeit – Phase 2

Stand: 26.11.2026 · Ausgangscommit: `25ac6bd` · Hauptdomain: https://annafilippi.studio

## Ergebnis und Umfang

Die bestehende Vite-/React-Prerender-Architektur bleibt erhalten. 16 öffentliche Seiten einschließlich sechs Insights-Artikeln und der erweiterten Über-mich-Seite wurden berücksichtigt. Kein seitenweiter Indexierungsblocker wurde nachgewiesen. Es wurden gezielte Korrekturen an URL-Weiterleitungen und der Navigation ohne JavaScript vorgenommen sowie die statische Sitemap-Referenz aktualisiert. Es gab keinen Commit, Push oder Deployment.

Die bereits vorhandene unversionierte `docs/BILDOPTIMIERUNG.md` wurde nicht verändert. Bildoptimierungen aus Phase 1, neuere redaktionelle Änderungen, Kontakt-API, Rechtstextintegration, Cookie-/Sicherheitslogik und strukturierte Daten wurden nicht verändert. Keine Abhängigkeiten installiert, keine Formulare versendet, keine Datenbankzugriffe ausgeführt und keine Geheimnisse gelesen oder veröffentlicht.

## Befunde und Umsetzung

| Priorität / Status | Vorher und Ursache | Änderung / Ergebnis lokal | Kontrolle und Restpunkt |
|---|---|---|---|
| P2 / nachgewiesen, lokal korrigiert | Alle 16 geprüften `/index.html`-Varianten liefern live 200. Ursache: Build schreibt `dist/<route>/index.html`; Vercel stellt neben der per Rewrite erreichbaren sauberen URL auch die physische Datei bereit. | Explizite permanente 308-Weiterleitungen aller vorhandenen HTML-Aliase auf die kanonischen HTTPS-URLs. Keine pauschale Umschreibung beliebiger unbekannter Pfade zur Homepage. | Tests prüfen vollständige Alias-Abdeckung, kanonische Ziele und Trennung von externen Redirect-Quellen und sauberen Rewrite-Quellen. Vercels tatsächliche Edge-Auswertung nach Deployment prüfen. |
| P2 / nachgewiesen, Konfiguration vorbereitet | HTTPS-www leitet live mit 307 auf non-www um; HTTP-www macht vorher einen HTTPS-Schritt. | Hostgebundene permanente Weiterleitung in `vercel.json`, ausschließlich für `www.annafilippi.studio`. Pfad-Platzhalter bleibt erhalten, feste HTML-Aliase zeigen direkt auf die endgültige Hauptdomain. | Domainregeln im Vercel-Dashboard können vorher greifen. Projektkonfiguration allein garantiert keine Ablösung der aktuellen 307-Domainregel. Dashboard und HTTP-HTTPS-Kette nach Freigabe separat prüfen. |
| P2 / nachgewiesen, lokal korrigiert | Unter 1301 px war `#hauptnavigation` verborgen, der Menüknopf benötigte React. Echte Links waren im HTML, aber nicht bedienbar. | Ausschließlich in `noscript`: Menüknopf ausblenden, Navigation sichtbar im normalen Dokumentfluss ausgeben, Höhenbegrenzung und Überlagerung entfernen. Semantisches `nav` und vorhandene Links bleiben erhalten. Normales JS-Layout, Schrift, Farben und Animationen unverändert. | Tastaturtest mit JS erfolgreich. Skriptfreie Fallback-Testansicht ohne Überlauf bei 320, 390, 768, 1280 und 1440 px; Linknavigation per Enter erfolgreich. Testgrenze unten beachten. |
| P2 / Wartungsabweichung, korrigiert | `public/sitemap.xml` enthielt nur zehn URLs; der Build erzeugte bereits korrekt alle 16 aus `pages` einschließlich veröffentlichter Artikel. Kein aktueller Produktions-Sitemap-Ausfall. | Statische Referenz um die sechs Artikel ergänzt; Test verlangt Gleichheit mit erzeugter Sitemap. | Bei späteren Artikeln Referenz und Alias-Regeln ergänzen; Tests melden vergessene Einträge. Keine erfundenen `lastmod`-Daten. |
| Geprüft / kein Defekt | Wildcard-Freigabe in robots.txt und korrekter Sitemap-Verweis. | robots.txt unverändert. Keine zusätzlichen Freigaben und keine Änderung der Trainingscrawler-Policy. | Vier synthetische Suchcrawler-Anfragen liefern 200. Das beweist keinen tatsächlichen Besuch der Anbieter. |
| Geprüft / kein Defekt | 16 individuelle Titel und Descriptions, selbstreferenzierende Canonicals, `lang=de`, ein H1 und ein main pro Seite. | Keine unnötige redaktionelle Überarbeitung. Neue Tests für alle Seiten. | Alle lokalen Metadaten-, Sprach-, H1- und Hierarchieprüfungen erfolgreich. Live: ein H1 und richtiger Canonical je geprüfter Seite. |
| Geprüft / kein Defekt | Unbekannte normale und Insights-Pfade liefern live 404. | Bestehende gezielte Rewrites erhalten; kein globaler SPA-200-Fallback eingeführt. | Kein Soft-404 in den zwei gezielten Live-Stichproben. Keine Aussage über jede denkbare URL. |

## Crawl-Policy und Schutz sensibler Inhalte

Die vorhandene `User-agent: *`-Gruppe mit `Allow: /` gilt weiterhin für Googlebot, Bingbot, OAI-SearchBot und PerplexityBot. Eigene Gruppen mit demselben Inhalt wären redundant und könnten später abweichende Regeln erzeugen. Die Sitemap zeigt auf die kanonische HTTPS-Hauptdomain.

OAI-SearchBot dient der Suche; GPTBot ist davon getrennt und betrifft mögliches Modelltraining. PerplexityBot dient laut Anbieter der Suche, nicht dem Training von Foundation Models. Google-Extended ist von Googlebot getrennt und umfasst je nach Produkt Training sowie bestimmte Grounding-Nutzungen. Die bestehende Wildcard-Policy wurde weder für diese noch für andere Trainingscrawler verändert.

robots.txt ist kein Zugriffsschutz. Vorhandene API-Authentifizierung, serverseitige Schalter und Vercel-Zugriffsschutz wurden nicht abgeschwächt. Sitemap und Navigation enthalten ausschließlich öffentliche Seiten, keine API-Endpunkte. Es wurden keine privaten Pfade neu veröffentlicht. Dashboard-, Firewall- und Preview-Protection-Einstellungen wurden nicht geändert oder umfassend eingesehen. Authentifizierte Anbieter-Bot-IP-Logs standen nicht zur Verfügung.

## HTML-Duplikate und Architektur

Es gibt zwei unterschiedliche Ursachen, die nicht verwechselt werden dürfen:

1. **Mehrere URLs derselben statischen Seite:** direkt erreichbare `index.html`-Dateien. Diese werden mit Redirects konsolidiert. Die sauberen URLs bleiben intern auf ihre jeweiligen Dateien umgeschrieben. Vercel verarbeitet Redirects vor Rewrites; lokale Tests prüfen die Regelstruktur, ersetzen aber keinen Vercel-Preview-Test.
2. **Absichtliche Wiederholungen innerhalb eines Dokuments:** `FeaturedProjects.tsx` rendert drei Projektgruppen für das Endloskarussell. Kopien sind bereits `aria-hidden` und `inert`. Sie sind keine zweite öffentliche Seite und kein belegter Ranking-Schaden. Ihre Entfernung würde die Animation/Interaktion verändern; deshalb in Phase 2 nicht umgesetzt.

`src/main.tsx` baut Prerender-Markup weiterhin mit `createRoot` neu auf. Eine Umstellung auf `hydrateRoot` erfordert konsistentes initiales Markup, Motion-Zustände und Tests für direkte Einstiege/Navigation. Das ist ein separates Architekturvorhaben und wartet auf Freigabe. Relevante Leistungs- und Artikeltexte stehen bereits im initialen HTML.

Impressum und Datenschutz erhalten weiterhin den bestehenden Kanzlei-Ladehinweis und Direktlink; der komplette Kanzleitext wird clientseitig geladen. Ein serverseitiger synchronisierter Bereitstellungsweg ist nicht improvisiert worden. Diese Änderung benötigt eine gesonderte fachliche/technische Freigabe und Prüfung der unterstützten Kanzlei-Schnittstelle.

## Produktionsprüfung – noch vor Veröffentlichung dieser Änderungen

Alle folgenden URLs lieferten HTTP 200, HTML, genau einen H1, den passenden Canonical und weder ein seitenweites Robots-noindex/nofollow noch einen X-Robots-Tag:

| Route | Status | Canonical korrekt |
|---|---:|---|
| / | 200 | ja |
| /ueber-mich | 200 | ja |
| /projekte | 200 | ja |
| /softwareentwicklung | 200 | ja |
| /dana-tattoo-studio | 200 | ja |
| /fotografie | 200 | ja |
| /kontakt | 200 | ja |
| /impressum | 200 | ja |
| /datenschutz | 200 | ja |
| /insights | 200 | ja |
| /insights/was-kostet-eine-professionelle-website | 200 | ja |
| /insights/webdesign-agentur-oder-freelancer | 200 | ja |
| /insights/seo-und-aeo-fuer-kleine-unternehmen | 200 | ja |
| /insights/e-commerce-fuer-kleine-unternehmen | 200 | ja |
| /insights/ki-und-automatisierung-fuer-kleine-unternehmen | 200 | ja |
| /insights/professionelle-produktfotografie | 200 | ja |

Weitere direkte HTTP-GET-Prüfungen ohne automatisches Folgen von Redirects:

| Ziel | Ist-Zustand live |
|---|---|
| `/robots.txt` | 200, text/plain, vorhandene Wildcard-Freigabe und korrekter Sitemap-Verweis |
| `/sitemap.xml` | 200, application/xml, 16 öffentliche URLs |
| Alle 16 HTML-Aliase mit Query-Parameter | 200; lokale Redirect-Korrektur noch nicht veröffentlicht |
| `/projekte/` | 308 auf `/projekte` |
| HTTP-Hauptdomain `/projekte?audit=2` | 308 auf HTTPS-Hauptdomain, Query erhalten |
| HTTPS-www `/projekte?audit=2` | 307 auf HTTPS-Hauptdomain, Query erhalten |
| HTTP-www `/projekte?audit=2` | 308 auf HTTPS-www, anschließend bestehender Host-Redirect |
| `/phase-2-nicht-vorhanden` | 404 |
| `/insights/phase-2-nicht-vorhanden` | 404 |
| Homepage mit Googlebot, bingbot, OAI-SearchBot, PerplexityBot | jeweils 200 aus dem Prüfnetz |

Die Produktionsprüfung bestätigt nicht die Veröffentlichung der lokalen Änderungen. User-Agent-Simulationen sind keine verifizierten Bot-Besuche. Search Console, Bing Webmaster Tools, ausgewählte Suchmaschinen-Canonicals, Indexierungsstatus, echte WAF-/Bot-Logs und Core-Web-Vitals-Felddaten wurden nicht eingesehen. Externe Projekt- und Drittanbieterlinks wurden nicht vollständig live durchgeprüft; lokale interne Links und Fragmentziele dagegen vollständig.

## Qualitätssicherung

- `npm run typecheck`: bestanden.
- `npm run lint`: bestanden, keine Warnungen.
- `npm test`: bestanden, **108 Tests**, einschließlich `pretest` mit vollständigem Production Build (TypeScript, Vite Client und SSR/Prerender).
- `git diff --check`: bestanden.
- Neuer Test prüft alle 16 Seiten: eindeutige Title/Description, genau einen Canonical/H1/main, Sprache, keine übersprungenen Überschriftenebenen, keine unerwarteten Robots-Sperren.
- Interne HTML-Linkziele und Fragmente geprüft; Graph-Traversierung von `/` erreicht jede Sitemap-Seite, einschließlich aller Artikel und der Über-mich-Seite.
- Alle 16 Alias-Regeln, Host-Bedingung, permanente Ziele und fehlender globaler SPA-Fallback geprüft. **Konfigurationsprüfung, kein emulierter Nachweis des Vercel-Edge-Verhaltens.**
- Mit JavaScript, 390 px: Menü per Enter geöffnet, per Escape geschlossen, Fokus zurück auf dem Menüknopf; kein horizontaler Überlauf.
- Ohne Skriptausführung: temporäre lokale Testansicht entfernt Scripts aus dem echten Build, aktiviert die darin vorhandenen Noscript-Stile und setzt `script-src 'none'`. Navigation bei 320/390/768/1280/1440 px sichtbar und ohne horizontalen Überlauf; Insights per Tastatur-Link erreichbar. **Dies simuliert die Fallback-Ausgabe; die Browseroption „JavaScript deaktivieren“ selbst wurde nicht geschaltet.** Ein vollständiger Test mit nativ deaktiviertem JavaScript in Safari/Chrome bleibt vor Veröffentlichung empfohlen.
- Keine echten Kontaktanfragen, Bewertungen oder Buchungen ausgelöst. Die vorhandenen API-/Sicherheits-Tests liefen mit der gesamten Suite mit.

## Geänderte Dateien

- `vercel.json`: 16 explizite HTML-Alias-Weiterleitungen und hostgebundener www-Redirect.
- `src/components/Header/Header.tsx`: stabile Datenattribute zur gezielten Noscript-Gestaltung; keine Änderung des React-Verhaltens.
- `scripts/build.mjs`: bestehende Noscript-Ausgabe um sichtbare, nicht überlagernde Hauptnavigation ergänzt.
- `public/sitemap.xml`: sechs veröffentlichte Insights-Artikel ergänzt, entsprechend dem bereits vorhandenen Build.
- `tests/technical-seo.test.mjs`: vier zusätzliche Tests für Metadaten/Semantik, interne Erreichbarkeit, Redirect-Konfiguration und unveränderte Crawler-Policy/Noscript-Fallback.
- `docs/SEO-AEO-GEO-PHASE-2.md`: dieser Bericht.

## Nach freigegebenem Deployment

1. Vercel Domains prüfen: `annafilippi.studio` bleibt Hauptdomain; vorhandenen www-Redirect auf permanent 308 stellen, falls die Dashboard-Regel weiterhin die Projektregel übersteuert. Keine Domain löschen. Pfad und Query müssen erhalten bleiben.
2. Alle 16 sauberen URLs auf 200 und passenden Canonical prüfen; alle zugehörigen `/index.html`-Aliase (auch mit Query) auf permanenten Redirect und abschließendes 200 prüfen. Keine Schleife durch interne Rewrites.
3. HTTP, HTTPS-www, HTTP-www, Slash- und HTML-Varianten prüfen. Vercels vorgeschalteter HTTPS-Schritt kann bei HTTP-www weiterhin einen zusätzlichen Hop verursachen; nicht als bereits behoben ausgeben.
4. robots.txt und Sitemap öffentlich erneut lesen; unbekannte Seiten müssen 404 bleiben. Preview-Hosts müssen ihren bisherigen Schutz behalten.
5. Mobile Navigation mit nativ deaktiviertem JavaScript sowie Tastatur und normale Navigation kontrollieren.
6. Bestehende Search-Console-/Bing-Properties verwenden: Sitemap und repräsentative URLs prüfen; keine doppelten Konten oder Indexierungsversprechen.

## Offene Freigaben und Phase 3

- **Separate Architekturfreigabe:** Hydration statt clientseitigem Neubau; gegebenenfalls serverseitig aktuelle Kanzleitexte; Karussell-Kopien nur bei messbarem Bedarf und vollständiger Interaktionsprüfung ändern.
- **Phase 3:** vorhandene Person-/WebSite- und bereits hinzugekommene Article-/Breadcrumb-Daten zusammen analysieren. Keine neuen doppelten Entitäten. Alias „Fillanna“ fachlich klären; Studio, Person, Leistungen und sichtbare Unternehmensdaten konsistent modellieren. WebPage/Service und gegebenenfalls FAQ nur aus bestätigten sichtbaren Informationen ableiten.
- Keine fiktiven Standorte, Bewertungen, Referenzen, Keywords oder garantierten Rankings hinzufügen. Suchzugänglichkeit garantiert keine Indexierung oder KI-Zitierung.

## Offizielle Quellen

- [Vercel: vercel.json, Redirects und Rewrites](https://vercel.com/docs/project-configuration/vercel-json) – permanente Redirects, Hostbedingungen, Redirect-Verarbeitung vor Rewrites; Hostbedingungen sind lokal mit `vercel dev` nicht vollständig prüfbar.
- [OpenAI: Crawler](https://developers.openai.com/api/docs/bots) – Suchcrawler und Trainingscrawler getrennt steuern.
- [Perplexity: Crawler](https://docs.perplexity.ai/docs/resources/perplexity-crawlers) – Suchbot und nutzerinitiierter Abruf unterscheiden.
- [Google: Crawling](https://developers.google.com/crawling/docs/about-crawling) – Robots-Steuerung und Google-Extended.

Lokale Grundlage: `docs/SEO-AEO-GEO-AUDIT.md`, aktuelles Routing, Build-Ausgabe und genannte Dateien. Temporäre HTTP-Ergebnisse unter `/tmp/anna-phase2-live.json` und `/tmp/anna-phase2-aliases.json`; die relevanten Ergebnisse sind oben dauerhaft zusammengefasst.
