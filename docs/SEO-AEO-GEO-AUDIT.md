# Technisches SEO-, AEO- und GEO-Audit – Anna Filippi Studio

Stand: 25. November 2026 · Hauptdomain: https://annafilippi.studio · Projektstand: `327dd8f`

## 1. Ergebnis und Prüfrahmen

Die Website hat bereits eine tragfähige technische Grundlage: neun vorgerenderte öffentliche Seiten, individuelle Metadaten, selbstreferenzierende Canonicals, eine vollständige Sitemap und echte interne HTML-Links. Alle neun Hauptseiten antworteten bei dieser Prüfung mit HTTP 200. Ein kritischer, seitenweiter Indexierungsblocker wurde **nicht nachgewiesen**.

Die wichtigste belegte Schwäche ist die Bildauslieferung: Eine Galeriedatei hat live 15.137.375 Bytes, das Galerie-Einstiegsbild 3.488.779 Bytes. Weitere Ansatzpunkte sind die temporäre www-Weiterleitung, zusätzliche HTML-URL-Varianten, clientseitiges Neurendern des bereits vorhandenen HTML und die mobile Navigation ohne JavaScript. Inhaltlich sind Leistungen und reale beziehungsweise fiktive Projekte gut unterscheidbar; kompakte Kundenantworten und konsistentere Unternehmensdaten würden die Extrahierbarkeit verbessern.

**Kein Ranking, keine Indexierung und keine Empfehlung durch ein KI-System werden zugesichert.** HTTP-Erreichbarkeit und Robots-Freigabe sind Voraussetzungen, keine Nachweise für tatsächliche Aufnahme oder Zitierung.

### Vorgehen

- Lokale Analyse von Routing, Build/Prerendering, HTML-Vorlage, Metadaten, Komponenten, SCSS, Projektdaten, Navigation, Rechtsseiten-Einbindung und vorhandenen Tests.
- Berücksichtigt: `docs/SEO-PRUEFUNG.md`. Historische Ergebnisse wurden nicht ungeprüft als aktueller Zustand übernommen.
- Öffentliche HTTP-GET-Prüfung aller neun Sitemap-Seiten, robots.txt, sitemap.xml, eines unbekannten Pfads und ausgewählter URL-Varianten; Auswertung des initialen HTML ohne JavaScript.
- HEAD-Stichproben für www, einen bekannten Vercel-Deployment-Link, KI-/Suchcrawler-Kennungen und große Produktionsdateien.
- JSON-Parsing aller ausgelieferten JSON-LD-Blöcke, Prüfung von Canonicals, Überschriften, Alt-Attributen, internen Seitenlinks und Fragmentzielen.
- Aktuelle offizielle Dokumentation zu KI-Crawlern, Google-Suche und Schema.org herangezogen; Quellen am Ende.
- Keine Formulare abgeschickt, keine Datenbankzugriffe oder Konfigurationsänderungen vorgenommen, keine Abhängigkeiten installiert.

### Grenzen

Keine Search-Console- oder Bing-Webmaster-Auswertung, kein Google-Unternehmensprofil-Audit, keine echten Crawler-IP-/WAF-Logs, keine CrUX-Felddaten und kein Lighthouse-/PageSpeed-Labordurchlauf. Kein vollständiger visueller Smartphone-/Tablet-/Desktop-Test in diesem Audit. Responsive Regeln wurden im Quellcode geprüft; daraus wird kein bestandener Gerätetest abgeleitet. Externe Projektseiten wurden inhaltlich anhand der lokalen Beschreibung, nicht durch einen vollständigen externen Crawl bewertet.

Die bei Auditbeginn vorhandenen Änderungen in `Services.module.scss` und `ProjectProcess.module.scss` betreffen frühere Kursiv-Anpassungen. Sie wurden unverändert belassen. Die weiteren zuvor gewünschten Typografieänderungen wurden wegen der neuen Vorgabe „nur analysieren“ nicht fortgesetzt. Einzige neue Projektdatei dieses Audits: dieser Bericht.

## 2. Produktionsinventar

Alle folgenden Antworten hatten `Content-Type: text/html; charset=utf-8`, genau einen H1, genau einen passenden Canonical sowie individuelle Title- und Description-Werte. Kein `X-Robots-Tag`, kein `noindex` und kein seitenweites `nofollow` wurden in diesen Antworten festgestellt.

| Route | Status | Title | Title-/Description-Länge | Inhalt im initialen HTML |
|---|---:|---|---:|---|
| `/` | 200 | Webdesign für kleine Unternehmen in Andernach \| Anna Filippi | 60 / 158 | Leistungen, Ablauf, Projekte und Kontakt-CTA |
| `/ueber-mich` | 200 | Über mich — Anna Filippi \| Webentwicklung & Fotografie | 54 / 160 | Persönliche Vorstellung |
| `/projekte` | 200 | Web & Software – Projekte \| Anna Filippi | 40 / 146 | Fünf Projekte einschließlich Demo-Kennzeichnungen |
| `/softwareentwicklung` | 200 | Individuelle Webanwendungen entwickeln lassen \| Anna Filippi | 60 / 157 | FilliCat und Formular-/Buchungsleistungen |
| `/dana-tattoo-studio` | 200 | Website für ein Tattoo-Studio in Andernach \| Anna Filippi | 57 / 153 | Reales Kundenprojekt, Funktionen und Status |
| `/fotografie` | 200 | Schmuckfotografie für Onlineshops \| Anna Filippi Andernach | 58 / 155 | Leistungsbeschreibung und erste Fotokollektion |
| `/kontakt` | 200 | Kontakt — Anna Filippi Studio | 29 / 103 | Formularbeschriftungen und Kontaktweg |
| `/impressum` | 200 | Impressum — Anna Filippi | 24 / 87 | Überschrift, Ladehinweis und Kanzlei-Direktlink; nicht der Rechtstext |
| `/datenschutz` | 200 | Datenschutzerklärung — Anna Filippi | 35 / 122 | Überschrift, Ladehinweis und Kanzlei-Direktlink; nicht der Rechtstext |

