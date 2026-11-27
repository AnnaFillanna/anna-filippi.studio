# Phase 5 – Abschluss: Monitoring und Qualitätssicherung

Stand: 27. November 2026 · Anna Filippi Studio · Basiscommit `d10a4db`

## Ergebnis und Veröffentlichungsstatus

Der nachgewiesene Fehler im SEO-Monitor ist lokal behoben. Kritische Befunde führen zu Exit-Code 1, Warnungen und Hinweise allein zu Exit-Code 0. Der bestehende GitHub-Actions-Job übernimmt diesen Status ohne `continue-on-error`; der Bericht wird mit `if: always()` auch bei Fehlern hochgeladen. Kein weiterer Workflow, kein Besuchertracking und keine zusätzliche Paketabhängigkeit wurden eingeführt.

Die beauftragten technischen Korrekturen sind lokal abgeschlossen. Die fünf Phasen sind hinsichtlich ihrer implementierten Änderungen und automatisierten Prüfungen für eine spätere Veröffentlichung vorbereitet. Eine uneingeschränkte vollständige Betriebsabnahme aller fünf Phasen ist damit nicht belegt: vollständige No-JavaScript-Browserabnahme, reale GitHub-Ausführung/Benachrichtigung, Domainkonfiguration und externe Performance-/Suchdaten bleiben offen. Kein Commit, Push oder Deployment wurde durchgeführt.

## Ausgangszustand und Schutz lokaler Änderungen

Bereits vorhanden waren Änderungen in `src/data/insights.ts` sowie die unversionierten Berichte zu Phase 4 (Audit/Final) und Phase 5 (Audit). Diese wurden nicht überschrieben. Die SHA-256-Prüfsummen der Insights-Datei und beider Phase-4-Berichte stimmen nach Abschluss mit dem Ausgangszustand überein. Änderungen an Anwendung, Design, Texten, APIs, Consent, Redis oder Zugangsdaten sind nicht Bestandteil dieses Auftrags.

## Drei bestehende Workflows

| Workflow | Prüfung und Ergebnis |
|---|---|
| `.github/workflows/seo-monitor.yml` | Vorher: Inline-Python berichtete Fehler ohne Fehlerstatus. Jetzt: eigenständiges testbares Skript, Prozessstatus wirksam, Bericht auch bei Fehlern. Bestehender täglicher Zeitplan und manueller Start erhalten. |
| `.github/workflows/quality.yml` | Vorhandene Lint-/Test-Pipeline erhalten. `npm test` baut über `pretest` einschließlich TypeScript und Prerendering. Neue Monitor-Tests werden über das vorhandene Testmuster automatisch ausgeführt. |
| `.github/workflows/google-search-analytics.yml` | Bestehende lesende Search-Console-Abfrage erhalten. Externe OIDC-/Propertyfreigabe und Laufhistorie nicht bestätigt. Anzeigename „Google Analytics“, Top-100-Auszug und 30-Tage-Aufbewahrung bleiben bekannte Grenzen des Audits; keine GA4-Integration. |

## Geänderte beziehungsweise neue Dateien

- `.github/workflows/seo-monitor.yml`: vorhandenen Job an Prüfskript angebunden; Artefakt-Upload auch bei Fehlern.
- `scripts/seo-monitor.py`: lesender Monitor mit Python-Standardbibliothek.
- `tests/seo_monitor_test.py`: isolierte Antworten, kritische Fehlerszenarien, Warnungen, Wiederholungsversuch und tatsächliche Prozess-Exit-Codes.
- `tests/seo-monitor.test.mjs`: Einbindung der Python-Tests in die bestehende Node-Testpipeline.
- `docs/SEO-AEO-GEO-PHASE-5-FINAL.md`: dieser Bericht und Deployment-Checkliste.

Python 3 wird nun auch für die lokalen Monitor-Tests benötigt; auf dem vorhandenen Ubuntu-Actions-Runner ist es vorhanden. Keine Python-Pakete oder npm-Abhängigkeiten installiert.

## Prüfregeln und Abdeckung

