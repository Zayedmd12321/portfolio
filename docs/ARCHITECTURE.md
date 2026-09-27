# Architecture

Deeper reference for how the portfolio is wired together. Skim `README.md` first for the high-level pitch. For a per-app rundown (what each Notes/Terminal/Safari/… window shows and how it works), see `docs/APPS.md`.

## Big picture

The site is a single-page interactive shell that imitates a macOS desktop. There is one Next.js route (`/`) plus two API routes. Everything the visitor sees is composed by `src/app/page.tsx`.

```
┌──────────────────────────────────────────────────────────┐
│  RootLayout (src/app/layout.tsx)                         │
│  └── OSProvider (wallpaper, persisted to localStorage)   │
│      └── page.tsx  'use client'  (Desktop)               │
│          ├── NotificationProvider                        │
│          └── AchievementsProvider                        │
│              └── DesktopContent                          │
│                  ├── BootScreen (initial)                │
│                  ├── MenuBarLayout (top)                 │
│                  ├── <background wallpaper>              │
│                  ├── DesktopIcon(s)                      │
│                  ├── Notification (toast)                │
│                  ├── WindowLayout × N  (react-rnd)       │
│                  │   └── <AppComponent />                │
│                  └── DockLayout (bottom)                 │
└──────────────────────────────────────────────────────────┘
```

## The window manager

`src/app/page.tsx` (`DesktopContent`) owns:

- `windows`: an object keyed by app id, each entry `{ isOpen, isMinimized, z }`.
- `bringToFront(id)`, `openApp(id)`, `closeApp(id)`, `toggleApp(id)`.
- Boot sequence state: `showBootScreen`, `terminalBootMode`.
- `desktop` — measurement of the actual window-container div (via `useDesktopSize(ref)`), used to derive per-window `winSize` presets that adapt to viewport, browser zoom, and root font-size changes.

Each window is rendered by `<WindowLayout>` (`src/components/layouts/WindowLayout.tsx`) which wraps its children in a `react-rnd` frame with:

