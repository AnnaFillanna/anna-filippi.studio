# Anna Filippi — Digital Atelier

Mein digitales Studio für Webdesign und Webentwicklung, Software, E-Commerce, SEO, KI-Lösungen und digitale Marktanalysen. Die Website verbindet Kundenprojekte, interaktive Demos und redaktionelle Inhalte mit einem Kontaktformular für Projektanfragen.

**[Website ansehen](https://annafilippi.studio/)**

<p align="center">
  <img src="docs/screenshots/desktop.png" alt="Anna Filippi Studio – Desktop-Ansicht" width="72%" />
  &nbsp;
  <img src="docs/screenshots/mobile.png" alt="Anna Filippi Studio – mobile Ansicht" width="23%" />
</p>

## Funktionen

- Eigene Seiten für Webentwicklung, Software, Projekte, Über mich und Kontakt
- Projektpräsentationen und interaktive Buchungsdemo
- Kontaktformular mit serverseitiger Prüfung und Schutz vor mehrfacher Übermittlung
- Projektbewertungen mit gemeinsamem Zustand für wiederholte Projektkarten
- Responsive Navigation, Tastaturbedienung und Reduced-Motion-Unterstützung

## Technische Entscheidungen

- **Vorgerenderte Seiten:** Der Build rendert die React-Komponenten für jede Route als HTML, ergänzt Metadaten und erstellt die Sitemap. Inhalte stehen dadurch schon vor dem Start von JavaScript bereit. → [Build-Skript](scripts/build.mjs)
- **Kontaktanfragen:** Eine wiederholte Anfrage verwendet denselben Idempotenzschlüssel. Resend übernimmt den E-Mail-Versand, Redis schützt Wiederholungen. Kontaktanfragen werden nicht mehr in Supabase gespeichert; ein pausiertes Supabase-Projekt blockiert den Versand nicht. → [Kontaktverarbeitung](server/contact-delivery.js)
- **Projektbewertungen:** Ein gemeinsamer Store bündelt Leseanfragen und aktualisiert mehrere Ansichten desselben Projekts. Fehlgeschlagene Antworten werden als Fehler angezeigt. → [ratingsStore.ts](src/components/ProjectRating/ratingsStore.ts)

## Tech Stack

React · TypeScript · React Router · SCSS Modules · Vite · Motion · Supabase · Redis · Resend

Schriftarten werden lokal ausgeliefert. Bildquellen und Generierungsbriefings stehen in [ASSETS.md](ASSETS.md).

## Lokal starten

Node.js 22.12 oder neuer. Im Projektverzeichnis:

```bash
npm ci
npm run dev
```

Die Oberfläche läuft lokal ohne Produktionszugänge. Kontaktversand, Bewertungen und Rechtstext-Schnittstelle benötigen eigene Serverkonfiguration; Vite allein stellt diese APIs nicht bereit. Zugangsdaten gehören ausschließlich in Umgebungsvariablen.

## Prüfungen

```bash
npm run lint
npm test
```

`npm test` erstellt zuerst den TypeScript- und Produktionsbuild und führt anschließend alle vorhandenen Tests aus. Geprüft werden unter anderem gerenderte Routen, Kontaktverarbeitung, Fehlerfälle und Bewertungen. API-Tests verwenden simulierte Dienste. GitHub Actions führt die Prüfungen bei Änderungen an `main` und Pull Requests aus.

Weitere Details: [Kontakt-Setup](docs/KONTAKT-RESEND.md) · [Supabase](docs/SUPABASE.md) · [Projektbewertungen](docs/PROJECT-RATINGS.md)

Die erforderlichen Kontakt-Variablen und Hinweise zur Umstellung stehen im [aktuellen Kontakt-Setup](docs/KONTAKT-RESEND.md). Der vorhandene allgemeine Supabase-Client bleibt unverändert; der Kontaktprozess verwendet ihn nicht.
