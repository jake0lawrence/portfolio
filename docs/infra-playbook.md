# jakelawrence.io – Infrastructure & Deployment Playbook

> **Purpose** — one stop for everything needed to build, deploy, debug and rebuild the production droplet that powers [https://jakelawrence.io](https://jakelawrence.io).  Covers DNS → NGINX → Let’s Encrypt → Webhook → PM2 → Next.js build, plus common errors & fixes.
>
> *Last updated: **Mon 23 Jun 2025 00:15 UTC***

---

## 1. Domain & DNS

| Record | Hostname  | Type | Value                           | TTL  |
| ------ | --------- | ---- | ------------------------------- | ---- |
| A      | `@`       | A    | `198.199.84.78`                 | 3600 |
| A      | `www`     | A    | `198.199.84.78`                 | 3600 |
| AAAA   | `@`/`www` | AAAA | `2604:a880:400:d1::2:3485:9001` | 3600 |
| NS     | `@`       | NS   | `ns1–3.digitalocean.com`        | 1800 |

> **Goal** — apex + www point to droplet (IPv6 kept).  Cloudflare can be dropped in front later.

---

## 2. Droplet baseline

* **Image:** Ubuntu 24.10 (Jammy)
* **User:** `root` (SSH key‑only; password login disabled)
* **Timezone:** UTC
* Automatic security updates: **enabled**

```bash
apt update && apt upgrade -y
apt install nginx certbot python3-certbot-nginx git curl ufw dos2unix build-essential -y
```

---

## 3. Firewall (UFW)

```bash
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP (Let’s Encrypt challenge)
ufw allow 443/tcp   # HTTPS
ufw enable          # confirm twice
ufw status verbose
```

---

## 4. TLS (Let’s Encrypt)

```bash
certbot --nginx -d jakelawrence.io -d www.jakelawrence.io \
        --email you@example.com --agree-tos --redirect
```

Renewal handled by the systemd timer `certbot.timer` (ships with certbot‑snap).

---

## 5. NGINX reverse‑proxy

`/etc/nginx/sites-available/jakelawrence.io` → symlink into `sites-enabled/`.

```nginx
# ------------------------------------------------------------
# jakelawrence.io – production reverse‑proxy + webhook tunnel
# ------------------------------------------------------------
# 1) www ➜ apex redirect (HTTP)
server {
    listen 80;
    listen [::]:80;
    server_name www.jakelawrence.io;
    return 301 https://jakelawrence.io$request_uri;
}
# 2) www ➜ apex redirect (HTTPS)
server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name www.jakelawrence.io;
    ssl_certificate     /etc/letsencrypt/live/jakelawrence.io/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/jakelawrence.io/privkey.pem;
    return 301 https://jakelawrence.io$request_uri;
}
# 3) HTTP ➜ HTTPS for apex
server {
    listen 80;
    listen [::]:80;
    server_name jakelawrence.io;
    return 301 https://$host$request_uri;
}
# 4) Main HTTPS server
server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name jakelawrence.io;

    ssl_certificate     /etc/letsencrypt/live/jakelawrence.io/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/jakelawrence.io/privkey.pem;

    # --- GitHub webhook ------------------------------------------------
    location = /deploy {
        limit_req zone=deploy_zone burst=2 nodelay;  # 1 req/s basic flood guard
        proxy_pass http://127.0.0.1:9001/hooks/deploy-jake$is_args$args;
        proxy_set_header Host            $host;
        proxy_set_header X-Real-IP       $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # --- Next.js app via PM2 ------------------------------------------
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade    $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host       $host;
        proxy_cache_bypass          $http_upgrade;
    }
}

# shared rate‑limit zone (1 req/sec per IP for webhook)
limit_req_zone $binary_remote_addr zone=deploy_zone:10m rate=1r/s;
```

```bash
ln -s /etc/nginx/sites-available/jakelawrence.io /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
```

---

## 6. Webhook service

### `/etc/webhook/hooks.json`

```json
[
  {
    "id": "deploy-jake",
    "execute-command": "/opt/deploy/portfolio.sh",
    "command-working-directory": "/var/www/jakelawrence.io",
    "response-message": "🚀 Deploy triggered!",
    "trigger-rule": {
      "match": {
        "type": "value",
        "parameter": { "source": "url", "name": "secret" },
        "value": "SUPERSECRET123"
      }
    }
  }
]
```

### `/etc/systemd/system/webhook.service`

```ini
[Unit]
Description=Jake's GitHub webhook trigger
After=network.target

[Service]
ExecStart=/usr/bin/webhook -hooks /etc/webhook/hooks.json -port 9001 -verbose
Restart=on-failure
User=root

[Install]
WantedBy=multi-user.target
```

```bash
systemctl daemon-reload
systemctl enable --now webhook
```

> **Test** — `curl -I "http://127.0.0.1:9001/hooks/deploy-jake?secret=SUPERSECRET123"`

---

## 7. Deploy script ( `/opt/deploy/portfolio.sh` )

```bash
#!/usr/bin/env bash
set -euxo pipefail

# Log everything to /var/log for debugging
exec > >(tee -a /var/log/portfolio-deploy.log) 2>&1

REPO_DIR=/var/www/jakelawrence.io
PNPM=/usr/local/bin/pnpm

echo "🚀  Deploy started at $(date -u)"
echo "Working directory: $REPO_DIR"
node --version
"$PNPM" --version
pm2 list

# 1) Sync code, keep previous build until new one succeeds
git -C "$REPO_DIR" fetch --all
git -C "$REPO_DIR" reset --hard origin/main
git -C "$REPO_DIR" clean -fd -e .next

# 2) Install deps
cd "$REPO_DIR"
"$PNPM" install --silent

# 3) Atomic build into .next-temp
BUILD_DIR=.next-temp
rm -rf "$BUILD_DIR"
NEXT_BUILD_DIR="$BUILD_DIR" "$PNPM" build

# 4) Replace build if successful
if [ -d "$BUILD_DIR" ]; then
  rm -rf .next.bak
  mv .next .next.bak || true
  mv "$BUILD_DIR" .next
  rm -rf .next.bak
fi

# 5) Reload or start PM2
if pm2 describe portfolio >/dev/null 2>&1; then
  pm2 reload portfolio --update-env
else
  pm2 start "$PNPM" --name portfolio --cwd "$REPO_DIR" -- start
fi

pm2 save

echo "✅  Deploy finished at $(date -u)"
```

```bash
dos2unix /opt/deploy/portfolio.sh
chmod 755  /opt/deploy/portfolio.sh
```

---

## 8. PM2 baseline

```bash
npm install -g pm2
pm2 start "/usr/local/bin/pnpm" --name portfolio --cwd /var/www/jakelawrence.io -- start
pm2 save
pm2 startup systemd -u root --hp /root   # prints a command → run it once
```

Log rotation already provided by `pm2-logrotate` (installed automatically).

---

## 9. CI / deploy workflow (day‑to‑day)

```text
1. Commit & push → origin/main
2. GitHub Action connects via SSH and runs `/opt/deploy/portfolio.sh`
3. journalctl -fu webhook   # optional tail (manual webhook still works)
```

Typical deploy time: **\~50 s** (install ≈ 20 s, build ≈ 25 s, reload < 1 s).

---

## 10. Troubleshooting cheatsheet

| Symptom / Log Snippet                                    | Root cause / Fix                                                |
| -------------------------------------------------------- | --------------------------------------------------------------- |
| `ENOENT … .next/server/pages-manifest.json` during build | `.next/` removed → ensure `git clean -e .next` exclusion        |
| `pnpm … exit status 1` via webhook but OK manually       | `--frozen-lockfile` mismatch → drop flag or commit new lockfile |
| Webhook returns 502                                      | PM2 app down → `pm2 restart portfolio`, check build errors      |
| `permission denied` executing script                     | `chmod 755 /opt/deploy/portfolio.sh`                            |
| CI push, but droplet repo fails to pull (local changes)  | `git reset --hard` inside deploy handles this now               |

---

## 11. Future improvements

* Move runtime to unprivileged `deploy` user instead of `root`.
* Put Cloudflare in front for DDoS & caching.
* Public webhook replaced by GitHub Action that runs the deploy script over SSH.
* Migrate to Docker (next‑on‑pages, Caddy, etc.) if containerisation is needed.

---

## 12. Changelog

| Date (UTC)     | Note                                                                                                           |
| -------------- | -------------------------------------------------------------------------------------------------------------- |
| **2025‑06‑23** | Refactored deploy: moved script to `/opt/deploy`, switched to pnpm, added `.next` keep‑alive, auto PM2 reload. |
| **2025‑06‑22** | Initial production launch, webhook + NGINX TLS, Node 20, PM2 logrotate.                                        |
| **2025‑06‑21** | Droplet created, DNS & firewall, first manual Next.js build.                                                   |

---

Happy shipping!  Manual redeploys are still possible:

```bash
curl -s "https://jakelawrence.io/deploy?secret=SUPERSECRET123"
```
