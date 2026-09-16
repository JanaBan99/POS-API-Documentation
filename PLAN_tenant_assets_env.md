# Plan — Per-brand image folders + `.env` tenant configuration

Status: **EXECUTED 2026-09-15.** Kept as history. For how the system works now, read `TENANT_GUIDE.md`. Deviations from the draft: `dotenv` was not added (Node 22 has a built-in `.env` loader, `process.loadEnvFile`); a `TENANT_HOST` value was added so leftover `salesplaypos.com` mentions (status/help pages) still map to a sensible domain; `preview:sellmo` script added on port 3005.

---

## 1. What we're changing and why

| Today | Problem | After |
|---|---|---|
| SalesPlay images sit loose in `static/img/`; Vendrex ones in `static/img/vendrex/`; Sellmo has none. | SalesPlay is "special" — every component has an `if (tenant !== 'salesplay')` branch, and the root folder mixes brand screenshots with Docusaurus leftovers. | `static/img/salesplay/`, `static/img/vendrex/`, `static/img/selmo/`, `static/img/shared/` — identical file names in each. No brand is special. |
| Every build writes to the same `build/` folder. | Building one brand overwrites the previous one; easy to upload the wrong site. | `build/salesplay/`, `build/vendrex/`, `build/selmo/` — one output folder per brand. |
| Brand facts (name, host, Backoffice URL, developer URL) are typed **twice**: `docusaurus.config.js` and `src/plugins/remark-tenant-replace.js`; Sellmo's are placeholders. | The two copies had already drifted (different trailing slashes). Adding a brand means editing three JS files. | One `.env.<tenant>` file per brand holds every brand fact. Code reads them from one loader. |
| The default tenant is chosen only by `TENANT=` in `package.json` scripts. | Works, but everything else about a brand is buried in code. | `TENANT=` still selects the brand; the `.env` file supplies the values. |

---

## 2. Facts discovered for Sellmo (verified today)

| Item | Value | Source |
|---|---|---|
| Backoffice | `https://sellmo.backofficewebportal.com/` | linked from sellmopos.com; login confirmed with the account you gave |
| Developer portal | `https://developer.backofficewebportal.com/` | Redoc, "Sellmo API reference" |
| API base URL | `https://api.backofficewebportal.com/v1.0` | `servers.url` in that portal's OpenAPI file |
| Marketing site | `https://sellmopos.com/` | (note: `sellmo.com` is an unrelated German company) |
| Brand colour | `#0e4d90` (dark blue) | Backoffice header and buttons; same value on sellmopos.com |
| Logo | 450 × 200 PNG, grey "S" + blue "ellmo" | sellmopos.com |
| Favicon | 32 × 32 PNG | Backoffice `img/partners/favicon_sellmo.png` |
| Backoffice layout | Identical to Vendrex: *Integrations › Developer Tools › API keys / OAuth Apps* | screenshots below |

Important consequence: Sellmo's API host is **not** `api.sellmo.com`. The current find-and-replace rule (`salesplaypos.com → sellmo.com`) would produce a wrong base URL on every Sellmo page. The `.env` design below fixes this by replacing the *whole* API base URL, not the domain fragment.

Also: `https://selmowebpos.backofficewebportal.com/` is the **Web POS** (cashier app), not the Backoffice. Logging in there "claims" a POS terminal; the docs must send readers to `sellmo.backofficewebportal.com`.

### Screenshots captured (staged, not yet in the repo)

| File | Sellmo screen | Notes |
|---|---|---|
| `login.png` | Backoffice sign-in | |
| `access_token.png` | Integrations › Developer Tools › **API keys** | existing key "woocommerce" visible — masked value |
| `access_token_generate.png` | **Create API Key** form | |
| `copy.png` | key opened, copy icon | value already masked by the UI (`…***`) |
| `oauth_token.png` | **OAuth Apps** — *Add App Token* | |
| `outh_token_app.png` | app details (App ID / secret / auth code / permissions) | created a temporary "Docs Example App", captured, **deleted**; secret and code masked in the image |
| `logo.png`, `favicon.png` | | |

Same procedure as Vendrex; nothing else in the account was touched. The login session file was discarded.

---

## 3. Target layout

### 3a. Source images — one folder per brand

```
static/img/
  salesplay/      login.png  register.png  access_token.png  access_token_generate.png
                  copy.png  oauth_token.png  outh_token_app.png  logo.png  favicon.ico
  vendrex/        (same names; no register.png — Vendrex has no public sign-up)
  selmo/          (same names)              ← folder spelled "selmo" as requested (see D6)
  shared/         postman_token.png  postman_oauth.png  postman_first_request.png
                  (brand-neutral Postman screens; used when a brand folder lacks the file)
```

