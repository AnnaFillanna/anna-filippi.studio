# Phase 4 – Bestandsanalyse: AEO, GEO und E-E-A-T

Stand: 26. November 2026 · Anna Filippi Studio · HEAD `d10a4db`

## 1. Ergebnis und Prüfrahmen

Die Website besitzt bereits eine tragfähige Grundlage: verständliche Leistungen, persönliche Anbieterinformationen, nachvollziehbare Projektstatus, sechs strukturierte Fachartikel, direkte Kurzantworten, echte interne Links und vorgerenderte Inhalte. Die Korrekturen aus Phase 3 sind erhalten. Ein umfassender Textumbau, zusätzliche Schema-Typen, neue Ortsseiten oder flächendeckende FAQ-Erweiterungen sind nicht erforderlich.

**Die Bestandsanalyse ist abgeschlossen. Eine uneingeschränkte Aussage, alle Qualitäts- und Sichtbarkeitsziele seien erreicht, ist noch nicht möglich.** Es gibt begrenzte redaktionelle Verbesserungsmöglichkeiten und offene externe Nachweise. Keine P0- oder P1-Störung wurde nachgewiesen. Die konkreten redaktionellen Punkte liegen bei P2; weitere Vorschläge sind ausdrücklich optional. Tatsächliche Such- oder KI-Sichtbarkeit wurde nicht gemessen.

Zu Beginn war der Arbeitsbaum sauber. Analysiert wurden aktueller Quellcode, Routendaten, alle sechs Artikel, die aktiven Seitenkomponenten, vorgerendertes HTML, relevante Git-Historie und öffentliche HTTP-Antworten. Die einzige neue Projektdatei ist dieser Bericht. Keine Inhalte, Komponenten, Styles, Abhängigkeiten oder Konfigurationen wurden geändert. Keine Formulare abgesendet, Datenbanken verändert oder echten E-Mails versendet. Kein Commit, Push oder Deployment. Der beauftragte Build erneuerte lediglich ignorierte Build-Artefakte.

Berücksichtigt wurden `SEO-AEO-GEO-AUDIT.md`, `BILDOPTIMIERUNG.md`, `SEO-AEO-GEO-PHASE-2.md`, `SEO-AEO-GEO-PHASE-3-AUDIT.md`, `SEO-AEO-GEO-PHASE-3-FINAL.md`, die ältere `SEO-PRUEFUNG.md` und `INSIGHTS.md`. Historische Aussagen wurden mit dem aktuellen Code abgeglichen, nicht als aktuelle Messergebnisse übernommen. Beispielsweise ist der frühere Bestand mit neun Seiten durch 16 Seiten überholt; fehlende Artikelstruktur oder die bereits entfernten FILLANNA-Aliase sind keine neuen Aufgaben.

Die Beurteilung der Inhalte ist eine redaktionelle und technische Prüfung, kein unabhängiger Nachweis sämtlicher biografischer Angaben oder Projektleistungen. E-E-A-T ist hier kein Punktesystem. Eine rechtliche Vollständigkeitsprüfung der Rechtstexte gehört nicht zum Auftrag.

## 2. Ergebnisübersicht

Prioritäten: **P0 – Kritisch**, **P1 – Hoch**, **P2 – Mittel**, **P3 – Optional**. P3 bei erfüllten Punkten bedeutet keinen Änderungsauftrag. „Nicht überprüfbar“ bedeutet fehlende Evidenz, nicht eine nachgewiesene Fehlfunktion.

