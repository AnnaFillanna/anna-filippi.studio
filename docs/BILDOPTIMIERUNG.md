# Bildoptimierung – Phase 1

Abschlussprüfung: 26.11.2026. Der aktuelle Projektstand enthält die Bildoptimierung bereits im Git-Verlauf. In diesem Abschluss wurden keine Commits, Pushes oder Deployments ausgeführt. Neuere Inhalte wurden nicht zurückgesetzt.

## Ergebnis

54 Originalquellen im responsiven Manifest. Vergleich: je Originaldatei gegen genau eine größte angebotene Variante: **43.65 MB → 8.99 MB**, Einsparung **34.66 MB (79.4 %)**. Dies ist eine Asset-Summenbetrachtung, keine gemessene Seitenladegröße. Kleinere Viewports wählen kleinere Varianten. Originale bleiben als Fallback erhalten; die Repository-Größe sinkt daher nicht.

## Umsetzung

- WebP-Varianten bis 1920 px, ohne Hochskalierung; Fotografien Qualität 92, Projektscreenshots und bestehende WebP-Quellen verlustfrei kodiert.
- Seitenverhältnisse, Transparenz und vorhandene ICC-Profile bleiben erhalten. Keine neuen Bildausschnitte.
- Gemeinsame Bildattribute aus `src/data/responsiveImage.ts` und `image-variants.json`: srcset, sizes, tatsächliche Breite/Höhe; Original als Fallback.
- Hero erhält weiterhin hohe Ladepriorität und kein Lazy Loading. Bilder unterhalb des sichtbaren Bereichs behalten Lazy Loading. Dekorative Bilder behalten leere, inhaltliche Bilder beschreibende Alt-Texte.
- Betroffene Komponenten: App, Hero (einschließlich SCSS-Bildpfaden), Footer, About, AboutPage, Projects, FeaturedProjects, Gallery einschließlich Großansicht.
- Reproduzierbare Erzeugung: `scripts/optimize-images.py`, benötigt Pillow mit WebP-Unterstützung außerhalb der Anwendungsabhängigkeiten. Keine zusätzlichen npm-Abhängigkeiten.
- Pfad-, Größen-, Seitenverhältnis- und Prerender-Prüfungen in `tests/responsive-images.test.mjs`.

## Prüfung

- `npm run typecheck`: erfolgreich.
- `npm run lint`: erfolgreich.
- `npm test` einschließlich Production Build: 104 Tests erfolgreich, keine Fehler.
- Desktop 1440 × 1000: VELORA-Desktop- und Mobilbild vollständig geladen.
- Mobil 390 × 844: Galerie, Öffnen/Weiterblättern/Schließen der Großansicht und Kategorienwechsel geprüft; kein horizontales Überlaufen.
- In der vorausgehenden Bildprüfung: repräsentativer Vorher-Nachher-Vergleich von Hero, Fotografie, Projekten, Softwareentwicklung und Über mich; Bildgeometrie unverändert. Seitdem ergänzte redaktionelle Änderungen gehören nicht zu diesem Vergleich.
- Keine vollständige Geräte-/Browsermatrix, kein gemessener Produktions-LCP oder Feld-CWV-Nachweis. Eine Verbesserung konkreter CWV-Werte wird nicht behauptet.

## Qualitätsbedingte Ausnahmen

Einige größte Fotovarianten überschreiten 500 KB. Detailtreue hat hier Vorrang; kleinere Varianten liegen darunter. Keine pauschale Kompression aller Produktfotos auf eine feste Dateigröße.

- `/images/gallery-fillianna.jpg`: 1083.4 KB (größte Variante).
- `/images/portfolio/DSC08033 (1).jpg`: 550.2 KB (größte Variante).
- `/images/portfolio/hvo8v6 (1).jpg`: 1122.6 KB (größte Variante).

## Vollständige Vorher-Nachher-Tabelle des Manifests

KB = 1000 Bytes. „640“ ist die erste Variante ab 640 px, bei kleinen Originalen die größte verfügbare. Tatsächliche Auswahl hängt von Layout und Pixeldichte ab.

