# Deployment guide — API documentation sites

**Audience:** the engineer who builds and hosts these sites. No knowledge of the documentation itself is needed.

This repository produces **three independent websites** from one source tree. Each site has its own configuration file, its own build command, its own output folder, its own Nginx server block and its own domain. Nothing is shared at runtime, so any one site can be built, published, rolled back or taken down without touching the other two.

Everything below runs on a single Ubuntu server. If you later split the sites across separate servers, each server follows the same steps but only for its own brand.

---

## Table of contents

1. [What you are deploying](#1-what-you-are-deploying)
2. [The three sites at a glance](#2-the-three-sites-at-a-glance)
3. [Server requirements](#3-server-requirements)
4. [One-time server setup](#4-one-time-server-setup)
5. [Get the code](#5-get-the-code)
6. [Brand configuration files (`.env`)](#6-brand-configuration-files-env)
7. [Build a site](#7-build-a-site)
8. [Check before publishing](#8-check-before-publishing)
9. [Publish to the release folders](#9-publish-to-the-release-folders)
10. [Nginx: one server block per site](#10-nginx-one-server-block-per-site)
11. [DNS and HTTPS](#11-dns-and-https)
12. [Confirm the documentation is accessible](#12-confirm-the-documentation-is-accessible)
13. [Updating a site](#13-updating-a-site)
14. [Deploy script](#14-deploy-script)
15. [Rollback](#15-rollback)
16. [Troubleshooting](#16-troubleshooting)
17. [Security notes](#17-security-notes)
18. [Checklists](#18-checklists)

---

## 1. What you are deploying

Static websites. After a build there is **no server-side code, no database, and no Node process to keep running** — only HTML, CSS, JS and images that any web server can serve. Nginx serves files from a directory; that is the entire runtime.

The build is a Node program. It reads one brand's configuration file, rewrites the documentation for that brand (name, URLs, logo, favicon, screenshots, colours), builds a client-side search index, and writes a finished site into its own folder.

Two consequences worth knowing up front:

- **The build needs no network access to the product.** It never calls the POS API and needs no tokens or credentials. It only needs to reach your package registry (once, for `npm ci`) and your git remote.
- **The build is the only moving part.** If a build fails, nothing is published and the live sites keep serving the previous release.

Never run `npm start` on this server. That is the development server: slow, unminified, no search index, and it shows placeholder dates. Production is always `npm run build…` followed by Nginx serving the output.

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
| Release folder | `/var/www/sites/salesplay` | `/var/www/sites/vendrex` | `/var/www/sites/selmo` |
| Public domain | `developer.salesplay.com` | `developer.vendrex.com` | `developer.backofficewebportal.com` |

Two spellings to be careful with, both intentional:

- Sellmo's brand key is **`sellmo`** but its output folder is **`selmo`** (one `l`). That matches the image folder name inside the repository. Use the table, not intuition.
- SalesPlay has no suffix on its commands — `npm run build` *is* the SalesPlay build, because SalesPlay is the default brand when no brand is specified.

---

## 3. Server requirements

| Item | Minimum | Notes |
|---|---|---|
| Ubuntu | 22.04 LTS or 24.04 LTS | commands below are tested on both |
| RAM | 2 GB (4 GB recommended) | one brand's build peaks around 1.5 GB; see [§16](#16-troubleshooting) if it is killed |
| Disk | 2 GB free | `node_modules` ≈ 700 MB, three builds ≈ 150 MB, three releases ≈ 150 MB |
| CPU | 1 core | a build takes 1–3 minutes per brand |
| Network | outbound HTTPS | to the git remote and the npm registry; **not** to the POS API |
| DNS | A/AAAA records | each public domain must point at this server before [§11](#11-dns-and-https) |
| Access | a user with `sudo` | do not build or deploy as `root` |

---

## 4. One-time server setup

Run this section once, as your normal user.

### 4.1 System packages

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y git curl build-essential nginx
```

`nginx` serves the built files. Nothing else is needed — the toolchain is entirely Node, and `npm ci` installs the rest.

### 4.2 Node.js 22

Node **22 LTS** is required. The brand loader uses `process.loadEnvFile`, which does not exist before Node 20.12. Ubuntu's default `nodejs` package is too old, so install from NodeSource:

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
node --version    # must print v22.x
npm --version
```

### 4.3 Directories

```bash
sudo mkdir -p /var/www
sudo chown "$USER":"$USER" /var/www
sudo mkdir -p /var/www/sites/salesplay /var/www/sites/vendrex /var/www/sites/selmo
sudo chown -R "$USER":www-data /var/www/sites
```

Two separate places, and the separation matters:

- `/var/www/docs` — the git checkout, where builds happen. Nginx never reads this.
- `/var/www/sites/<brand>` — the **release folder** Nginx serves. Files land here only after a build has passed its checks, so a broken build cannot take a live site down.

---

## 5. Get the code

```bash
cd /var/www
git clone https://github.com/JanaBan99/POS-API-Documentation.git docs
cd /var/www/docs
git branch --show-current     # expect: latest-doc
npm ci
```

**The deploy branch is `latest-doc`.** It is the repository's default branch, so a plain `git clone` checks it out already — there is no `main` or `master` to switch to. If that ever changes, this is the one place to update.

Use `npm ci`, not `npm install`: it installs the exact versions recorded in `package-lock.json` and fails loudly if the lockfile and `package.json` disagree. That is what you want on a server.

---

## 6. Brand configuration files (`.env`)

**This is the step that makes the three sites different from each other, and the only step that is not in git.**

Each brand's facts live in a plain text file named `.env.<brand>` at the root of the checkout. These files are deliberately **not committed** (`.gitignore` excludes `.env.*` except the template), so a fresh clone has none and the build will refuse to run until you create them.

Create all three from the template:

```bash
cd /var/www/docs
cp .env.example .env.salesplay
cp .env.example .env.vendrex
cp .env.example .env.sellmo
```

The template holds SalesPlay's values, so **`.env.salesplay` is complete as copied** — no edit needed. (Trailing `#` comments in the template are stripped by the loader; leaving them in does no harm.)

Now fill in the other two. Every line is required.

```bash
nano .env.vendrex
```
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

```bash
nano .env.sellmo
```
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

| Key | Used for |
|---|---|
| `TENANT` | the brand key; must match the file suffix |
| `TENANT_NAME` | the brand name everywhere in the text |
| `TENANT_HOST` | the brand's main web domain, substituted into page text |
| `TENANT_API_BASE_URL` | the API base URL shown in every code sample and in `api_spec.json` |
| `TENANT_BACKOFFICE_URL` | link to the brand's back office |
| `TENANT_DEVELOPER_URL` | the site's own canonical URL (used in `sitemap.xml` and structured data) |
| `TENANT_SITE_TITLE` | browser tab title |
| `TENANT_POSTMAN_URL` | download link for that brand's Postman collection |
| `TENANT_FAVICON` | favicon file name inside `static/img/<TENANT_IMG_DIR>/` |
| `TENANT_IMG_DIR` | which screenshot/logo folder under `static/img/` this brand uses |

### Rules

- **No secrets.** These files hold public names and URLs only. Never put a password, token or key in them.
- **A missing line stops the build** with `TENANT_… is missing — check .env.<brand>`. It fails fast rather than publishing a half-branded site.
- **Shell variables win.** A variable already set in the environment overrides the file, which is occasionally useful for a one-off test but should not be how you deploy.
- **`git pull` never touches them.** They are ignored by git, so they survive every update. Back them up outside the repository — a fresh clone cannot build without them.

```bash
chmod 600 .env.*
```

---

## 7. Build a site

From `/var/www/docs`, build whichever site you need:

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

**Build sites one at a time, not in parallel.** Each brand has its own output folder and its own cache folder, so sequential builds never interfere. But all three write one shared intermediate file (`static/api_spec.json`) inside the checkout, so two builds running *simultaneously in the same checkout* can race and put the wrong API host into a site. Sequentially is safe:

```bash
npm run build && npm run build:vendrex && npm run build:sellmo
```

If you need genuine parallelism, give each brand its own checkout.

---

## 8. Check before publishing

```bash
npm run check                # all three
npm run check:vendrex        # one brand
```

This inspects the finished build folders and prints **one line per problem**, exiting non-zero if:

- any file in a brand's output mentions **another brand's** name or domain (a "brand leak" — the most important check here),
- a machine-readable file is missing (`robots.txt`, `llms.txt`, `llms-full.txt`, `sitemap.xml`, `api_spec.json`),
- a link inside `llms.txt` points at a page that is not in the build,
- a page has no `description`, more than one `<h1>`, or an emoji heading.

Publish only when it reports no problems. A brand leak means the wrong company's name would appear on a customer-facing site, so treat a failure here as a blocker, not a warning.

Optional manual spot check on the server, without publishing:

```bash
npx docusaurus serve --dir build/vendrex --port 3003 --no-open
# browse http://<server-ip>:3003 then Ctrl+C
```

---

## 9. Publish to the release folders

Copy a checked build into the folder Nginx serves:

```bash
rsync -a --delete build/salesplay/ /var/www/sites/salesplay/
rsync -a --delete build/vendrex/   /var/www/sites/vendrex/
rsync -a --delete build/selmo/     /var/www/sites/selmo/
```

Run only the line for the site you are publishing — that is what makes the sites independent.

`--delete` makes the release folder an exact mirror of the build, so files removed from the documentation disappear from the live site instead of lingering. The trailing slashes matter: `build/vendrex/` copies the folder's *contents*, not the folder itself.

No Nginx reload is needed. It serves whatever is in the release folder at the time of the request.

---

## 10. Nginx: one server block per site

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

## 11. DNS and HTTPS

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

## 12. Confirm the documentation is accessible

**Before DNS is live** — test the server block directly with a `Host` header. Each must return that brand's own title:

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
  curl -sI "https://$d/" | head -1                      # expect HTTP/2 200
  curl -s "https://$d/api_spec.json" | head -c 60; echo  # expect JSON, brand's API host
done
```

A sub-page must also work, since that is what `try_files` is for:

```bash
curl -sI https://developer.vendrex.com/API-reference/ | head -1    # expect 200, not 404
```

(The documentation is served from the site root — there is no `/docs` prefix in the URLs.)

**Finally, open each site in a browser** and confirm the four things no command can check:

- the correct logo and brand colour,
- the correct brand name in the page text — and no mention of the other two brands,
- the search box returns results when you type (search is built at build time; if it says the index is unavailable, someone served a dev build),
- a page loads over HTTPS without a mixed-content warning.

---

## 13. Updating a site

When the documentation changes, update one site or all three. From `/var/www/docs`:

```bash
git pull --ff-only
npm ci                       # only needed when package-lock.json changed; harmless otherwise
```

Then, for each site you are updating:

```bash
npm run build:vendrex                                  # 1. build
npm run check:vendrex                                  # 2. stop here if it reports anything
rsync -a --delete build/vendrex/ /var/www/sites/vendrex/   # 3. publish
```

Notes:

- Your `.env.*` files are untouched by `git pull`.
- No Nginx reload, no service restart, no downtime — the swap is a file copy.
- The API reference pages are generated and **committed** in the repository. You do not run the generator on the server, even when the OpenAPI spec changes.
- Updating one brand has no effect on the other two, including when a build fails.

---

## 14. Deploy script

Save this as `/var/www/docs/deploy.sh`. It takes a brand name, or `all`:

```bash
#!/usr/bin/env bash
# Build, check and publish one documentation site (or all three).
#   ./deploy.sh vendrex
#   ./deploy.sh all
set -euo pipefail

REPO=/var/www/docs
SITES=/var/www/sites

# Reject a bad brand name before anything happens - no pull, no build, no publish.
BRAND=${1:-all}
case "$BRAND" in
  salesplay|vendrex|sellmo|all) ;;
  *) echo "unknown brand '$BRAND' (expected salesplay, vendrex, sellmo or all)" >&2; exit 2 ;;
esac

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
  echo "== $brand: publishing"
  rsync -a --delete "build/$out/" "$SITES/$out/"
  echo "== $brand: done"
}

cd "$REPO"
echo "== pulling"
git pull --ff-only
npm ci --silent

if [ "$BRAND" = all ]; then
  for b in salesplay vendrex sellmo; do deploy_one "$b"; done
else
  deploy_one "$BRAND"
fi

echo "== finished $(date -Is)"
```

```bash
chmod +x /var/www/docs/deploy.sh
/var/www/docs/deploy.sh vendrex
```

The brand name is validated first, so a typo (`./deploy.sh vendrx`) exits immediately with `unknown brand` instead of publishing anything. `set -e` then means a failed build or a failed check never reaches the `rsync` line, so the live site keeps its previous release. With `all`, a failure on one brand stops the run — brands already published stay published, and the rest are untouched.

**Optional nightly deploy** — only if the team accepts unreviewed commits going live:

```bash
crontab -e
# add:
30 2 * * * /var/www/docs/deploy.sh all >> /var/log/docs-deploy.log 2>&1
```

---

## 15. Rollback

**Fast path — keep the previous release.** Add this to `deploy.sh` immediately before the `rsync` line:

```bash
[ -d "$SITES/$out" ] && cp -a "$SITES/$out" "$SITES/$out.prev"
```

Then a rollback is a copy back, live in seconds, no rebuild:

```bash
rsync -a --delete /var/www/sites/vendrex.prev/ /var/www/sites/vendrex/
```

**Full path — rebuild an older commit.** Affects only the brand you rebuild:

```bash
cd /var/www/docs
git log --oneline -5                 # pick the commit to go back to
git checkout <commit>
npm ci
npm run build:vendrex && npm run check:vendrex
rsync -a --delete build/vendrex/ /var/www/sites/vendrex/
git checkout latest-doc              # leave the checkout on the deploy branch for the next deploy
```

Do not leave the checkout on a detached commit — the next `git pull` will fail.

---

## 16. Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `TENANT_… is missing — check .env.<brand>` | the brand file is absent or a line is missing | [§6](#6-brand-configuration-files-env) — every line is required |
| `process.loadEnvFile is not a function` | Node older than 20.12 | install Node 22 ([§4.2](#42-nodejs-22)) |
| `Cannot find package 'js-yaml'` | dependencies not installed | `npm ci` in `/var/www/docs` |
| `npm ci` fails: lockfile out of sync | `package.json` and `package-lock.json` disagree | a repository problem, not a server one — report it; do not "fix" it with `npm install` on the server |
| Build killed / `JavaScript heap out of memory` | not enough RAM | `export NODE_OPTIONS=--max-old-space-size=3072` before building, or add swap: `sudo fallocate -l 2G /swapfile && sudo chmod 600 /swapfile && sudo mkswap /swapfile && sudo swapon /swapfile` |
| `npm run check` → "mentions another brand" | a source page has a sister brand's name typed into it | do **not** publish; report it to the documentation team |
| Build output: `Panic occurred at runtime` (rspack) | corrupted build cache | `npx docusaurus clear && rm -rf .docusaurus-build*`, then rebuild |
| Vendrex site shows SalesPlay text or logo | wrong folder published, or a stale release | check `root` in that Nginx file against [§2](#2-the-three-sites-at-a-glance); re-run that brand's `rsync` |
| Two domains show the same site | both server blocks point at the same `root` | fix `root`, `nginx -t`, reload |
| Home page works, sub-pages 404 | the `try_files` line is missing | use the `location /` block from [§10](#10-nginx-one-server-block-per-site) exactly |
| Nginx `403 Forbidden` | permissions on the release folder | `sudo chown -R $USER:www-data /var/www/sites && sudo chmod -R 755 /var/www/sites` |
| Search says the index is unavailable | a dev server was published instead of a build | never use `npm start`; rebuild and republish |
| `certbot` fails the challenge | the domain does not resolve to this server yet | fix DNS, confirm with `dig +short`, re-run [§11](#11-dns-and-https) |

**Where to look:** build output goes to your terminal, or to `/var/log/docs-deploy.log` when run from cron. Nginx logs are per site: `/var/log/nginx/<domain>.error.log`.

---

## 17. Security notes

- The sites are static. There is no application server, no database and no upload path — the attack surface is Nginx itself. Keep Ubuntu and Nginx patched.
- Open only what is needed: `sudo ufw allow OpenSSH && sudo ufw allow 'Nginx Full' && sudo ufw enable`.
- `.env.*` files hold public names and URLs by design and contain no secrets. If a future tool ever needs a token, pass it as a shell variable for that one command — never write it into a file in the checkout.
- Build as an unprivileged user; Nginx serves as `www-data`. Nothing here needs `root` beyond package installation and Nginx configuration.
- Back up the three `.env.*` files somewhere outside the repository. They are the only thing on this server that a fresh clone cannot reproduce.

---

## 18. Checklists

### First deployment

- [ ] Ubuntu updated; `git curl build-essential nginx` installed
- [ ] Node 22 installed (`node --version` → `v22.x`)
- [ ] Repository cloned to `/var/www/docs`; `npm ci` succeeded
- [ ] `/var/www/sites/{salesplay,vendrex,selmo}` created, owned `$USER:www-data`
- [ ] `.env.salesplay`, `.env.vendrex`, `.env.sellmo` created and complete; `chmod 600`; backed up off-server
- [ ] All three builds finish with `[SUCCESS]`
- [ ] `npm run check` reports no problems
- [ ] Three `rsync` publishes done
- [ ] Three Nginx server blocks enabled; `nginx -t` passes; each `curl -H "Host: …"` returns that brand's own title
- [ ] DNS resolves all three domains to this server
- [ ] Certificates issued; `certbot renew --dry-run` passes
- [ ] Each site opened in a browser: right logo, right brand name, no sister-brand text, search returns results
- [ ] `deploy.sh` saved, executable, and tested on one brand
- [ ] Firewall enabled (22, 80, 443)

### Every update

- [ ] `./deploy.sh <brand>` (or `all`) finishes with `== finished`
- [ ] The updated site loads over HTTPS and shows the change
- [ ] Search still returns results