| Prüfbereich | Aktueller Zustand | Status | Betroffene Seite oder Datei | Festgestelltes Problem | Empfohlene Maßnahme | Priorität |
|---|---|---|---|---|---|---|
| Angebot und Zielgruppe | Sechs Leistungsfelder, Zielgruppe auf Über-mich-Seite und in Metadaten | Erfüllt | `/`, `/ueber-mich`, `Services.tsx` | Kein wesentlicher Verständlichkeitsdefekt | Beibehalten | P3 |
| Ablauf und Kontakt | Fünf Schritte, persönliche Betreuung nach Absprache, Kontaktwege | Erfüllt | `ProjectProcess.tsx`, `/kontakt` | Kein fehlender grundlegender Kundenweg | Nicht nochmals implementieren | P3 |
| Artikelantworten | Alle sechs Artikel besitzen zentrale Frage und Kurzantwort | Erfüllt | `insights.ts`, `InsightPage.tsx` | Keine fehlende Antwortstruktur | Bestehende Struktur erhalten | P3 |
| Kosten-Suchintention | Faktoren und Folgekosten, aber keine konkrete Orientierung am Beispiel | Teilweise erfüllt | `/insights/was-kostet-eine-professionelle-website` | Antwort „hängt davon ab“ allein hilft bei der Budgetentscheidung nur begrenzt | Einen bestätigten Beispielumfang mit Aufwandstreibern erläutern; Preise nur nach Freigabe | P2 |
| Fachliche Belege | Alle sechs Quellenlisten leer | Teilweise erfüllt | `src/data/insights.ts` | Technische System-/Suchmaschinenaussagen sind nicht direkt nachprüfbar | Selektive Primärquellen bei SEO, Shopsystemen und KI ergänzen | P2 |
| KI-Zuverlässigkeit | Wissensgrundlage, Grenzen und menschliche Übergabe beschrieben | Teilweise erfüllt | KI-Artikel, Abschnitt `ki-chatbot` | Fehlerhafte Antworten trotz guter Wissensgrundlage werden nicht ausdrücklich erklärt | Kurze fachliche Präzisierung: Restfehler möglich, Prüfung und Eskalation nötig | P2 |
| Fachliche Definitionen | SEO/AEO, E-Commerce und Automatisierung erklärt | Erfüllt | Drei entsprechende Insights-Artikel | Keine zentrale falsche Definition nachgewiesen | Keine Neufassung | P3 |
| FAQ-Bestand | 24 sichtbare Fragen in sechs Artikeln | Erfüllt | `insights.ts` | Teilweise thematisch sinnvolle Wiederholung, kein Spam-Muster | Keine zusätzlichen allgemeinen FAQ-Blöcke | P3 |
| Neue FAQ-Seiten / FAQ-Schema | Für aktuellen Bedarf kein zusätzlicher Nutzen belegt | Nicht erforderlich | Gesamte Website | Kein fehlendes Pflichtmerkmal | Nicht allein für Suchmaschinen ergänzen | P3 |
| HTML-Extrahierbarkeit | Haupttexte und Artikel bereits im initialen HTML | Erfüllt | `scripts/build.mjs`, `src/entry-server.tsx` | Ausnahme: vollständige Rechtstexte | Bestehenden Prerender erhalten | P3 |
| Markenidentität | Studio, Person und separates Projekt FILLANNA unterschieden | Erfüllt | `index.html`, `insights.ts` | Keine erneute Alias-Verwechslung | Phase-3-Korrektur erhalten | P3 |
| Projekte und Demos | Kunde, Eigenprojekt, Entwicklungsstand und fiktive Demos gekennzeichnet | Erfüllt | `projects.ts`, `Projects.tsx` | Keine als Kundenreferenz ausgegebene Demo nachgewiesen | Kennzeichnung erhalten | P3 |
| Erfahrungsbelege | Idee, Funktionen, Technik und Stand vorhanden | Teilweise erfüllt | Dana/FilliCat, Praxisabschnitte der Artikel | Keine detaillierten belegten Resultate oder konkreten Entwicklungsentscheidungen | Optional ein freigegebenes reales Beispiel vertiefen | P3 |
| Über mich | Persönlicher Weg, Standort, Arbeitsweise und laufende Weiterbildung | Erfüllt | `AboutPage.tsx` | Keine unbelegte Zertifikatsankündigung mehr | Texte grundsätzlich erhalten | P3 |
| Qualifikationsnachweise | Keine konkreten Zertifikatsdaten vorgelegt | Nicht überprüfbar | `/ueber-mich` | Tatsächliche Abschlüsse extern nicht verifiziert | Nur bestätigte Angaben später ergänzen; kein Veröffentlichungszwang für Urkunden | P3 |
| Autoreninformationen | Name/Datum sichtbar, Person-ID im Article-Schema | Erfüllt | `InsightPage.tsx`, `routes.ts` | Autorin identifizierbar | Beibehalten | P3 |
| Autorenprofil erreichbar | Über Hauptnavigation erreichbar, Autorenzeile selbst unverlinkt | Teilweise erfüllt | `InsightPage.tsx` | Zusätzlicher Navigationsschritt zum Werdegang | Optional Namen mit `/ueber-mich` verlinken | P3 |
| Externe Autorität | Keine bestätigte Liste beruflicher Profile/Erwähnungen vorgelegt | Nicht überprüfbar | Externe Dienste | Fehlende unabhängige Nachweise im Audit | Nur reale bestätigte Profile/Referenzen prüfen | P3 |
| Projektbewertungen | Explizit Besucherbewertungen, keine Kundenrezensionen | Erfüllt | `ProjectRating.tsx` | Kein Review-Schema und keine behauptete Kundenverifikation | Nicht als Kundenreferenzen umdeuten | P3 |
| Rechtsseiten erreichbar | Eigene Routen und externe Direktziele HTTP 200 | Erfüllt | `/impressum`, `/datenschutz` | Kein nachgewiesener Ausfall | Links erhalten | P3 |
| Rechtstexte im HTML | Platzhalter und Direktlink, Volltext erst per externem Script | Teilweise erfüllt | `KanzleiDocument.tsx` | Anbieter-/Rechtstexte nicht vollständig auf eigener Route ohne JS extrahierbar | Gesondert erlaubte serverseitige Bereitstellung prüfen, keine eigene juristische Ersatzfassung | P2 |
| Unternehmensdaten | Andernach, Anna Filippi und Hauptdomain konsistent im eigenen Inhalt | Erfüllt | Hero, About, Footer, JSON-LD | Keine fiktive Koblenzer Niederlassung gefunden | Bestehende Zuordnung erhalten | P3 |
| Regionale Reichweite | Andernach bei Koblenz, deutschlandweite Zusammenarbeit | Erfüllt | `Hero.tsx`, `routes.ts`, Artikel | Keine künstlichen Ortsseiten nötig | Nur reale lokale Beispiele ergänzen, falls vorhanden | P3 |
| Suchcrawler-Regeln | Wildcard erlaubt öffentliche Abrufe | Erfüllt | `public/robots.txt` | Kein robots.txt-Block für Suchcrawler | Trainingspolitik nicht ungefragt ändern | P3 |
| Tatsächliche KI-/Suchsichtbarkeit | Keine Plattformberichte oder verifizierten Crawler-Logs | Nicht überprüfbar | Search Console, Bing, KI-Dienste | Kein Nachweis von Indexierung/Zitierungen/Markenautorität | Vorhandene externe Messdaten auswerten | P2 |
| Phase-1–3-Regressionen | Build, 108 Tests und JSON-LD-Prüfung erfolgreich | Erfüllt | Tests und Build-Ausgabe | Kein durch die Prüfungen gefundener Rückschritt | Bestehende Tests weiterverwenden | P3 |
| Browserweit deaktiviertes JS | Kein neuer vollständiger Browserlauf | Nicht überprüfbar | Browser-Testumgebung | HTML-/Fallbacktests ersetzen keine vollständige Bedienprüfung | Bei geeigneter Umgebung nachholen | P2 |
| llms.txt / zusätzliche Entitäten | Kein belegter Bedarf | Nicht erforderlich | Gesamte Website | Kein notwendiges fehlendes AEO-Merkmal | Keine Zusatzimplementierung empfehlen | P3 |

