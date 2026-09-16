# Plan — Migrate developer.salesplay.com endpoint pages into Docusaurus API Reference

Status: **EXECUTED 2026-09-14** with all §6 defaults. Correction found during execution: spec drift was mostly one-way — remote was the newer side; local-only keys were stale renames (`employee.customers`, `pos_devices.Shop_name/POS_name`, `shifts.store_id`) and were dropped. Kept local-only `products.components`, `products.modifiers_ids`, `receipts.receipt_delete_date_time` — confirm these are real fields.

---

## 1. What I found

| Fact | Detail |
|---|---|
| Source of truth on developer.salesplay.com | Redoc rendering `https://developer.salesplay.com/api_documentation.yaml.php` (OpenAPI 3.0, 53 operations, 29 paths). |
| Local copy | `api_spec.yaml` (50 operations, 26 paths). Already the input to `gen_api_docs.py`, which **already generates** every page under `docs/API-reference/<group>/`. |
| So the "data move" is mostly done | The content on `/API-reference/webhooks/get-webhook` today already comes from the same spec. What's missing is (a) spec drift, (b) 12 endpoints never mapped, (c) presentation — the pages are plain tables, not the PayPal / Redoc layout. |
| Spec drift is two-way | Local was hand-improved (e.g. `customers.membership_status`, `products.variants`, fixed `employees` key). Remote has things local lacks (`products.components`, `products.modifiers_ids`, `receipts.receipt_delete_date_time`, 3 new paths). **Overwriting either side loses data → must merge.** |
| Remote spec quirks to fix during merge | `<!-- DELETE /products` is a broken HTML comment parsed as a YAML key; `POST /products` has **no `responses`** at all; `DELETE /taxes` is titled "Taxes Delete a single Customer"; `pos_devices` mixes `Shop_name`/`POS_name` casing. |
| Remote `info.description` prose | Sections: Using the REST API, Versioning, Authorization (PAT, OAuth, refresh), Pagination, Date & time, Handling errors, Webhooks overview / adding / testing / retries. These already exist as hand-written pages (`Introduction`, `guides/*`, `API-reference/pagination`, `webhooks/*`). Out of scope here except a one-time diff check (Phase 1, step 4). |
| Rendering stack | Docusaurus 3.10 classic preset, no OpenAPI plugin. `.md` files use MDX (`<Tabs>` already in use). Tenant renaming happens via `parseFrontMatter` + `remark-tenant-replace` — generated pages must keep saying "SalesPlay" so that pipeline works. |

---

## 2. Target page layout (PayPal `orders-create` mapped onto Docusaurus)

PayPal reference: https://developer.paypal.com/api/orders/v2/orders-create

```
┌──────────────────────────────────────────────────────────────────────┐
│ # Create Product                                        (H1 = title) │
│ One-paragraph description from spec.                                 │
│                                                                      │
│ [POST] https://api.salesplaypos.com/v1.0/products     (method badge) │
│                                                                      │
│ ## Authorization                                                     │
│ Bearer token · link to PAT / OAuth guides   (one line, every page)   │
│                                                                      │
│ ## Query parameters            (only if any)                         │
│ | Name | Type | Description |  — required ones marked  `name` *      │
│   type cell shows: string · string<date-time> · integer · enum: a|b  │
│   description cell appends: Default: x · Example: y · Max: 250       │
│                                                                      │
│ ## Request body  · application/json                                  │
│ Top-level fields table (same columns).                               │
│ Nested object / array-of-object fields render as                     │
│   <details><summary>`variants[]` — child attributes</summary> table  │
│   (this is PayPal's "show child attributes" toggle)                  │
│ Full sample JSON body.                                               │
│                                                                      │
│ ## Example request                                                   │
│ <Tabs> cURL · JavaScript · Python · PHP · Java · C#   (keep as-is)   │
│                                                                      │
│ ## Responses                                                         │
│ <Tabs> 200 · 400 · 401 · 429      (one tab per status code in spec)  │
│   each tab: description · sample JSON · fields table (nested via     │
│   <details> like the body) · for 4xx: link to Troubleshooting guide  │
└──────────────────────────────────────────────────────────────────────┘

Sidebar:  [GET] Get Products   [POST] Create Product   [DEL] Delete Product
          (colour badge via sidebar className + CSS, like the Redoc screenshot)
```

