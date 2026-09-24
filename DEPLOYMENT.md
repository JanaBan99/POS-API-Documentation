# Deployment guide — API documentation sites (zip handover)

This zip produces **three independent websites** from one source tree. Each site has its own configuration file, its own build command, its own output folder, its own Nginx server block and its own domain. Nothing is shared at runtime, so any one site can be built, published, rolled back or taken down without touching the other two.

Everything below runs on a single Ubuntu server.

---

## Table of contents

1. [What you are deploying](#1-what-you-are-deploying)
2. [The three sites at a glance](#2-the-three-sites-at-a-glance)
3. [What is in the zip](#3-what-is-in-the-zip)
4. [Server requirements](#4-server-requirements)
5. [One-time server setup](#5-one-time-server-setup)
6. [Unpack the release](#6-unpack-the-release)
7. [Install dependencies](#7-install-dependencies)
8. [Brand configuration files (`.env`)](#8-brand-configuration-files-env)
9. [Build a site](#9-build-a-site)
10. [Check before publishing](#10-check-before-publishing)
11. [Publish to the served folders](#11-publish-to-the-served-folders)
12. [Nginx: one server block per site](#12-nginx-one-server-block-per-site)
13. [DNS and HTTPS](#13-dns-and-https)
14. [Confirm the documentation is accessible](#14-confirm-the-documentation-is-accessible)
15. [Updating: deploying a new zip](#15-updating-deploying-a-new-zip)
16. [Deploy script](#16-deploy-script)
17. [Rollback](#17-rollback)
18. [Troubleshooting](#18-troubleshooting)
19. [Security notes](#19-security-notes)
20. [Checklists](#20-checklists)

---

## 1. What you are deploying

Static websites. After a build there is **no server-side code, no database, and no Node process to keep running** — only HTML, CSS, JS and images that any web server can serve. Nginx serves files from a directory; that is the entire runtime.

The build is a Node program. It reads one brand's configuration file, rewrites the documentation for that brand (name, URLs, logo, favicon, screenshots, colours), builds a client-side search index, and writes a finished site into its own folder.

Three things to know up front:

- **The build never contacts the product API** and needs no tokens or credentials. It needs outbound internet once, to the npm registry, to install dependencies.
- **A failed build publishes nothing.** The live sites keep serving the previous release.
- **Never run `npm start` on this server.** That is the development server: slow, unminified, no search index, placeholder dates. Production is always `npm run build…` followed by Nginx serving the output.

---

## 2. The three sites at a glance

This table is the contract. Every later section refers back to it.

| | SalesPlay | Vendrex | Sellmo |
|---|---|---|---|
| Brand key | `salesplay` | `vendrex` | `sellmo` |
| Config file | `.env.salesplay` | `.env.vendrex` | `.env.sellmo` |
| Build command | `npm run build` | `npm run build:vendrex` | `npm run build:sellmo` |
| Build output | `build/salesplay/` | `build/vendrex/` | `build/selmo/` |
| Check command | `npm run check:salesplay` | `npm run check:vendrex` | `npm run check:sellmo` |
| Served folder | `/var/www/sites/salesplay` | `/var/www/sites/vendrex` | `/var/www/sites/selmo` |
| Public domain | `developer.salesplay.com` | `developer.vendrex.com` | `developer.backofficewebportal.com` |

Two spellings to be careful with, both intentional:

- Sellmo's brand key is **`sellmo`** but its output folder is **`selmo`** (one `l`). That matches the image folder name inside the project. Use the table, not intuition.
- SalesPlay has no suffix on its commands — `npm run build` *is* the SalesPlay build, because SalesPlay is the default brand when none is named.

---

## 3. What is in the zip

The zip is named `pos-api-docs-<date>.zip` and unpacks to a single folder, `pos-api-docs/`. It is about **6–7 MB** and holds roughly 630 files.

### Included

| Item | What it is |
|---|---|
| `docs/` | the documentation pages |
| `api_spec.yaml` | the OpenAPI description the API reference is generated from |
| `src/`, `sidebars.js`, `docusaurus.config.js`, `tenant.js` | the site code, navigation and brand logic |
| `static/img/salesplay\|vendrex\|selmo\|shared/` | each brand's screenshots, logo and favicon |
| `.env.salesplay`, `.env.vendrex`, `.env.sellmo` | the three brand configuration files ([§8](#8-brand-configuration-files-env)) |
| `package.json`, `package-lock.json` | the dependency list and the exact locked versions |
| `gen_api_docs.mjs`, `tools/gio_check.mjs` | the page generator and the post-build checker |
| `.git/` | **required — see the warning below** |
| `DEPLOYMENT.md` | this guide |

### Deliberately not included

| Item | Why | How you get it |
|---|---|---|
| `node_modules/` | ~400 MB of dependencies | `npm ci` in [§7](#7-install-dependencies) |
| `build/` | build output | produced by [§9](#9-build-a-site) |
| `.docusaurus*/` | build caches | recreated automatically |
| `static/api_spec.json` | regenerated per brand on every build | produced by the build |

### Do not delete the `.git` folder

It looks like leftover developer clutter. It is not: **the build fails without it.**

Every page shows a "Last updated" date, and those dates come from the project's history. With no `.git` folder the build stops with:

```
Error: This Docusaurus site is outside any Git worktree.
```

You never run a single git command, and you need no access to GitHub and no credentials. The folder simply has to be present. It is about 5 MB of the zip.

If your transfer process genuinely cannot carry a `.git` folder, see [§18](#18-troubleshooting) for the two fallbacks and what each one costs.

### What you must be given separately

Nothing for the build itself — the zip is complete, `.env` files included. You do need, from whoever controls the domains:

- DNS records for the three `developer.*` domains, pointed at this server ([§13](#13-dns-and-https)).

---

## 4. Server requirements

| Item | Minimum | Notes |
|---|---|---|
| Ubuntu | 22.04 LTS or 24.04 LTS | commands below are tested on both |
| RAM | 2 GB (4 GB recommended) | one brand's build peaks around 1.5 GB; see [§18](#18-troubleshooting) if it is killed |
| Disk | 3 GB free | `node_modules` ≈ 400 MB, three builds ≈ 150 MB, three published sites ≈ 150 MB |
| CPU | 1 core | a build takes 1–3 minutes per brand |
| Network | outbound HTTPS | to the npm registry, for `npm ci`. **Not** to the POS API |
| DNS | A/AAAA records | each public domain must point here before [§13](#13-dns-and-https) |
| Access | a user with `sudo` | do not build or deploy as `root` |

---

## 5. One-time server setup

Run this section once, as your normal user.

### 5.1 System packages

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl unzip rsync git build-essential nginx
```

- `nginx` serves the built files.
- `git` is needed **only** because the build reads the project history for page dates. You will never run a git command yourself.
- No Python is required. The toolchain is entirely Node.

### 5.2 Node.js 22

Node **22 LTS** is required. The brand loader uses `process.loadEnvFile`, which does not exist before Node 20.12, and Ubuntu's default `nodejs` package is too old:

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
node --version    # must print v22.x
npm --version
```

### 5.3 Directories

```bash
sudo mkdir -p /var/www/releases /var/www/sites
sudo chown -R "$USER":"$USER" /var/www/releases
sudo mkdir -p /var/www/sites/salesplay /var/www/sites/vendrex /var/www/sites/selmo
sudo chown -R "$USER":www-data /var/www/sites
```

Two separate places, and the separation is what makes updates safe:

- `/var/www/releases/<release>/` — one unpacked zip per release, where builds happen. Nginx never reads this.
- `/var/www/sites/<brand>/` — the folder Nginx serves. Files land here only after a build has passed its checks, so a broken build cannot take a live site down.

---

## 6. Unpack the release

Copy the zip to the server, then verify it arrived intact before trusting it:

```bash
cd /var/www/releases
sha256sum pos-api-docs-2026-09-23.zip      # compare with the checksum you were sent
unzip -q pos-api-docs-2026-09-23.zip
```

That creates `/var/www/releases/pos-api-docs/`. Rename it to carry the release date, so several releases can sit side by side and a rollback is just a matter of naming the previous one:

```bash
mv pos-api-docs pos-api-docs-2026-09-23
cd pos-api-docs-2026-09-23
```

Confirm the two things that most often go missing in transfer — the hidden `.git` folder and the three `.env` files:

```bash
ls -a | grep -E '^\.git$|^\.env\.'
# expect: .env.salesplay  .env.sellmo  .env.vendrex  .git

git rev-parse --is-inside-work-tree     # must print: true
```

If `.git` is missing, stop and read [§18](#18-troubleshooting) — the build will fail.

---

## 7. Install dependencies

```bash
npm ci
```

`npm ci` installs the exact versions recorded in `package-lock.json` and fails loudly if the lockfile and `package.json` disagree. Never use `npm install` here — it can silently pick up newer versions.

This needs outbound access to the npm registry and takes 1–3 minutes.

**If the server has no internet access,** copy `node_modules/` in from a machine that does. It must come from a machine that ran `npm ci` against *this* release's `package-lock.json`. Alternatively, ask for a zip with `node_modules/` already inside — about 400 MB instead of 6 MB.

Each release folder needs its own `node_modules/`. When `package-lock.json` has not changed between releases you may copy the previous one to save the download:

```bash
cp -a ../pos-api-docs-2026-09-16/node_modules ./node_modules
```

---

## 8. Brand configuration files (`.env`)

**These files are what make the three sites different from each other.** They ship inside the zip, so normally you do not create them — you only confirm they are present and correct.

Each brand's facts live in a plain text file named `.env.<brand>` at the root of the release folder:

```bash
ls -l .env.salesplay .env.vendrex .env.sellmo
chmod 600 .env.*
```

For reference, these are the expected contents. If a file is missing, create it with exactly these values.

`.env.salesplay`
```
TENANT=salesplay
TENANT_NAME=SalesPlay
TENANT_HOST=salesplaypos.com
TENANT_API_BASE_URL=https://api.salesplaypos.com/v1.0
TENANT_BACKOFFICE_URL=https://cloud.salesplaypos.com/
TENANT_DEVELOPER_URL=https://developer.salesplay.com
TENANT_SITE_TITLE=SalesPlay Documentation
TENANT_POSTMAN_URL=https://developer.salesplay.com/download_postman_collection.php
TENANT_FAVICON=favicon.ico
TENANT_IMG_DIR=salesplay
```

`.env.vendrex`
```
TENANT=vendrex
TENANT_NAME=Vendrex
TENANT_HOST=vendrex.com
TENANT_API_BASE_URL=https://api.vendrex.com/v1.0
TENANT_BACKOFFICE_URL=https://platform.vendrex.com/
TENANT_DEVELOPER_URL=https://developer.vendrex.com
TENANT_SITE_TITLE=Vendrex Documentation
TENANT_POSTMAN_URL=https://developer.vendrex.com/download_postman_collection.php
TENANT_FAVICON=favicon.png
TENANT_IMG_DIR=vendrex
```

`.env.sellmo`
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

A commented template, `.env.example`, is also in the zip.

### What each line controls

| Key | Used for |
|---|---|
| `TENANT` | the brand key; must match the file suffix |
| `TENANT_NAME` | the brand name everywhere in the text |
| `TENANT_HOST` | the brand's main web domain, substituted into page text |
| `TENANT_API_BASE_URL` | the API base URL in every code sample and in `api_spec.json` |
| `TENANT_BACKOFFICE_URL` | link to the brand's back office |
| `TENANT_DEVELOPER_URL` | the site's own canonical URL (used in `sitemap.xml` and structured data) |
| `TENANT_SITE_TITLE` | browser tab title |
| `TENANT_POSTMAN_URL` | download link for that brand's Postman collection |
| `TENANT_FAVICON` | favicon file name inside `static/img/<TENANT_IMG_DIR>/` |
| `TENANT_IMG_DIR` | which screenshot/logo folder under `static/img/` this brand uses |

### Rules

- **No secrets.** These hold public names and URLs only. Never add a password, token or key.
- **A missing line stops the build** with `TENANT_… is missing — check .env.<brand>`. It fails fast rather than publishing a half-branded site.
- **Shell variables win** over the file. Useful for a one-off test; not how you deploy.
- **Back them up** outside the release folder. They are the only files here that are not in the source repository.

---

## 9. Build a site

From the release folder, build whichever site you need:

```bash
npm run build            # SalesPlay → build/salesplay/
npm run build:vendrex    # Vendrex   → build/vendrex/
npm run build:sellmo     # Sellmo    → build/selmo/
```

Each command loads that brand's `.env` file, converts the OpenAPI spec into that brand's `api_spec.json`, compiles every page with the brand's text and images, builds the search index, and writes the result into the brand's own output folder.

A successful build ends with:

```
[SUCCESS] Generated static files in "build/<brand>".
```

Two messages are normal and can be ignored: the `onBrokenMarkdownLinks` deprecation notice, and a Docusaurus "update available" banner.

**Build sites one at a time, not in parallel.** Each brand has its own output folder and its own cache, so sequential builds never interfere. But all three write one shared intermediate file (`static/api_spec.json`), so two builds running simultaneously in the same release folder can race and put the wrong API host into a site. Sequentially is safe:

```bash
npm run build && npm run build:vendrex && npm run build:sellmo
```

---

## 10. Check before publishing

```bash
npm run check                # all three
npm run check:vendrex        # one brand
```

This inspects the finished build folders and prints **one line per problem**, exiting non-zero if:

- any file in a brand's output mentions **another brand's** name or domain (a "brand leak" — the most important check here),
- a machine-readable file is missing (`robots.txt`, `llms.txt`, `llms-full.txt`, `sitemap.xml`, `api_spec.json`),
- a link inside `llms.txt` points at a page that is not in the build,
- a page has no `description`, more than one `<h1>`, or an emoji heading.

Publish only when it reports no problems. A brand leak means the wrong company's name would appear on a customer-facing site, so treat a failure as a blocker, not a warning.

Optional spot check on the server without publishing:

```bash
npx docusaurus serve --dir build/vendrex --port 3003 --no-open
# browse http://<server-ip>:3003 then Ctrl+C
```

---

## 11. Publish to the served folders

Copy a checked build into the folder Nginx serves:

```bash
rsync -a --delete build/salesplay/ /var/www/sites/salesplay/
rsync -a --delete build/vendrex/   /var/www/sites/vendrex/
rsync -a --delete build/selmo/     /var/www/sites/selmo/
```

Run only the line for the site you are publishing — that is what makes the sites independent.

`--delete` makes the served folder an exact mirror of the build, so pages removed from the documentation disappear from the live site instead of lingering. The trailing slashes matter: `build/vendrex/` copies the folder's *contents*, not the folder itself.

No Nginx reload is needed. It serves whatever is in the folder at the time of the request.

---

## 12. Nginx: one server block per site

Each site is a separate file in `sites-available`, enabled with its own symlink. Start with SalesPlay:

```bash
sudo nano /etc/nginx/sites-available/developer.salesplay.com
```

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name developer.salesplay.com;

    root /var/www/sites/salesplay;
    index index.html;

    # Each documentation page is written as <path>/index.html
    location / {
        try_files $uri $uri/ $uri.html /404.html;
    }

    # Fingerprinted assets can be cached forever; HTML must not be
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    location ~* \.html$ {
        add_header Cache-Control "no-cache";
    }

    gzip on;
    gzip_types text/plain text/css application/javascript application/json image/svg+xml;

    access_log /var/log/nginx/developer.salesplay.com.access.log;
    error_log  /var/log/nginx/developer.salesplay.com.error.log;
}
```

Create the other two the same way, changing **only** `server_name`, `root` and the two log paths:

| File | `server_name` | `root` |
|---|---|---|
| `developer.vendrex.com` | `developer.vendrex.com` | `/var/www/sites/vendrex` |
| `developer.backofficewebportal.com` | `developer.backofficewebportal.com` | `/var/www/sites/selmo` |

The `try_files` line is not optional. Without it the home page works and every sub-page returns 404.

Enable and reload:

```bash
sudo ln -s /etc/nginx/sites-available/developer.salesplay.com /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/developer.vendrex.com /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/developer.backofficewebportal.com /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t                    # must say "syntax is ok" / "test is successful"
sudo systemctl reload nginx
```

---

## 13. DNS and HTTPS

Point each domain's A (and AAAA, if you use IPv6) record at this server, then confirm:

```bash
dig +short developer.salesplay.com
dig +short developer.vendrex.com
dig +short developer.backofficewebportal.com
```

Each must return this server's IP before you request certificates. Then:

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx \
  -d developer.salesplay.com \
  -d developer.vendrex.com \
  -d developer.backofficewebportal.com
```

Certbot edits the three server blocks to add `listen 443 ssl`, the certificate paths and an HTTP→HTTPS redirect, and installs a renewal timer. Verify renewal:

```bash
sudo certbot renew --dry-run
```

(`python3-certbot-nginx` is certbot's own dependency — certbot is written in Python. The documentation build itself needs no Python.)

---

## 14. Confirm the documentation is accessible

**Before DNS is live** — test the server blocks directly with a `Host` header:

```bash
for d in developer.salesplay.com developer.vendrex.com developer.backofficewebportal.com; do
  printf '%-40s ' "$d"
  curl -s -H "Host: $d" http://localhost/ | grep -o '<title[^>]*>[^<]*' | sed 's/.*>//'
done
```

Expect one line per domain, each naming its own brand:

```
developer.salesplay.com                  Introduction | SalesPlay Documentation
developer.vendrex.com                    Introduction | Vendrex Documentation
developer.backofficewebportal.com        Introduction | Sellmo Documentation
```

If two domains return the same brand, one server block has the wrong `root`.

**After DNS and HTTPS** — check each public URL:

```bash
for d in developer.salesplay.com developer.vendrex.com developer.backofficewebportal.com; do
  echo "== $d"
  curl -sI "https://$d/" | head -1                       # expect HTTP/2 200
  curl -s "https://$d/api_spec.json" | head -c 60; echo   # expect JSON with that brand's API host
done
```

A sub-page must also work, since that is what `try_files` is for:

```bash
curl -sI https://developer.vendrex.com/API-reference/ | head -1    # expect 200, not 404
```

(The documentation is served from the site root — there is no `/docs` prefix in the URLs.)

**Finally, open each site in a browser** and confirm the four things no command can check:

- the correct logo and brand colour,
- the correct brand name in the text — and no mention of the other two brands,
- the search box returns results when you type (search is built at build time; if it reports no index, someone published a dev build),
- the page loads over HTTPS with no mixed-content warning.

---

## 15. Updating: deploying a new zip

There is no `git pull` in this setup. **Every update arrives as a new zip**, and you deploy it *alongside* the old one rather than on top of it. That is what makes rollback cheap.

```bash
# 1. unpack the new release next to the old one
cd /var/www/releases
sha256sum pos-api-docs-2026-10-15.zip     # compare with the checksum you were sent
unzip -q pos-api-docs-2026-10-15.zip
mv pos-api-docs pos-api-docs-2026-10-15
cd pos-api-docs-2026-10-15

# 2. dependencies for this release
npm ci

# 3. build, check, publish — per site
npm run build:vendrex
npm run check:vendrex
rsync -a --delete build/vendrex/ /var/www/sites/vendrex/
```

Notes:

- Updating one brand has no effect on the other two, including when a build fails.
- No Nginx reload, no service restart, no downtime.
- The API reference pages arrive **already generated** in the zip. You never run `gen_api_docs.mjs` on the server, even when the OpenAPI spec has changed.
- Keep the previous release folder for rollback and delete anything older.

```bash
du -sh /var/www/releases/*        # see what is accumulating
```

---

## 16. Deploy script

Save this as `/var/www/releases/deploy.sh`. It takes a release folder and a brand, or `all`:

```bash
#!/usr/bin/env bash
# Build, check and publish one documentation site (or all three) from an unpacked release.
#   ./deploy.sh /var/www/releases/pos-api-docs-2026-10-15 vendrex
#   ./deploy.sh /var/www/releases/pos-api-docs-2026-10-15 all
set -euo pipefail

SITES=/var/www/sites
RELEASE=${1:-}
BRAND=${2:-all}

# Validate everything before touching anything.
[ -n "$RELEASE" ] && [ -d "$RELEASE" ] || { echo "release folder not found: '$RELEASE'" >&2; exit 2; }
case "$BRAND" in
  salesplay|vendrex|sellmo|all) ;;
  *) echo "unknown brand '$BRAND' (expected salesplay, vendrex, sellmo or all)" >&2; exit 2 ;;
esac

cd "$RELEASE"
git rev-parse --is-inside-work-tree >/dev/null 2>&1 \
  || { echo "'$RELEASE' has no .git folder - the build cannot run (see guide section 18)" >&2; exit 2; }
[ -d node_modules ] || npm ci

deploy_one() {
  local brand=$1 build check out
  case "$brand" in
    salesplay) build=build;         check=check:salesplay; out=salesplay ;;
    vendrex)   build=build:vendrex; check=check:vendrex;   out=vendrex   ;;
    sellmo)    build=build:sellmo;  check=check:sellmo;    out=selmo     ;;
  esac
  echo "== $brand: building"
  npm run "$build"
  echo "== $brand: checking"
  npm run "$check"                      # non-zero here stops the script; nothing is published
  if [ -d "$SITES/$out" ]; then
    echo "== $brand: snapshotting current site for rollback"
    rm -rf "$SITES/$out.prev"
    cp -a "$SITES/$out" "$SITES/$out.prev"
  fi
  echo "== $brand: publishing"
  rsync -a --delete "build/$out/" "$SITES/$out/"
  echo "== $brand: done"
}

if [ "$BRAND" = all ]; then
  for b in salesplay vendrex sellmo; do deploy_one "$b"; done
else
  deploy_one "$BRAND"
fi

echo "== finished $(date -Is)"
```

```bash
chmod +x /var/www/releases/deploy.sh
/var/www/releases/deploy.sh /var/www/releases/pos-api-docs-2026-09-23 vendrex
```

The release folder, the brand name and the presence of `.git` are all validated before anything is built, so a typo or a bad zip exits immediately instead of publishing. `set -e` then means a failed build or a failed check never reaches the `rsync` line, so the live site keeps its previous release. Each publish also snapshots the outgoing site to `<brand>.prev`, which is what makes [§17](#17-rollback) instant.

---

## 17. Rollback

**Instant — restore the previous published copy.** The deploy script snapshots it on every publish:

```bash
rsync -a --delete /var/www/sites/vendrex.prev/ /var/www/sites/vendrex/
```

Live immediately, no rebuild. This is the rollback to reach for.

**From an older zip — rebuild the previous release.** Affects only the brand you rebuild:

```bash
/var/www/releases/deploy.sh /var/www/releases/pos-api-docs-2026-09-16 vendrex
```

Because each release stays in its own folder, going back is just naming the older one. That is why [§15](#15-updating-deploying-a-new-zip) keeps the previous release on disk.

---

## 18. Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `Error: This Docusaurus site is outside any Git worktree` | the `.git` folder is missing from the unpacked release | see **The `.git` folder is missing** below |
| `TENANT_… is missing — check .env.<brand>` | a brand file is absent or a line is missing | [§8](#8-brand-configuration-files-env) — every line is required |
| `process.loadEnvFile is not a function` | Node older than 20.12 | install Node 22 ([§5.2](#52-nodejs-22)) |
| `Cannot find package 'js-yaml'` | dependencies not installed | `npm ci` in the release folder |
| `npm ci` fails: lockfile out of sync | a damaged or hand-edited zip | request a fresh zip; do **not** run `npm install` to work around it |
| `npm ci` cannot reach the registry | no outbound internet | copy in `node_modules/`, or request a zip that includes it ([§7](#7-install-dependencies)) |
| Build killed / `JavaScript heap out of memory` | not enough RAM | `export NODE_OPTIONS=--max-old-space-size=3072` before building, or add swap: `sudo fallocate -l 2G /swapfile && sudo chmod 600 /swapfile && sudo mkswap /swapfile && sudo swapon /swapfile` |
| `npm run check` → "mentions another brand" | a source page has a sister brand's name typed into it | do **not** publish; report it to the documentation team |
| Build output: `Panic occurred at runtime` (rspack) | corrupted build cache | `npx docusaurus clear && rm -rf .docusaurus-build*`, then rebuild |
| Vendrex site shows SalesPlay text or logo | wrong folder published, or a stale copy | check `root` against [§2](#2-the-three-sites-at-a-glance); re-run that brand's `rsync` |
| Two domains show the same site | both server blocks point at the same `root` | fix `root`, `nginx -t`, reload |
| Home page works, sub-pages 404 | the `try_files` line is missing | use the `location /` block from [§12](#12-nginx-one-server-block-per-site) exactly |
| Nginx `403 Forbidden` | permissions on the served folder | `sudo chown -R $USER:www-data /var/www/sites && sudo chmod -R 755 /var/www/sites` |
| Search reports no index | a dev server was published instead of a build | never use `npm start`; rebuild and republish |
| `certbot` fails the challenge | the domain does not resolve here yet | fix DNS, confirm with `dig +short`, re-run [§13](#13-dns-and-https) |

**Where to look:** build output goes to your terminal, or to `/var/log/docs-deploy.log` if you run the deploy script from cron. Nginx logs are per site: `/var/log/nginx/<domain>.error.log`.

### The `.git` folder is missing

Most likely the zip was created with a tool that silently skips hidden folders — Windows PowerShell's `Compress-Archive` does exactly this. **The correct fix is to request a zip that includes `.git`.**

If that is impossible, there are two workarounds, and both cost something. Agree one with the documentation team before using it:

1. **Create a throwaway repository inside the release folder.** The build then succeeds, but every page's "Last updated" date, the `sitemap.xml` timestamps and the structured-data dates all become *the day you ran this*, not the day the documentation actually changed. That misinforms readers and search engines alike.

   ```bash
   cd /var/www/releases/pos-api-docs-2026-09-23
   git init -q .
   git -c user.email=deploy@local -c user.name=Deploy add -A
   git -c user.email=deploy@local -c user.name=Deploy commit -qm "Docs release 2026-09-23"
   ```

2. **Turn the dates off.** In `docusaurus.config.js`, change `showLastUpdateTime: true` to `false`. The build then succeeds with no dates at all — cleaner than wrong dates, but it removes a freshness signal the documentation was specifically built to publish. This edits shipped code, so it must be agreed with the documentation team and repeated on every release.

---

## 19. Security notes

- The sites are static. No application server, no database, no upload path — the attack surface is Nginx itself. Keep Ubuntu and Nginx patched.
- Open only what is needed: `sudo ufw allow OpenSSH && sudo ufw allow 'Nginx Full' && sudo ufw enable`.
- The `.env.*` files hold public names and URLs by design and contain no secrets. If a future tool needs a token, pass it as a shell variable for that one command — never write it into a file in the release folder.
- Build as an unprivileged user; Nginx serves as `www-data`. Nothing here needs `root` beyond installing packages and editing Nginx configuration.
- Verify the zip's `sha256sum` against the value you were sent before unpacking. It is the only integrity check in this hand-off.

---

## 20. Checklists

### First deployment

- [ ] Ubuntu updated; `curl unzip rsync git build-essential nginx` installed
- [ ] Node 22 installed (`node --version` → `v22.x`)
- [ ] `/var/www/releases` and `/var/www/sites/{salesplay,vendrex,selmo}` created with the ownership from [§5.3](#53-directories)
- [ ] Zip checksum matches; unpacked and renamed to `pos-api-docs-<date>`
- [ ] `.git` present (`git rev-parse --is-inside-work-tree` → `true`) and all three `.env.*` files present; `chmod 600 .env.*`
- [ ] `npm ci` completed
- [ ] All three builds finish with `[SUCCESS]`
- [ ] `npm run check` reports no problems
- [ ] Three `rsync` publishes done
- [ ] Three Nginx server blocks enabled; `nginx -t` passes; each `curl -H "Host: …"` returns that brand's own title
- [ ] DNS resolves all three domains here
- [ ] Certificates issued; `certbot renew --dry-run` passes
- [ ] Each site opened in a browser: right logo, right brand name, no sister-brand text, search returns results
- [ ] `deploy.sh` saved, executable, tested on one brand
- [ ] Firewall enabled (22, 80, 443)
- [ ] The three `.env.*` files backed up off-server

### Every new zip

- [ ] Checksum verified; unpacked into its **own dated folder**, not over the previous one
- [ ] `.git` and the three `.env.*` files present in the new folder
- [ ] `npm ci` (or `node_modules` copied from the previous release when `package-lock.json` is unchanged)
- [ ] `./deploy.sh <release-folder> <brand|all>` finishes with `== finished`
- [ ] Each updated site loads over HTTPS and shows the change
- [ ] Search still returns results
- [ ] Previous release folder kept for rollback; older ones deleted