Zeichenzahlen sind beschreibend, keine starren SEO-Grenzen. Suchmaschinen können Titel und Snippets umformulieren.

Weitere gemessene Antworten:

| URL/Variante | Beobachtung | Bewertung |
|---|---|---|
| `/robots.txt` | 200, text/plain; `User-agent: *`, `Allow: /`, Sitemap-Verweis | Korrekt erreichbar, keine Crawler-Sperre |
| `/sitemap.xml` | 200, application/xml, neun kanonische HTTPS-URLs | Vollständig für die aktuellen Routen |
| HTTP-Hauptdomain | 308 auf HTTPS-Hauptdomain | Gut |
| HTTP-www | 308 auf HTTPS-www | Danach weiterer Host-Redirect |
| HTTPS-www | 307 auf HTTPS ohne www | Funktioniert, aber temporär; siehe F03 |
| `/projekte/` | 308 auf `/projekte` | Einheitliche Slash-Strategie |
| `/projekte/index.html` | 200, gleicher Inhalt wie `/projekte`; Canonical auf `/projekte` | Zusätzliche abrufbare Variante; siehe F04 |
| Absichtlich unbekannter Audit-Pfad | 404, keine Homepage mit 200 | Kein Soft-404 in dieser Stichprobe |
| `/llms.txt` | 404 | Kein technischer SEO-Fehler |
| Bekannter Vercel-Deployment-Host | 302 zur Vercel-Anmeldung und `X-Robots-Tag: noindex` | Diese Vorschau ist geschützt; nicht auf alle Aliase übertragbar |

Die neun HTML-GETs dauerten im Prüfnetz rund 0,08–0,63 Sekunden einschließlich Abruf. Das sind Einzelmessungen des HTML-Transfers, **keine** TTFB-, LCP-, INP- oder CLS-Felddaten. Die meisten Antworten waren Vercel-Cache-Hits. HTML wird mit `public, max-age=0, must-revalidate` ausgeliefert; das ist für veränderliche Dokumente nicht automatisch ein Fehler.

## 3. Vorhandene Optimierungen, die erhalten bleiben sollten

- `scripts/build.mjs` rendert tatsächliche React-Komponenten für jede Route zu statischem HTML. Keine neue SSR-Plattform erforderlich.
- `src/routes.ts` ist die zentrale Metadatenquelle; `src/App.tsx` aktualisiert Title, Description, Open Graph und Canonical bei interner Navigation.
- Generierte Sitemap deckt alle neun Routen ab. Fehlende `lastmod`-Werte sind kein Defekt; nur verlässliche Änderungsdaten ergänzen, keine bei jedem Build erfundenen Daten.
- `vercel.json` enthält gezielte Rewrites statt eines pauschalen 200-SPA-Fallbacks.
- `lang="de"`, Viewport-Meta, Skip-Link, `main`, `nav`, `header`, `footer`, Fokusstile und Reduced-Motion-Unterstützung sind vorhanden.
- Genau ein H1 pro Hauptseite; in den Hauptinhalten grundsätzlich nachvollziehbare H2-/H3-Struktur. Ein geschlossener Dialog fügt im Roh-HTML einen weiteren H2 „Kontakt“ hinzu; nicht als sichtbarer doppelter Hauptinhalt zu bewerten.
- Alle im initialen HTML geprüften Bilder besitzen ein Alt-Attribut. Leere Alt-Texte bei dekorativen Blumen und redundanten Geräteansichten sind beabsichtigt und sinnvoll.
- Hauptbilder haben überwiegend Größenangaben und hohe Ladepriorität; viele Bilder unterhalb des ersten Bildschirms nutzen Lazy Loading.
- Interne Hauptseiten sind über echte `href`-Links erreichbar. In den untersuchten internen Links und Fragmenten wurde kein fehlendes Ziel gefunden. Rechtliche Footer-Links zeigen auf die vorhandenen Routen.
- Der Footer und der Rechtsseiten-Ladehinweis nutzen `data-nosnippet`. Das ist eine gezielte Snippet-Beschränkung und **kein** seitenweites Indexierungsverbot.
- Demo-Projekte sind ausdrücklich als Demos bezeichnet. FilliCat ist als eigenes Projekt in Entwicklung gekennzeichnet. Keine erfundenen Erfolge oder Bewertungen im geprüften JSON-LD.

## 4. Befunde mit Priorität und Maßnahmen

Status: **Nachgewiesen** = Code/HTTP belegt; **Empfehlung** = Verbesserung ohne nachgewiesenen Defekt; **Offen** = zusätzliche Daten nötig. Aufwand sind grobe Entwicklungsstunden ohne externe Freigabe- oder Wartezeiten.

### F01 · P1 – Überdimensionierte Bilddateien

