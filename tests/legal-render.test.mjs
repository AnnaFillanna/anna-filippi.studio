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
