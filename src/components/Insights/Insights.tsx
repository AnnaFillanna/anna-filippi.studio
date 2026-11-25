import { useState } from 'react';
import { Link } from 'react-router';
import { insightCategories, publishedInsights, type InsightCategory } from '../../data/insights';
import { insightPath } from '../../routes';
import styles from './Insights.module.scss';

export default function Insights() {
  const [category, setCategory] = useState<InsightCategory | 'Alle'>('Alle');
  const articles = category === 'Alle' ? publishedInsights : publishedInsights.filter(article => article.category === category);

  return (
    <section className={styles.page} aria-labelledby="insights-title">
      <header className={styles.header}>
        <p className={styles.eyebrow}>ANNA FILIPPI STUDIO</p>
        <h1 id="insights-title" tabIndex={-1}>Wissen &amp; Insights</h1>
        <p className={styles.lead}>Digitale Lösungen verstehen. Fundierte Entscheidungen treffen.</p>
      </header>
      <div className={styles.filters} role="group" aria-label="Artikel nach Kategorie filtern">
        {(['Alle', ...insightCategories] as const).map(item => (
          <button key={item} type="button" aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>
        ))}
      </div>
      <div aria-live="polite">
        {articles.length === 0 ? (
          <p className={styles.empty}>{category === 'Alle' ? 'Hier erscheinen künftig sorgfältig recherchierte Artikel. Es sind noch keine Beiträge veröffentlicht.' : `In der Kategorie „${category}“ sind noch keine Beiträge veröffentlicht.`}</p>
        ) : (
          <ul className={styles.grid}>
            {articles.map(article => (
              <li key={article.slug}>
                <article className={styles.card}>
                  <Link to={insightPath(article)}>
                    <picture>
                      {article.image.webpSrc && <source srcSet={article.image.webpSrc} type="image/webp" />}
                      <img src={article.image.src} alt={article.image.alt} width={article.image.width} height={article.image.height} loading="lazy" decoding="async" />
                    </picture>
                    <p className={styles.eyebrow}>{article.category} · {article.readingMinutes} Min. Lesezeit</p>
                    <h2>{article.title}</h2>
                    <p>{article.description}</p>
                    <span className={styles.textLink}>Artikel lesen <span aria-hidden="true">→</span></span>
                  </Link>
                </article>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
