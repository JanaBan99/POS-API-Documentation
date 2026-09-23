# Recorded documentation issues — not yet fixed

*A register of every wrong, unverified or inconsistent fact found in this documentation while executing `PLAN_gio.md`, with the exact API category, endpoint, file and line. **Nothing in this file has been changed in the docs** — these were deliberately recorded, not fixed, because each needs either a decision from the documentation owner or confirmation from the SalesPlay API team. Written so that whoever picks an item up can go straight to the endpoint and the file.*

Recorded: 2026-09-16 (line numbers as of that date). Source for the issue list: `PLAN_gio.md` §11.

---

## Scope rule — what counts as an endpoint

The **only** source of truth for which endpoints exist is the official SalesPlay API documentation: **https://developer.salesplay.com/** (its OpenAPI file is mirrored, with verified corrections, in `api_spec.yaml`).

The documented API has **53 operations on 29 paths**, all using `GET`, `POST` or `DELETE` on a collection path (e.g. `GET /products`, `POST /products`, `DELETE /category`), with identifiers and filters sent in the JSON body. There are no `PUT` operations and no `/{id}` paths.

Consequently this register:

- reports issues **only** on those 53 documented operations;
- does **not** treat any other method/path combination as an API error, a missing endpoint, a broken endpoint, a failed test or something for the API team to fix — a method/path that is not on developer.salesplay.com is simply not part of the documented API and is excluded from the analysis;
- does not infer endpoints from REST conventions, similar endpoints, other API versions, sample code, or "what would be useful".

Where a guide's sample code uses a path that is not in the documented API, the only actionable point is that the sample should be rewritten against the documented operation for that task (listed per guide in §11.5); the undocumented path itself is not reported as an issue.

---

## Summary

| Ref | Problem | Where | Size | Who can resolve it |
|---|---|---|---|---|
| 11.1 | Placeholder example values (`"string"`, `0`) in generated reference pages | 49 of the 53 documented operations (root cause: `api_spec.yaml` has `example:` on 122 of 792 string fields) | 1,071 occurrences | Docs team, using real API captures (backlog G1) |
| 11.2 | Two orphaned pages that contradict the current pages | `docs/API-reference/Webhooks.md`, `docs/guides/authentication.md` | 2 files, 647 lines | Docs owner — delete (backlog S7, S8) |
| 11.3 | Wrong or unverified facts in the guides and concept pages | 9 entries, each with endpoint, file and line below | 9 | API team to confirm; docs team to edit |
| 11.4 | Inconsistent field names across documented endpoints, not called out anywhere | `api_spec.yaml` and the generated pages | 5 name pairs | Docs team — add the callout (`DOCS_IMPROVEMENT_PLAN.md` fix 1.5); API team if the names are to be unified |
| 11.5 | Guide sample code not written against the documented operation for the task | `product.md`, `categories.md`, `order-integration.md`, `receipt.md`, `webhooks-guide.md` | 5 guides | Docs team — rewrite the samples using the documented operations listed |

Why these matter more than usual now: the site is optimised for AI assistants (see `PLAN_gio.md`), which means assistants will repeat these pages *more* confidently. A wrong field or example in the docs becomes a wrong field or example in a developer's code.

---

## Endpoints affected — by API category

Every issue in this register, listed by API category (sidebar group) and the exact documented endpoint (method + path) it touches. Refs point to the detailed sections below. Numbers in parentheses after 11.1 are the count of `"string"` / `0` placeholders on that endpoint's page.