| Bereich | Umsetzung | Einstufung |
|---|---|---|
| Öffentliche Seiten / HTTP | Produktions-Sitemap plus erwartete URLs aus versionierter Sitemap; sämtliche 16 aktuellen Routen; Nicht-200 und endgültig anderes Ziel erkannt | Fehler |
| Netzwerk | Timeout, Antwortgrößenlimit, einmaliger Retry bei temporären Fehlern; danach keine falsche Erfolgsmeldung | Fehler |
| Sitemap | XML parsebar, URLset nicht leer, kanonischer HTTPS-Host, keine Query/Fragment, erwartete Seiten enthalten; fremde Einträge werden nicht abgerufen | Fehler; doppelte URLs Warnung |
| robots.txt | Erreichbarkeit und Freigabe für Googlebot, Bingbot, OAI-SearchBot, PerplexityBot; Sitemap-Verweis | Sperre/Ausfall Fehler; fehlender Sitemap-Verweis Warnung |
| Canonical | Genau ein Canonical, exakt gleich der geprüften öffentlichen URL | Fehler |
| Title | Genau ein nichtleerer Titel | Fehler; identische Titel Warnung |
| Description | Vorhanden, nichtleer, einmalig; Duplikate zwischen Seiten | Warnung |
| Noindex | Meta robots/googlebot/bingbot sowie X-Robots-Tag (`noindex`/`none`) | Fehler |
| JSON-LD | Vorhandene Blöcke als nichtleere JSON-Objekte/Arrays parsebar | Ungültig Fehler; fehlend Warnung |
| Interne Links | Öffentliche interne Dokumentziele zusätzlich geprüft; API-, Asset- und Bildpfade sowie externe URLs ausgenommen | Nicht-200/abweichendes Endziel Fehler |
| H1 | Anzahl geprüft; semantische Abweichung ist kein automatischer Ausfall | Warnung |
| Abschluss | Zahl geprüfter Seiten und zusätzlicher Links | Information |

Zusätzliche Abrufe sind begrenzt (100 Seiten, 50 zusätzliche interne Links); eine Überschreitung gilt als unvollständige Prüfung und Fehler. Vier parallele Seitenabrufe, keine Formularübermittlung, keine Datenbankabfrage, keine Tokens erforderlich. Die Crawler-Konfiguration selbst wurde nicht geändert.

### Bewusste Grenzen

- Die vorhandene einfache robots.txt wird mit der Python-Standardbibliothek ausgewertet. Komplexe zukünftige Wildcard-/Endanker-Regeln und crawlerabhängige Prioritäten benötigen eine gesonderte Prüfung; der Monitor ist kein vollständiger Suchmaschinen-Crawler-Emulator.
- X-Robots-Tag wird konservativ ausgewertet. Bei künftig botspezifischen Headern für andere Crawler muss die Zuordnung vor Einführung geprüft werden.
- Interne Links mit Queryparametern und externe Links werden nicht rekursiv verfolgt. Fragmentziele werden lokal von den bestehenden Tests geprüft. Bewusst verlinkte Weiterleitungen müssen bei Einführung gesondert bewertet werden.
- JSON-Syntax ist keine vollständige Schema.org-Semantikvalidierung oder Garantie eines Rich Results. Die ergänzende lokale Prüfung kontrolliert bestehende Entitäten und Artikelbezüge.
- Canonical-/Sitemapabweichungen zwischen neuem Repositorystand und älterer Produktion können korrekt als Deployment-Rückstand auffallen.
- Der Job prüft Produktion, nicht automatisch Preview-Deployments. Domainvarianten/Redirectketten, Authentifizierung externer Dienste und Benachrichtigungszustellung sind separate Abnahmen.

## Ausgeführte Prüfungen

