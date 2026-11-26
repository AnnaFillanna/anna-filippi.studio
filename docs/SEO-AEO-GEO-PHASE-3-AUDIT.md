# Phase 3 – Bestandsanalyse und Qualitätsprüfung: Structured Data & Entity SEO

Stand: 26.11.2026 · Projekt: Anna Filippi Studio · untersuchter HEAD: `a387c63`

## 1. Ergebnis

Die technische Grundlage ist weitgehend vorhanden: 16 öffentliche, vorgerenderte Seiten mit individuellen Metadaten, interner Erreichbarkeit und 22 syntaktisch gültigen JSON-LD-Blöcken. WebSite und Person stehen auf jeder Seite; alle sechs Insights-Artikel besitzen bereits Article und BreadcrumbList. Diese Implementierungen dürfen nicht nochmals parallel angelegt werden.

**Die Bestandsanalyse ist abgeschlossen. Phase 3 als Qualitätsbereinigung ist noch nicht vollständig abgeschlossen:** Die Zuordnung von „Fillanna“ zu Person, Studiowebsite und eigenem Schmuckprojekt ist nicht eindeutig. Außerdem kündigt die Über-mich-Seite einen Überblick abgeschlossener Zertifizierungen an, ohne konkrete Zertifikate aufzuführen. Das sind belegte Unklarheiten im aktuellen Inhalt, keine nachgewiesenen falschen Lebenslaufangaben. Es wurden keine kritischen technischen Fehler oder P0-Befunde festgestellt.

Eine umfangreiche Schema-Erweiterung ist nicht notwendig. Vorrang haben bestätigte Identitätsangaben und ein ehrlicher Qualifikationsstand. Weitere Typen wie FAQPage oder EducationalOccupationalCredential dürfen nicht allein zur Vervollständigung einer Liste ergänzt werden.

Es wurden ausschließlich gelesen, getestet und dokumentiert. Einzige neue Projektdatei ist dieser Bericht. Keine Quelltexte, Inhalte, Designs, Konfigurationen oder bestehenden Dokumente verändert; keine Abhängigkeiten installiert; kein Commit, Push oder Deployment. Der erlaubte Production Build hat die ignorierten Build-Artefakte neu erzeugt. Zu Beginn waren weder uncommittete noch unversionierte Änderungen vorhanden.

## 2. Prüfumfang und Aussagegrenzen

Grundlage ist der aktuelle Quellbaum, nicht allein der ursprüngliche Audit. Inventarisiert wurden `src`, Routing, Build/Prerender, Konfiguration, Tests und die Git-Historie seit `327dd8f`. Vertieft geprüft wurden sämtliche Schema-Erzeugungsstellen, alle veröffentlichten Artikeldaten, aktive Seitenkomponenten, Über-mich-/Schwerpunktdarstellung, Leistungen, Projekte, Navigation, Metadaten und deren Ausgabe im Build. Die API- und Sicherheitsfunktionen wurden nicht verändert; ihre vorhandenen Tests liefen mit.

Verglichen wurden `docs/SEO-AEO-GEO-AUDIT.md`, `docs/BILDOPTIMIERUNG.md`, `docs/SEO-AEO-GEO-PHASE-2.md` sowie die aktuelle Redaktionsdokumentation `docs/INSIGHTS.md`. Inaktive Komponenten wurden von tatsächlich gerenderten Seiten unterschieden: `components/About/About.tsx` ist nicht die aktive Über-mich-Route; maßgeblich ist `AboutPage.tsx`.

Die JSON-LD-Prüfung umfasst JSON-Parsing, Struktur- und Referenzkontrollen sowie den Abgleich mit sichtbarem HTML und offiziellen Typdefinitionen. Sie ist **kein vollständiger externer Schema.org-Validator- oder Google-Rich-Results-Test**. Tatsächliche Abschlüsse, Zertifikate, Unternehmensprofile und externe Projektleistungen können aus diesem Repository nicht unabhängig bewiesen werden. Search Console, Bing Webmaster Tools und Anbieter-/Crawler-Logs standen nicht zur Verfügung. E-E-A-T wird als qualitative Betrachtung verwendet, nicht als messbarer Punktestand.

## 3. Änderungen seit dem ursprünglichen Audit und Copilot-Zuordnung

