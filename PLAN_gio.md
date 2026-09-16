# Plan — GIO (Generative Intelligence Optimization) for the API documentation

Status: **IN PROGRESS.** Done 2026-09-16: Step 1 (Phase 1, machine files), Step 2 (Phase 2a, descriptions — purpose sentences live in `PAGES` in `gen_api_docs.py`, not `x-purpose` in the spec), Step 3 (Phase 2b, self-contained intro paragraph on the 53 endpoint pages), Step 4 (Phase 2c, 41 emoji headings cleaned, 9 renamed), Step 5 (Phase 2d/2e, 8 alt texts, 4 invariant sentences — see §11.3b for why only 4), Step 6 (Phase 2g, Introduction rewritten; backup in the session scratchpad), Step 7 (Phase 2h, glossary page, 26 terms), Step 8 (Phase 2i, FAQ sections on 6 pages, 27 questions), Step 9 (Phase 3, JSON-LD — injected by the gio-files plugin at build time instead of a theme wrapper; BreadcrumbList left to Docusaurus, which already emits it), Step 10 (Phase 5: git repository initialised (D1), last-updated on pages + sitemap lastmod + JSON-LD dateModified, changelog page, footer owner line with support@ email (D7); per-endpoint "last verified" line deferred until the verification tracker is complete). Four findings recorded only (§11).

*Written for anyone on the team. You don't need to know how AI systems work — section 1 explains the only parts that matter. Decisions that need your answer are in section 9.*

---

## 0. The one-paragraph version

More and more developers don't open a documentation site and read it. They ask an AI assistant — ChatGPT, Claude, Perplexity, Google's AI Overviews, GitHub Copilot, Cursor — *"how do I get an access token for the SalesPlay API?"* — and act on whatever it answers. **GIO is the work of making sure those assistants (a) find our documentation, (b) understand it correctly, (c) quote it accurately, and (d) send the developer to our site.** For a developer-facing API this is not a nice-to-have: an assistant that answers from an old Redoc page or from a guess will send partners the wrong base URL, the wrong header name, or a field that doesn't exist. This plan lists what to change in the site, the pages and the build so that the three brand sites become the source the assistants rely on. Most of it is ordinary good documentation practice, done deliberately and checked with a repeatable test.

---

## 1. How an AI assistant uses documentation (the only theory you need)

There are two ways an assistant can "know" our docs, and we have to serve both.

**Way 1 — It read the page while training.** Big models are trained on a snapshot of the public web taken months or years ago. If our pages were online, public, and clearly written at that time, some of it is baked into the model. We can't change what's already baked in; we can make sure the *next* snapshot gets it right. This takes months to show.

**Way 2 — It looks the page up right now.** This is the important one and it works within days. When you ask ChatGPT, Perplexity, Claude or Google AI Overviews a question, they run a web search behind the scenes, fetch a handful of pages, **cut each page into chunks of a few hundred words**, keep the chunks that look relevant, and write an answer from those chunks — usually with a link ("citation") to the page each fact came from.

That process has four consequences, and every item in this plan traces back to one of them:

| What the assistant does | What it means for us |
|---|---|
| **It searches first.** It only sees pages a search engine returns for the question. | Our pages must be crawlable, indexed, and titled/described the way a developer would phrase the question. |
| **It reads chunks, not pages.** A chunk arrives with no idea what page it came from, what the sidebar said, or what the previous section explained. | Every section must make sense on its own: say the product name, the endpoint, the base URL and the header name *in the section*, not three headings earlier. |
| **It prefers what's easy to extract.** Clean headings, tables, code blocks and one-sentence definitions get quoted; decorative text, emoji headings, "as shown above", and screenshots-without-text get skipped. | Structure the pages the way a machine can parse. Put every fact into text — never only in an image. |
| **It decides whom to trust.** Between a forum post, an old mirror and the official site, it favours the one that is consistent, current, explicit about what it is, and internally in agreement. | One canonical site per brand, dated pages, a stated owner, no contradictions between pages, and the old Redoc sites redirecting here. |

There is a third, smaller channel: **coding assistants inside the editor** (Copilot, Cursor, Claude Code, Windsurf). They fetch a URL when the developer pastes it, and they look for two plain-text files that have become a convention: `llms.txt` (a short index of the site written for machines) and the OpenAPI file. We publish both.

---

## 2. Where we are today (audit, checked 2026-09-15)

