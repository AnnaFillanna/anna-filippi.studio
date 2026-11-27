"""Read-only production SEO checks; standard library only."""
import argparse
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import sys
import time
import urllib.error
import urllib.request
from urllib.parse import urljoin, urlsplit
from urllib.robotparser import RobotFileParser
import xml.etree.ElementTree as ET

ORIGIN = 'https://annafilippi.studio'


class Page(HTMLParser):
    def __init__(self, text):
        super().__init__(convert_charrefs=True)
        self.titles, self.descriptions, self.canonicals = [], [], []
        self.robots, self.links, self.schemas = [], [], []
        self.h1 = 0
        self.title = self.schema = None
        self.feed(text)

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == 'title':
            self.title = ''
        if tag == 'h1':
            self.h1 += 1
        if tag == 'meta':
            name = a.get('name', '').lower()
            if name == 'description':
                self.descriptions.append(a.get('content', ''))
            if name in ('robots', 'googlebot', 'bingbot'):
                self.robots.append(a.get('content', '').lower())
        if tag == 'link' and 'canonical' in a.get('rel', '').lower().split():
            self.canonicals.append(a.get('href', ''))
        if tag == 'a' and a.get('href'):
            self.links.append(a['href'])
        if tag == 'script' and a.get('type', '').lower() == 'application/ld+json':
            self.schema = ''

    def handle_data(self, text):
        if self.title is not None:
            self.title += text
        if self.schema is not None:
            self.schema += text

    def handle_endtag(self, tag):
        if tag == 'title' and self.title is not None:
            self.titles.append(self.title.strip())
            self.title = None
        if tag == 'script' and self.schema is not None:
            self.schemas.append(self.schema)
            self.schema = None


def fetch(url):
    # Retry transient failures once. Do not log response bodies or credentials.
    for attempt in range(2):
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'Anna-SEO-Monitor/2.0'})
            with urllib.request.urlopen(req, timeout=15) as response:
                body = response.read(2_000_001)
                if len(body) > 2_000_000:
                    return {'status': 0, 'error': 'Antwort überschreitet Prüflimit'}
                return {'status': response.status, 'url': response.url,
                        'headers': dict(response.headers.items()), 'body': body.decode('utf-8', 'replace')}
        except urllib.error.HTTPError as error:
            if error.code not in (429, 500, 502, 503, 504) or attempt:
                return {'status': error.code, 'error': 'HTTP-Fehler'}
        except (OSError, ValueError):
            if attempt:
                return {'status': 0, 'error': 'Abruf fehlgeschlagen'}
        time.sleep(0.5)


def sitemap_urls(text):
    root = ET.fromstring(text)
    if root.tag != '{http://www.sitemaps.org/schemas/sitemap/0.9}urlset':
        raise ValueError('URL-Sitemap erwartet')
    urls = [node.text.strip() for node in root.findall('{*}url/{*}loc') if node.text]
    if not urls:
        raise ValueError('Sitemap ist leer')
    return urls