- **Status / Zustand:** Nachgewiesen. `public/images/portfolio/bcizrs (1).png` wird live mit 15.137.375 Bytes angeboten. `gallery-fillianna.jpg`: 3.488.779 Bytes; `footer-orchid-mobile.png`: 1.800.908 Bytes. `footer.png` lokal: 1.215.827 Bytes. Die eindeutigen lokalen Bildquellen der initialen Fotografie-Seite summieren sich auf etwa 34,2 MB.
- **Dateien / Routen:** `Gallery.tsx`, `Footer.tsx`, `public/images/portfolio/`, `/fotografie`, wiederkehrender Footer auf allen Seiten.
- **Problem / Wirkung:** Für kleine Bildschirmansichten werden große Originale referenziert. Das belastet mobile Verbindungen und kann LCP beziehungsweise die Ladezeit beim Scrollen verschlechtern. Die 34,2 MB sind eine Quellensumme, **nicht** die gemessene Erstlade-Übertragung: Lazy Loading, Viewport und Cache bestimmen den tatsächlichen Abruf.
- **Lösung:** Originale bewahren; passende AVIF/WebP/JPEG-Derivate und responsive `srcset`/`sizes` oder `picture` ausliefern. Kleine Galerie-Vorschauen von Lightbox-Originalen trennen. Hochpriorisiertes Galerie-Einstiegsbild zuerst optimieren. Transparenz der Blumen und fotografische Details visuell prüfen.
- **Aufwand:** 4–8 h einschließlich Bildvergleich.
- **Verifikation:** Network-Transfer bei 390 px und Desktop, Größenwahl über `currentSrc`, Screenshotvergleich, Lighthouse/PSI vor und nach Änderung. Keine Verschlechterung der Bildqualität oder Alt-Texte.

### F02 · P1 – Messbasis für tatsächliche Sichtbarkeit und Web Vitals fehlt im Audit

- **Status / Zustand:** Offen. Keine bestätigten Indexierungsberichte, ausgewählten Google-Canonicals, Suchanfragen, Felddaten oder KI-Verweise verfügbar. Das bedeutet nicht, dass Konten nicht existieren.
- **Betroffen:** Produktionsdomain, Search Console, Bing Webmaster Tools, gegebenenfalls vorhandene datenschutzkonforme Messung.
- **Problem / Wirkung:** Ohne Messbasis sind „schlechte Rankings“, „schlechte Core Web Vitals“ oder eine ausbleibende KI-Zitierung nicht belegbar. Priorisierung nur nach Code kann tatsächliche Engpässe verfehlen.
- **Lösung:** Bestehende Properties prüfen, keine Duplikate anlegen; Sitemap-Status, Seitenindexierung, URL-Prüfung, Suchanfragen und CWV-Berichte auswerten. Repräsentative Seiten mobil und Desktop mit PSI testen. Bei zu wenig CrUX-Traffic Labordaten ausdrücklich getrennt ausweisen.
- **Aufwand:** 1–3 h für Einrichtung/Auswertung; Felddaten benötigen Beobachtungszeit.
- **Verifikation:** Dokumentierter Ausgangsstand und spätere Vergleichsmessung; keine Erfolgsbehauptung allein aus einem SEO-Score.

### F03 · P2 – www wird temporär statt dauerhaft umgeleitet

- **Status / Zustand:** Nachgewiesen. HTTPS-www liefert 307 zur Non-www-Hauptdomain. HTTP-www benötigt zunächst den HTTPS-Schritt.
- **Betroffen:** Vercel-Domainkonfiguration, nicht als www-Regel in `vercel.json` enthalten.
- **Problem / Wirkung:** Eine dauerhaft gewählte Hauptdomain wird schwächer kommuniziert als mit einem permanenten Redirect. Canonicals mildern das Risiko bereits; kein kritischer Duplicate-Content-Fehler.
- **Lösung:** Nach Freigabe permanente 301/308-Domainweiterleitung konfigurieren; Pfad und Query erhalten. Wenn möglich HTTP-www direkt auf das endgültige Ziel führen.
- **Aufwand:** 0,5–1 h.
- **Verifikation:** GET/HEAD ohne automatisches Redirect-Folgen für Homepage und Unterseiten; keine Schleife, endgültige Antwort 200 und passender Canonical.

### F04 · P2 – Öffentliche index.html-Variante

- **Status / Zustand:** Nachgewiesen für `/projekte/index.html`: HTTP 200 mit identischem Seiteninhalt. Weitere Varianten noch nicht vollständig getestet.
- **Betroffen:** `scripts/build.mjs`, `vercel.json`, statische Ausgabestruktur.
- **Problem / Wirkung:** Zusätzliche crawlbare URL; Canonical stimmt bereits und reduziert das Risiko. Keine nachgewiesene Suchmaschinen-Abstrafung.
- **Lösung:** Externe `index.html`-Aufrufe dauerhaft auf die saubere Route lenken, ohne interne Vercel-Rewrite-Ziele in Redirect-Schleifen zu schicken. Zunächst Regelverhalten im Preview testen.
- **Aufwand:** 1–2 h.
- **Verifikation:** Varianten aller neun Seiten, Root-index.html, Slash- und Query-Varianten prüfen; Hauptseiten bleiben 200 und Canonicals unverändert.

### F05 · P2 – Prerender-Inhalt wird clientseitig neu aufgebaut