| Commit | Nachweisbare Änderung | Zuordnung |
|---|---|---|
| `9c4c949` | Insights-Bereich, erster Kostenartikel, Artikelmodell, Article/BreadcrumbList, Prerender-/Metadatenintegration; außerdem responsive Bildauslieferung und Bildvarianten | Commit enthält `Co-authored-by: Copilot`; Mitwirkung an diesem Commit belegt, nicht alleinige Urheberschaft jeder Zeile |
| `47a2860` | Artikel Agentur/Freelancer, Vergleichstabelle, Verlinkung und Tests | Copilot-Mitwirkung durch Trailer belegt |
| `bb801a1` | Weitere Artikel zu SEO/AEO, E-Commerce, KI/Automatisierung und Produktfotografie; WebP-Artikelbilder und ergänzte Tests | Copilot-Mitwirkung durch Trailer belegt |
| `a39093f` | Persönlicher Werdegang, Zielgruppe, Arbeitsweise, Weiterbildungstext und mobile Über-mich-Darstellung | Copilot-Mitwirkung durch Trailer belegt |
| `25ac6bd` | ExpertiseMap mit Fachschwerpunkten und sichtbarer Kennzeichnung als Ausrichtung/Weiterentwicklungsbereiche | Copilot-Mitwirkung durch Trailer belegt |
| `a387c63` | Phase-2-Redirects, Noscript-Navigation, Sitemap-Abgleich, technische SEO-Tests und Berichte | Kein Copilot-Trailer; keine Zuordnung zu Copilot aus der Historie |

Der ursprüngliche Audit mit neun Seiten ist als Bestandsbeschreibung überholt: Es gibt jetzt 16 Seiten, sichtbare FAQ-Abschnitte in sechs Artikeln und bereits Article-/Breadcrumb-Markup. Die damalige Feststellung, FILLANNA sei im Inhalt nicht erklärt, muss präzisiert werden: FILLANNA ist inzwischen als eigenes Projekt beschrieben, allerdings nicht als Alias von Anna beziehungsweise der Studiowebsite. Phase 1 und Phase 2 sind im aktuellen HEAD enthalten.

## 4. Ergebnisübersicht

Statuswerte: **Erfüllt** – bereits korrekt umgesetzt; **Teilweise erfüllt** – vorhanden, aber verbesserungsfähig; **Nicht erfüllt** – fehlt und sollte ergänzt bzw. geklärt werden; **Nicht erforderlich** – derzeit kein sinnvoller Implementierungsbedarf; **Nicht überprüfbar** – zusätzliche Angaben oder externe Prüfungen nötig. Prioritäten: P0 kritisch, P1 hoch, P2 mittel, P3 optional. Bei erfüllten Punkten bezeichnet P3 lediglich niedrigen Handlungsbedarf, keinen Änderungsauftrag.

