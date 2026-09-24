import { themes as prismThemes } from 'prism-react-renderer';
import remarkTenantReplace from './src/plugins/remark-tenant-replace.js';
import { profile, replaceText } from './tenant.js';
import gioFiles from './src/plugins/gio-files.js';
import yaml from 'js-yaml';
import { statSync, readFileSync, writeFileSync, mkdirSync } from 'fs';

// api_spec.yaml is always written as SalesPlay. Rewrite it for this brand with the
// same replaceText() rules every .md page gets, then hand Redocly the JSON it
// renders from. A broken spec now fails the build instead of leaving a stale file.
console.log('Generating api_spec.json from api_spec.yaml...');
mkdirSync('static', { recursive: true });
writeFileSync(
  'static/api_spec.json',
  JSON.stringify(yaml.load(replaceText(readFileSync('api_spec.yaml', 'utf8'))), null, 2),
);

// All brand facts come from .env.<TENANT> via tenant.js (single source of truth).
const { tenant: TENANT, name, imgDir } = profile;
// Owner line: who maintains the docs and how to reach them (PLAN_gio.md Phase 5). The
// email is written as SalesPlay and rewritten per brand by the host rule in tenant.js.
const footerCopyright = replaceText(`Copyright © ${new Date().getFullYear()} ${name}. Documentation maintained by the ${name} developer team — <a href="mailto:support@salesplaypos.com">support@salesplaypos.com</a>.`);

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: profile.siteTitle,
  tagline: '',

  favicon: `img/${imgDir}/${profile.favicon}`,

  future: {
    v4: true,
    // The rspack persistent cache is one shared folder. Only the default
    // tenant's dev server uses it, so tenants never read each other's
    // compiled pages and a build never corrupts a running dev server.
    faster: { rspackPersistentCache: TENANT === 'salesplay' && !process.argv.includes('build') },
  },

  url: profile.developerUrl,
  baseUrl: '/',

  // ✅ Expose TENANT to components via useDocusaurusContext
  customFields: {
    tenant: TENANT,
    imgDir,
  },

  markdown: {
    // Front matter (titles, descriptions) gets the same SalesPlay → brand rules as page text.
    parseFrontMatter: async (params) => {
      const result = await params.defaultParseFrontMatter({ ...params, fileContent: replaceText(params.fileContent) });
      // Dev server: Docusaurus skips git and shows a fixed placeholder ("Oct 14, 2018").
      // Use DEV_LAST_UPDATE (YYYY-MM-DD) if set, else the file's modification time.
      // Production builds still use the real git date.
      if (process.env.NODE_ENV !== 'production' && !result.frontMatter.last_update) {
        const date = process.env.DEV_LAST_UPDATE || statSync(params.filePath).mtime.toISOString().slice(0, 10);
        result.frontMatter.last_update = { date };
      }
      return result;
    },
  },

  organizationName: TENANT,
  projectName: `${TENANT}-docs`,

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      ({
        docs: {
          sidebarPath: './sidebars.js',
          routeBasePath: '/',
          beforeDefaultRemarkPlugins: [remarkTenantReplace],
          showLastUpdateTime: true, // from git history — a freshness signal for readers and crawlers
        },
        blog: false,
        sitemap: { lastmod: 'date', changefreq: null, priority: null },
        theme: {
          customCss: ['./src/css/custom.css', `./src/css/tenants/${TENANT}.css`],
        },
      }),
    ],
  ],

  // Writes robots.txt, llms.txt and llms-full.txt into build/<brand>/ (PLAN_gio.md Phase 1)
  plugins: [gioFiles],

  // Tell crawlers where the machine-readable API description is
  headTags: [
    { tagName: 'link', attributes: { rel: 'alternate', type: 'application/json', href: '/api_spec.json', title: 'OpenAPI specification' } },
  ],

  themes: [
    [
      '@easyops-cn/docusaurus-search-local',
      {
        hashed: true,            // cache-bust the index on each build
        docsRouteBasePath: '/',  // docs are served at the site root
        indexBlog: false,
        indexPages: false,
        highlightSearchTermsOnTargetPage: true,
        searchResultLimits: 10,
        explicitSearchResultPath: true,
      },
    ],
  ],

  themeConfig:
    ({
      colorMode: {
        respectPrefersColorScheme: true,
      },
      docs: {
        sidebar: {
          autoCollapseCategories: true,
        },
      },
      navbar: {
        title: 'Developer Portal',
        logo: {
          alt: `${name} Logo`,
          src: `img/${imgDir}/logo.png`,
        },
        items: [],
      },
      footer: {
        style: 'dark',
        copyright: footerCopyright,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;