| Quelle | Format / Auflösung | Original KB | größte Variante KB | 640-Klasse KB | Ersparnis größte |
|---|---|---:|---:|---:|---:|
| /images/about-anna-red.jpg | JPEG 993×1600 | 344.4 | 165.7 | 94.6 | 51.9 % |
| /images/anna-laptop-mask-alpha.png | PNG 853×1280 | 36.9 | 36.9 | 36.9 | 0.0 % |
| /images/anna-laptop-original.jpg | JPEG 853×1280 | 109.4 | 58.1 | 39.6 | 46.9 % |
| /images/footer-orchid-mobile.png | PNG 1536×1024 | 1800.9 | 190.4 | 60.4 | 89.4 % |
| /images/footer.png | PNG 1456×816 | 1215.8 | 57.7 | 15.6 | 95.3 % |
| /images/gallery-fillianna.jpg | JPEG 1867×2333 | 3488.8 | 1083.4 | 166.9 | 68.9 % |
| /images/hero-sunlight.jpg | JPEG 1672×941 | 307.7 | 200.0 | 27.0 | 35.0 % |
| /images/portfolio/2693f2d7f91be0e7ac84b42eb9e2b53a.jpg | JPEG 1200×1600 | 221.2 | 221.2 | 133.9 | 0.0 % |
| /images/portfolio/5B9C7EA2-E3D3-47A7-8195-F0D46150D883_e9f4f705-e388-4e4e-98eb-b104fd968e5c (1).png | PNG 1024×1536 | 515.5 | 94.8 | 40.5 | 81.6 % |
| /images/portfolio/610974098_17870155233506883_7656635994878217710_n (2).jpg | JPEG 1372×1715 | 1404.6 | 237.2 | 79.2 | 83.1 % |
| /images/portfolio/ChatGPTImage28.Dez.2025_13_52_30.png | PNG 1134×1418 | 492.5 | 66.0 | 28.2 | 86.6 % |
| /images/portfolio/ChatGPTImage28.Dez.2025_14_12_13.png | PNG 758×947 | 303.6 | 28.6 | 22.9 | 90.6 % |
| /images/portfolio/DSC08033 (1).jpg | JPEG 2274×3185 | 1153.4 | 550.2 | 72.9 | 52.3 % |
| /images/portfolio/Ohringe_1_1.jpg | JPEG 3303×4128 | 3460.4 | 239.9 | 31.5 | 93.1 % |
| /images/portfolio/anna-filippi-1.jpg | JPEG 1023×1280 | 277.9 | 222.2 | 112.3 | 20.0 % |
| /images/portfolio/anna-filippi-10.jpg | JPEG 960×1280 | 191.4 | 133.5 | 78.3 | 30.3 % |
| /images/portfolio/anna-filippi-11.jpg | JPEG 1066×1600 | 290.2 | 127.4 | 59.9 | 56.1 % |
| /images/portfolio/anna-filippi-12.jpg | JPEG 1066×1600 | 391.3 | 211.7 | 102.3 | 45.9 % |
| /images/portfolio/anna-filippi-13.jpg | JPEG 1142×1600 | 527.8 | 303.1 | 126.7 | 42.6 % |
| /images/portfolio/anna-filippi-14.jpg | JPEG 1066×1600 | 331.9 | 150.6 | 79.7 | 54.6 % |
| /images/portfolio/anna-filippi-15.jpg | JPEG 1143×1600 | 562.6 | 348.1 | 130.7 | 38.1 % |
| /images/portfolio/anna-filippi-16.jpg | JPEG 1143×1600 | 275.8 | 122.9 | 49.2 | 55.5 % |
| /images/portfolio/anna-filippi-17.jpg | JPEG 1067×1600 | 235.7 | 108.5 | 50.3 | 54.0 % |
| /images/portfolio/anna-filippi-18.jpg | JPEG 1200×1600 | 297.2 | 107.3 | 39.0 | 63.9 % |
| /images/portfolio/anna-filippi-2.jpg | JPEG 853×1280 | 136.6 | 90.3 | 61.0 | 33.9 % |
| /images/portfolio/anna-filippi-3.jpg | JPEG 953×1191 | 43.7 | 21.8 | 13.1 | 50.0 % |
| /images/portfolio/anna-filippi-4.jpg | JPEG 1023×1280 | 54.4 | 28.7 | 15.3 | 47.2 % |
| /images/portfolio/anna-filippi-5.jpg | JPEG 914×1280 | 139.8 | 92.7 | 55.1 | 33.7 % |
| /images/portfolio/anna-filippi-6.jpg | JPEG 1023×1280 | 314.5 | 272.6 | 141.6 | 13.3 % |
| /images/portfolio/anna-filippi-7.jpg | JPEG 720×1280 | 255.4 | 232.8 | 186.4 | 8.8 % |
| /images/portfolio/anna-filippi-8-chain.webp | WEBP 1346×1683 | 48.6 | 48.6 | 71.4 | 0.0 % |
| /images/portfolio/anna-filippi-9.jpg | JPEG 849×1280 | 37.9 | 16.9 | 11.1 | 55.3 % |
| /images/portfolio/asdf (1).png | PNG 1068×1335 | 578.8 | 34.4 | 16.9 | 94.1 % |
| /images/portfolio/bcizrs (1).png | PNG 1476×2066 | 15137.4 | 484.1 | 122.6 | 96.8 % |
| /images/portfolio/dgft (1).png | PNG 1024×1281 | 652.4 | 50.2 | 25.1 | 92.3 % |
| /images/portfolio/hsgdf (1).png | PNG 950×1424 | 400.4 | 34.7 | 20.2 | 91.3 % |
| /images/portfolio/hvo8v6 (1).jpg | JPEG 2175×3046 | 2091.6 | 1122.6 | 175.8 | 46.3 % |
| /images/portfolio/juhz (1).png | PNG 1016×1270 | 265.5 | 21.3 | 11.5 | 92.0 % |
| /images/portfolio/lkjh (1).png | PNG 980×1225 | 360.2 | 26.4 | 14.9 | 92.7 % |
| /images/portfolio/losder2.png.jpg | JPEG 1121×1401 | 132.1 | 54.1 | 24.4 | 59.0 % |
| /images/portfolio/oelkj.png | PNG 2009×2812 | 3109.0 | 287.8 | 44.6 | 90.7 % |
| /images/portfolio/qwret (1).png | PNG 1158×1448 | 232.3 | 37.1 | 16.2 | 84.0 % |
| /images/portfolio/zhdeg (1).png | PNG 1024×1536 | 452.3 | 105.1 | 50.5 | 76.8 % |
| /images/projects/dana-desktop.png | JPEG 1440×900 | 70.3 | 70.3 | 93.0 | 0.0 % |
| /images/projects/dana-mobile.png | JPEG 390×844 | 28.8 | 28.8 | 28.8 | 0.0 % |
| /images/projects/fillicat-desktop.png | JPEG 1440×900 | 72.0 | 72.0 | 54.5 | 0.0 % |
| /images/projects/fillicat-mobile.png | JPEG 390×844 | 36.4 | 36.4 | 36.4 | 0.0 % |
| /images/projects/kavro-desktop.png | PNG 1080×1084 | 214.7 | 108.3 | 65.6 | 49.6 % |
| /images/projects/kavro-mobile.jpg | JPEG 768×1152 | 114.2 | 114.2 | 169.9 | 0.0 % |
| /images/projects/mamma-mia-desktop.jpg | JPEG 1440×900 | 124.1 | 124.1 | 134.6 | 0.0 % |
| /images/projects/mamma-mia-mobile.jpg | JPEG 390×844 | 57.9 | 57.9 | 57.9 | 0.0 % |
| /images/projects/velora-desktop.jpg | JPEG 1440×900 | 127.1 | 127.1 | 75.2 | 0.0 % |
| /images/projects/velora-mobile.png | JPEG 390×844 | 43.8 | 43.8 | 43.8 | 0.0 % |
| /images/projects/velora-tablet-current.png | JPEG 768×1024 | 79.0 | 79.0 | 231.6 | 0.0 % |