- Traffic-light controls (close, minimize, maximize) styled via `framer-motion`.
- `dockId` prop → animates open/minimize/close toward the corresponding dock icon.
- `sidebar` prop → renders the macOS-style sidebar split.
- `minWidth` / `minHeight` for resize floors (auto-lowered when the desktop can't supply them).

### Responsive sizing

- `src/hooks/useDesktopSize.ts` exposes `useDesktopSize(ref)` plus `computeInitialRect` / `clampRect` helpers. It measures the container div with a `ResizeObserver` and listens to viewport resize, so all math tracks the true desktop area (viewport minus the MenuBar).
- `src/context/DesktopSizeContext.tsx` shares that measurement with every `WindowLayout` via `DesktopSizeProvider value={desktop}`. `page.tsx` mounts the provider inside its window container so children see the same numbers.
- `WindowLayout` re-centres each window when the viewport changes until the user drags/resizes it. After that it only clamps position and size back into the visible area — user layouts are preserved across browser resizes and never end up off-screen.
- Maximised windows fill the desktop area (viewport minus MenuBar) so the Dock and MenuBar remain visible.
- The window content region declares `container-type: inline-size` so apps can use Tailwind v4 `@sm:` / `@md:` / `@lg:` / `@xl:` variants keyed to their own window width rather than the viewport (see `NotesApp`, `VSCodeApp`, `MusicApp`, `PhotosApp`, `AchievementsApp`, `SafariApp`).

### Adding a window

You must touch **four** places for a new app:

1. `src/components/apps/MyApp.tsx` — the component (`'use client'` if it needs it).
2. `src/data/apps.data.ts` — dock entry `{ id, name, icon }`, plus an icon in `public/icons/`.
3. `src/app/page.tsx`:
   - Extend the `windows` state map with `myapp: { isOpen: false, isMinimized: false, z: <next unique> }`.
   - Import the component and add `<WindowLayout id="myapp" dockId="dock-icon-myapp" …><MyApp /></WindowLayout>` in the desktop container.
4. (Optional) Achievement / notification hooks inside `handleAppOpen` and any Siri intents inside `src/app/api/siri/route.ts`.

Missing any one of the four either hides the app or breaks its animation.

## Contexts

- **`OSContext`** (`src/context/OSContext.tsx`) — current wallpaper URL. Sets `document.documentElement.style.setProperty('--wallpaper', url(...))` and mirrors to `localStorage`. `page.tsx` reads the wallpaper via CSS variable, not through the hook, so the desktop background updates without a re-render.
- **`NotificationContext`** — one active toast at a time (`title`, `message`, `type`, optional `onClick`). Auto-dismisses after 5 s. Consumed by `<Notification />` in `page.tsx`.
- **`AchievementsContext`** — unlocked ids in `localStorage`, XP + level derived from `src/data/achievements.data.ts`. Exposes `unlockAchievement(id)` and `setOpenAchievementsApp(cb)` so the achievements toast can open the Achievements window directly.

Rule for new contexts: mount their provider inside `DesktopContent` (or higher, if truly global) and export a `useX()` hook that throws when used outside its provider.

## Data flow for the Siri app

1. `SiriApp` maintains a local `history` array and sends `POST /api/siri` with `{ message, history }`.
2. `src/app/api/siri/route.ts` runs on the server. It builds a system prompt from `src/data/portfolio.data.ts` (`profileData`, `skills`, `experiences`) and calls `@google/genai`'s `chats.create` + `sendMessage` against `gemini-2.5-flash-lite`.
3. The reply text may contain a JSON tail like `{"action":"open_app","app":"notes"}`. `SiriApp` parses that and calls `onOpenApp('notes')`, which flows back into `page.tsx`'s `openApp`.

If `GEMINI_API_KEY` is missing or invalid, the route returns HTTP 500 with a friendly message and Siri displays it verbatim.

## Data flow for the Safari app

1. `SafariApp` renders an `<iframe src="/api/proxy?url=…">` (see `src/components/apps/SafariApp.tsx`).
2. `src/app/api/proxy/route.ts` launches Chromium (local Chrome in dev, `@sparticuz/chromium` in production), navigates to the target, forces lazy content by scrolling, and returns the rendered HTML.
3. It rewrites `<a>` clicks to re-enter the proxy and posts `URL_CHANGED` / `LOAD_START` messages to `window.parent` so the Safari chrome (address bar, loader) can react.

This is intentionally best-effort — many sites will fail (bot protection, CSP, cross-origin frames). Do not treat it as a general-purpose web renderer.

## Styling system

- Tailwind CSS v4 via `@tailwindcss/postcss`. Only entry: `@import "tailwindcss";` in `src/app/globals.css`.
- Custom global classes live in the same file:
  - `.glass-panel`, `.glass-dock` — translucent macOS surfaces.
  - `.window-shadow` — window drop shadow.
  - `.icon-text` — dock/desktop label typography.
  - `.macos-scrollbar` — thin macOS scrollbars.
- The wallpaper is applied via the CSS custom property `--wallpaper` set on `<html>` (see `OSContext`).
- `body` has `overflow: hidden; user-select: none;` to match desktop-OS feel.

## Static content

Everything user-visible copy lives under `src/data/`:

| File                        | Owner                                                                    |
| --------------------------- | ------------------------------------------------------------------------ |
| `portfolio.data.ts`         | Profile, skills, experiences, projects (also fed into Siri's prompt)     |
| `apps.data.ts`              | Dock apps                                                                |
| `notes.data.ts`             | Notes app sidebar + sections                                             |
| `achievements.data.ts`      | Achievement definitions and XP                                           |
| `contactDetails.ts`         | Email / GitHub / LinkedIn / Instagram (public)                           |
| `contacts.data.ts`          | Contacts app entries                                                     |
| `finder.data.ts`            | Finder file tree                                                         |
| `menu.data.ts`              | Menu bar dropdown content                                                |
| `terminal.data.ts`          | Terminal commands and boot log                                           |
| `wallpapers.data.ts`        | Wallpaper switcher options                                               |

If you're updating copy or content, edit these — not the components.

## Rendering model

- All apps are **client components**. There is no server-side rendering benefit here because the entire desktop is interactive; `page.tsx` is `'use client'`.
- The route handlers (`api/siri`, `api/proxy`) are server-only.
- `next.config.ts` sets `serverExternalPackages: ['puppeteer-core', '@sparticuz/chromium']` so those aren't bundled into the client or the RSC build.

## Known constraints

- The window map lives in memory only. Refreshing closes all windows.
- Layout is designed for viewports ≥ ~1024 px. Small screens are not a supported target — the OS metaphor breaks below dock size.
- The Puppeteer route needs a real Chromium binary in development. Falls back to a hard-coded path per OS.
