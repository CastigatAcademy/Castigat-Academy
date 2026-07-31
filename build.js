/*
 * Build Castigat Academy
 * ----------------------
 * Le code de l'app vit dans src-app.jsx (JSX lisible).
 * Ce script le compile en JS natif et l'injecte dans castigat-academy.html
 * entre les marqueurs APP_JS_START / APP_JS_END.
 *
 * Usage :  node build.js
 * Prérequis :  npm i esbuild  (une seule fois)
 */
const { buildSync } = require('esbuild');
const fs = require('fs');

// 1. Compiler le JSX
buildSync({
  entryPoints: ['src-app.jsx'],
  loader: { '.jsx': 'jsx' },
  jsx: 'transform',
  target: 'es2018',
  minifyWhitespace: true,
  minifySyntax: true,
  outfile: 'app-compiled.js',
});
const js = fs.readFileSync('app-compiled.js', 'utf8');

// 2. Injecter dans le HTML entre les marqueurs
const html = fs.readFileSync('castigat-academy.html', 'utf8');
const START = /<!-- APP_JS_START[^>]*-->/;
const END = '<!-- APP_JS_END -->';
const mStart = html.match(START);
const iStart = html.indexOf(mStart[0]);
const iEnd = html.indexOf(END) + END.length;
if (iStart < 0 || iEnd < END.length) throw new Error('Marqueurs APP_JS introuvables');

const block =
  mStart[0] + '\n<script>\n' + js + '\n</script>\n' + END;
const out = html.slice(0, iStart) + block + html.slice(iEnd);
fs.writeFileSync('castigat-academy.html', out);
console.log('OK — castigat-academy.html mis à jour (' + Math.round(out.length / 1024) + ' Ko)');
