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
    description: 'Webdesign und Softwareentwicklung aus Andernach bei Koblenz: Entdecke FilliCat, Dana Tattoo Studio, KAVRO Barber Studio und die interaktive Pizzeria-Demo Mamma Mia.',
  },
  '/softwareentwicklung': {
    title: 'Softwareentwicklung – Anna Filippi',
    description: 'FilliCat: Adaptive Lernplattform für JavaScript und TypeScript mit praktischen Aufgaben und individuellem Training. In Entwicklung bei Anna Filippi Studio.',
  },
  '/dana-tattoo-studio': {
    title: 'Dana Tattoo Studio – Webdesign | Anna Filippi',
    description: 'Individueller Webauftritt für Dana Tattoo Studio in Andernach: responsives Design, interaktive Galerien und direkte Kontaktmöglichkeiten.',
  },
  '/fotografie': {
    title: 'Produktfotografie – Anna Filippi',
    description: 'Produktfotografie von Anna Filippi in Andernach: Schmuck, Licht, Material und Atmosphäre. Entdecke inszenierte Fotografien und klare Produktaufnahmen.',
  },
  '/impressum': { title: 'Impressum — Anna Filippi', description: 'Impressum von Anna Filippi.' },
  '/datenschutz': { title: 'Datenschutzerklärung — Anna Filippi', description: 'Datenschutzerklärung von Anna Filippi.' },
} as const;
export type PagePath = keyof typeof pages;

export function pageForPath(pathname: string): PagePath {
  const path = pathname.replace(/\/+$/, '') || '/';
  return path === '/dana-tattoo-studio' || path === '/impressum' || path === '/datenschutz' || path === '/softwareentwicklung' || path === '/projekte' || path === '/fotografie' || path === '/ueber-mich' ? path : '/';
}

export function migrateLegacyLink() {
  const { pathname, hash, search } = window.location;
  if (pathname === '/' && (hash === '#projekte' || hash === '#fotografie' || hash === '#ueber-mich')) {
    window.history.replaceState(window.history.state, '', `/${hash.slice(1)}${search}`);
  }
}
