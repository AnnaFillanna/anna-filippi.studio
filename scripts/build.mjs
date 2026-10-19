import { build } from 'vite';
import { readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

// Build the existing browser app, then render its real components for each URL.
const temporary = '.prerender';
try {
  await build();
  await build({ build: { ssr: 'src/entry-server.tsx', outDir: temporary } });
  const { render, pages, origin } = await import(pathToFileURL(resolve(temporary, 'entry-server.js')).href);
  const template = await readFile('dist/index.html', 'utf8');
  const escape = text => text.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
  for (const [path, meta] of Object.entries(pages)) {
    const canonical = origin + (path === '/' ? '/' : path);
    let html = template
      .replace(/<title>[^<]*<\/title>/, `<title>${escape(meta.title)}</title>`)
      .replace(/(<meta name="description" content=")[^"]*("\s*\/?>)/, `$1${escape(meta.description)}$2`)
      .replace(/(<link rel="canonical" href=")[^"]*("\s*\/?>)/, `$1${canonical}$2`)
      .replace(/(<meta property="og:title" content=")[^"]*("\s*\/?>)/, `$1${escape(meta.title)}$2`)
      .replace(/(<meta property="og:description" content=")[^"]*("\s*\/?>)/, `$1${escape(meta.description)}$2`)
      .replace(/(<meta property="og:url" content=")[^"]*("\s*\/?>)/, `$1${canonical}$2`)
      .replace('<div id="root"></div>', () => `<div id="root">${render(path)}</div>`);
    // Motion stays unchanged with JavaScript; make the rendered content visible without it.
    html = html.replace('</head>', '<noscript><style>#root *{opacity:1!important;transform:none!important;clip-path:none!important}</style></noscript></head>');
    if (!html.includes('<main') || !html.includes('<h1')) throw new Error(`Empty prerender: ${path}`);
    const folder = path === '/' ? 'dist' : `dist${path}`;
    await mkdir(folder, { recursive: true });
    await writeFile(`${folder}/index.html`, html);
  }
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${Object.keys(pages).map(path => `  <url><loc>${origin}${path === '/' ? '/' : path}</loc></url>`).join('\n')}\n</urlset>\n`;
  await writeFile('dist/sitemap.xml', sitemap);
} finally {
  await rm(temporary, { recursive: true, force: true });
}
