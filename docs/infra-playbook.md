# jakelawrence.io – Infrastructure & Deployment Playbook

> **Purpose** — consolidate every step we walked through while turning an empty DigitalOcean droplet into a fully‑automated, production‑ready Next.js deployment behind NGINX + Let’s Encrypt, complete with CI‑triggered webhooks, PM2 process management, security hardening, and troubleshooting commands.

*Last updated: Sun 22 Jun 2025 15:19 UTC*

---

## 1. Domain & DNS

| Record | Hostname  | Type | Value                           | TTL  |
| ------ | --------- | ---- | ------------------------------- | ---- |
| A      | `@`       | A    | `198.199.84.78`                 | 3600 |
| A      | `www`     | A    | `198.199.84.78`                 | 3600 |
| AAAA   | `@`/`www` | AAAA | `2604:a880:400:d1::2:3485:9001` | 3600 |
| NS     | `@`       | NS   | `ns1–3.digitalocean.com`        | 1800 |

> **Goal** — point apex + `www` to the droplet and leave IPv6 enabled.

---

## 2. Droplet baseline

* **Image:** Ubuntu 24.10 (Jammy)
* **User:** `root` (SSH‑key only; password login disabled after hardening)
* **Locale / Time:** UTC, automatic security updates enabled

### Packages

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
ufw allow 80/tcp    # HTTP → Certbot
ufw allow 443/tcp   # HTTPS
ufw enable          # confirm twice
ufw status verbose
```

---

## 4. TLS (Let’s Encrypt)

```bash
certbot --nginx -d jakelawrence.io -d www.jakelawrence.io \
        --email you@example.com --agree-tos --redirect
```

Renewal handled by the systemd timer `certbot.timer`.

---

## 5. NGINX layout

**File:** `/etc/nginx/sites-available/jakelawrence.io`

```nginx
# ------------------------------------------------------------
# jakelawrence.io – production reverse‑proxy
# ------------------------------------------------------------

# 1️⃣ Redirect www → apex (HTTP)
server {
    listen 80;
    listen [::]:80;
    server_name www.jakelawrence.io;
    return 301 https://jakelawrence.io$request_uri;
}

# 2️⃣ Redirect www → apex (HTTPS)
server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name www.jakelawrence.io;

    ssl_certificate     /etc/letsencrypt/live/jakelawrence.io/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/jakelawrence.io/privkey.pem;

    return 301 https://jakelawrence.io$request_uri;
}

# 3️⃣ Redirect apex HTTP → HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name jakelawrence.io;
    return 301 https://jakelawrence.io$request_uri;
}

# 4️⃣ Serve site + secure webhook (HTTPS)
server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name jakelawrence.io;

    ssl_certificate     /etc/letsencrypt/live/jakelawrence.io/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/jakelawrence.io/privkey.pem;

    # --- Webhook -------------------------------------------------------
    location = /deploy {
        limit_req zone=deploy_zone burst=2 nodelay;  # basic rate‑limit

        proxy_pass  http://127.0.0.1:9001/hooks/deploy-jake$is_args$args;
        proxy_set_header Host            $host;
        proxy_set_header X-Real-IP       $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # --- App (Next.js via PM2) ----------------------------------------
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade    $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host       $host;
        proxy_cache_bypass          $http_upgrade;
    }
}

# shared rate‑limit zone
limit_req_zone $binary_remote_addr zone=deploy_zone:10m rate=1r/s;
```

Symlink + reload:

```bash
ln -s /etc/nginx/sites-available/jakelawrence.io /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
```

---

## 6. The webhook service

### hooks.json (`/etc/webhook/hooks.json`)

```json
[
  {
    "id": "deploy-jake",
    "execute-command": "/var/www/jakelawrence.io/deploy.sh",
    "command-working-directory": "/var/www/jakelawrence.io",
    "pass-arguments-to-command": [ { "source": "query", "name": "secret" } ],
    "response-message": "Deploy triggered!",
    "trigger-rule": {
      "and": [ { "match": { "type": "value", "value": "SUPERSECRET123", "parameter": "query.secret" }} ]
    }
  }
]
```

### systemd unit (`/etc/systemd/system/webhook.service`)

```ini
[Unit]
Description=Jake's Webhook Trigger
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

