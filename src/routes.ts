export const origin = 'https://annafilippi.studio';
export const pages = {
  '/': {
    title: 'Webdesign für kleine Unternehmen in Andernach | Anna Filippi',
    description: 'Website erstellen lassen in Andernach bei Koblenz: Webdesign für Selbstständige und kleine Unternehmen, Website-Relaunch und Online-Shops. Persönlich betreut.',
  },
  '/ueber-mich': {
    title: 'Über mich — Anna Filippi | Webentwicklung & Fotografie',
    description: 'Lerne Anna Filippi kennen: moderne Websites, digitale Ideen und Begeisterung für KI, Design und Schmuckfotografie. Persönlich, kreativ und mit Liebe zum Detail.',
  },
  '/projekte': {
    title: 'Web & Software – Projekte | Anna Filippi',
    description: 'Webprojekte von Anna Filippi: Dana Tattoo Studio als Kundenprojekt, die Demos Mamma Mia, KAVRO und VELORA sowie die eigene Lernplattform FilliCat.',
  },
  '/softwareentwicklung': {
    title: 'Individuelle Webanwendungen entwickeln lassen | Anna Filippi',
    description: 'Individuelle Webanwendungen, Kontaktformulare und Online-Terminbuchung für deine Website. Entwicklung aus Andernach bei Koblenz. Entdecke Projekte und Demos.',
  },
  '/dana-tattoo-studio': {
    title: 'Website für ein Tattoo-Studio in Andernach | Anna Filippi',
    description: 'Webdesign für Dana Tattoo Studio in Andernach: responsive Website mit Tattoo- und Piercing-Galerien und WhatsApp-Kontakt. Kundenprojekt von Anna Filippi.',
  },
  '/fotografie': {
    title: 'Schmuckfotografie für Onlineshops | Anna Filippi Andernach',
    description: 'Produkt- und Schmuckfotografie für Onlineshops und Websites: klare Produktaufnahmen und kreative Inszenierungen von Anna Filippi aus Andernach bei Koblenz.',
  },
  '/kontakt': { title: 'Kontakt — Anna Filippi Studio', description: 'Erzähl mir von deiner Idee. Gemeinsam setzen wir dein Projekt um – persönlich und mit Liebe zum Detail.' },
  '/impressum': { title: 'Impressum — Anna Filippi', description: 'Impressum von Anna Filippi Studio in Andernach: Anbieterkennzeichnung und Kontaktdaten.' },
  '/datenschutz': { title: 'Datenschutzerklärung — Anna Filippi', description: 'Datenschutzerklärung für annafilippi.studio: Informationen zur Verarbeitung personenbezogener Daten und zu deinen Rechten.' },
} as const;
export type PagePath = keyof typeof pages;

export function pageForPath(pathname: string): PagePath {
  const path = pathname.replace(/\/+$/, '') || '/';
  return path === '/kontakt' || path === '/dana-tattoo-studio' || path === '/impressum' || path === '/datenschutz' || path === '/softwareentwicklung' || path === '/projekte' || path === '/fotografie' || path === '/ueber-mich' ? path : '/';
}

export function migrateLegacyLink() {
  const { pathname, hash, search } = window.location;
  if (pathname === '/' && (hash === '#projekte' || hash === '#fotografie' || hash === '#ueber-mich')) {
    window.history.replaceState(window.history.state, '', `/${hash.slice(1)}${search}`);
  }
}