## Weitere Rasterdateien im aktuellen Projekt

Dateien außerhalb des responsiven Manifests, einschließlich später ergänzter Artikelbilder und möglicher ungenutzter Originale. Nicht automatisch löschen: Nutzung kann dynamisch oder extern erfolgen. Bereits kleine WebP-Dateien benötigen keine erneute verlustbehaftete Kodierung.

| Datei | Format | Auflösung | KB |
|---|---|---|---:|
| /images/about-anna.jpg | PNG | 706×1132 | 1391.0 |
| /images/anna-laptop-mask.png | PNG | 853×1280 | 61.6 |
| /images/flower.jpg | JPEG | 1400×933 | 217.7 |
| /images/footer-flower-transparent.png | PNG | 1676×938 | 808.8 |
| /images/gallery-calla.jpg | JPEG | 896×1600 | 335.2 |
| /images/gallery-heart-necklace.png | PNG | 1536×1024 | 2187.0 |
| /images/hero-atelier.png | PNG | 1672×941 | 1650.9 |
| /images/hero-fabric-extension.png | PNG | 2172×724 | 1552.5 |
| /images/hero-reference.png | PNG | 1672×941 | 1875.6 |
| /images/hero-sunlight.png | PNG | 1672×941 | 2215.2 |
| /images/insights/agentur-freelancer-arbeitsplatz.jpg | JPEG | 1365×768 | 233.5 |
| /images/insights/agentur-freelancer-arbeitsplatz.webp | WEBP | 1365×768 | 78.9 |
| /images/insights/e-commerce-arbeitsplatz.jpg | JPEG | 1151×768 | 234.5 |
| /images/insights/e-commerce-arbeitsplatz.webp | WEBP | 1151×768 | 120.0 |
| /images/insights/ki-automatisierung-roboter.jpg | JPEG | 1024×768 | 92.4 |
| /images/insights/ki-automatisierung-roboter.webp | WEBP | 1024×768 | 32.1 |
| /images/insights/produktfotografie-granatapfel.jpg | JPEG | 1152×768 | 276.2 |
| /images/insights/produktfotografie-granatapfel.webp | WEBP | 1152×768 | 185.3 |
| /images/insights/seo-aeo-lupe.jpg | JPEG | 1152×768 | 50.6 |
| /images/insights/seo-aeo-lupe.webp | WEBP | 1152×768 | 17.5 |
| /images/insights/website-kosten-arbeitsplatz.jpg | JPEG | 1152×768 | 205.9 |
| /images/insights/website-kosten-arbeitsplatz.webp | WEBP | 1152×768 | 104.1 |
| /images/laptop.jpg | JPEG | 1400×933 | 164.3 |
| /images/portfolio/237_7377b7bf-af9f-4896-a897-13ca93a6ef8b.png | PNG | 2152×3313 | 3373.8 |
| /images/portfolio/A6705381_11b96729-6ce3-4849-bb21-ecea410df535.png | PNG | 1555×1944 | 4454.2 |
| /images/portfolio/anna-filippi-8.jpg | JPEG | 1280×853 | 133.7 |
| /images/portfolio/fgrtd (1).png | PNG | 1110×1389 | 253.2 |
| /images/portfolio/hzgthg (1).png | PNG | 1160×1450 | 485.6 |
| /images/portfolio/oeplo.png | PNG | 969×1211 | 336.1 |
| /images/portfolio/white (1).png | PNG | 1500×1875 | 518.2 |
| /images/projects/dana.png | JPEG | 520×514 | 26.9 |
| /images/projects/fillicat.png | JPEG | 520×570 | 26.4 |
| /images/projects/velora-mobile.jpg | JPEG | 390×844 | 27.1 |