| Prüfbereich | Aktueller Zustand | Status | Betroffene Datei | Festgestelltes Problem | Empfohlene Maßnahme | Priorität |
|---|---|---|---|---|---|---|
| JSON-Syntax | 22 Blöcke auf 16 Seiten parsebar | Erfüllt | `index.html`, `src/routes.ts`, `scripts/build.mjs` | Kein Syntaxfehler | Bestehenden Generator beibehalten | P3 |
| Initiales HTML | Alle vorhandenen Schema-Blöcke im Prerender | Erfüllt | `src/entry-server.tsx`, `scripts/build.mjs` | Keine JS-Abhängigkeit für dieses Markup | Nicht zusätzlich client-only implementieren | P3 |
| Person | Stabile ID, Name, Ort, Tätigkeitsfelder | Teilweise erfüllt | `index.html`, `AboutPage.tsx` | Alias unklar; Berufsbezeichnung und laufende Weiterbildung brauchen kontextuelle Abgrenzung | Alias und sachliche Tätigkeitsbeschreibung bestätigen | P2 |
| WebSite | Stabile ID, URL, Sprache, Publisher-Person | Teilweise erfüllt | `index.html` | `alternateName: Fillanna` passt nicht eindeutig zum beschriebenen separaten Projekt | Identität klären; keine zweite Website-Entität anlegen | P2 |
| Organization | Keine eigene Studio-Entität | Nicht erforderlich | `index.html` | Person als Anbieter/Publisher ist nicht automatisch falsch | Nur bei bestätigter eigenständiger Geschäfts-/Markenmodellierung erwägen | P3 |
| ProfessionalService | Nicht vorhanden | Nicht erforderlich | `index.html` | Allgemeiner Typ von Schema.org deprecated | Nicht pauschal ergänzen | P3 |
| LocalBusiness | Nicht vorhanden | Nicht überprüfbar | `index.html`, Rechtsseiten | Öffentlich bestätigte Unternehmens-/Standortdaten für eine vollständige Modellierung hier nicht verifiziert | Eignung zuerst bestätigen, keine Anschrift/Öffnungszeiten erfinden | P3 |
| WebPage | Keine eigenständigen Seitenknoten | Nicht erforderlich | `src/routes.ts` | Kein Indexierungsdefekt; zusätzliche Verknüpfung möglich | Optional eine konsistente routenbezogene Modellierung | P3 |
| AboutPage | Semantische HTML-Seite, kein JSON-LD-Typ | Nicht erforderlich | `AboutPage.tsx`, `src/routes.ts` | Person-Bezug nur indirekt | Optional mit `mainEntity` auf bestehende Person verweisen | P3 |
| ContactPage | Kontaktseite vorhanden, kein JSON-LD-Typ | Nicht erforderlich | `Contact.tsx`, `src/routes.ts` | Kein technischer Fehler | Optional im gemeinsamen Seitenmodell | P3 |
| Service | Sechs sichtbare Leistungsfelder, kein Service-Markup | Nicht erforderlich | `Services.tsx`, `src/routes.ts` | Angebote sind bereits lesbar | Optional bestätigte Leistungen mit Anbieter verknüpfen | P3 |
| Article / BlogPosting | Sechs Article-Knoten | Erfüllt | `src/routes.ts`, `src/data/insights.ts` | Keine Notwendigkeit für parallele BlogPosting-Knoten | Article beibehalten; Ergänzungen nur mit Nutzen | P3 |
| BreadcrumbList | Drei sichtbare Ebenen pro Artikel | Erfüllt | `InsightPage.tsx`, `src/routes.ts` | Keine widersprüchliche Hierarchie | Vorhandene Daten weiterverwenden | P3 |
| FAQPage | Sichtbare FAQ, kein FAQ-Schema | Nicht erforderlich | `insights.ts`, `InsightPage.tsx` | Kein Pflicht-Markup, kein garantierter Suchvorteil | Nur optional und ausschließlich für sichtbare Fragen/Antworten | P3 |
| EducationalOccupationalCredential | Keine konkreten Credential-Daten | Nicht erforderlich | `AboutPage.tsx` | Keine bestätigten Zertifikatdetails als Grundlage | Erst nach verifizierten Angaben modellieren; laufenden Kurs nicht als erworbenen Abschluss auszeichnen | P3 |
| Zertifikatsüberblick | Im Text angekündigt, nicht ausgeführt | Nicht erfüllt | `AboutPage.tsx:67–70` | Besucher finden den versprochenen Überblick nicht | Nach Freigabe reale Einträge mit Status ergänzen oder Ankündigung korrigieren | P2 |
| Fachliche Schwerpunkte | Textliste und zugängliche Grafik | Erfüllt | `ExpertiseMap.tsx`, `AboutPage.tsx` | Keine erfundenen Auszeichnungen in der Grafik | Kennzeichnung als Ausrichtung/Weiterentwicklung erhalten | P3 |
| Identität FILLANNA | Eigenes Projekt in Artikeln, Alias im Schema | Teilweise erfüllt | `index.html`, `insights.ts` | Projekt und Personen-/Websiteidentität können vermischt werden | Beziehung ausdrücklich bestätigen und konsistent modellieren | P2 |
| sameAs / offizielle Profile | Kein sameAs, keine bestätigte Profilliste | Nicht überprüfbar | `index.html`, `reviews.ts`, `projects.ts` | Eigentümerschaft/Aktualität nicht belegt | Nur bestätigte identische Profile verlinken; Projektseiten sind keine Personen-Aliase | P3 |
| Autorenschaft | Name/Datum sichtbar; stabile Person-ID im Schema | Teilweise erfüllt | `InsightPage.tsx`, `src/routes.ts` | Sichtbarer Autorenname ist kein Link zum Werdegang | Optional Autorenlink auf `/ueber-mich` | P3 |
| Quellen / Fachbelege | Alle sechs `sources`-Listen leer | Teilweise erfüllt | `src/data/insights.ts` | Fachbehauptungen schwerer extern nachzuvollziehen | Selektiv Primärquellen bei SEO-, System- und KI-Aussagen ergänzen | P2 |
| Search Intent Kostenartikel | Kostenfaktoren, aber keine Orientierungsspanne | Teilweise erfüllt | `insights.ts` | Titel stellt Kostenfrage, Antwort bleibt allgemein | Optional bestätigte Beispielumfänge/Kalkulationslogik; keine Preise erfinden | P3 |
| Projektstatus | Kunde, Demo und eigenes Projekt unterschieden | Erfüllt | `src/data/projects.ts`, `Projects.tsx` | Kein belegtes Vermischen fiktiver und realer Referenzen | Kennzeichnungen erhalten | P3 |
| Metadaten / interne Links | 16 eindeutige Metadatensätze, alle Seiten erreichbar | Erfüllt | `src/routes.ts`, Routing-/SEO-Tests | Kein aktueller lokaler Defekt | Tests bei neuen Seiten weiterführen | P3 |
| Bildoptimierung | Manifest und WebP-Artikelbilder erhalten | Erfüllt | `responsiveImage.ts`, `image-variants.json`, Insights-Komponenten | Keine durch Tests festgestellte Regression | Keine erneute pauschale Konvertierung | P3 |
| Noscript-Navigation | Fallback im Build vorhanden | Teilweise erfüllt | `scripts/build.mjs`, `Header.tsx` | Vollständige Prüfung mit browserweit deaktiviertem JS offen | Reale Browserprüfung nachholen; Fallback nicht nochmals implementieren | P2 |
| HTML-Alias-Redirect | Lokal getestet, Live-Stichprobe 308 | Erfüllt | `vercel.json` | Kein Fehler im geprüften `/projekte/index.html`-Fall | Breitere Live-Matrix bei nächster Abnahme | P3 |
| www-Redirect | Live weiterhin 307 | Teilweise erfüllt | Vercel-Domainkonfiguration, `vercel.json` | Vorgeschaltete Domainregel offenbar noch temporär | Dashboard-Regel nach Freigabe kontrollieren | P2 |
| Externe Schema-/Indexprüfung | Nicht durchgeführt bzw. kein Zugang | Nicht überprüfbar | Externe Dienste | Kein Nachweis tatsächlicher Suchdarstellung | Optional Validator/Rich Results; Search Console mit Zugang | P3 |