| API category | Endpoint | Issues |
|---|---|---|
| **Webhooks** | `GET /webhooks` | 11.1 (9) · 11.2 contradicted by orphaned `Webhooks.md` · 11.4 `created_at`/`updated_at` · 11.5 guide samples |
| | `POST /webhooks` | 11.1 (8) · 11.2 · 11.4 · 11.5 |
| | `DELETE /webhooks` | 11.1 (5) · 11.2 · 11.5 |
| **Categories** | `GET /category` | 11.1 (12) · 11.4 `created_at` **and** `updated_date` on the same response · 11.5 |
| | `POST /category` | 11.1 (11) · 11.4 · 11.5 |
| | `DELETE /category` | 11.1 (7) · 11.5 |
| **Sub Categories** | `GET /sub_category` | 11.1 (8) · 11.4 `created_at` + `updated_date` |
| | `POST /sub_category` | 11.1 (11) · 11.4 |
| | `DELETE /sub_category` | 11.1 (8) |
| **Measurements** | `GET /measurements` | 11.1 (12) · 11.4 `created_at` + `updated_date` |
| | `POST /measurements` | 11.1 (11) · 11.4 response has `updated_at` while the list has `updated_date` |
| | `DELETE /measurements` | 11.1 (4) |
| **Taxes** | `GET /taxes` | 11.1 (18) · 11.4 |
| | `POST /taxes` | 11.1 (15) · 11.4 |
| | `DELETE /taxes` | — (clean) |
| **Customers** | `GET /customers` | 11.1 (41) · 11.4 `created_at`/`updated_at` |
| | `POST /customers` | 11.1 (76) |
| | `DELETE /customers` | 11.1 (6) |
| **Employee** | `GET /employee` | 11.1 (17) |
| **Suppliers** | `GET /suppliers` | 11.1 (16) · 11.4 |
| | `POST /suppliers` | 11.1 (35) · 11.4 |
| | `DELETE /suppliers` | 11.1 (4) |
| **Products** | `GET /products` | 11.1 (9) · 11.3 `limit` "Maximum: 100" unverified (251 accepted) · 11.4 `created_date`/`updated_date`, `shop_id` · 11.5 |
| | `POST /products` | 11.1 (96) · 11.4 request uses **`store_id`** (only place in the API) and `created_at`/`updated_at`; response uses `product_id` · 11.5 |
| **Product Image** | `POST /product_image` | — (clean) |
| | `DELETE /product_image` | 11.1 (4) · 11.4 `product_id` |
| **Receipts** | `GET /receipts` | 11.1 (19) · 11.3 date-format wording · 11.4 `shop_id`, `product_id` · 11.5 |
| | `GET /void_receipts` | 11.1 (52) · 11.4 · 11.5 |
| | `GET /credit_note_and_refund` | 11.1 (66) · 11.4 |
| | `POST /credit_note_and_refund` | 11.1 (34) · 11.4 |
| **Orders** | `GET /orders` | 11.1 (40) · 11.4 `shop_id`, `product_id` · 11.5 |
| **Shops** | `GET /shops` | 11.1 (12) · 11.4 `updated_date` only (no `created_*`), request filter `shop_ids` |
| **Payment Types** | `GET /payment_types` | 11.1 (32) · 11.4 `created_date`/`updated_date`, `shop_id` |
| | `POST /payment_types` | 11.1 (15) |
| | `DELETE /payment_types` | 11.1 (8) |
| **Order Types** | `GET /order_types` | 11.1 (12) · 11.4 `created_at` + `updated_date` |
| | `POST /order_types` | 11.1 (11) |
| | `DELETE /order_types` | 11.1 (7) |
| **Modifiers** | `GET /modifiers` | 11.1 (35) · 11.4 `created_date`/`updated_date` |
| | `DELETE /modifiers` | 11.1 (7) |
| **Inventory** | `GET /inventory` | 11.1 (20) · 11.4 `shop_id`/`shop_ids`, `product_id` |
| | `POST /inventory` | — (clean) · 11.4 `shop_id`, `product_id` |
| **GRN** | `GET /grn` | 11.1 (49) · 11.4 `shop_id`/`shop_ids`, `product_id` |
| | `POST /grn` | 11.1 (42) · 11.4 |
| **Purchase Orders** | `GET /purchase_orders` | 11.1 (30) · 11.4 `shop_id`/`shop_ids`, `product_id` |
| **Online Orders** | `POST /online_orders` | 11.1 (138 — the worst page) · 11.4 `shop_id` |
| | `GET /online_order_status` | 11.1 (11) · 11.3 description says "path parameter" — the id goes in the JSON body |
| | `POST /cancel_online_order` | 11.1 (8) |
| **Shifts** | `GET /shifts` | 11.1 (23) · 11.4 `created_at`, `shop_id` |
| | `GET /drawer_transaction` | 11.1 (25) · 11.4 `shop_id`/`shop_ids` |
| **Timecards** | `GET /timecards` | 11.1 (21) · 11.4 `shop_id`/`shop_ids` |
| **POS Devices** | `GET /pos_devices` | 11.1 (15) · 11.4 `shop_id` |
| **Merchant** | `GET /merchant` | — (clean) · 11.4 `created_at` |
| **All list endpoints** (24 `GET` operations that accept `limit`) | `GET /category` … `GET /void_receipts` | 11.3 pagination: default `10` documented, no maximum verified; only `GET /products` declares `maximum: 100` |
| **All endpoints** | every documented operation | 11.3 rate limit "300 / 300 s" unverified (360 requests in 54 s all `200`) · 11.3 error body in `errors-guide.md` doesn't match the real `{"errors":{…}}` envelope · 11.3 `X-Request-ID` header not observed |

