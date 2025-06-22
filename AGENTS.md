# AGENTS.md — Run‑Book for the **Codex** Agent

> **Audience**: autonomous or semi‑autonomous agents (e.g. ChatGPT Codex) tasked with hacking on this repository.
>
> **Goal**: keep CI green, respect project conventions, and ship improvements quickly.

---

## 1  Environment

| Key            | Value                            |
| -------------- | -------------------------------- |
| Node.js        | **20.x** (LTS)                   |
| Package mgr    | **pnpm** (lockfile committed)    |
| Runtime dir    | `/workspace/portfolio`           |
| Default branch | `main`                           |
| Test runner    | Node built‑in `node:test`        |
| Lint           | `pnpm lint` → Next ESLint preset |
| Build          | `pnpm build`                     |
| Dev            | `pnpm dev`                       |

The container has full network access and Linux shell. Use `bash` commands freely (e.g. `ls`, `grep`, `pnpm build`).

---

## 2  Repository Map (high‑level)

```
src/
  app/              ← Next 15 app‑router pages
    blog/
    work/
    books/          ← (created by agent)
    music/          ← (created by agent)
  components/       ← Once‑UI React components & helpers
  resources/
    content.js      ← 🏠 Central profile + copy
    once-ui.config.js
    icons.ts        ← Icon registry (react‑icons)
public/              ← Static assets
```

Tip: use `grep -R "foo" src/` to locate code quickly.

---

## 3  Golden Rules

1. **Pass the trifecta** before every push:
   `pnpm lint && pnpm test && pnpm build`
2. **Small commits**: logical, reversible, CI‑passing.  Commit message style: `type(scope): subject` (e.g. `feat(books): add The Liminal card`).
3. **No new runtime deps** without an explicit instruction. Dev‑deps allowed only if test/lint build fails otherwise.
4. **Respect ESLint/Prettier** — run `pnpm lint --fix` after large edits.
5. **TypeScript strict**: no `any`, no `// @ts-ignore`.
6. **Do not** touch password‑protection logic or licensing headers.

---

## 4  Workflow for Multi‑Step Objectives

```text
for step in 2..8:
    implement step
    run lint/test/build
    git commit -m "<step commit message>"
    if build passes:
        echo "DONE_STEP_<N>"  # signals completion
```

Use separate commits inside a step if helpful, but ensure the *last* commit of that step leaves the repo healthy.

---

## 5  Command Cheat‑Sheet

```bash
pnpm install         # (already done, but use after package.json changes)
pnpm lint            # ESLint
pnpm test            # node:test suite
pnpm build           # production build (Next.js)
git add -A && git commit -m "msg"
git push origin main
```
`pnpm test` compiles TypeScript with `tsc -p tsconfig.test.json` and runs `node --test dist-test`.

---

## 6  Common Pitfalls & Fixes

| Problem                                       | Fix                                                                                      |
| --------------------------------------------- | ---------------------------------------------------------------------------------------- |
| **ESLint error** about `next/core-web-vitals` | Ensure `eslint-config-next` dev‑dep is installed and `pnpm lint` runs from project root. |
| Font / image 404 in `next/og`                 | Use absolute URLs: `src={baseURL + path}`.                                               |
| MDX front‑matter missing keys                 | Run tests (`pnpm test`) and add `title`, `publishedAt`, etc.                             |
| Default import errors in tests                | Compile with `--esModuleInterop` or use `import * as fs from "fs"`.                      |

---

## 7  Style Guidelines

* **React / JSX**: functional components, hooks only, no class components.
* **Once‑UI**: prefer high‑level primitives (`Column`, `Flex`, `Grid`); colors via design tokens.
* **Images**: use Next `<Image />` unless inside `next/og` runtime code.
* **Imports**: absolute (`@/components/…`) thanks to `tsconfig.paths`.
* OG image routes live in `<page>/og/route.tsx` and use `next/og`'s `ImageResponse`.

---

## 8  Manual Checklist Before `DONE_STEP_*`

* [ ] Lint clean
* [ ] Tests green
* [ ] `pnpm build` succeeds (no static GP errors)
* [ ] New pages reachable at correct route
* [ ] Commit(s) pushed to `main`

---

Happy shipping! 🚀