## 3. Alle öffentlichen Seiten und Kundenfragen

Untersucht wurden zehn Basisrouten und sechs Artikelrouten. Geplante Artikel aus `docs/INSIGHTS.md` sind keine veröffentlichten Inhalte und wurden nicht als fehlende Seiten bewertet.

| Route | Suchintention und bereits vorhandene Antwort | Bewertung |
|---|---|---|
| `/` | Angebot verstehen, geeignete Anbieterin finden, Ablauf und Projekte kennenlernen | Hero nennt Webdesign/Webentwicklung, Andernach bei Koblenz und deutschlandweite Arbeit. Services, Preiseinschätzung und fünf Prozessschritte beantworten zentrale Fragen. Der emotionale H1 wird durch konkrete Texte ergänzt; kein Zwang zu Keyword-H1. |
| `/projekte` | Umsetzungskompetenz anhand von Arbeiten beurteilen | Fünf Projekte mit Status und technischen/inhaltlichen Beschreibungen. Demo und Kunde getrennt. |
| `/softwareentwicklung` | Mögliche Webanwendungen verstehen | FilliCat plus konkrete Formular-/Buchungsszenarien; Integrationen nach Bedarf und technischer Grundlage. Kein Versprechen, dass alles inklusive ist. |
| `/dana-tattoo-studio` | Reale Referenz und eigene Rolle prüfen | Kundenprojekt, Ziel, Galerien, WhatsApp und Technik erklärt. Keine erfundene Umsatz-/Conversionsteigerung. |
| `/fotografie` | Bildstil und Produktfotografie beurteilen | Eigene Galerie, beschreibende Alt-Texte und Bildkategorien. Ein kurzer bestätigter Ablauf zu Produktübergabe/Bildlieferung wäre optional hilfreich; keine künstliche FAQ erforderlich. |
| `/ueber-mich` | Person, Hintergrund und Arbeitsweise verstehen | Standort, beruflicher Weg, Interessen und aktuelle Weiterbildung direkt zugänglich. |
| `/kontakt` | Anfrage stellen | Relevante Felder und Kontaktmöglichkeiten; keine reale Übermittlung im Audit ausgelöst. |
| `/insights` | Passendes Fachthema finden | Sechs veröffentlichte Artikel, Kategorien und echte Links. |
| `/impressum` | Anbieterinformationen finden | Route und Direktlink erreichbar; Volltext nicht im initialen eigenen HTML. |
| `/datenschutz` | Verarbeitungshinweise finden | Gleiche technische Einschränkung; keine rechtliche Inhaltsfreigabe durch diesen Audit. |
| Sechs `/insights/<slug>` | Konkrete Informationsfragen beantworten | Einzelbewertung im nächsten Abschnitt. |