## 5. Structured Data im Detail

### Bestand und Ausgabe

Der neue Build enthält **16 WebSite-, 16 Person-, sechs Article- und sechs BreadcrumbList-Knoten auf oberster Graph-Ebene**, insgesamt 44 solche Knoten in 22 Script-Blöcken. Verschachtelte Place-, ListItem- und Autorenobjekte sind in dieser Zählung nicht nochmals enthalten.

Die Wiederholung derselben WebSite-/Person-ID auf verschiedenen Seiten ist richtig und keine unerwünschte Entitätsverdopplung. Zwei Script-Blöcke auf einer Artikelseite sind ebenfalls kein Fehler: Der zweite ergänzt Article/BreadcrumbList zum allgemeinen Graph.

- `https://annafilippi.studio/#website` → WebSite.
- `https://annafilippi.studio/#anna-filippi` → Person.
- `https://annafilippi.studio/insights/<slug>#article` → jeweils eigener Artikel.
- `WebSite.publisher` verweist auf die vorhandene Person.
- `Article.author` verwendet dieselbe Person-ID, mit Name und URL der Über-mich-Seite.
- `Article.mainEntityOfPage` ist die kanonische Artikel-URL. Ein URL-Wert ist dafür zulässig; fehlende separate WebPage-Knoten machen ihn nicht ungültig.
- Breadcrumb-Positionen 1–3 stimmen mit Startseite → Insights → Artikel überein. Fehlende eigene Breadcrumb-IDs sind kein Syntaxfehler.

Headline, Description und Autorenname aller sechs Article-Knoten wurden im gerenderten Text nachgewiesen. Datumswerte stimmen mit den ausgegebenen time-Attributen überein; Publikation und Aktualisierung sind jeweils `2026-11-25`. Die Datumsangaben sind zur Prüfzeit nicht zukünftig und passen zur Commit-Zeit, was jedoch keine unabhängige Bestätigung des tatsächlichen Veröffentlichungstermins ist. Bilddateien existieren; JPEG für Artikel-Schema/Social Sharing und WebP im picture-Element sind beabsichtigt dieselben Motive in verschiedenen Formaten.

Der Browserwechsel vom SEO-/AEO-Artikel zur Über-mich-Seite aktualisiert Title/Canonical und entfernt den Artikelblock. Danach bleibt genau der WebSite-/Person-Block. Keine zurückbleibenden Article-/Breadcrumb-Duplikate in dieser Stichprobe.

### Semantische Grenzen

`alternateName: Fillanna` wird sowohl für WebSite als auch Person ausgegeben. Die aktuelle Redaktion beschreibt FILLANNA dagegen als eigenes Schmuck-/E-Commerce-Projekt. Das kann historisch begründbar sein, ist aber im sichtbaren Inhalt nicht als Namensgleichheit erklärt. Vor einer Änderung muss geklärt werden, ob es sich um einen tatsächlichen Personen-/Studionamen oder eine eigenständige Projektmarke handelt. Ein Projekt sollte nicht über sameAs mit seiner Entwicklerin gleichgesetzt werden.

`Person.jobTitle: Full-Stack-Webentwicklerin` steht neben der sichtbaren Aussage einer laufenden Weiterbildung zur Full-Stack-Entwicklerin. Das ist **nicht automatisch ein Widerspruch**: Eine ausgeübte Tätigkeit kann vor dem Abschluss einer Weiterbildung bestehen. Daraus darf aber kein abgeschlossener Berufs-/Zertifikatsnachweis abgeleitet werden. Tätigkeitsbeschreibung und Ausbildungsstatus sollten klar voneinander getrennt bleiben.

