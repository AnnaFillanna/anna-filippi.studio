# ANNA FILIPPI — Digital Atelier

Direkt im bestehenden Ordner `/Users/annafilippi/ANNA FILIPPI` umgesetzt. Enthalten sind ausschließlich Header, Hero und DIGITAL / VISUAL.

## Start

Node.js 22.12 oder neuer empfohlen. Abhängigkeiten sind bereits installiert.

```sh
cd "/Users/annafilippi/ANNA FILIPPI"
npm run dev
```

Vorschau: http://127.0.0.1:5173/

```sh
npm ci           # Abhängigkeiten auf einem anderen Rechner installieren
npm run build    # TypeScript prüfen und Produktionsversion bauen
npm run preview  # Produktionsversion lokal ansehen
```

## Aufbau

- `src/components/Header/`: AF-Monogramm, Navigation, mobiles Menü.
- `src/components/Hero/`: Originalporträt, Titel, dezente Motion-Animation und Parallax.
- `src/components/Services/`: zwei gleich breite, direkt angrenzende Leistungsbereiche.
- `src/styles/variables.scss`: Farben und Schriftfamilien.
- `src/styles/globals.scss`: Grundgestaltung und Fokuszustände.
- `src/App.tsx`: Komposition und vorläufige Hinweisdialoge.

Jede Komponente verwendet ein eigenes SCSS Module. Cormorant Garamond und Montserrat werden mit den npm-Paketen lokal ausgeliefert; keine externen Schriftanfragen.

## Bilder und Inhalt

`public/images/anna-original.jpg` ist eine byteidentische Kopie des bereitgestellten Porträts. Keine Retusche, Farbkorrektur oder Neukomprimierung. Responsive Bildausschnitte entstehen ausschließlich durch CSS `object-fit` und `object-position`; das Gesicht bleibt unverändert. Das Original hat 1280 × 445 Pixel und ca. 109 KB.

Laptop und Blume wurden mit dem integrierten ImageGen erzeugt und als optimierte JPEGs gespeichert. Details und Prompts stehen in `ASSETS.md`. Das separate Referenzbild für DIGITAL / VISUAL war nicht angehängt, deshalb wurde dieser Bereich anhand der schriftlichen Beschreibung gestaltet.

Die drei Hero-Leistungszeilen sind gemäß der Vorgabe einer deutschen Website übersetzt. DIGITAL, VISUAL und Digital Atelier bleiben erhalten.

Über mich, Projekte und Kontakt sind noch keine eigenen Abschnitte. Ihre Bedienelemente öffnen zugängliche Hinweise zum aktuellen Stand; es werden keine Kontaktadressen erfunden und keine Nachrichten versendet. Die Hinweise können später durch echte Ziele ersetzt werden.

## Zugänglichkeit

Semantische Bereiche, Skip-Link, sichtbarer Tastaturfokus, Bildbeschreibungen, Menüstatus mit `aria-expanded`, Escape-Unterstützung und native modale Dialoge. Motion respektiert `prefers-reduced-motion`; Parallax und CSS-Bewegungen werden bei dieser Einstellung deaktiviert.

## Prüfung

TypeScript und Vite-Produktionsbuild; Desktop- und 390-Pixel-Mobilansicht; Bildladezustände, keine horizontale Überbreite auf Mobilgeräten; Menü und Kontakt-Hinweis einschließlich Escape.