Die fünf Schritte Kennenlernen, Konzeption, Entwicklung, Feinschliff/Veröffentlichung und Betreuung sind bereits vorhanden. Keine zusätzliche Ablauf-Komponente erforderlich. Die technische Suchmaschinenoptimierung, Online-Shops, KI-Integrationen und Produktfotografie werden tatsächlich angeboten. Die Fachartikel über mögliche Technologien dürfen nicht als Beleg gelten, dass jede genannte Integration bereits für Kunden umgesetzt wurde.

## 4. Einzelprüfung sämtlicher Insights

Alle Artikel sind auf den 25.11.2026 datiert, tragen Anna Filippi als Autorin und besitzen eine Kurzantwort, Abschnitte, FAQs, weiterführende interne Links und Metadaten. Kein zukünftiges Datum zur Prüfzeit. Ein Datum allein beweist keine umfassende redaktionelle Prüfung; Aktualisierungsdaten sollten weiterhin nur bei tatsächlicher Pflege geändert werden.

### Website-Kosten

Route: `/insights/was-kostet-eine-professionelle-website`.

Stärken: Kostenfaktoren, laufende Ausgaben, Baukasten-Abwägung und spätere Erweiterbarkeit. Die Antwort zur Google-Sichtbarkeit enthält ausdrücklich keine Garantie. Die Schwäche ist konkret: Titel und zentrale Frage verlangen Kostenorientierung, die Kurzantwort nennt nur die Abhängigkeit von Anforderungen. Ein bestätigtes Beispiel „kleiner Webauftritt gegenüber Buchungslösung“ mit Leistungsumfang und Aufwandstreibern würde helfen. Ein erfundener Preisbereich wäre schlechter als die vorhandene ehrliche Antwort. P2, keine Komplettneufassung.

### Agentur oder Freelancer

Route: `/insights/webdesign-agentur-oder-freelancer`.

Der Vergleich berücksichtigt Größe, Kapazität, Kommunikation und Kosten ohne pauschale Billig-/Qualitätsversprechen. Die Formulierungen „häufig“ und „abhängig“ begrenzen Verallgemeinerungen. Die Checkliste und Tabelle erfüllen die Suchintention. Keine konkrete notwendige Korrektur gefunden. Eine weitere FAQ oder lange Quellenliste wäre hier nicht automatisch ein Mehrwert.

### SEO und AEO

Route: `/insights/seo-und-aeo-fuer-kleine-unternehmen`.

Begriffe und E-E-A-T werden verständlich definiert. Richtig eingeordnet: E-E-A-T ist kein einzelner messbarer Rankingfaktor; ChatGPT-Erwähnungen sind nicht garantiert; Testfragen bilden keine vollständige Nutzungsstatistik ab. Der vereinfachte SEO-/AEO-Vergleich ist als Orientierung brauchbar, keine strikte Trennung aller Suchsysteme. Konkreter P2-Punkt: Die Aussagen zu Suchsystemen sollten über wenige offizielle Quellen nachvollziehbar sein. Dafür existiert bereits ein `sources`-Feld samt Renderer; keine neue Komponente nötig. Die allgemeinen Kernaussagen stimmen mit den geprüften Google-Hinweisen überein.[1][2]

### E-Commerce

Route: `/insights/e-commerce-fuer-kleine-unternehmen`.

Gute Abdeckung von Produktdarstellung, Shopauswahl, laufenden Kosten, Automatisierung und Kennzahlen. FILLANNA wird als eigenes Projekt und die individuelle Shopentwicklung ausdrücklich als laufend beschrieben. Keine abgeschlossene Kundenleistung daraus ableiten. Die Plattformvergleiche Shopify/WooCommerce/Eigenentwicklung sind grundsätzlich differenziert; Links auf die jeweils offiziellen Produktdokumentationen würden technische Aussagen nachvollziehbarer und leichter pflegbar machen (P2, Quellenlücke). Die Kennzahlentabelle eignet sich als Einsteigerüberblick; ohne festgelegtes Messmodell lassen sich daraus keine konkreten Vergleichswerte berechnen. Formeln sind nur optional, wenn später tatsächlich eine Messanleitung entsteht.

### KI und Automatisierung

