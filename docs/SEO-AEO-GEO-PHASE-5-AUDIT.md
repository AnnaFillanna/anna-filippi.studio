# Phase 5 – Bestandsanalyse: Analytics, Monitoring und Erfolgskontrolle

Stand: 27. November 2026 · Anna Filippi Studio · Basiscommit `d10a4db`

## 1. Ergebnis und Umfang

**Es bestehen bereits drei versionierte GitHub-Workflows für Qualität, SEO-Verfügbarkeit und Search-Console-Auswertungen.** Ein erneuter Aufbau derselben Infrastruktur wäre unnötig. GA4, Google Tag Manager, Vercel Web Analytics, Vercel Speed Insights und Clarity sind im untersuchten eigenen Quellcode nicht eingebunden. Die tatsächliche Aktivierung externer Konten und erfolgreicher Workflow-Ausführungen ist nicht bestätigt.

Empfehlung: Zuerst die bestehenden Workflows, Berechtigungen und Berichtsqualität prüfen; anschließend eine konsistente Baseline aus Search Console, Bing und kostenlosen Performance-Prüfungen aufbauen. Zusätzliche Besuchertracker sind dafür zunächst nicht erforderlich. Keine P0-Störung festgestellt. Vorrangiger P1-Punkt ist die Verlässlichkeit des bestehenden Monitorings, nicht die Installation weiterer Dienste.

Berücksichtigt: ursprünglicher SEO-AEO-GEO-Audit, Bildoptimierungsbericht, Phase 2, Audit/Abschluss Phase 3, Audit/Abschluss Phase 4 sowie ältere SEO- und Betriebsdokumentation. Maßgeblich ist der aktuelle Code einschließlich lokaler Phase-4-Ergänzungen. Historische Live- oder Performance-Aussagen sind keine neue Messung.

Vor Beginn vorhanden und unverändert erhalten:

- `src/data/insights.ts` geändert: gezielte Phase-4-Ergänzungen.
- `docs/SEO-AEO-GEO-PHASE-4-AUDIT.md` unversioniert.
- `docs/SEO-AEO-GEO-PHASE-4-FINAL.md` unversioniert.

Der zuvor angekündigte Commit wurde nicht ausgeführt; der jüngste Auftrag untersagt Commits ausdrücklich. Einzige neue Projektdatei dieses Auftrags ist dieser Bericht. Keine Quellcodeänderung, Installation, Dienstaktivierung, Kontoänderung, Buchung, echter Formularversand, Commit, Push oder Deployment. Der erlaubte Build erzeugte ignorierte Build-Artefakte erneut.

## 2. Bestand: Implementierung ist nicht Aktivierungsnachweis

| Werkzeug / Bereich | Technischer Bestand | Tatsächlicher Betrieb / Grenze |
|---|---|---|
| Google Search Console | `.github/workflows/google-search-analytics.yml` fragt Search Analytics API lesend ab | GSC-Property, IAM-Vertrauen, Freigabe des Servicekontos und erfolgreiche Läufe nicht eingesehen |
| GA4 | Kein gtag, Measurement-ID-Einbau, GA-SDK oder Eventversand in aktivem Code gefunden | Externes GA-Konto kann trotzdem existieren; Dateneingang nicht bestätigt |
| Google Tag Manager | Kein Container-Snippet, dataLayer oder GTM-noscript-Einbau gefunden | Externe Container/Konten nicht geprüft |
| Vercel Web Analytics | Kein `@vercel/analytics`, keine eigene Initialisierung gefunden | Dashboard-Schalter, Tarif und Daten unbekannt |
| Vercel Speed Insights | Kein `@vercel/speed-insights` oder Web-Vitals-Sammler gefunden | Keine bestätigte RUM-Messung |
| Bing Webmaster Tools | Kein lokaler Exportjob oder Verifikationsartefakt gefunden | DNS- oder externe Verifizierung ist dennoch möglich; Konto nicht geprüft |
| SEO-Monitor | `.github/workflows/seo-monitor.yml`, täglicher Zeitplan und manueller Start | Laufhistorie/Benachrichtigungen nicht bestätigt; Bericht allein ist noch kein wirksamer Alarm |
| Qualitäts-CI | `.github/workflows/quality.yml`, Push auf main, PR und manueller Start | Lokale Prüfungen erfolgreich; Branchschutz und CI-Pflichtchecks nicht eingesehen |
| Clarity / Sentry / sonstige Besuchertracker | Keine Integration im untersuchten Code gefunden | Keine vollständige dynamische Netzwerk-/Cookie-Aufzeichnung im Browser durchgeführt |
| Betriebsdaten | Resend-Versand, Upstash-Zustände, Projektbewertungen und Vercel-Hosting | Betriebsfunktionen, keine fertige Marketing-Analyse; Konten und produktive Logs nicht ausgelesen |

Die sichtbare Angabe „Analytics“ in `AboutPage.tsx` ist ein fachlicher Schwerpunkt, keine technische Tracker-Integration. Ein fehlendes HTML-Verifikationstag beweist nicht, dass Search Console/Bing nicht verifiziert sind: DNS-Verifizierung benötigt keinen Website-Tracker.

