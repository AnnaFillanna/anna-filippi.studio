export const origin = 'https://annafilippi.studio';
export const pages = {
  '/': {
    title: 'ANNA FILIPPI — Digital Atelier',
    description: 'ANNA FILIPPI — Digital Atelier in Andernach. Websites, Web-Applikationen, KI-Integrationen und Produktfotografie. Anna Filippi, auch bekannt als Fillanna.',
  },
  '/projekte': {
    title: 'Web & Software – Projekte | Anna Filippi',
    description: 'Webentwicklung, Web-Applikationen und Shopify: Entdecke FilliCat, RUJOLY und Dana Tattoo Studio im Portfolio von Anna Filippi, auch bekannt als Fillanna.',
  },
  '/fotografie': {
    title: 'Produktfotografie – Anna Filippi',
    description: 'Produktfotografie von Anna Filippi in Andernach: Schmuck, Licht, Material und Atmosphäre. Entdecke inszenierte Fotografien und klare Produktaufnahmen.',
  },
} as const;
export type PagePath = keyof typeof pages;

export function pageForPath(pathname: string): PagePath {
  const path = pathname.replace(/\/+$/, '') || '/';
  return path === '/projekte' || path === '/fotografie' ? path : '/';
}

export function migrateLegacyLink() {
  const { pathname, hash, search } = window.location;
  if (pathname === '/' && (hash === '#projekte' || hash === '#fotografie')) {
    window.history.replaceState(window.history.state, '', `/${hash.slice(1)}${search}`);
  }
}