Route: `/insights/ki-und-automatisierung-fuer-kleine-unternehmen`.

Stärken: Regelbasierte Automatisierung wird von KI unterschieden; Systeme, Kosten, Zugriffsrechte und menschliche Freigaben werden berücksichtigt. Das Beispiel 30 Minuten × 20 Arbeitstage = zehn Stunden ist rechnerisch korrekt und ausdrücklich ein vereinfachtes Beispiel, keine gemessene Kundenersparnis. Der Praxisabschnitt behauptet keine abgeschlossenen KI-Kundenimplementierungen.

Gezielte P2-Verbesserungen: Quellen für technische Begriffe/Systemaussagen ergänzen; ausdrücklich erklären, dass Wissensgrundlage und Vorgaben Fehler nicht ausschließen. Menschliche Kontrolle ist bereits vorhanden und muss nicht nochmals als langer Abschnitt wiederholt werden. Die Definition „klassischer Chatbot“ ist vereinfacht, aber im Kontext regelbasierter Antworten vertretbar. Eine Präzisierung auf „regelbasiert“ ist optional, kein Beleg eines umfassend falschen Artikels. Der Abgleich mit IBMs Erklärung bestätigt die grundsätzliche Unterscheidung.[5]

Der Datenschutzhinweis im Artikel ist eine allgemeine Anforderung, kein Nachweis einer rechtlich freigegebenen konkreten KI-Lösung. Eine Rechtsprüfung wurde nicht vorgenommen.

### Produktfotografie

Route: `/insights/professionelle-produktfotografie`.

Der Artikel beantwortet Fragen zu Bildtypen, Licht, Materialdarstellung, Größenverhältnissen, Bildsprache und technischer Auslieferung. Die Hinweise zur authentischen Produktdarstellung und zum kontrollierten KI-Einsatz sind sinnvoll. Aussagen über mögliche Wirkungen sind überwiegend als „kann“ formuliert; keine bezifferten Verkaufsversprechen. Kein zentraler fachlicher Fehler nachgewiesen. Optional wäre ein freigegebenes eigenes Beispiel mit konkreter Licht-/Materialentscheidung stärker als zusätzlicher allgemeiner Text. Eine Quellenpflicht für jede eigene gestalterische Erfahrung besteht hier als Qualitätsanforderung nicht.

### Wiederholungen und FAQ-Nutzen

Die 24 FAQs verteilen sich auf 3/3/3/5/5/5 Fragen. Wiederholungen zur Erweiterbarkeit in Kosten- und Vergleichsartikel sind im jeweiligen Kontext nachvollziehbar. Wiederkehrende Markenabschlüsse und Kontaktaufforderungen sind keine eigenständigen Duplicate-Content-Seiten. Keine vollständige Kürzung oder Neufassung empfehlen. Weitere FAQ nur bei einer tatsächlich unbeantworteten Kundenfrage, vorzugsweise direkt im passenden vorhandenen Abschnitt.

## 5. E-E-A-T, Identität und regionale Einordnung

### Erfahrung

Dana ist als Kundenprojekt bezeichnet, Mamma Mia/KAVRO/VELORA als Demos, FilliCat als eigenes Projekt in Entwicklung. VELORA ist ausdrücklich kein realer Salon. Die Buchungsdemo auf der Studiowebsite sagt klar, dass keine Buchung oder E-Mail entsteht. Projektbewertungen sind explizit Besuchermeinungen und keine Kundenrezensionen; kein AggregateRating-Markup gefunden. Diese Transparenz ist bereits umgesetzt und sollte erhalten bleiben.

Eigene Rolle und Funktionen sind nachvollziehbar; unabhängig geprüfte Geschäftsergebnisse fehlen. Das ist kein Anlass, Kennzahlen oder Referenzen zu erfinden. Optional eine reale technische Entscheidung mit Ausgangslage, eigener Arbeit und belegbarem Ergebnis ergänzen, wenn Anna die Angaben bestätigt. Fremde Projektwebsites wurden nicht eigenständig auditiert; sie dienen hier nur als auf Anna Filippi Studio beschriebene Referenzziele.

### Kompetenz und Über-mich-Seite

Die Seite ist persönlich, verständlich und mit dem Angebot konsistent. Fachoberschule, Familienpause, Verkauf und Rückkehr zur Technik bilden einen plausiblen selbst beschriebenen Werdegang. Eine institutionelle oder urkundliche Bestätigung liegt im Audit nicht vor. „Weiterbildung zur Full-Stack-Entwicklerin“ ist als laufend dargestellt; die Schwerpunktgrafik bezeichnet ihre Inhalte als Ausrichtung und Weiterentwicklungsbereiche. Sie behauptet keine Zertifizierung.

