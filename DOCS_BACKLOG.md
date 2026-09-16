# Documentation backlog — small, concrete improvements

Companion to `DOCS_IMPROVEMENT_PLAN.md` (the strategy). This file is the **work list**: each item is a small, specific edit or check that one person can finish in under a day, with the reason and the "done when". Tick items off here; nothing in this file has been done yet unless marked ✅.

Everything below was found by reading every page and by calling the live API with the test account on 2026-09-14.

---

## 1. Endpoint verification tracker

Legend — ✅ **verified**: real response compared field-by-field with the spec, differences fixed. ⚠️ **partial**: endpoint answers `200`, but the account had no data so the *item* shape (fields inside the list) is still unverified. ❌ **not verified**: never called successfully.

| Endpoint | Status | What is still needed |
|---|---|---|
| `GET /webhooks` · `POST` · `DELETE` | ✅ | — |
| `GET /category` | ✅ | — |
| `POST /category` · `DELETE /category` | ❌ | Create a category, read it back, delete it. Confirm the upsert key (`category_name`? `id`?). |
| `GET/POST/DELETE /sub_category` | ✅ | — |
| `GET/POST/DELETE /measurements` | ✅ | — |
| `GET/POST/DELETE /taxes` | ✅ | — |
| `GET/POST/DELETE /customers` | ✅ | — |
| `GET /employee` | ✅ | — |
| `GET /suppliers` | ✅ | — |
| `POST /suppliers` · `DELETE /suppliers` | ❌ | Our test failed validation (name rule, now documented). Re-run with a valid name; confirm `DELETE` body is `{"supplier_id": …}` (the code you sent, not the encrypted id). |
| `GET /products` · `POST /products` | ✅ | Also verify that sending the same `product_code` twice **updates** (upsert) — not yet checked. |
| `POST /product_image` · `DELETE /product_image` | ❌ | Needs a multipart upload with a real image file against `DOC-TEST-001`. |
| `GET /receipts` · `/void_receipts` · `/credit_note_and_refund` | ⚠️ | Account has no sales. Needs one sale, one void, one refund made on the POS, then re-run the checker. |
| `POST /credit_note_and_refund` | ❌ | Needs a real receipt to refund against. |
| `GET /orders` | ⚠️ | Needs an order placed on the POS. |
| `GET /shops` | ✅ | — |
| `GET /payment_types` | ✅ | — |
| `POST /payment_types` · `DELETE /payment_types` | ❌ | Re-run with `payment_type_category` = `Card`/`Cheque`/`Other` (now documented); delete the created one (defaults can't be deleted). |
| `GET/POST/DELETE /order_types` | ✅ | — |
| `GET /modifiers` · `DELETE /modifiers` | ⚠️ / ❌ | Needs a modifier group created in the Backoffice (no create endpoint). |
| `GET /grn` · `POST /grn` | ⚠️ / ❌ | Needs a supplier + product, then create a GRN via the API and read it back. |
| `GET /inventory` · `POST /inventory` | ⚠️ / ❌ | Needs a stock-controlled product; then update a level and read it back. |
| `POST /online_orders` · `GET /online_order_status` · `POST /cancel_online_order` | ❌ / ⚠️ / ❌ | Needs the online-ordering feature enabled on the test account; place → status → cancel. |
| `GET /shifts` · `GET /drawer_transaction` | ⚠️ | Needs a shift opened/closed on the POS with one pay-in. |
| `GET /pos_devices` | ✅ | — |
| `GET /timecards` | ⚠️ | Needs an employee clock-in/out on the POS. |
| `GET /purchase_orders` | ⚠️ | Needs a PO created in the Backoffice. |
| `GET /merchant` | ✅ | Path corrected from `/merchants`. |

**How to re-verify:** the checker script used for this table lives outside the repo today. Backlog item 4.1 moves it into `tools/check_api.py` so anyone can run `SP_TOKEN=… python tools/check_api.py` and get the same table.

**Facts confirmed by the live API that must not be "corrected" back** (they contradict the old docs and the Redoc site):

- Filters, ids and pagination are read from a **JSON body** on every method, including `GET` and `DELETE`. Query-string parameters are ignored.
- `cursor` is always returned; the last page is an **empty array**.
- `receipts`, `void_receipts`, `credit_note_and_refund`, `orders` require `created_at_min` **and** `created_at_max`. Multi-year ranges are rejected ("requested date range is not supported"); 12 months works.
- Accepted date formats: `YYYY-MM-DD HH:MM:SS` and `YYYY-MM-DD`. ISO-8601 with `T`/`Z` is rejected (`Invalid date Format.`).
- Both `Authorization: Bearer <token>` and `Token: Bearer <token>` headers are accepted.
- There is **no** `X-Request-ID` response header. There is **no** `PUT /webhooks` (returns `405`).
- Error body shape: `{"errors": {"code": "…", "details": "…", "field": "…"}}` (`field` only on validation errors). Codes seen: `UNAUTHORIZED`, `INVALID_VALUE`, `INVALID_FORMAT`, `BAD_REQUEST`.
- Deleting an order type is a soft delete: re-creating the same name restores the same id.
- Webhook `status` is `ENABLED`/`DISABLED`; the only known event type is `receipts.update`.

---

## 2. Small edits, page by page

Each row: what to change → why (best practice it serves) → done when.

### 2.1 Site-wide

| # | Edit | Why | Done when |
|---|---|---|---|
| S1 | Remove emoji from headings (`## 🔑 Get Your Access Token` → `## Get your access token`). 30+ headings in `guides/*.md`. | Emoji in headings produce ugly anchors (`#-get-your-access-token`), break the on-page TOC alignment, and read as informal in a reference site. Keep emoji, if at all, in admonitions. | `grep -rE "^#+ [^A-Za-z\`]" docs` returns nothing outside code blocks. |
| S2 | Add a `description:` line to every page's front matter (one sentence). | Used for the browser tab preview, search snippets and link previews. Currently **0** pages have one. | Every `.md` under `docs/` has `description:`. |
| S3 | Sentence-case headings everywhere (`## Query Parameters` → `## Query parameters`). | Consistency; matches the generated reference pages, which already use sentence case. | One style across guides and reference. |
| S4 | Decide one term per concept and apply it: **Backoffice** (not "back office"/"BackOffice"), **access token** (not "API key"/"PAT" in body text — Vendrex's UI says API key; the guide already handles that per brand), **shop** (not "store" — but note the API itself sometimes says `store_id`). | A reader should never wonder whether two words mean two things. | Glossary page exists (item G1) and `grep` for the rejected variants finds only quoted API field names. |
| S5 | Replace "This API will allow get the list of…" style descriptions on all 53 operations with: what it does · when to use it · the one rule that bites. | Grammar, and the description is the first thing on the page. | No operation description starts with "This API will allow". |
| S6 | `docusaurus.config.js`: move `onBrokenMarkdownLinks` under `markdown.hooks` (build prints a deprecation warning every time). | Keeps the build output clean so real warnings are noticed. | Build prints no deprecation warning. |
| S7 | Delete `docs/API-reference/Webhooks.md` ("Webhook API Suite", 420 lines) — orphaned; not in the sidebar; duplicates the generated webhook pages and the webhooks guide. | Duplicate content drifts. | File removed; `guides/webhooks-guide.md` links point to the generated pages. |
| S8 | Delete `docs/guides/authentication.md` after merging anything unique into `personal-access-tokens.md` / `oauth.md` — it is a third copy of the same topic and is not in the sidebar. | Same. | One page per auth method, both in the sidebar under *Get Your Credentials*. |
| S9 | Add "Last verified: YYYY-MM-DD" to the generated reference pages (stamped by `gen_api_docs.py`). | Readers can judge freshness; team can see what's stale. | Every generated page shows the date of the last checker run. |

### 2.2 Introduction (`docs/Introduction.md`)

| # | Edit | Why | Done when |
|---|---|---|---|
| I1 | Shorten the H1 to "SalesPlay API" and move "Welcome to…" into the first sentence. | Titles are names, not greetings; the tab and sidebar show it. | H1 ≤ 4 words. |
| I2 | Add three task links at the top: *Make your first call* · *Set up your catalog* · *Pull sales data*. | Most readers arrive with a job; give them the door in the first screen. | Links present and working. |
| I3 | Replace the "Key Features" marketing list with the *data model* summary (merchant → shops → POS devices; catalog objects; sales objects) or link to the concepts page (G2). | Developers want the shape of the system, not adjectives. | Section replaced. |

### 2.3 Getting Started (`docs/guides/getting-started.md`)

| # | Edit | Why | Done when |
|---|---|---|---|
| GS1 | Add the Postman screenshot for the first request (`static/img/shared/postman_first_request.png`; the image block is already in the file, commented out). | Step has text and cURL but no picture of the tool the page is about. | Image shows `GET {{baseUrl}}/shops` with a `200`. |
| GS2 | State the token header once, clearly: "Send `Authorization: Bearer <token>` (the Postman collection uses the equivalent `Token: Bearer <token>` header)". | Both work; readers see two different things and think one is wrong. | One sentence, both variants explained. |
| GS3 | Add "What you'll need" box at the top (Backoffice login, Postman, 10 minutes). | Standard quickstart pattern; sets expectations. | Box present. |
| GS4 | Make the troubleshooting table's `401` row show the real body (`"code": "UNAUTHORIZED"`, `"details": "Access token is not valid."`). | Real text is what the reader will see in their screen and search for. | Table updated. |

### 2.4 Personal Access Tokens / OAuth (`personal-access-tokens.md`, `oauth.md`)

| # | Edit | Why | Done when |
|---|---|---|---|
| A1 | State token lifetime and expiry behaviour for access tokens (the Backoffice lets you set an expiry date — say what happens after it). | Unanswered question every integrator has. | Sentence added, confirmed with the API team. |
| A2 | In `oauth.md`, list the permission names as the API shows them (`RECEIPTS_READ`, `ITEMS_WRITE` …) in a table with the endpoints each one unlocks. The screenshot shows them, the text doesn't. | Permissions are the one thing an OAuth integrator must get right. | Table maps every endpoint to its permission. |
| A3 | Add a "Which one should I use?" comparison at the top of *Get Your Credentials* (PAT: your own account, one merchant; OAuth: acting for other merchants). | Choosing wrongly costs days. | Comparison table present. |
| A4 | Verify the OAuth token/refresh examples against the real `/oauth/token` endpoint (the Postman collection has both requests). | Never verified. | Examples run; responses are real. |

### 2.5 Troubleshooting (`docs/guides/errors-guide.md`)

| # | Edit | Why | Done when |
|---|---|---|---|
| E1 | **Remove the `X-Request-ID` advice** (§Debugging Tips 1 and `going-live.md` "Log Request IDs"). The API sends no such header. | It's wrong; a reader will look for it and lose trust. | No mention of `X-Request-ID` anywhere. |
| E2 | **Fix the scopes tip** (`orders.manage`): Personal access tokens have no scopes; OAuth apps have permissions named like `RECEIPTS_READ`. | Wrong. | Tip rewritten. |
| E3 | Add the real error envelope and a table of codes (`UNAUTHORIZED`, `INVALID_VALUE`, `INVALID_FORMAT`, `BAD_REQUEST`, …) with example `details` text and the fix. | The most-used page after a failure. | Table present; every code we've seen is listed; API team confirms the full list. |
| E4 | Note that validation errors come back as **`401`**, not `400`, on some endpoints (observed on receipts/suppliers/payment types). | Surprising; readers will assume their token is broken. | Callout present. |
| E5 | Rename the page title to "Errors & troubleshooting" (front matter says "Troubleshooting", H1 says "Troubleshooting & Errors"). | Title and H1 must match. | Both identical. |

### 2.6 Rate limits (`docs/API-reference/rate-limits.md`)

| # | Edit | Why | Done when |
|---|---|---|---|
| R1 | Verify "300 requests / 300 seconds" by exceeding it on the test account; record the real `429` body and any `Retry-After` header. | Unverified number on a page that decides partners' architecture. | Page shows the observed response verbatim. |
| R2 | Add a copy-pasteable backoff snippet (one language is enough) that keys off the real response. | Actionable. | Snippet present. |

### 2.7 Dates & times (`docs/API-reference/date-time-format.md`)

| # | Edit | Why | Done when |
|---|---|---|---|
| D1 | Replace the vague "24-hour format" wording with the exact accepted formats: `YYYY-MM-DD HH:MM:SS` and `YYYY-MM-DD`; state that ISO-8601 (`2026-09-01T00:00:00Z`) is rejected with `Invalid date Format.` | Verified today; the page currently doesn't say what to send. | Formats listed with a rejected example. |
| D2 | State the timezone of timestamps (server local? merchant's? UTC?) — confirm with the API team. The page says "no conversion is performed" but not what zone the values are in. | Every reporting integration needs this. | One sentence, confirmed. |

### 2.8 Pagination (`docs/API-reference/pagination.md`)

| # | Edit | Why | Done when |
|---|---|---|---|
| P1 | ✅ Rewritten 2026-09-14 (JSON body, cursor always present, stop on empty page, 6 languages). | — | — |
| P2 | Confirm the default `limit` (page says 10) and whether there is a maximum (251 and 500 were accepted in testing — so the old "max 250" was wrong; find the real ceiling or state "no documented maximum"). | Accuracy. | Confirmed values on the page. |

### 2.9 Webhooks guide (`docs/guides/webhooks-guide.md`) and webhook reference pages

| # | Edit | Why | Done when |
|---|---|---|---|
| W1 | **Remove "4. Update a Webhook (PUT)"** — `PUT /webhooks` returns `405`. Replace with "to change a webhook, delete and re-create it" (or the real method, if the API team confirms one). | Wrong. | No PUT anywhere. |
| W2 | Event list: only `receipts.update` is confirmed. Mark it as the full list or get the rest from the API team. | The guide implies more. | Table matches reality. |
| W3 | Document how a webhook becomes `ENABLED` (creating one via the API produced `DISABLED`). | Otherwise the reader's first webhook silently never fires. | Sentence added, verified. |
| W4 | Add a verified sample delivery payload captured from a real event (needs a sale on the POS). | The payload page is currently unverified. | Payload is a real capture. |
| W5 | Merge the "Webhooks Overview" sidebar group into the "Webhooks" group (overview/payload/testing/retries first, then the three endpoints) — two groups with nearly the same name confuse. | Navigation clarity. | One "Webhooks" group. |

### 2.10 Categories / Products / Orders / Receipts guides

| # | Edit | Why | Done when |
|---|---|---|---|
| C1 | Trim each guide to one language per code block by default (tabs stay), and cut the "Service / Controller" boilerplate sections (`# ── Service ──` blocks in `categories.md` are 100+ lines each and framework-specific). | 894–968-line pages hide the five sentences that matter. | Each guide ≤ 300 lines; the concept is readable without opening a tab. |
| C2 | Every request example in the guides sends filters in the **JSON body** (several still build query strings, e.g. `receipt.md` lines ~328 and ~470). | Consistency with the verified behaviour. | `grep -n "http_build_query\|searchParams\|?limit=" docs/guides` finds nothing. |
| C3 | Every response example in the guides is a real capture, not invented. | Trust. | Each example traceable to a checker run. |
| C4 | Add the upsert key to each "create" step once verified (item 1: products, categories, suppliers…). | The most common integration bug is duplicates. | Stated on each create step. |

### 2.11 Going live (`docs/guides/going-live.md`)

| # | Edit | Why | Done when |
|---|---|---|---|
| L1 | Remove the `X-Request-ID` line (see E1). | Wrong. | Removed. |
| L2 | Replace generic advice with the five real mistakes: query params instead of body · missing date range · ISO dates · stopping on missing cursor · wrong token header. | Specific beats generic. | Section present. |
| L3 | Confirm the `partners@salesplaypos.com` review process exists, or remove it. | Don't promise a process that isn't real. | Confirmed or removed. |

### 2.12 Versioning (`docs/guides/versioning.md`)

| # | Edit | Why | Done when |
|---|---|---|---|
| V1 | The page describes a deprecation policy and a timeline example — confirm with the API team that this is the real policy, or mark it as "planned". | Don't document a promise the API team hasn't made. | Confirmed or reworded. |

### 2.13 Generated reference pages (`gen_api_docs.py` / `api_spec.yaml`)

| # | Edit | Why | Done when |
|---|---|---|---|
| G1 | Replace placeholder examples (`"string"`, `0`, `"2025-01-15 10:30:00"`) with real values by adding `example:` to every spec field, using captures from item 1. | Placeholders cause validation errors when copied. | No `"string"` in any generated example. |
| G2 | Add a `401` response (real body) to every operation and a `429` to every operation, so the Responses tabs are complete. | Today most pages show only `200`. | Every page has ≥ 3 response tabs. |
| G3 | On list endpoints, add a one-line "Paginated — see Pagination" link above the body table. | Readers land on endpoint pages directly. | Present on all list pages. |
| G4 | Show `required` fields first in every table. | Scanning. | Generator sorts required first. |
| G5 | Rename operations consistently: *List X* / *Create or update X* / *Delete X* (today: "Get Shops", "Get Merchant Information", "Receipts"). | One pattern. | Sidebar reads uniformly. |
| G6 | Add a "Related guide" link at the bottom of each endpoint page from a small map in the generator. | Reference ↔ guide navigation. | Every page in a guided flow links to the guide. |

---

## 3. Best-practice conventions (apply to every edit above)

1. **One page, one job.** Reference pages describe an endpoint; guides describe a task. Don't mix.
2. **Show a working request before explaining it.** Request → real response → explanation.
3. **Every example is real.** Copied from a checker run or a Backoffice screenshot, never typed from memory. If a value must be anonymised, keep its *shape* (same length, same characters).
4. **Say what breaks.** Every page that can fail lists the specific error the reader will see and what to do.
5. **Sentence case, no emoji in headings, ≤ 65 characters per line of prose, one term per concept.**
6. **Write as SalesPlay.** Never type "Vendrex" or "Sellmo" in a page — the build substitutes them. Brand-specific steps go in `<TenantBlock>`.
7. **Never hand-edit generated pages** (`docs/API-reference/<group>/*.md`). Edit `api_spec.yaml`, run `python gen_api_docs.py`.
8. **Screenshots:** ~1900 px wide, light theme, no personal data, one per step, both brands.
9. **Links:** relative `.md` links inside `docs/`; never `/docs/…` (the site is served at `/`).
10. **Front matter:** `title`, `sidebar_label`, `description` on every page.

---

## 4. Tooling and process items (small, high-leverage)

| # | Item | Done when |
|---|---|---|
| 4.1 | Move the endpoint checker into the repo as `tools/check_api.py` (reads `SP_TOKEN` from the environment; never commit a token) and document it in `TENANT_GUIDE.md`. | Anyone can regenerate §1 in one command. |
| 4.2 | Add a `tools/check_brand_leak.py` (or a script in `package.json`) that fails if a non-default build contains the default brand's name or hosts. | `npm run build:vendrex` fails on a leak. |
| 4.3 | Add `npm run check` = build both brands + link check + brand-leak check, and run it in CI on every change. | Green check on every commit. |
| 4.4 | Add `CHANGELOG.md` with a dated entry for the 2026-09-14 corrections (query→body, pagination, `/merchant`, new endpoints). | File exists; every spec change adds a line. |
| 4.5 | Add a 10-line **docs PR checklist** to `README.md` (example runs? response real? both brands? links? screenshot?). | Checklist present. |
| 4.6 | Ask the API team for: full error-code list, full webhook event list, rate-limit and timezone confirmation, max date range, token-expiry behaviour, whether a webhook update method exists. | Answers recorded in the pages above. |
| 4.7 | Rotate the test-account credentials that were shared in chat, and create a **dedicated docs test merchant** with sample sales/shifts data (unblocks 12 ⚠️ endpoints in §1). | New account exists; checker runs against it. |

---

## 5. Suggested order

1. **Wrong-fact removals first** (E1, E2, W1, L1, D1, C2) — cheap, and every day they stay up costs trust.
2. **§1 verification** for whatever the current account allows (`category`, `suppliers`, `payment_types` create/delete; product upsert); then request the seeded account (4.7) for the rest.
3. **Generator improvements** (G1–G6) — one change fixes 53 pages.
4. **Site-wide small edits** (S1–S9).
5. **Guide trims and rewrites** (C1, C3, GS1–GS4, A1–A4, W2–W5).
6. **Tooling** (4.1–4.5) so the above stays true.
