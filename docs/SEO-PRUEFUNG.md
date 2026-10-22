# SEO-Prüfung – 22. Oktober 2026

## Ausgangslage und Live-Prüfung

Die acht URLs der Sitemap wurden per GET geprüft: jeweils HTTP 200, ein H1 und ein zur Route passender Produktions-Canonical im ausgelieferten HTML. Kein X-Robots-Tag in diesen Antworten. robots.txt, sitemap.xml und favicon.svg antworten mit 200. https://www.annafilippi.studio/ führt zu https://annafilippi.studio/. Ein absichtlich nicht vorhandener Pfad liefert HTTP 404.

Vite baut bereits statisches HTML für jede Route (scripts/build.mjs). React aktualisiert Metadaten bei interner Navigation. Inhalte und Links stehen somit auch ohne JavaScript zur Verfügung; ein noscript-Stil macht die animierten Inhalte sichtbar. Vercel enthält gezielte Rewrites, keinen pauschalen SPA-Fallback. Diese funktionierende Struktur bleibt erhalten.

## Lokale Änderungen

- src/routes.ts: Homepage-Titel und Beschreibung gemäß Vorschlag; veraltete App-Ankündigung in Projekt-/Software-Metadaten an die aktuelle FilliCat-Beschreibung angepasst.
- index.html: Homepage-Fallback und Open Graph mit den Routendaten abgeglichen. Bestehende WebSite-/Person-Daten beibehalten; Beschreibung regional präzisiert und Softwareentwicklung als Kenntnisgebiet ergänzt.
- Services.tsx und Services.module.scss: dezenter Abschnitt über Webentwicklung in Koblenz und Umgebung, mit tatsächlichem Standort Andernach und deutschlandweiter Zusammenarbeit. Bestehende Farben und Schriften verwendet.
- scripts/routing.test.mjs: Prüfung auf konsistente Metadaten, eindeutige Canonicals, Produktions-URLs, Favicon, Standort und crawlbare Inhalte ergänzt.

Der Homepage-Titel hat 56 Zeichen, die Meta Description 133. Das ist eine kompakte Formulierung; die sichtbare Länge und tatsächliche Darstellung legt die Suchmaschine fest. Softwareentwicklung und Produktfotografie bleiben im sichtbaren Leistungsangebot und auf eigenen Seiten berücksichtigt.

Keine Änderung an Kontaktformular, Impressum, Datenschutz, Cookie Consent, robots.txt, Sitemap, Vercel-Routing oder Abhängigkeiten. Keine Veröffentlichung und keine Kontaktanfragen.

## Regionale Strategie

Andernach ist der einzige Standort. Koblenz ist die zentrale Suchregion. Neuwied, Mayen und Bad Ems werden natürlich im kurzen regionalen Text erwähnt. Deutschlandweite Zusammenarbeit ist ausdrücklich beschrieben.

Bendorf, Lahnstein, Mülheim-Kärlich, Mendig, Sinzig, Remagen, Bad Breisig, Vallendar, Bad Neuenahr-Ahrweiler und Bonn sind zusätzliche Zielgebiete, keine weiteren Geschäftsstandorte. Keine künstliche vollständige Städteliste im Seitentext oder in strukturierten Daten. Später können echte, freigegebene Projekte aus diesen Regionen mit konkreten Referenzen beschrieben werden; keine identischen Stadt-Landingpages erzeugen.

Keine erfundenen Adressen, Bewertungen, Öffnungszeiten oder LocalBusiness-Filialen. Bestehende Person/WebSite-Struktur genügt zunächst. og:site_name und SVG-Favicon sind vorhanden. Ein eigenes og:image fehlt bislang; ein freigegebenes Social-Share-Motiv ist optional nachzureichen, kein Indexierungsblocker.

## Manuelle Schritte nach freigegebener Veröffentlichung

1. Production erneut auf Titel, Description, Canonical, regionale Inhalte und HTTP-Status prüfen. Die jetzige Live-Prüfung betrifft die bisher veröffentlichte Version.
2. In Google Search Console die Domain-Inhaberschaft prüfen/einrichten und https://annafilippi.studio/sitemap.xml einreichen. Mit URL-Prüfung die Homepage und Leistungsseiten live testen, gegebenenfalls Indexierung anfordern.
3. Strukturierte Daten mit Schema Markup Validator prüfen. WebSite/Person-Markup garantiert keine Rich Results.
4. Ein bestehendes Google-Unternehmensprofil nur mit den tatsächlichen Unternehmensdaten pflegen; vor einer Neuanlage die Teilnahmeberechtigung prüfen. Keine fiktiven Stadtadressen oder zusätzlichen Filialprofile anlegen.
5. Search-Console-Berichte für Indexierung, Suchanfragen und Core Web Vitals beobachten. Lokale Referenzen nur mit Zustimmung veröffentlichen.

Weder Zugriff auf Search Console noch Google-Indexierung oder Rankings wurden bestätigt. Eine erfolgreiche technische Prüfung garantiert keine Aufnahme in den Index.

Referenz: https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics

## Prüfergebnis lokal

TypeScript (`npm run typecheck`), ESLint (`npm run lint`), Production Build (`npm run build`), 15 Routing-/SEO-Tests (`npm test`) und 48 weitere Mock-/Unit-Tests (`node --test tests/*.test.mjs`) erfolgreich. `git diff --check` ohne Fehler. Keine echten Kontaktanfragen oder E-Mails versendet. Kein Commit, Push oder Deployment durchgeführt.
