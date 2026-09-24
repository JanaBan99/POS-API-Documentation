# Hosting the documentation from a `build/` folder

**Audience:** whoever puts the finished site on a web server. You need no source code, no Node.js, no npm, no build step and no access to the documentation repository — only the finished files and a web server.

You have been given a folder (or a zip of one) such as `build/vendrex/`. It is a complete static website: about **261 files, 13 MB**. Serving it is copying it into place and pointing a web server at it.

---

## Contents

1. [What you received](#1-what-you-received)
2. [The one thing that can be wrong: the address](#2-the-one-thing-that-can-be-wrong-the-address)
3. [Retargeting the files to your address](#3-retargeting-the-files-to-your-address)
4. [Put the files on the server](#4-put-the-files-on-the-server)
5. [Nginx](#5-nginx)
6. [Apache](#6-apache)
7. [Caddy](#7-caddy)
8. [Verify it works](#8-verify-it-works)
9. [HTTPS](#9-https)
10. [Updating and rolling back](#10-updating-and-rolling-back)
11. [Troubleshooting](#11-troubleshooting)
12. [Checklist](#12-checklist)

---

## 1. What you received

One folder per brand. Which one you have determines the domain it belongs on:

| Folder | Brand | Normally served at |
|---|---|---|
| `build/salesplay/` | SalesPlay | `developer.salesplay.com` |
| `build/vendrex/` | Vendrex | `developer.vendrex.com` |
| `build/selmo/` | Sellmo | `developer.backofficewebportal.com` |

Sellmo's folder is spelled **`selmo`**, one `l`. That is deliberate.

Inside each:

| | |
|---|---|
| `index.html` and 102 more pages | each page is a folder containing `index.html` |
| `404.html` | error page |
| `assets/` | fingerprinted CSS and JS |
| `img/` | logo, favicon, screenshots |
| `search-index.json` | ~1.8 MB; search runs in the browser from this file |
| `api_spec.json` | the OpenAPI spec the API reference page renders |
| `sitemap.xml`, `robots.txt`, `llms.txt`, `llms-full.txt` | for search engines and AI crawlers |

**There is no server-side code.** No database, no Node process, no PHP, no API calls from the server, nothing to keep running, no secrets. Any web server that serves files works: Nginx, Apache, Caddy, IIS, S3 + CloudFront, Cloudflare Pages, Netlify.

Two structural rules that follow from how the site was built:

- **It must be served at the root of its address** (`https://host/`), never under a subpath like `https://host/docs/`. Assets are referenced as `/assets/…` and `/img/…`, so a subpath breaks every stylesheet and image.
- **Requests for a path must fall back to that path's `index.html`.** Every web server section below configures this. Without it the home page works and every other page returns 404 when reloaded.

---

## 2. The one thing that can be wrong: the address

The site is static, so the handful of things that have to be absolute URLs — canonical tags, the sitemap, structured data — were written **when the folder was built**. They contain whatever address the builder specified.

Measured on a real build, the address appears **1,484 times across 109 files**:

| Where | What it is |
|---|---|
| 104 HTML pages | `<link rel=canonical>`, `og:url`, JSON-LD `"url"` |
| `sitemap.xml` | absolute `<loc>` for all 77 entries |
| `robots.txt` | the `Sitemap:` line |
| `llms.txt`, `llms-full.txt` | absolute links for AI crawlers |
| `assets/js/main.*.js` | the site config embedded in the bundle |

These are **not** affected by the address, and work anywhere as-is:

| | Why |
|---|---|
| all HTML, CSS, JS, images | referenced root-relatively |
| `search-index.json` | page links are stored **relative** (`/`, `/API-reference`, …) |
| `api_spec.json` | holds the **API** address, which is unrelated to where these docs live |

So: **if you are serving the folder at the address it was built for, do nothing — skip to [§4](#4-put-the-files-on-the-server).**

If you are serving it anywhere else — a staging box, an IP, a different domain, a preview host — the pages render perfectly and search works perfectly, but every canonical tag and sitemap entry names the wrong host. Search engines would be told the site lives somewhere else. [§3](#3-retargeting-the-files-to-your-address) fixes that with a short find-and-replace.

Check what your folder was built for:

```bash
grep -o '<loc>[^<]*' sitemap.xml | head -1
# e.g. → <loc>https://developer.vendrex.com/markdown-page
```

---

## 3. Retargeting the files to your address

**Only needed when the address above is not the address you will serve at.** The best fix is to ask for a rebuild with the right address; this is the equivalent fix when you only have the built files.

It is a plain text replacement — the address appears only in its plain form, never escaped or encoded — but **one link has to be protected from it**, so the procedure is three steps rather than one.

The Postman collection is downloaded from a PHP endpoint on the developer portal, e.g. `https://developer.vendrex.com/download_postman_collection.php`. In production the portal and the documentation share a host, so the site address is a *prefix* of that link. A blind replacement turns it into `http://your-host/download_postman_collection.php`, which does not exist — a broken download on every page that offers the collection. Everything under `/download` is therefore parked before the replacement and restored after. No real page in the site starts with `/download`, so nothing else is affected.

```bash
cd /path/to/build/vendrex

OLD="https://developer.vendrex.com"     # what it was built for (from the check above)
NEW="http://54.205.5.145"               # where you will actually serve it, no trailing slash
KEEP="$OLD/download"                    # the Postman endpoint lives on the portal, not here

# 1. park the portal links so step 2 cannot touch them
grep -rlZF "$KEEP" . | xargs -0 -r sed -i "s|$KEEP|@@KEEP@@|g"

# 2. retarget the site address everywhere
grep -rlZF "$OLD" . | xargs -0 -r sed -i "s|$OLD|$NEW|g"

# 3. put the portal links back
grep -rlZF "@@KEEP@@" . | xargs -0 -r sed -i "s|@@KEEP@@|$KEEP|g"
```

Then confirm — the only survivors must be the portal links, and no placeholder may remain:

```bash
grep -rhoE "$OLD[A-Za-z0-9_./-]*" . | sort | uniq -c
# expected: only .../download_postman_collection.php (and an underscore-stripped
#           copy of it that appears in the FAQ structured data)

grep -roF '@@KEEP@@' . | wc -l                              # must be 0
grep -o '<link[^>]*canonical[^>]*>' index.html | head -1    # must show NEW
grep -o '<loc>[^<]*' sitemap.xml | head -1                  # must show NEW
```

Notes that matter:

- **Include the scheme and no trailing slash** in both values. `http://` for a bare IP, `https://` once you have a certificate.
- **On macOS** use `sed -i ''` instead of `sed -i`.
- **Do this on a fresh copy of the folder**, before publishing. It edits files in place, and running it twice with different values will not undo the first pass.
- `assets/js/main.*.js` is edited too. Its filename contains a content hash that no longer matches its contents — harmless, nothing verifies it, but if you retarget a folder that is *already live on the same host*, clear the CDN/browser cache for `/assets/`, since those files are served with a one-year cache header.
- The API base URL inside `api_spec.json` is a different host entirely and is never touched.
- Going the other way (an IP-built folder onto a domain) needs no protection step, because the Postman link was never on the IP. Running all three steps anyway is harmless.

Verified end to end on a real build: 1,484 site references moved, the 13 portal links survived untouched, no placeholder remained, every route still returned 200, and `search-index.json` still parsed with 991 indexed documents.

### For a bare IP

Certificates are not issued for IP addresses, so an IP-hosted site is plain HTTP and the value must say so:

```bash
NEW="http://54.205.5.145"
```

When you later move it to a real domain with HTTPS, retarget again (or ask for a rebuild) — see [§9](#9-https).

---

## 4. Put the files on the server

Create the folder the server will serve from and copy the contents in.

```bash
sudo mkdir -p /var/www/sites/vendrex
sudo chown -R "$USER":www-data /var/www/sites/vendrex
```

From your machine, choose whichever tool you have:

```bash
# rsync - best: mirrors exactly and removes deleted pages
rsync -az --delete build/vendrex/ USER@SERVER:/var/www/sites/vendrex/

# scp - fine for a first upload
scp -r build/vendrex/* USER@SERVER:/var/www/sites/vendrex/

# or ship a tarball and unpack on the server
tar -czf vendrex-site.tgz -C build/vendrex .
scp vendrex-site.tgz USER@SERVER:/tmp/
ssh USER@SERVER 'sudo tar -xzf /tmp/vendrex-site.tgz -C /var/www/sites/vendrex && rm /tmp/vendrex-site.tgz'
```

The trailing slash on `build/vendrex/` matters for rsync — it copies the folder's *contents*, not the folder itself. You want `/var/www/sites/vendrex/index.html` to exist, not `/var/www/sites/vendrex/vendrex/index.html`.

Permissions:

```bash
sudo chown -R root:www-data /var/www/sites/vendrex
sudo find /var/www/sites/vendrex -type d -exec chmod 755 {} \;
sudo find /var/www/sites/vendrex -type f -exec chmod 644 {} \;
```

---

## 5. Nginx

```bash
sudo apt update && sudo apt install -y nginx
sudo nano /etc/nginx/sites-available/vendrex-docs
```

```nginx
server {
    listen 80;
    listen [::]:80;

    # A real domain:  server_name developer.vendrex.com;
    # A bare IP:      server_name _;   (matches any Host header)
    server_name developer.vendrex.com;

    root /var/www/sites/vendrex;
    index index.html;

    # REQUIRED: every page is <path>/index.html
    location / {
        try_files $uri $uri/ $uri.html /404.html;
    }

    # Fingerprinted assets never change; HTML must not be cached
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    location ~* \.html$ {
        add_header Cache-Control "no-cache";
    }

    # search-index.json is ~1.8 MB raw, ~380 KB gzipped - keep application/json here
    gzip on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/javascript application/json image/svg+xml;

    access_log /var/log/nginx/vendrex-docs.access.log;
    error_log  /var/log/nginx/vendrex-docs.error.log;
}
```

```bash
sudo ln -sf /etc/nginx/sites-available/vendrex-docs /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default        # only if this is the only site
sudo nginx -t                                      # must say "test is successful"
sudo systemctl reload nginx
```

---

## 6. Apache

```bash
sudo apt install -y apache2
sudo a2enmod rewrite deflate expires headers
sudo nano /etc/apache2/sites-available/vendrex-docs.conf
```

```apache
<VirtualHost *:80>
    ServerName developer.vendrex.com
    DocumentRoot /var/www/sites/vendrex

    <Directory /var/www/sites/vendrex>
        Require all granted
        Options -Indexes +FollowSymLinks
        DirectoryIndex index.html

        # REQUIRED: fall back to <path>/index.html, then <path>.html, then 404
        RewriteEngine On
        RewriteCond %{REQUEST_FILENAME} -f [OR]
        RewriteCond %{REQUEST_FILENAME} -d
        RewriteRule ^ - [L]
        RewriteCond %{REQUEST_FILENAME}/index.html -f
        RewriteRule ^(.*)$ /$1/index.html [L]
        RewriteCond %{REQUEST_FILENAME}.html -f
        RewriteRule ^(.*)$ /$1.html [L]
        ErrorDocument 404 /404.html
    </Directory>

    AddOutputFilterByType DEFLATE text/html text/css application/javascript application/json image/svg+xml
    <LocationMatch "^/assets/">
        Header set Cache-Control "public, immutable, max-age=31536000"
    </LocationMatch>
    <FilesMatch "\.html$">
        Header set Cache-Control "no-cache"
    </FilesMatch>
</VirtualHost>
```

```bash
sudo a2ensite vendrex-docs
sudo a2dissite 000-default        # only if this is the only site
sudo apache2ctl configtest
sudo systemctl reload apache2
```

---

## 7. Caddy

Caddy does the index fallback and HTTPS automatically. The whole `/etc/caddy/Caddyfile`:

```caddy
developer.vendrex.com {
    root * /var/www/sites/vendrex
    encode gzip
    try_files {path} {path}/index.html {path}.html /404.html
    file_server

    @assets path /assets/*
    header @assets Cache-Control "public, immutable, max-age=31536000"
    header /*.html Cache-Control "no-cache"
}
```

```bash
sudo caddy validate --config /etc/caddy/Caddyfile
sudo systemctl reload caddy
```

For a bare IP, replace the first line with `:80 {` — Caddy cannot get a certificate for an IP.

---

## 8. Verify it works

### On the server

```bash
curl -s -o /dev/null -w "home        %{http_code}\n" http://localhost/
curl -s -o /dev/null -w "sub-page    %{http_code}\n" http://localhost/API-reference/
curl -s -o /dev/null -w "deep page   %{http_code}\n" http://localhost/guides/getting-started
curl -s -o /dev/null -w "search idx  %{http_code}\n" http://localhost/search-index.json
curl -s -o /dev/null -w "api spec    %{http_code}\n" http://localhost/api_spec.json
curl -s -o /dev/null -w "missing     %{http_code}\n" http://localhost/nope-not-here
```

Expect `200 200 200 200 200 404`. Any 404 among the first five means the `try_files` / rewrite rules are wrong.

### From outside

```bash
curl -sI https://developer.vendrex.com/ | head -1
curl -s  https://developer.vendrex.com/ | grep -o '<title[^>]*>[^<]*' | sed 's/.*>//'
# → Introduction | Vendrex Documentation

curl -s https://developer.vendrex.com/ | grep -o '<link[^>]*canonical[^>]*>'
# the href must be the address you just typed - if not, redo section 3
```

### In a browser — the four things no command catches

1. correct logo, brand colour and brand name, with **no mention of the other two brands**
2. click into a sub-page, then press reload — that reload is what the fallback rules handle
3. **type in the search box and confirm results appear** — this proves `search-index.json` is being served
4. open the API reference page and confirm the endpoint list renders — this proves `api_spec.json` is being served

---

## 9. HTTPS

Certificates cannot be issued for bare IP addresses. Once a real domain points at the server:

```bash
# Nginx
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d developer.vendrex.com

# Apache
sudo apt install -y certbot python3-certbot-apache
sudo certbot --apache -d developer.vendrex.com

# Caddy does this automatically, nothing to run
```

```bash
sudo certbot renew --dry-run      # confirm automatic renewal works
```

**After switching from `http://` to `https://`, the address changed** — so retarget again with the new `https://…` value ([§3](#3-retargeting-the-files-to-your-address)), or ask for a rebuild. Otherwise every canonical tag still advertises the `http://` version of your site.

---

## 10. Updating and rolling back

Each update arrives as a new folder or zip. Keep the outgoing copy so you can go back instantly.

```bash
# snapshot what is live, then publish the new build
sudo rm -rf /var/www/sites/vendrex.prev
sudo cp -a /var/www/sites/vendrex /var/www/sites/vendrex.prev
rsync -az --delete build/vendrex/ USER@SERVER:/var/www/sites/vendrex/
```

Rollback, live immediately:

```bash
sudo rsync -a --delete /var/www/sites/vendrex.prev/ /var/www/sites/vendrex/
```

No web server reload is needed for either — the server serves whatever is in the folder at the time of the request. Remember to redo [§3](#3-retargeting-the-files-to-your-address) on each new build if you are not serving at its built-in address.

---

## 11. Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| Home page fine, sub-pages 404 on reload | the index fallback rule is missing | Nginx [§5](#5-nginx) `try_files`, Apache [§6](#6-apache) rewrite block, Caddy [§7](#7-caddy) `try_files` |
| No CSS, no images, unstyled text | served under a subpath, not the address root | serve at `https://host/`, not `https://host/docs/` |
| Search box returns nothing | `search-index.json` not reachable | `curl -I http://localhost/search-index.json` on the server; must be 200 |
| Search is slow on first use | the 1.8 MB index downloads uncompressed | enable gzip for `application/json` ([§5](#5-nginx)) — it drops to ~380 KB |
| API reference page is empty | `api_spec.json` not reachable | `curl -I http://localhost/api_spec.json`; must be 200 |
| Canonical tags / sitemap show another host | the folder was built for a different address | [§3](#3-retargeting-the-files-to-your-address) |
| `403 Forbidden` | directory or file permissions | re-run the `chmod`/`chown` commands in [§4](#4-put-the-files-on-the-server) |
| Works on `localhost`, dead from outside | firewall or cloud security group | open inbound TCP 80, and 443 once HTTPS is on |
| Vendrex site shows SalesPlay branding | the wrong brand folder was published | check the `root` path against the table in [§1](#1-what-you-received) |
| Files copied but the site is one level too deep | rsync trailing slash omitted | `/var/www/sites/vendrex/index.html` must exist, not `…/vendrex/vendrex/index.html` |

**Logs:** `/var/log/nginx/vendrex-docs.error.log`, or `/var/log/apache2/error.log`, or `journalctl -u caddy`.

---

## 12. Checklist

- [ ] Correct brand folder for the domain it is going on ([§1](#1-what-you-received))
- [ ] Checked what address it was built for: `grep -o '<loc>[^<]*' sitemap.xml | head -1`
- [ ] If that differs from where you are serving it: retargeted ([§3](#3-retargeting-the-files-to-your-address)) and confirmed 0 stale references
- [ ] Files copied to `/var/www/sites/<brand>/`, with `index.html` directly inside it
- [ ] Ownership and permissions set
- [ ] Web server configured **with the index fallback rule**; config test passes; reloaded
- [ ] gzip enabled for `application/json` (search index)
- [ ] All six `curl` checks return the expected codes ([§8](#8-verify-it-works))
- [ ] Certificate issued and renewal dry-run passes (real domains only)
- [ ] Browser: right branding, sub-page reload works, **search returns results**, API reference renders
- [ ] Previous copy kept at `<brand>.prev` for rollback