Die Person-Entität nutzt dieselbe Identität wie die Artikelautorin. Eine Tätigkeitsbezeichnung als Webentwicklerin ist nicht automatisch die Behauptung eines abgeschlossenen Ausbildungsnachweises. Keine neue Diskrepanz nach Phase 3 gefunden. Die Wiederholung der laufenden Weiterbildung in Werdegang und Weiterbildungsabschnitt ist kurz und sachlich; kein relevanter Optimierungszwang.

### Autorität

Autorenname, Veröffentlichungs-/Aktualisierungsdaten und die Person-Verknüpfung im Article-Schema sind vorhanden. Der sichtbare Name ist aktuell kein Profil-Link, die Über-mich-Seite aber über Navigation erreichbar. Ein Link wäre eine kleine optionale Verbesserung.

Keine verifizierten unabhängigen Markenerwähnungen, beruflichen Profile oder Kundenstimmen wurden bereitgestellt. Das Fehlen einer `sameAs`-Liste belegt nicht fehlende Kompetenz. Keine Profile aus ähnlich klingenden Namen übernehmen. Copilot-Mitwirkung allein ist kein Qualitätsmangel: Maßgeblich sind Inhalt, fachliche Prüfung und hilfreiche eigene Erfahrung.[2]

### Vertrauen und Standort

Anna Filippi, Anna Filippi Studio und die Hauptdomain werden konsistent verwendet. FILLANNA ist ein separates eigenes E-Commerce-Projekt; die falschen Aliase sind nicht mehr vorhanden. Andernach ist der tatsächliche im Inhalt angegebene Standort, Koblenz das regionale Umfeld. Der Hero nennt deutschlandweite Zusammenarbeit. Kein zweiter Standort in Koblenz wird behauptet.

Keine künstlichen Stadtseiten für weitere Orte nötig. Die ältere Oktober-Dokumentation nennt einen regionalen Absatz mit weiteren Städten, der im aktuellen aktiven Inhalt nicht entsprechend vorhanden ist. Daraus folgt kein Defekt: Die aktuelle natürliche regionale Einordnung reicht als Grundlage. Ob und für welche regionalen Suchanfragen sie sichtbar ist, muss extern gemessen werden.

Die offiziellen Rechtsseiten sind technisch erreichbar. Ihre rechtliche Vollständigkeit, die Aktualität der Anbieteranschrift und die Übereinstimmung mit allen externen Unternehmensprofilen sind durch HTTP-200-Antworten nicht bestätigt. Diese Grenze wird ausdrücklich nicht als Rechtsmangel gewertet.

## 6. GEO und technisch überprüfbare Voraussetzungen

Die lokale robots.txt enthält `User-agent: *`, `Allow: /` und die korrekte Sitemap-Adresse. Googlebot, Bingbot, OAI-SearchBot und PerplexityBot werden damit nicht über robots.txt ausgeschlossen. Die Erlaubnis gilt ebenfalls für nicht separat behandelte Trainingscrawler. Such- und Trainingsnutzung sind unterschiedliche Entscheidungen: OpenAI dokumentiert getrennte Bots; Perplexity beschreibt seinen Suchcrawler getrennt von Nutzerabrufen.[3][4] Keine Policy wurde verändert.

Vorhandene Kurzantworten, H2/H3-Abschnitte, Tabellen, Listen, Alt-Texte und stabile URLs helfen bei der Extraktion. Die sechs Artikel besitzen unterschiedliche Themen und jeweils eigene Abschnitte. Hauptinhalte sind im vorgerenderten HTML verfügbar. Der Footer ist mit `data-nosnippet` gekennzeichnet; relevante Identität und Standort stehen außerdem im Hauptinhalt. Kein neu entdeckter seitenweiter Inhaltsblocker.

Zitierfähigkeit bedeutet hier verständliche, belegbare und eigenständige Aussagen, nicht garantierte Zitation. Es gibt keine Evidenz, dass zusätzliche Schema-Typen, FAQ-Mengen oder llms.txt aktuell einen notwendigen Engpass lösen würden. Offizielle Google-Hinweise stellen hilfreiche Inhalte und die technische SEO-Grundlage in den Vordergrund.[1]

Offen bleiben tatsächliche Bot-Zugriffe, WAF-Verhalten gegenüber verifizierten Bot-IP-Adressen, Indexierung und die Auswahl der Website als Antwortquelle. Erfolgreiche normale HTTP-Abrufe ersetzen diese Nachweise nicht.

## 7. Technische Prüfungen und Produktion

