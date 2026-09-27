# AGENTS.md

Repository guidance for coding agents that follow the [AGENTS.md](https://agents.md) convention (Codex, Cursor, Aider, Continue, …). Claude Code should read `CLAUDE.md` first — this file exists so non-Claude agents don't lack context.

The two files are kept intentionally close in content but not word-for-word identical. When they overlap, `CLAUDE.md` and `AGENTS.md` are both correct; the deeper reference is `docs/`.

## Project snapshot

- **What:** macOS-style personal portfolio. Every UI "app" (Notes, Terminal, VS Code, Safari, Mail, Music, Photos, Contacts, Achievements, Resume, Calculator, Siri, Finder) is a client component rendered inside a draggable `react-rnd` window.
- **Stack:** Next.js 16 (App Router), React 19, TypeScript 5 (strict), Tailwind CSS v4, framer-motion 12, react-rnd 10, lucide-react.
- **AI:** `@google/genai` (Gemini) powers the Siri app via `src/app/api/siri/route.ts` (needs `GEMINI_API_KEY`).
- **Web proxy:** `src/app/api/proxy/route.ts` uses `puppeteer-core` + `@sparticuz/chromium` to fetch external sites for the Safari app.
- **State:** three React contexts under `src/context/` — `OSContext` (wallpaper), `NotificationContext`, `AchievementsContext`. Per-user state (wallpaper, achievements) persists to `localStorage`.

Fuller detail is in `README.md`, `docs/ARCHITECTURE.md` (window manager / data flow), and `docs/APPS.md` (per-app rundown).

## Directory map

```
src/app/                Next.js App Router pages, layouts, and route handlers
  layout.tsx            RootLayout — wraps children in OSProvider
  page.tsx              Desktop shell + window manager (single 'use client')
  api/siri/route.ts     POST /api/siri  — Gemini chat proxy
  api/proxy/route.ts    GET  /api/proxy — Puppeteer web proxy
src/components/apps/    One file per desktop app (NotesApp, TerminalApp, …)
src/components/layouts/ MenuBarLayout, DockLayout, WindowLayout
src/components/ui/      Reusable UI primitives (icons, buttons, sidebar items)
src/context/            React contexts + hooks
src/data/               Static content used by apps (profile, achievements, …)
src/types/              Shared TypeScript types
public/                 Static assets (icons, wallpapers, skills, resume.pdf)
docs/                   Extra project documentation
```

Path alias: `@/*` → `src/*` (see `tsconfig.json`).

## Setup

```bash
npm install
cp .env.example .env.local   # add GEMINI_API_KEY if you need Siri
npm run dev                  # http://localhost:3000
```

Requires Node 18.18+ (Node 20 LTS recommended).

## Commands

Every command is defined in `package.json`. Don't invent new ones.

| Command             | Purpose                                                             |
| ------------------- | ------------------------------------------------------------------- |
| `npm run dev`       | Next.js dev server                                                  |
| `npm run build`     | Production build                                                    |
| `npm run start`     | Serve the production build                                          |
| `npm run lint`      | ESLint (`eslint-config-next`: core-web-vitals + typescript)         |
| `npm run typecheck` | `tsc --noEmit` (strict mode)                                        |

There is **no test suite**. Do not create one to make a change look validated; report the absence instead.

## Conventions

- **Client vs server:** anything using state / effects / event handlers / `localStorage` / `framer-motion` / `react-rnd` needs `'use client'`. Route handlers in `src/app/api/**` are server-only — keep secrets there.
- **Styling:** Tailwind v4 utilities. Re-use existing macOS design tokens from `src/app/globals.css` (`.glass-panel`, `.glass-dock`, `.window-shadow`, `.icon-text`, `.macos-scrollbar`) rather than duplicating their CSS.
- **Class composition:** `clsx` + `tailwind-merge` (both installed) — mirror how existing components use them.
- **Icons:** `lucide-react`. Match the size/stroke of nearby icons.
- **Data lives in `src/data/`.** New portfolio copy, achievements, contacts, wallpapers, etc., go there — not hard-coded inside components.
- **Path alias:** import from `@/…`. Don't use `../../..`.
- **Comments:** the codebase is largely uncommented. Add a comment only when the *why* is non-obvious.

## Window-manager contract (critical for any app change)

`src/app/page.tsx` owns a `windows` state map keyed by app `id` (`isOpen`, `isMinimized`, `z`). Each app has:

1. An entry in that state map with a unique starting `z`.
2. A matching `<WindowLayout id="<id>" dockId="dock-icon-<id>" …>` in the desktop container.
3. An `AppConfig` entry in `src/data/apps.data.ts` (dock icon).
4. Optional achievement / notification hooks fired via `handleAppOpen`.

Adding an app means all four. Renaming an app breaks all four — plus Siri's system prompt in `src/app/api/siri/route.ts`.

## Environment / secrets

- Only one env var: `GEMINI_API_KEY` (server-side; used by `src/app/api/siri/route.ts`).
- `.env*` is git-ignored; `.env.example` documents variable names with placeholders only.
- Never expose a secret to the client (no `NEXT_PUBLIC_*` for `GEMINI_API_KEY`) and never print secret values in logs, docs, or PR summaries.

## Validation checklist

Before declaring a task done:

1. `npm run lint` — no new warnings/errors introduced.
2. `npm run typecheck` — clean.
3. `npm run build` — succeeds locally (catches route-handler and RSC issues you can't see in dev).
4. If a UI change can't be visually verified in this environment, say so — don't claim it works.
5. `git status` — only the files you intended to change are dirty.

Only claim a command passed if you actually ran it and it exited successfully.

## Safety

- Preserve current visuals, animations, routing, and app behaviour unless the task explicitly asks otherwise.
- Don't add dependencies without a clear reason and approval.
- Don't run destructive git operations (`reset --hard`, `clean -fd`, force push) without checking `git status` first and confirming with the user.
- Don't blanket-delete files that "look unused" — some are wired by string `id` and easy to miss with grep.
- If you spot an unrelated bug or security issue, document it in your task summary; don't silently rewrite half the file.

## Task summary format

End every task with:

1. Files created / modified / intentionally left alone (one line each).
2. Key decisions and any assumptions the user should double-check.
3. Commands you actually ran and their pass/fail outcome.
4. Anything you couldn't validate in this environment and what would be needed to validate it.
