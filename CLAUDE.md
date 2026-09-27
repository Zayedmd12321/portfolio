# CLAUDE.md

Persistent instructions for **Claude Code** working on this repository.
Human-facing docs live in `README.md` and `docs/`. This file is short on purpose — read it first, then load whichever docs the task needs.

## What this project is

A macOS-desktop-style personal portfolio built on **Next.js 16 (App Router)** + **React 19** + **TypeScript** + **Tailwind CSS v4**. Every "app" in the desktop (Notes, Terminal, VS Code, Safari, Mail, Siri, …) is a client component rendered inside a `react-rnd` window. `src/app/page.tsx` is the single window manager. See `docs/ARCHITECTURE.md` for the full picture.

Two server routes:
- `src/app/api/siri/route.ts` — Gemini chat (needs `GEMINI_API_KEY`).
- `src/app/api/proxy/route.ts` — Puppeteer-driven web proxy for the Safari app.

## Before you edit

1. **Read the relevant file(s) first.** Do not modify a component based on its name — open it and confirm the pattern before changing it.
2. **Check for existing utilities.** Look in `src/components/ui/`, `src/context/`, and `src/data/` before adding new ones. Re-use `clsx` + `tailwind-merge` (already installed) for class composition.
3. **Understand the window-manager contract in `src/app/page.tsx`** if you're touching any app: every window has a unique `id` in the `windows` state map and a matching `<WindowLayout>` entry. Adding an app means updating both.
4. If a task is ambiguous, ask before making destructive or architecture-level changes.

## Coding conventions

- **Path alias:** import from `@/…` (mapped to `src/…`). Don't use long relative paths.
- **Client vs server:** any component that uses `useState`, `useEffect`, event handlers, `localStorage`, `framer-motion`, or `react-rnd` must start with `'use client'`. Route handlers under `src/app/api/**` are server-only — never expose secrets to a client component.
- **Styling:** Tailwind v4, imported via `@import "tailwindcss"` in `src/app/globals.css`. Prefer utility classes. Re-use existing macOS design tokens: `.glass-panel`, `.glass-dock`, `.window-shadow`, `.icon-text`, `.macos-scrollbar`.
- **Icons:** `lucide-react`. Match the size/stroke of nearby icons rather than picking new defaults.
- **Animations:** `framer-motion`. Match durations and easings used in neighbouring components to keep the OS feel consistent.
- **Data:** static content (profile, achievements, contacts, notes, wallpapers, terminal commands, …) lives in `src/data/*.ts` and is imported by components. Add new copy there, not inline.
- **Types:** shared types under `src/types/`. Component-local types can stay in the component file.
- **Comments:** the codebase is largely un-commented. Only add a comment when the *why* is non-obvious. Never leave "TODO from Claude" markers.

## Component / app rules

- **Don't rename or remove existing apps.** They're wired by string `id` in several places (`page.tsx`, `apps.data.ts`, dock, Siri's system prompt, achievements triggers).
- **New apps** follow the recipe in `README.md` → "Adding a new app".
- **Windows are positioned relative to a dock icon** (`dockId="dock-icon-<id>"`); keep this pattern so the open/close animation still works.
- **Persist per-user state to `localStorage`** through a context (see `OSContext`, `AchievementsContext`). Guard every access with `typeof window !== 'undefined'` or inside `useEffect`.

## Environment / secrets

- Only one env var: `GEMINI_API_KEY` (server-side, `.env.local`, never `NEXT_PUBLIC_*`).
- `.env*` is git-ignored. `.env.example` documents variable names only.
- Never print, log, or commit secret values. If you need to reference the key in docs, refer to it by name.
- Contact info in `src/data/contactDetails.ts` is intentionally public.

## Validation

Run these before claiming a task is done — and **only** claim they passed if you actually ran them:

```bash
npm run lint       # ESLint
npm run typecheck  # tsc --noEmit
npm run build      # full production build (catches most integration issues)
```

There is no test suite. Do not fabricate one to "prove" a change works. If a UI change can't be validated without a browser, say so plainly.

## Guardrails

Do:
- Make the **smallest reasonable change** that fully solves the task.
- Re-use existing components, tokens, and data files.
- Update `README.md` / `docs/` when structure, scripts, env vars, or architecture materially change.
- End every task with a short summary: files touched, key decisions, validation commands you actually ran and their results, anything you couldn't verify.

Do not:
- Rebuild, redesign, or re-theme the portfolio.
- Swap frameworks, package managers, styling systems, or the window library.
- Add dependencies without an explicit reason and user approval.
- Invent scripts, env variables, file paths, or APIs that aren't already in the repo.
- Overwrite uncommitted user work. Run `git status` before any destructive git operation and stash first.
- Claim `lint`, `typecheck`, `build`, or tests passed unless you actually ran them.
- Expose secrets or personal env values in code, docs, or terminal output.
- Silently make large refactors when you spot unrelated bugs — document them instead.

## When docs conflict with code

Code is the source of truth. If `CLAUDE.md`, `README.md`, or `docs/*` disagrees with what the source actually does, update the docs (or flag the drift) rather than reshaping the code to match stale documentation.

## Where to go next

- `docs/ARCHITECTURE.md` — window manager, contexts, data flow.
- `docs/APPS.md` — per-app rundown (what each Notes/Terminal/Safari/… window shows and how it works).
- `docs/DEVELOPMENT.md` — local setup and workflow.
- `docs/DEPLOYMENT.md` — Vercel + Puppeteer notes.
- `docs/AI_WORKFLOW.md` — inspection / validation checklist tailored to this repo.
- `AGENTS.md` — the same guidance in AGENTS.md format for non-Claude agents.