| # | Finding | Effect on assistants | Fix in |
|---|---|---|---|
| A1 | **No page has a `description`** (0 of 75). Search results and AI citations use the first random sentence. | The assistant's search step can't tell "Get Products" from "Create Product" from the snippet. | §4 Phase 2 |
| A2 | **Emoji in headings** (`## 🔑 Get Your Access Token`), ~30 in guides; **decorative "Key Features" blockquotes** with emoji on the Introduction. | Anchors become `#-get-your-access-token`; chunkers treat emoji as noise; the Introduction reads as marketing, not fact. | §4 Phase 2 (backlog S1) |
| A3 | **Endpoint pages are 53 near-identical templates** whose first sentence is *"This API will allow get the list of products from SalesPlay POS."* | A chunk from `/products` and one from `/customers` look the same; the assistant can't rank them and may blend them. | §4 Phase 2 |
| A4 | **Placeholder examples** (`"id": "string"`, `"limit": 0`) in generated pages. | Assistants copy examples verbatim; a developer gets `INVALID_VALUE` and blames us. | **Recorded only — §11.1** (not fixed in this plan) |
| A5 | **Facts stated once, far from where they're used**: the base URL is on Getting Started; the `Authorization: Bearer` header on the auth page; the "filters go in the JSON body even on GET" rule in one admonition per page (good). | A chunk from a response section doesn't know the header name. | §4 Phase 2 |
| A6 | **No `robots.txt`, no `llms.txt`, no structured data (JSON-LD)**; sitemap exists (Docusaurus default) but without last-modified dates. | AI crawlers aren't explicitly allowed or told where the sitemap is; the site never says "I am the official API reference for X". | §4 Phase 1, 3 |
| A7 | **Three brands publish near-identical text** on three domains, and the old Redoc pages at `developer.salesplay.com` / `developer.vendrex.com` are still the live sites. | Search engines see the same page in several places and may pick the old Redoc one — or the wrong brand — as "the" source. | §4 Phase 4 |
| A8 | **No dates, no changelog, no "last verified"**, no owner or contact on any page. | Freshness is a strong trust signal; without it, a 2022 forum post can win. | §4 Phase 5 |
| A9 | **Two orphaned duplicate pages** (`API-reference/Webhooks.md`, `guides/authentication.md`) contradict the current pages. | Two versions of the truth → the assistant picks one at random. | **Recorded only — §11.2** (not fixed in this plan) |
| A10 | Facts in the guides that are wrong or unverified (`X-Request-ID`, `PUT /webhooks`, rate-limit numbers, `orders.manage` scope). | Whatever we publish, the assistant will repeat confidently. GIO amplifies errors as much as truths. | **Recorded only — §11.3**; correct facts still to be confirmed |
| A11 | Every screenshot is a picture with a short `alt`; the Backoffice menu path exists only in the sentence next to it (good) but the Postman setup exists only in the image. | Anything only in an image is invisible to the assistant. | §4 Phase 2 |
| A12 | The API's inconsistent field names (`created_at` / `created_date`, `shop_id` / `store_id`) are not called out anywhere. | The assistant "normalises" them and invents a field. | **Recorded only — §11.4** (not fixed in this plan) |

**What is already right:** one source per brand with the correct API host per brand (after the `.env` change); self-canonical URLs on each domain (Docusaurus emits `<link rel="canonical">` from `TENANT_DEVELOPER_URL`); a sitemap; plain HTML output that any crawler can read; the OpenAPI file already published at `/api_spec.json`; the "filters go in the JSON body" and "empty list = last page" facts written explicitly on the pages that need them; consistent Authorization / Request body / Example request / Response section order on every endpoint page.

---

## 3. What "done" looks like (measurable)

| Measure | Today | Target (3 months after launch) | How we check |
|---|---|---|---|
| **Answer accuracy**: 25 fixed questions per brand (the "exam", §7) asked to ChatGPT, Claude, Perplexity and Google AI Overviews with web access | unmeasured (estimate: <50% correct base URL / header for Sellmo) | ≥ 90% correct, ≥ 80% cite our site | Monthly run of the exam, scored by hand in a sheet |
| **Citation share**: when an assistant cites a source for a SalesPlay/Vendrex/Sellmo API question, it is our domain | unknown | ≥ 80% | Same exam |
| **AI crawler visits**: hits from GPTBot, ClaudeBot, PerplexityBot, Google-Extended, Bingbot in the web server logs | unknown (probably blocked or never invited) | all five seen weekly on each brand | Server log report (host-side, §9 D4) |
| **AI referrals**: visitors arriving from chatgpt.com, perplexity.ai, claude.ai, copilot.microsoft.com, gemini.google.com | 0 (not tracked) | tracked; growing month on month | Analytics referrer report |
| **Machine files**: `robots.txt`, `llms.txt`, `llms-full.txt`, `sitemap.xml` with dates, `api_spec.json` on every brand | 2 of 5 | 5 of 5, verified by the build | Build check (§4 Phase 6) |
| **Page hygiene**: pages with a description, no emoji heading, a self-contained first paragraph | 0 / 75 | 75 / 75 | Build check |

---

## 4. The plan

Six phases. Phases 1 and 6 are technical (a day each). Phases 2 and 4 are editorial and matter most. Phase 0 is a precondition.

### Phase 0 — The recorded problems (not implemented by this plan)

Four audit findings — A4 placeholders, A9 orphan pages, A10 wrong/unverified facts, A12 field-name inconsistencies — are **recorded with their exact locations in §11 and deliberately left untouched here**. GIO makes assistants repeat our pages *more*, so whoever resolves them should do so before Phase 4 (redirects, go-live). Everything else below is implemented.