**What we deliberately do NOT replicate from PayPal** (`DECISION 2a`):
- Right-hand sticky code column. Docusaurus puts the TOC there; moving code samples there means swizzling `DocItem/Layout` and maintaining a custom React layout. Recommend **skip** — samples stay inline under "Example request", which is what Docusaurus-based API docs (Stripe-style alternatives aside) normally do.
- "Try it" / Send button — no API playground. Skip.
- SDK tabs / TypeScript definitions — no SDKs exist. Skip.

---

## 3. Endpoint inventory

### 3a. Already generated (39 ops) — will be regenerated with the new layout, same URLs

| Group | Ops | Notes |
|---|---|---|
| Webhooks | GET / POST / DELETE `/webhooks` | POST uses query params, not a body (per spec). |
| Categories | GET / POST / DELETE `/category` | |
| Sub Categories | GET / POST / DELETE `/sub_category` | |
| Measurements | GET / POST / DELETE `/measurements` | |
| Taxes | GET / POST / DELETE `/taxes` | Fix remote title typo ("Delete a single Customer"). |
| Customers | GET / POST / DELETE `/customers` | Merge: keep local `membership_*` fields. |
| Employee | GET `/employee` | Merge: keep local `employees` key (remote says `customers` — bug). |
| Suppliers | GET / POST / DELETE `/suppliers` | |
| Products | GET / POST `/products` | Merge: keep local `variants`, `delete_date`; add remote `components`, `modifiers_ids`. Add a `200` response to POST (remote has none). `DECISION 3a-i`: include `DELETE /products`? It's commented-out on remote — I'll **exclude** unless you say it's live. |
| Product Image | POST / DELETE `/product_image` | multipart. |
| Receipts | GET `/receipts`, GET `/void_receipts`, GET / POST `/credit_note_and_refund` | Merge: keep local `cashier_name`, `kot_reference_number`; add remote `receipt_delete_date_time`. |
| Orders | GET `/orders` | |
| Shops | GET `/shops` | |
| Payment Types | GET / POST / DELETE `/payment_types` | |
| Order Types | GET / POST / DELETE `/order_types` | |

### 3b. On developer.salesplay.com but NOT in our sidebar yet (12 ops) — `DECISION 3b`

Tick the ones to publish. Default: **all of them** (they are public on the current site).

| Group (sidebar label) | Folder | Ops | Doc ids |
|---|---|---|---|
| [ ] Modifiers | `modifiers/` | GET, DELETE `/modifiers` | `get-modifiers`, `delete-modifier` |
| [ ] Inventory | `inventory/` | GET, POST `/inventory` | `get-inventory`, `update-inventory` |
| [ ] GRN (Goods Received Notes) | `grn/` | GET, POST `/grn` | `get-grn`, `create-grn` |
| [ ] Purchase Orders | `purchase-orders/` | GET `/purchase_orders` | `get-purchase-orders` |
| [ ] Online Orders | `online-orders/` | POST `/online_orders`, GET `/online_order_status`, POST `/cancel_online_order` | `place-online-order`, `get-online-order-status`, `cancel-online-order` |
| [ ] Shifts | `shifts/` | GET `/shifts`, GET `/drawer_transaction` | `get-shifts`, `get-drawer-transactions` |
| [ ] Timecards | `timecards/` | GET `/timecards` | `get-timecards` |
| [ ] POS Devices | `pos-devices/` | GET `/pos_devices` | `get-pos-devices` |
| [ ] Merchant | `merchant/` | GET `/merchants` | `get-merchant` |

Sidebar order: **existing folders and order stay exactly as they are.** New groups (if ticked) are appended after Order Types, before Pagination, in the table order above. No existing file or folder is moved or renamed.

### 3c. Page titles — `DECISION 3c`
Remote uses operationIds like "Get a single of webhook", "Create or update a single category". Our current titles are cleaner ("Get a Single Webhook", "Create Category"). Recommend **keep ours**, but rename the POST pages to "Create or Update …" where the API really upserts (categories, sub-categories, measurements, taxes, customers, suppliers, products, payment types, order types) — that's a real behaviour the current title hides.

---

## 4. Execution phases

