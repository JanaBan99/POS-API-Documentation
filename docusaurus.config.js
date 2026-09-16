import { themes as prismThemes } from 'prism-react-renderer';
import remarkTenantReplace from './src/plugins/remark-tenant-replace.js';
import { profile, replaceText } from './tenant.js';
import gioFiles from './src/plugins/gio-files.js';
import { execSync } from 'child_process';

// Convert OpenAPI spec YAML to JSON for Redocly rendering, applying tenant branding
try {
  console.log('Generating api_spec.json from api_spec.yaml...');
  execSync('python convert_spec.py', { stdio: 'inherit' });
} catch (err) {
  console.error('Failed to convert api_spec.yaml to JSON:', err);
}

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
    parseFrontMatter: (params) =>
      params.defaultParseFrontMatter({ ...params, fileContent: replaceText(params.fileContent) }),
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
      navbar: {
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