Die Person hat im allgemeinen Graph die Homepage als `url`, im Article-Autorobjekt dieselbe ID mit `/ueber-mich` als `url`. Mehrere URLs einer Person sind zulässig; das erzeugt keine zweite Person. Eine einheitliche bevorzugte Profil-URL wäre eine optionale Präzisierung.

Organization, Service und ein gemeinsames WebPage-Modell können künftig Beziehungen präzisieren, sind aber kein Muss für diese persönliche Website. Falls eingeführt, zentral in der bestehenden Rendering-/Metadatenstrecke, nicht als unabhängige Generatoren in mehreren Komponenten. Article nicht zusätzlich durch einen zweiten BlogPosting-Knoten duplizieren. ProfessionalService ist in seiner allgemeinen Form deprecated. LocalBusiness nur bei sachlich passender und bestätigter Geschäftsmodellierung. FAQPage und Qualifikations-Markup liefern keine garantierte Sonderdarstellung.

## 6. Entity SEO und Qualifikationen

| Entität / Information | Nachgewiesener Zustand | Bewertung |
|---|---|---|
| Studio | Sichtbarer Markenname Anna Filippi Studio, Hauptdomain konsistent | Keine erfundene Organisation nötig; Abgrenzung zu Person und FILLANNA klären |
| Anna als Person | Name, Andernach, persönliche Beschreibung, stabile Person-ID | Gute Basis; berufliche Tätigkeit nicht mit Abschluss gleichsetzen |
| Dienstleistungen | Sechs verständliche Felder; individuelle Abstimmung, Machbarkeitsvorbehalt bei komplexer KI | Als Angebot lesbar, keine kostenlosen Inklusivleistungen oder Garantien behauptet |
| Schwerpunkte | Full-Stack, Technical SEO, Automation, Analytics, AEO/GEO, E-Commerce, KI-Integration | Grafik ausdrücklich als fachliche Ausrichtung/Weiterentwicklungsbereiche bezeichnet; kein Zertifizierungsbeweis |
| Frühere Bildung | Fachoberschule Technik/Elektronik als abgeschlossen beschrieben | Selbstbeschreibung, kein unabhängiger Nachweis; Institution/Urkunde nicht vorhanden |
| Verkaufsausbildung | Entscheidung für Ausbildung erwähnt | Aus Formulierung keinen belegten Abschluss ableiten |
| Laufende Weiterbildung | Full-Stack-Ausbildung sowie Weiterbildung in Marketing, SEO und E-Commerce | Status „laufend“ erhalten, nicht in hasCredential als bereits erworben umwandeln |
| Zertifikate | Überblick angekündigt, keine Titel, Aussteller, Daten oder Verifikationslinks vorhanden | Konkrete sichtbare Lücke; keine Qualifikationen hinzuerfinden |
| Fachartikel | Autorin und Daten sichtbar, Person-ID verknüpft | Autorenlink könnte Werdegang leichter auffindbar machen |
| Projekte | Dana Kundenprojekt, drei ausdrücklich fiktive Demos, FilliCat in Entwicklung | Gute Statusdifferenzierung; Funktionsangaben nicht extern vollständig getestet |
| FILLANNA | Eigenes E-Commerce-/Schmuckprojekt, Next.js/TypeScript/Supabase-Entwicklung laut Artikel | Als Selbstauskunft dokumentiert; kein Erfolgsnachweis oder bestätigter Profil-Link |
| Offizielle externe Profile | Kein sameAs; Google-Bewertungslink in Konfiguration leer | Keine Profile oder Bewertungen erfinden. GitHub-Demoseiten sind Referenzziele, nicht automatisch Identitätsprofile |

Zur Klärung würden für tatsächlich abgeschlossene Zertifikate nur bestätigte Bezeichnung, Aussteller, Abschlussdatum und gegebenenfalls ein freigegebener öffentlicher Nachweis benötigt. Private Urkunden oder personenbezogene Zertifikatskennungen müssen nicht veröffentlicht werden. Ein fehlendes Zertifikat ist kein Beleg fehlender fachlicher Fähigkeiten.

## 7. Qualität der neuen Inhalte

### Über mich und Leistungen

Die neue Über-mich-Seite beschreibt Zielgruppe, Standort, Motivation und Arbeitsweise verständlich. Textliche Schwerpunktliste statt rein grafischer Beschriftung verbessert Extrahierbarkeit und Zugänglichkeit. Werdegang und laufende Weiterbildung sind sichtbar, nicht nur in Metadaten behauptet. Der unvollständige Zertifikatsabschnitt ist die konkrete Vertrauenslücke.

Die Leistungen sind überwiegend klar abgegrenzt. FormSolutions benennt Integrationen als vom Bedarf und der technischen Grundlage abhängig. Die KI-Leistung enthält einen Machbarkeitsvorbehalt. Ein breites Interessengebiet auf der ExpertiseMap ist kein Nachweis jahrelanger Spezialisierung, wird dort aber auch nicht so bezeichnet. Keine neue angebliche Zertifizierung oder Expertengarantien ergänzen.

