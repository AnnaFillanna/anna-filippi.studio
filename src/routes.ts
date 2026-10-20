export const origin = 'https://annafilippi.studio';
export const pages = {
  '/': {
    title: 'ANNA FILIPPI Studio — Webentwicklung, KI & Fotografie',
    description: 'ANNA FILIPPI Studio in Andernach: Websites, Web-Applikationen, Softwareentwicklung, KI-Integrationen, Automatisierung, Shopify und Produktfotografie. Auch bekannt als Fillanna.',
  },
  '/ueber-mich': {
    title: 'Über mich — Anna Filippi | Webentwicklung & Fotografie',
    description: 'Lerne Anna Filippi kennen: moderne Websites, digitale Ideen und Begeisterung für KI, Design und Schmuckfotografie. Persönlich, kreativ und mit Liebe zum Detail.',
  },
  '/projekte': {
    title: 'Web & Software – Projekte | Anna Filippi',
    description: 'Websites und Software von Anna Filippi: FilliCat und Dana Tattoo Studio. FilliCat ist als App für Smartphone, Laptop und Tablet geplant.',
  },
  '/softwareentwicklung': {
    title: 'Softwareentwicklung – Anna Filippi',
    description: 'FilliCat: Lernplattform im Browser und geplante App für Smartphone, Laptop und Tablet. Ein Softwareprojekt von Anna Filippi.',
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
  return path === '/impressum' || path === '/datenschutz' || path === '/softwareentwicklung' || path === '/projekte' || path === '/fotografie' || path === '/ueber-mich' ? path : '/';
}

export function migrateLegacyLink() {
  const { pathname, hash, search } = window.location;
  if (pathname === '/' && (hash === '#projekte' || hash === '#fotografie' || hash === '#ueber-mich')) {
    window.history.replaceState(window.history.state, '', `/${hash.slice(1)}${search}`);
  }
}