**Clean pages (no placeholder issue):** `DELETE /taxes`, `POST /product_image`, `POST /inventory`, `GET /merchant`.

---

## Suggested order

1. **11.5** — the most damaging: a developer following the product, category, receipt or webhook guide today copies sample code that does not use the documented operation for the task. Rewrite each sample against the documented `GET`/`POST`/`DELETE <collection>` operation; no API-team input needed — the target operations are all documented.
2. **11.3** — nine one-line facts; most are already confirmed in `DOCS_BACKLOG.md` and only need the edit.
3. **11.2** — two deletions.
4. **11.1** — mechanical once real values are captured; one `example:` per spec field, then `node gen_api_docs.mjs`.
5. **11.4** — a callout box on the affected pages; no API change needed.

---

Checked 2026-09-16 against the current files. Line numbers are as of that date.

## 11.1 Placeholder examples in generated reference pages (audit A4)

**Where:** 49 of the 53 generated pages under `docs/API-reference/<group>/*.md` — 1,071 occurrences of `"string"` and 13 pages with `0` as a number placeholder, in the *Example request* and *Response* JSON blocks. Per endpoint (count = placeholders on that page):

| API category | Endpoint | Page | Count |
|---|---|---|---|
| Online Orders | `POST /online_orders` | `online-orders/place-online-order.md` | 138 |
| Products | `POST /products` | `products/create-product.md` | 96 |
| Customers | `POST /customers` | `customers/create-customer.md` | 76 |
| Receipts | `GET /credit_note_and_refund` | `receipts/get-credit-notes.md` | 66 |
| Receipts | `GET /void_receipts` | `receipts/get-void-receipts.md` | 52 |
| GRN | `GET /grn` | `grn/get-grn.md` | 49 |
| GRN | `POST /grn` | `grn/create-grn.md` | 42 |
| Customers | `GET /customers` | `customers/get-customers.md` | 41 |
| Orders | `GET /orders` | `orders/get-orders.md` | 40 |
| Modifiers | `GET /modifiers` | `modifiers/get-modifiers.md` | 35 |
| Suppliers | `POST /suppliers` | `suppliers/create-supplier.md` | 35 |
| Receipts | `POST /credit_note_and_refund` | `receipts/create-credit-note.md` | 34 |
| Payment Types | `GET /payment_types` | `payment-types/get-payment-types.md` | 32 |
| Purchase Orders | `GET /purchase_orders` | `purchase-orders/get-purchase-orders.md` | 30 |
| Shifts | `GET /drawer_transaction` | `shifts/get-drawer-transactions.md` | 25 |
| Shifts | `GET /shifts` | `shifts/get-shifts.md` | 23 |
| Timecards | `GET /timecards` | `timecards/get-timecards.md` | 21 |
| Inventory | `GET /inventory` | `inventory/get-inventory.md` | 20 |
| Receipts | `GET /receipts` | `receipts/get-receipts.md` | 19 |
| Taxes | `GET /taxes` | `taxes/get-taxes.md` | 18 |
| Employee | `GET /employee` | `employee/get-employees.md` | 17 |
| Suppliers | `GET /suppliers` | `suppliers/get-suppliers.md` | 16 |
| Payment Types | `POST /payment_types` | `payment-types/create-payment-type.md` | 15 |
| POS Devices | `GET /pos_devices` | `pos-devices/get-pos-devices.md` | 15 |
| Taxes | `POST /taxes` | `taxes/create-tax.md` | 15 |
| Categories | `GET /category` | `categories/get-categories.md` | 12 |
| Measurements | `GET /measurements` | `measurements/get-measurements.md` | 12 |
| Order Types | `GET /order_types` | `order-types/get-order-types.md` | 12 |
| Shops | `GET /shops` | `shops/get-shops.md` | 12 |
| Categories | `POST /category` | `categories/create-category.md` | 11 |
| Measurements | `POST /measurements` | `measurements/create-measurement.md` | 11 |
| Online Orders | `GET /online_order_status` | `online-orders/get-online-order-status.md` | 11 |
| Order Types | `POST /order_types` | `order-types/create-order-type.md` | 11 |
| Sub Categories | `POST /sub_category` | `sub-categories/create-sub-category.md` | 11 |
| Products | `GET /products` | `products/get-products.md` | 9 |
| Webhooks | `GET /webhooks` | `webhooks/get-webhook.md` | 9 |
| Online Orders | `POST /cancel_online_order` | `online-orders/cancel-online-order.md` | 8 |
| Payment Types | `DELETE /payment_types` | `payment-types/delete-payment-type.md` | 8 |
| Sub Categories | `GET /sub_category` | `sub-categories/get-sub-categories.md` | 8 |
| Sub Categories | `DELETE /sub_category` | `sub-categories/delete-sub-category.md` | 8 |
| Webhooks | `POST /webhooks` | `webhooks/create-webhook.md` | 8 |
| Categories | `DELETE /category` | `categories/delete-category.md` | 7 |
| Modifiers | `DELETE /modifiers` | `modifiers/delete-modifier.md` | 7 |
| Order Types | `DELETE /order_types` | `order-types/delete-order-type.md` | 7 |
| Customers | `DELETE /customers` | `customers/delete-customer.md` | 6 |
| Webhooks | `DELETE /webhooks` | `webhooks/delete-webhook.md` | 5 |
| Measurements | `DELETE /measurements` | `measurements/delete-measurement.md` | 4 |
| Product Image | `DELETE /product_image` | `product-image/delete-image.md` | 4 |
| Suppliers | `DELETE /suppliers` | `suppliers/delete-supplier.md` | 4 |

