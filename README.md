# POS API Documentation — SalesPlay · Vendrex · Sellmo

> **Deploying to a production server?** Follow [DEPLOYMENT.md](DEPLOYMENT.md) — Ubuntu setup, the three `.env` files, building and publishing each site independently, Nginx, HTTPS, updates and rollback.

Developer documentation website for the SalesPlay point-of-sale REST API and its two sister brands, **Vendrex** and **Sellmo**. One set of source pages, written as SalesPlay, is built three times — once per brand — into three separate static websites with the brand's own name, web addresses, logo, colours and screenshots.

Built with [Docusaurus 3](https://docusaurus.io/). Pages are Markdown/MDX under `docs/`; the 53 endpoint reference pages are generated from `api_spec.yaml`.

| Brand | Documentation site | Build command | Output folder |
|---|---|---|---|
| SalesPlay | https://developer.salesplay.com | `npm run build` | `build/salesplay/` |
| Vendrex | https://developer.vendrex.com | `npm run build:vendrex` | `build/vendrex/` |
| Sellmo | https://developer.backofficewebportal.com | `npm run build:sellmo` | `build/selmo/` |

**Further reading:** `TENANT_GUIDE.md` (how the brand system works, for anyone), `HANDBOOK.md` (everything about the project), `RECORDED_ISSUES.md` (known wrong facts still to fix), `PLAN_gio.md` (AI-discoverability work).

---

## 1. Prerequisites

| Tool | Version | Why |
|---|---|---|
| [Node.js](https://nodejs.org/) | **20.12 or newer** (22 recommended) | runs Docusaurus; the built-in `.env` loader needs ≥ 20.12 |
| npm | comes with Node | installs dependencies and runs the commands below |
| Git | any | optional, but "last updated" dates on pages and in the sitemap come from git history |

Check: `node --version`, `npm --version`.

Nothing else is needed — the whole toolchain is Node. There is no Python in this repository.

---

## 2. First-time setup

```bash
git clone https://github.com/JanaBan99/POS-API-Documentation.git
cd POS-API-Documentation
npm install
```

### Brand configuration files (required — not in the repository)

Each brand's facts (name, URLs, title, favicon, image folder) live in a small text file at the project root named `.env.<brand>`. **These files are git-ignored, so a fresh clone does not have them.** Create all three before building:

```bash
cp .env.example .env.salesplay
cp .env.example .env.vendrex
cp .env.example .env.sellmo
```

then edit each one. `.env.example` is filled with the SalesPlay values, so `.env.salesplay` needs no change; for the other two set every line to that brand's values. Every line is required — the build stops with `TENANT_… is missing — check .env.<brand>` if one is absent.

| Line | Meaning | Vendrex value | Sellmo value |
|---|---|---|---|
| `TENANT` | brand key; must equal the file suffix | `vendrex` | `sellmo` |
| `TENANT_NAME` | brand name written in the text | `Vendrex` | `Sellmo` |
| `TENANT_HOST` | main web domain | `vendrex.com` | `sellmopos.com` |
| `TENANT_API_BASE_URL` | API base URL | `https://api.vendrex.com/v1.0` | `https://api.backofficewebportal.com/v1.0` |
| `TENANT_BACKOFFICE_URL` | where merchants log in | `https://platform.vendrex.com/` | `https://sellmo.backofficewebportal.com/` |
| `TENANT_DEVELOPER_URL` | URL of the docs site itself | `https://developer.vendrex.com` | `https://developer.backofficewebportal.com` |
| `TENANT_SITE_TITLE` | browser-tab title | `Vendrex Documentation` | `Sellmo Documentation` |
| `TENANT_POSTMAN_URL` | Postman collection download link | `https://developer.vendrex.com/download_postman_collection.php` | `https://developer.backofficewebportal.com/download_postman_collection.php` |
| `TENANT_FAVICON` | favicon file name in the brand's image folder | `favicon.png` | `favicon.png` |
| `TENANT_IMG_DIR` | folder under `static/img/` with the brand's screenshots | `vendrex` | `selmo` |

Note the Sellmo image folder is spelled **`selmo`** while the brand key is `sellmo`; `TENANT_IMG_DIR` bridges the two. Never put a password or API token in these files — a personal, also-ignored `.env` (no suffix) is the place for secrets a script may need.

---

## 3. Building each brand (npm)

Every command below is run from the project root. Each brand builds into **its own folder** under `build/`, so building one brand never overwrites another.

### SalesPlay

```bash
npm run build
```
→ `build/salesplay/` — upload its **contents** to developer.salesplay.com.

### Vendrex

```bash
npm run build:vendrex
```
→ `build/vendrex/` — upload its contents to developer.vendrex.com.

### Sellmo

```bash
npm run build:sellmo
```
→ `build/selmo/` — upload its contents to developer.backofficewebportal.com.

### All three, then check them

```bash
npm run build && npm run build:vendrex && npm run build:sellmo
npm run check
```

`npm run check` (or `check:salesplay`, `check:vendrex`, `check:sellmo`) runs `tools/gio_check.mjs` on each finished build and **fails with one line per problem** if any file in a brand's output mentions another brand, a machine-readable file is missing, a link in `llms.txt` points nowhere, or a page has no `description`, more than one H1, or an emoji heading. Run it before uploading.

### What a build does

1. Reads `.env.<brand>` (via `tenant.js`) — no `TENANT` set means SalesPlay.
2. Converts `api_spec.yaml` to `static/api_spec.json` with the brand's API host (inline in `docusaurus.config.js`, using `js-yaml` and the same `replaceText` rules as the pages).
3. Compiles every page, replacing SalesPlay's name and URLs with the brand's, and pointing each screenshot at `static/img/<brand folder>/` (falling back to `static/img/shared/`).
4. Writes the site to `build/<brand>/`, then adds `robots.txt`, `llms.txt`, `llms-full.txt`, a dated `sitemap.xml`, and JSON-LD structured data on every page (`src/plugins/gio-files.js`).

A build takes roughly one to two minutes.

---

## 4. Working on the docs locally (dev server)

Live preview with hot reload — edits to pages, images and CSS appear instantly:

| Brand | Command | Opens at |
|---|---|---|
| SalesPlay | `npm start` | http://localhost:3000 |
| Vendrex | `npm run start:vendrex` | http://localhost:3001 |
| Sellmo | `npm run start:sellmo` | http://localhost:3002 |

All three can run at the same time in separate terminals. **Restart the server after changing** `docusaurus.config.js`, `tenant.js`, any `.env.*` file, `package.json`, `sidebars.js` or anything in `src/plugins/` or `src/theme/` — those are read only at start-up.

Search only works on a *built* site. To test it locally, build and serve in one step:

| Brand | Command | Opens at |
|---|---|---|
| SalesPlay | `npm run preview` | http://localhost:3003 |
| Vendrex | `npm run preview:vendrex` | http://localhost:3004 |
| Sellmo | `npm run preview:sellmo` | http://localhost:3005 |

---

## 5. All commands

| Command | What it does |
|---|---|
| `npm install` | install dependencies (once, and after `package.json` changes) |
| `npm start` / `start:vendrex` / `start:sellmo` | dev server for a brand on :3000 / :3001 / :3002 |
| `npm run build` / `build:vendrex` / `build:sellmo` | production build into `build/salesplay/` / `build/vendrex/` / `build/selmo/` |
| `npm run preview` / `preview:vendrex` / `preview:sellmo` | build, then serve the result on :3003 / :3004 / :3005 (search works here) |
| `npm run serve` | serve an existing `build/salesplay/` without rebuilding |
| `npm run check` / `check:<brand>` | post-build checks (brand leaks, machine files, descriptions, headings) |
| `node gen_api_docs.mjs` | regenerate the 53 endpoint pages from `api_spec.yaml` — never edit those pages by hand |
| `npx docusaurus clear` | wipe caches — run if a dev server shows a stale brand or crashes with an rspack "Panic" |

---

## 6. Where things are

```
docs/                       all pages (Markdown / MDX), written as SalesPlay
  Introduction.md           landing page
  guides/                   how-to guides (hand-written)
  API-reference/            reference: <group>/*.md are GENERATED from api_spec.yaml; index, pagination,
                            rate-limits, date-time-format and webhooks/* are hand-written
  glossary.md, changelog.md
api_spec.yaml               OpenAPI 3.0 spec — the source of the reference pages and of static/api_spec.json
gen_api_docs.mjs            api_spec.yaml → docs/API-reference/<group>/*.md (run by hand)
tenant.js                   reads .env.<brand>; the SalesPlay→brand text rules and the image resolver
.env.example                template for the three .env.<brand> files (which are NOT committed)
docusaurus.config.js        site config; brand values come from tenant.js
sidebars.js                 left-hand navigation
src/plugins/remark-tenant-replace.js   applies the brand text rules and image folders to every page
src/plugins/gio-files.js    writes robots.txt, llms.txt, llms-full.txt and JSON-LD into each build
src/components/             TenantImage (brand-aware screenshot), TenantBlock (hide a paragraph for a brand)
src/theme/                  DocCategoryGeneratedIndexPage (category pages without tiles)
src/css/custom.css          shared styling;  src/css/tenants/<brand>.css  brand colours
static/img/salesplay|vendrex|selmo/    screenshots, logo, favicon per brand — same file names in each
static/img/shared/          brand-neutral screenshots (Postman)
tools/gio_check.mjs         the post-build checker behind `npm run check`
build/<brand>/              build output (not committed)
```

---

## 7. Writing rules (the short version)

1. **Always write "SalesPlay"** and SalesPlay's URLs in source files — the build turns them into the brand. Never type "Vendrex" or "Sellmo" in a page (except inside a `<TenantBlock>` that hides it from every other brand).
2. Screenshots: `<TenantImage src="/img/<name>.png" alt="…" />` — no brand folder in the path; save the file under the same name in each brand's folder.
3. Brand-specific wording: `<TenantBlock hide="salesplay"> … </TenantBlock>` (blank line after the opening tag and before the closing tag).
4. Every page has a one-sentence `description:` in its front matter; headings have no emoji.
5. Don't hand-edit `docs/API-reference/<group>/*.md` — change `api_spec.yaml` and run `node gen_api_docs.mjs`.
6. Facts you're not sure of go in `RECORDED_ISSUES.md`, not in a page.

Full rules and explanations: `TENANT_GUIDE.md` §15, `HANDBOOK.md` §13.

---

## 8. Troubleshooting

| Symptom | Fix |
|---|---|
| `TENANT_… is missing — check .env.<brand>` | Create or complete the `.env.<brand>` file (section 2) |
| `Cannot find package 'js-yaml'` | Run `npm ci` (or `npm install`) — the spec converter imports it |
| Dev server crashes with an rspack **"Panic"** or shows the wrong brand | Stop it, `npx docusaurus clear`, delete `.docusaurus-<brand>` if it persists, start again |
| A change to `.env.*` or the config has no effect | Restart the dev server |
| `npm run check` reports "mentions another brand" | A page has a sister brand's name typed in it, or a `<TenantBlock>` is missing — write it as SalesPlay |
| Search box says the index is only available after build | Expected in `npm start`; use `npm run preview` |
