# Portfolio — macOS Desktop

A personal portfolio built as an interactive macOS-style desktop. Instead of scrolling a single-page site, visitors open "apps" (Notes, Terminal, VS Code, Safari, Mail, Music, Photos, Contacts, Achievements, Resume, Calculator, Siri, Finder) inside draggable, resizable windows.

Built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, **Tailwind CSS v4**, **framer-motion**, and **react-rnd**. The Siri app is wired to Google's Gemini API; the Safari app uses a Puppeteer-based server-side proxy to render arbitrary URLs inside an iframe.

---

## Features

- macOS-style desktop shell: menu bar, dock, boot screen, notifications, wallpaper switching.
- Draggable / resizable / minimizable / maximizable app windows via `react-rnd`.
- Twelve+ interactive apps under `src/components/apps/`.
- AI-powered Siri app (Google Gemini) that can answer questions and open other apps.
- Safari app that server-proxies real websites (Puppeteer + `@sparticuz/chromium`).
- Achievement / XP system persisted to `localStorage`.
- Resume viewer using `react-pdf` + `pdfjs-dist`.

## Tech stack

| Area              | Choice                                                              |
| ----------------- | ------------------------------------------------------------------- |
| Framework         | Next.js `16.0.10` (App Router, React Server Components off per app) |
| UI runtime        | React `19.2.1` / react-dom `19.2.1`                                 |
| Language          | TypeScript `^5` (strict)                                            |
| Styling           | Tailwind CSS `^4` via `@tailwindcss/postcss`                        |
| Animation         | `framer-motion` `^12`                                               |
| Windowing         | `react-rnd` `^10`                                                   |
| Icons             | `lucide-react` `^0.561`                                             |
| AI                | `@google/genai` (Gemini `gemini-2.5-flash-lite`)                    |
| Web proxy         | `puppeteer` / `puppeteer-core` + `@sparticuz/chromium`              |
| PDF               | `react-pdf` + `pdfjs-dist`                                          |
| Utility           | `clsx`, `tailwind-merge`                                            |
| Lint              | `eslint` `^9` + `eslint-config-next`                                |

## Prerequisites

- **Node.js** ≥ 18.18 (Next.js 16 requires Node 18.18+; Node 20 LTS recommended).
- **npm** (the repo ships `package-lock.json`). `yarn` / `pnpm` / `bun` will also work but haven't been validated here.
- Optional: **Google Chrome / Chromium** installed locally if you want to develop the Safari proxy route (`src/app/api/proxy/route.ts`). Defaults look at `C:\Program Files\Google\Chrome\Application\chrome.exe` on Windows and `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome` on macOS.
- Optional: a **Gemini API key** for the Siri app (`GEMINI_API_KEY`). Without it, `/api/siri` will fail and Siri will fall back to its error message.

## Installation

```bash
git clone <your-fork-url> portfolio
cd portfolio
npm install
```

## Environment variables

Copy `.env.example` to `.env.local` and fill in what you need:

```bash
cp .env.example .env.local
```

| Variable         | Required for                          | Notes                                                                                                    |
| ---------------- | ------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `GEMINI_API_KEY` | `/api/siri` (Siri app AI replies)     | Create one at <https://aistudio.google.com/apikey>. Server-side only — never exposed to the browser.     |

The Puppeteer proxy has no env variables — in dev it launches your local Chrome via a hard-coded path; in production it uses `@sparticuz/chromium` (works on Vercel/AWS Lambda-style environments).

## Scripts

All commands come straight from `package.json`:

```bash
npm run dev        # start Next.js dev server on http://localhost:3000
npm run build      # production build (.next/)
npm run start      # serve the production build
npm run lint       # ESLint (eslint-config-next: core-web-vitals + typescript)
npm run typecheck  # tsc --noEmit  (added for AI-agent validation)
```

There is no configured test suite.

## Repository structure

```
portfolio/
├── public/                    # static assets served at /
│   ├── icons/                 # dock + desktop icons (Finder.png, Safari.png, …)
│   ├── skills/                # tech-stack SVGs used by NotesApp
│   ├── wallpapers/            # 1.jpg…7.jpg desktop wallpapers
│   ├── me.jpg                 # profile photo
│   └── resume.pdf             # PDF loaded by ResumeApp
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── api/
│   │   │   ├── siri/route.ts  # POST — Gemini chat proxy
│   │   │   └── proxy/route.ts # GET  — Puppeteer web proxy for Safari
│   │   ├── globals.css        # Tailwind entry + macOS glass/scrollbar styles
│   │   ├── layout.tsx         # RootLayout, wraps children in <OSProvider>
│   │   └── page.tsx           # 'use client' — Desktop shell + window manager
│   ├── components/
│   │   ├── apps/              # one file per app (NotesApp, TerminalApp, …)
│   │   ├── layouts/           # MenuBarLayout, DockLayout, WindowLayout
│   │   └── ui/                # small building blocks (icons, buttons, sidebar items)
│   ├── context/               # React contexts (OS, Notification, Achievements)
│   ├── data/                  # static content: profile, achievements, contacts, …
│   └── types/                 # shared TypeScript types
├── docs/                      # extra docs (architecture, dev, deployment, AI workflow)
├── .claude/                   # Claude Code project settings
├── AGENTS.md                  # instructions for AGENTS.md-compatible agents
├── CLAUDE.md                  # instructions for Claude Code
├── eslint.config.mjs
├── next.config.ts
├── postcss.config.mjs
├── tsconfig.json              # path alias: "@/*" → "src/*"
├── package.json
└── package-lock.json
```