Clean (no placeholders): `DELETE /taxes`, `POST /product_image`, `POST /inventory`, `GET /merchant`.

Example, `docs/API-reference/products/get-products.md` lines 48, 54, 66, 72, 101, 107: `"product_ids": "string"`, `"cursor": "string"`.

**Root cause:** the pages are generated by `gen_api_docs.mjs` from `api_spec.yaml`; where a field has no `example:` value the generator prints the type name. The spec has 122 `example:` lines against 792 `type: string` fields.

**Why it matters for AI assistants:** an assistant copies the example verbatim; a developer sends `"limit": 0` or `"product_ids": "string"` and receives `INVALID_VALUE`, then blames the documentation. The fix is tracked as `DOCS_BACKLOG.md` G1 (add `example:` to every spec field from real captures).

## 11.2 Orphaned duplicate pages that contradict the current pages (audit A9)

| File | Endpoints described | Size | Not linked from | Contradicts | How |
|---|---|---|---|---|---|
| `docs/API-reference/Webhooks.md` ("Webhook API Suite") | Webhooks — `GET`, `POST`, `DELETE /webhooks` | 420 lines | `sidebars.js` (only `API-reference/webhooks/*` are listed) — reachable by URL and by search only | `docs/API-reference/webhooks/get-webhook.md`, `create-webhook.md`, `delete-webhook.md`, `overview.md` | Documents the parameters as **query-string** (`### Query Parameters`, line 27; `GET …/webhooks?id=wh_abc123`, lines 39–102), whereas the current pages state the verified behaviour: *parameters are read from the JSON body, even on GET; query-string parameters are ignored* (`get-webhook.md` lines 24–25). |
| `docs/guides/authentication.md` ("Get Your Credentials" / "Authentication") | authentication for every endpoint | 227 lines | `sidebars.js` — reachable by URL and by search only | `docs/guides/personal-access-tokens.md` and `docs/guides/oauth.md` | Same content as both current pages merged, but a separate older copy; corrections made to the current pages are not reflected here. The file also starts with a UTF-8 BOM. |

