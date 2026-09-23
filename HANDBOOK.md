# SalesPlay API Documentation — Complete Handbook

*Everything about this documentation project in one place: what it is, how it works, what was changed and verified, what is planned, and how to do the everyday tasks. Written so that a new team member — developer or not — can read it top to bottom and understand the whole thing.*

Last updated: 2026-09-15

---

## Table of contents

1. [What this project is](#1-what-this-project-is)
2. [The three brands](#2-the-three-brands)
3. [How the site is built](#3-how-the-site-is-built)
4. [Folder map](#4-folder-map)
5. [How the API reference pages are made](#5-how-the-api-reference-pages-are-made)
6. [How one source becomes three branded sites](#6-how-one-source-becomes-three-branded-sites)
7. [Everyday tasks (how do I…)](#7-everyday-tasks-how-do-i)
8. [What the live API actually does (verified facts)](#8-what-the-live-api-actually-does-verified-facts)
9. [Endpoint verification status](#9-endpoint-verification-status)
10. [Work completed (changelog)](#10-work-completed-changelog)
11. [Known problems and open items](#11-known-problems-and-open-items)
12. [Plans on the table](#12-plans-on-the-table)
13. [Writing rules](#13-writing-rules)
14. [Things we still need from the SalesPlay / API team](#14-things-we-still-need-from-the-salesplay--api-team)
15. [Glossary](#15-glossary)
16. [File index](#16-file-index)

---

## 1. What this project is

This repository produces the public **developer documentation website** for the SalesPlay point-of-sale REST API — the site a software developer reads when they want to connect their own system (an online store, an accounting package, a delivery app) to a SalesPlay account.

The same source also produces the documentation sites for two sister brands, **Vendrex** and **Sellmo**, which run the same API under different names, colours, web addresses and Backoffice portals.

The site has three kinds of pages:

| Kind | Where | What it answers |
|---|---|---|
| **Introduction** | `docs/Introduction.md` | What is this API, where do I start |
| **How-to guides** | `docs/guides/` | "How do I get a token / set up categories / process orders / go live…" — task-shaped, friendly, with code in six languages |
| **API reference** | `docs/API-reference/` | One page per endpoint (53 of them): exact request fields, example calls, exact responses. Plus concept pages: pagination, rate limits, date formats, webhooks |

The live sites are (or will be):

| Brand | Documentation site | API base URL | Backoffice (where merchants log in) |
|---|---|---|---|
| SalesPlay | https://developer.salesplay.com | `https://api.salesplaypos.com/v1.0` | https://cloud.salesplaypos.com/ |
| Vendrex | https://developer.vendrex.com | `https://api.vendrex.com/v1.0` | https://platform.vendrex.com/ |
| Sellmo | https://developer.backofficewebportal.com | `https://api.backofficewebportal.com/v1.0` | https://sellmo.backofficewebportal.com/ |

Today the SalesPlay and Vendrex sites are Redoc pages generated from an OpenAPI file. This project replaces them with a richer Docusaurus site (guides + reference), one build per brand.

---

## 2. The three brands

"Tenant" is the word the code uses for "brand". Everything is written **once, as SalesPlay**, and the build turns it into the Vendrex or Sellmo version.

| | SalesPlay | Vendrex | Sellmo |
|---|---|---|---|
| Colour | blue `#0b4d92` | green `#09d83f` (links use darker `#068a28` for readability), purple `#39005b` accent | blue `#0e4d90` |
| Logo | `static/img/salesplay/logo.png` | `static/img/vendrex/logo.png` | `static/img/selmo/logo.png` |
| Favicon | `salesplay/favicon.ico` | `vendrex/favicon.png` | `selmo/favicon.png` |
| Backoffice screenshots | 8 in `static/img/salesplay/` | 7 in `static/img/vendrex/` (captured from the real Backoffice) | 7 in `static/img/selmo/` (captured from the real Backoffice) |
| Brand facts (name, URLs) | `.env.salesplay` | `.env.vendrex` | `.env.sellmo` |
| Backoffice menu names | *Integrations › Access tokens* / *OAuth 2.0 token* | *Integrations › Developer Tools › API keys* / *OAuth Apps* | same as Vendrex |
| Public sign-up page | yes (`registration_form`) | no | yes |
| Local dev server | `npm start` → http://localhost:3000 | `npm run start:vendrex` → :3001 | `npm run start:sellmo` → :3002 |
| Production build | `npm run build` | `npm run build:vendrex` | `npm run build:sellmo` |

Where a Backoffice differs (menu names), the guide text has one paragraph per brand, switched by a `<TenantBlock>` component (see §6).

---

## 3. How the site is built

- **Docusaurus 3.10** (a static-site generator by Meta, React-based). Pages are Markdown/MDX files under `docs/`. The build outputs plain HTML into `build/<brand>/` (one folder per brand), which is uploaded to that brand's web host.
- **Node.js ≥ 20** and **Python 3** are required locally (Python runs the two helper scripts).
- **Local search** (`@easyops-cn/docusaurus-search-local`): search box in the navbar, works entirely in the browser. The index is built only by `npm run build`; in `npm start` the box shows "index only available after build" — that's normal. Use `npm run preview` (SalesPlay, :3003), `npm run preview:vendrex` (:3004) or `npm run preview:sellmo` (:3005) to test search locally.
- **Theme**: Docusaurus "classic" with Infima CSS. Brand colours are CSS variables in `src/css/tenants/<brand>.css`; shared styling (method badges, endpoint bar, required markers, brand-coloured code strings) is in `src/css/custom.css`.
- **Faster mode** (rspack bundler) is on. Only the SalesPlay *dev server* uses the persistent compile cache; builds and other brands don't, so they can never corrupt each other or leak each other's text (that bug happened once and is fixed).

### Commands

| Command | What it does |
|---|---|
| `npm install` | install dependencies (once) |
| `npm start` | SalesPlay dev server with hot reload, http://localhost:3000 |
| `npm run start:vendrex` / `start:sellmo` | same for the other brands on :3001 / :3002 (can run at the same time) |
| `npm run build` / `build:vendrex` / `build:sellmo` | production build into `build/salesplay/`, `build/vendrex/`, `build/selmo/` (each brand has its own output and generated-files dir, so a build never overwrites another brand or disturbs a running dev server) |
| `npm run preview` / `preview:vendrex` / `preview:sellmo` | build, then serve the result on :3003 / :3004 / :3005 — the only way to test search locally |
| `node gen_api_docs.mjs` | regenerate the 53 endpoint pages from `api_spec.yaml` |
| `npm run check` / `check:<brand>` | after a build: fails if any file mentions another brand, a machine file is missing, or a page lacks a `description` / has an emoji heading (`tools/gio_check.mjs`) |
| `npx docusaurus clear` | wipe caches — run this if a server shows the wrong brand's text or an rspack "Panic" |

**Rule:** after any change to `docusaurus.config.js`, `tenant.js`, a `.env.*` file, `package.json`, `sidebars.js` or anything in `src/plugins/`, stop and restart the dev server. Hot reload covers only content and CSS.

---

## 4. Folder map

```
my-docs/
├─ docs/                          all pages (Markdown / MDX)
│  ├─ Introduction.md
│  ├─ guides/                     how-to guides (hand-written)
│  │   getting-started.md, personal-access-tokens.md, oauth.md, versioning.md,
│  │   categories.md, product.md, order-integration.md, receipt.md,
│  │   going-live.md, errors-guide.md, webhooks-guide.md, authentication.md*
│  └─ API-reference/
│      index.md                   the "API Reference" overview table (hand-written)
│      pagination.md, rate-limits.md, date-time-format.md   (hand-written)
│      Webhooks.md*               (orphaned duplicate, see §11)
│      webhooks/                  overview.md, payload.md, testing.md, retries.md (hand-written)
│                                 + get-webhook.md, create-webhook.md, delete-webhook.md (GENERATED)
│      categories/ … merchant/    one folder per collection, GENERATED endpoint pages
├─ api_spec.yaml                  THE source of truth for the reference (OpenAPI 3.0, 53 operations)
├─ gen_api_docs.mjs               turns api_spec.yaml into the endpoint pages
├─ sidebars.js                    left-hand navigation (order, grouping, method badges)
├─ docusaurus.config.js           site config, search; brand values come from tenant.js
├─ src/
│  ├─ components/TenantImage.js   picks the brand's screenshot
│  ├─ components/TenantBlock.js   hides a block of text for a brand
│  ├─ plugins/remark-tenant-replace.js   the "SalesPlay → Vendrex" find-and-replace
│  └─ css/custom.css, css/tenants/{salesplay,vendrex,sellmo}.css
├─ .env.salesplay / .env.vendrex / .env.sellmo   brand facts: name, URLs, title, favicon, image folder
├─ tenant.js                      reads .env.<TENANT>; the text-replacement rules and image resolver
├─ static/img/                    salesplay/, vendrex/, selmo/ (same file names), shared/ (Postman screens)
├─ build/                         salesplay/, vendrex/, selmo/ — build output per brand (not committed)
├─ README.md, TENANT_GUIDE.md, HANDBOOK.md (this file)
├─ PLAN_api_reference.md          executed plan (reference migration)
├─ DOCS_IMPROVEMENT_PLAN.md       strategy for making the docs excellent
├─ DOCS_BACKLOG.md                ticket-sized work list
└─ PLAN_tenant_assets_env.md      executed 2026-09-15: per-brand image folders + .env config (history)
```
`*` = not in the sidebar; candidates for deletion.

---

## 5. How the API reference pages are made

1. **`api_spec.yaml`** describes every endpoint: path, method, description, request fields (type, required, description, enum, example), and responses. It started as a copy of the file behind developer.salesplay.com, merged with the newer live version, and has since been corrected by calling the real API (§8).
2. **`node gen_api_docs.mjs`** reads the spec and writes one Markdown page per operation into `docs/API-reference/<group>/<slug>.md`. The mapping of operation → file name → page title is the `PAGES` table at the top of the script.
3. Each generated page has the same layout (modelled on PayPal's reference):
   - title, description, **method badge + full URL**
   - Authorization line
   - request body table — `required` markers, types, enums, defaults; nested objects in collapsible "child attributes" blocks
   - a callout on GET/DELETE pages: *filters go in the JSON body* (see §8)
   - Example request in six tabs: cURL, JavaScript, Python, PHP, Java, C#
   - Responses in tabs: `200` from the spec, plus `400`, `401`, `429` added automatically with real examples
4. **Never edit a generated page by hand** — the next run of the script overwrites it. Change the spec, re-run the script, check the page.
5. Hand-written reference pages (`index.md`, `pagination.md`, `rate-limits.md`, `date-time-format.md`, `webhooks/overview|payload|testing|retries.md`) are safe to edit directly.
6. The sidebar (`sidebars.js`) lists every generated page explicitly with a `className` that draws the GET/POST/DEL badge. Adding a new endpoint = add it to `PAGES` in the script **and** to `sidebars.js` **and** (optionally) to the overview table in `index.md`. Each collection also has an auto-generated overview page (`link: generated-index`) reached by clicking the collection name.

---

## 6. How one source becomes three branded sites

The brand is chosen by the `TENANT` environment variable at build/start time (`package.json` scripts set it). Then:

**Brand facts** (name, main domain, API base URL, Backoffice URL, docs-site URL, title, Postman link, favicon name, image folder) live in one file per brand: `.env.salesplay`, `.env.vendrex`, `.env.sellmo`. `tenant.js` reads the right one and everything else (config, text replacement, spec converter) takes its values from there. Changing a brand's URL = editing one line, no code.

**Text.** A remark plugin (`src/plugins/remark-tenant-replace.js`) rewrites every page while it's compiled, whole URLs first so Sellmo's unusual API host works, bare words last:
1. `https://api.salesplaypos.com/v1.0` → the brand's API base URL (Sellmo: `https://api.backofficewebportal.com/v1.0`)
2. `https://cloud.salesplaypos.com` → the brand's Backoffice URL
3. `https://developer.salesplay.com` → the brand's docs site
4. `SalesPlay` → `Vendrex` · `SALESPLAY` → `VENDREX` · `salesplaypos.com` → `vendrex.com` · `salesplay` → `vendrex`

It covers normal text, headings, links, code samples, tables, front matter and JSX attributes (e.g. image `alt` text) — but not the `hide` attribute of `<TenantBlock>`. **Therefore: always write "SalesPlay" in source files, never a sister brand's name** — nothing replaces in the other direction.

**Images.** `<TenantImage src="/img/login.png" />` is resolved at build time to `/img/<brand folder>/login.png` if that file exists, else `/img/shared/login.png`. Folders: `static/img/salesplay/`, `vendrex/`, `selmo/` (same file names in each) and `shared/` (Postman screens). A brand can never show another brand's screenshot. Giving a brand its own screenshot = save a file with the same name in its folder.

**Brand-specific paragraphs.** `<TenantBlock hide={['vendrex','sellmo']}> … </TenantBlock>` hides its content on Vendrex and Sellmo; `hide="salesplay"` shows it only on them. Used where the Backoffice menus differ (Sellmo's Backoffice matches Vendrex's). Keep a blank line inside the tags or the Markdown won't render.

**Colours** come from `src/css/tenants/<tenant>.css`, selected by the config's `customCss` array — the one brand fact not in `.env`, because CSS can't read it.

Full detail with examples: `TENANT_GUIDE.md`.

---

## 7. Everyday tasks (how do I…)

**…fix a wrong field description on an endpoint page?**
Edit the field's `description` in `api_spec.yaml` → `node gen_api_docs.mjs` → check the page in the dev server.

**…add a new endpoint?**
Add the path/operation to `api_spec.yaml` → add a line to `PAGES` in `gen_api_docs.mjs` (doc id, method, path, title) → run the script → add the doc id to `sidebars.js` in the right category with `className: 'api-method api-method--get'` → add a row to `docs/API-reference/index.md` if it's a new collection.

**…change a guide?**
Edit the file under `docs/guides/`. Write "SalesPlay". Use `<TenantImage>` for screenshots and `<TenantBlock>` for brand-specific steps. Links between pages are relative `.md` links (`../API-reference/pagination.md`), never `/docs/…`.

**…add or replace a screenshot?**
~1900 px wide, light theme, no personal data. Save it under the same file name in each brand folder (`static/img/salesplay/`, `vendrex/`, `selmo/`), or in `static/img/shared/` if it is the same for every brand. Then reference it with `<TenantImage src="/img/<name>.png" alt="…" />`.

**…change a brand's colour?**
Edit the seven `--ifm-color-primary*` values in `src/css/tenants/<brand>.css` (light block and `[data-theme='dark']` block). Generate shades from one hex at https://docusaurus.io/docs/styling-layout#styling-your-site-with-infima. Code-sample strings automatically take the brand colour.

**…check the docs against the real API?**
The checker script (`check_api.py`, currently outside the repo — backlog item 4.1 moves it to `tools/`) calls every GET endpoint with a token from the `SP_TOKEN` environment variable and prints the field differences against the spec. Never commit a token.

**…publish?**
`npm run build` (or `build:vendrex` / `build:sellmo`) → upload the contents of `build/salesplay/` (or `build/vendrex/` / `build/selmo/`) to that brand's web host. The Vendrex and Sellmo hosts are placeholders until DNS/hosting is set up.

**…recover from a broken dev server?**
Stop it, `npx docusaurus clear`, start again. Causes seen so far: config changed while running; a build run at the same time as the dev server (now prevented); rspack cache corruption (now prevented).

---

## 8. What the live API actually does (verified facts)

All of these were established on 2026-09-14 by calling `https://api.salesplaypos.com/v1.0` with a test account. Several contradict the old documentation (and the current Redoc site). **Do not "correct" them back.**

| Fact | Evidence |
|---|---|
| **Filters, ids and pagination are sent as a JSON request body on every method — including GET and DELETE. Query-string parameters are ignored.** | `GET /measurements?limit=1` returned all 3 rows; the same with body `{"limit":"1"}` returned 1. `GET /receipts?created_at_min=…` → "Created min at can not be blank". |
| `cursor` is **always** returned; the last page is an **empty array**. | Paging measurements with limit 1: pages 1–3 have data, page 4 is `[]` with a cursor still present. |
| `receipts`, `void_receipts`, `credit_note_and_refund`, `orders` **require** `created_at_min` and `created_at_max`. A 6-year range is rejected ("requested date range is not supported"); 12 months is accepted. | |
| Date formats accepted: `YYYY-MM-DD HH:MM:SS` and `YYYY-MM-DD`. ISO-8601 `2026-09-01T00:00:00Z` is **rejected** ("Invalid date Format."). | |
| The token can be sent as `Authorization: Bearer <token>` **or** `Token: Bearer <token>` (the Postman collection uses the latter). | both return 200 |
| Error body: `{"errors":{"code":"…","details":"…","field":"…"}}` (`field` on validation errors). Codes seen: `UNAUTHORIZED`, `INVALID_VALUE`, `INVALID_FORMAT`, `BAD_REQUEST`. Some endpoints return validation errors with status **401**, not 400. | |
| **No** `X-Request-ID` response header. **No** `PUT /webhooks` (405). The endpoint is `/merchant`, not `/merchants` (404). | |
| `POST /products` returns `[{"code":"SUCCESS","details":"Product successfully added","product_ids":[{"product_code":…,"product_id":…}]}]`. | created `DOC-TEST-001` — still in the test account, delete when convenient |
| Order-type delete is a soft delete: re-creating the same name restores the same id. | |
| Webhook `type` must be `receipts.update`; `status` comes back `ENABLED`/`DISABLED` (created via API → `DISABLED`). | |
| Supplier names accept only letters, digits, `.` and `_`. `payment_type_category` must be `Card`, `Cheque` or `Other`. Default payment types cannot be deleted. | |
| Rate limit "300 requests / 300 s" **did not trigger**: 360 requests in 54 s all returned 200. | documented as a caution on the rate-limits page |
| The Postman collection sends filters as a raw JSON body on GET requests too, has no collection-level auth, and names requests in lowercase (folder *Shops* → request *shops*). Vendrex serves the identical collection. | |

---

## 9. Endpoint verification status

53 operations. ✅ = real response compared field-by-field with the spec and fixed. ⚠️ = endpoint answers 200 but the account had no data, so the item shape is unverified. ❌ = never called successfully.

| Group | Status |
|---|---|
| Webhooks GET/POST/DELETE · Categories GET · Sub categories GET/POST/DELETE · Measurements GET/POST/DELETE · Taxes GET/POST/DELETE · Customers GET/POST/DELETE · Employee GET · Suppliers GET · Products GET/POST · Shops GET · Payment types GET · Order types GET/POST/DELETE · POS devices GET · Merchant GET | ✅ (26) |
| Receipts, void receipts, credit notes GET · Orders GET · Modifiers GET · GRN GET · Inventory GET · Online order status GET · Shifts GET · Drawer transactions GET · Timecards GET · Purchase orders GET | ⚠️ (12) — need sales, stock, shifts, POs on the test account |
| Categories POST/DELETE · Suppliers POST/DELETE · Payment types POST/DELETE · Product image POST/DELETE · Credit note POST · Modifiers DELETE · GRN POST · Inventory POST · Online orders POST · Cancel online order POST | ❌ (15) — need data or a valid payload |

Per-endpoint detail and what each one needs: `DOCS_BACKLOG.md` §1.

---

## 10. Work completed (changelog)

All on 2026-09-14.

**Reference migration (PLAN_api_reference.md — executed)**
- Merged `api_spec.yaml` with the live developer.salesplay.com spec (+3 paths, +12 endpoints, stale local fields dropped). 53 pages generated.
- New page layout (method badge, required markers, nested fields, response tabs, six languages, callouts). Sidebar badges, per-collection overview pages, API Reference overview table.
- Sidebar: How to Guides before API Reference; "Set Up Categories / Process & Manage Orders / Generate Receipts" moved into their API categories; Overview item removed (the category label opens it).

**Accuracy (from live testing)**
- Query params → JSON body on 30 operations; pagination page rewritten; `/merchants` → `/merchant`; `sub_categories` key; `products[].shops[].shop_id`; missing fields on taxes, customers, payment types; `cursor` added to 6 responses; required date ranges; validation rules; real POST /products response.
- `400/401/429` tabs with real examples on every endpoint page (shared table in the generator).
- Getting Started: "Make your first request" rewritten around a real `GET /shops` with the real response and accurate Postman steps.
- Rate-limit caution; stale guide links fixed (`/docs/…` prefix, 7 dead slugs).

**Brands**
- Per-brand colours (`src/css/tenants/`), favicon, logo; Vendrex logo/favicon/6 Backoffice screenshots captured from the real Backoffice; brand-specific step wording in Getting Started and OAuth guides; OAuth guide switched from plain `<img>` to `<TenantImage>`.
- Tenant replacement extended to JSX attributes and `SALESPLAY_*`; "Vendrex" strings that had leaked into SalesPlay source reverted.
- Separate ports/caches per brand; builds isolated from dev servers; rspack cache restricted to the default dev server.
- 2026-09-15: brand facts moved to `.env.<brand>` files read by `tenant.js` (duplicate tables in config + plugin deleted); URL-first replacement so Sellmo gets `api.backofficewebportal.com`; images in `static/img/salesplay|vendrex|selmo|shared/` resolved at build time; one `build/<brand>/` folder per brand; Sellmo logo, favicon, 7 screenshots and colours added; Docusaurus template images deleted.

**Site**
- Local search. `preview` scripts. Brand-coloured code strings.

**Documents**
- `TENANT_GUIDE.md`, `DOCS_IMPROVEMENT_PLAN.md`, `DOCS_BACKLOG.md`, `PLAN_tenant_assets_env.md`, this handbook.

---

## 11. Known problems and open items

| Problem | Where | Fix |
|---|---|---|
| Sellmo has no `register.png`, so the public sign-up step is hidden on the Sellmo site. | `static/img/selmo/`, `getting-started.md` | capture the screenshot, then remove `sellmo` from that block's `hide` list |
| 27 endpoints unverified. | spec | seeded test account (§14) |
| Wrong statements still in guides: `X-Request-ID`, `PUT /webhooks`, `orders.manage` scope, vague date format, "max limit 250". | errors-guide, going-live, webhooks-guide, date-time-format, pagination | `DOCS_BACKLOG.md` §2 (E1, E2, W1, D1, P2) |
| Two orphaned duplicate pages (`API-reference/Webhooks.md`, `guides/authentication.md`). | docs | delete (backlog S7, S8) |
| Placeholder examples (`"string"`, `0`) in generated pages. | spec `example:` values | backlog G1 |
| No page has a front-matter `description`; 30+ emoji headings. | all pages | backlog S1, S2 |
| Test-account credentials for Vendrex and Sellmo were shared in chat. | — | rotate the passwords |
| `DOC-TEST-001` product left in the SalesPlay test account. | — | delete via Backoffice |

---

## 12. Plans on the table

| Document | What it is | Status |
|---|---|---|
| `DOCS_IMPROVEMENT_PLAN.md` | The strategy: 7 phases (accuracy → reference quality → guides → findability → brands → maintenance → nice-to-have), measures of success, principles, timeline. | Draft; items 2.4 (complete responses) and 4.1 (search) done |
| `DOCS_BACKLOG.md` | ~50 ticket-sized edits with why/done-when, page by page; the verification tracker; conventions; tooling items; suggested order (wrong facts first). | Draft |
| `PLAN_tenant_assets_env.md` | Per-brand image folders (`salesplay/`, `vendrex/`, `selmo/`, `shared/`), `.env.<brand>` files loaded by one `tenant.js`, URL-first replacement, per-brand build folders, Sellmo assets moved in. | **Executed 2026-09-15** — see `TENANT_GUIDE.md` for how it works now |

---

## 13. Writing rules

1. Write as **SalesPlay**; never type a sister brand's name in a page.
2. **Every example must be real** — captured from the API or a Backoffice screenshot. If a value must be anonymised, keep its shape.
3. Reference pages describe an endpoint; guides describe a task. Don't mix.
4. Show the request and its real response before the explanation.
5. Say what breaks: the exact error the reader will see and what to do.
6. Sentence-case headings, no emoji in headings, one term per concept (Backoffice, access token, shop, receipt).
7. Never hand-edit `docs/API-reference/<group>/*.md`; edit `api_spec.yaml` and regenerate.
8. Relative `.md` links inside `docs/`; never `/docs/…`.
9. Screenshots ~1900 px wide, light theme, both brands, no personal data, secrets masked.
10. Front matter on every page: `title`, `sidebar_label`, `description`.
11. Never commit tokens or passwords; the checker reads `SP_TOKEN` from the shell.

---

## 14. Things we still need from the SalesPlay / API team

1. A **test merchant with real data** (sales, a void, a refund, a shift with a pay-in, a GRN, a purchase order, stock movements, an online order, a product image) — unblocks 27 endpoint verifications.
2. The **full list of error codes** and of **webhook event types**; how a webhook becomes `ENABLED`.
3. The **real rate limit**, the **timezone** of timestamps, and the **maximum date range** for sales endpoints.
4. Which **token header** is official (`Authorization` vs `Token`).
5. Confirmation that the Vendrex and Sellmo APIs are identical to SalesPlay's (a Vendrex/Sellmo API token would let us check).
6. Confirmation or removal of: the `partners@salesplaypos.com` review process, the versioning/deprecation policy page.
7. A named **API-side owner** who tells the docs team when an endpoint changes.

---

## 15. Glossary

| Term | Meaning |
|---|---|
| **Backoffice** | The merchant's web portal (cloud.salesplaypos.com / platform.vendrex.com / sellmo.backofficewebportal.com) where access tokens and OAuth apps are created. Not the POS app. |
| **Access token / API key** | A bearer token generated in the Backoffice that identifies one merchant account. Vendrex and Sellmo call it "API key". |
| **OAuth app / App token** | For third-party apps acting on behalf of many merchants: App ID, App Secret, Authorization Code, and a permission list (`RECEIPTS_READ`, `ITEMS_WRITE`…). |
| **Merchant** | The business account. One merchant has one or more **shops** (locations); each shop has **POS devices** (terminals). |
| **Encrypted ID** | The opaque string ids the API uses (`MnczNjdrVllFVTZoKzBHak1XZXkrZz09`). Stable; safe to store. |
| **Cursor** | The pagination marker returned with every list; send it back to get the next page. |
| **Upsert** | "Create or update" — the POST endpoints for catalog objects update an existing record with the same code instead of creating a duplicate. |
| **Receipt / order / credit note** | A completed sale / an order in progress / a refund document. Void receipts are cancelled sales. |
| **GRN / PO** | Goods Received Note (stock arriving from a supplier) / Purchase Order (stock requested from a supplier). |
| **Modifier** | An add-on or option on a product (e.g. "extra shot"). Modifier groups are created in the Backoffice. |
| **Measurement** | The unit a product is sold in (kg, pcs, litre). |
| **Tenant** | The code's word for a brand (salesplay / vendrex / sellmo). |
| **Spec** | `api_spec.yaml`, the OpenAPI description of the API that the reference pages are generated from. |
| **Webhook** | A URL you register so SalesPlay POSTs to it when an event happens (currently `receipts.update`). |

---

## 16. File index

| File | Purpose | Edit? |
|---|---|---|
| `api_spec.yaml` | source of truth for the API reference | yes — then regenerate |
| `gen_api_docs.mjs` | page generator; `PAGES` map; common error responses | yes (carefully) |
| `sidebars.js` | navigation | yes |
| `.env.salesplay`, `.env.vendrex`, `.env.sellmo` | all brand facts (name, URLs, title, favicon, image folder) — **not committed**; create from `.env.example` (see README) | yes; restart server after |
| `.env.example` | template for the three brand files | |
| `tenant.js` | reads the `.env` file; text-replacement rules; image resolver | rarely |
| `docusaurus.config.js` | site config, search; brand values from `tenant.js` | yes; restart server after |
| `src/plugins/remark-tenant-replace.js` | brand text replacement | rarely |
| `src/components/TenantImage.js`, `TenantBlock.js` | brand-aware image (resolved at build time) / paragraph | rarely |
| `src/css/custom.css` | shared styles (badges, endpoint bar, code colours) | yes |
| `src/css/tenants/*.css` | brand colours | yes |
| `docs/**` | content (generated endpoint pages excluded) | yes |
| `static/img/<brand>/`, `static/img/shared/` | screenshots, logos, favicons — same file names per brand | yes |
| `package.json` | scripts and dependencies | yes; restart after |
| `README.md` | short intro + link to the tenant guide | |
| `TENANT_GUIDE.md` | the full manual for the brand system (start here for anything brand-related) | |
| `HANDBOOK.md` | this file | keep current |
| `PLAN_api_reference.md` | the executed migration plan (history) | |
| `DOCS_IMPROVEMENT_PLAN.md`, `DOCS_BACKLOG.md` | what to improve next | |
| `PLAN_tenant_assets_env.md` | the executed image-folder + `.env` plan (history) | |
| `PLAN_gio.md` | the executed AI-discoverability plan (history + §11 register) | |
| `RECORDED_ISSUES.md` | register of wrong/unverified facts found but deliberately not fixed, with file + line | resolve, then remove entries |