| Prüfung | Ergebnis |
|---|---|
| `npm run typecheck` | Erfolgreich |
| `npm run lint` | Erfolgreich, keine gemeldeten Fehler |
| Production Build | Erfolgreich als `pretest` von `npm test`: `npm run build`, einschließlich `tsc -b`, Vite und Prerender |
| Automatisierte Tests | 108 bestanden, 0 fehlgeschlagen, 0 übersprungen |
| JSON-LD lokal | 22 parsebare Blöcke auf 16 Seiten; 16 WebSite-, 16 Person-, sechs Article- und sechs BreadcrumbList-Knoten |
| Article-/Breadcrumb-Konsistenz | Headline, Beschreibung, Autor, Datum, Bildpfad, Canonical-Bezug und Breadcrumb-Reihenfolge erfolgreich lokal abgeglichen |
| Metadaten und interne Links | Bestehende Tests bestätigen eindeutige Metadaten, interne Erreichbarkeit, Fragmentziele und kanonische URLs |
| Phase 1 | Responsive Bildpfade, Abmessungen und Alt-Attribute bestehen die Tests; keine neue visuelle Qualitätsmessung |
| Phase 2 | Alias-Redirect-Konfiguration, Sitemap-/Crawlerregeln und No-Script-Navigation bestehen die Tests |
| Phase 3 | Keine falschen FILLANNA-Aliase; korrigierte Weiterbildung und Schema-Tests bestehen |
| Öffentliche 16 Routen | Alle per GET mit HTTP 200 erreichbar; jeweils JSON-LD parsebar; kein `noindex` im abgerufenen HTML und kein `X-Robots-Tag` in diesen Antworten |
| robots.txt / sitemap.xml öffentlich | Beide HTTP 200 |
| Impressum / Datenschutz öffentlich | Beide HTTP 200; initiales HTML enthält Ladeplatzhalter und Direktlink |
| Direktziele IT-Recht Kanzlei | Beide nach Weiterleitung HTTP 200 mit HTML-Antwort; keine rechtliche Vollständigkeitsprüfung |

Die sechs Artikelrouten und alle zehn Basisrouten aus Abschnitt 3 wurden live abgerufen. Ein kompletter Byte-für-Byte-Vergleich zwischen lokalem Build und Deployment erfolgte nicht. Die erfolgreiche Live-Stichprobe bestätigt insbesondere nicht, welcher Deployment-Commit aktiv ist. Historische www-Redirect-Befunde aus Phase 2 wurden in dieser Phase nicht neu vermessen und werden nicht als neuer Fehler ausgegeben.

Die automatisierten Tests prüfen auch vorhandene API-/Sicherheitsfunktionen mit ihrer Testumgebung. Kein echter Resend-Versand, keine echte Buchung und keine Produktionsdatenänderung. Kein neuer vollständiger visueller Browserlauf, kein Browserlauf mit global deaktiviertem JavaScript, keine externe vollständige Schema.org-/Rich-Results-Validierung und keine aktuellen Feldmessungen der Core Web Vitals. Die HTML-Fallback-Prüfung ist kein Ersatz für eine manuelle Bedienprüfung.

## 8. Priorisierter nächster Schritt – nur nach Freigabe

1. **P2, gezielt redaktionell:** Wenige offizielle Quellen im bestehenden `sources`-Modell für SEO/AEO, Shopsysteme und KI ergänzen. Quelle muss die konkrete Aussage stützen; keine pauschale Quellenliste für alle Artikel. Prüfung: echte Quellenlinks, Abgleich der Aussagen, bestehender Renderer und Tests.
2. **P2, gezielt redaktionell:** Im Kostenartikel einen bestätigten Beispielumfang mit Aufwandstreibern ergänzen. Keine automatische Preisgarantie oder erfundene Marktspanne. Prüfung: Antwort liefert zusätzliche Budgetorientierung und bleibt mit Angebot/Preisabsprache konsistent.
3. **P2, kleiner fachlicher Zusatz:** Beim KI-Chatbot auf mögliche fehlerhafte Antworten trotz Wissensbasis hinweisen. Bereits vorhandene Grenzen und menschliche Kontrolle beibehalten. Prüfung: keine Zuverlässigkeitsgarantie, keine unnötige Wiederholung.
4. **P2, gesonderte technische Entscheidung:** Vollständige Rechtstexte auf eigener Route ohne JavaScript nur nach Klärung der zulässigen offiziellen Bereitstellung untersuchen. Bestehende funktionierende Direktlinks erhalten; kein ungeprüfter Architekturwechsel.
5. **P2, Nachweise/QA:** Externe Messbasis und echten No-JavaScript-Browserlauf nachholen. Das erfordert keine neuen SEO-Texte.