**Why it matters for AI assistants:** two pages on the same site giving different answers; the assistant picks one at random and cites it. Tracked as `DOCS_BACKLOG.md` S7 and S8 (delete both).

## 11.3 Wrong or unverified facts in the guides and concept pages (audit A10)

| Fact as written | API category / endpoint(s) | File and line | Status | Correct fact (to be confirmed) |
|---|---|---|---|---|
| "Every API response (success or failure) includes an `X-Request-ID` header. Log this ID…" | All categories — every documented endpoint | `docs/guides/errors-guide.md` line 63 (Debugging Tips) | **Not observed** — the live API returned no such header on any documented endpoint (verified 2026-09-14, `DOCS_BACKLOG.md` E1) | Remove; if the API team provides a correlation header, document that one |
| "**Log Request IDs**: Store the `X-Request-ID` for every SalesPlay interaction…" | All categories — every documented endpoint | `docs/guides/going-live.md` line 36 | **Not observed** — same | Same |
| "Per Account: 300 requests / 300 seconds" | All categories — every documented endpoint (tested with `GET /merchant`) | `docs/API-reference/rate-limits.md` line 17; repeated in `docs/guides/errors-guide.md` line 50 | **Unverified** — the page itself notes (line 20) that 360 requests in 54 seconds all returned `200`; no `429` or `Retry-After` has been observed | Ask the API team for the real limit and the `429` behaviour; until then label the figure "published policy, not observed" |
| "check that the Personal Access Token you are using has the required scope (e.g., `orders.manage`)" | All categories — authentication on every documented endpoint | `docs/guides/errors-guide.md` line 66 | **Wrong** — Personal Access Tokens have no scopes; OAuth apps have permissions named like `RECEIPTS_READ` (`DOCS_BACKLOG.md` E2) | Rewrite the tip around OAuth app permissions |
| Date format described only as "(Y-m-d H:i:s) 24 hours format" | All list endpoints with date filters: `GET /receipts`, `/void_receipts`, `/credit_note_and_refund`, `/orders`, `/category`, `/sub_category`, `/measurements`, `/taxes`, `/customers`, `/employee`, `/suppliers`, `/products`, `/shops`, `/payment_types`, `/order_types`, `/modifiers`, `/grn`, `/online_order_status`, `/shifts`, `/drawer_transaction`, `/timecards`, `/purchase_orders`, `/pos_devices`; plus every `created_at`/`updated_at` field in requests | field tables in all generated pages (e.g. `get-products.md` lines 44–47) and `docs/API-reference/date-time-format.md` | **Incomplete** — verified accepted formats are `YYYY-MM-DD HH:MM:SS` and `YYYY-MM-DD`; ISO-8601 is rejected with `Invalid date Format.` (`DOCS_BACKLOG.md` D1) | State the two accepted formats and the rejection |
| "The request to get the order status should include the order reference ID as a path parameter." | Online Orders — `GET /online_order_status` | `api_spec.yaml` → `GET /online_order_status` description (rendered on `docs/API-reference/online-orders/get-online-order-status.md` under the intro paragraph) | **Wrong** — the documented endpoint takes `system_unique_ids` in the JSON body like every other endpoint; there is no path parameter | Replace with "Send the system unique IDs in the JSON body" — found 2026-09-16 while regenerating the pages |
| Error payload shown as `{"code": "validation_failed", "message": "…", "request_id": "req_…"}` | All categories — every documented endpoint (`400`/`401`/`429` responses) | `docs/guides/errors-guide.md` lines 33–43 (Handling Error Responses) | **Wrong** — the live API returns `{"errors": {"code", "details", "field"}}` with codes like `UNAUTHORIZED`, `INVALID_VALUE` (verified; this is what all 53 reference pages show) | Replace with the verified body; ties in with the `X-Request-ID` rows |
| "Test in sandbox environments before deploying to production. Support for development, staging, and production endpoints." | All categories — base URL of every documented endpoint | was `docs/Introduction.md` (Key Features card) — removed in Step 6; the same claim remains in `docs/guides/going-live.md` line 45 ("Once your testing in the sandbox environment is complete") | **Unverified** — no sandbox base URL is documented anywhere; the only documented host is `https://api.salesplaypos.com/v1.0` | Confirm with the API team whether a sandbox exists; if so document its base URL, if not remove the sentence in going-live |
| Pagination "default limit 10", old "max 250" | 24 list endpoints that accept `limit` (all documented `GET` list operations); only `GET /products` declares `maximum: 100` | `docs/API-reference/pagination.md`; `limit` rows on generated pages ("Maximum: 100") | **Unverified** — 251 and 500 were accepted in testing (`DOCS_BACKLOG.md` P2) | Confirm the real ceiling with the API team |

