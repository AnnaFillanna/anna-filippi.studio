import importlib.util
from pathlib import Path
import unittest
from unittest.mock import patch
import subprocess
import sys
import tempfile

spec = importlib.util.spec_from_file_location('monitor', Path(__file__).resolve().parents[1] / 'scripts/seo-monitor.py')
m = importlib.util.module_from_spec(spec)
spec.loader.exec_module(m)

class MonitorTests(unittest.TestCase):
    def fixtures(self):
        origin = m.ORIGIN
        def ok(body):
            return {'status': 200, 'body': body, 'headers': {}}
        return {
            origin + '/sitemap.xml': ok(f'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>{origin}/</loc></url></urlset>'),
            origin + '/robots.txt': ok(f'User-agent: *\nAllow: /\nSitemap: {origin}/sitemap.xml'),
            origin + '/': ok(f'<title>Anna</title><meta name="description" content="Studio"><link rel="canonical" href="{origin}/"><h1>Anna</h1><script type="application/ld+json">{{"@type":"WebSite"}}</script>'),
        }

    def check(self, data):
        return m.audit(lambda url: data.get(url, {'status': 404}), expected=[m.ORIGIN + '/'])

    def test_success(self):
        self.assertEqual(m.exit_code(self.check(self.fixtures())), 0)

    def test_critical_failures(self):
        for case in ('http', 'sitemap', 'robots', 'canonical', 'title', 'json', 'meta', 'header', 'link', 'missing'):
            with self.subTest(case=case):
                data = self.fixtures()
                home = data[m.ORIGIN + '/']
                if case == 'http': home['status'] = 503
                elif case == 'sitemap': data[m.ORIGIN + '/sitemap.xml']['body'] = '<broken'
                elif case == 'robots': data[m.ORIGIN + '/robots.txt']['body'] = 'User-agent: *\nDisallow: /'
                elif case == 'canonical': home['body'] = home['body'].replace('rel="canonical"', 'rel="alternate"')
                elif case == 'title': home['body'] = home['body'].replace('<title>Anna</title>', '')
                elif case == 'json': home['body'] = home['body'].replace('{"@type":"WebSite"}', '{broken}')
                elif case == 'meta': home['body'] += '<meta name="robots" content="noindex">'
                elif case == 'header': home['headers'] = {'X-Robots-Tag': 'noindex'}
                elif case == 'link': home['body'] += '<a href="/missing">Missing</a>'
                elif case == 'missing': data[m.ORIGIN + '/sitemap.xml']['body'] = data[m.ORIGIN + '/sitemap.xml']['body'].replace(m.ORIGIN + '/</loc>', m.ORIGIN + '/other</loc>')
                self.assertEqual(m.exit_code(self.check(data)), 1)

    def test_warning_does_not_fail(self):
        data = self.fixtures()
        data[m.ORIGIN + '/']['body'] = data[m.ORIGIN + '/']['body'].replace('<meta name="description" content="Studio">', '')
        findings = self.check(data)
        self.assertTrue(any(item[0] == 'WARNUNG' for item in findings))
        self.assertEqual(m.exit_code(findings), 0)

    def test_real_process_exit_and_report(self):
        script = str(Path(m.__file__).resolve())
        for level, expected in [('INFO', 0), ('WARNUNG', 0), ('FEHLER', 1)]:
            with self.subTest(level=level), tempfile.TemporaryDirectory() as directory:
                report = str(Path(directory) / 'report.md')
                code = f"import runpy,sys; n=runpy.run_path({script!r}); n['main'].__globals__['audit']=lambda **kw: [({level!r},'fixture','simuliert')]; sys.argv=['monitor','--report',{report!r}]; sys.exit(n['main']())"
                result = subprocess.run([sys.executable, '-c', code], capture_output=True, text=True)
                self.assertEqual(result.returncode, expected, result.stderr)
                self.assertIn(level, Path(report).read_text())

    def test_network_error_retried_then_fails(self):
        with patch.object(m.urllib.request, 'urlopen', side_effect=OSError('offline')) as request, patch.object(m.time, 'sleep'):
            self.assertEqual(m.fetch(m.ORIGIN)['status'], 0)
            self.assertEqual(request.call_count, 2)

    def test_foreign_sitemap_url_not_requested(self):
        data = self.fixtures()
        data[m.ORIGIN + '/sitemap.xml']['body'] = data[m.ORIGIN + '/sitemap.xml']['body'].replace(m.ORIGIN, 'https://example.org')
        requested = []
        def get(url):
            requested.append(url)
            return data.get(url, {'status': 404})
        self.assertEqual(m.exit_code(m.audit(get)), 1)
        self.assertTrue(all(url.startswith(m.ORIGIN + '/') for url in requested))

if __name__ == '__main__':
    unittest.main()
