/**
 * Post-build checks for the GIO work (PLAN_gio.md Phase 6).
 *
 *     node tools/gio_check.mjs salesplay|vendrex|sellmo
 *
 * Fails (exit 1) and prints one line per problem if:
 *   - a page under docs/ has no `description`, more than one H1, or a heading
 *     starting with a non-ASCII character (emoji);
 *   - build/<brand>/ is missing robots.txt, llms.txt, llms-full.txt, sitemap.xml or api_spec.json;
 *   - a link in llms.txt points to a page that is not in the build;
 *   - any html/json/txt/xml file in the build mentions another brand.
 */
import { readdirSync, readFileSync, existsSync, statSync } from 'fs';
import path from 'path';

const BRANDS = {   // key: [build folder, names/domains that must NOT appear in the other brands' output]
  salesplay: ['build/salesplay', ['SalesPlay', 'salesplaypos.com', 'developer.salesplay.com']],
  vendrex:   ['build/vendrex',   ['Vendrex', 'vendrex.com']],
  sellmo:    ['build/selmo',     ['Sellmo', 'backofficewebportal.com', 'sellmopos.com']],
};
const ORPHANS = ['docs/API-reference/Webhooks.md', 'docs/guides/authentication.md']; // PLAN_gio.md §11.2, not checked
const MACHINE_FILES = ['robots.txt', 'llms.txt', 'llms-full.txt', 'sitemap.xml', 'api_spec.json'];

const slash = (p) => p.split(path.sep).join('/');
const isFile = (p) => existsSync(p) && statSync(p).isFile();

/** Every file under dir whose name ends in one of exts, as paths relative to dir, using '/'. */
function walk(dir, exts) {
  return readdirSync(dir, { recursive: true, withFileTypes: true })
    .filter((d) => d.isFile() && exts.some((e) => d.name.endsWith(e)))
    .map((d) => slash(path.join(path.relative(dir, d.parentPath), d.name)));
}

function checkSources(problems) {
  for (const rel of walk('docs', ['.md']).sort()) {
    const f = `docs/${rel}`;
    if (ORPHANS.includes(f)) continue;
    const text = readFileSync(f, 'utf8').replace(/^﻿+/, '');
    const fm = /^---\r?\n([\s\S]*?)\r?\n---/.exec(text);
    if (!fm || !/^description:\s*\S/m.test(fm[1])) {
      problems.push(`${f}: no description in front matter`);
    }
    const body = (fm ? text.slice(fm[0].length) : text).replace(/```[\s\S]*?```/g, ''); // ignore code blocks
    const h1 = body.match(/^# /gm) || [];
    if (h1.length > 1) problems.push(`${f}: ${h1.length} H1 headings`);
    for (const m of body.matchAll(/^#{1,6} (\S)/gmu)) {   // /u so an emoji counts as one character
      if (m[1].codePointAt(0) > 127) {
        problems.push(`${f}: heading starts with a non-ASCII character: ${JSON.stringify(m[0])}`);
      }
    }
  }
}

function checkBuild(brand, problems) {
  const [out] = BRANDS[brand];
  if (!existsSync(out) || !statSync(out).isDirectory()) {
    problems.push(`${out}: build folder missing — run the build first`);
    return;
  }
  for (const name of MACHINE_FILES) {
    if (!isFile(path.join(out, name))) problems.push(`${out}/${name}: missing`);
  }
  const llms = path.join(out, 'llms.txt');
  if (isFile(llms)) {
    for (const m of readFileSync(llms, 'utf8').matchAll(/\]\((https?:\/\/[^)]+)\)/g)) {
      const url = m[1];
      const rel = url.replace(/^https?:\/\/[^/]+/, '').replace(/\/+$/, '');
      const target = path.join(out, rel.replace(/^\/+/, ''));
      if (!isFile(path.join(target, 'index.html')) && !isFile(target)) {
        problems.push(`${out}/llms.txt: link target not in build: ${url}`);
      }
    }
  }
  const foreign = Object.entries(BRANDS)
    .filter(([b]) => b !== brand)
    .flatMap(([, [, words]]) => words);
  const pattern = new RegExp(foreign.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'));
  for (const rel of walk(out, ['.html', '.json', '.txt', '.xml'])) {
    const p = path.join(out, rel);
    const hit = pattern.exec(readFileSync(p, 'utf8'));
    if (hit) problems.push(`${slash(p)}: mentions another brand (${hit[0]})`);
  }
}

const brand = (process.argv[2] || 'salesplay').toLowerCase();
if (!(brand in BRANDS)) {
  console.error(`unknown brand '${brand}'; expected one of ${Object.keys(BRANDS).join(', ')}`);
  process.exit(1);
}
const problems = [];
checkSources(problems);
checkBuild(brand, problems);
for (const p of problems) console.log('FAIL', p);
console.log(`gio_check ${brand}: ${problems.length ? `${problems.length} problem(s)` : 'OK'}`);
process.exit(problems.length ? 1 : 0);