## 11.4 Inconsistent field names across documented endpoints, not called out anywhere (audit A12)

Counted in `api_spec.yaml` (the source the reference pages are generated from). Exact endpoints:

| Concept | Name used | API category → endpoint (request / response) |
|---|---|---|
| Creation timestamp | `created_at` | **Responses:** Categories `GET /category`, `POST /category` · Sub Categories `GET /sub_category`, `POST /sub_category` · Measurements `GET /measurements`, `POST /measurements` · Taxes `GET /taxes`, `POST /taxes` · Customers `GET /customers` · Suppliers `GET /suppliers`, `POST /suppliers` · Order Types `GET /order_types` · Shifts `GET /shifts` · Webhooks `GET /webhooks`, `POST /webhooks` · Merchant `GET /merchant`. **Requests:** `POST /category`, `POST /sub_category`, `POST /measurements`, `POST /taxes`, `POST /suppliers`, `POST /products`; `created_at_min/max` filters on every list endpoint |
| | `created_date` | **Responses:** Products `GET /products` · Payment Types `GET /payment_types` · Modifiers `GET /modifiers` |
| Update timestamp | `updated_at` | **Responses:** Customers `GET /customers` · Webhooks `GET /webhooks`, `POST /webhooks` · Measurements `POST /measurements` (but its `GET` says `updated_date`). **Request:** `POST /products`; `updated_at_min/max` filters on `GET /products`, `/suppliers`, `/shops`, `/payment_types`, `/modifiers` |
| | `updated_date` | **Responses:** Categories `GET /category` · Sub Categories `GET /sub_category` · Measurements `GET /measurements` · Order Types `GET /order_types` · Products `GET /products` · Payment Types `GET /payment_types` · Modifiers `GET /modifiers` · Shops `GET /shops` |
| Shop identifier | `shop_id` | **Responses:** `GET /products`, `/payment_types`, `/pos_devices`, `/receipts`, `/void_receipts`, `/credit_note_and_refund`, `/orders`, `/shifts`, `/drawer_transaction`, `/timecards`, `/grn`, `/inventory`, `/purchase_orders`. **Requests:** `POST /products` (in `shops[]`), `POST /online_orders`, `POST /grn`, `POST /inventory`, `POST /credit_note_and_refund`; filter on `GET /receipts`, `/void_receipts`, `/credit_note_and_refund`, `/orders` |
| | `shop_ids` (filter) | **Requests:** `GET /shops`, `/inventory`, `/grn`, `/purchase_orders`, `/drawer_transaction`, `/timecards` |
| | `store_id` | **Request:** Products `POST /products` → `variants[].shops[].store_id` only (`api_spec.yaml` line ≈1945; `create-product.md` line 70 and examples). Every other endpoint says `shop_id` |
| Product identifier | `id` | list responses: `GET /products` (and all other list endpoints use `id` for their own record) |
| | `product_id` | **Responses:** Products `POST /products` · Receipts `GET /receipts`, `/void_receipts`, `/credit_note_and_refund` (line items) · Orders `GET /orders` · GRN `GET /grn` · Inventory `GET /inventory` · Purchase Orders `GET /purchase_orders`. **Requests:** `POST /credit_note_and_refund`, `POST /grn`, `POST /inventory`, `DELETE /product_image` (as `product_code`) |

