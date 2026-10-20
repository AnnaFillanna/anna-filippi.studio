import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import vm from 'node:vm';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { transformWithEsbuild } from 'vite';

test('legal text renders in full as escaped text, including special characters and line breaks', async () => {
 const source=(await readFile('src/components/LegalPages/LegalDocument.tsx','utf8')).replace("import './legal.scss';",'');
 const {code}=await transformWithEsbuild(source,'LegalDocument.tsx',{loader:'tsx',format:'cjs',jsx:'automatic'});
 const context={module:{exports:{}},require:createRequire(import.meta.url)};
 vm.runInNewContext(code,context);
 const text='Ä & <script>alert(1)</script>\n'+('Vollständige Testzeile\n'.repeat(500))+'ENDE';
 const html=renderToStaticMarkup(React.createElement(context.module.exports.LegalText,{text}));
 assert.ok(!html.includes('<script>'));
 assert.ok(html.includes('&lt;script&gt;'));
 assert.equal((html.match(/Vollständige Testzeile/g)||[]).length,500);
 assert.ok(html.includes('ENDE</div>'));
 assert.ok(html.includes('Ä &amp;'));
});

test('loading failures show a German retry message and clear the request timeout', async () => {
  const source = (await readFile('src/components/LegalPages/LegalDocument.tsx', 'utf8')).replace("import './legal.scss';", '');
  const { code } = await transformWithEsbuild(source, 'LegalDocument.tsx', { loader: 'tsx', format: 'cjs', jsx: 'automatic' });
  for (const scenario of ['html-error', 'invalid-json', 'null-document', 'timeout', 'missing']) {
    const values = [];
    let effect, timeout, cleared = false;
    const realRequire = createRequire(import.meta.url);
    const context = {
      module: { exports: {} }, AbortController,
      require: name => name === 'react' ? {
        useState: initial => [initial, value => values.push(value)],
        useEffect: callback => { effect = callback; },
      } : realRequire(name),
      window: {
        setTimeout: callback => { timeout = callback; return 1; },
        clearTimeout: () => { cleared = true; },
        addEventListener() {}, removeEventListener() {},
      },
      document: { addEventListener() {}, removeEventListener() {} },
      fetch: async (_url, { signal }) => {
        if (scenario === 'timeout') return new Promise((_resolve, reject) => {
          signal.addEventListener('abort', () => reject(signal.reason));
        });
        return {
          ok: !['html-error', 'missing'].includes(scenario),
          status: scenario === 'missing' ? 404 : 502,
          json: async () => {
            if (scenario === 'null-document') return null;
            throw new Error('Unexpected token < / private infrastructure detail');
          },
        };
      },
    };
    vm.runInNewContext(code, context);
    context.module.exports.default({ type: 'impressum', title: 'Impressum' });
    const cleanup = effect();
    if (scenario === 'timeout') timeout();
    await new Promise(resolve => setImmediate(resolve));
    assert.equal(values.at(-1), scenario === 'missing'
      ? 'Dieser Rechtstext wurde noch nicht bereitgestellt.'
      : 'Der Rechtstext konnte nicht geladen werden. Bitte versuchen Sie es erneut.', scenario);
    assert.equal(cleared, true, scenario);
    cleanup();
  }
});
