export const insightCategories = [
  'Webdesign & Webentwicklung',
  'SEO & AEO',
  'E-Commerce',
  'KI & Automatisierung',
  'Produktfotografie',
] as const;

export type InsightCategory = typeof insightCategories[number];

export type InsightBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'subheading'; text: string }
  | { type: 'example'; title: string; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'table'; caption: string; headers: string[]; rows: string[][] };

export type InsightArticle = {
  slug: string;
  title: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  category: InsightCategory;
  image: { src: string; alt: string; width: number; height: number };
  author: 'Anna Filippi';
  publishedAt: string;
  updatedAt: string;
  readingMinutes: number;
  question: string;
  answer: string;
  sections: { id: string; title: string; blocks: InsightBlock[] }[];
  faq: { question: string; answer: string }[];
  sources: { label: string; url: string }[];
  links: { label: string; href: string }[];
  closing?: { title: string; paragraphs: string[] };
  cta: { label: string; href: string };
  relatedSlugs: string[];
};

// Nur redaktionell geprüfte und ausdrücklich freigegebene Artikel eintragen.
export const publishedInsights: InsightArticle[] = [
  {
    slug: 'was-kostet-eine-professionelle-website',
    title: 'Was kostet eine professionelle Website für kleine Unternehmen?',
    description: 'Eine professionelle Website ist weit mehr als eine digitale Visitenkarte. Sie präsentiert dein Unternehmen, schafft Vertrauen und hilft potenziellen Kunden, deine Leistungen zu finden und Kontakt aufzunehmen.',
    metaTitle: 'Was kostet eine professionelle Website? | Anna Filippi Studio',
    metaDescription: 'Welche Faktoren beeinflussen die Kosten einer Website? Erfahre, welche Leistungen und laufenden Kosten kleine Unternehmen einplanen sollten.',
    category: 'Webdesign & Webentwicklung',
    image: {
      src: '/images/insights/website-kosten-arbeitsplatz.jpg',
      alt: 'Arbeitsplatz mit Laptop, Kamera und Grafiktablett',
      width: 1152,
      height: 768,
    },
    author: 'Anna Filippi',
    publishedAt: '2026-11-25',
    updatedAt: '2026-11-25',
    readingMinutes: 2,
    question: 'Was kostet eine professionelle Website?',
    answer: 'Die Kosten hängen davon ab, welche Anforderungen, Funktionen und individuellen Gestaltungsmöglichkeiten benötigt werden.',
    sections: [
      {
        id: 'kostenfaktoren',
        title: 'Welche Faktoren beeinflussen die Kosten einer Website?',
        blocks: [
          { type: 'paragraph', text: 'Der Preis einer Website setzt sich aus verschiedenen Leistungen zusammen:' },
          { type: 'list', items: ['Individuelles Webdesign', 'Anzahl und Umfang der Unterseiten', 'Technische Entwicklung', 'Mobile Optimierung', 'Suchmaschinenoptimierung (SEO)', 'Erstellung und Integration von Inhalten', 'Individuelle Funktionen wie Kontaktformulare, Online-Terminbuchungen oder KI-Chatbots'] },
          { type: 'paragraph', text: 'Je komplexer die Anforderungen sind, desto größer ist der Entwicklungsaufwand.' },
        ],
      },
      {
        id: 'passende-website',
        title: 'Welche Website passt zu meinem Unternehmen?',
        blocks: [
          { type: 'paragraph', text: 'Für Selbstständige und kleine Unternehmen reicht häufig eine übersichtliche Website mit einer klaren Leistungsbeschreibung, professionellen Bildern und einfachen Kontaktmöglichkeiten.' },
          { type: 'paragraph', text: 'Unternehmen mit umfangreicheren Anforderungen können zusätzlich von digitalen Lösungen wie individuellen Webanwendungen, Online-Shops oder automatisierten Geschäftsprozessen profitieren.' },
          { type: 'paragraph', text: 'Entscheidend ist nicht die Anzahl der Funktionen, sondern ihr tatsächlicher Mehrwert für dein Unternehmen.' },
        ],
      },
      {
        id: 'baukasten-oder-individuell',
        title: 'Website-Baukasten oder individuelle Entwicklung?',
        blocks: [
          { type: 'paragraph', text: 'Ein Website-Baukasten kann für einfache Projekte eine kostengünstige Einstiegslösung sein. Individuell entwickelte Websites bieten dagegen mehr Flexibilität bei Design, Funktionen und technischer Erweiterbarkeit.' },
          { type: 'paragraph', text: 'Welche Lösung sinnvoll ist, hängt von deinen langfristigen Zielen, deinem Budget und deinen Anforderungen ab.' },
        ],
      },
      {
        id: 'laufende-kosten',
        title: 'Welche laufenden Kosten entstehen?',
        blocks: [
          { type: 'paragraph', text: 'Neben der eigentlichen Entwicklung können weitere Kosten entstehen:' },
          { type: 'list', items: ['Domain und Hosting', 'Technische Wartung', 'Aktualisierung von Inhalten', 'Externe Dienste und Schnittstellen', 'Erweiterung bestehender Funktionen'] },
          { type: 'paragraph', text: 'Eine transparente Planung hilft dabei, unerwartete Ausgaben zu vermeiden.' },
        ],
      },
    ],
    faq: [
      { question: 'Kann ich eine bestehende Website überarbeiten lassen?', answer: 'Ja. Ein Website-Relaunch kann sinnvoll sein, wenn das Design veraltet ist, die mobile Darstellung nicht funktioniert oder wichtige Funktionen fehlen.' },
      { question: 'Wird eine individuell entwickelte Website bei Google besser gefunden?', answer: 'Nicht automatisch. Entscheidend sind unter anderem die Qualität der Inhalte, technische Zugänglichkeit, Ladezeiten, Relevanz und Vertrauenswürdigkeit.' },
      { question: 'Kann meine Website später erweitert werden?', answer: 'Bei einer entsprechend geplanten Architektur können neue Funktionen und Inhalte schrittweise ergänzt werden.' },
    ],
    sources: [],
    links: [
      { label: 'Webprojekte entdecken', href: '/projekte' },
      { label: 'Individuelle Webanwendungen', href: '/softwareentwicklung' },
    ],
    closing: {
      title: 'Deine Website. Deine Möglichkeiten.',
      paragraphs: [
        'Anna Filippi Studio entwickelt individuelle digitale Lösungen für Selbstständige und Unternehmen in Andernach, Koblenz und Umgebung.',
        'Gemeinsam finden wir heraus, welche Website zu deinen Anforderungen passt.',
      ],
    },
    cta: { label: 'Jetzt unverbindlich Kontakt aufnehmen', href: '/kontakt' },
    relatedSlugs: [],
  },
];

