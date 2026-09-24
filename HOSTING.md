# Hosting a documentation site on any server

How to put one brand's documentation on any host — a production domain, a staging box, or a bare IP — and why one variable has to be set before you build.

> **Credentials are never written in this file.** Every command below uses placeholders (`JUMP_USER`, `TARGET_HOST`, …). Fill them in from your own password manager, or set up SSH keys as in [§6](#6-stop-typing-passwords-use-keys) so no password is typed at all.

---

## Contents

1. [The one rule: the address is baked in at build time](#1-the-one-rule-the-address-is-baked-in-at-build-time)
2. [What changes with the address, and what does not](#2-what-changes-with-the-address-and-what-does-not)
3. [Build for the target address](#3-build-for-the-target-address)
4. [Copy the site to the server](#4-copy-the-site-to-the-server)
5. [Serve it with Nginx](#5-serve-it-with-nginx)
6. [Stop typing passwords: use keys](#6-stop-typing-passwords-use-keys)
7. [Verify it is live](#7-verify-it-is-live)
8. [Moving a site to a different address later](#8-moving-a-site-to-a-different-address-later)
9. [One-command deploy script](#9-one-command-deploy-script)
10. [Troubleshooting](#10-troubleshooting)

---

## 1. The one rule: the address is baked in at build time

The site is static, so a few things that must be absolute URLs — canonical tags, the sitemap, structured data — are written into the files **when you build**, not when you serve. The address comes from one variable:

```
docusaurus.config.js:39     url: profile.developerUrl
tenant.js                   developerUrl  <-  TENANT_DEVELOPER_URL  in .env.<brand>
```

So the rule is:

> **`TENANT_DEVELOPER_URL` must be the exact address visitors will type.** Set it, then build. If the address changes, rebuild.

Copying a build made for one address to a different host is what produces wrong canonical tags and a sitemap full of URLs that do not exist. Nothing is broken visually — the site renders and search works — but search engines are told the wrong home.

`baseUrl` is `/`, so the site must also be served at the **root** of that address, never under a subpath like `/docs/`.

---

## 2. What changes with the address, and what does not

Measured on a real build, not assumed.

**Rebuild required when the address changes:**

| File | What it contains |
|---|---|
| every page's `<head>` | `<link rel=canonical href=…>` |
| every page's JSON-LD | `"url":"…"` |
| `sitemap.xml` | absolute `<loc>` for all 77 entries |
| `robots.txt` | the `Sitemap:` line |
| `llms.txt` | 75 absolute links |
| `llms-full.txt` | 73 absolute links |

**Not affected — these work at any address:**

| File | Why |
|---|---|
| all page HTML, CSS, JS, images | referenced root-relatively (`/assets/…`, `/img/…`) |
| `search-index.json` | page links are stored **relative** (`/`, `/API-reference`, …) — search works unchanged |
| `api_spec.json` | holds the **API** base URL (`TENANT_API_BASE_URL`), which has nothing to do with where the docs are hosted |

Two useful consequences:

- The API base URL stays `https://api.vendrex.com/v1.0` no matter where you host the documentation. Hosting location and API location are independent.
- The Postman download link keeps pointing at the real developer portal (`TENANT_POSTMAN_URL`), which is correct — the collection lives there, not on this host.

---

## 3. Build for the target address

Run this on the build machine, from the project root.

### Hosting on a bare IP (staging)

Let's Encrypt cannot issue certificates for IP addresses, so an IP-hosted site is **http**, and the variable must say so:

```bash
TENANT_DEVELOPER_URL="http://TARGET_PUBLIC_IP" npm run build:vendrex
```

Worked example for a Vendrex staging box on `54.205.5.145`:

```bash
TENANT_DEVELOPER_URL="http://54.205.5.145" npm run build:vendrex
npm run check:vendrex
```

### Hosting on the production domain

```bash
npm run build:vendrex        # uses TENANT_DEVELOPER_URL from .env.vendrex
npm run check:vendrex
```

### The other brands

Replace the brand in both the variable and the script name:

| Brand | Command |
|---|---|
| SalesPlay | `TENANT_DEVELOPER_URL="http://IP" npm run build` |
| Vendrex | `TENANT_DEVELOPER_URL="http://IP" npm run build:vendrex` |
| Sellmo | `TENANT_DEVELOPER_URL="http://IP" npm run build:sellmo` |

Output folders: `build/salesplay/`, `build/vendrex/`, **`build/selmo/`** (Sellmo's folder has one `l`).

Confirm the address really was baked in before you ship it:

```bash
grep -o '<link[^>]*canonical[^>]*>' build/vendrex/index.html | head -1
# → <link data-rh=true rel=canonical href=http://54.205.5.145/ />

grep -o '<loc>[^<]*' build/vendrex/sitemap.xml | head -1
# → <loc>http://54.205.5.145/markdown-page
```

If those still show the old address, the variable did not reach the build — check for a typo and rebuild.

---

## 4. Copy the site to the server

Only the contents of `build/<brand>/` go to the server. No Node, no npm, no `.env`, no source, no `.git` — 261 files, about 13 MB.

### Through a jump host (one command)

`ssh -J` tunnels through the jump host, so you never copy files onto it:

```bash
rsync -az --delete \
  -e 'ssh -J JUMP_USER@JUMP_HOST:JUMP_PORT' \
  build/vendrex/ \
  TARGET_USER@TARGET_HOST:/var/www/sites/vendrex/
```

Fill in:

| Placeholder | Meaning |
|---|---|
| `JUMP_USER@JUMP_HOST:JUMP_PORT` | the bastion you are allowed to log into, e.g. `deploy@bastion.example.com:22` |
| `TARGET_USER@TARGET_HOST` | the web server, reachable **from the jump host**, e.g. `root@10.0.0.10` |
| `/var/www/sites/vendrex/` | where Nginx will serve from |

The trailing slash on `build/vendrex/` matters — it copies the folder's *contents*. `--delete` makes the server an exact mirror, so removed pages disappear instead of lingering.

> A private target address (`10.0.0.10`) with a different public address (`54.205.5.145`) is the normal pattern: you deploy to the private address and visitors reach the public one. Build with the **public** address from [§3](#3-build-for-the-target-address) and deploy to the **private** one here.

### If `ssh -J` is blocked

Copy in two hops via a tarball:

```bash
tar -czf vendrex-site.tgz -C build/vendrex .
scp -P JUMP_PORT vendrex-site.tgz JUMP_USER@JUMP_HOST:/tmp/

ssh -p JUMP_PORT JUMP_USER@JUMP_HOST
  scp /tmp/vendrex-site.tgz TARGET_USER@TARGET_HOST:/tmp/
  ssh TARGET_USER@TARGET_HOST
    sudo mkdir -p /var/www/sites/vendrex
    sudo tar -xzf /tmp/vendrex-site.tgz -C /var/www/sites/vendrex
    rm /tmp/vendrex-site.tgz
    exit
  rm /tmp/vendrex-site.tgz       # do not leave site copies on the bastion
```

### Permissions on the target

```bash
sudo chown -R root:www-data /var/www/sites/vendrex
sudo chmod -R 755 /var/www/sites/vendrex
```

---

## 5. Serve it with Nginx

On the target server:

```bash
sudo apt update && sudo apt install -y nginx
sudo nano /etc/nginx/sites-available/vendrex-docs
```

```nginx
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    # For an IP-hosted site, `_` matches any Host header.
    # For a real domain, replace with:  server_name developer.vendrex.com;
    server_name _;

    root /var/www/sites/vendrex;
    index index.html;

    # Every page is written as <path>/index.html - without this, sub-pages 404
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

    # The search index is ~1.8 MB uncompressed and ~380 KB gzipped - keep json here
    gzip on;
    gzip_types text/plain text/css application/javascript application/json image/svg+xml;

    access_log /var/log/nginx/vendrex-docs.access.log;
    error_log  /var/log/nginx/vendrex-docs.error.log;
}
```

Enable it and reload:

```bash
sudo ln -sf /etc/nginx/sites-available/vendrex-docs /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t                 # must say "syntax is ok" / "test is successful"
sudo systemctl reload nginx
```

Open port 80 if a firewall is on:

```bash
sudo ufw allow 'Nginx Full' 2>/dev/null || true
```

Also make sure the cloud security group for the instance allows inbound TCP 80 from wherever visitors are. That is usually the reason a correct Nginx setup still looks dead from outside.

### Later, on a real domain: add HTTPS

Certificates cannot be issued for an IP. Once a domain points at the server:

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d developer.vendrex.com
```

Then **rebuild** with `TENANT_DEVELOPER_URL=https://developer.vendrex.com` ([§8](#8-moving-a-site-to-a-different-address-later)) so the canonical tags and sitemap match the new https address.

---

## 6. Stop typing passwords: use keys

Passwords in commands end up in shell history, CI logs and scrollback. Set up keys once:

```bash
ssh-keygen -t ed25519 -C "docs-deploy"        # press Enter at the passphrase prompt if unattended

ssh-copy-id -p JUMP_PORT JUMP_USER@JUMP_HOST
ssh-copy-id -o ProxyJump=JUMP_USER@JUMP_HOST:JUMP_PORT TARGET_USER@TARGET_HOST
```

Then save the hop in `~/.ssh/config` so every later command is short:

```
Host docs-jump
    HostName JUMP_HOST
    Port     JUMP_PORT
    User     JUMP_USER

Host docs-target
    HostName TARGET_HOST
    User     TARGET_USER
    ProxyJump docs-jump
```

Deployment then becomes:

```bash
rsync -az --delete build/vendrex/ docs-target:/var/www/sites/vendrex/
```

**If a password has ever been pasted into a chat window, a ticket, an email or a shared document, treat it as exposed and rotate it.** Switching to keys and then disabling password login (`PasswordAuthentication no` in `/etc/ssh/sshd_config`) removes the problem permanently.

---

## 7. Verify it is live

### On the target server

```bash
curl -s -o /dev/null -w "home      %{http_code}\n" http://localhost/
curl -s -o /dev/null -w "sub-page  %{http_code}\n" http://localhost/API-reference/
curl -s -o /dev/null -w "search    %{http_code}\n" http://localhost/search-index.json
curl -s -o /dev/null -w "missing   %{http_code}\n" http://localhost/nope
```

Expect `200`, `200`, `200`, `404`. A 404 on the sub-page means the `try_files` line is missing.

### From your own machine

```bash
curl -sI http://54.205.5.145/ | head -1
curl -s  http://54.205.5.145/ | grep -o '<title[^>]*>[^<]*' | sed 's/.*>//'
# → Introduction | Vendrex Documentation

curl -s http://54.205.5.145/ | grep -o '<link[^>]*canonical[^>]*>'
# → href=http://54.205.5.145/   (must match the address you are typing)
```

### In a browser

- correct logo, brand colour and brand name — and no mention of the other two brands
- click into a sub-page and reload it (that reload is what `try_files` handles)
- **type in the search box and confirm results appear** — search is client-side, so this proves `search-index.json` is being served
- the API reference page renders its endpoint list (that proves `api_spec.json` is served)

---

## 8. Moving a site to a different address later

Because the address is compiled in, moving hosts is a rebuild, not a file copy:

```bash
# 1. rebuild for the new address
TENANT_DEVELOPER_URL="https://developer.vendrex.com" npm run build:vendrex
npm run check:vendrex

# 2. confirm it took
grep -o '<loc>[^<]*' build/vendrex/sitemap.xml | head -1

# 3. publish
rsync -az --delete build/vendrex/ docs-target:/var/www/sites/vendrex/

# 4. point Nginx at the domain
#    server_name developer.vendrex.com;   then: sudo nginx -t && sudo systemctl reload nginx
```

Keep the previous copy so you can go back instantly:

```bash
ssh docs-target 'sudo cp -a /var/www/sites/vendrex /var/www/sites/vendrex.prev'
# rollback:
ssh docs-target 'sudo rsync -a --delete /var/www/sites/vendrex.prev/ /var/www/sites/vendrex/'
```

---

## 9. One-command deploy script

Save as `deploy-host.sh` on the build machine. It refuses to publish if the built site does not actually carry the address you claim.

```bash
#!/usr/bin/env bash
# Build one brand for a given address and publish it to a server.
#   ./deploy-host.sh vendrex http://54.205.5.145 docs-target /var/www/sites/vendrex
set -euo pipefail

BRAND=${1:-}
ADDRESS=${2:-}
SSH_TARGET=${3:-}
REMOTE_DIR=${4:-}

case "$BRAND" in
  salesplay) BUILD=build;         CHECK=check:salesplay; OUT=salesplay ;;
  vendrex)   BUILD=build:vendrex; CHECK=check:vendrex;   OUT=vendrex   ;;
  sellmo)    BUILD=build:sellmo;  CHECK=check:sellmo;    OUT=selmo     ;;
  *) echo "usage: $0 <salesplay|vendrex|sellmo> <http(s)://address> <ssh-target> <remote-dir>" >&2; exit 2 ;;
esac
[ -n "$ADDRESS" ] && [ -n "$SSH_TARGET" ] && [ -n "$REMOTE_DIR" ] \
  || { echo "usage: $0 <brand> <http(s)://address> <ssh-target> <remote-dir>" >&2; exit 2; }
case "$ADDRESS" in http://*|https://*) ;; *) echo "address must start with http:// or https://" >&2; exit 2 ;; esac

ADDRESS=${ADDRESS%/}        # no trailing slash

echo "== building $BRAND for $ADDRESS"
TENANT_DEVELOPER_URL="$ADDRESS" npm run "$BUILD"

echo "== checking $BRAND"
npm run "$CHECK"

echo "== confirming the address was baked in"
grep -q "$ADDRESS" "build/$OUT/sitemap.xml" \
  || { echo "sitemap.xml does not contain $ADDRESS - refusing to publish" >&2; exit 1; }

echo "== publishing to $SSH_TARGET:$REMOTE_DIR"
rsync -az --delete "build/$OUT/" "$SSH_TARGET:$REMOTE_DIR/"

echo "== done $(date -Is)"
```

```bash
chmod +x deploy-host.sh
./deploy-host.sh vendrex http://54.205.5.145 docs-target /var/www/sites/vendrex
```

---

## 10. Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| Home page loads, sub-pages 404 on reload | `try_files` missing | use the `location /` block from [§5](#5-serve-it-with-nginx) exactly |
| Search box returns nothing | `search-index.json` not reachable | `curl -I http://localhost/search-index.json` on the server; it must be 200 |
| Site works but canonical/sitemap show the old address | built for a different address | rebuild per [§8](#8-moving-a-site-to-a-different-address-later) |
| No CSS, no images | served under a subpath, not the root | `baseUrl` is `/`; serve at the address root |
| `403 Forbidden` | permissions | `sudo chown -R root:www-data /var/www/sites/vendrex && sudo chmod -R 755 /var/www/sites/vendrex` |
| Nothing responds from outside, fine on `localhost` | firewall or cloud security group | open inbound TCP 80 (and 443 with TLS) |
| `rsync: command not found` on the target | rsync missing there | `sudo apt install -y rsync`, or use the tarball method in [§4](#4-copy-the-site-to-the-server) |
| `Permission denied (publickey,password)` | wrong hop or no key | confirm the jump host reaches the target: `ssh -J JUMP_USER@JUMP_HOST TARGET_USER@TARGET_HOST` |
| `certbot` refuses the address | certificates are not issued for IPs | host on a domain first, then [§5](#5-serve-it-with-nginx) |
| Vendrex site shows SalesPlay text | wrong folder published | check the `root` path and republish that brand |

**Logs:** `/var/log/nginx/vendrex-docs.error.log` on the target; build output on the build machine.
