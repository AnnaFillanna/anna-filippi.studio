import { publishedInsights, validateInsights, type InsightArticle } from './data/insights';

export const origin = 'https://annafilippi.studio';
const basePages = {
  '/': {
    title: 'Webdesign für kleine Unternehmen in Andernach | Anna Filippi',
    description: 'Website erstellen lassen in Andernach bei Koblenz: Webdesign für Selbstständige und kleine Unternehmen, Website-Relaunch und Online-Shops. Persönlich betreut.',
  },
  '/ueber-mich': {
    title: 'Über mich — Anna Filippi | Webentwicklung & E-Commerce',
    description: 'Lerne Anna Filippi kennen: ihr beruflicher Weg, praktische E-Commerce-Erfahrung mit FILLANNA und ihre laufenden Weiterbildungen.',
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
  '/kontakt': { title: 'Kontakt — Anna Filippi Studio', description: 'Erzähl mir von deiner Idee. Gemeinsam setzen wir dein Projekt um – persönlich und mit Liebe zum Detail.' },
  '/impressum': { title: 'Impressum — Anna Filippi', description: 'Impressum von Anna Filippi Studio in Andernach: Anbieterkennzeichnung und Kontaktdaten.' },
  '/datenschutz': { title: 'Datenschutzerklärung — Anna Filippi', description: 'Datenschutzerklärung für annafilippi.studio: Informationen zur Verarbeitung personenbezogener Daten und zu deinen Rechten.' },
  '/insights': { title: 'Wissen & Insights | Anna Filippi Studio', description: 'Wissen und Insights zu Webdesign, SEO, E-Commerce, KI, Automatisierung und digitaler Marktanalyse.' },
} as const;

export function insightPath(article: InsightArticle): string {
  return `/insights/${article.slug}`;
}

validateInsights(publishedInsights);
export const pages: Record<string, { title: string; description: string }> = {
  ...basePages,
  ...Object.fromEntries(publishedInsights.map(article => [
    insightPath(article), { title: article.metaTitle, description: article.metaDescription },
  ])),
};
export type PagePath = string;

export function insightStructuredData(article: InsightArticle) {
  const url = origin + insightPath(article);
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': `${url}#article`,
        headline: article.title,
        description: article.description,
        image: origin + article.image.src,
        datePublished: article.publishedAt,
        dateModified: article.updatedAt,
        author: { '@type': 'Person', '@id': `${origin}/#anna-filippi`, name: article.author, url: `${origin}/ueber-mich` },
        mainEntityOfPage: url,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Startseite', item: `${origin}/` },
          { '@type': 'ListItem', position: 2, name: 'Wissen & Insights', item: `${origin}/insights` },
          { '@type': 'ListItem', position: 3, name: article.title, item: url },
        ],
      },
    ],
  };
}

export function pageForPath(pathname: string): PagePath {
  const path = pathname.replace(/\/+$/, '') || '/';
  if (path === '/fotografie') return '/projekte';
  return Object.hasOwn(pages, path) || path.startsWith('/insights/') ? path : '/';
}

export function migrateLegacyLink() {
  const { pathname, hash, search } = window.location;
  if (pathname === '/' && (hash === '#projekte' || hash === '#fotografie' || hash === '#ueber-mich')) {
    const destination = hash === '#fotografie' ? '/projekte' : `/${hash.slice(1)}`;
    window.history.replaceState(window.history.state, '', `${destination}${search}`);
  }
}