### Alle sechs Insights-Artikel

| Artikel | Suchintention / Stärken | Qualitätsgrenze und gezielte Empfehlung |
|---|---|---|
| Website-Kosten | Konkrete Kostenfrage, kompakte Faktoren, laufende Kosten, passende FAQ; keine erfundenen Festpreise | Antwort bleibt ohne Größenordnung allgemein. Optional bestätigte Leistungsbeispiele oder Kalkulationsschritte anbieten; keine Preiszahlen erfinden |
| Agentur oder Freelancer | Ausgewogener Vergleich, Tabellen, Kapazität und Projektgröße berücksichtigt | Keine pauschale Abwertung von Agenturen. Einige Erweiterbarkeits-FAQ ähneln dem Kostenartikel; geringe thematische Überschneidung, kein schädliches Seiten-Duplikat belegt |
| SEO und AEO | Direkte Antwort, nachvollziehbare Grundlagen, E-E-A-T nicht als Punktestand, explizit keine ChatGPT-Garantie | Vergleichstabelle vereinfacht die überlappenden Disziplinen. Primärquellen würden die fachliche Nachprüfbarkeit stärken; keine zusätzliche Ranking-Pflicht ableiten |
| E-Commerce | Systeme, Betriebskosten, Kennzahlen, Produktfotografie und eigener Praxisbezug | Systemvergleich vereinfacht; FILLANNA-Stack und Erfahrung sind Selbstauskünfte. Optional konkrete freigegebene Projektdetails und Herstellerquellen ergänzen |
| KI und Automatisierung | Regelbasierte Abläufe vs. KI unterschieden; Zugriffsrechte, menschliche Freigabe, laufende Kosten und Grenzen erläutert | Funktionsbeschreibungen sind Beispiele, keine nachgewiesenen produktiven Kundensysteme. 30 Minuten × 20 Arbeitstage = 10 Stunden ist korrekt und als Rechenbeispiel bezeichnet. Keine erreichte Zeitersparnis behauptet |
| Produktfotografie | Sachliche Produktwiedergabe, Schmuckdetails, WebP/AVIF, responsive Bilder und verantwortliche KI-Bearbeitung | Gute Verbindung zur realen Galerie. Eigener Aufnahme-/Bearbeitungsfall würde Erfahrung konkreter belegen; kein Bedarf, den ganzen Artikel umzuschreiben |

Alle sechs Artikel haben kurze Antworten, gegliederte Abschnitte, sichtbare FAQs, interne Links, verwandte Artikel und Autor-/Datumsangaben. Das unterstützt die Extraktion, garantiert aber keine Zitierung. Alle sechs `sources`-Arrays sind leer: Der vorhandene Quellenbereich wird deshalb nirgends ausgegeben. Allgemeine eigene Erfahrungen benötigen nicht für jeden Satz eine externe Quelle; überprüfbare Technologie-, Suchmaschinen- und Systemaussagen profitieren jedoch von gezielten Primärbelegen. Fehlende Quellen beweisen weder falsche Inhalte noch automatisch niedrige Qualität.

Es wurde kein offensichtliches Keyword-Stuffing und keine Serie nahezu identischer Ortsseiten gefunden. Andernach/Koblenz sind als Region genannt, nicht als erfundene Niederlassungen. Ähnliche CTAs, dieselbe Autorin und wiederkehrende Grundlagen sind normale redaktionelle Wiederholungen. Kein Beleg für vollständig duplizierte Artikel. Externe Plagiats-/Web-Duplikatprüfung wurde nicht durchgeführt.

Eigene Praxisbezüge zu FILLANNA verbessern die persönliche Einordnung, bleiben aber überwiegend beschreibend. Konkrete freigegebene Beispiele könnten E-E-A-T und Zitierfähigkeit verbessern; fiktive Kennzahlen oder Kundenresultate wären kontraproduktiv. Die technischen Aussagen über Datenschutz sind allgemeine Anforderungen, keine unabhängige Compliance-Zertifizierung der angebotenen Systeme.

## 8. Technische Prüfungen und Regressionen

