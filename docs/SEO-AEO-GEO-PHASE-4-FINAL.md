# Phase 4 – Gezielte Optimierung und Abschluss

Stand: 26. November 2026 · Anna Filippi Studio · Ausgangsstand `d10a4db`

## Ergebnis

Die beauftragten gezielten redaktionellen Verbesserungen sind lokal abgeschlossen. Vier vorhandene Artikel wurden punktuell ergänzt. Es wurden keine Preise, Preisbereiche, Mindestpreise oder verbindlichen Angebote veröffentlicht. Bestehende Autoreninformationen, Projektkennzeichnungen, Leistungen und Schema-Strukturen bleiben erhalten.

Die vorhandene unversionierte Datei `docs/SEO-AEO-GEO-PHASE-4-AUDIT.md` wurde unverändert erhalten. Kein Commit, Push oder Deployment durchgeführt.

## Änderungen und Dateien

**Geändert: `src/data/insights.ts`**

| Betroffene Artikelroute | Änderung |
|---|---|
| `/insights/was-kostet-eine-professionelle-website` | Kurzantwort konkretisiert; ein Beispiel erklärt den unterschiedlichen Aufwand für eine Website, Shopfunktionen, Schnittstellen und KI-Integration. Die vorhandenen Faktoren Unterseiten, Gestaltung und technische Anforderungen bleiben bestehen. Laufende Betreuung und spätere Anpassungen werden ausdrücklich nach Bedarf vereinbart. |
| `/insights/seo-und-aeo-fuer-kleine-unternehmen` | Zwei offizielle Google-Quellen für E-E-A-T und die technischen Grundlagen der KI-Suche ergänzt. |
| `/insights/e-commerce-fuer-kleine-unternehmen` | Je eine offizielle Shopify- und WooCommerce-Quelle für Plattformfunktionen, Erweiterungen und die WordPress-Grundlage ergänzt. |
| `/insights/ki-und-automatisierung-fuer-kleine-unternehmen` | Vorhandenen Zuverlässigkeitsabsatz um mögliche falsche oder erfundene Angaben („Halluzinationen“) und menschliche Prüfung wichtiger Antworten vor Entscheidungen oder Aktionen präzisiert. Zwei offizielle OpenAI-Quellen ergänzt. Bereits vorhandene Grenzen, Freigaben und menschliche Übergabe bleiben erhalten. |

Die Aktualisierungsdaten dieser vier tatsächlich bearbeiteten Artikel wurden auf `2026-11-26` gesetzt. Veröffentlichungsdaten und die Daten der übrigen Artikel bleiben unverändert. Die bestehende Ableitung von sichtbarem Datum und `Article.dateModified` verwendet weiterhin dieselben Artikeldaten.

**Neu: `docs/SEO-AEO-GEO-PHASE-4-FINAL.md`** – dieser Bericht.

Keine Komponenten, Styles, APIs, Rechtstextintegration, Tracking-Konfigurationen oder Abhängigkeiten geändert. Quellen werden vom bereits vorhandenen Quellen-Renderer als echte HTML-Links dargestellt; das Kostenbeispiel nutzt den bereits vorhandenen Beispielblock. Keine neue Gestaltung und keine vollständige Artikelneufassung.

## Geprüfte Fachquellen

Alle folgenden Quellen wurden vor Übernahme inhaltlich abgerufen und auf Relevanz geprüft. Die ersten fünf URLs antworteten zusätzlich beim direkten HTTP-GET mit 200. Der sechste Link wurde erfolgreich über den Webabruf geöffnet und vollständig inhaltlich geprüft. Die Linkprüfung gilt für den Prüfzeitpunkt, nicht als dauerhafte Verfügbarkeitsgarantie.