| Prüfung | Ergebnis |
|---|---|
| `npm run typecheck` | Erfolgreich |
| `npm run lint` | Erfolgreich, keine ESLint-Warnungen |
| `npm run build` über `npm test`/`pretest` | Erfolgreich, 16 Seiten vorgerendert |
| Vollständige Testpipeline | 109 Node-Tests bestanden, keine übersprungen; enthält Python-Monitor-Suite |
| Monitor-Suite | 6 Testmethoden, einschließlich 10 kritischer Szenarien als Untertests und Prozess-Exit-Prüfung für INFO/WARNUNG/FEHLER |
| Fehlerfälle | HTTP-Ausfall, ungültige Sitemap, robots-Sperre, falscher Canonical, fehlender Titel, ungültiges JSON-LD, Meta-/Header-Noindex, defekter interner Link, fehlende erwartete Seite erkannt |
| Weitere Monitor-Tests | Warnung bleibt erfolgreich; fremde Sitemap-Ziele nicht angefragt; Netzwerkfehler wiederholt und als Fehler zurückgegeben; Bericht bei Exit 1 vorhanden |
| Live-Monitor | Am 27.11.2026 um 11:44 UTC: 16 öffentliche Seiten, keine zusätzlichen internen Ziele, keine Fehler oder Warnungen, Exit 0 |
| JSON-LD lokal | 22 Blöcke auf 16 Seiten parsebar; WebSite/Person sowie sechs Article-/Breadcrumb-Kombinationen und Artikelbezüge geprüft |
| Metadaten / Canonicals / interne Links | Bestehende Tests für eindeutige Metadaten, semantische Struktur, Links und Fragmentziele bestanden |
| robots.txt / Sitemap | Lokal und live erfolgreich geprüft; bestehende Crawler-Policy unverändert |
| Bildoptimierung | Vorhandene Tests für Varianten, Pfade, intrinsische Abmessungen und Alt-Attribute bestanden |
| Redirect-Konfiguration | Bestehende lokale Routing-/HTML-Alias-Tests bestanden; kein neuer vollständiger Live-Test aller Domainvarianten |
| Responsive Browser-Stichprobe | Lokaler Build: Desktop-Breakpoint angefordert, mobile Ansicht 390 × 844 geprüft; Startseite und Über-mich-Seite lesbar; mobiles Menü öffnet, Über-mich-Link navigiert, Menü schließt. Keine vollständige Geräte-/Seitensammlung visuell abgenommen. |
| Navigation ohne JavaScript | HTML-/No-Script-Tests bestanden. Kein vollständiger Browserlauf mit global deaktiviertem JS: verfügbare Browser-API bietet keinen entsprechenden Schalter. Nicht als vollständige No-JS-Abnahme ausgeben. |
| `git diff --check` | Erfolgreich |

Ein erneuter Testlauf innerhalb der restriktiven Sandbox scheiterte am Vite-Cache-Schreibzugriff (`EPERM`); dies war ein Umgebungsfehler. Die Ausführung mit autorisiertem Projekt-Schreibzugriff wurde anschließend wiederholt. Es wurden keine echten E-Mails, Bewertungen oder sonstigen produktiven Schreibaktionen ausgelöst.

Bestehende Build-Warnung: JavaScript-Chunk über 500 kB (ca. 571 kB minifiziert). Kein neu eingeführter Buildfehler und kein Anlass für einen Architekturumbau in diesem Auftrag. Keine neuen LCP-, INP-, CLS- oder TTFB-Messwerte erhoben. Lokale Node-Version 24; tatsächliche CI-Ausführung unter der konfigurierten Node-Version 22 bleibt nach Veröffentlichung zu bestätigen.

## Deployment-Checkliste

### Vor Veröffentlichung

- [ ] `git status --short`, `git diff` und unversionierte Dateien gemeinsam prüfen. Vorbestehende Phase-4-Änderungen separat von dieser Monitor-Korrektur bewerten; keine pauschale Übernahme unbekannter Dateien.
- [ ] Die fünf oben genannten Dateien und bestehende Phase-4/5-Berichte prüfen; keine Geheimnisse, temporären Berichte oder Build-Artefakte versionieren.
- [ ] Nach weiteren Änderungen TypeScript, ESLint, Build und komplette Tests erneut ausführen. Python 3 für Monitor-Tests bereitstellen.
- [ ] Vollständige Navigation mit im Browser deaktiviertem JavaScript sowie repräsentative Desktop-/Mobilansichten abnehmen.
- [ ] GitHub Actions aktiviert, Berechtigungen und Benachrichtigungsempfänger prüfen. Keine ungeschützten Rohdatenartefakte veröffentlichen.
- [ ] Keine neuen Umgebungsvariablen für den SEO-Monitor erforderlich. Bestehende GSC-Repositoryvariablen `GCP_WORKLOAD_IDENTITY_PROVIDER`, `GCP_SERVICE_ACCOUNT` und Propertyzugriff prüfen; Werte nicht veröffentlichen.
- [ ] Bestehende Vercel-Konfiguration unverändert erhalten: insbesondere `RESEND_API_KEY`, `CONTACT_EMAIL_FROM`, `CONTACT_EMAIL_TO`, `CONTACT_ENABLED`, `CONTACT_ALLOWED_ORIGINS`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `RATE_LIMIT_SECRET` sowie bestehende Legal-/Bewertungs-Konfiguration. Redis-Schalter `contact:control:enabled` erhalten. Keine Variablen wegen dieses Monitors entfernen oder neu anlegen.
- [ ] Environment-Zuordnung Production/Preview und bestehende Freigabeschalter prüfen, ohne Werte in Berichte zu kopieren.
- [ ] Explizite Freigabe für Commit/Push/Deployment einholen. Aktuell nicht erteilt.

