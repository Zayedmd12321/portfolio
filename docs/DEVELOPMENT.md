# Development

## Prerequisites

- Node.js **≥ 18.18** (Node 20 LTS recommended).
- npm (the repo uses `package-lock.json`).
- Optional: Google Chrome installed at the default path for your OS — needed only if you're working on the Safari `/api/proxy` route.
- Optional: a Gemini API key for the Siri app.

## First-time setup

```bash
npm install
cp .env.example .env.local   # then edit .env.local
npm run dev
```

Open <http://localhost:3000>. The dev server hot-reloads on save.

## Environment variables

| Name             | Where it's used                       | Notes                                                      |
| ---------------- | ------------------------------------- | ---------------------------------------------------------- |
| `GEMINI_API_KEY` | `src/app/api/siri/route.ts` (server)  | Without it the Siri app returns an error message.          |

Rules:

- Put values in `.env.local` — it is git-ignored (`.env*` pattern in `.gitignore`).
- Do **not** prefix with `NEXT_PUBLIC_` — it must stay server-side.
- `.env.example` should always mirror the set of variables you actually use, with placeholders only.

## Scripts

```bash
npm run dev        # dev server
npm run build      # production build
npm run start      # serve the production build
npm run lint       # ESLint (eslint-config-next: core-web-vitals + typescript)
npm run typecheck  # tsc --noEmit  (strict TS check)
```

There is no test suite. Do not add one just to make a PR look validated — get alignment on scope first.

## Everyday workflow

1. Pull `main`, run `npm install` if `package.json` or `package-lock.json` changed.
2. Create a topic branch.
3. Make changes — small, focused commits. Follow the existing commit-message style (`git log --oneline` shows things like `Add: …`, `Fix: …`, `Removed …`).
4. Before pushing:
   - `npm run lint`
   - `npm run typecheck`
   - `npm run build`
   - Manual smoke-test in the browser (open a few apps, drag/resize a window, refresh — nothing should throw).
5. Push and open a PR.

## Editing conventions (quick reference)

- Client vs server: any component that uses hooks, event handlers, `localStorage`, `framer-motion`, or `react-rnd` needs `'use client'` at the top. Route handlers in `src/app/api/**` are server-only.
- Path alias: import from `@/…` (mapped to `src/…`).
- Reuse the macOS design tokens (`.glass-panel`, `.glass-dock`, `.window-shadow`, `.icon-text`, `.macos-scrollbar`) instead of writing new backdrop-blur CSS.
- Reuse `clsx` + `tailwind-merge` for conditional classes; both are already installed.
- Icons: `lucide-react`. Match the size/stroke of nearby icons.
- Copy and content go in `src/data/*.ts`, not inline in components.
- New shared types go in `src/types/`; component-local types can stay in the component.

## Adding a new app

See `README.md` → "Adding a new app" for the checklist. The important thing to remember is that a new app touches four places:

1. Component (`src/components/apps/`).
2. Dock config (`src/data/apps.data.ts` + icon in `public/icons/`).
3. Window manager (`src/app/page.tsx`).
4. Optional: achievement / Siri intent hooks.

## Adding a new context

- Create it under `src/context/`.
- Export a `Provider` component and a `useX()` hook that throws when used outside the provider.
- Mount the provider inside `DesktopContent` in `src/app/page.tsx` (or higher if truly global).
- Guard every `localStorage` access with `typeof window !== 'undefined'` or inside `useEffect`.

## Working on the Puppeteer proxy

`src/app/api/proxy/route.ts` launches Chromium.

- **Dev (local):** it looks for Chrome at
  - Windows: `C:\Program Files\Google\Chrome\Application\chrome.exe`
  - macOS:   `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`
  If your Chrome is elsewhere, edit `localExecutablePath` locally — do not commit machine-specific paths.
- **Production:** it uses `@sparticuz/chromium.executablePath()`, which packages a serverless-friendly Chromium binary.

The route deliberately takes ~6 s (initial load + scroll + settle). Don't remove those waits without understanding why they're there (skeleton loaders, hydration, lazy content).

## Debugging tips

- **`useX must be used within an XProvider`** — you rendered a hook consumer outside its provider. Providers live in `page.tsx`; check the tree.
- **A window appears but won't come to front** — every app id in the `windows` map needs a unique starting `z`. Duplicate `z` breaks `bringToFront`'s `Math.max(...)`.
- **`localStorage is not defined`** — some code ran during SSR. Wrap in `useEffect` or guard with `typeof window !== 'undefined'`.
- **Tailwind class not applying** — Tailwind v4 uses `@tailwindcss/postcss`, not `tailwind.config.js`. There is no config file; utilities are discovered from source. Make sure your file is inside `src/`.

## What to avoid

- Bulk formatter runs on unrelated files.
- Dependency upgrades unrelated to the task.
- Introducing state-management libraries (Zustand, Redux, …). React contexts + local state have been sufficient so far.
- Replacing `react-rnd` or `framer-motion` — every window depends on both.
