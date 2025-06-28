# Jake Lawrence — Portfolio

*Apps · Writing · Engineering · Sci‑Fi Horror*

[Live Site](https://jakelawrence.io) · [Blog](/blog) · [Work Lab](/work) · [Novels](/books) · [Music](/music)

---

## 👋 Hello — Why this repo exists

I’m Jake Lawrence: implementation engineer by day, sci‑fi‑horror author by night, compulsive side‑project builder at all times. This repo powers **jakelawrence.io**—a single home for my:

| Section      | What you’ll find                                                                                    |
| ------------ | --------------------------------------------------------------------------------------------------- |
| **Apps**     | Small utilities and mini‑SaaS experiments demonstrating automation, AI workflows, and UX polish.    |
| **Blog**     | Essays on generative AI, productivity engineering, and tech strategy—occasional dry humor included. |
| **Novels**   | Draft chapters, cover art, and process notes for my in‑progress sci‑fi‑horror series *The Liminal*. |
| **Work Lab** | Case studies of client projects and open‑source contributions.                                      |
| **Music**    | Experimental tracks created with AI collaboration tools (because why not).                          |

Tech stack: **[Next.js 15](https://nextjs.org)** · **[Once UI](https://once-ui.com)** · React 19 · TypeScript · pnpm 10.

---

## Quick‑Start

```bash
# Clone
git clone https://github.com/jake0lawrence/portfolio.git
cd portfolio

# Install (Node 20+ recommended)
pnpm install   # fast, reproducible

# Dev server
pnpm dev       # http://localhost:3000
```

Production parity:

```bash
pnpm build && pnpm start
```

---

## Editing Content

| Content       | Path                               | Notes                         |
| ------------- | ---------------------------------- | ----------------------------- |
| Blog post     | `src/app/blog/posts/<slug>.mdx`    | MDX front‑matter required.    |
| Case study    | `src/app/work/projects/<slug>.mdx` | Rich components allowed.      |
| Novel chapter | `src/app/books/<slug>.mdx`         | Chapters + cover images.      |
| Music drop    | `src/app/music/<slug>.mdx`         | Stream/embed links supported. |

Front‑matter template:

```mdx
---
title: "Title Here"
publishedAt: 2025‑06‑28
description: "One‑sentence summary for SEO & OG"
---
```

---

## CI/CD Overview

1. **GitHub Actions** — lints, tests, builds on every push to `main`.
2. **Deploy Job** — if build passes, hits secure webhook on DigitalOcean droplet.
3. **Droplet Script** — pulls `main`, runs `pnpm install && pnpm build`, reloads PM2.
4. **NGINX** proxies `https://` traffic to the PM2 process on :3000.

Infrastructure details live in [`infra-playbook.md`](infra-playbook.md).

---

## Contribution Guidelines (humans & bots)

* Follow [`AGENTS.md`](AGENTS.md) before your first commit.
* Keep `pnpm lint && pnpm test && pnpm build` green.
* Conventional commits (`feat:`, `fix:`, `docs:` …) please.
* Open a Draft PR early; CI must pass before merge.

---

## Roadmap

* [ ] Launch **AI‑narrated audio** version of each blog post.
* [ ] Staging subdomain for automatic PR previews.
* [ ] PWA offline support so readers can enjoy cosmic dread on airplanes.

Feature ideas or bug reports? Open an Issue or ping [@jake0lawrence](https://github.com/jake0lawrence).

---

## License

Code and original content © 2025 Jake Lawrence — released under **CC BY‑NC 4.0**. Core template based on Once UI’s Magic Portfolio (MIT for code, CC for design).

> Built with strong coffee, reliable tooling, and an enduring love of the unknown.