| Prüfung | Ergebnis | Grenze |
|---|---|---|
| `npm run typecheck` | Erfolgreich | Prüft den aktuellen TypeScript-Stand |
| `npm run lint` | Erfolgreich | Keine ESLint-Fehler/-Warnungen |
| `npm test` mit `pretest` | 108/108 erfolgreich | Enthält Production Build mit Client- und SSR-Bundle |
| Production Build | Erfolgreich, alle 16 Seiten erzeugt | Keine Veröffentlichung |
| Zusätzliche JSON-LD-Prüfung | 22 Blöcke parsebar; alle sechs Artikel mit sichtbaren Angaben abgeglichen | Temporäres Prüfskript außerhalb des Projekts; kein externer Vollvalidator |
| Metadaten/HTML | Eindeutige Title-/Description-Werte, Canonicals, Sprache, H1/main, Überschriftenhierarchie | Bestehende Tests für alle Seiten erfolgreich |
| Interne Links | Alle Sitemap-Seiten von Startseite erreichbar; interne Pfade und Fragmente gültig | Externe Zielseiten nicht vollständig geprüft |
| Phase-1-Regressionsprüfungen | Varianten, Dateipfade, Dimensionen, keine Hochskalierung und Artikel-WebP erfolgreich | Kein neuer vollständiger fotografischer Vergleich oder CWV-Lauf |
| Phase-2-Regressionsprüfungen | Sitemap/Redirect-Regeln/Noscript-Ausgabe unverändert erfolgreich | Vercel-Edge und Dashboard nicht vollständig lokal abbildbar |
| SPA-Schemawechsel | Artikel → Über mich: Artikel-Schema entfernt, Title/Canonical korrekt | Browserstichprobe, nicht jede Navigationsfolge |
| Skriptfreie Testansicht | Keine Scripts, sichtbare Navigation, kein Überlauf; natives Inhaltsverzeichnis lässt sich öffnen | Simulierter Noscript-Output, nicht browserweit deaktiviertes JS |
| Weiterer Link in skriptfreier Ansicht | Nicht abschließend bestätigt | Lokaler Prüfserver nach Fortsetzung nicht mehr erreichbar; kein Nachweis eines Produktfehlers |
| `git diff --check` / Zustand | Kein Quellcode-Diff, nur neuer Bericht | Keine Änderungen zurückgesetzt |

Bei der zusätzlichen temporären Validierung wurde zunächst das HTML-Attribut `datetime` case-sensitiv gesucht; React gibt es im Rohtext als `dateTime` aus. Die Prüfung wurde außerhalb des Projekts auf HTML-gerechte Groß-/Kleinschreibung korrigiert und bestand danach. Daraus folgt kein Websitefehler.

Eine vollständige Navigation mit tatsächlich deaktiviertem JavaScript bleibt technisch nicht abschließend geprüft. Die No-JS-Fallback-Regeln und realen Linkziele sind vorhanden und werden automatisiert kontrolliert; der frühere Phase-2-Test umfasste außerdem mehrere Breiten. Es wird kein vollständiger Geräte-/Accessibility-Test behauptet.

### Produktionsstichprobe am 26.11.2026

- `/ueber-mich`: 200, WebSite und Person im initialen HTML.
- `/insights/seo-und-aeo-fuer-kleine-unternehmen`: 200, WebSite, Person, Article und BreadcrumbList im initialen HTML.
- `/projekte/index.html`: jetzt 308 auf `https://annafilippi.studio/projekte`. Der zuvor offene Alias-Fall ist in dieser Stichprobe behoben.
- `https://www.annafilippi.studio/projekte`: weiterhin 307 auf die Hauptdomain. Das ist ein verbleibender Vercel-Domainpunkt aus Phase 2, keine neue Schema-Regression. Ohne Dashboard-Zugriff ist die konkrete vorrangige Regel nicht verifiziert.

Weitere aus dem ursprünglichen Audit bekannte Architekturthemen bleiben erhalten: `createRoot` statt Hydration, absichtliche dreifache Karussellgruppen und clientseitige Kanzlei-Rechtstexte. Sie wurden nicht heimlich als Phase-3-Maßnahmen geändert. Das Schema der allgemeinen Website ist nicht mit dem synchronisierten Rechtstext gleichzusetzen.

## 9. Empfohlene Reihenfolge nach Freigabe

1. **P2 – Identität klären:** FILLANNA als eigenes Projekt versus tatsächlichen Alias bestätigen. Anschließend nur die betroffenen vorhandenen Angaben bereinigen, ohne eine zweite Person anzulegen.
2. **P2 – Zertifikatsabschnitt vervollständigen oder Ankündigung korrigieren:** ausschließlich anhand bestätigter Angaben. Laufende Weiterbildung klar von abgeschlossenen Nachweisen trennen. Ein Credential-Typ allein löst die sichtbare Lücke nicht.
3. **P2 – Selektive fachliche Belege:** vor allem SEO/AEO-, Systemvergleichs- und KI-Aussagen mit passenden Primärquellen versehen, sofern redaktionell freigegeben. Keine generischen Linklisten ohne Bezug.
4. **P2 – Restprüfung Phase 2:** www-Dashboardregel und native No-JS-Navigation prüfen, ohne den bestehenden Fallback zu duplizieren.
5. **P3 – Optional:** Autorenlink, konsistente bevorzugte Person-URL, wenige belegte Praxisbeispiele. Erst danach entscheiden, ob zusätzliche WebPage/AboutPage/ContactPage-/Service-Knoten einen konkreten Nutzen bringen.