Nothing brand-related stays loose in `static/img/`. Docusaurus template leftovers are deleted: `docusaurus.png`, `docusaurus-social-card.jpg`, `undraw_docusaurus_*.svg`, `logo.svg`, `favicon.ico` (unused default).

Resolution rule (in `TenantImage` and the remark plugin): `/img/<name>` → `/img/<brand folder>/<name>`, else `/img/shared/<name>`. **No tenant is special** — SalesPlay resolves exactly like the others. The brand folder name comes from `.env` (`TENANT_IMG_DIR`), so the folder can be `selmo` while the tenant key stays `sellmo`.

### 3b. Build output — one folder per brand

Today every build writes to `build/`, so building Vendrex overwrites the SalesPlay output. After this change each brand builds into its own folder:

```
build/
  salesplay/    ← npm run build            (upload to developer.salesplay.com)
  vendrex/      ← npm run build:vendrex    (upload to developer.vendrex.com)
  selmo/        ← npm run build:sellmo     (upload to developer.backofficewebportal.com)
```

Done with `docusaurus build --out-dir build/<brand>` in each script; `preview`/`serve` scripts point at the same folder (`docusaurus serve --dir build/<brand>`). Inside each output the image URLs are already brand-scoped (`/img/salesplay/login.png`, `/img/selmo/login.png`), so a page can never show another brand's screenshot even if a file is missing — the fallback is `shared/`, never another brand.

---

## 4. `.env` design

One file per brand, committed to the repo (they contain no secrets — only public URLs and names):

```
# .env.salesplay
TENANT=salesplay
TENANT_NAME=SalesPlay
TENANT_API_BASE_URL=https://api.salesplaypos.com/v1.0
TENANT_BACKOFFICE_URL=https://cloud.salesplaypos.com/
TENANT_DEVELOPER_URL=https://developer.salesplay.com
TENANT_SITE_TITLE=SalesPlay Documentation
TENANT_POSTMAN_URL=https://developer.salesplay.com/download_postman_collection.php
TENANT_FAVICON=favicon.ico
TENANT_IMG_DIR=salesplay
```

```
# .env.vendrex
TENANT=vendrex
TENANT_NAME=Vendrex
TENANT_API_BASE_URL=https://api.vendrex.com/v1.0
TENANT_BACKOFFICE_URL=https://platform.vendrex.com/
TENANT_DEVELOPER_URL=https://developer.vendrex.com
TENANT_SITE_TITLE=Vendrex Documentation
TENANT_POSTMAN_URL=https://developer.vendrex.com/download_postman_collection.php
TENANT_FAVICON=favicon.png
TENANT_IMG_DIR=vendrex
```

```
# .env.sellmo
TENANT=sellmo
TENANT_NAME=Sellmo
TENANT_API_BASE_URL=https://api.backofficewebportal.com/v1.0
TENANT_BACKOFFICE_URL=https://sellmo.backofficewebportal.com/
TENANT_DEVELOPER_URL=https://developer.backofficewebportal.com
TENANT_SITE_TITLE=Sellmo Documentation
TENANT_POSTMAN_URL=https://developer.backofficewebportal.com/download_postman_collection.php
TENANT_FAVICON=favicon.png
TENANT_IMG_DIR=selmo
```

**How it's loaded**

