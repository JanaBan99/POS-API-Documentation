# The Brand System — Complete Instruction Manual

*How one set of documentation files becomes three separate websites (SalesPlay, Vendrex, Sellmo), and how to operate, change and extend it. Written for anyone on the team — you don't need to be a programmer to follow it.*

Last updated: 2026-09-15

---

## Table of contents

1. [The idea in plain words](#1-the-idea-in-plain-words)
2. [The picture](#2-the-picture)
3. [Running and building each brand](#3-running-and-building-each-brand)
4. [Where a brand's facts live: the `.env` files](#4-where-a-brands-facts-live-the-env-files)
5. [How the text changes brand (find-and-replace)](#5-how-the-text-changes-brand-find-and-replace)
6. [How screenshots, logos and favicons change brand](#6-how-screenshots-logos-and-favicons-change-brand)
7. [Paragraphs that only one brand should see](#7-paragraphs-that-only-one-brand-should-see)
8. [Colours](#8-colours)
9. [The API reference file](#9-the-api-reference-file)
10. [How to… (everyday tasks)](#10-how-to-everyday-tasks)
11. [Adding a brand from scratch](#11-adding-a-brand-from-scratch)
12. [Publishing](#12-publishing)
13. [Every file involved, and what it does](#13-every-file-involved-and-what-it-does)
14. [When something goes wrong](#14-when-something-goes-wrong)
15. [The rules to remember](#15-the-rules-to-remember)
16. [Brand facts reference](#16-brand-facts-reference)

---

## 1. The idea in plain words

SalesPlay, Vendrex and Sellmo are three brands selling the same point-of-sale product. They have the same API, the same Backoffice screens (with slightly different menu names), and need the same developer documentation — just with a different name, logo, colours, web addresses and screenshots.

Instead of maintaining three copies of every page, **we keep one copy, written as if it were only for SalesPlay**, and let the build step produce each brand's website from it. Think of the source pages as a form letter with "SalesPlay" as the placeholder: at build time the placeholder is filled in for whichever brand you asked for.

Three things make this work, and this manual explains each:

| Thing | What it does | Where it's controlled |
|---|---|---|
| **Find-and-replace** | Turns "SalesPlay", its web addresses and its API address into the brand's | One `.env.<brand>` file per brand (§4, §5) |
| **Image folders** | Shows the brand's own screenshots, logo and favicon | One folder per brand under `static/img/` (§6) |
| **Brand switches in pages** | Shows or hides a paragraph for a given brand | `<TenantBlock>` tags in the page (§7) |

Plus one small extra: each brand has its own **colour file** (§8).

The word **tenant** appears throughout the code. It simply means "brand".

---

## 2. The picture

```
                       ┌──────────────────────────────────┐
                       │  docs/    (written ONCE,         │
                       │           always says SalesPlay) │
                       └────────────────┬─────────────────┘
                                        │
             ┌──────────────────────────┼──────────────────────────┐
             │                          │                          │
     .env.salesplay              .env.vendrex                .env.sellmo
     static/img/salesplay/       static/img/vendrex/         static/img/selmo/
     css/tenants/salesplay.css   css/tenants/vendrex.css     css/tenants/sellmo.css
             │                          │                          │
     npm run build               npm run build:vendrex       npm run build:sellmo
             │                          │                          │
             ▼                          ▼                          ▼
     build/salesplay/            build/vendrex/               build/selmo/
     "SalesPlay Documentation"   "Vendrex Documentation"      "Sellmo Documentation"
     api.salesplaypos.com        api.vendrex.com              api.backofficewebportal.com
     blue                        green                        blue
```

The brand is chosen **once, when you run a command**. Nothing is decided when a visitor opens the site — each brand's domain simply serves its own pre-built folder.

---

## 3. Running and building each brand

### On your own computer (live preview while editing)

| Brand | Command | Opens at |
|---|---|---|
| SalesPlay | `npm start` | http://localhost:3000 |
| Vendrex | `npm run start:vendrex` | http://localhost:3001 |
| Sellmo | `npm run start:sellmo` | http://localhost:3002 |

All three can run at the same time in separate terminals. Each has its own port and its own cache folder (`.docusaurus`, `.docusaurus-vendrex`, `.docusaurus-sellmo`), so they don't interfere.

Edits to pages, images and CSS appear instantly. **After editing `docusaurus.config.js`, `tenant.js`, a `.env.*` file, `package.json` or anything in `src/plugins/`, stop the server (Ctrl-C) and start it again** — those are read only at start-up.

### Producing the real website (the files you upload)

| Brand | Command | Output folder | Goes to |
|---|---|---|---|
| SalesPlay | `npm run build` | `build/salesplay/` | developer.salesplay.com |
| Vendrex | `npm run build:vendrex` | `build/vendrex/` | developer.vendrex.com |
| Sellmo | `npm run build:sellmo` | `build/selmo/` | developer.backofficewebportal.com |

Each brand has **its own output folder**, so building one brand never overwrites another and you can't upload the wrong site by accident. The `build/` folder is not committed to git.

### Testing the built site (including search)

The search box only works on a *built* site — in `npm start` it shows *"The search index is only available when you run docusaurus build!"*. That's normal. To try search locally:

| Brand | Command | Opens at |
|---|---|---|
| SalesPlay | `npm run preview` | http://localhost:3003 |
| Vendrex | `npm run preview:vendrex` | http://localhost:3004 |
| Sellmo | `npm run preview:sellmo` | http://localhost:3005 |

Each of these builds the site and then serves the result from its `build/<brand>/` folder.

### What "the brand is chosen" means technically

Every command above sets one variable, `TENANT`, before starting (`TENANT=vendrex`, `TENANT=sellmo`; no value means `salesplay`). Everything else — names, addresses, image folder — is looked up from that one word. You never need to set it by hand; the commands do it.

---

## 4. Where a brand's facts live: the `.env` files

Every fact about a brand is in **one small text file at the root of the project**, named `.env.<brand>`:

```
.env.salesplay
.env.vendrex
.env.sellmo
```

Open one and you'll see lines of `NAME=value`. This is the entire contents of `.env.sellmo`:

```
TENANT=sellmo
TENANT_NAME=Sellmo
TENANT_HOST=sellmopos.com
TENANT_API_BASE_URL=https://api.backofficewebportal.com/v1.0
TENANT_BACKOFFICE_URL=https://sellmo.backofficewebportal.com/
TENANT_DEVELOPER_URL=https://developer.backofficewebportal.com
TENANT_SITE_TITLE=Sellmo Documentation
TENANT_POSTMAN_URL=https://developer.backofficewebportal.com/download_postman_collection.php
TENANT_FAVICON=favicon.png
TENANT_IMG_DIR=selmo
```

### What each line controls

| Line | What it is | Where you'll see it on the site |
|---|---|---|
| `TENANT` | The brand's short key. Must match the file name suffix and the `TENANT=` in `package.json`. | Not visible; used internally and in `<TenantBlock hide="…">` |
| `TENANT_NAME` | The brand name as written in text | Every place the source says "SalesPlay" |
| `TENANT_HOST` | The brand's main web domain | Any leftover `salesplaypos.com` mention that isn't a full URL handled below (e.g. `status.salesplaypos.com` → `status.vendrex.com`) |
| `TENANT_API_BASE_URL` | The address developers send API requests to | Every code sample, the Postman `baseUrl` table, the API reference |
| `TENANT_BACKOFFICE_URL` | Where merchants log in | "Log in to the Backoffice at …" links |
| `TENANT_DEVELOPER_URL` | The address of the documentation site itself | Page metadata, links to the docs site |
| `TENANT_SITE_TITLE` | Browser-tab title | Tab title, search result headings |
| `TENANT_POSTMAN_URL` | Download link for the Postman collection | Getting Started page |
| `TENANT_FAVICON` | File name of the favicon inside the brand's image folder | Browser tab icon |
| `TENANT_IMG_DIR` | Name of the brand's folder under `static/img/` | All screenshots, logo, favicon |

### Rules for these files

- **They are committed to git.** They contain only public web addresses and names — nothing secret. A fresh checkout must be able to build.
- **Never put a password, API token or key in them.** If a script needs a secret (e.g. the endpoint-checker's `SP_TOKEN`), it reads it from your shell environment or from a personal `.env` file (no suffix), which is git-ignored and never committed.
- **One fact, one place.** If a brand's Backoffice moves to a new address, change one line in one file. No code changes.
- **Every line is required.** If one is missing, the build stops immediately with `TENANT_BACKOFFICE_URL is missing — check .env.sellmo` rather than producing a site with a blank in it.

### How the file is read (for the curious)

`tenant.js` at the project root reads `.env.<TENANT>` when the site starts, using Node's built-in loader (no extra packages). It exposes one `profile` object that `docusaurus.config.js`, the text-replacement plugin and the Python spec converter all use. If you also have a personal `.env`, it is read first and its values win; values already set in your shell win over both.

---

## 5. How the text changes brand (find-and-replace)

While each page is compiled, its text passes through a fixed list of substitutions, **in this order**. Order matters: whole web addresses are replaced first, so that a brand whose API isn't simply at `api.<brand>.com` (Sellmo!) still gets the right address; the bare words are replaced last.

| # | Wherever the source says… | It becomes… | From |
|---|---|---|---|
| 1 | `https://api.salesplaypos.com/v1.0` | the brand's API base URL | `TENANT_API_BASE_URL` |
| 2 | `https://api.salesplaypos.com` (anything else on the API host, e.g. a `v2.0` example) | the brand's API host | derived from `TENANT_API_BASE_URL` |
| 3 | `https://cloud.salesplaypos.com` or `https://cloud.salesplaypos.com/` | the brand's Backoffice URL | `TENANT_BACKOFFICE_URL` |
| 4 | `https://developer.salesplay.com/download_postman_collection.php` | the brand's Postman link | `TENANT_POSTMAN_URL` |
| 5 | `https://developer.salesplay.com` | the brand's docs site | `TENANT_DEVELOPER_URL` |
| 6 | `SalesPlay` | the brand name | `TENANT_NAME` |
| 7 | `SALESPLAY` | the brand name in capitals | `TENANT_NAME` |
| 8 | `salesplaypos.com` | the brand's main domain | `TENANT_HOST` |
| 9 | `salesplay` | the brand name in lowercase | `TENANT_NAME` |

### Example — one sentence, three brands

Source:
> Log in to the SalesPlay Backoffice at https://cloud.salesplaypos.com/ and send requests to `https://api.salesplaypos.com/v1.0/shops`.

| Brand | Output |
|---|---|
| SalesPlay | Log in to the SalesPlay Backoffice at https://cloud.salesplaypos.com/ and send requests to `https://api.salesplaypos.com/v1.0/shops`. |
| Vendrex | Log in to the Vendrex Backoffice at https://platform.vendrex.com/ and send requests to `https://api.vendrex.com/v1.0/shops`. |
| Sellmo | Log in to the Sellmo Backoffice at https://sellmo.backofficewebportal.com/ and send requests to `https://api.backofficewebportal.com/v1.0/shops`. |

Notice Sellmo: without rule 1 running first, the bare-word rules would have produced the non-existent `api.sellmopos.com`. That's why whole URLs come first.

### What the replacement covers

Normal text, headings, tables, links, code samples, inline code, raw HTML, page titles and descriptions (front matter), and the text inside JSX attributes such as an image's `alt="SalesPlay Backoffice"`. It also runs on `api_spec.yaml` when it's converted for the API reference (§9).

It deliberately does **not** touch:
- the `hide="…"` attribute of `<TenantBlock>` — that's a brand key, not text;
- image file paths — those are handled by the image system (§6).

### The one rule this creates

**Always write "SalesPlay" (and SalesPlay's URLs) in source files. Never write "Vendrex" or "Sellmo".** The replacement only goes in one direction: if you type "Vendrex" into a page, the SalesPlay and Sellmo sites will show "Vendrex" too, because nothing replaces it back.

The only exception is text inside a `<TenantBlock>` that is hidden for every other brand (§7) — there, a brand-specific address is fine because only that brand ever sees it.

The replacement runs for **every** brand, SalesPlay included. On SalesPlay every rule replaces a value with itself, so nothing changes — but it means no brand is a special case in the code.

---

## 6. How screenshots, logos and favicons change brand

### The folders

```
static/img/
├─ salesplay/   login.png  register.png  access_token.png  access_token_generate.png
│               copy.png  oauth_token.png  outh_token_app.png  logo.png  favicon.ico
├─ vendrex/     (same file names — no register.png: Vendrex has no public sign-up)  favicon.png
├─ selmo/       (same file names — no register.png)  favicon.png
└─ shared/      postman_token.png  postman_oauth.png
                (screens of Postman's own UI — identical for every brand)
```

**Every brand folder uses the exact same file names.** That's the whole trick: a page asks for "login.png" and the build picks it from the right folder.

Note the Sellmo folder is spelled **`selmo`** while the brand key is **`sellmo`**. The `TENANT_IMG_DIR=selmo` line in `.env.sellmo` connects the two. (Keep it that way, or rename the folder and that one line together.)

### How a page refers to an image

In a page, screenshots are placed like this — **never with a brand folder in the path**:

```jsx
<TenantImage src="/img/login.png" alt="SalesPlay Backoffice Login" />
```

At build time, `/img/login.png` becomes:

1. `/img/<TENANT_IMG_DIR>/login.png` — **if that file exists** in the brand's folder;
2. otherwise `/img/shared/login.png`.

So on the Sellmo build the login screenshot is `/img/selmo/login.png`, and the Postman screenshot (which no brand folder has) is `/img/shared/postman_token.png`.

Two guarantees follow from this:
- **A brand can never show another brand's screenshot.** The fallback is the neutral `shared/` folder, never a different brand.
- The decision is made at build time by checking the disk, so there are no broken-image flickers or 404 requests in the browser.

Plain Markdown images (`![alt](/img/x.png)`) are resolved the same way. Paths that already name a folder (`/img/vendrex/x.png`) are left exactly as written — but there's no reason to write those.

### Logo and favicon

The navbar logo is always `static/img/<TENANT_IMG_DIR>/logo.png`. The favicon is `static/img/<TENANT_IMG_DIR>/<TENANT_FAVICON>` — the file name is in the `.env` because SalesPlay's is an `.ico` and the others are `.png`.

### Current inventory

| File | SalesPlay | Vendrex | Sellmo | Used on |
|---|---|---|---|---|
| `logo.png` | ✅ | ✅ | ✅ | navbar |
| `favicon.ico` / `favicon.png` | ✅ `.ico` | ✅ `.png` | ✅ `.png` | browser tab |
| `login.png` | ✅ | ✅ | ✅ | Getting Started |
| `register.png` | ✅ | — step hidden | — step hidden | Getting Started |
| `access_token.png` | ✅ | ✅ (API keys page) | ✅ (API keys page) | Getting Started |
| `access_token_generate.png` | ✅ | ✅ (Create API Key form) | ✅ | Getting Started |
| `copy.png` | ✅ | ✅ | ✅ | Getting Started |
| `oauth_token.png` | ✅ | ✅ (OAuth Apps) | ✅ | OAuth 2.0 |
| `outh_token_app.png` | ✅ | ✅ (secret masked) | ✅ (secret masked) | OAuth 2.0 |
| `postman_token.png`, `postman_oauth.png` | shared | shared | shared | Getting Started, OAuth 2.0 |

The Vendrex and Sellmo screenshots were captured from the real Backoffice of a test account; any key values in them are masked.

---

## 7. Paragraphs that only one brand should see

Sometimes the words genuinely differ. SalesPlay's Backoffice calls it *Integrations › Access Token*; Vendrex and Sellmo call it *Integrations › Developer Tools › API keys*. For these cases, wrap the text in `<TenantBlock>`:

```jsx
<TenantBlock hide={['vendrex', 'sellmo']}>

3. Once logged in, navigate to the **Access Token** page under **Integrations**

</TenantBlock>
<TenantBlock hide="salesplay">

3. Once logged in, open **Integrations** (the puzzle icon), then **Developer Tools → API keys**

</TenantBlock>
```

- `hide` names the brand(s) that should **not** see the block. One brand: `hide="salesplay"`. Several: `hide={['vendrex', 'sellmo']}`.
- **Keep a blank line after the opening tag and before the closing tag**, otherwise the Markdown inside is not rendered.
- A hidden block leaves nothing behind in that brand's site — not even hidden HTML — so a brand-leak check on the output stays clean.

Where they're used today: `docs/guides/getting-started.md` (registration step, the three access-token steps, and a Sellmo-only warning that the Web POS at `selmowebpos.backofficewebportal.com` is the cashier app, not the Backoffice) and `docs/guides/oauth.md` (the create-app step).

The page needs this line near the top to use the tag:
```jsx
import TenantBlock from '@site/src/components/TenantBlock';
```

---

## 8. Colours

Colours are the one brand fact **not** in the `.env` file, because CSS can't read it. Each brand has a file:

```
src/css/tenants/salesplay.css   blue  #0b4d92
src/css/tenants/vendrex.css     green #068a28 (links) / #09d83f (bright), purple #39005b footer
src/css/tenants/sellmo.css      blue  #0e4d90 (same shade set as SalesPlay — the two blues are near-identical)
```

Each file sets the seven `--ifm-color-primary*` variables (light mode) and again under `[data-theme='dark']` (dark mode). They drive links, the active sidebar item, tab underlines, buttons and the coloured strings in code samples.

To change a brand's colour: generate the seven shades from one hex at https://docusaurus.io/docs/styling-layout#styling-your-site-with-infima, paste them into the file, and pick a lighter shade of the same colour for the dark block so text stays readable on dark backgrounds. Vendrex's brand green is too light for link text on white, which is why its links use a darker green.

Everything that is *not* brand colour (badges, endpoint bar, layout) lives in `src/css/custom.css`, shared by all brands.

---

## 9. The API reference file

`api_spec.yaml` (the OpenAPI description of the API) is also written as SalesPlay. On every start and build, `convert_spec.py` applies the same nine rules from §5 to it and writes `static/api_spec.json` for the current brand. That's how the Sellmo site's spec says `servers.url: https://api.backofficewebportal.com/v1.0/`.

The script takes the brand facts from the environment (the site loads them before calling it). If you run it by hand — `python convert_spec.py` or `TENANT=sellmo python convert_spec.py` — it reads the `.env.<brand>` file itself, so it works standalone too.

The 53 endpoint pages under `docs/API-reference/` are generated from the same YAML by `python gen_api_docs.py`; they are written as SalesPlay and go through the normal page replacement. Never edit them by hand.

---

## 10. How to… (everyday tasks)

**…change a brand's web address, name or title?**
Edit the line in `.env.<brand>`. Restart the dev server or rebuild. Done — no code changes.

**…add or replace a screenshot for one brand?**
Save it as `static/img/<brand folder>/<same file name>.png` (about 1900 px wide, light theme, no personal data, any key values masked). It appears on the next build. No page edits.

**…add a brand-new screenshot to a page?**
1. Save it in `static/img/salesplay/<name>.png`, and in each other brand's folder under the same name (or in `static/img/shared/` if it looks the same for every brand).
2. In the page: `<TenantImage src="/img/<name>.png" alt="…" />` (with `import TenantImage from '@site/src/components/TenantImage';` at the top).
A brand that lacks the file falls back to `shared/`; if `shared/` lacks it too, that brand shows a broken image — so give every brand a copy.

**…write a step that differs between brands?**
Use `<TenantBlock>` pairs as in §7.

**…change a brand's colours?**
Edit `src/css/tenants/<brand>.css` (§8).

**…update the Postman collection link?**
`TENANT_POSTMAN_URL` in the `.env` file.

**…check that a build has no brand leaks?**
After `npm run build:sellmo`, search the output for the other brands: in PowerShell,
`Get-ChildItem build\selmo -Recurse -Include *.html,*.json | Select-String -Pattern 'SalesPlay|salesplaypos|Vendrex' -List`
should print nothing. (The same check for `build\vendrex` with `SalesPlay|salesplaypos|Sellmo`.)

**…use a secret in a script without committing it?**
Put it in your shell (`$env:SP_TOKEN = '…'`) or in a personal `.env` file at the project root. `.env` is git-ignored; `.env.<brand>` files are not, so never put secrets in those.

---

## 11. Adding a brand from scratch

Say the new brand is "Acme", key `acme`.

1. **Facts file** — copy `.env.vendrex` to `.env.acme` and change every value. Set `TENANT=acme` and `TENANT_IMG_DIR=acme`.
2. **Colours** — copy `src/css/tenants/vendrex.css` to `src/css/tenants/acme.css` and set the shades (§8).
3. **Images** — create `static/img/acme/` with `logo.png`, the favicon (name it in `TENANT_FAVICON`) and the screenshots, using the same file names as the other folders (§6). Any you don't have yet will fall back to `shared/` — which only has the Postman screens — so capture the Backoffice ones before going live.
4. **Commands** — in `package.json`, copy the three `*:sellmo` scripts (`start:sellmo`, `build:sellmo`, `preview:sellmo`) to `*:acme`, changing `TENANT=acme`, the generated-files dir names (`.docusaurus-acme`, `.docusaurus-build-acme`), the output folder (`build/acme`) and the ports (next free ones).
5. **Brand switches** — if Acme's Backoffice wording matches Vendrex/Sellmo, nothing to do. If it matches SalesPlay, add `acme` to the `hide` lists that currently say `hide="salesplay"`, and remove it from none. If it's different again, add a third block.
6. `npm run start:acme`, look through Getting Started and OAuth 2.0, then `npm run build:acme` and run the leak check from §10.

No JavaScript needs to change.

---

## 12. Publishing

1. `npm run build` / `build:vendrex` / `build:sellmo` (or all three).
2. Upload the **contents** of `build/<brand>/` to that brand's web host:

| Brand | Folder | Host |
|---|---|---|
| SalesPlay | `build/salesplay/` | developer.salesplay.com |
| Vendrex | `build/vendrex/` | developer.vendrex.com |
| Sellmo | `build/selmo/` | developer.backofficewebportal.com |

The site is plain static files (HTML, CSS, JS, images) — any web host or CDN can serve it. Image URLs inside each build are already brand-scoped (`/img/selmo/login.png`), so even a mixed-up upload can't show another brand's screenshots.

---

## 13. Every file involved, and what it does

```
.env.salesplay, .env.vendrex, .env.sellmo   ONE file per brand: name, URLs, title, favicon name, image folder (§4)
.env                                        (optional, git-ignored) your personal overrides / secrets
tenant.js                                   reads .env.<TENANT>; exports the brand profile, the text rules (§5)
                                            and the image resolver (§6). The only place brand logic lives.
docusaurus.config.js                        site settings; takes title, URL, favicon, logo from tenant.js
src/plugins/remark-tenant-replace.js        applies the text rules and image resolution to every page as it compiles
src/plugins/gio-files.js                    after each build, writes robots.txt, llms.txt, llms-full.txt and injects JSON-LD structured data into build/<brand>/ (for search engines and AI assistants)
src/components/TenantImage.js               the <TenantImage> tag (a plain image; the path was resolved at build time)
src/components/TenantBlock.js               the <TenantBlock hide="…"> tag
src/css/custom.css                          shared styling
src/css/tenants/<brand>.css                 that brand's colours (§8)
static/img/<brand folder>/                  that brand's screenshots, logo, favicon (§6)
static/img/shared/                          brand-neutral screenshots (Postman)
convert_spec.py                             api_spec.yaml → static/api_spec.json for the brand (§9)
package.json                                the start:* / build:* / preview:* commands (§3)
build/<brand>/                              build output, one folder per brand, not committed (§12)
```

---

## 14. When something goes wrong

| Symptom | Cause | Fix |
|---|---|---|
| Build stops with `TENANT_… is missing — check .env.<brand>` | A line was deleted from or mistyped in the `.env` file | Compare against another brand's file; every line in §4 is required |
| A page shows "SalesPlay" on the Vendrex/Sellmo site | Someone wrote a form the rules don't cover — check §5 — or the text is inside a `hide` attribute | Rewrite the source using the exact SalesPlay wording/URLs in §5 |
| A page shows "Vendrex" on the SalesPlay site | Someone typed "Vendrex" into a source page | Change it to "SalesPlay" (§5 rule) |
| A screenshot is missing (broken image) on one brand | The brand folder and `shared/` both lack that file name | Add the file under the same name in the brand folder |
| The wrong brand's screenshot shows | Someone wrote a brand folder in the path (`src="/img/vendrex/…"`) | Write `src="/img/<name>"` and let the build choose |
| Dev server crashes with an rspack **"Panic"**, or shows a stale brand | Corrupted or stale compile cache | Stop it, run `npx docusaurus clear`, delete the brand's `.docusaurus-*` folder if it still fails, start again |
| Changing a `.env` value has no effect | The dev server only reads it at start-up | Restart the dev server |
| `build/` looks like the wrong brand | You're looking in `build/` itself, not `build/<brand>/` | Each brand has its own subfolder (§3) |
| Sellmo readers log in but see a cash register, not settings | They went to the Web POS (`selmowebpos.…`) | The Backoffice is `sellmo.backofficewebportal.com`; the Getting Started page has a Sellmo-only note about this |

---

## 15. The rules to remember

1. **Write everything as SalesPlay.** Names, Backoffice URL, API URL — use exactly the forms listed in §5 so the rules catch them.
2. **Never type another brand's name or address in a page**, except inside a `<TenantBlock>` that hides it from all other brands.
3. **Same file names in every image folder.** Reference images as `/img/<name>` — never with a folder.
4. **Brand facts go in `.env.<brand>`**, colours go in `src/css/tenants/<brand>.css`. Nothing brand-specific goes in JavaScript.
5. **No secrets in committed files.** `.env.<brand>` is public; your personal `.env` is not.
6. **Restart the dev server** after touching config, `tenant.js`, `.env.*`, `package.json` or plugins.
7. **Each brand builds to its own folder** — upload `build/<brand>/`, not `build/`.

---

## 16. Brand facts reference

| | SalesPlay | Vendrex | Sellmo |
|---|---|---|---|
| Key (`TENANT`) | `salesplay` | `vendrex` | `sellmo` |
| Image folder | `static/img/salesplay/` | `static/img/vendrex/` | `static/img/selmo/` |
| Build output | `build/salesplay/` | `build/vendrex/` | `build/selmo/` |
| Docs site | https://developer.salesplay.com | https://developer.vendrex.com | https://developer.backofficewebportal.com |
| API base URL | `https://api.salesplaypos.com/v1.0` | `https://api.vendrex.com/v1.0` | `https://api.backofficewebportal.com/v1.0` |
| Backoffice | https://cloud.salesplaypos.com/ | https://platform.vendrex.com/ | https://sellmo.backofficewebportal.com/ |
| Main domain | salesplaypos.com | vendrex.com | sellmopos.com (`sellmo.com` is an unrelated company) |
| Backoffice menu for API keys | Integrations › Access Token | Integrations › Developer Tools › API keys | same as Vendrex |
| Backoffice menu for OAuth | Integrations › OAuth 2.0 | Integrations › Developer Tools › OAuth Apps | same as Vendrex |
| Public sign-up step shown | yes | no | no (no screenshot yet — add `register.png` to `static/img/selmo/` and remove `sellmo` from that block's `hide` list to enable) |
| Colour | blue `#0b4d92` | green `#068a28` / `#09d83f`, purple footer | blue `#0e4d90` |
| Favicon | `favicon.ico` | `favicon.png` | `favicon.png` |
| Dev server | `npm start` → :3000 | `npm run start:vendrex` → :3001 | `npm run start:sellmo` → :3002 |
| Preview (with search) | `npm run preview` → :3003 | `npm run preview:vendrex` → :3004 | `npm run preview:sellmo` → :3005 |