## Architecture in one paragraph

`src/app/layout.tsx` mounts an `OSProvider` (wallpaper state, persisted to `localStorage`). `src/app/page.tsx` is the entire desktop shell — a single client component wrapped in `NotificationProvider` and `AchievementsProvider` that owns a `windows` state map (`isOpen`, `isMinimized`, `z`) for every app, plus helpers (`openApp`, `closeApp`, `toggleApp`, `bringToFront`). It renders one `<WindowLayout>` per app; each `WindowLayout` is a `react-rnd` window that hosts the corresponding `*App` component. See `docs/ARCHITECTURE.md` for the full picture.

## Adding a new app

1. Create the component under `src/components/apps/MyApp.tsx` (`'use client'` if it uses state, effects, or browser APIs).
2. Add an entry to `src/data/apps.data.ts` (`{ id, name, icon }`) so it appears in the dock — put its icon in `public/icons/`.
3. In `src/app/page.tsx`:
   - Add `myapp: { isOpen: false, isMinimized: false, z: <next> }` to the `windows` state.
   - Import your component and render a `<WindowLayout id="myapp" dockId="dock-icon-myapp" …>` inside the desktop container.
4. If the app needs shared state, add a context under `src/context/` and mount its provider in `src/app/page.tsx` alongside the existing ones.
5. If the app needs server code, add a route under `src/app/api/<name>/route.ts` (Next.js route handler).

## Adding a new section to the Notes app

The Notes app renders the "traditional" portfolio content. Edit `src/data/portfolio.data.ts` and `src/data/notes.data.ts` — don't hard-code copy inside components.

## Wallpapers, icons, assets

Drop new files into `public/wallpapers/`, `public/icons/`, or `public/skills/`. Reference them from data files as `/wallpapers/foo.jpg` (they are served at the site root). To add a wallpaper to the switcher, update `src/data/wallpapers.data.ts`.

## Deployment

Optimised for **Vercel**:

1. Push the repo to GitHub.
2. Import into Vercel, framework auto-detects as Next.js.
3. Add the `GEMINI_API_KEY` environment variable in Vercel → Settings → Environment Variables.
4. Deploy. `@sparticuz/chromium` handles the serverless Chromium binary for the Safari proxy.

`next.config.ts` already declares `serverExternalPackages: ['puppeteer-core', '@sparticuz/chromium']` so those aren't bundled for the browser. See `docs/DEPLOYMENT.md` for other targets.

## Troubleshooting

- **Siri returns "I'm having trouble reaching the cloud."** — `GEMINI_API_KEY` is missing or invalid. Set it in `.env.local` and restart `npm run dev`.
- **Safari app fails locally with "Failed to launch the browser process"** — Chrome isn't at the expected path. Either install Chrome to the default location or edit `localExecutablePath` in `src/app/api/proxy/route.ts` (don't commit machine-specific paths).
- **Windows don't animate / z-index feels wrong** — the window map lives in `src/app/page.tsx`; adding a new app without a `z` entry breaks `bringToFront`. Give every window a unique initial `z`.
- **`localStorage is not defined` in SSR** — every context that reads/writes `localStorage` is marked `'use client'` and guards access inside `useEffect`. Follow that pattern for new state.

## Security

- The Siri route runs on the server; `GEMINI_API_KEY` never reaches the browser. Keep it that way — do **not** rename it to `NEXT_PUBLIC_*`.
- `.env*` is git-ignored. `.env.example` in the repo contains only variable names, no values.
- The Safari `/api/proxy` route accepts an arbitrary URL. It's meant for demo use only. Do not expose this endpoint on high-traffic deployments without adding an allow-list, rate limiting, and outbound-request restrictions.
- Contact details in `src/data/contactDetails.ts` are intentionally public (they're on the deployed portfolio). Treat them as public information.

## License

No license file is included; all rights reserved by the author unless otherwise stated.