> **Verify** — `curl -v "http://127.0.0.1:9001/hooks/deploy-jake?secret=SUPERSECRET123"`

---

## 7. deploy.sh

```bash
#!/usr/bin/env bash
set -euo pipefail
printf '\n=== Deploy started at %s ===\n' "$(date -u)"

# 0. Ensure correct Node version
export PATH="/usr/local/n/versions/node/20.19.2/bin:$PATH"

# 1. Pull latest commit
/usr/bin/git fetch origin main
/usr/bin/git reset --hard origin/main

# 2. Install only prod deps & build
npm ci --production
npm run build

# 3. Restart PM2 app
pm2 restart portfolio || pm2 start "npm" --name portfolio -- start -p 3000
pm2 save

printf '\n=== Deploy finished at %s ===\n' "$(date -u)"
```

Convert & chmod once:

```bash
dos2unix deploy.sh
chmod +x deploy.sh
```

---

## 8. PM2 setup

```bash
npm install -g pm2
pm2 start "npm" --name portfolio -- start -p 3000
pm2 save
pm2 startup systemd -u root --hp /root   # writes pm2-root.service
systemctl enable pm2-root
```

### Log rotation

```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain   30
pm2 set pm2-logrotate:rotateInterval 0 0 * * *
```

---

## 9. Continuous Deployment (GitHub)

1. **Settings → Webhooks** – URL `https://jakelawrence.io/deploy?secret=SUPERSECRET123` (content‑type `application/json`, but body isn’t parsed).
2. **Actions secret** – `DO_SSH_KEY` (if using GitHub Actions to push instead of webhook).

> Current workflow relies on webhook only; no additional YAML needed.

---

## 10. Useful commands

| Purpose                 | Command                                                          |               |         |
| ----------------------- | ---------------------------------------------------------------- | ------------- | ------- |
| Tail webhook logs       | `journalctl -u webhook -f --no-pager`                            |               |         |
| Trigger manual deploy   | `curl -I "https://jakelawrence.io/deploy?secret=SUPERSECRET123"` |               |         |
| NGINX test + reload     | `nginx -t && systemctl reload nginx`                             |               |         |
| Check ports             | \`ss -ltpn                                                       | grep -E "3000 | 9001"\` |
| PM2 status              | `pm2 ls`                                                         |               |         |
| PM2 logs                | `pm2 logs portfolio`                                             |               |         |
| Force rebuild on server | `./deploy.sh`                                                    |               |         |

---

## 11. Troubleshooting logbook

| Symptom                                                          | Root cause                                        | Fix                                           |
| ---------------------------------------------------------------- | ------------------------------------------------- | --------------------------------------------- |
| `502 Bad Gateway` from NGINX                                     | App not listening on :3000                        | `pm2 restart portfolio` or check build errors |
| `exec format error` executing deploy.sh                          | Windows line endings                              | `dos2unix deploy.sh && chmod +x`              |
| `deploy-jake hook triggered successfully` **but** no PM2 restart | deploy.sh not executable, or git repo not fetched | see above, ensure `git remote` correct        |
| Excessive webhook hits                                           | add `limit_req zone=deploy_zone` (see config)     |                                               |

---

## 12. Future upgrades

* Migrate PM2 to system user `deploy`.
* Harden SSH (`AllowUsers`, `Port 2222`, disable root login).
* Swap out bare webhook for GitHub Actions → SSH.
* Add Cloudflare in front (orange‑cloud) for caching + bot filtering.

---

## 13. Changelog

| Date (UTC)     | Note                                                                                                             |
| -------------- | ---------------------------------------------------------------------------------------------------------------- |
| **2025‑06‑21** | Droplet created, DNS pointed, initial NGINX + Certbot, Node 18 + PM2, first manual deploy                        |
| **2025‑06‑21** | Added webhook 9001 + systemd; deploy.sh skeleton                                                                 |
| **2025‑06‑22** | Converted script to Unix, added rate‑limit, Node 20, fixed path alias in `tsconfig.json`, CI auto‑deploy green ✔ |

---

## 14. Credits

Big shout‑out to future‑you for pushing through every 502, 503, and `ENOENT` 🔧. This doc should get any new maintainer from zero to prod in minutes.