def audit(get=fetch, expected=None):
    findings = []
    def add(level, url, message):
        findings.append((level, url, message))
    def response_ok(url, result):
        if result.get('status') != 200:
            add('FEHLER', url, f"HTTP {result.get('status', 0)}: {result.get('error', 'nicht erreichbar')}")
            return False
        if result.get('url', url) != url:
            add('FEHLER', url, 'Öffentliche kanonische URL leitet auf ein anderes Ziel um')
        return True

    sitemap_url = ORIGIN + '/sitemap.xml'
    sm = get(sitemap_url)
    urls = []
    if response_ok(sitemap_url, sm):
        try:
            urls = sitemap_urls(sm['body'])
        except (ET.ParseError, ValueError):
            add('FEHLER', sitemap_url, 'Ungültige oder leere URL-Sitemap')
    if len(urls) != len(set(urls)):
        add('WARNUNG', sitemap_url, 'Doppelte Sitemap-URLs')
    safe = []
    for url in urls:
        parts = urlsplit(url)
        if parts.scheme != 'https' or parts.netloc != urlsplit(ORIGIN).netloc or parts.query or parts.fragment or parts.username:
            add('FEHLER', sitemap_url, 'Nichtkanonischer oder fremder Sitemap-Eintrag; wird nicht abgerufen')
        else:
            safe.append(url)
    if expected:
        for url in sorted(set(expected) - set(safe)):
            add('FEHLER', url, 'Erwartete öffentliche Seite fehlt in der Sitemap')
    targets = sorted(set(safe) | set(expected or []) | {ORIGIN + '/'})
    if len(targets) > 100:
        add('FEHLER', sitemap_url, 'Prüflimit von 100 Seiten überschritten')
        targets = targets[:100]

    robots_url = ORIGIN + '/robots.txt'
    rb = get(robots_url)
    if response_ok(robots_url, rb):
        robots = RobotFileParser()
        robots.parse(rb['body'].splitlines())
        if sitemap_url not in (robots.site_maps() or []):
            add('WARNUNG', robots_url, 'Verweis auf die kanonische Sitemap fehlt')
        for url in targets:
            for agent in ('Googlebot', 'bingbot', 'OAI-SearchBot', 'PerplexityBot'):
                if not robots.can_fetch(agent, url):
                    add('FEHLER', url, f'robots.txt sperrt {agent}')
    pages = {}
    with ThreadPoolExecutor(max_workers=4) as pool:
        results = list(pool.map(get, targets))
    for url, result in zip(targets, results):
        if not response_ok(url, result):
            continue
        page = Page(result.get('body', ''))
        pages[url] = page
        headers = {k.lower(): v for k, v in result.get('headers', {}).items()}
        directives = page.robots + [headers.get('x-robots-tag', '').lower()]
        if any(re.search(r'\b(noindex|none)\b', value) for value in directives):
            add('FEHLER', url, 'Noindex-Anweisung in Meta oder HTTP-Header')
        if len(page.canonicals) != 1 or page.canonicals[0] != url:
            add('FEHLER', url, 'Canonical fehlt, ist mehrfach vorhanden oder stimmt nicht mit der URL überein')
        if len(page.titles) != 1 or not page.titles[0]:
            add('FEHLER', url, 'Genau ein nichtleerer Title erforderlich')
        if len(page.descriptions) != 1 or not page.descriptions[0].strip():
            add('WARNUNG', url, 'Meta-Description fehlt, ist leer oder mehrfach vorhanden')
        if page.h1 != 1:
            add('WARNUNG', url, f'H1-Anzahl {page.h1}; semantisch prüfen')
        if not page.schemas:
            add('WARNUNG', url, 'Vorhandenes JSON-LD fehlt im ausgelieferten HTML')
        for block in page.schemas:
            try:
                value = json.loads(block)
                if not isinstance(value, (dict, list)) or not value:
                    raise ValueError('Kein Graph')
            except (ValueError, TypeError):
                add('FEHLER', url, 'JSON-LD ist kein gültiges JSON-Objekt oder Array')
    # Public internal document links only; never probe APIs, mail links or arbitrary external URLs.
    missing_links = set()
    for url, page in pages.items():
        for href in page.links:
            p = urlsplit(urljoin(url, href))
            if p.scheme == 'https' and p.netloc == urlsplit(ORIGIN).netloc and not p.query and not p.path.startswith(('/api/', '/assets/', '/images/')):
                target = ORIGIN + (p.path or '/')
                if target not in targets:
                    missing_links.add(target)
    if len(missing_links) > 50:
        add('FEHLER', ORIGIN, 'Limit zusätzlicher interner Links überschritten')
    for url in sorted(missing_links)[:50]:
        response_ok(url, get(url))
    for attr, name in (('titles', 'Title'), ('descriptions', 'Description')):
        seen = {}
        for url, page in pages.items():
            values = getattr(page, attr)
            if len(values) == 1 and values[0].strip():
                if values[0] in seen:
                    add('WARNUNG', url, f'{name} identisch mit {seen[values[0]]}')
                seen[values[0]] = url
    add('INFO', ORIGIN, f'{len(targets)} öffentliche Seiten geprüft; {len(missing_links)} zusätzliche interne Links')
    return findings


def exit_code(findings):
    return 1 if any(level == 'FEHLER' for level, _, _ in findings) else 0


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--report', default='seo-report.md')
    args = parser.parse_args()
    try:
        expected = sitemap_urls((Path(__file__).resolve().parents[1] / 'public/sitemap.xml').read_text())
        findings = audit(expected=expected)
    except Exception:
        findings = [('FEHLER', ORIGIN, 'Monitor konnte nicht vollständig ausgeführt werden')]
    report = '# Anna Filippi – SEO-Monitor\n\n' + datetime.now(timezone.utc).isoformat() + '\n\n'
    report += '\n'.join(f'- **{level}** {url}: {message}' for level, url, message in findings) + '\n'
    Path(args.report).write_text(report, encoding='utf-8')
    print(report)
    return exit_code(findings)


if __name__ == '__main__':
    sys.exit(main())