- **Status / Zustand:** Nachgewiesen: `src/main.tsx` verwendet `createRoot(...).render(...)`, obwohl `scripts/build.mjs` HTML in `#root` vorab rendert.
- **Problem / Wirkung:** Vorhandenes DOM wird neu aufgebaut statt hydriert; zusätzliche Arbeit und potenzielles Flackern beziehungsweise Zurücksetzen von Animationen. Ein konkreter CLS-/INP-Schaden wurde nicht gemessen. Suchcrawler ohne JS erhalten dennoch das HTML.
- **Lösung:** Eignung von `hydrateRoot` prüfen, nicht blind austauschen. Initiale Motion-/Reduced-Motion-Zustände, Browser-/Server-Router, Zeitwerte und Drittanbieter-Einbindungen auf identisches initiales Markup abstimmen.
- **Aufwand:** 3–6 h mit Navigationstests.
- **Verifikation:** Keine Hydration-Warnungen; DOM bleibt stabil; alle direkten Routen, Zurück-/Vorwärtsnavigation und Animationen prüfen; Performanceprofil vergleichen.

### F06 · P2 – Mobile Hauptnavigation ohne JavaScript nicht bedienbar

- **Status / Zustand:** Nachgewiesen im Code: Unter 1301 px hat `.nav` zunächst `display:none`; `.open` wird über React-State gesetzt. Der globale Noscript-Stil korrigiert Opazität/Transform, aber nicht `display`.
- **Dateien:** `Header.tsx`, `Header.module.scss`, `scripts/build.mjs`.
- **Problem / Wirkung:** HTML-Crawler finden die Links, Menschen ohne funktionsfähiges JS können das Menü jedoch nicht öffnen. Nicht mit einer generellen Crawl-Sperre verwechseln.
- **Lösung:** Dezente sichtbare Noscript-Navigation oder progressive, nativ bedienbare Menülösung. Normales Design und Tastaturbedienung erhalten.
- **Aufwand:** 1–2 h.
- **Verifikation:** JS deaktivieren, mobile Breiten 320/390/768 px und 1280 px prüfen; alle öffentlichen Seiten erreichbar, keine Überlagerung.

### F07 · P2 – Rechtstexte fehlen auf der eigenen Seite im initialen HTML

- **Status / Zustand:** Nachgewiesen. Aktive Rechtsseiten verwenden `KanzleiDocument.tsx`. Die Kanzlei-Texte werden erst in `useEffect` über das offizielle externe Script geladen. Prerender enthält einen Ladehinweis sowie einen direkten externen Link.
- **Betroffen:** `/impressum`, `/datenschutz`, `LegalPages/KanzleiDocument.tsx`.
- **Problem / Wirkung:** Anbieterinformationen sind für Extraktoren ohne JS nicht auf der eigenen URL vollständig verfügbar. Direkte Links und Noscript-Hinweis sind bereits gute Rückfallebenen. Dies ist kein Nachweis fehlender Rechtstexte im normalen Browser und keine juristische Compliance-Bewertung.
- **Lösung:** Nur bei offiziell unterstütztem Bereitstellungsweg eine aktuelle serverseitige Ausgabe oder einen zuverlässig aktualisierten Snapshot prüfen. Vorhandene API-Dateien nicht automatisch als aktive Rechtsseiten-Quelle voraussetzen. Keine manuell erfundenen oder veralteten Rechtstexte einfügen; Synchronisation und Ausfallverhalten gehören zur Lösung.
- **Aufwand:** 4–8 h nach Klärung des offiziell zulässigen Integrationswegs.
- **Verifikation:** Initialer HTML-Response enthält vollständigen aktuellen Originaltext; Abgleich mit Kanzlei-Version und Prüfung von SPA-Navigation, Aktualisierung und Ausfall-Fallback.

### F08 · P2 – Asset- und Rendering-Budget verbessern

- **Status / Zustand:** Nachgewiesene Ausgangsdaten, Wirkung noch zu messen. Live-JS-Datei: 476.181 Bytes; CSS: 103.516 Bytes, jeweils unkomprimierte Content-Length. Beide HEAD-Antworten hatten `max-age=0, must-revalidate`. Alle Seitenkomponenten werden statisch in `App.tsx` importiert; mehrere lokal gehostete Schriftfamilien sind eingebunden.
- **Problem / Wirkung:** Gemeinsamer JS-Aufwand auch auf kleinen Seiten; unnötige Revalidierung gehashter Assets möglich. Die Übertragungsgröße bei Brotli/Gzip und tatsächliche Schriftabrufe wurden nicht als Network-Waterfall gemessen.
- **Lösung:** Nach Profiling Route-/Funktions-Splitting mit weiterhin vollständigem Prerender prüfen. Lange immutable-Cache-Laufzeiten nur für inhaltsgehashte Dateien unter `/assets/`; nicht pauschal für APIs, Rechtstexte oder unversionierte Bilder. Tatsächlich verwendete Fonts prüfen, Design beibehalten.
- **Aufwand:** 3–6 h.
- **Verifikation:** Wiederholungsaufruf/Cache-Waterfall, komprimierte Bytes, JS-Parse-/Ausführungszeit; alle Routen weiterhin vollständig im HTML.

### F09 · P2 – Inhaltliche Antworten und regionale Einordnung ausbauen

