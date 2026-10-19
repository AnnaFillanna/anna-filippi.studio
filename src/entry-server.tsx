import { renderToString } from 'react-dom/server';
import App from './App';
import { pages, origin, type PagePath } from './routes';

export { pages, origin };
export function render(path: PagePath) {
  return renderToString(<App initialPath={path} />);
}
