# **Magic Portfolio by Once UI**

View the [demo here](https://demo.magic-portfolio.com).

![Magic Portfolio](https://demo.magic-portfolio.com/images/og/home.jpg)


# **Getting started**

Magic Portfolio was built with [Once UI](https://once-ui.com) for [Next.js](https://nextjs.org). It requires Node.js v18.17+.

**1. Clone the repository**
```
git clone https://github.com/once-ui-system/magic-portfolio.git
```

**2. Install dependencies**
```
npm install
```

**3. Run dev server**
```
npm run dev
```

**4. Edit config**
```
src/app/resources/config
```

**5. Edit content**
```
src/app/resources/content
```

**6. Create blog posts / projects**
```
Add a new .mdx file to src/app/blog/posts or src/app/work/projects
```

# **Documentation**

Docs available at: [docs.once-ui.com](https://docs.once-ui.com/docs/magic-portfolio/quick-start)

# **Features**

## **Once UI**
- All tokens, components & features of [Once UI](https://once-ui.com)

## **SEO**
- Automatic open-graph and X image generation with next/og
- Automatic schema and metadata generation based on the content file

## **Design**
- Responsive layout optimized for all screen sizes
- Timeless design without heavy animations and motion
- Endless customization options through [data attributes](https://once-ui.com/docs/theming)

## **Content**
- Render sections conditionally based on the content file
- Enable or disable pages for blog, work, gallery and about / CV
- Generate and display social links automatically
- Set up password protection for URLs

## **Localization**
- A localized version of Magic Portfolio is available with the next-intl library
- To use localization, switch to the 'i18n' branch

# **Authors**

Connect with us on Threads or LinkedIn.

Lorant Toth: [Threads](https://www.threads.net/@lorant.one), [LinkedIn](https://www.linkedin.com/in/tothlorant/)  
Zsofia Komaromi: [Threads](https://www.threads.net/@zsofia_kom), [LinkedIn](https://www.linkedin.com/in/zsofiakomaromi/)

Localization added by [François Hernandez](https://github.com/francoishernandez)

# **Get involved**

- Join the [Design Engineers Club on Discord](https://discord.com/invite/5EyAQ4eNdS) and share your portfolio with us!
- Report a [bug](https://github.com/once-ui-system/magic-portfolio/issues/new?labels=bug&template=bug_report.md).

# **License**

Distributed under the CC BY-NC 4.0 License.
- Commercial usage is not allowed.
- Attribution is required.
- You can extend the license to commercial use by purchasing a [Once UI Pro](https://once-ui.com/pricing) license.

See `LICENSE.txt` for more information.

# **Deploy with Vercel**
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fonce-ui-system%2Fmagic-portfolio&project-name=portfolio&repository-name=portfolio&redirect-url=https%3A%2F%2Fgithub.com%2Fonce-ui-system%2Fmagic-portfolio&demo-title=Magic%20Portfolio&demo-description=Showcase%20your%20designers%20or%20developer%20portfolio&demo-url=https%3A%2F%2Fdemo.magic-portfolio.com&demo-image=%2F%2Fraw.githubusercontent.com%2Fonce-ui-system%2Fmagic-portfolio%2Fmain%2Fpublic%2Fimages%2Fog%2Fhome.jpg)

# jakelawrence.io — Production Setup (Quick Guide)

> **Full playbook:** see [docs/infra-playbook.md](docs/infra-playbook.md).

## What’s Running

| Layer          | Tooling                                                       |
| -------------- | ------------------------------------------------------------- |
| **DNS**        | DigitalOcean A/AAAA → droplet                                 |
| **Edge**       | Nginx (HTTPS, `www` → apex, rate‑limit)                       |
| **App**        | Next.js 15 (Node 20) served on **port 3000** via **PM2**      |
| **CI/CD**      | GitHub push → Webhook (port 9001) → `deploy.sh` → PM2 restart |
| **Security**   | Let’s Encrypt, UFW (`22 80 443`), SSH keys                    |
| **Monitoring** | `pm2-logrotate`, `journalctl`                                 |

## 1 ‑ Clone & Build

```bash
cd /var/www/jakelawrence.io
pnpm i --prod          # or npm ci --omit=dev
pnpm build             # Next.js production build
pm2 start "npm start -- -p 3000" --name portfolio
pm2 save               # auto‑restart on reboot
```

## 2 ‑ Nginx ( `/etc/nginx/sites-available/jakelawrence.io` )

```nginx
# … see full file; key upstreams:
location = /deploy  { proxy_pass http://127.0.0.1:9001/hooks/deploy-jake$is_args$args; }
location /         { proxy_pass http://127.0.0.1:3000; }
```

`nginx -t && systemctl reload nginx`

## 3 ‑ Deploy Hook

*Service:* `/etc/systemd/system/webhook.service`

```ini
ExecStart=/usr/bin/webhook -hooks /etc/webhook/hooks.json -port 9001
```

*Hook:* `/etc/webhook/hooks.json`

```json
[{"id":"deploy-jake","execute-command":"/var/www/jakelawrence.io/deploy.sh","command-working-directory":"/var/www/jakelawrence.io","pass-arguments-to-command":[{"source":"payload","name":"secret"}]}]
```

## 4 ‑ `deploy.sh` (Unix LF, +x)

```bash
#!/usr/bin/env bash
set -euo pipefail
cd /var/www/jakelawrence.io
git pull --ff-only origin main
pnpm i --prod
pnpm build
pm2 restart portfolio
```

## 5 ‑ Firewall

```bash
ufw allow 22/tcp 80/tcp 443/tcp
ufw enable
```

## Verify

```bash
# App
curl -I https://jakelawrence.io        # 200/304
# Webhook
curl -I "https://jakelawrence.io/deploy?secret=SUPERSECRET123" # 200
journalctl -u webhook -f --no-pager     # logs
pm2 ls | pm2 logs portfolio             # runtime
```

---

**Need help?** Open an issue or ping Jake 🏗️💻