- **Status / Zustand:** Empfehlung. Leistungen, Zusammenarbeit und individuelle Preise sind verständlich beschrieben. Es gibt keinen dedizierten Kunden-FAQ-Abschnitt. Andernach/Koblenz und deutschlandweite Zusammenarbeit stehen im Hero und Fotografie-Text. Neuwied, Mayen, Bonn und Bad Ems wurden im aktiven `src` nicht gefunden.
- **Betroffen:** `Services.tsx`, `ProjectProcess.tsx`, Software-/Fotografieseite, regionale Inhalte.
- **Problem / Wirkung:** Konkrete Suchfragen zu Umfang, Betreuung, benötigten Materialien und Arbeitsweise werden nur teilweise direkt beantwortet; kein technischer Defekt. Der alte Bericht nennt einen regionalen Absatz, der im aktuellen Code nicht mehr enthalten ist.
- **Lösung:** Kurze, wahrheitsgemäße Fragen/Antworten ergänzen, z. B. „Für wen entwickelst du Websites?“, „Kann meine bestehende Website überarbeitet werden?“, „Wie wird der Preis ermittelt?“, „Unterstützt du Domain und Veröffentlichung?“, „Wie läuft die Zusammenarbeit außerhalb Andernachs?“, „Was muss ich für Produktfotos bereitstellen?“. Antworten aus bestätigtem Leistungsumfang ableiten; keine kostenlosen Zusatzleistungen oder festen Fristen erfinden. Regionale Gebiete nur bei tatsächlich angebotenem Service erwähnen.
- **Aufwand:** 2–4 h Redaktion/Integration nach Freigabe.
- **Verifikation:** Antworten im initialen HTML sichtbar; verständliche Überschriften und Links; kein Keyword-Stuffing und keine Behauptung erfundener Niederlassungen.

### F10 · P2 – Strukturierte Identität präzisieren

- **Status / Zustand:** Nachgewiesen: pro Seite ein syntaktisch gültiger JSON-LD-Graph mit `WebSite` und `Person`. `WebSite.publisher` referenziert die Person. `alternateName: Fillanna` steht bei beiden Knoten, ist im untersuchten sichtbaren Hauptinhalt nicht als Markenalias erklärt. Keine `Organization`, `Service` oder routenspezifischen `WebPage`-Knoten.
- **Dateien:** `index.html`, perspektivisch zentraler Schema-Generator im vorhandenen Prerender-/Metadatenpfad.
- **Problem / Wirkung:** Person und Studiomarke werden weniger eindeutig getrennt; Alias könnte missverständlich sein. Fehlende zusätzliche Typen sind kein Indexierungsfehler. Gleiche Website-/Person-IDs auf Unterseiten sind korrekt und nicht automatisch unerwünschte Duplikate.
- **Lösung:** Alias fachlich bestätigen und sichtbar erklären oder später entfernen. Eine einzige passende Studio-Entität mit stabiler ID anlegen, sofern sachlich begründet; Person damit verknüpfen. Routenspezifische WebPage-/Service-Daten nur aus sichtbaren Inhalten ableiten. Keine erfundenen Adressen, Bewertungen oder Profile.
- **Aufwand:** 2–4 h.
- **Verifikation:** JSON-Parsing, Schema Markup Validator, geeignete Google-Tests; stabile IDs, Referenzen und Übereinstimmung mit sichtbaren Fakten. Kein Anspruch auf Rich Results allein aus gültigem JSON.

### F11 · P3 – Projektkarussell wiederholt Roh-HTML

- **Status / Zustand:** Nachgewiesen. `FeaturedProjects.tsx` rendert die fünf Projekte dreifach für die Endlosschleife. Kopien sind bereits `aria-hidden` und `inert`; dadurch kein pauschaler Accessibility-Fehler. Homepage enthält 49 Bild-Tags und 15 Projekt-H3 im Roh-HTML.
- **Problem / Wirkung:** Zusätzlicher DOM-/HTML-Aufwand und wiederholte Informationen für einfache Extraktoren. Wiederholte Bild-URLs bedeuten nicht automatisch mehrfachen Netzwerkdownload; keine Duplicate-Content-Strafe behaupten.
- **Lösung:** Bei Performancebedarf eine semantische Projektliste serverseitig ausgeben und Schleifenkopien clientseitig ergänzen oder Karussell ohne dreifache Inhaltskopie prüfen. Nicht allein für SEO eine funktionierende Animation ersetzen.
- **Aufwand:** 3–5 h.
- **Verifikation:** Tastatur-, Screenreader-, Touch- und Endlosschleifentests; alle fünf Projekte bleiben ohne JS auffindbar; DOM-/Transfervergleich.

### F12 · P3 – Fallstudien und Meta-Vorschau gezielt vertiefen

- **Status / Zustand:** Empfehlung. Echte Projekt-/Demo-Trennung ist vorhanden; Dana hat eine eigene Detailroute. `og:image` fehlt in der HTML-Vorlage. H1 auf der Homepage ist markenorientiert, während Title und Einleitung bereits Webdesign/Standort erklären.
- **Problem / Wirkung:** Projektbeschreibungen könnten nachvollziehbare Ausgangslage, eigene Rolle und belegte Ergebnisse stärker vermitteln. Fehlendes Social-Share-Bild beeinträchtigt Vorschauen, blockiert aber keine Indexierung. Der aktuelle H1 ist nicht „falsch“.
- **Lösung:** Echte Fallstudien mit freigegebenen Fakten und Aktualisierungsstand ergänzen; Demo-Ergebnisse nicht als Kundenwirkung darstellen. Freigegebenes OG-Motiv mit absoluter URL und Alt-Beschreibung ergänzen. H1 nur bei redaktionellem Bedarf konkreter formulieren, keine pauschale Keyword-Wiederholung.
- **Aufwand:** 1–2 h OG-Metadaten; 2–4 h je Fallstudie plus fachliche Freigabe.
- **Verifikation:** Share-Preview, URL-Erreichbarkeit, sichtbare Herkunft/Projektstatus; Angaben mit tatsächlichen Projekten abgleichen.

## 5. AEO und GEO: Eignung und Crawler-Steuerung

### Verständlichkeit und Zitierfähigkeit