Live-HTML aller 16 Routen enthielt jeweils das eigene JS-Bundle, aber keine gefundenen Marker für Google Analytics/GTM, Clarity oder Vercel Insights. Das ist eine HTML-Stichprobe, keine Zusicherung, dass jede nachgeladene Drittanbieterressource trackingfrei ist.

### 2.1 Bestehender Search-Console-Workflow

Der Anzeigename **„Anna Google Analytics“** ist missverständlich: Der Workflow verwendet Search Console, nicht GA4. Er läuft laut Datei montags um 08:23 UTC und ist manuell startbar. Dies entspricht in Berlin 09:23 Uhr im Winter bzw. 10:23 Uhr im Sommer; Zeitpläne sind keine garantierte Ausführung zu einer exakten Minute.

Vorhandene sinnvolle Eigenschaften:

- GitHub OIDC mit `google-github-actions/auth@v3`, kein fest hinterlegter privater Schlüssel im Workflow.
- `contents: read`, `id-token: write`, Google-Scope `webmasters.readonly`.
- Erwartete Repository-Variablen: `GCP_WORKLOAD_IDENTITY_PROVIDER` und `GCP_SERVICE_ACCOUNT`. Nur Namen geprüft, keine Werte oder Tokens ausgelesen.
- Beschränkung auf `sc-domain:annafilippi.studio` oder `https://annafilippi.studio/`.
- Zwei aufeinanderfolgende Siebentageszeiträume, Ende drei Tage vor dem Lauf.
- Markdown-Zusammenfassung mit Klicks/Impressionen sowie CSVs nach Suchanfrage und Seite mit Klicks, Impressionen, CTR und Position.
- Bericht als Actions-Artefakt, 30 Tage Aufbewahrung; keine Ausgabe des Zugangstokens.

Konkrete Grenzen:

1. `rowLimit: 100`, keine Pagination: CSVs sind **Top-100-Auszüge**, keine vollständige Liste. Aggregierte Summen nicht aus diesen Zeilen als vollständige Property-Summen berechnen.
2. Keine Gerätesegmente, Länder, Markenfilter, Indexierungsdaten oder Bing-Daten. Das ist ein begrenzter sinnvoller Start, keine Vollabdeckung.
3. Leere Antwort wird im Summary als Null ausgegeben. Null darf bei einer Baseline nicht ungeprüft mit „keine Sichtbarkeit“ gleichgesetzt werden; Datenverfügbarkeit separat kennzeichnen.
4. 30 Tage Artefaktaufbewahrung reichen nicht für Quartals-/Jahresvergleiche. Kontrollierte Aufbewahrung aggregierter Monatswerte fehlt als belegter Prozess.
5. Berechtigungsumfang des Google-Servicekontos, Workload-Identity-Vertrauensbedingungen und Datenzugriff in GSC sind extern zu prüfen. Der Readonly-Scope allein belegt nicht die gesamte IAM-Sicherheit.
6. Suchanfragen können sensible Inhalte enthalten. Repository-/Artefakt-Sichtbarkeit prüfen; keine Rohabfragen ungeprüft in öffentliche Berichte kopieren.

### 2.2 Bestehender SEO-Monitor

Täglich 07:17 UTC, manuell startbar. Er prüft Homepage, robots.txt und sitemap.xml. Homepage: Titel, Description, Canonical-Ausgabe, H1-Zahl und Robots-Meta-noindex. Positiv: kurze Laufzeit, keine Zugangsdaten nötig, Bericht als Artefakt.

**Nachgewiesener Monitoring-Fehler:** Abruffehler und Warnungen werden dokumentiert, aber der Python-Prozess endet weiterhin erfolgreich. Ein grüner Workflow kann daher einen HTTP-Ausfall enthalten. Fehlender/falscher Canonical oder falsche H1-Anzahl lösen nicht einmal die vorhandene Metadatenwarnung aus. `X-Robots-Tag`, Unterseiten, Sitemap-Inhalt und Redirectketten werden nicht ausgewertet. `urlopen` folgt Weiterleitungen; ein abschließendes 200 zeigt deren Qualität nicht.

Empfehlung nach Freigabe: vorhandenen Job um definierte Fehlerkriterien und Statuscode ergänzen; aus der Sitemap gezielt alle öffentlichen Routen prüfen; Header-/Canonical-Abgleich und Abschlussziel aufnehmen. Keine zweite Monitoring-Plattform erforderlich. Benachrichtigungsempfänger und Ausfalltest anschließend verifizieren, ohne produktive Fehler zu erzeugen.

### 2.3 Qualitäts-CI

Node 22, `npm ci`, ESLint und `npm test`; letzteres baut über `pretest` die Website einschließlich `tsc -b`. Kein eigener `typecheck`-Schritt, aber TypeScript-Build vorhanden. Kein belegter Anlass für einen zweiten identischen CI-Workflow. Branchschutz und tatsächliche Laufhistorie bleiben offen.

## 3. SEO-Kennzahlen und ihre Bedeutung

