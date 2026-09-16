/**
 * Docusaurus plugin: after each build, write the machine-readable files that
 * search engines and AI assistants look for, into that brand's output folder.
 *
 *   robots.txt      who may crawl, and where the sitemap is
 *   llms.txt        short index of the site for AI/coding assistants (one line per page)
 *   llms-full.txt   every page as plain text, in sidebar order
 *
 *   JSON-LD         structured data (WebSite, TechArticle/APIReference, FAQPage) injected into each page
 *
 * Everything is derived from sidebars.js + the docs/ sources + the brand profile,
 * so all three brands get correct copies with no hand-maintained files.
 * See PLAN_gio.md §4 Phase 1.
 */
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import sidebars from '../../sidebars.js';
import { profile, replaceText } from '../../tenant.js';

const AI_CRAWLERS = [
  'GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-User', 'anthropic-ai',
  'PerplexityBot', 'Google-Extended', 'Bingbot', 'Applebot-Extended', 'CCBot',
];

// Sidebar → ordered list of doc ids ("guides/oauth"), category pages excluded.
function docIds(items, out = []) {
  for (const item of items) {
    if (typeof item === 'string') out.push(item);
    else if (item.type === 'doc') out.push(item.id);
    else if (item.type === 'category') docIds(item.items, out);
  }
  return out;
}

const plain = (md) => md.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/[`*_]/g, '').trim();

// "## Frequently asked questions" section → [{ q, a }] (Step 8 pages)
function faqPairs(body) {
  const section = body.split(/^## /m).find((s) => s.startsWith('Frequently asked questions'));
  if (!section) return [];
  return section.split(/^### /m).slice(1).map((chunk) => {
    const [q, ...rest] = chunk.split('\n');
    return { q: plain(q), a: plain(rest.join('\n')) };
  });
}

// JSON-LD for one page: the site, what the page is, and (where present) its FAQ.
// (BreadcrumbList is not added here — Docusaurus already emits one on every doc page.)
function jsonLd(d, site, abs) {
  const url = abs(d.url);
  const website = { '@type': 'WebSite', '@id': `${site}/#website`, name: profile.siteTitle, url: `${site}/`,
    publisher: { '@type': 'Organization', name: profile.name, url: `${site}/`, logo: `${site}/img/${profile.imgDir}/logo.png` } };
  const graph = [website,
    { '@type': d.isRef ? ['TechArticle', 'APIReference'] : 'TechArticle', '@id': `${url}#article`, headline: d.title,
      description: d.description, url, inLanguage: 'en', isPartOf: { '@id': `${site}/#website` },
      ...(d.modified ? { dateModified: d.modified } : {}),
      about: { '@type': 'SoftwareApplication', name: `${profile.name} POS`, applicationCategory: 'BusinessApplication' },
      ...(d.isRef ? { targetPlatform: 'REST', documentation: `${site}/api_spec.json` } : {}) },
  ];
  const faq = faqPairs(d.body);
  if (faq.length) graph.push({ '@type': 'FAQPage', '@id': `${url}#faq`, mainEntity: faq.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) });
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph });
}

function readDoc(id) {
  const raw = fs.readFileSync(path.join('docs', `${id}.md`), 'utf8')
    .replace(/^﻿/, '')   // BOM
    .replace(/\r\n/g, '\n');  // CRLF
  const fm = /^---\n([\s\S]*?)\n---\n/.exec(raw);
  const meta = {};
  for (const line of (fm ? fm[1] : '').split('\n')) {
    const m = /^(\w+):\s*(.*)$/.exec(line);
    if (m) meta[m[1]] = m[2].trim().replace(/^["']|["']$/g, '');
  }
  const body = raw.slice(fm ? fm[0].length : 0)
    .replace(/^import .*$/gm, '')                 // MDX imports
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, '')         // {/* comments */}
    .replace(/<\/?(?:[A-Z]\w*|div)\b[^>]*>/g, '') // JSX tags: <TenantImage …/>, <Tabs>, <div …>
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  const firstParagraph = body.split('\n').find((l) => l && !/^[#>|:`\-*]/.test(l)) || '';
  let modified;
  try { modified = execSync(`git log -1 --format=%cI -- "docs/${id}.md"`, { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim() || undefined; } catch { /* not a git checkout */ }
  return {
    id, modified,
    isRef: /^API-reference\/[^/]+\/[^/]+$/.test(id) && !id.startsWith('API-reference/webhooks/overview'),
    title: meta.title || id,
    url: meta.slug || `/${id}`,
    // ponytail: falls back to the first paragraph until every page has a description (PLAN_gio §4 Phase 2a)
    description: meta.description || firstParagraph.replace(/[*_`]/g, '').slice(0, 160),
    body,
  };
}

export default function gioFiles() {
  return {
    name: 'gio-files',
    postBuild({ outDir }) {
      const site = profile.developerUrl.replace(/\/$/, '');
      const abs = (url) => site + (url === '/' ? '/' : url.replace(/\/$/, ''));
      const docs = docIds(sidebars.mainSidebar).map(readDoc);

      const robots = [
        'User-agent: *', 'Allow: /', 'Disallow: /search', '',
        '# AI assistants that fetch pages to answer questions are welcome',
        ...AI_CRAWLERS.map((ua) => `User-agent: ${ua}`), 'Allow: /', '',
        `Sitemap: ${site}/sitemap.xml`, '',
      ].join('\n');

      const intro = replaceText(
        `> Official REST API reference and integration guides for the ${profile.name} point-of-sale system. ` +
        `Base URL: ${profile.apiBaseUrl}. Authentication: Bearer token in the Authorization header ` +
        `(Personal Access Token or OAuth 2.0). Filters and pagination are sent as a JSON request body on every method, including GET.`);
      const llms = [
        `# ${profile.siteTitle}`, '', intro, '',
        '## Pages', '',
        ...docs.map((d) => `- [${replaceText(d.title)}](${abs(d.url)}): ${replaceText(d.description)}`), '',
        '## Machine-readable', '',
        `- [OpenAPI 3.0 specification](${site}/api_spec.json)`,
        `- [Full documentation as one text file](${site}/llms-full.txt)`, '',
      ].join('\n');

      const full = [
        `# ${profile.siteTitle} — full text`, '', intro, '',
        ...docs.map((d) => `\n---\n\n<!-- ${abs(d.url)} -->\n\n# ${replaceText(d.title)}\n\n${replaceText(d.body)}\n`),
      ].join('\n');

      fs.writeFileSync(path.join(outDir, 'robots.txt'), robots);
      fs.writeFileSync(path.join(outDir, 'llms.txt'), llms);
      fs.writeFileSync(path.join(outDir, 'llms-full.txt'), full);

      // Structured data: inject one JSON-LD block into each page's <head>.
      let tagged = 0;
      for (const d of docs) {
        const file = path.join(outDir, d.url === '/' ? '' : d.url, 'index.html');
        if (!fs.existsSync(file)) continue;
        const html = fs.readFileSync(file, 'utf8');
        const ld = replaceText(jsonLd({ ...d, title: replaceText(d.title), description: replaceText(d.description), body: replaceText(d.body) }, site, abs));
        fs.writeFileSync(file, html.replace('</head>', `<script type="application/ld+json">${ld}</script></head>`));
        tagged++;
      }
      console.log(`[gio-files] wrote robots.txt, llms.txt (${docs.length} pages), llms-full.txt; JSON-LD on ${tagged} pages in ${outDir}`);
    },
  };
}
