import { Link, useParams } from 'react-router';
import { getInsight, type InsightBlock } from '../../data/insights';
import { insightPath } from '../../routes';
import styles from './Insights.module.scss';

const formatDate = (date: string) => new Intl.DateTimeFormat('de-DE', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${date}T00:00:00Z`));

function Block({ block }: { block: InsightBlock }) {
  switch (block.type) {
    case 'paragraph': return <p>{block.text}</p>;
    case 'subheading': return <h3>{block.text}</h3>;
    case 'example': return <div className={styles.example}><h3>{block.title}</h3><p>{block.text}</p></div>;
    case 'list': return <ul>{block.items.map((item, index) => <li key={index}>{item}</li>)}</ul>;
    case 'table': return (
      <>
        <p className={styles.tableHint}>Tabelle bei Bedarf seitlich scrollen →</p>
        <div className={styles.tableWrap} role="region" aria-label={block.caption} tabIndex={0}>
          <table>
            <caption>{block.caption}</caption>
            <thead><tr>{block.headers.map((header, index) => <th scope="col" key={index}>{header}</th>)}</tr></thead>
            <tbody>{block.rows.map((row, index) => <tr key={index}>{row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}</tr>)}</tbody>
          </table>
        </div>
      </>
    );
  }
}

export default function InsightPage() {
  const { slug = '' } = useParams();
  const article = getInsight(slug);
  if (!article) return (
    <section className={styles.page}>
      <h1 tabIndex={-1} id="insight-title">Artikel nicht gefunden</h1>
      <p className={styles.lead}>Dieser Artikel ist nicht verfügbar.</p>
      <Link className={styles.textLink} to="/insights">Zur Übersicht</Link>
    </section>
  );
  const related = article.relatedSlugs.map(getInsight).filter(item => item !== undefined);
  return (
    <article className={`${styles.page} ${styles.article}`}>
      <nav className={styles.breadcrumbs} aria-label="Brotkrumennavigation">
        <Link to="/">Startseite</Link><span aria-hidden="true"> / </span>
        <Link to="/insights">Insights</Link><span aria-hidden="true"> / </span>
        <span aria-current="page">{article.title}</span>
      </nav>
      <header className={styles.header}>
        <p className={styles.eyebrow}>{article.category} · {article.readingMinutes} Min. Lesezeit</p>
        <h1 id="insight-title" tabIndex={-1}>{article.title}</h1>
        <p className={styles.lead}>{article.description}</p>
      </header>
      <img className={styles.cover} src={article.image.src} alt={article.image.alt} width={article.image.width} height={article.image.height} fetchPriority="high" decoding="async" />
      <div className={styles.content}>
        <nav className={styles.toc} aria-label="Inhaltsverzeichnis">
          <details>
            <summary>
              Inhaltsverzeichnis
              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="m4 6 4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </summary>
            <ul>
              <li><a href="#kurze-antwort">Die kurze Antwort</a></li>
              {article.sections.map(section => <li key={section.id}><a href={`#${section.id}`}>{section.title}</a></li>)}
              {article.faq.length > 0 && <li><a href="#faq">Häufige Fragen</a></li>}
              {article.sources.length > 0 && <li><a href="#quellen">Quellen</a></li>}
              {article.closing && <li><a href="#abschluss">{article.closing.title}</a></li>}
            </ul>
          </details>
        </nav>
        <section id="kurze-antwort"><h2>{article.question}</h2><p>{article.answer}</p></section>
        {article.sections.map(section => (
          <section id={section.id} key={section.id}>
            <h2>{section.title}</h2>
            {section.blocks.map((block, index) => <Block key={index} block={block} />)}
          </section>
        ))}
        {article.faq.length > 0 && <section id="faq"><h2>Häufige Fragen</h2>{article.faq.map(item => <div key={item.question}><h3>{item.question}</h3><p>{item.answer}</p></div>)}</section>}
        {article.sources.length > 0 && <section id="quellen"><h2>Quellen</h2><ul>{article.sources.map(source => <li key={source.url}><a href={source.url}>{source.label}</a></li>)}</ul></section>}
        {article.links.length > 0 && <section><h2>Mehr entdecken</h2><ul>{article.links.map(link => <li key={link.href}><Link to={link.href}>{link.label}</Link></li>)}</ul></section>}
        {article.closing && <section id="abschluss"><h2>{article.closing.title}</h2>{article.closing.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}</section>}
        {article.cta.text && <p className={styles.ctaIntro}><strong>{article.cta.text}</strong></p>}
        <p><Link className={styles.cta} to={article.cta.href}>{article.cta.label}</Link></p>
        {related.length > 0 && <section><h2>Verwandte Artikel</h2><ul>{related.map(item => <li key={item.slug}><Link to={insightPath(item)}>{item.title}</Link></li>)}</ul></section>}
        <p className={styles.meta}>Von {article.author} · Veröffentlicht <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time> · Aktualisiert <time dateTime={article.updatedAt}>{formatDate(article.updatedAt)}</time></p>
      </div>
    </article>
  );
}