### Phase 1 — Spec merge (`api_spec.yaml`)
1. Download remote spec to `spec_remote.yaml` (temporary, not committed).
2. Write `merge_spec.py` (~40 lines, throwaway or kept): for each op, deep-merge remote → local **without deleting local-only keys**; add the 3 remote-only paths; drop the `<!-- DELETE` junk key.
3. Hand-fix the quirks listed in §1 (POST /products response, titles, `Shop_name` casing) in `api_spec.yaml`.
4. Diff remote `info.description` against `Introduction.md`, `guides/*`, `pagination.md` and report differences — **no edits**, just a list for you.
5. Delete `parse_yaml.py` (one-off exploration script, superseded).

Output: updated `api_spec.yaml`; `static/api_spec.json` regenerates automatically on `npm start`.

### Phase 2 — Generator upgrade (`gen_api_docs.py`)
Changes, all inside the existing script (no new dependencies):
1. Page header: method badge `<span className="api-badge api-badge--get">GET</span>` + full URL, replacing the two separate code blocks.
2. Parameter/field tables: drop the "Required" column; mark required with `*` after the name (PayPal style). Type cell gains `<format>`, `enum: a | b`, array item type. Description cell gains `Default:`, `Example:`, `Min/Max:` when present in spec.
3. Nested body/response fields: object and array-of-object children go into `<details><summary>` blocks instead of dotted-path rows.
4. Responses: wrap all status codes in `<Tabs>`; 4xx tabs link to `../../guides/errors-guide`.
5. `PAGES` map: add the 12 new ops from §3b (whichever you tick) and titles from §3c.
6. Keep the 6-language example tabs unchanged.
7. Self-check: `python gen_api_docs.py` must print `Wrote 53 pages.` and `npm run build` must finish with 0 broken links.

### Phase 3 — Sidebar + CSS
1. `sidebars.js`: in place, each endpoint string becomes `{ type: 'doc', id, className: 'api-method get' }`. Same file, same categories, same order — only the badge class is added.
2. `src/css/custom.css`: ~25 lines — `.api-badge` pill (page header) and `.api-method::before` sidebar badge, colours GET green / POST blue / DELETE red, dark-mode variants.
3. Append the ticked §3b groups after Order Types.

### Phase 4 — Verify
1. `npm run build` (salesplay) + `npm run build:vendrex` — confirms tenant replacement still works on generated pages.
2. Spot-check 5 pages in the browser against developer.salesplay.com: `get-webhook`, `create-product`, `get-receipts`, `place-online-order`, `get-purchase-orders` (covers query-only, nested body, nested response, multi-status responses).
3. Update `docs/API-reference/index.md` Overview table with the new collections.

### Not doing (say if you want any of these)
- Right-hand sticky code panel (see `DECISION 2a`).
- OpenAPI plugin (`docusaurus-plugin-openapi-docs`) — would replace the generator with a heavier dependency for the same output; not worth it while the 350-line generator works.
- Editing the hand-written concept pages (Introduction, guides, webhooks overview/payload/testing/retries).
- Deleting `docs/API-reference/Webhooks.md` ("Webhook API Suite") — orphaned from the sidebar, only linked from `guides/webhooks-guide.md`. Flagging it; your call.

---

## 5. Files touched

| File | Action |
|---|---|
| `api_spec.yaml` | merged + hand-fixed |
| `gen_api_docs.py` | upgraded renderer, extended `PAGES` |
| `parse_yaml.py` | deleted |
| `docs/API-reference/**/*.md` (endpoint pages) | regenerated — **do not hand-edit these; edit the spec** |
| `docs/API-reference/{modifiers,inventory,grn,purchase-orders,online-orders,shifts,timecards,pos-devices,merchant}/` | new folders, additive only (same `<group>/<slug>.md` pattern as existing) |
| `docs/API-reference/index.md` | overview table extended |
| `sidebars.js` | badge className added to endpoint entries; new groups appended |
| `src/css/custom.css` | badge styles |

---

## 6. Decisions summary (edit here)

| ID | Question | Default if you don't change it |
|---|---|---|
| 2a | Right-column code panel? | No |
| 3a-i | Publish `DELETE /products`? | No (commented out on remote) |
| 3b | Which of the 12 unmapped ops to publish? | All |
| 3c | Rename upsert POST pages to "Create or Update …"? | Yes |
| — | Delete orphaned `Webhooks.md`? | Leave it |