Optional (P3): Autorenname verlinken, ein bestätigtes Praxisbeispiel vertiefen, konkrete Fotografie-Abwicklung erläutern und tatsächlich vorhandene offizielle Profile verknüpfen. Kein Anlass für neue allgemeine FAQs, weitere Schema-Typen, Massenartikel, künstliche Bewertungen oder Standort-Landingpages.

## 9. Externe Daten und abschließende Antworten

Benötigt werden für eine weitergehende Beurteilung: Search-Console-Daten zu Indexierung und Suchanfragen, Bing-Webmaster-Daten, verifizierbare Crawler-/Serverprotokolle, tatsächliche regionale Unternehmensprofilinformationen sowie gegebenenfalls freigegebene berufliche Profile und Projektbelege. Für KI-Zitationen wären dokumentierte wiederholte Testfragen mit Datum, Dienst, Suchmodus und tatsächlich zitierten URLs hilfreich. Solche Stichproben bleiben begrenzt und sind keine vollständige KI-Sichtbarkeitsstatistik. Vertrauliche Zugangsdaten oder private Urkunden gehören nicht in den Bericht.

**1. Was ist bereits umgesetzt?** Klare Leistungen, Ablauf und Kontaktwege, sechs strukturierte Artikel mit Kurzantworten und 24 FAQs, Autoren-/Datumsangaben, echtes HTML, interne Links, Schema-Verknüpfungen, transparente Projektstatus, Andernach/Koblenz-Zuordnung und ehrliche laufende Weiterbildung.

**2. Was sollte konkret verbessert werden?** Selektive fachliche Belege, praktischere Kostenorientierung und eine explizite Grenze der KI-Antwortzuverlässigkeit. Die JS-abhängigen Rechtstexte und fehlende vollständige No-JavaScript-Abnahme sind bekannte technische Restpunkte, keine neu erfundenen Maßnahmen.

**3. Was ist optional?** Autorenlink, zusätzliche bestätigte Praxisdetails, Fotografie-Ablauf und reale externe Profile. Kein umfassender Inhaltserweiterungsbedarf nachgewiesen.

**4. Welche externen Daten fehlen?** Indexierungs-/Suchberichte, tatsächliche Bot-Zugriffe, unabhängige Unternehmens-/Referenzbelege und reproduzierbare KI-Zitationsbeobachtungen. Lokale Qualität ist nicht gleich gemessene externe Autorität.

**5. Ist Phase 4 abgeschlossen?** Als beauftragte Bestandsanalyse: ja. Als uneingeschränkt abgenommene Optimierungs- und Sichtbarkeitsphase: noch nicht; die kleinen P2-Punkte und Prüfgrenzen sind offen. Ein großer Ausbau ist nicht gerechtfertigt. Es wurde nichts umgesetzt; weitere Maßnahmen warten auf ausdrückliche Freigabe.

## 10. Quellen und Nachvollziehbarkeit

Die folgenden Quellen wurden für allgemeine technische Einordnung verwendet, nicht als Nachweis von Rankings oder tatsächlichen Eigenschaften der Anbieterin:

1. [Google Search Central: AI features and your website](https://developers.google.com/search/docs/appearance/ai-features) – technische Grundlage und fehlende Sichtbarkeitsgarantie.
2. [Google Search Central: Creating helpful, reliable, people-first content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content) – qualitative Bewertung von Erfahrung, Kompetenz und Vertrauen.
3. [OpenAI: Overview of OpenAI Crawlers](https://developers.openai.com/api/docs/bots) – getrennte Such- und Trainingscrawler.
4. [Perplexity: Crawlers](https://docs.perplexity.ai/docs/resources/perplexity-crawlers) – Suchbot und nutzerinitiierte Abrufe.
5. [IBM: What is a chatbot?](https://www.ibm.com/think/topics/chatbots) – regelbasierte und KI-gestützte Systeme.

Projektbelege: insbesondere `src/data/insights.ts`, `src/data/projects.ts`, `src/routes.ts`, `src/App.tsx`, `index.html`, aktive Komponenten Hero/Services/Projects/Gallery/AboutPage/InsightPage/ProjectProcess/FormSolutions/ProjectRating/KanzleiDocument, `public/robots.txt`, Build-Ausgabe und vorhandene Tests.

Die Commits `47a2860`, `bb801a1`, `a39093f` und `25ac6bd` tragen Copilot-Coauthor-Trailer und betreffen die neueren Artikel, Über-mich-Inhalte und Fachschwerpunkte. Dies belegt Mitwirkung an den Commits, nicht die alleinige Urheberschaft jedes Satzes. Die früher dokumentierte initiale Insights-Ergänzung wurde ebenfalls berücksichtigt. Aus dem Werkzeugnamen wird weder fachliche Korrektheit noch Unrichtigkeit abgeleitet.
