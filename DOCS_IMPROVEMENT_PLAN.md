# Plan — Making the SalesPlay API documentation the best it can be

Status: **DRAFT for review.** Nothing in this document has been implemented yet. Read it, strike out or change what you don't agree with, and say "execute" (all of it, or by phase).

---

## 0. The one-paragraph version

Good API documentation does three things: it is **correct** (every example works when you paste it), it **gets a developer to a working call in minutes** (and to a complete integration in an afternoon), and it **stays correct** as the API changes. Today the site looks good and the reference pages are generated from a spec, but the spec was partly wrong (we found that only by calling the live API), several guides describe things that don't work the way they say, and there is no safety net that stops it drifting again. The plan below fixes accuracy first, then makes the reference genuinely useful, then the guides, then discoverability, then the multi-brand gaps, and finally puts checks in place so it can't rot.

---

## 1. How we'll know it worked

We'll judge the docs by what a developer can do, not by how they look:

| Measure | Today | Target |
|---|---|---|
| Time for a new developer to make their first successful call, following only the docs | unknown — the Postman steps were wrong until this week | under **10 minutes**, tested by someone who has never seen the API |
| Examples that work when copy-pasted | many failed (filters were documented as query params; the API ignores them) | **100 %** — every example on the site is run against a real account before publishing |
| Endpoints whose documented response matches the real response field-for-field | 26 of 53 verified | **53 of 53** |
| "How do I…" questions that have a guide | 5 topics (auth, categories, products, orders, receipts, webhooks) | the 8 tasks in §5 |
| Support questions about things the docs already cover | not measured | tracked, trending down |

---

## 2. Where we are today (honest audit)

**What's already good**
- Modern site (Docusaurus), light/dark mode, works on phones.
- Reference pages are generated from one file (`api_spec.yaml`) — one place to fix things.
- PayPal-style reference layout: method badge, required markers, nested fields, response tabs, six languages per example.
- Guides exist for the main flows and are written in a friendly voice.
- Three brands from one source (SalesPlay / Vendrex / Sellmo).

**What's holding it back** (each one is addressed in the plan)