export function validateInsights(articles: InsightArticle[]) {
  const slugs = new Set<string>();
  const validDate = (date: string) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
    const parsed = new Date(`${date}T00:00:00Z`);
    return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === date;
  };
  for (const article of articles) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(article.slug) || slugs.has(article.slug)) throw new Error(`Ungültiger oder doppelter Artikel-Slug: ${article.slug}`);
    slugs.add(article.slug);
    if (![article.title, article.description, article.metaTitle, article.metaDescription, article.image.alt, article.question, article.answer].every(value => value.trim())) throw new Error(`Unvollständige Angaben: ${article.slug}`);
    if (!insightCategories.includes(article.category) || article.author !== 'Anna Filippi') throw new Error(`Ungültige Kategorie oder Autorin: ${article.slug}`);
    if (!validDate(article.publishedAt) || !validDate(article.updatedAt) || article.updatedAt < article.publishedAt) throw new Error(`Ungültiges Artikeldatum: ${article.slug}`);
    if (!Number.isInteger(article.readingMinutes) || article.readingMinutes < 1) throw new Error(`Ungültige Lesezeit: ${article.slug}`);
    if (!/^\/images\/[a-zA-Z0-9/_-]+\.(?:webp|jpg|jpeg|png)$/.test(article.image.src) || !Number.isInteger(article.image.width) || article.image.width < 1 || !Number.isInteger(article.image.height) || article.image.height < 1) throw new Error(`Ungültiges Titelbild: ${article.slug}`);
    const ids = new Set(['kurze-antwort', 'faq', 'quellen', 'abschluss']);
    for (const section of article.sections) {
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(section.id) || ids.has(section.id) || !section.title.trim()) throw new Error(`Ungültige Abschnitts-ID: ${article.slug}`);
      ids.add(section.id);
    }
    if (![article.cta, ...article.links].every(link => /^\/(?!\/)/.test(link.href) && link.label.trim())) throw new Error(`Ungültiger interner Link: ${article.slug}`);
    if (!article.sources.every(source => source.label.trim() && /^https:\/\/[^/]+/.test(source.url))) throw new Error(`Ungültige Quelle: ${article.slug}`);
  }
}

export function getInsight(slug: string): InsightArticle | undefined {
  return publishedInsights.find(article => article.slug === slug);
}