Unternehmensname, Person, Standort Andernach und Leistungen sind aus dem initialen HTML erkennbar. Die Zielgruppe wird im Title/Description konkret als kleine Unternehmen und Selbstständige bezeichnet; die sichtbare Einleitung verwendet allgemeiner „Business“. Eine kurze sichtbare Zielgruppenformulierung wäre konsistenter, ist aber keine Voraussetzung für Suchbarkeit.

Die fünf Prozessschritte, sechs Leistungsfelder, transparente individuelle Preisermittlung und Projektstatus liefern bereits brauchbare Antworten. Sinnvoll sind ergänzende kurze Erläuterungen mit eigenem Erfahrungswert: Welche Inhalte ein Studio für seine Website vorbereiten sollte; wann ein Formular statt einer vollständigen Web-App genügt; wie Produkte für Schmuckfotografie vorbereitet werden. Nur fachlich gepflegte Inhalte veröffentlichen, nicht dutzende automatisch erzeugte Ortsartikel.

### Suchcrawler und Training unterscheiden

| Agent/Steuerung | Zweck | Beobachteter Zustand / Einschränkung |
|---|---|---|
| OAI-SearchBot | OpenAI-Suche | Durch Wildcard-Regel erlaubt; synthetische HEAD-Anfrage 200 |
| GPTBot | Mögliche Nutzung für Modelltraining | Ebenfalls erlaubt; getrennte redaktionelle Entscheidung, keine Voraussetzung für OAI-Suche |
| ChatGPT-User | Nutzerinitiierter Abruf | Von Such-/Trainingscrawl unterscheiden; kein Nachweis tatsächlicher Besuche |
| PerplexityBot | Suchergebnisse und Quellenlinks, laut Anbieter kein Foundation-Model-Training | Wildcard erlaubt; synthetische HEAD-Anfrage 200 |
| Perplexity-User | Nutzerinitiierter Abruf | Nicht mit PerplexityBot gleichsetzen |
| Googlebot | Google-Suche | Wildcard erlaubt; synthetische HEAD-Anfrage 200 |
| Google-Extended | Steuerung bestimmter Trainings- und Nicht-Suche-Grounding-Nutzungen | Keine gezielte Sperre; nicht als einfacher „nur Training“-Schalter behandeln |
| Bingbot | Bing-Suche | Wildcard erlaubt; synthetische HEAD-Anfrage 200 |

Ein selbst gesetzter User-Agent ist **kein echter Bot-Zugriff**. Die Antworten belegen nur, dass die getesteten Kennungen aus dem Prüfnetz nicht abgewiesen wurden. IP-basierte WAF-Regeln, tatsächlich erfolgtes Crawling, Bing-/Google-Indexierung und KI-Zitierungen bleiben ohne Anbieterberichte/Logs offen. Sicherheitsschutz nicht pauschal abschalten.

