# Wissen & Insights

Die Übersicht unter `/insights` zeigt ausschließlich Artikel aus `publishedInsights` in [insights.ts](../src/data/insights.ts). Die Artikel zu Website-Kosten, zum Vergleich von Agentur und Freelancer, zu SEO und AEO, E-Commerce, KI und Automatisierung sowie Produktfotografie sind für die Veröffentlichung freigegeben. Die folgenden weiteren Themen sind nur eine redaktionelle Planung und erzeugen weder öffentliche Seiten noch Sitemap-Einträge:

1. Website für Selbstständige und kleine Unternehmen
2. Website-Baukasten oder individuelles Webdesign?
3. Online-Terminbuchung für Friseure und Studios
4. Shopify oder individuell entwickelter Online-Shop?
5. KI-Chatbots für Kundenanfragen
6. Website-Relaunch: Wann lohnt sich eine Modernisierung?

## Einen Artikel veröffentlichen

1. Den Inhalt zunächst außerhalb von `publishedInsights` erstellen, fachlich und redaktionell prüfen und ausdrücklich zur Veröffentlichung freigeben. Entwürfe und sensible Notizen nicht in öffentlich ausgelieferte Dateien aufnehmen.
2. In [insights.ts](../src/data/insights.ts) einen vollständigen `InsightArticle` in `publishedInsights` ergänzen: eindeutiger kleingeschriebener Slug mit Bindestrichen, Titel, Kurzbeschreibung, individuelle Meta-Angaben, eine der vorhandenen Kategorien, Autorin Anna Filippi, echte Daten im Format `YYYY-MM-DD` und realistische Lesezeit.
3. Ein passendes, berechtigtes Bild unter `public/images/` ablegen. Lokalen JPEG-Bildpfad, sachlichen Alt-Text und tatsächliche Pixelmaße eintragen. Für eine optimierte WebP-Kopie mit gleichen Pixelmaßen kann zusätzlich `webpSrc` angegeben werden; der Browser nutzt sie nach Möglichkeit, während JPEG als Fallback und Open-Graph-Bild dient. Die Anzeige verwendet ein einheitliches Seitenverhältnis von 3:2 und kann Bilder beschneiden. Keine erfundenen Bilder oder Quellen verwenden.
4. Zentrale Frage und direkte Antwort, Abschnitte mit eindeutigen IDs und Blöcken (`paragraph`, `subheading`, `example`, `list`, `table`), relevante FAQs, überprüfte HTTPS-Quellen, interne Links und CTA ergänzen. Optional kann `closing` einen abschließenden Text und `cta.text` eine kurze Einladung vor dem Kontaktlink enthalten. `relatedSlugs` enthält Slugs anderer veröffentlichter Artikel; nicht veröffentlichte Verweise werden nicht angezeigt. Tabellen benötigen passende Spaltenüberschriften und Zeilen.
5. `npm run typecheck`, `npm run lint` und `npm test` ausführen. Der Build erstellt für jeden veröffentlichten Artikel `/insights/<slug>/index.html`, individuelle Meta-Tags, Open Graph, Article und BreadcrumbList als JSON-LD sowie einen Sitemap-Eintrag. Der Build prüft Bilddateien und grundlegende Artikelangaben. Qualität, Bildrechte, Fakten und tatsächliche Daten weiterhin manuell prüfen.
6. Auf Desktop und Mobilgeräten Inhaltsverzeichnis, interne Links, Filter, Quellen, Tabellen und Darstellung prüfen. Vercels Rewrite für `/insights/:slug` führt nur zu vorhandenen statischen Artikelseiten; unbekannte oder unveröffentlichte Slugs müssen im Deployment mit HTTP 404 beantwortet werden. Vor Veröffentlichung in einer geeigneten Vorschau überprüfen. Der Quellstand der Sitemap enthält die festen Seiten; die ausgelieferte `dist/sitemap.xml` wird beim Build aus allen veröffentlichten Routen erzeugt.

Ein nachträgliches Entfernen eines veröffentlichten Beitrags löscht seine generierte Seite und den Sitemap-Eintrag beim nächsten Build. Falls die URL bereits indexiert wurde, muss die Suchmaschine die 404-Antwort erneut abrufen.
