export const origin = 'https://annafilippi.studio';
export const pages = {
  '/': {
    title: 'Webdesign & Webentwicklung Koblenz | Anna Filippi Studio',
    description: 'Individuelles Webdesign, moderne Websites und Webentwicklung für Unternehmen. Persönlich aus Andernach bei Koblenz – deutschlandweit.',
  },
  '/ueber-mich': {
    title: 'Über mich — Anna Filippi | Webentwicklung & Fotografie',
    description: 'Lerne Anna Filippi kennen: moderne Websites, digitale Ideen und Begeisterung für KI, Design und Schmuckfotografie. Persönlich, kreativ und mit Liebe zum Detail.',
  },
  '/projekte': {
    title: 'Web & Software – Projekte | Anna Filippi',
    description: 'Webprojekte aus Andernach: Dana Tattoo Studio als Kundenprojekt, FilliCat als eigene Lernplattform sowie die Demos Mamma Mia und KAVRO.',
  },
  '/softwareentwicklung': {
    title: 'Softwareentwicklung – Anna Filippi',
    description: 'Individuelle Web-Apps, Kontaktformulare und Terminbuchung für deine Website. Entdecke FilliCat und teste die interaktive Buchungsdemo von Anna Filippi.',
  },
  '/dana-tattoo-studio': {
    title: 'Dana Tattoo Studio – Webdesign | Anna Filippi',
    description: 'Individueller Webauftritt für Dana Tattoo Studio in Andernach: responsives Design, interaktive Galerien und direkte Kontaktmöglichkeiten.',
  },
  '/fotografie': {
    title: 'Produktfotografie – Anna Filippi',
    description: 'Produktfotografie von Anna Filippi in Andernach: Schmuck, Licht, Material und Atmosphäre. Entdecke inszenierte Fotografien und klare Produktaufnahmen.',
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
