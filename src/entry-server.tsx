import { renderToString } from 'react-dom/server';
import App from './App';
import { pages, origin, insightStructuredData, type PagePath } from './routes';
import { getInsight } from './data/insights';

export { pages, origin };
export function articleMetadata(path: string) {
  const article = path.startsWith('/insights/') ? getInsight(path.slice('/insights/'.length)) : undefined;
  return article ? { image: origin + article.image.src, structuredData: insightStructuredData(article) } : null;
}
export function render(path: PagePath) {
  return renderToString(<App initialPath={path} />);
}