| Quelle | Unterstützte Aussage im Artikel |
|---|---|
| [Google Search Central: Hilfreiche Inhalte](https://developers.google.com/search/docs/fundamentals/creating-helpful-content) | E-E-A-T als Qualitätsbetrachtung, kein einzelner spezifischer Rankingfaktor. |
| [Google Search Central: KI-Funktionen und Websites](https://developers.google.com/search/docs/appearance/ai-features) | Weiterhin relevante technische SEO-Grundlagen; keine garantierte Aufnahme in Such-/KI-Ergebnisse. Diese Quelle bezieht sich auf Google, nicht auf eine Zusage anderer Anbieter. |
| [Shopify: Funktionen und Pläne](https://help.shopify.com/en/manual/intro-to-shopify/overview) | Integrierte Plattformfunktionen, Themes, Apps und Zahlungsfunktionen. Keine konkreten Tarifpreise übernommen. |
| [WooCommerce: Shopaufbau](https://woocommerce.com/document/build-online-store/) | WooCommerce als WordPress-Plugin sowie Erweiterung und Hosting-Grundlagen. |
| [OpenAI: Safety best practices](https://developers.openai.com/api/docs/guides/safety-best-practices) | Menschliche Prüfung von Ausgaben, Systemgrenzen und verantwortungsvolle Anwendung. |
| [OpenAI: Does ChatGPT tell the truth?](https://help.openai.com/en/articles/8313428-does-chatgpt-tell-the-truth) | Überzeugend klingende falsche Angaben und Halluzinationen sowie Überprüfung wichtiger Informationen. |

Ein zunächst geprüfter WooCommerce-Kandidat unter `/document/woocommerce-getting-started/` lieferte beim Webabruf 404 und wurde **nicht** eingefügt. Stattdessen wurde die erreichbare offizielle Seite zum Shopaufbau verwendet. Die alte OpenAI-Plattformadresse leitete auf die aktuelle Entwicklerdokumentation um; im Artikel steht direkt das geprüfte Ziel.

Die Quellenliste bleibt gezielt: jeweils zwei Belege in drei Fachartikeln. Keine künstliche Quellenliste in den übrigen Artikeln, keine fremden Erfolgsaussagen oder Preise übernommen. Die Quellen unterstützen die genannten Fachinformationen, nicht sämtliche persönlichen Erfahrungsangaben der Artikel.

## Kostenorientierung und KI-Grenzen

Das Beispiel beschreibt Anforderungen, keine festen Leistungspakete und keine behauptete Kundenreferenz. Es erklärt, warum Produktvarianten, Warenkorb, Zahlungen, Versand, Systemanbindungen und KI-Prüfung zusätzliche Arbeitsschritte verursachen. Gestaltung, Seitenumfang, Inhalte und laufende Ausgaben waren bereits beschrieben und wurden nicht nochmals in einen neuen allgemeinen Abschnitt kopiert.

Der KI-Hinweis ersetzt einen bestehenden Absatz statt einen zusätzlichen Warnbereich einzuführen. Er macht deutlich, dass eine Wissensgrundlage keine Fehlerfreiheit garantiert. Die bereits vorhandenen Aussagen zu Zugriffsrechten, menschlichen Freigaben, wirtschaftlicher Abwägung und Datenschutz wurden nicht unnötig wiederholt.

## Qualitätssicherung

| Prüfung | Ergebnis |
|---|---|
| TypeScript: `npm run typecheck` | Erfolgreich am endgültigen Stand |
| ESLint: `npm run lint` | Erfolgreich am endgültigen Stand |
| Production Build | Erfolgreich über `npm test` → `pretest` → `npm run build`, einschließlich TypeScript-Build, Vite und Prerender |
| Sämtliche vorhandenen Tests | 108 bestanden, 0 fehlgeschlagen, 0 übersprungen |
| Interne Links und Fragmentziele | Vorhandene Routing-/SEO-Tests erfolgreich; alle öffentlichen Seiten intern erreichbar |
| Neue externe Quellenlinks | Inhaltlich geprüft; alle sechs abgerufen, keine ungeprüfte oder bekanntermaßen defekte URL übernommen |
| Quellen im initialen HTML | Sechs echte Links in drei Quellenabschnitten bestätigt |
| Neue Textpassagen | Kostenbeispiel und Halluzinationshinweis im vorgerenderten HTML bestätigt |
| Strukturierte Daten | Alle 22 JSON-LD-Blöcke auf 16 Seiten parsebar; 16 WebSite-, 16 Person-, sechs Article- und sechs BreadcrumbList-Knoten erhalten |
| Schema-Konsistenz | Artikelüberschriften, Beschreibungen, Autorin, Datumswerte, Bildpfade, Canonical-Bezüge und Breadcrumb-Reihenfolge lokal erfolgreich geprüft |
| Öffentliche Verfügbarkeit | Alle 16 aktuellen Produktionsrouten beim GET mit HTTP 200 erreichbar |
| Regressionen | Vorhandene Tests für Bilder, Metadaten, Weiterleitungen, No-Script-Fallback sowie API-/Sicherheitsfunktionen erfolgreich |
| Diff-Prüfung | `git diff --check` erfolgreich |

Die öffentliche Prüfung umfasst Startseite, Projekte, Softwareentwicklung, Dana-Referenz, Fotografie, Über mich, Kontakt, Impressum, Datenschutz, Insights-Übersicht und alle sechs Artikel. **Diese HTTP-Prüfung betrifft das bereits veröffentlichte Angebot; die neuen Ergänzungen sind ausschließlich lokal vorhanden.** Ein vollständiger Deployment-Abgleich wurde nicht behauptet.

Keine echten E-Mails oder Formulare versendet, keine Produktionsdaten verändert. Es wurden keine zusätzlichen Tests installiert oder nur zur Spiegelung der Textänderungen neue Tests geschrieben; die vorhandenen 108 Tests und ergänzende lokale HTML-Prüfungen decken den technischen Rahmen ab.

## Offene Punkte und Prüfgrenzen

- Keine neue vollständige visuelle Browser-/Gerätematrix und kein vollständiger Browser-Test mit global deaktiviertem JavaScript. Komponenten und Styles bleiben unverändert; die Ausgabe wurde im erzeugten HTML geprüft.
- Keine externe vollständige Schema.org-/Rich-Results-Validierung. Die dokumentierte Prüfung umfasst JSON-Syntax und die genannten Beziehungen zum sichtbaren Inhalt.
- Die vollständigen Rechtstexte werden weiterhin per JavaScript geladen; die vorhandenen Direktlinks bleiben erhalten. Eine Änderung dieser Architektur war nicht Teil der hier freigegebenen redaktionellen Umsetzung.
- Keine neuen Messdaten zu tatsächlicher Indexierung, Rankings, KI-Zitationen oder Core Web Vitals. Die Änderungen garantieren keine Suchpositionen oder KI-Empfehlungen.
- Nach einer später ausdrücklich freigegebenen Veröffentlichung sollten Quellenabschnitte, Aktualisierungsdaten und neue Textpassagen auch live kontrolliert werden.

## Empfehlungen für Phase 5

Vorrang sollte eine Mess- und Abnahmephase haben, kein weiterer pauschaler Inhaltsausbau:

1. Vorhandene Search-Console-/Bing-Daten zu Indexierung und relevanten Suchanfragen auswerten, ohne neue Tracking-Dienste einzubauen.
2. Nach freigegebener Veröffentlichung die vier geänderten Artikel live abnehmen und die noch offene echte No-JavaScript-Browserprüfung nachholen.
3. Produktions-Weiterleitungen und reale Performance-Daten bei Bedarf mit den bisherigen Berichten abgleichen, bevor weitere technische Änderungen beschlossen werden.
4. KI-Zitationen nur mit dokumentierten Testfragen und klaren Aussagegrenzen beobachten. Reale Referenzdetails oder Profile nur bei bestätigtem Material ergänzen.

**Phase 4 kann für den beauftragten lokalen Umfang abgeschlossen werden.** Die notwendigen punktuellen Ergänzungen sind umgesetzt und technisch geprüft. Externe Erfolgsmessung, spätere Produktionsabnahme und die bekannten gesonderten Architektur-/Browserprüfungen bleiben offen. Kein weiterer Textausbau ist allein zur Vollständigkeit einer SEO-Liste erforderlich.
