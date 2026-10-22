# Website-Erweiterungen und SEO-Abgleich

## Bereits vorhanden

- 43 Dateien in public/images/portfolio, davon 42 eindeutige Galeriemotive: 20 Kompositionen und 22 Aufnahmen auf hellem Hintergrund. Keine neuen unzugeordneten Uploads gefunden. anna-filippi-8.jpg bleibt als Original erhalten; angezeigt wird bereits anna-filippi-8-chain.webp.
- Alle 42 Bildpfade vorhanden, keine doppelten IDs/Pfade oder byte-identischen Dateien. Hinterlegte Breiten/Höhen stimmen mit den tatsächlichen Dateien überein (sips-Prüfung). Lazy Loading und asynchrones Decoding der Galeriebilder vorhanden. Reihenfolge unverändert.
- Lightbox mit Vor/Zurück, Pfeiltasten, Escape, Scroll-Sperre und Fokus-Rückgabe vorhanden. Im lokalen Browser Kategorie-Wechsel, Öffnen, Weiter, Escape und Fokus-Rückgabe geprüft; Bild geladen.
- Sechs bestehende Leistungsbereiche mit KI, SEO, Software, Fotografie und Betreuung; kein Red July im Portfolio. Keine Wiederaufnahme dieses Projekts.
- Individuelle SEO-Titel/Descriptions, Canonicals, Open Graph, Site Name, SVG-Favicon, WebSite/Person-JSON-LD und prerenderte React-Routen vorhanden. Standort bleibt Andernach.
- robots.txt, acht Sitemap-URLs und gezielte Vercel-Rewrites vorhanden. Keine Sitemap-Änderung; vorhandene Build-Generierung bleibt unverändert.
- Live-GET-Prüfung: alle acht Seiten HTTP 200, je ein H1, keine noindex-Anweisung in Robots-Meta/HTTP-Headern. robots.txt, sitemap.xml und favicon.svg erreichbar; unbekannter Pfad HTTP 404. Interne Links und Metadaten werden zusätzlich durch Routingtests geprüft.
- Search Console, erfolgreich gelesene Sitemap und Google Business Profile laut Nutzer eingerichtet; keine erneute Einrichtung erforderlich. Indexierung und Rankings nicht unabhängig bestätigt.

## Ergänzt

- Vorhandene sechs Servicebereiche präzisiert: Webdesign/Website-Erstellung/Webentwicklung, Software/Web-Apps, Shopify/WordPress/CMS, SEO/Betreuung und Produkt-/Schmuckfotografie. KI bleibt im vorhandenen Bereich. WhatsApp als Integrationsleistung ergänzt.
- Shopify und WordPress ausdrücklich als ergänzende Plattformlösungen neben individueller Entwicklung beschrieben. Keine Partner- oder Zertifizierungsbehauptung.
- Bonn natürlich als Zielgebiet für Online-Zusammenarbeit ergänzt, keine zusätzliche Niederlassung.
- Google-Bewertungseinladung im bestehenden Stil vorbereitet. Nur auf der Homepage und nur mit gültiger konfigurierter HTTPS-Google-URL sichtbar. Keine erfundenen Bewertungen, kein Rating-Markup, keine externen Google-Skripte.
- Regressionstests für vollständige Galeriezuordnung und sichere Bewertungskonfiguration ergänzt.

## Geänderte/neue Dateien

- src/components/Services/Services.tsx
- src/components/ProjectProcess/ProjectProcess.tsx
- src/config/reviews.ts (neu)
- scripts/routing.test.mjs
- tests/portfolio-config.test.mjs (neu)
- docs/WEBSITE-ABGLEICH.md (dieser Bericht)

Kontaktformular, Impressum, Datenschutz, Cookie Consent, Abhängigkeiten und Animationen unverändert. Keine Bilder gelöscht oder doppelt eingebunden. Kein Commit, Push oder Deployment.

## Qualitätssicherung

TypeScript, ESLint, Production Build, 15 Routing-/SEO-Tests und 50 weitere Tests bestanden (65 insgesamt). Lokale Browserprüfung: Services bei 320, 390 und 1470 Pixeln ohne horizontalen Überlauf; Galerie/Lightbox bei 390 Pixeln sowie Galerie bei 1470 Pixeln geprüft. Kein Formular abgesendet.

## Noch manuell / Optimierungspotenzial

1. Echte Rezensions-URL aus dem bestehenden Google Business Profile unter „Um Rezensionen bitten“ kopieren und in src/config/reviews.ts bei googleReviewUrl hinterlegen. Danach Ziel manuell prüfen und regulär veröffentlichen. Leere/ungültige URL zeigt keinen Button. Keine Rezension wird automatisch erstellt.
2. Nach freigegebener Veröffentlichung Search Console beobachten. Keine neue Sitemap oder Domain nötig.
3. Bildperformance: Lazy Loading spart initiale Requests, aber verkleinert keine Dateien. bcizrs (1).png hat ca. 14,4 MiB, weitere Motive 3–4 MiB. Es fehlen responsive Vorschauvarianten/srcset. Empfohlener nächster Schritt: komprimierte WebP/AVIF-Vorschauen in mehreren Breiten erzeugen, Originale für die Großansicht behalten und Bildqualität vergleichen. In diesem Abgleich keine Originalbilder neu komprimiert. Keine Lighthouse-/Core-Web-Vitals-Messung durchgeführt, keine Performance-Punktzahl behauptet.
4. Die zweite Galerie-Kategorie wird erst nach Auswahl gerendert. Die Fotografie-Route selbst ist prerendered und erreichbar; nicht sämtliche 42 Bilder stehen im initialen HTML. Falls die Bildersuche für alle Motive priorisiert wird, beide Kategorien serverseitig ausgeben und die Filterdarstellung ohne doppelte Bilder erhalten.
5. Open Graph hat weiterhin kein eigenes og:image. Optional ein passendes freigegebenes Vorschaubild ergänzen; kein Indexierungsblocker.

Technische Referenz: https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics (Prerendering, Canonicals und HTTP-Status).

## Nachtrag: Bildauswahl

Auf Wunsch entfernt: Kleine Lichtkreise, Bunte Akzente, Grüne Facetten, Offene Linien und Grüne Balance. Galerie und Lightbox enthalten jetzt 37 Motive (20 Kompositionen, 17 auf hellem Hintergrund). Originaldateien bleiben erhalten, sind aber nicht mehr in der Galerie verlinkt.

## Nachtrag: Startseitenlayout

Regionalen Textblock auf Wunsch vollständig aus der Homepage entfernt (kein versteckter SEO-Text). Preisgestaltung unter das Hero in den Leistungsauftakt verschoben: Desktop zweispaltig, mobil untereinander. SEO-Metadaten unverändert. Desktop bei 1440 und Mobilansicht bei 390 Pixeln visuell geprüft.