### Phase 1 — Be findable: the machine files (1 day, technical)

Everything here is generated at build time so all three brands get it automatically and nothing is hand-maintained.

**1a. `robots.txt`** — one per brand, written by the build into `build/<brand>/robots.txt`:

```
User-agent: *
Allow: /

# AI assistants that fetch pages to answer questions — explicitly welcome
User-agent: GPTBot
User-agent: OAI-SearchBot
User-agent: ChatGPT-User
User-agent: ClaudeBot
User-agent: Claude-User
User-agent: anthropic-ai
User-agent: PerplexityBot
User-agent: Google-Extended
User-agent: Bingbot
User-agent: Applebot-Extended
User-agent: CCBot
Allow: /

Disallow: /search
Sitemap: https://developer.backofficewebportal.com/sitemap.xml
```

(The `Sitemap:` line uses `TENANT_DEVELOPER_URL`, which is why it is generated rather than a static file.) Note: `robots.txt` is a request, not a lock; it matters because several assistants *do* honour it, and because a host-level firewall that blocks "bots" would silently undo all of this — see decision D4.

**1b. Sitemap with dates** — turn on `lastmod` in the Docusaurus sitemap options (`sitemap: { lastmod: 'date', changefreq: null, priority: null }`). Dates come from git commit history, so the repo must be built from a git checkout (it is not a git repository today — decision D1).

**1c. `llms.txt`** — a short plain-text index at `/llms.txt`, the convention coding assistants look for. Generated from the sidebar at build time, branded through `replaceText`, roughly:

```
# Sellmo API Documentation

> Official REST API reference and integration guides for the Sellmo point-of-sale
> system. Base URL: https://api.backofficewebportal.com/v1.0. Authentication:
> Bearer token in the Authorization header (Personal Access Token or OAuth 2.0).

## Start here
- [Getting Started](https://developer.backofficewebportal.com/guides/getting-started): get a token and make the first request
- [Personal Access Tokens](…): …
- [OAuth 2.0](…): …

## API reference
- [Get Products](https://…/API-reference/products/get-products): GET /products — list products with filters in the JSON body
- …one line per endpoint, method + path + one-sentence purpose…

## Machine-readable
- [OpenAPI 3.0 spec](https://…/api_spec.json)
- [Full documentation as one text file](https://…/llms-full.txt)
```

**1d. `llms-full.txt`** — every page's Markdown, branded, concatenated in sidebar order, with the page URL above each. Lets an assistant (or a developer's editor) load the whole documentation in one request. About 300 KB; trivial to generate from the same script.

**1e. Link the machine files** from the Introduction page footer ("Machine-readable: OpenAPI spec · llms.txt") and in the `<head>` (`<link rel="alternate" type="application/json" href="/api_spec.json">`). Search engines and assistants follow explicit links more reliably than they guess file names.

Implementation: one small local Docusaurus plugin, `src/plugins/gio-files.js`, with a `postBuild` hook that writes the four files using `profile` from `tenant.js`. No new dependencies.

### Phase 2 — Be quotable: page structure and wording (3–4 days, editorial; the core of the plan)

**2a. A `description` on every page** (backlog S2), written as the answer to "what will I be able to do after reading this?", 120–160 characters, containing the brand name and the key noun. Examples:

| Page | description |
|---|---|
| Getting Started | `Get a SalesPlay API access token from the Backoffice, set up Postman, and make your first request to GET /shops.` |
| Get Products | `GET /products — list the products in a SalesPlay account, filtered by ID or created/updated date, paginated with a cursor.` |
| Pagination | `How cursor pagination works in the SalesPlay API: the limit field, the cursor in each response, and how to know you are on the last page.` |

For the 53 generated endpoint pages the description is produced by `gen_api_docs.py` from the method, path and the spec's `summary` — one code change, not 53 edits. The brand name is substituted at build time like everything else.

**2b. A self-contained first paragraph on every endpoint page**, replacing "This API will allow get the list of products from SalesPlay POS." The template (filled from the spec):

> **GET /products** returns the products in a SalesPlay account. Send filters as a JSON body (product IDs, created/updated date range, `limit` up to 100, `cursor`). Requires a Bearer token in the `Authorization` header. Base URL: `https://api.salesplaypos.com/v1.0`.

Every fact an assistant needs to answer "how do I list products?" is now in one chunk: method, path, purpose, where parameters go, auth, base URL. This is the single most valuable change in the plan. It is one template in `gen_api_docs.py` plus a one-sentence `x-purpose` per operation in `api_spec.yaml` (53 sentences to write — the hand-written part).

**2c. Headings that match the questions people ask.** Remove emoji from headings (backlog S1) and rename the vague ones in the guides to question or task form:

| Today | After |
|---|---|
| `## 🔑 Get Your Access Token` | `## How to get an access token` |
| `## ⚙️ Set Up Your Environment` | `## Set the base URL and token in Postman` |
| `## What you should see` | `## Expected response from GET /shops` |

Keep one `#` (H1) per page — it is already the case.