| KPI | Geeignete Quelle | Stand / Interpretation |
|---|---|---|
| Impressionen | GSC, Bing Search Performance | GSC-Abfrage vorbereitet; Plattformen getrennt auswerten |
| Klicks | GSC, Bing | Suchklicks sind keine gemessenen Website-Sitzungen |
| CTR | Klicks ÷ Impressionen × 100 | Aus Summen berechnen, nicht ungeachtet der Gewichtung Zeilen-CTR mitteln |
| Durchschnittliche Position | GSC, Bing | Kontextabhängiger Mittelwert; kein fester Rang einer Person oder allgemeine KI-Position |
| Suchanfragen / Landingpages | GSC-/Bing-Berichte | GSC-CSV lokal auf 100 Zeilen begrenzt; anonymisierte/ausgelassene Abfragen möglich |
| Indexierte Seiten / Ausschlussgründe | GSC-Seitenindexierung, URL-Prüfung; Bing Site Explorer/Indexberichte | Nicht im vorhandenen Search-Analytics-Job enthalten; 16 Sitemap-URLs sind nicht 16 bestätigte Indexierungen |
| Organischer Traffic auf der Website | Optional später Webanalyse oder geeignete aggregierte Logs | Ohne Besuchermessung keine bestätigten Sitzungszahlen; GSC-Klicks als klar bezeichnete Ersatzkennzahl nutzen |
| Indexierungs-/Crawlprobleme | GSC/Bing plus technischer Monitor | HTTP-Verfügbarkeit allein beweist keine Indexierung |