Organization/LocalBusiness, sameAs und Credential-Erweiterungen benötigen bestätigte Fakten. FAQPage, zusätzliche Breadcrumbs auf flachen Seiten oder ein Wechsel von Article zu BlogPosting sind keine Abschlussvoraussetzungen. Keine künstlichen Bewertungen oder AggregateRating aus Projektstimmen ableiten.

## 10. Antworten auf die Abschlussfragen

1. **Bereits erfüllt:** vorgerenderte WebSite-/Person-Daten; Article/BreadcrumbList für alle sechs Artikel; stabile IDs; Autorenbezug; individuelle Metadaten; sichtbare Kurzantworten/FAQs; vollständige interne Erreichbarkeit; technische Tests und Phase-1-/Phase-2-Regressionsprüfungen.
2. **Durch Copilot zwischenzeitlich umgesetzt:** Die genannten fünf Commits tragen Copilot-Coauthor-Trailer und belegen Mitwirkung an Insights/Artikeln, Article-/Breadcrumb-Infrastruktur, Artikelbildern, Über-mich-Inhalten und Schwerpunktgrafik. Keine weitergehende alleinige Urheberschaft wird behauptet.
3. **Fehler oder Widersprüche:** Kein JSON-Syntax-/Buildfehler. Nachgewiesen sind die leere angekündigte Zertifikatsübersicht und die nicht eindeutig erklärte Alias-Zuordnung. JobTitle versus laufende Weiterbildung ist ein Klärungspunkt, kein automatisch falscher Abschluss. www bleibt live temporär.
4. **Noch erforderlich:** Die zwei konkreten Identitäts-/Inhaltsunklarheiten klären und nach Freigabe gezielt korrigieren; offene Prüfgrenzen transparent behandeln. Kein umfassender technischer Neubau erforderlich.
5. **Nur optional:** zusätzliche Seiten-/Service-/Organisationsmodelle bei passenden Fakten, FAQPage, Profilverknüpfungen nach Bestätigung, Autorenlink und vertiefte Fallbeispiele. Fehlendes Markup ist nicht automatisch ein SEO-Fehler.
6. **Bereits abgeschlossen?** Der Audit ist abgeschlossen; die bestehende technische Schema-Grundlage ist weitgehend ausreichend. Eine vollständige Qualitätsfreigabe für Phase 3 sollte erst nach Klärung von FILLANNA und der Zertifikatsankündigung erfolgen. Danach kann Phase 3 auch ohne zusätzliche Schema-Typen abgeschlossen werden.

## 11. Quellen und Belege

Offizielle Referenzen, am 26.11.2026 geprüft:

- [Schema.org: ProfessionalService](https://schema.org/ProfessionalService) – allgemeiner Typ deprecated; kein pauschaler Ersatz für Service.
- [Schema.org: EducationalOccupationalCredential](https://schema.org/EducationalOccupationalCredential) – Qualifikationsnachweise; keine Begründung, einen laufenden Kurs als erworbenen Abschluss auszugeben.
- [Schema.org: sameAs](https://schema.org/sameAs) – eindeutige Identität, nicht beliebige verwandte Projektlinks.
- [Schema.org: AboutPage](https://schema.org/AboutPage) und [ContactPage](https://schema.org/ContactPage) – optionale spezialisierte WebPage-Typen.
- [Schema.org: FAQPage](https://schema.org/FAQPage) – Semantik sichtbarer häufig gestellter Fragen; kein Versprechen einer Suchdarstellung.
- [Google: Article-Markup](https://developers.google.com/search/docs/appearance/structured-data/article) – Article/BlogPosting, Autor- und Artikelangaben.

Lokale Belege: `index.html:10`, `src/routes.ts:48`, `src/entry-server.tsx`, `scripts/build.mjs`, `src/App.tsx`, `src/data/insights.ts`, `src/components/Insights/InsightPage.tsx`, `src/components/AboutPage/AboutPage.tsx`, `src/components/ExpertiseMap/ExpertiseMap.tsx`, `src/components/Services/Services.tsx`, `src/data/projects.ts`, `src/config/reviews.ts` sowie vorhandene Routing-, Insights-, Bild- und Technical-SEO-Tests. Git-Coauthor-Trailer wurden direkt gelesen.

Temporäre Ergebnisse: `/tmp/anna-phase3-tests.log`, `/tmp/anna-phase3-validation.json`, `/tmp/anna-phase3-live.json`. Die entscheidenden Ergebnisse stehen in diesem Bericht; temporäre Dateien sind keine dauerhafte Voraussetzung. Keine Rankings, Indexierung, Rich Results oder KI-Empfehlungen werden garantiert.
