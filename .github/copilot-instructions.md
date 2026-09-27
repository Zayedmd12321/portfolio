# GitHub Copilot Instructions

This is a macOS-desktop-style personal portfolio built with **Next.js 16 (App Router)**, **React 19**, **TypeScript** (strict), **Tailwind CSS v4**, **framer-motion**, and **react-rnd**. Every "app" (Notes, Terminal, VS Code, Safari, Siri, …) is a client component rendered inside a draggable `react-rnd` window managed by `src/app/page.tsx`.

For the full picture, see `AGENTS.md`, `CLAUDE.md`, and `docs/ARCHITECTURE.md`.

## When suggesting code

- Use the `@/…` path alias (mapped to `src/…`). Avoid long relative paths.
- Any component using hooks, event handlers, `localStorage`, `framer-motion`, or `react-rnd` needs `'use client'` at the top of the file.
- Route handlers under `src/app/api/**` are server-only. Never expose `GEMINI_API_KEY` to a client component or a `NEXT_PUBLIC_*` variable.
- Prefer Tailwind utility classes. Re-use existing macOS design tokens from `src/app/globals.css`: `.glass-panel`, `.glass-dock`, `.window-shadow`, `.icon-text`, `.macos-scrollbar`.
- Compose conditional classes with `clsx` + `tailwind-merge` (already installed) — mirror how existing components do it.
- Use `lucide-react` for icons; match the size/stroke of nearby icons.
- Static content (profile, achievements, contacts, notes, wallpapers, terminal commands) lives in `src/data/*.ts` — put new copy there, not inline in components.

## When adding an app

An app touches four places (miss one and it silently breaks):

1. `src/components/apps/MyApp.tsx` — the component.
2. `src/data/apps.data.ts` — dock entry (+ icon in `public/icons/`).
3. `src/app/page.tsx` — extend the `windows` state map with a unique starting `z` and render a `<WindowLayout id="myapp" dockId="dock-icon-myapp" …>`.
4. Optional: achievement/notification hooks in `handleAppOpen`; Siri intents in `src/app/api/siri/route.ts`.

## Commands

Only suggest scripts that exist in `package.json`:

- `npm run dev`, `npm run build`, `npm run start`, `npm run lint`, `npm run typecheck`.

There is no test suite. Don't scaffold one unless asked.

## Don't

- Don't rename existing app ids (`finder`, `terminal`, `vscode`, `safari`, `calculator`, `siri`, `photos`, `contacts`, `notes`, `bin`, `resume`, `music`, `mail`, `achievements`) — they're referenced by string in several places.
- Don't add state-management libraries; React contexts under `src/context/` are sufficient.
- Don't replace `react-rnd` or `framer-motion`.
- Don't print, log, or commit secrets.