GSC und Bing bieten die grundlegenden Suchleistungskennzahlen; Änderungen der Gruppierung und des Suchtyps beeinflussen Vergleiche. Einheitliche Zeiträume, Länder-/Gerätefilter und Property verwenden. Plattformdaten nicht zu einer scheinbar eindeutigen Besucherzahl addieren. [Google-Berichte](https://support.google.com/webmasters/answer/10268906), [Bing Search Performance](https://www.bing.com/webmasters/help/search-performance-c680da36).

## 4. Performance: vorhandene Voraussetzungen, keine erfundenen Messwerte

Bildvarianten, intrinsische Abmessungen, Lazy Loading außerhalb des Hero-Bereichs und Prerendering aus Phase 1–4 sind vorhanden und bestehen die Tests. Build-Ausgaben und `src/data/image-variants.json` ermöglichen Größenvergleiche. Sie ersetzen keine Laufzeitmessung: Die Summe aller Dateien ist nicht die tatsächlich geladene Datenmenge einer Seite.

| Kennzahl | Geeignetes Verfahren | Aktueller Nachweis |
|---|---|---|
| LCP | Lighthouse/PSI als Labor; CrUX oder RUM als Feldmessung | Kein neuer Messwert erhoben |
| INP | Echte Nutzerinteraktionen in CrUX/RUM; Interaktionsprofil im Labor ergänzend | Kein RUM-Sammler; Lighthouse-Seitenlade-TBT ist kein INP-Ersatz |
| CLS | Labor für anfängliche Verschiebungen; Feld für gesamten Besuch | Abmessungstests bestanden, aber kein numerischer CLS-Nachweis |
| TTFB | Netzwerk-/Navigationsmessung, PSI/CrUX soweit verfügbar | HTTP-200-Prüfung misst keine repräsentative TTFB |
| Ladezeit / Ressourcen | DevTools-Wasserfall, Transferbytes, Requestzahl, Cachezustand | Kein neuer vollständiger Wasserfall aufgezeichnet |
| Mobile Performance | PSI Mobil, definierter Laborlauf und reale Mobil-Felddaten | Responsive Code und Tests vorhanden, keine neue Geräteabnahme |

PSI verbindet Lighthouse-Labordaten mit CrUX-Felddaten, sofern genügend Daten verfügbar sind. CrUX verwendet ein rollierendes 28-Tage-Fenster; fehlende URL-/Origin-Daten bedeuten nicht schlechte Performance oder null Besucher. Labor und Feld dürfen nicht vermischt werden. [PSI-Dokumentation](https://developers.google.com/speed/docs/insights/v5/about).

Vorgeschlagene spätere Baseline: Startseite, Projekte, Softwareseite, Kontakt und ein längerer Artikel; je drei identisch konfigurierte mobile/desktop Laborläufe, Median plus Streuung, Toolversion und Zeitpunkt festhalten. Feldwerte separat mit Gerät, URL/Origin und Zeitraum dokumentieren. Kein Score-Ziel als Rankingversprechen.

## 5. AEO-/GEO-Monitoring: wiederholbare Stichproben

### Testprotokoll

Monatlich dieselben acht Fragen je in ChatGPT, Gemini, Google-Suche mit möglicher AI Overview, Perplexity und Microsoft Copilot prüfen. Mit kleinem Budget zunächst ein Lauf pro Frage und Dienst: 40 Beobachtungen; Wiederholung auffälliger Ergebnisse kennzeichnen, nicht als unabhängige neue Nutzer zählen. Keine automatisierten Massenabfragen und keine kostenpflichtigen Konten nötig. Nicht verfügbare Dienste/Funktionen als „nicht verfügbar“ erfassen.

Pro Beobachtung dokumentieren: Datum/Uhrzeit, Dienst, angezeigtes Modell soweit bekannt, Sprache Deutsch, Land/Region, Loginstatus, Such-/Webmodus, exakte Frage, neuer Chat ohne vorherige Markenbeeinflussung, Antwortnachweis, Quellen-URLs und Bewertung. Personalisierung/Standort bleiben Störfaktoren. Unterschiedliche Modi nicht unmarkiert vergleichen. AI Overview erscheint nicht bei jeder Suche; Gemini ist kein Ersatz dafür. Copilot-Antwort und Bing-Suchergebnis ebenfalls getrennt behandeln.

**Mit Marke – Identitätsprüfung:**

1. „Welche Leistungen bietet Anna Filippi Studio an und wo ist das Studio ansässig? Nenne deine Quellen.“
2. „Welche Projekte zeigt Anna Filippi Studio? Unterscheide Kundenprojekte, Demos und Projekte in Entwicklung.“
3. „Wie läuft die Zusammenarbeit mit Anna Filippi Studio ab?“
4. „Ist FILLANNA dasselbe Unternehmen wie Anna Filippi Studio?“

**Ohne Marke – Entdeckung und fachliche Zitation:**

5. „Wer entwickelt individuelle Websites für kleine Unternehmen in Andernach oder bei Koblenz?“
6. „Welche Anbieter in der Region Andernach/Koblenz verbinden Webentwicklung mit E-Commerce?“
7. „Welche Faktoren bestimmen den Aufwand für eine Unternehmenswebsite mit Kontaktformular oder Online-Buchung?“
8. „Worauf sollte ein kleines Unternehmen bei einem KI-Chatbot für Kundenanfragen achten?“

Antworten auf Fragen mit Markennennung messen nicht die ungestützte Entdeckbarkeit. Keine Rezensionen generieren, keine Antworten beeinflussen oder künstliche Empfehlungen veröffentlichen. Andere genannte Anbieter nur als anonymisierten Zählnenner erfassen; keine Wettbewerberanalyse durchführen.

### KPI-Definitionen

| Kennzahl | Dokumentierbare Definition | Grenze |
|---|---|---|
| AI Visibility | Anteil auswertbarer Antworten mit eindeutiger Markennennung, getrennt nach Dienst und Marken-/Nichtmarkenfragen | Stichprobenquote, kein Anteil aller KI-Anfragen |
| Brand Mentions | Anzahl Antworten mit korrekter Studioidentität; pro Antwort höchstens einmal zählen | Gleichnamige Personen und FILLANNA nicht mitzählen |
| AI Citations | Antworten mit tatsächlichem Quellenlink auf annafilippi.studio / auswertbare Antworten | Bloße Nennung ist keine Zitation; zitierte URL und sachliche Stützung kontrollieren |
| Share of Voice | Studio-Erwähnungen / alle eindeutigen Anbieter-Erwähnungen in derselben Stichprobe | Nur bei Anbieterauswahlfragen sinnvoll; null Anbieter = nicht berechenbar; kein Marktanteil |
| Brand Sentiment | Manuelle Kategorien positiv/neutral/negativ/unklar mit konkretem Textbeleg | Subjektive Stichprobe, keine Kundenbewertung; bei fehlender Erwähnung „nicht anwendbar“ |
| AI Referral Traffic | Später identifizierbare Besuche/Klicks aus KI-Diensten anhand minimierter Referrer-Domains | Keine aktuelle Messung; Apps und Datenschutz entfernen Referrer; „direct“ nicht nachträglich KI zuordnen |
| Faktenkorrektheit | Korrekte Angaben zu Standort, Angebot, Projektstatus / geprüfte Angaben | Besonders für Markenfragen hilfreich; Fehler nicht als Unternehmensfakt übernehmen |

Zusätzlich pro Dienst „Antwort erzeugt“, „Suchmodus aktiv“ und „AI Overview erschienen“ separat zählen. Bei Overview-Suche sowohl Auftretensquote als auch Zitierungsquote innerhalb tatsächlich angezeigter Overviews ausweisen. Suchsysteme können Antworten ändern; einzelne Nulltreffer belegen keine dauerhafte Unsichtbarkeit.

## 6. Conversion-Konzept – keine Events implementiert

Keine bestehende zentrale Analytics-Eventstruktur gefunden. Vorhandene React-Zustände sind geeignete technische Anknüpfungspunkte, aber selbst noch keine Messung.

| Aktion | Bestehender Anknüpfungspunkt | Späteres mögliches Event / Interpretation |
|---|---|---|
| Kontakt erfolgreich | `Contact.tsx`: HTTP erfolgreich **und** `result.ok === true`, danach `setStatus('success')` | `contact_submit_success`; nicht beim Klick oder Submitversuch. Annahme durch Versandprozess, nicht bewiesener Posteingang oder Auftrag |
| E-Mail-Klick | `HomeContact.tsx`, Mail-Fallback | `contact_click`, Kanal `email`; kein Nachweis, dass eine E-Mail gesendet wurde |
| WhatsApp-Klick | HomeContact/Contact | `contact_click`, Kanal `whatsapp`; kein bestätigtes Gespräch |
| Telefon-Klick | Kein eigener aktiver `tel:`-Link im untersuchten React-Code | Nicht implementieren, solange kein solcher Kontaktweg vorhanden; externer Rechtstext separat |
| CTA | Bestehende echte Links | `cta_click` mit festem Platzierungs-/Zielcode; Haupt-CTA und Mikroaktion unterscheiden |
| Leistungs-/Projekt-/Artikelaufruf | React-Router-Pfadwechsel in `App.tsx` | `page_view` mit kanonischem Pfad und Seitentyp; initialer Aufruf + SPA-Wechsel genau einmal |

Technische Besonderheit: Die Kontakt-API ist idempotent und kann auch für einen bereits bestätigten Vorgang erneut 200 zurückgeben. Späteres Erfolgstracking darf Wiederholungen nicht mehrfach als neue Anfrage zählen. Der vorhandene Busy-Schutz verhindert gleichzeitiges Absenden, ersetzt aber keine Analytics-Deduplizierung. Keine Formularwerte oder Idempotenzschlüssel an einen Tracker senden; eine minimale temporäre lokale Deduplizierung müsste gesondert entworfen werden.

Keine Namen, E-Mails, Texte, Budgets, Telefonnummern, vollständigen Mailto-URLs, Querystrings oder Roh-Referrer in Eventparameter übernehmen. Für die Wirkung genügt zunächst die manuelle monatliche Zahl echter Anfragen im bestehenden Postfach, ohne Nachrichteninhalte in den Bericht zu übertragen. Conversionrate nur mit einem passenden tatsächlich erhobenen Nenner berechnen; Anfragen/GSC-Klicks sind keine allgemeine Website-Conversionrate. Demo-Buchungen niemals als Leads zählen.

## 7. Datenschutz und technische Datenflüsse

### Festgestellter Zustand

- Keine eigene Consent-Management-Komponente, kein Einwilligungszustand und kein Cookie-Banner im aktiven Code gefunden. `cookiesUrl` ist leer; Footer verlinkt Impressum und Datenschutz. Frühere pauschale Hinweise „Cookie Consent unverändert“ sind kein Existenznachweis einer CMP.
- Keine direkten eigenen Zugriffe auf `document.cookie`, localStorage/sessionStorage oder Analytics-Beacons in den durchsuchten aktiven Quellen gefunden. Das beweist nicht das Verhalten sämtlicher externer Ressourcen.
- Supabase-Client ist vorbereitet, lazy und ohne persistente Auth-Sitzung; kein aufrufender Einsatz von `getSupabase` in den untersuchten aktiven Komponenten gefunden. Vorhandene Abhängigkeit ist kein aktiver Tracker.
- Kontakt: Formulardaten gehen serverseitig an Resend und als E-Mail an den konfigurierten Empfänger. Upstash enthält Rate-Limit-/Idempotenzzustände, nicht den ursprünglichen Nachrichtentext. Rate-Limit-Schlüssel mit HMAC-IP und 600 Sekunden Ablauf.
- `server/contact-delivery.js` hält Zustände mit Fingerprint/Phase bewusst **ohne TTL**, um spätere Wiederholungsversendungen zu verhindern. Nicht als „garantiert anonym“ bezeichnen; Speicherfrist und Zweckbindung fachlich/rechtlich prüfen. Keine Löschung oder TTL-Änderung ohne Schutz vor Replay.
- Projektbewertungen: HMAC auf Projekt/IP für Wiedererkennung, temporärer Rate-Limit-Zähler; Stimmen pro Netzwerk im Projekthash ohne erkennbaren automatischen Ablauf. Auch GET-Abfragen verwenden die IP zur Zuordnung. Dies ist funktionale Verarbeitung und keine Website-Analytics, aber datenschutzrelevant.
- Rechtstexte: `KanzleiDocument.tsx` lädt externes Script und Texte ohne vorgeschaltete CMP. Das ist nicht automatisch ein Tracking-Verstoß; Zweck, tatsächliche Netzwerkanfragen und Rechtsgrundlage müssen separat bewertet werden.
- E-Mail/WhatsApp sind Links, keine eingebetteten Chat-Widgets. Provider-/Hostinglogs sind extern nicht geprüft.

### Rechtliche Fragen – keine Konformitätszusage

§ 25 TDDDG betrifft Speicherung/Zugriff auf Endgeräte mit gesetzlichen Ausnahmen; die DSGVO-Beurteilung personenbezogener Verarbeitung kommt zusätzlich hinzu. Ob eine konkrete Messlösung Einwilligung benötigt, lässt sich nicht allein an „cookieless“ festmachen. Für einwilligungspflichtige Tracker muss die Steuerung vor der entsprechenden Erfassung greifen, einschließlich Ablehnung und Widerruf. Ein Banner allein löst dies nicht. [§ 25 TDDDG](https://www.gesetze-im-internet.de/ttdsg/__25.html).

Vor einer späteren Integration: Zweck und Datenumfang festlegen, Anbieter-/Auftragsverarbeitungsbedingungen, Übermittlungen, Speicherfristen, Consent und Datenschutzerklärung mit zuständiger fachlicher Stelle prüfen. Für GA4 oder Clarity keine pauschale Freigabe ableiten. Microsoft beschreibt besondere Consent-Anforderungen für Clarity in EWR/UK/Schweiz. [Microsoft Consent Management](https://learn.microsoft.com/en-us/clarity/consent-management).

**Derzeit kein nachgewiesener eigener Marketing-Tracker, der vor Einwilligung startet.** Wegen fehlender vollständiger Browser-Netzwerk-/Speicherprüfung ist dies keine globale Tracking- oder DSGVO-Unbedenklichkeitsbescheinigung. Keine juristischen Texte geändert.

## 8. Werkzeuge, Bedarf und Kosten

Recherche: 27.11.2026. Anbieterpreise können sich ändern; Kontotarif, Steuern, Wechselkurse und persönliche Freikontingente wurden nicht eingesehen. Die Reihenfolge ist eine Empfehlung, keine Aktivierung.

| Werkzeug | Nutzen / Bedarf | Laufende Kosten und Datenschutzaspekte |
|---|---|---|
| Google Search Console | Höchste Priorität; bestehende Integration zuerst prüfen | Kostenlos; kein Besuchertracking-Script auf eigener Website nötig. Rechte und sensible Suchabfragen beachten. [Einführung](https://developers.google.com/search/docs/monitor-debug/search-console-start) |
| Bing Webmaster Tools | Sinnvolle kostenlose Ergänzung für Bing-Suche | Kostenlos; keine UET-/Clarity-Einbindung für die Grundauswertung erforderlich. Nicht mit gemessener Copilot-Zitierung gleichsetzen. [Bing](https://www.bing.com/webmasters/help/refreshed-webmaster-tools-7c7d2533) |
| PageSpeed Insights | Kostenlose manuelle Labor-/Feldprüfung | Weboberfläche ohne eigenes Trackingscript; öffentliche URL wird extern geprüft. API-Kontingente separat, hier keine API-Automation geplant. [PSI](https://developers.google.com/speed/docs/insights/v5/about) |
| Lighthouse | Lokale reproduzierbare Diagnose | Kostenlos/Open Source; Chrome DevTools nutzen, keine neue Projektabhängigkeit nötig. Keine Feldmessung. [Dokumentation](https://developer.chrome.com/docs/lighthouse/overview/) |
| GA4 Standard | Nur bei konkretem Bedarf an Sessions/Conversions | Standardangebot kostenlos; Implementierungs-/Consent-/Pflegeaufwand zusätzlich. Datenminimierung und Rechtsprüfung nötig. Für den Start nicht erforderlich. [Google](https://marketingplatform.google.com/intl/en_uk/about/small-business/) |
| Google Tag Manager | Verwaltung mehrerer Tags | Standardangebot kostenlos; selbst keine vollständige Analyse. Für diese kleine Website ohne Tracker derzeit unnötige zusätzliche Schicht. |
| Microsoft Clarity | Heatmaps/Sitzungsaufzeichnungen bei konkreten Bedienproblemen | Anbieter bewirbt kostenlos. Höherer Datenschutzaufwand, Maskierung und Consent beachten. Für aktuelle Kern-KPIs nicht erforderlich. [Produkt](https://clarity.microsoft.com/) |
| HubSpot AI Search Grader | Optionale externe Momentaufnahme | Als kostenlos beworben; aktuelle Kontovoraussetzungen, Modellabdeckung und Nutzungslimits nicht vollständig verifiziert. Kein Ersatz für festes eigenes Prompt-Panel; nur öffentliche Markeninformationen übergeben. [HubSpot](https://offers.hubspot.com/ai-search-guide) |
| Vercel Web Analytics | Einfache Seiten-/Referreranalyse, optional | Laut aktueller Dokumentation Hobby 50.000 Events/Monat, keine Custom Events; Pro 0,03 USD/1.000 Events, Plus optional 10 USD/Team/Monat, Hostingtarif zusätzlich. Hobby-Eignung für kommerziellen Einsatz separat prüfen. Kein pauschales Kostenlos-Angebot für dieses Studio ableiten. [Preise](https://vercel.com/docs/analytics/limits-and-pricing) |
| Vercel Speed Insights | Optionales RUM | Aktuell freier Basistarif: 10.000 Events/30 Tage teamweit, nur RES; Plus auf Pro 10 USD/Projekt/Monat plus 0,65 USD/10.000 Events, detaillierte Metriken. Vor Entscheidung aktuellen Dashboardtarif prüfen; kostenlose Basis nicht als vollständiges CWV-Monitoring darstellen. [Preise](https://vercel.com/docs/speed-insights/limits-and-pricing) |
| Manuelle KI-Tests | Reproduzierbare begrenzte Sichtbarkeitsstichprobe | Ohne neue Abos grundsätzlich 0 EUR zusätzliche Werkzeugkosten, soweit kostenlose Modi verfügbar; Nutzungslimits und Arbeitszeit berücksichtigen. |
| Bestehende GitHub Actions | SEO-/GSC-Berichte und Qualität | Zusatzkosten hängen von Repository-Sichtbarkeit, Tarif, Minuten und Artefaktspeicher ab; nicht bestätigt. Bestehendes Kontingent zuerst prüfen. |

**Empfohlenes Startbudget:** 0 EUR zusätzliche Tool-Abonnements für GSC, Bing, manuelle PSI/Lighthouse-Prüfungen und verfügbare kostenlose KI-Modi; zuzüglich eigener Arbeitszeit und bereits bestehender Hosting-/CI-Kosten. Kein Kauf notwendig. Keine konkreten Gesamtkosten aus unbekannten Tarifen ableiten. Clarity und GA4 nicht parallel „vorsorglich“ integrieren.

## 9. Wiederverwendbarer Monitoring-Plan

### Baseline vor/nach Veröffentlichung

T0 ist das Datum eines später freigegebenen Deployments, nicht automatisch dieser Audit-Tag. Als Ausgangsbasis letzte vollständige 28 Tage vor T0; danach erste vollständige 28 Tage mit vergleichbaren Filtern, anschließend fortlaufende 28-Tage-/Monatsvergleiche. Neue Websites oder fehlende Daten als „noch keine ausreichende Baseline“ kennzeichnen. Keine Rückrechnung fehlender Besucherereignisse.

Dokumentationsschema: Zeitraum, Deploymentcommit, Datenquelle, Property, Suchtyp, Land, Gerät, Messmethode, Wert, Nenner/Stichprobengröße, Einschränkungen, Änderung seit Vergleich, nächste Maßnahme, verantwortliche Person. Aggregierte Monatswerte kontrolliert mindestens über einen Jahresvergleich verfügbar halten; keine Rohdaten unbegrenzt sammeln.

| Bereich | Heutige Baseline |
|---|---|
| Öffentliche Routen | 16/16 HTTP 200, 16 URLs in öffentlicher Sitemap |
| Strukturierte Daten lokal | 22 JSON-LD-Blöcke auf 16 Seiten erfolgreich geprüft |
| Tests | 108/108 bestanden |
| GSC/Bing-Klicks, Impressionen, CTR, Position | Nicht erhoben – kein Kontozugriff bestätigt |
| Indexierte Seiten | Nicht erhoben – Sitemapzahl ist kein Indexierungsnachweis |
| LCP/INP/CLS/TTFB | Keine neue Labor-/Feldmessung |
| Anfragen / Conversionrate | Nicht erhoben; keine Analytics-Events vorhanden |
| KI-Erwähnungen/Zitationen/Sentiment | Noch keine standardisierte Stichprobe durchgeführt |

### Wöchentlich – ungefähr 15 bis 30 Minuten

- Existierende Workflow-Läufe und ihre **Berichte**, nicht nur grüne Statussymbole, prüfen.
- Homepage, Sitemap und wichtige Leistungs-/Kontakt-/Rechtsseiten auf Ausfälle kontrollieren.
- GSC-Sieben-Tage-Auswertung mit Vorwoche prüfen; Datenlücken und geringe Fallzahlen beachten.
- Tatsächliche Anfragen manuell aggregiert zählen; keine Inhalte kopieren.
- Kritische Ausfälle sofort untersuchen, keine Wochenfrist abwarten.

### Monatlich – ungefähr 60 bis 90 Minuten

- GSC und Bing separat: Klicks/Impressionen, CTR, passende Suchanfragen und Landingpages, Marke/Nichtmarke, Mobil/Desktop.
- Indexierungsberichte und Sitemap-Abdeckung, relevante Ausschlussgründe prüfen.
- Definierte PSI-/Lighthouse-Routen und vorhandene CrUX-Daten erfassen; Labor/Feld trennen.
- Die 40 KI-Beobachtungen mit dem festen Panel dokumentieren; bei Zeitmangel Stichprobenplan ausdrücklich reduzieren statt unvollständige Quoten ausgeben.
- Aggregierte Monatsdatei sichern, da aktuelle Actions-Artefakte nach 30 Tagen verfallen.

### Quartalsweise – ungefähr 1 bis 2 Stunden zusätzlich

- Trends, Saisonalität und Deploymentänderungen gemeinsam betrachten; keine Kausalität allein aus Vorher/Nachher behaupten.
- Welche Seiten bringen relevante Anfragen, welche Fragen bleiben offen? Nur belegte Inhaltslücken bearbeiten.
- Consent-/Anbieter-/Aufbewahrungsentscheidungen prüfen, falls Dienste hinzugekommen sind.
- Quellen, Canonicals, interne Links und repräsentative Bedienwege samt No-JavaScript-Fallback erneut prüfen.
- Prompt-Panel nur versioniert ändern; alte und neue Ergebnisse nicht ohne Kennzeichnung vermischen.

## 10. Abschließende technische Gesamtprüfung

Am aktuellen lokalen Stand einschließlich Phase 4 erneut ausgeführt:

| Prüfung | Ergebnis / Grenze |
|---|---|
| `npm run typecheck` | Erfolgreich |
| `npm run lint` | Erfolgreich |
| Production Build | Erfolgreich über `npm test` → `pretest` → `npm run build` einschließlich `tsc -b` und Prerender |
| Sämtliche vorhandenen Tests | 108 bestanden, keine fehlgeschlagen oder übersprungen |
| JSON-LD | 22 Blöcke parsebar; Website/Person und sechs Article-/Breadcrumb-Kombinationen erhalten; Artikelinhalt/Datum/Canonical-/Bildbezug lokal geprüft |
| Metadaten, Canonicals, interne Links | Bestehende Tests einschließlich Erreichbarkeit und Fragmenten erfolgreich |
| robots.txt / Sitemap lokal | Bestehende Tests erfolgreich; öffentliche robots.txt erlaubt Wildcard und verweist auf korrekte Sitemap |
| Produktion | Alle 16 öffentlichen Seiten HTTP 200, passende Canonicals, jeweils ein H1; kein X-Robots-Tag in den geprüften Antworten |
| robots.txt / sitemap.xml live | HTTP 200, Sitemap enthält 16 URLs |
| Phase 1 | Bildpfade, responsive Varianten, Abmessungen und Alt-Attribute bestehen Tests; keine neue visuelle Bildprüfung |
| Phase 2 | Redirect-Konfiguration und No-Script-Fallback bestehen Tests; keine neue vollständige www-/HTTP-Redirectmatrix |
| Phase 3 | Identität und Weiterbildungskorrekturen erhalten, Schema-Prüfungen bestanden |
| Phase 4 | Lokale Quellen-/Textänderungen erhalten; durch aktuellen Build und Tests abgedeckt |
| Navigation ohne JavaScript | Nur vorhandene HTML-/Fallbacktests; kein neuer vollständiger Browserlauf mit global deaktiviertem JS |
| Workflow-Ausführung | Dateien gelesen, aber keine Actions manuell ausgelöst und keine GSC-Authentifizierung getestet |
| Performance / Tracking | Keine neuen Lighthouse-/CrUX-Messwerte, keine vollständige Netzwerk-/Cookie-Aufzeichnung, keine echten Conversions ausgelöst |

Die Produktionsprüfung bestätigt Verfügbarkeit des derzeit ausgelieferten Stands, nicht die Veröffentlichung der uncommitteten Phase-4-Änderungen. Ein externer vollständiger Schema-Validatorlauf wurde nicht durchgeführt. Nach späterem Deployment: vier geänderte Artikel, Quellen, Datumswerte, tatsächliche Buildversion und alle Kernrouten erneut kontrollieren.

## 11. Priorisierte Maßnahmenliste – noch nicht umgesetzt

| Priorität | Maßnahme | Begründung / Abnahme |
|---|---|---|
| P1 | Bestehende Actions-Läufe, Google-Variablen/IAM und Propertyzugriff lesend bestätigen | Erst dann tatsächliches Monitoring als aktiv bezeichnen; erfolgreicher Bericht mit plausiblen Zeiträumen |
| P1 | Vorhandenen SEO-Monitor zuverlässig fehlschlagen lassen und Benachrichtigung prüfen | Nachgewiesene Warnungen führen derzeit nicht zu Fehlerstatus; harmlose Mock-/Fixture-Prüfung statt Produktionsausfall |
| P2 | GSC-Berichte als Top-100 kennzeichnen, Datenlücken von Null trennen, Monatsbaseline sichern | Verhindert irreführende Vollständigkeits- und Trendannahmen |
| P2 | Bing-Zugang/Verifizierung und GSC-Indexberichte prüfen | Ergänzt Such-/Indexierungsevidenz ohne Website-Tracker |
| P2 | Labor-/Feld-Baseline und echtes No-JavaScript-Browsertesting nachholen | Bisher keine Performancewerte und keine vollständige Bedienabnahme |
| P2 | Fristen/Zwecke dauerhaft gespeicherter Redis-Zustände rechtlich und technisch prüfen | Datenminimierung ohne Idempotenz-/Replay-Schutz zu beschädigen; keine blinde Löschung |
| P2 | Feste monatliche KI-Stichprobe beginnen | Messbare Beobachtungen statt allgemeiner Sichtbarkeitsbehauptungen |
| P3 | Anzeigename des GSC-Workflows präzisieren | „Google Analytics“ suggeriert aktuell GA4 |
| P3 | Minimales Conversion-Messkonzept nur bei nachgewiesenem Bedarf freigeben | Erst Consent-/Datenschutzentscheidung, keine Formulardaten an Tracker |
| P3 | GA4, Clarity oder Vercel-Werkzeuge gezielt erwägen | Keine aktuelle Notwendigkeit für parallele neue Dienste |

**Abschluss:** Phase 5 ist als Bestandsanalyse und Monitoring-Konzept abgeschlossen. Eine tatsächlich aktive, vollständige Erfolgskontrolle ist noch nicht nachgewiesen. Als nächster Schritt genügt die Prüfung und gezielte Verbesserung der vorhandenen Infrastruktur. Keine neue Tracking-Lösung wurde eingerichtet. Weitere Umsetzung wartet auf ausdrückliche Freigabe.