### Nach separat freigegebener Veröffentlichung

- [ ] Tatsächlich ausgelieferten Commit und Buildstand bestätigen; Phase-4-Inhalte nicht allein aus lokaler Prüfung als veröffentlicht bezeichnen.
- [ ] Qualitätsworkflow unter Node 22 und SEO-Monitor in GitHub erfolgreich ausführen; bei einem isolierten Testfehler roten Lauf, Artefakt und Benachrichtigung bestätigen, ohne Produktion zu beschädigen.
- [ ] Alle 16 öffentlichen URLs, robots.txt, sitemap.xml, Canonicals, Metadaten, JSON-LD und interne Links erneut prüfen.
- [ ] Vercel-Domainweiterleitungen: HTTP/HTTPS, www/non-www und `/index.html`-Aliase auf direktes kanonisches Ziel, permanente Statuscodes und Schleifen prüfen. Frühere www-307-Beobachtung gegen Dashboardkonfiguration abgleichen; lokale `permanent: true`-Konfiguration allein reicht nicht.
- [ ] Kontakt und Rechtsseiten funktional prüfen; reale Formularsendung nur als bewusst abgestimmten Test behandeln.
- [ ] Google Search Console: richtige Property, Sitemap `https://annafilippi.studio/sitemap.xml`, Abrufstatus, URL-Prüfung wichtiger Seiten und Indexierungsberichte kontrollieren. Sitemapaufnahme ist kein Indexierungsnachweis.
- [ ] GSC-Auswertung/OIDC bestätigen; Top-100-CSV nicht als vollständigen Trafficbericht interpretieren. Bing ergänzend prüfen.
- [ ] PageSpeed Insights/Lighthouse für Startseite, Fotografie, Software, Kontakt und einen Artikel auf Mobil/Desktop messen; mehrere vergleichbare Laborläufe, Toolversion, Zeitpunkt und Gerät dokumentieren. CrUX-Felddaten getrennt behandeln.
- [ ] Baseline erfassen: Deploymentdatum/Commit, letzte vollständige 28 Tage vor Veröffentlichung, erste vollständige 28 Tage danach, GSC-Klicks/Impressionen/CTR/Position und indexierte Seiten. Fehlende Werte ausdrücklich als nicht verfügbar markieren.
- [ ] Monatliche KI-Stichproben und wöchentliche/monatliche/quartalsweise Prüfungen gemäß Phase-5-Audit fortführen. Keine garantierte KI-Sichtbarkeit ableiten.

## Offene Punkte und Abschlussbewertung

Die neue Fehlerweitergabe ist durch echte lokale Prozess-Exit-Tests belegt. Ihr GitHub-Betrieb wird erst nach einem autorisierten Push nachgewiesen. Der Monitoring-Plan bleibt die Grundlage; keine zusätzlichen Analyseanbieter, Abonnements oder Consent-Änderungen sind erforderlich.

**Lokal vorbereitet: ja. Vollständig veröffentlicht oder extern abgenommen: nein.** Die verbleibenden Punkte sind überwiegend Betriebs- und Messprüfungen sowie die vollständige No-JavaScript-/Geräteabnahme. Weitere Quellcodeoptimierungen werden daraus ohne neue Befunde nicht abgeleitet.