- Add the `dotenv` package (tiny, standard). A new `tenant.js` at the repo root loads `.env.${TENANT}` (defaulting to `salesplay`) and exports one `profile` object. `docusaurus.config.js`, the remark plugin and `convert_spec.py`'s caller all import it — the duplicated `TENANT_PROFILES` tables are deleted.
- `package.json` scripts stay as they are (`TENANT=vendrex …`); only the file the values come from changes. A `.env` (no suffix) is git-ignored for personal overrides — e.g. a docs writer's own `SP_TOKEN` for the endpoint checker.
- The text-replacement rules become **URL-first and exact**: replace `https://api.salesplaypos.com/v1.0` with `TENANT_API_BASE_URL`, `https://cloud.salesplaypos.com/` with `TENANT_BACKOFFICE_URL`, `https://developer.salesplay.com` with `TENANT_DEVELOPER_URL`, *then* `SalesPlay`/`SALESPLAY`/`salesplay` with the name. This is what makes Sellmo's odd API host work.
- Colours stay in `src/css/tenants/<tenant>.css` (CSS can't read `.env`); Sellmo's file gets the `#0e4d90` palette.

**Not put in `.env`:** anything secret. API tokens for the checker script are read from the shell environment, never from a committed file.

---

## 5. Steps to execute

| # | Step | Touches |
|---|---|---|
| 1 | Create `static/img/salesplay/` and move the 9 SalesPlay screenshots + logo + favicon into it; create `static/img/shared/` for the Postman screenshots; create `static/img/selmo/` with the 8 staged Sellmo files; delete the 6 Docusaurus leftovers. | `static/img/**` |
| 1b | `package.json`: every `build:*` script gets `--out-dir build/<brand>`; `preview:*`/`serve` scripts get `--dir build/<brand>`. Add `build/` to `.gitignore` if not already. | `package.json`, `.gitignore` |
| 2 | `TenantImage.js` + remark plugin: resolve `/img/<name>` → `/img/<TENANT_IMG_DIR>/<name>` → `/img/shared/<name>`; drop the SalesPlay special-case. Logo and favicon paths in the config use the same folder. | 3 files |
| 3 | Add `dotenv`; create `tenant.js`, `.env.salesplay`, `.env.vendrex`, `.env.sellmo`; add `.env` to `.gitignore`. | 4 new files, `.gitignore`, `package.json` |
| 4 | `docusaurus.config.js`: import `profile` from `tenant.js`; use it for title, URL, favicon, logo, Backoffice URL; delete `TENANT_PROFILES`. | 1 file |
| 5 | Remark plugin: same import; URL-first replacement rules (§4). Also apply the same rules in the `parseFrontMatter` hook so front matter matches body text. | 2 files |
| 6 | `convert_spec.py`: read `TENANT_NAME` / `TENANT_API_BASE_URL` from the environment (the config passes them) instead of its own hard-coded table. | 1 file |
| 7 | `src/css/tenants/sellmo.css`: real palette from `#0e4d90` (same shades as SalesPlay's — the two brands share the colour). | 1 file |
| 8 | Guides: the Vendrex-specific `<TenantBlock>` steps (API keys / OAuth Apps wording) also apply to Sellmo → change `hide={['salesplay','sellmo']}` to `hide="salesplay"` and the SalesPlay-only block stays `hide={['vendrex','sellmo']}`. Add the Web-POS-vs-Backoffice note for Sellmo. | `getting-started.md`, `oauth.md` |
| 9 | `TENANT_GUIDE.md`: update §3–§5 and §8 ("adding a brand" becomes: copy a `.env` file, add a CSS file, add an image folder). | 1 file |
| 10 | Verify: build all three brands into `build/salesplay`, `build/vendrex`, `build/selmo`; brand-leak sweep on each (no "SalesPlay", no `salesplaypos.com`, no `cloud.salesplaypos.com` in Vendrex/Sellmo output; Sellmo pages show `api.backofficewebportal.com`); favicon and logo per brand; `start:sellmo` on port 3002. | — |

Effort: about half a day. No content changes to any page other than step 8.

---

## 6. Decisions for you

| ID | Question | Default |
|---|---|---|
| D1 | Commit the `.env.<tenant>` files? (They hold only public URLs.) | **Yes** — otherwise a fresh checkout can't build |
| D2 | Keep the two Postman screenshots in `shared/` or duplicate into each brand folder? | **shared/** |
| D3 | Delete the Docusaurus template images? | **Yes** |
| D4 | Sellmo palette: reuse SalesPlay's blue shades (`#0e4d90` is within a hair of `#0b4d92`) or generate a distinct set? | **Reuse** — the brands are visually the same blue |
| D5 | Rotate the Sellmo test account password now that it has been shared in chat? | **Yes** (your action) |
| D6 | Image folder for Sellmo is spelled **`selmo`** (as requested) while the brand name, tenant key and scripts say **`sellmo`** (`TENANT=sellmo`, `start:sellmo`, site title "Sellmo"). Keep both spellings (folder via `TENANT_IMG_DIR=selmo`), or rename the tenant key to `selmo` everywhere? | **Keep both** — folder `selmo`, key `sellmo`; one env value bridges them |
| D7 | Build output per brand: `build/salesplay`, `build/vendrex`, `build/selmo` (matching the image folder names)? | **Yes** |

---

## 7. Not doing

- Moving `docs/` content or changing the sidebar — untouched.
- Per-brand API specs. Sellmo's developer portal serves the same OpenAPI file with a different `servers.url`; if the endpoints ever differ, that's a separate task.
- Reading colours from `.env` (would need a build step to emit CSS; the per-brand CSS file is simpler).