So the same record can show `created_at` on one endpoint and `created_date` on another (e.g. `POST /measurements` → `updated_at`; `GET /measurements` → `updated_date`; `GET /category` carries `created_at` **and** `updated_date` on the same object), and a product is created with `store_id` but every other endpoint says `shop_id`.

**Why it matters for AI assistants:** an assistant "normalises" the names and invents `created_at` on a list response or `shop_id` on create-product; the developer's code then reads an undefined field. Already noted as problem F in `DOCS_IMPROVEMENT_PLAN.md` (§2) with fix 1.5 (a callout on the overview and each affected page) — that callout is **not** added by this plan.

## 11.5 Guide sample code not written against the documented operation (found 2026-09-16, Step 5)

The six-language code samples in five guides do not use the documented operation for the task they describe. Per the scope rule, the paths the samples currently use are not evaluated or reported; the table lists only the **documented operation each sample should use** and where the sample lives.

| Guide | Section | Task | Documented operation to use (API category) | How the id / filter is sent |
|---|---|---|---|---|
| `docs/guides/product.md` | Get Products (single) | fetch one product | Products — `GET /products` | `product_ids` in the JSON body |
| | Edit Product | change an existing product | Products — `POST /products` (create-or-update by `product_code`) | full product in the JSON body |
| | Delete Product | remove a product | *no documented operation for this task* — remove the section, or point to the Backoffice | — |
| `docs/guides/categories.md` | Create / Get / Edit / Delete Category | manage categories | Categories — `POST /category` (create-or-update), `GET /category`, `DELETE /category` | `category_ids` / `id` in the JSON body |
| `docs/guides/order-integration.md` | Get Orders (single) | fetch one order | Orders — `GET /orders` | `order_numbers` in the JSON body (with `created_at_min`/`max`) |
| `docs/guides/receipt.md` | Get Receipts (single) | fetch one receipt | Receipts — `GET /receipts` | `receipt_numbers` in the JSON body (with `created_at_min`/`max`) |
| | Get Void Receipts | list voided sales | Receipts — `GET /void_receipts` | filters in the JSON body |
| `docs/guides/webhooks-guide.md` | Create / List / Remove Webhook | manage webhooks | Webhooks — `POST /webhooks`, `GET /webhooks`, `DELETE /webhooks` | `id` in the JSON body; note the URL is spelled `webhookss` in the samples (38 occurrences) — a typo to fix |
| | Update a Webhook | change a webhook | *no documented operation for this task* — remove the section; document "delete and create again" | — |

Consequence for Step 5: the "send X to URL" sentence was added only to the four sections whose method+path is a documented operation (`POST /products`, `GET /products`, `GET /orders`, `GET /receipts`), so the documentation does not restate an undocumented path. Rewriting these samples needs no input from the API team — every target operation above is on developer.salesplay.com.