| # | Problem | Why it matters |
|---|---|---|
| A | Half the reference was documented from the spec, not from the real API. When we finally called every endpoint we found filters go in a JSON body (docs said query string), the last page of results is signalled by an empty list (docs said the opposite), a `/merchants` endpoint that doesn't exist, wrong field names in 6 responses, and undocumented validation rules. | A developer who follows the docs gets errors and doesn't know why. Trust is lost on the first afternoon. |
| B | 27 endpoints still **unverified** — their responses could only be checked with real sales, stock, shifts, GRNs, purchase orders, image uploads and online orders, which the test account doesn't have. | Same risk as A, for the endpoints partners care about most (receipts, orders, inventory). |
| C | Examples use placeholders: `"id": "string"`, `"cost": "string"`, `"limit": 0`. | Developers copy the example and get validation errors. Real-looking examples answer questions before they're asked (is `cost` a number or a string? what does an ID look like?). |
| D | Endpoint descriptions are one grammatically-off sentence ("This API will allow get the list of…"). No page says *when* to use an endpoint, what it's for, what happens on repeat calls (upsert vs. duplicate), or whether delete is permanent. | The reference tells you the shape of the door but not what's behind it. |
| E | Errors are documented only as a generic HTTP status table. The real error body (`{"errors":{"code":"INVALID_VALUE","details":"…","field":"…"}}`) and the actual codes (`UNAUTHORIZED`, `INVALID_VALUE`, `INVALID_FORMAT`, `BAD_REQUEST`…) appear nowhere. | Handling errors is the second thing every integrator builds; they have to discover the format by trial. |
| F | Field naming is inconsistent across the API (`created_at` vs `created_date` vs `updated_date`; `shop_id` vs `store_id`; `id` vs `product_id`). The docs don't warn about it. | We can't change the API, but we can stop developers being surprised. |
| G | ~~No search.~~ ✅ local search added 2026-09-14. | On a 70-page site, a developer looking for "cursor" or "webhook" has to guess the menu. |
| H | The Postman collection (the main way developers start) has no collection-level auth, sends the token as a custom `Token` header, and is not published from this repo. | The guides and the collection can drift apart — they already had. |
| I | Guides are long (Categories 894 lines, Products 968) and code-heavy before explaining the concept; some flows a partner actually needs (sync a whole catalog, pull yesterday's sales, take an online order end-to-end, keep stock in sync) don't exist as guides. | Length without structure reads as complexity. Missing flows are the questions support gets. |
| J | Rate limit page states "300 requests / 300 seconds" — unverified; no `Retry-After` behaviour documented. Date/time page and versioning page not checked against reality. | Wrong numbers here cause production outages for partners. |
| K | Vendrex site still shows SalesPlay screenshots for 5 Backoffice pages; Sellmo has no colours, logo or profile. | The brand promise ("one site per brand") is visibly incomplete. |
| L | No changelog, no "last verified" date, no owner, no CI check that both brands still build or that links still resolve. | Nothing stops it going stale — which is exactly how it got into state A. |

---

## 3. The principles we'll follow

These are the standards the best developer docs (Stripe, Twilio, PayPal, GitHub) share. Every task below serves one of them.

1. **Truth over tidiness.** If the API does something odd (GET with a body), document the odd thing clearly rather than the "correct" thing that doesn't work.
2. **Every example runs.** Examples come from real calls to a real account, and are re-run before every release.
3. **Task first, reference second.** Guides answer "how do I *do X*"; the reference answers "what exactly does *this endpoint* accept and return". Each links to the other.
4. **Show, then tell.** A working request and its real response appear before the paragraph that explains it.
5. **One source of truth.** The spec generates the reference; the Postman collection is generated from the same spec; brands are generated from the same source. Nothing is hand-copied twice.
6. **Say it once, consistently.** Same words for the same thing everywhere (Backoffice, access token, shop, receipt). A glossary pins the terms.
7. **Written for the reader's first day.** No assumed knowledge of SalesPlay internals; every ID format, date format and unit is stated where it's used.
8. **Maintained by process, not memory.** A checklist, a test, and a date on every page.

---

## 4. The plan

Effort key: **S** = under half a day · **M** = 1–2 days · **L** = 3–5 days.
"Needs from team" = things only SalesPlay staff can supply.

### Phase 1 — Make it true (accuracy) — *do first, everything else builds on it*

| # | Task | Why | How | Effort | Needs from team |
|---|---|---|---|---|---|
| 1.1 | **Verify the 27 unverified endpoints** against the live API and fix the spec. | Problem A/B. | Seed the test account with real data — a few sales, a void, a refund, a shift, a GRN, a purchase order, a stock update, a product image, an online order — then re-run the checker script we built and fix every field difference. | L | A test merchant with POS access to create sales/shifts, **or** the responses captured from a real merchant (anonymised). |
| 1.2 | **Document the real error format and codes.** | Problem E. | One "Errors" reference page: the `errors` object, every `code` we've seen with the message and the fix, HTTP status per code, `field` when present. Link it from every 4xx response tab (already wired). | M | Full list of error codes from the API team (we have 5 from testing). |
| 1.3 | **Verify rate limits, date/time rules, version rules.** | Problem J. | Call the API past the limit and record what actually comes back (status, headers, body, `Retry-After`). Confirm accepted date formats and timezone (server local? UTC?). Rewrite those three pages from the results. | S | Confirmation of the intended limit and timezone. |
| 1.4 | **Document behaviours we discovered but haven't written down.** | Problem A. | Receipts/orders require a date range and reject very wide ranges — state the maximum. Order-type delete is a soft delete (re-creating restores the same ID). Webhook `status` is `ENABLED`/`DISABLED`; what makes it enabled. Token header: both `Authorization: Bearer` and `Token: Bearer` work — pick one to recommend. | S | Max date range; how a webhook becomes ENABLED; full list of webhook event types (we know one: `receipts.update`). |
| 1.5 | **Field-naming "gotchas" note.** | Problem F. | Short callout on the Overview and on each affected page: "this endpoint uses `created_date`; most others use `created_at`". Generated automatically from the spec by scanning for known variants. | S | — |

**Done when:** every endpoint page has been checked against a real response; the checker script reports zero differences; the error page lists every code the API can return.

### Phase 2 — Make the reference genuinely useful

| # | Task | Why | How | Effort |
|---|---|---|---|---|
| 2.1 | **Real examples instead of `"string"`.** | Problem C. | Add an `example` to every field in the spec using values captured in 1.1 (real-looking IDs, prices as the API returns them, real dates). The generator already prefers examples when present. | M |
| 2.2 | **Rewrite every endpoint description** into: what it does (one line), when you'd use it (one line), and any rule that will bite you (upsert behaviour, soft delete, required date range, default limit). | Problem D. | Edit `description` in the spec; 53 operations × ~3 sentences. Use the same voice as the guides. | M |
| 2.3 | **Upsert semantics stated on every "Create or Update" page.** | Problem D. | Which field is the key that decides "update rather than create" (e.g. `product_code`, `supplier_id`, `tax_code`) — verify by calling twice — and what happens to fields you leave out. | M |
| 2.4 | **Complete responses on every page.** ✅ done 2026-09-14 | Problem E. | Every operation lists its `401` (bad token), `400`/`401` validation errors with a real example, and `429`. Today many pages show only `200`. | S (generator change) |
| 2.5 | **Group by workflow inside each collection page.** | Discoverability. | The generated collection overview (e.g. *Products*) gets a two-line "typical order of calls" (create category → create product → upload image → check inventory) above the endpoint cards. | S |
| 2.6 | **Consistent operation names.** | Consistency. | Rename to a single pattern: *List products / Create or update product / Delete product*. Sidebar, page title and Postman request name all match. | S |
| 2.7 | **Downloadable OpenAPI file** linked from the Overview (`/api_spec.json` already exists in the build). | Tooling. | Developers can generate their own client. One link. | S |

**Done when:** a developer can read any single endpoint page and make a correct call without opening another page.

### Phase 3 — Make the guides teach the real jobs

Keep the existing guides but restructure each one as **Goal → Prerequisites → Steps (each with request + real response) → What can go wrong → Next**. Cap each guide at roughly one screen of prose per step; long code samples go in tabs, and anything over ~40 lines links to a runnable file.

| # | Guide | Status | Why it matters |
|---|---|---|---|
| 3.1 | **Quickstart** (first call in 10 minutes) | rewrite existing *Getting Started* | The page everyone reads. Must be short, must work. Ends with a real `200`. |
| 3.2 | **Authentication** (PAT vs OAuth, which to choose, token lifetime, refresh, revoking) | merge the three existing auth pages into one with two tabs | Three pages for one topic is confusing. |
| 3.3 | **Set up your catalog** (categories → measurements → taxes → products → images → modifiers) | restructure existing *Categories* + *Products* | The real first job of every integrator; today it's two very long pages. |
| 3.4 | **Sync a whole catalog from an external system** (idempotent upserts, batching, rate limits, what to do on partial failure) | **new** | The most common integration; upsert rules from 2.3 make this possible. |
| 3.5 | **Pull sales data** (receipts, void receipts, refunds, orders — date ranges, pagination, reconciling the three receipt endpoints) | restructure existing *Receipts* + *Orders* | Accounting/BI integrations; the date-range rule must be front and centre. |
| 3.6 | **Keep stock in sync** (inventory levels, GRN, purchase orders, multi-shop) | **new** | Currently undocumented as a flow. |
| 3.7 | **Take an online order end-to-end** (place → status → cancel, and the webhook that fires) | **new** | Food-delivery / e-commerce partners. |
| 3.8 | **Webhooks** (register, verify your endpoint, retries, idempotent handling, all event types) | update existing | Needs the full event list (1.4). |
| 3.9 | **Go live checklist** + **Troubleshooting** | update existing | Link to the new Errors page; add "the five mistakes everyone makes" (query params, date range, token header, page-end detection, upsert keys). |
| 3.10 | **Concepts page: the SalesPlay data model** — merchant → shops → POS devices → employees/shifts; catalog vs. sales objects; what an "encrypted ID" is and that it is stable. | **new** | One diagram answers a dozen questions. |
| 3.11 | **Glossary.** | **new** | Backoffice, merchant, shop, terminal, receipt vs. order vs. invoice, GRN, PO, modifier, measurement. |

**Done when:** a developer who has never seen the product can complete 3.1, 3.3 and 3.5 using only the docs, timed by someone on the team.

### Phase 4 — Make it easy to find things

| # | Task | How | Effort |
|---|---|---|---|
| 4.1 | **Search.** ✅ done 2026-09-14 (local search, `@easyops-cn/docusaurus-search-local`) | Docusaurus supports Algolia DocSearch (free for public docs) or a local search plugin (no external service). Recommend **local search** — no sign-up, works per brand, indexes all three sites independently. | S |
| 4.2 | **Overview page as a real landing page.** | Three entry points at the top: "First call in 10 min", "Build a catalog sync", "Pull sales data"; then the collection table (exists). | S |
| 4.3 | **Cross-links generated, not hand-written.** | Each endpoint page ends with "Used in guides: …" and each guide step links to its endpoint — produced by the generator from a small mapping, so they never go stale. | S |
| 4.4 | **Postman collection generated from the spec** and hosted in this repo, with collection-level Bearer auth, `baseUrl`/`Token` variables, and example bodies. | Replaces the hand-maintained collection on developer.salesplay.com that drifted. Per-brand copies come free from the tenant build. | M |
| 4.5 | **Method badges in search results and page titles** (`GET List products`). | Consistency with the sidebar. | S |

### Phase 5 — Finish the multi-brand promise

| # | Task | Needs from team |
|---|---|---|
| 5.1 | Vendrex screenshots for the 5 Backoffice pages (`access_token`, `access_token_generate`, `copy`, `oauth_token`, `outh_token_app`). | A Vendrex Backoffice login, or the screenshots. |
| 5.2 | Sellmo: brand colours, logo, favicon, Backoffice URL, API host. | Brand assets and URLs. |
| 5.3 | Verify the Vendrex and Sellmo APIs really are identical to SalesPlay's (same endpoints, same fields). If not, the spec needs per-brand overrides. | A Vendrex test token. |
| 5.4 | Brand-check script: after each build, fail if the other brand's name, host or Backoffice URL appears anywhere. | — (we did this by hand once; make it automatic). |

### Phase 6 — Keep it true (maintenance)

| # | Task | Why | How | Effort |
|---|---|---|---|---|
| 6.1 | **Contract test in CI.** | Problem L — the single most important item in this phase. | The checker script from Phase 1 runs on every change against a sandbox token; any field difference between spec and API fails the build. This is what stops the drift that caused Problem A. | M |
| 6.2 | **Build check in CI**: both brands build, zero broken links, zero brand leaks (5.4). | | GitHub Actions / Bitbucket Pipelines on every commit. | S |
| 6.3 | **Changelog page** + "Last verified: date" on every generated page. | Trust. | Generator stamps the date the spec was last contract-tested; humans write the changelog entry when the spec changes. | S |
| 6.4 | **Docs review checklist** for pull requests. | Consistency. | Ten lines: example runs? response real? error cases? brand-neutral wording? links? screenshot for both brands? | S |
| 6.5 | **Ownership.** | Nothing without an owner survives. | One named owner for the spec, one for guides; API team must notify docs of any endpoint change (add it to their definition of done). | — |
| 6.6 | **Feedback loop.** | Find what's unclear. | "Was this page helpful?" widget (Docusaurus plugin) and a docs@ address; review monthly. | S |

### Phase 7 — Nice to have (after everything above)

- **Try-it console** on each endpoint page (paste token, click Send). Docusaurus has plugins for this; only worth it once every example is real.
- **Official SDKs** (JS, PHP, Python) generated from the OpenAPI file; the six-language tabs then show SDK calls instead of raw HTTP.
- **Status page / API health** link.
- **Versioned docs** when API v2 arrives (Docusaurus supports this natively).

---

## 5. Order of work and rough timeline

```
Week 1   Phase 1 (accuracy)            ← needs the seeded test account first
Week 2   Phase 2 (reference quality)   ← can start 2.4–2.7 in parallel with Phase 1
Week 3–4 Phase 3 (guides)              ← 3.1, 3.2, 3.3 first; they unblock user testing
Week 4   Phase 4 (findability)         ← search is a half-day, do it early
Week 5   Phase 5 (brands) + Phase 6 (CI, checklist, changelog)
later    Phase 7
```

Phases 1 and 6.1 are the ones that must not be skipped: they are why the docs went wrong and what stops it happening again.

---

## 6. What we need from the SalesPlay team before starting

1. A **test merchant account** where we can create sales, shifts, GRNs, purchase orders, stock movements and online orders (or captured real responses for those endpoints).
2. The **full list of error codes** and of **webhook event types**.
3. Confirmed **rate limit**, **timezone**, and **maximum date range** for sales endpoints.
4. Which **token header** is the official one (`Authorization` vs `Token`).
5. **Vendrex** Backoffice login (or screenshots) and a Vendrex API token; **Sellmo** brand assets.
6. A named **owner** on the API side who tells us when an endpoint changes.

---

## 7. What this plan deliberately does not do

- Change the API itself. Inconsistent field names and GET-with-body are documented, not "fixed".
- Move to a different docs tool. Docusaurus is the right choice; the problems are content and process, not tooling.
- Add a right-hand sticky code panel (PayPal-style). It needs a custom theme and doesn't improve accuracy; revisit after Phase 7.