OpenAI beschreibt getrennte Steuerungen für OAI-SearchBot und GPTBot. Perplexity unterscheidet ebenfalls Suchbot und Nutzerabruf. Google dokumentiert zusätzlich die getrennte Behandlung von Suche, Training und Nicht-Suche-Grounding; die aktuellen Search-Console-Einstellungen für generative Suche wurden hier nicht eingesehen. [OpenAI](https://developers.openai.com/api/docs/bots), [Perplexity](https://docs.perplexity.ai/docs/resources/perplexity-crawlers), [Google-Kontrollen](https://developers.google.com/search/docs/fundamentals/gen-ai-controls).

### llms.txt

Aktuell nicht vorhanden (404). **P3, optional, kein Mangel.** Für dieses kleine Portfolio haben HTML, Metadaten, gute Inhalte und schnelle Bilder Vorrang. Eine spätere Datei könnte als gepflegte Übersicht auf kanonische Leistungs-/Projektseiten verweisen; sie darf keine parallele, widersprüchliche Faktenquelle werden. Google nennt llms.txt ausdrücklich nicht als Voraussetzung und verwendet die Datei nicht als besonderes Sichtbarkeitssignal. Aufwand bei Bedarf etwa 0,5–1 h; Prüfung auf funktionierende Links und Konsistenz. [Google-Leitfaden](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide).

## 6. Strukturierte Daten: Typenbewertung

Alle neun geprüften JSON-LD-Blöcke lassen sich parsen. Das ist eine Syntaxprüfung; ein vollständiger externer Rich-Results-/Schema-Validatorlauf fand nicht statt. Der bestehende Graph ist grundsätzlich plausibel. Person und Website sollten nicht bei jeder Ergänzung neu mit anderen IDs angelegt werden.

| Typ | Aktuell | Eignung / Empfehlung |
|---|---|---|
| `Person` | Vorhanden | Anna Filippi als handelnde Person beibehalten. Beruf und Kenntnisse mit sichtbaren Angaben abgleichen. |
| `WebSite` | Vorhanden | Beibehalten; stabiler Name, URL, Sprache und Publisher. |
| `Organization` | Nicht vorhanden | Für die Studiomarke erwägen, sofern sie als Organisation/Geschäft auftritt. Mit Person verknüpfen, keine zweite widersprüchliche Geschäftsidentität. |
| `ProfessionalService` | Nicht vorhanden | Nicht pauschal hinzufügen: Schema.org kennzeichnet den allgemeinen Typ als deprecated. Passende Organization-/LocalBusiness-Modellierung und separate Services sind sauberer; tatsächliche Unternehmensform beachten. |
| `WebPage` | Nicht vorhanden | Pro Route mit stabiler `@id`, `url`, `name`, `description`, `isPartOf` und geeignetem `about` sinnvoll. Keine fremden Fakten hinzufügen. |
| `Service` | Nicht vorhanden | Für tatsächlich angebotene Webentwicklung/Fotografie sinnvoll, mit bestätigtem Anbieter und Gebiet; nur sichtbare Leistungen, keine erfundenen Preise. |
| `BreadcrumbList` | Nicht vorhanden | Erst bei sinnvoller sichtbarer Navigation ergänzen; z. B. Start → Projekte → Dana Tattoo Studio. Keine künstliche Hierarchie. |
| `FAQPage` | Nicht vorhanden | Erst bei sichtbarem Frage-Antwort-Inhalt und passender Semantik prüfen; nicht als Pflicht oder Versprechen einer Google-Sonderdarstellung verkaufen. Inhalte haben Vorrang vor Markup. |

Keine `AggregateRating`- oder Review-Daten aus Demo-Votes ableiten. Die bestehenden interaktiven Projektbewertungen sind nicht automatisch verifizierte Kundenbewertungen. Keine Bewertungen, Standorte, Öffnungszeiten oder `sameAs`-Profile erfinden. [Schema.org: ProfessionalService](https://schema.org/ProfessionalService).

## 7. Local SEO: Region und Leistungen

| Region | Aktueller Nachweis | Natürlicher nächster Schritt |
|---|---|---|
| Andernach | Standort in Hero/Metadaten/Person-Schema; reales Dana-Projekt | Als tatsächlichen Standort konsistent halten; echte Referenz vertiefen |
| Koblenz | „Andernach bei Koblenz“ in Leistungs-/Metadaten | Servicegebiet/Arbeitsweise klar erklären, keine Niederlassung behaupten |
| Neuwied | Keine Nennung im aktiven `src` gefunden | Bei bestätigtem Einzugsgebiet gemeinsam mit regionaler Zusammenarbeit erläutern |
| Mayen | Keine Nennung im aktiven `src` gefunden | Wie Neuwied; eigenständige Seite nur mit eigenständigem Nutzen |
| Bonn | Keine Nennung im aktiven `src` gefunden | Überregionale Zusammenarbeit erläutern; keine lokale Adresse erfinden |
| Bad Ems | Keine Nennung im aktiven `src` gefunden | Tatsächliches Servicegebiet nach Bestätigung nennen |

Die fehlende Ortsnennung ist keine technische Fehlfunktion. Ein hochwertiger regionaler Abschnitt und echte Projektbeispiele sind sinnvoller als sechs fast identische Standortseiten. Der Bericht vom Oktober ist in diesem Punkt überholt: sein beschriebener regionaler Absatz ist aktuell nicht nachweisbar.

| Leistung | Bestehende Abdeckung | Ausbau ohne Duplikate |
|---|---|---|
| Webdesign / individuelle Websites | Homepage, Services, Projekte | Leistungsumfang, Zielgruppe, Redesign und Veröffentlichung verständlich bündeln |
| Webentwicklung / Web-Applikationen | Eigene Softwareseite, FilliCat, FormSolutions | Konkrete Einsatzfälle und Grenzen erklären |
| Onlineshop-Entwicklung | E-Commerce-/Shopify-Leistung und Demo-Kataloge | Tatsächlichen Leistungsumfang und Demo-Status beibehalten; reale Shop-Referenzen nur mit Beleg |
| KI-Integrationen | Leistungsfeld mit Machbarkeitsvorbehalt | Echte Anwendungsfälle, Datenschutz-/Betriebsfragen nach fachlicher Klärung |
| Produktfotografie | Eigene Seite mit Fotos und regionaler Einleitung | Ablauf, verwendbare Bildformate und Vorbereitung erläutern; Bilder optimieren |

Ein Google-Unternehmensprofil wurde nicht überprüft. Vor Einrichtung oder Änderung Existenz, Berechtigung, echten Standort beziehungsweise Servicegebiet und konsistente Kontaktdaten klären. Keine virtuellen Filialen für Zielstädte anlegen.

## 8. Mobile Darstellung, Semantik und Performance-Grenzen

Responsive Breakpoints, flexible Grids, `clamp`, Fokusstile und reduzierte Animationen sind im Code vorhanden. Die Prozessdarstellung wechselt auf eine Spalte. Das Menü besitzt `aria-expanded`, `aria-controls` und Escape-Verhalten. Das sind positive Codebefunde, aber keine vollständige Accessibility-Zertifizierung.

Einige Geräte-Mockup-Bilder haben keine eigenen width/height-Attribute (Homepage 30 Bild-Tags, Projekte fünf). Die umgebenden Mockup-Flächen verwenden jedoch feste `aspect-ratio`-Werte. Daraus allein lässt sich **kein CLS-Fehler** ableiten. Nach den Bildoptimierungen visuell bei 320, 390, 768, 1280 und 1440 px prüfen: Überläufe, Zoom, Tastaturfokus, Menü, Projektkarussell, Galeriefilter und Lightbox. Interaktive Inhalte wie zweite Fotokollektion, Bewertungsstände und Buchungsdemo sind nicht vollständig im initialen Zustand enthalten; zentrale Leistungsinformationen dagegen schon. Es muss nicht jeder interaktive Zustand indexierbar sein.

Für Core Web Vitals sind getrennte Messungen von LCP, INP und CLS erforderlich. Ohne Felddaten werden keine bestanden/nicht-bestanden-Werte angegeben. Der 1,2-Sekunden-Hero-Einblendeeffekt und das clientseitige Neuaufbauen sind Kandidaten für Profiling, kein belegter LCP-Ausfall. Design/Animationen nicht auf Verdacht entfernen.

## 9. Lokal versus Production und Tests

Live-Titles stimmen mit `src/routes.ts` überein, öffentliche Routenzahl und wesentliche Inhalte sind konsistent. Live-Assets heißen `index-Dx3VRCsq.js` und `index-DuWhvjRM.css`; der bereits vorhandene lokale Build verwendet andere Hashes. Die lokalen, noch nicht veröffentlichten Kursivänderungen erklären zumindest einen CSS-Unterschied; ein Hashvergleich allein beweist keine vollständige Deployment-Parität. Die verknüpfte Vercel-Commit-ID wurde in diesem Audit nicht überprüft.

Ausgeführt während des Audits:

- `npm run typecheck`: erfolgreich.
- `npm run lint`: erfolgreich.
- `node --test scripts/routing.test.mjs`: 17/17 erfolgreich, gegen vorhandenes `dist`.
- `node --test tests/*.test.mjs`: 75/75 erfolgreich; insgesamt 92 Tests.
- Öffentliche GET-/HEAD-Prüfungen wie oben beschrieben; keine echten E-Mails, Buchungen oder Bewertungsabgaben.

`npm run build` war unmittelbar vor Auditbeginn für die vorherige Typografieaufgabe erfolgreich. Während dieses reinen Audits wurde kein neuer Build gestartet. Die Tests bestätigen die vorhandenen Assertions, nicht automatisch Suchmaschinenindexierung, visuelle Qualität oder CWV. Insbesondere erwarten die Rechtsseiten-Tests derzeit den Ladehinweis und prüfen damit nicht vollständige Rechtstexte im Prerender.

## 10. Maßnahmenplan nach Freigabe

| Reihenfolge | Priorität | Maßnahme | Abnahme |
|---:|---|---|---|
| 1 | P1 | F01: Galerie-Hero, große Galerie-Vorschauen und Footer-Bilder optimieren | Visuelle Gleichwertigkeit, deutlich kleinere passende Bildantworten |
| 2 | P1 | F02: vorhandene Search-Console-/Bing-/PSI-Messbasis erfassen | Dokumentierte Indexierungs- und Performance-Ausgangslage |
| 3 | P2 | F03/F04: dauerhafte Hauptdomain und HTML-Varianten konsolidieren | Redirect-Matrix ohne Schleifen; 200 auf Canonical-Zielen |
| 4 | P2 | F05/F06/F08: Hydration, JS-Ausfall-Navigation und Asset-Budget | SSR erhalten, keine Konsolenfehler, mobile Bedienung und Messvergleich |
| 5 | P2 | F09/F10: abgestimmte Kundenantworten, regionale Angaben und Identität | Sichtbare Fakten und Schema konsistent, keine neuen unbelegten Behauptungen |
| 6 | P2 | F07: unterstützten serverseitigen Kanzlei-Weg separat klären | Vollständigkeit und automatische Aktualität, keine improvisierten Rechtstexte |
| 7 | P3 | F11/F12 und gegebenenfalls llms.txt | Nur bei erkennbarem Nutzen; Design und funktionierende Navigation erhalten |

**P0 – Kritisch:** Kein P0-Befund nachgewiesen. Neue Erkenntnisse aus Search Console oder realen Ausfällen können die Priorisierung verändern.

Nach jeder freigegebenen Teilumsetzung: Diff prüfen, vorhandene Tests/Typecheck/Lint und Build ausführen, relevante Live-/Preview-Prüfung wiederholen. Keine automatischen Veröffentlichungen aus diesem Bericht ableiten. Umsetzung erst nach ausdrücklicher Freigabe.

## 11. Quellen und Reproduzierbarkeit

Primärquellen, geprüft am 25.11.2026:

- [Google: Optimierung für generative Suchfunktionen](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) – technische Grundlagen, Inhalte, keine besondere llms.txt- oder Schema-Pflicht.
- [Google: Kontrollen für generative KI](https://developers.google.com/search/docs/fundamentals/gen-ai-controls) – Suche, Training, Grounding und Snippet-Steuerung unterscheiden.
- [OpenAI: Crawler](https://developers.openai.com/api/docs/bots) – OAI-SearchBot, GPTBot und nutzerinitiierte Abrufe.
- [Perplexity: Crawler](https://docs.perplexity.ai/docs/resources/perplexity-crawlers) – Suchbot, Nutzerabrufe und verifizierte IP-Bereiche.
- [Schema.org: ProfessionalService](https://schema.org/ProfessionalService) – Deprecation des allgemeinen Typs.

Projektbelege: `index.html`, `src/routes.ts`, `src/main.tsx`, `src/App.tsx`, `src/entry-server.tsx`, `scripts/build.mjs`, `scripts/routing.test.mjs`, `public/robots.txt`, `public/sitemap.xml`, `vercel.json`, `src/data/projects.ts`, die genannten Komponenten und SCSS-Module sowie `docs/SEO-PRUEFUNG.md`.

HTTP-Belege beruhen auf direkten öffentlichen Abrufen, nicht auf Suchmaschinen-Snippets. Temporäre Rohmessungen liegen außerhalb des Projekts unter `/tmp/anna-seo-live.json` und `/tmp/anna-seo-head.json`; die für Entscheidungen relevanten Werte sind in diesem Bericht dokumentiert. Temporäre Dateien sind keine dauerhaften Berichtsvoraussetzungen. Geheimnisse, API-Schlüssel und Anmeldungstokens wurden nicht in diesen Bericht aufgenommen.