**2d. Repeat the invariants where they're used.** On every page that shows a request: the header name (`Authorization: Bearer <token>`), the base URL, and the JSON-body rule appear in the section itself. Cheap in the generated pages (template). In the hand-written guides, add one line per code sample rather than "as above".

**2e. Put every fact that lives in an image into text too.** The Postman environment setup (variable names `baseUrl`, `Token`) is currently only a screenshot; add the two-row table beside it. Screenshot `alt` text should state what the screen *shows* ("Backoffice › Integrations › Developer Tools › API keys, with one key listed"), not what it is ("Access token page").

**2f. (Recorded only — see §11.4; not implemented.)** A "Field name conventions" note on the API Reference index and a `:::note` on the 6 endpoints affected: which endpoints use `created_at` vs `created_date`, `shop_id` vs `store_id`. Assistants normalise names unless told the inconsistency is real.

**2g. The Introduction page becomes a factual overview**: what the API is (one paragraph with base URL, auth method, format), a table of the 24 resource groups with one-line purposes and links, and "who this is for". Drop the emoji "Key Features" cards. This page is the one most likely to be cited for "what is the SalesPlay API?".

**2h. A glossary page** (`docs/glossary.md`): Backoffice, shop, terminal, receipt vs. order vs. online order, credit note, GRN, PAT, modifier, cursor. One line each. Definitions are the easiest thing for an assistant to quote and the thing it most often gets wrong for a domain product.

**2i. FAQ blocks on the six highest-traffic pages** (Getting Started, Personal Access Tokens, OAuth, Pagination, Errors, Webhooks): 4–6 real questions in H3 form with two-sentence answers, taken from what support actually gets asked. Question-form headings are matched almost verbatim by the assistant's search step. These blocks also carry the `FAQPage` structured data in Phase 3.

### Phase 3 — Say what you are: structured data (1 day, technical)

Add JSON-LD blocks so search engines and assistants can classify pages without guessing:

- **Site-level** (in `docusaurus.config.js` `headTags`): `WebSite` + `Organization` (brand name from `.env`, logo, the developer-site URL, `sameAs` → the brand's marketing site).
- **Every page**: `TechArticle` (headline, description, dateModified, `about: { "@type": "SoftwareApplication", name: "<brand> POS" }`, `isPartOf` the WebSite) and `BreadcrumbList` (Docusaurus already renders breadcrumbs; we emit the matching data). Done once by wrapping the theme's `DocItem/Metadata` component in `src/theme/` — the same mechanism used for the category page override.
- **API reference pages**: additionally `APIReference` (`programmingModel`/`assemblyVersion` aren't relevant; use `name`, `description`, `url`, `targetPlatform: "REST"`, and a link to the OpenAPI file).
- **FAQ blocks** from 2i: `FAQPage`.

Validate with Google's Rich Results Test and Schema.org validator once per brand; add the check to the exam checklist.

### Phase 4 — Be the one source: brands, duplicates and redirects (½ day technical + host actions)

Three near-identical sites are unavoidable — that's the product. What we control is making each one unambiguous:

- **Self-canonical per brand** (already true). Add the brand name in the `<title>` suffix (already: "… | Sellmo Documentation") and in every `description` (2a).
- **Brand name in the first paragraph of every page**, so a chunk identifies its brand. 2b does this for endpoints; the guides already say "SalesPlay …" early in most pages — audit the ones that don't.
- **Never link between brands.** Nothing today does; keep the rule in `TENANT_GUIDE.md` §15.
- **Retire the old Redoc sites with 301 redirects** to the new site (same domain, so this is a host change: every old path → `/` or the matching new page). Until this happens, assistants will keep finding the old pages. This is decision D2 and the single biggest external dependency.
- **`hreflang` is not needed** (one language), and we deliberately do **not** mark one brand as canonical for the others — they are different products to the outside world.
- Add `noindex` to `/search` and `/markdown-page` (a leftover Docusaurus sample page — delete it).

### Phase 5 — Look alive: freshness and ownership (½ day + ongoing)

- **`last_update` front matter** comes for free from git once the repo is a git checkout (D1); show it on the page (`showLastUpdateTime: true` in the docs preset). Assistants and search engines read the visible date.
- **A changelog page** (`docs/changelog.md`): one line per documentation change with a date, newest first. Also the API version note from `versioning.md`. Both a freshness signal and the page an assistant cites for "did X change?".
- **A contact/owner line** in the footer ("Documentation maintained by the <brand> developer team — <email or form>") — trust signal, and where assistants send people for "how do I report an error in the docs?".
- **Verified-on dates** on the reference: the backlog's verification tracker becomes a small "Last verified against the live API: 2026-09-14" line on each generated page (from a field in `gen_api_docs.py`'s `PAGES` map).

### Phase 6 — Keep it that way: checks in the build (½ day, technical)

A script (`tools/gio_check.py` or a node script) run after each build, failing the build if:

- any page under `docs/` lacks `description`, has more than one H1, or has a non-ASCII character in a heading;
- `robots.txt`, `llms.txt`, `llms-full.txt`, `sitemap.xml`, `api_spec.json` are missing from `build/<brand>/`;
- any `llms.txt` link returns a 404 within the build folder;
- the other brands' names appear anywhere in a brand's output (the leak sweep from `TENANT_GUIDE.md` §10, automated).

Plus the **monthly exam** (§7), which is a human task with a sheet.

---

## 5. Files touched

| File | Change | Phase |
|---|---|---|
| `src/plugins/gio-files.js` (new) | `postBuild` hook: writes `robots.txt`, `llms.txt`, `llms-full.txt` per brand | 1 |
| `docusaurus.config.js` | register the plugin; sitemap `lastmod`; `headTags` JSON-LD (site-level); `showLastUpdateTime` | 1, 3, 5 |
| `src/theme/DocItem/Metadata/index.js` (new) | per-page JSON-LD (`TechArticle`, `BreadcrumbList`, `APIReference`, `FAQPage`) | 3 |
| `gen_api_docs.py` | description + self-contained first paragraph + repeated invariants + verified-on line in the template | 2, 5 |
| `api_spec.yaml` | one `x-purpose` sentence per operation (53); `example:` values (backlog G1) | 2 |
| `docs/guides/*.md`, `docs/Introduction.md`, `docs/API-reference/index.md`, `pagination.md`, `rate-limits.md`, `date-time-format.md`, `webhooks/*.md` | descriptions, headings, first paragraphs, FAQ blocks, text for image-only facts, field-name note | 2 |
| `docs/glossary.md`, `docs/changelog.md` (new) | | 2, 5 |
| `sidebars.js` | add glossary and changelog | 2, 5 |
| `src/pages/markdown-page.mdx` | delete | 4 |
| `tools/gio_check.py` (new) + `package.json` | build-time checks | 6 |
| `TENANT_GUIDE.md` / `HANDBOOK.md` | document the machine files, the writing rules and the exam | all |
| Web host (outside the repo) | 301 redirects from Redoc pages; allow AI crawlers through any bot firewall; analytics referrer report; server-log report | 4, 3 |

---

## 6. Order of work and effort

| Step | What | Effort | Depends on |
|---|---|---|---|
| 1 | Phase 0 — the four recorded problems (§11) | not in this plan | — |
| 2 | Turn the folder into a git repository (D1) | 1 hour | — |
| 3 | Phase 1 — machine files | 1 day | 2 |
| 4 | Phase 2a–2b — descriptions + endpoint first paragraphs (generator + 53 sentences) | 1½ days | 1 |
| 5 | Phase 2c–2g — guides: headings, invariants, image text, field-name note, Introduction | 1½ days | — |
| 6 | Phase 2h–2i — glossary + FAQ blocks | 1 day | support's question list |
| 7 | Phase 3 — structured data | 1 day | 4 |
| 8 | Phase 5 — dates, changelog, owner line | ½ day | 2 |
| 9 | Phase 6 — build checks | ½ day | 3 |
| 10 | Phase 4 — host: redirects + crawler allow + analytics (D2, D4) | ½ day for us; host team's schedule | — |
| 11 | Baseline exam (§7) *before* step 10 goes live, then monthly | 2 hours / month | — |

Total for us: about **8 working days**, spread over 3–4 weeks so the host changes can land in between. Results in the exam appear within 1–2 weeks of step 10 for the "look it up now" assistants; the "baked in" improvement takes one model generation (months).

---

## 7. The exam (how we measure, in practice)

A sheet with 25 questions per brand, the correct answer, and columns for ChatGPT / Claude / Perplexity / Google AI Overviews × (correct? cites us? cites old Redoc/other?). Asked with web access on, in a fresh session, phrased as a developer would. Starter list:

1. What is the base URL of the Sellmo API?
2. How do I authenticate requests to the Sellmo API? (expect: `Authorization: Bearer <token>`)
3. Where in the Sellmo Backoffice do I create an API key? (expect: Integrations › Developer Tools › API keys)
4. How does pagination work in the Sellmo API? (expect: `limit` + `cursor` in the JSON body; empty list = last page)
5. Does GET /products take query-string parameters? (expect: no — JSON body)
6. What is the maximum `limit` for GET /products? (100)
7. How do I create a product with the Sellmo API? (expect: POST /products, required fields)
8. How do I register a webhook? Which events exist?
9. What does the error body look like when a field is invalid? (expect `errors.code` = `INVALID_VALUE`, `field`, `details`)
10. What are the rate limits of the Sellmo API?
11. What date format does the API use?
12. How do I get a list of shops?
13. How do I issue a refund / credit note?
14. How do I place an online order?
15. Is `shop_id` or `store_id` used on the orders endpoint?
16. What is the difference between a receipt and an order?
17. What is a GRN in Sellmo?
18. Can I upload a product image via the API? How?
19. How do I get an OAuth access token? Which grant?
20. What permissions/scopes exist for OAuth apps?
21. How do I check which POS terminals are registered?
22. Is there a Postman collection for the Sellmo API?
23. Is there an OpenAPI spec for the Sellmo API?
24. What does an empty `cursor` mean?
25. Who do I contact about an error in the Sellmo API documentation?

Score: correct facts / 25, our-site citations / 25. Run once **before** Phase 4 goes live for a baseline, then monthly. Ten minutes per assistant per brand.

---

## 8. Writing rules that come out of this (to add to `TENANT_GUIDE.md` §15 / `HANDBOOK.md` §13)

1. Every page starts with one paragraph that stands alone: what it is, for which product, the key fact (endpoint, URL, header).
2. Every page has a one-sentence `description` with the brand name and the main noun.
3. Headings are plain text, no emoji, task- or question-shaped where the page answers a "how do I" question.
4. A fact that matters is written where it is used — never "see above", never only in a screenshot.
5. Define a term the first time it appears on a page, or link the glossary.
6. Tables for parameters and fields; code blocks for every request and response; never prose for either.
7. One page per topic. Duplicates are deleted, not kept "for reference".
8. Every reference page says when it was last verified.

---

## 9. Decisions for you

| ID | Question | Default |
|---|---|---|
| D1 | Make the project a **git repository** (needed for last-modified dates in the sitemap and on pages, and for the changelog to be honest)? | **Yes** — `git init`, commit current state |
| D2 | **Retire the old Redoc sites** at `developer.salesplay.com` / `developer.vendrex.com` with 301 redirects when the new sites go live? Assistants keep citing whatever is at those URLs. | **Yes**, at launch; needs the host team |
| D3 | Allow **all** AI crawlers (including training crawlers such as `GPTBot`, `Google-Extended`, `CCBot`), or only the "look it up now" ones (`OAI-SearchBot`, `ChatGPT-User`, `Claude-User`, `PerplexityBot`)? Allowing training crawlers is what gets the docs baked into future models. | **Allow all** — public documentation, no downside |
| D4 | Ask the host team to confirm the web server / CDN **does not block AI bots** (Cloudflare "Bot Fight Mode" and similar block them by default) and to provide a monthly report of bot user-agents? | **Yes** |
| D5 | Publish `llms-full.txt` (the entire documentation as one text file, ~300 KB)? It's the most useful file for coding assistants but is also the easiest way to copy the docs wholesale. | **Yes** — the site is public anyway |
| D6 | Who owns the **monthly exam** and the FAQ question list? | A named docs owner + one person from support |
| D7 | Add an **owner/contact line** to the footer — which address? | `developer@<brand domain>` or the existing support form |

---

## 10. Not doing (and why)

- **Paid "AI SEO" tools or submitting to AI directories.** Nothing beats being the clean, current, official source; the exam tells us if that stops being true.
- **A chat widget on the docs site.** Different problem (on-site help); this plan is about assistants people already use.
- **Rewriting the guides for length.** That's `DOCS_IMPROVEMENT_PLAN.md` Phase 3. GIO needs structure and self-contained sections, not shorter pages.
- **Keyword stuffing or hidden text.** Assistants and search engines penalise it, and it makes the pages worse for humans.
- **Per-brand differences in content.** The three sites stay identical in substance; only names, URLs, screenshots and colours differ. Any brand-specific *content* would be a product question, not a docs one.

---

## 11. Where the four recorded problems were found (record only — nothing here is changed by this plan)

Checked 2026-09-16 against the current files. Line numbers are as of that date.

### 11.1 Placeholder examples in generated reference pages (audit A4)

**Where:** 49 of the 53 generated pages under `docs/API-reference/<group>/*.md` — 1,071 occurrences of `"string"` and 13 pages with `0` as a number placeholder, in the *Example request* and *Response* JSON blocks. Every file below has them:

```
categories/{create,delete,get}-category.md          modifiers/{delete,get}-modifier(s).md
customers/{create,delete,get}-customer(s).md         online-orders/{cancel,place}-online-order.md, get-online-order-status.md
employee/get-employees.md                            order-types/{create,delete,get}-order-type(s).md
grn/{create,get}-grn.md                              orders/get-orders.md
inventory/get-inventory.md                           payment-types/{create,delete,get}-payment-type(s).md
measurements/{create,delete,get}-measurement(s).md   pos-devices/get-pos-devices.md
product-image/delete-image.md                        products/{create,get}-product(s).md
purchase-orders/get-purchase-orders.md               receipts/create-credit-note.md, get-{credit-notes,receipts,void-receipts}.md
shifts/get-{drawer-transactions,shifts}.md           shops/get-shops.md
sub-categories/{create,delete,get}-sub-categor(y|ies).md   suppliers/{create,delete,get}-supplier(s).md
taxes/{create,get}-tax(es).md                        timecards/get-timecards.md
webhooks/{create,delete,get}-webhook.md
```

Example, `docs/API-reference/products/get-products.md` lines 48, 54, 66, 72, 101, 107: `"product_ids": "string"`, `"cursor": "string"`.

**Root cause:** the pages are generated by `gen_api_docs.py` from `api_spec.yaml`; where a field has no `example:` value the generator prints the type name. The spec has 122 `example:` lines against 792 `type: string` fields.

**Why it matters for AI assistants:** an assistant copies the example verbatim; a developer sends `"limit": 0` or `"product_ids": "string"` and receives `INVALID_VALUE`, then blames the documentation. The fix is tracked as `DOCS_BACKLOG.md` G1 (add `example:` to every spec field from real captures).

### 11.2 Orphaned duplicate pages that contradict the current pages (audit A9)

| File | Size | Not linked from | Contradicts | How |
|---|---|---|---|---|
| `docs/API-reference/Webhooks.md` ("Webhook API Suite") | 420 lines | `sidebars.js` (only `API-reference/webhooks/*` are listed) — reachable by URL and by search only | `docs/API-reference/webhooks/get-webhook.md`, `create-webhook.md`, `delete-webhook.md`, `overview.md` | Documents the parameters as **query-string** (`### Query Parameters`, line 27; `GET …/webhooks?id=wh_abc123`, lines 39–102), whereas the current pages state the verified behaviour: *parameters are read from the JSON body, even on GET; query-string parameters are ignored* (`get-webhook.md` lines 24–25). Uses `created_at` in its response. |
| `docs/guides/authentication.md` ("Get Your Credentials" / "Authentication") | 227 lines | `sidebars.js` — reachable by URL and by search only | `docs/guides/personal-access-tokens.md` and `docs/guides/oauth.md` | Same content as both current pages merged, but a separate older copy; any correction made to the current pages (header format, token refresh at `POST /oauth/token`, lines 143–151) is not reflected here. The file also starts with a UTF-8 BOM. |

**Why it matters for AI assistants:** two pages on the same site giving different answers; the assistant picks one at random and cites it. Tracked as `DOCS_BACKLOG.md` S7 and S8 (delete both).

### 11.3 Wrong or unverified facts in the guides (audit A10)

| Fact as written | File and line | Status | Correct fact (to be confirmed) |
|---|---|---|---|
| "Every API response (success or failure) includes an `X-Request-ID` header. Log this ID…" | `docs/guides/errors-guide.md` line 63 (Debugging Tips) | **Wrong** — the live API sends no such header (verified 2026-09-14, `DOCS_BACKLOG.md` E1) | Remove; if the API team provides a correlation header, document that one |
| "**Log Request IDs**: Store the `X-Request-ID` for every SalesPlay interaction…" | `docs/guides/going-live.md` line 36 | **Wrong** — same | Same |
| "### 4. Update a Webhook (PUT)" with `curl -X PUT …/webhookss/WEBHOOK_ID` and five language samples | `docs/guides/webhooks-guide.md` lines 243–321 | **Wrong** — `PUT /webhooks` returns `405` (`DOCS_BACKLOG.md` W1). Note also the typo `webhookss` in the URL (line 251) | "To change a webhook, delete it and create it again" — unless the API team confirms an update method |
| "Per Account: 300 requests / 300 seconds" | `docs/API-reference/rate-limits.md` line 17; repeated in `docs/guides/errors-guide.md` line 50 | **Unverified** — the page itself notes (line 20) that 360 requests in 54 seconds all returned `200`; no `429` or `Retry-After` has ever been observed | Ask the API team for the real limit and the `429` behaviour; until then label the figure "published policy, not observed" |
| "check that the Personal Access Token you are using has the required scope (e.g., `orders.manage`)" | `docs/guides/errors-guide.md` line 66 | **Wrong** — Personal Access Tokens have no scopes; OAuth apps have permissions named like `RECEIPTS_READ` (`DOCS_BACKLOG.md` E2) | Rewrite the tip around OAuth app permissions |
| Date format described only as "(Y-m-d H:i:s) 24 hours format" | field tables in all generated pages (e.g. `get-products.md` lines 44–47) and `docs/API-reference/date-time-format.md` | **Incomplete** — verified accepted formats are `YYYY-MM-DD HH:MM:SS` and `YYYY-MM-DD`; ISO-8601 is rejected with `Invalid date Format.` (`DOCS_BACKLOG.md` D1) | State the two accepted formats and the rejection |
| "The request to get the order status should include the order reference ID as a path parameter." | `api_spec.yaml` → `GET /online_order_status` description (rendered on `docs/API-reference/online-orders/get-online-order-status.md` under the intro paragraph) | **Wrong** — the endpoint takes `system_unique_ids` in the JSON body like every other endpoint; there is no path parameter | Replace with "Send the system unique IDs in the JSON body" — found 2026-09-16 while regenerating the pages |
| Error payload shown as `{"code": "validation_failed", "message": "…", "request_id": "req_…"}` | `docs/guides/errors-guide.md` lines 33–43 (Handling Error Responses) | **Wrong** — the live API returns `{"errors": {"code", "details", "field"}}` with codes like `UNAUTHORIZED`, `INVALID_VALUE` (verified; this is what all 53 reference pages show) | Replace with the verified body; ties in with the `X-Request-ID` row |
| "Test in sandbox environments before deploying to production. Support for development, staging, and production endpoints." | was `docs/Introduction.md` (Key Features card) — removed in Step 6; the same claim remains in `docs/guides/going-live.md` line 45 ("Once your testing in the sandbox environment is complete") | **Unverified** — no sandbox base URL is documented anywhere; the only known host is the production API | Confirm with the API team whether a sandbox exists; if so document its base URL, if not remove the sentence in going-live |
| Pagination "default limit 10", old "max 250" | `docs/API-reference/pagination.md`; `limit` rows on generated pages ("Maximum: 100") | **Unverified** — 251 and 500 were accepted in testing (`DOCS_BACKLOG.md` P2) | Confirm the real ceiling with the API team |

#### 11.3b Guide code samples that call endpoints the API does not have (found 2026-09-16, Step 5)

The six-language code samples in four guides were written REST-style and do not match `api_spec.yaml` (which has no `PUT`, no `/{id}` paths, and uses `POST <collection>` as create-or-update with the ID in the JSON body). Every method+path used by the guides was compared with the spec:

| Guide | Section | Code calls | In the spec | Notes |
|---|---|---|---|---|
| `docs/guides/product.md` | Get Products (single) | `GET /products/{id}` | `GET /products` with `product_ids` in the JSON body | no `/{id}` path exists |
| | Edit Product | `PUT /products/{id}` | `POST /products` (updates when `product_code` exists) | `PUT` is not in the spec (cf. `PUT /webhooks` → `405`) |
| | Delete Product | `DELETE /products/{id}` | — | there is **no** delete-product endpoint in the spec |
| `docs/guides/categories.md` | all four sections | `POST/GET/PUT/DELETE /categories[/{id}]` | `POST/GET/DELETE /category` (singular; ID in body) | path is wrong in every sample |
| `docs/guides/order-integration.md` | Get Orders (single) | `GET /orders/{id}` | `GET /orders` with `order_numbers` in the body | |
| `docs/guides/receipt.md` | Get Receipts (single) | `GET /receipts/{id}` | `GET /receipts` with `receipt_numbers` in the body | |
| | Get Void Receipts | `GET /receipts/void?{query}` | `GET /void_receipts` with a JSON body | path and parameter style both wrong |
| `docs/guides/webhooks-guide.md` | all sections | `…/v1.0/webhookss` (38 occurrences), `…/webhookss/WEBHOOK_ID` | `/webhooks` with `id` in the body | typo plus `/{id}` style |
| `docs/guides/oauth.md`, `personal-access-tokens.md` | token request / refresh | `POST /oauth/token` (4×) | not in `api_spec.yaml` | may well exist — unverified, not in the spec |

Consequence for Step 5: the "send X to URL" sentence was added only to the four sections whose method+path is in the spec (`POST /products`, `GET /products`, `GET /orders`, `GET /receipts`), so the documentation does not restate a wrong path. Resolving this table (rewrite the samples against the spec, or confirm with the API team that these REST paths exist) is the largest single item in Phase 0.

### 11.4 Inconsistent field names not called out anywhere (audit A12)

Counted in `api_spec.yaml` (the source the reference pages are generated from):

| Concept | Name used | Where |
|---|---|---|
| Creation timestamp | `created_at` — 25 places | Responses of `categories` (create), `customers`, `measurements` (create), `merchant`, `shifts`, `sub-categories` (create), `suppliers`, `taxes`, `webhooks`, and the `created_at_min/max` filters everywhere |
| | `created_date` — 6 places | Responses of **GET** `categories`, `measurements`, `modifiers`, `order-types`, `payment-types`, `products`, `shops`, `sub-categories` |
| Update timestamp | `updated_at` — 6 places | filters (`updated_at_min/max`) |
| | `updated_date` — 16 places | Responses of the same GET list endpoints as `created_date` (e.g. `get-shops.md`: `"updated_date": "2026-09-14 12:27:10"`) |
| Shop identifier | `shop_id` — 24 places | `grn`, `inventory`, `online-orders`, `orders`, `payment-types`, `pos-devices`, `products`, `purchase-orders`, `receipts`, `shifts`, `shops`, `timecards`, `webhooks/payload` |
| | `store_id` — 1 place | `api_spec.yaml` line 1945 → `docs/API-reference/products/create-product.md` line 70 (`store_id` — "The ID of the store") and lines 140, 210, 280 in the examples |
| Product identifier | `id` vs `product_id` — 12 places for `product_id` | list responses use `id`; `inventory`, `product-image`, `online-orders` and GRN lines use `product_id` |

So the same record shows `created_at` when created and `created_date` when listed (e.g. `POST /categories` → `created_at`; `GET /categories` → `created_date`), and a product is created with `store_id` but every other endpoint says `shop_id`.

**Why it matters for AI assistants:** an assistant "normalises" the names and invents `created_at` on a list response or `shop_id` on create-product; the developer's code then reads an undefined field. Already noted as problem F in `DOCS_IMPROVEMENT_PLAN.md` (§2) with fix 1.5 (a callout on the overview and each affected page) — that callout is **not** added by this plan.
