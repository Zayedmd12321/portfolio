# Apps

Reference for every "app" (window) shipped in the portfolio's desktop shell. Each app is a client component under `src/components/apps/` that renders inside a `<WindowLayout>` in `src/app/page.tsx`.

The window contract is described in `docs/ARCHITECTURE.md` — this file focuses on what each app *shows* and *does* on the inside.

## Apps at a glance

| id             | Component              | What it is                                                    | Data source                              |
| -------------- | ---------------------- | ------------------------------------------------------------- | ---------------------------------------- |
| `finder`       | `FinderApp.tsx`        | Fake Finder file browser (visual only)                        | `src/data/finder.data.ts`                |
| `terminal`     | `TerminalApp.tsx`      | Boot log + text-command prompt                                | `src/data/terminal.data.ts`              |
| `vscode`       | `VSCodeApp.tsx`        | VS Code look-alike showing `profile.ts` "code"                | `src/data/portfolio.data.ts`             |
| `safari`       | `SafariApp.tsx`        | Real web browser via Puppeteer proxy                          | `/api/proxy?url=…`                       |
| `calculator`   | `CalculatorApp.tsx`    | Working macOS-style calculator                                | Local state                              |
| `siri`         | `SiriApp.tsx`          | AI chat over Gemini that can open other apps                  | `/api/siri` (Google Gemini)              |
| `photos`       | `PhotosApp.tsx`        | Lightbox photo gallery                                        | `src/data/photos.data.ts` (if present)   |
| `contacts`     | `ContactsApp.tsx`      | Contacts card view with categories                            | `src/data/contacts.data.ts`              |
| `notes`        | `NotesApp.tsx`         | The "traditional" portfolio: bio, experience, skills, projects | `src/data/notes.data.ts` + `portfolio.data.ts` |
| `resume`       | `ResumeApp.tsx`        | Renders `/public/resume.pdf`                                  | `public/resume.pdf`                      |
| `music`        | `MusicApp.tsx`         | Music search + 30-second previews via iTunes Search API       | `itunes.apple.com/search`                |
| `mail`         | `MailApp.tsx`          | Contact form + "Sent" success view                            | Local state (no backend)                 |
| `achievements` | `AchievementsApp.tsx`  | XP / level display for unlocked achievements                  | `src/data/achievements.data.ts` + `AchievementsContext` |

`id` is the string used everywhere — in `windows` state, the dock, the achievement triggers, and Siri's system prompt. Do not rename it.

---

## Finder — `finder`

**File:** `src/components/apps/FinderApp.tsx`

**What it shows.** A two-pane macOS Finder mimic: a glass sidebar with **Favorites** (Macintosh HD, Recents, Applications, Downloads) and **iCloud** (iCloud Drive), and a grid of file icons on the right (folders, images, code files).

**How it works.** Purely presentational. Sidebar items come from `finderSidebarFavorites` and `finderSidebarCloud` in `src/data/finder.data.ts`; the grid iterates `finderFiles` and renders `<FileIcon>` for each. No state, no clicks, no persistence — it exists to complete the desktop illusion.

**To change what shows up:** edit `src/data/finder.data.ts`.

---

## Terminal — `terminal`

**File:** `src/components/apps/TerminalApp.tsx`

**What it shows.** ASCII "ZAYED" banner at the top, then a scripted boot log (`[INFO] Initializing Portfolio System… [OK] KERNEL loaded…`) when the desktop first boots, and finally an interactive prompt (`zayed@portfolio ~ %`).

**How it works.**
- Owns two modes: `bootMode` (called from `page.tsx` with `bootMode={terminalBootMode}`) plays the `BOOT_SEQUENCE` frames via chained `setTimeout`s, then fires `onBootComplete()` — which the desktop uses to open the Notes app and pop a "System Online" notification.
- After boot, keystrokes are captured; pressing Enter looks up the trimmed input against `terminalCommands` (a `{ [cmd]: outputText }` map in `src/data/terminal.data.ts`). Unknown commands fall through to a `command not found` line. `clear` resets history to the ASCII banner.
- History is kept in local state; there's no persistence across refresh.

**To add a command:** add a key/value to `terminalCommands` in `src/data/terminal.data.ts`.

**Achievement hook:** opening this app unlocks `terminal_wizard` (fired from `handleAppOpen` in `page.tsx`).

---

## VS Code — `vscode`

**File:** `src/components/apps/VSCodeApp.tsx`

**What it shows.** A VS Code clone: activity bar (files / search / git / user / settings icons), explorer sidebar with a `ZAYED-PORTFOLIO ▸ src ▸ profile.ts` tree, a single file tab, gutter line numbers, and a syntax-highlighted TypeScript object literal.

**How it works.** Static JSX styled to look like the VS Code default dark theme. The "code" body reads live values from `profileData` and `profileData.techStack` (`src/data/portfolio.data.ts`) — update the profile data and this view updates with it. No editing, no clicks.

**To change the shown "code":** edit `profileData` in `src/data/portfolio.data.ts`, or rework the JSX in `VSCodeApp.tsx` if you want a different `profile.ts` layout.

---

## Safari — `safari`

**File:** `src/components/apps/SafariApp.tsx`

**What it shows.** A macOS Safari mimic: window chrome with back/forward/reload/home buttons, an address bar, a bookmarks toolbar, tabs, and either a "start page" (bookmark cards for GitHub / LinkedIn / Instagram / Google / Portfolio) or an iframe rendering a real website.

**How it works.**
- **Tabs** are kept in local `tabs` state (`Tab[]`, each carrying `url`, `displayUrl`, `title`, `isLoading`, `history[]`, `historyIndex`, `warningDismissed`). `activeTabId` picks the visible one.
- **Navigation** typing a URL in the address bar or clicking a bookmark points the tab's iframe at `/api/proxy?url=<encoded>`. The proxy route (`src/app/api/proxy/route.ts`) launches Chromium via Puppeteer, waits for hydration, forces lazy scrolling, and returns the rendered HTML with a small `postMessage` shim injected.
- The injected shim posts `LOAD_START` and `URL_CHANGED` messages to `window.parent`. `SafariApp`'s `message` listener uses `updateTab(activeTabId, …)` to flip the loading indicator and swap the address-bar URL, so in-iframe clicks feel like real browsing.
- **Bookmarks** live in `bookmarks` state (seeded from `INITIAL_BOOKMARKS`, which pulls handles from `contactDetails`). `toggleBookmark()` adds or removes the current URL.
- **Warnings:** each tab has `warningDismissed` — some sites are known to break inside the proxy; the UI lets you dismiss the "may not render" banner per tab.

**Requirements & caveats.**
- In dev, `/api/proxy` needs a local Chrome install (default path Windows: `C:\Program Files\Google\Chrome\Application\chrome.exe`, macOS: `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`).
- In production it uses `@sparticuz/chromium` (Vercel-friendly).
- The proxy is best-effort — sites with strict CSP, bot detection, or heavy client-side hydration will fail. That's expected.

**To change starter bookmarks:** edit `INITIAL_BOOKMARKS` at the top of `SafariApp.tsx` (it reads `contactDetails` for GitHub / LinkedIn / Instagram).

---

## Calculator — `calculator`

**File:** `src/components/apps/CalculatorApp.tsx`

**What it shows.** A macOS Calculator: dark grey number pad, light-grey function row (`AC`, `+/-`, `%`), orange operator column, wide `0` button. Display font size auto-shrinks as the number grows.

**How it works.**
- State: `display`, `prevValue`, `operator`, `waitingForOperand`, `activeOperator`.
- `performOperation(nextOp)` uses the standard "chain calculator" algorithm: if there's a pending operator, evaluate against the current `display`, otherwise store the current value as `prevValue`, then remember `nextOp`.
- Keyboard support: a `useEffect` registers a single `window.keydown` listener that routes digits, `.`, `+`, `-`, `*`, `/`, `Enter`/`=`, `Backspace`, and `Escape`/`c`/`C` to the same handlers as the buttons. To avoid stale closures the effect uses a `latestHandlers` ref that's refreshed each render.

**To tweak look:** edit the `Button` component's colour classes at the top of `CalculatorApp.tsx`. Behaviour is self-contained; there's no shared context.

---

## Siri — `siri`

**File:** `src/components/apps/SiriApp.tsx`

**What it shows.** A translucent chat window with a swirling gradient "orb", a message list, a set of suggested prompts (Who is Zayed? / Projects / Tech Stack / Fun Fact), and an input row with a send button.

**How it works.**
- Local `history: ChatMessage[]` (roles `'user'` / `'model'`, each with `parts: {text}[]`).
- `handleSend()` POSTs `{ message, history }` to `/api/siri`.
- **Server route** (`src/app/api/siri/route.ts`) constructs a system prompt from `profileData`, `skills`, and `experiences`, initialises a Gemini chat with that instruction, replays the prior history, and forwards the new message. Model: `gemini-2.5-flash-lite`. The reply text may contain a trailing JSON directive like `{"action":"open_app","app":"notes"}`.
- Back on the client, `SiriApp` scans the reply for that JSON, strips it, and calls `onOpenApp(appId)` — which the desktop wires up to `openApp` in `page.tsx`. So asking Siri to "show me your resume" or "open the calculator" actually opens those windows.
- If `/api/siri` returns non-200 (missing `GEMINI_API_KEY`, network failure, quota) or the fetch throws, Siri falls back to a friendly "demo mode" message.

**Requirements.** `GEMINI_API_KEY` in `.env.local` (server-side). Without it the server route errors and Siri stays in demo mode.

**Achievement hook:** none direct, but Siri opening another app funnels through `openApp`, which fires the usual per-app hooks.

**To change the persona / capabilities:** edit `systemInstruction` in `src/app/api/siri/route.ts`. Any new app you add should be listed in the "Available apps" section and the "App Control" rules so Siri knows to emit the JSON directive.

---

## Photos — `photos`

**File:** `src/components/apps/PhotosApp.tsx`

**What it shows.** A responsive grid of photo thumbnails. Clicking one opens a fullscreen lightbox with prev/next arrows and a close button.

**How it works.**
- Grid iterates a `photos` array (each `{ id, src, title }`) and renders a `<motion.div>` per photo — the img inside uses `onError` to swap to `/icons/Photos.png` if a source 404s.
- Clicking a photo sets `selectedPhoto`; an `AnimatePresence`-wrapped modal fades in with a `min-h-125` lightbox container.
- Navigation buttons (`navigatePhoto('prev'|'next')`) index-shift through the same array, wrapping at the ends.
- The overlay closes on backdrop click; the inner content stops propagation.

**To swap the photos:** edit the photo data at the top of `PhotosApp.tsx` (or its `src/data/*.ts` source, if the component imports one).

---

## Contacts — `contacts`

**File:** `src/components/apps/ContactsApp.tsx`

**What it shows.** A macOS Contacts layout: category sidebar on the left (`all` / `evaluated` / other categories defined in `contacts.types.ts`), a card list, and a detail pane on the right with contact info + an evaluation note in blockquote.

**How it works.**
- `CONTACTS` (from `src/data/contacts.data.ts`) is the source of truth; each entry has an `id`, a display name, a `category`, a `note`, and typed fields (email / phone / social) rendered via `<ContactInfoBox>`.
- Local state tracks `selectedContactId` and `activeCategory`. The category filter narrows the visible list; the detail pane renders `CONTACTS.find(c => c.id === selectedContactId)`.
- Uses supporting UI in `src/components/ui/contacts/`: `ContactSidebarItem`, `ContactActionButton`, `ContactInfoBox`.

**To add a contact:** append to `CONTACTS` in `src/data/contacts.data.ts` (keep the `Contact` shape from `src/types/contacts.types.ts`).

---

## Notes — `notes`

**File:** `src/components/apps/NotesApp.tsx`

**What it shows.** The "actual" portfolio content laid out as macOS Notes: a searchable notes sidebar on the left with items like *About*, *Experience*, *Tech Stack*, *Projects*, and a large document pane on the right that renders the corresponding section.

**How it works.**
- Note metadata comes from `initialNotes` in `src/data/notes.data.ts`. Special "portfolio" notes (`isPortfolio: true`) don't show plain text bodies — instead the component switches on the note id and renders a purpose-built section component:
  - `ProfileSection` — profile photo + role + bio + socials (from `profileData`).
  - `ExperienceSection` — timeline of `experiences[]` with tech-stack pill icons.
  - `TechSection` — grid of `TechCard` per entry in `skills[]`.
  - `ProjectsSplitView` / `ProjectCard` — grid of `projects[]` with tech icons.
- Users can also create a plain user note (`createNote`), edit its title/body, or delete it — but that state is in-memory and lost on refresh.
- A collapsible sidebar (`isSidebarOpen`) plus a hidden `AlertCircle` toast (`showAlert`) round out the interactions.
- **Opens automatically after boot.** The terminal's `onBootComplete` handler in `page.tsx` opens Notes centered on screen.

**To edit your portfolio content:** the four data files that feed this app are `profileData`, `skills`, `experiences`, `projects` in `src/data/portfolio.data.ts`, and `initialNotes` in `src/data/notes.data.ts`. Don't hard-code copy inside the component.

---

## Resume — `resume`

**File:** `src/components/apps/ResumeApp.tsx`

**What it shows.** The PDF at `public/resume.pdf`, rendered inline. Uses `<object data="/resume.pdf">` with an `<iframe>` fallback so both Chromium and non-Chromium browsers display something.

**How it works.** No state, no props — it's a two-line component that trusts the browser's native PDF viewer. Despite `react-pdf` / `pdfjs-dist` being installed as dependencies, this component currently doesn't use them; the PDF viewer is fully browser-native.

**To replace the resume:** drop a new file at `public/resume.pdf`. If you rename it, update the two `src` / `data` attributes.

**Achievement hook:** opening this app unlocks `recruiter` (fired from `handleAppOpen`).

---

## Music — `music`

**File:** `src/components/apps/MusicApp.tsx`

**What it shows.** An Apple Music mimic: red-accent sidebar (Listen Now / Browse / Radio / Recent / Artists) with a search box, a top control bar (prev / play-pause / next, now-playing card, volume slider), a big scrollable grid of album artwork, and a thin progress bar pinned to the bottom.

**How it works.**
- On mount and on every sidebar/search action, `searchMusic(query)` hits the free **iTunes Search API** (`https://itunes.apple.com/search?term=…&media=music&limit=24`) — no API key required. Only tracks with a `previewUrl` are kept; artwork URLs are upscaled from `100x100bb` to `600x600bb`.
- Clicking an album sets `currentSong` and starts playback. Playback uses a single lazily-created `HTMLAudioElement` stored in `audioRef`. Three effects split the concerns: one swaps `audio.src` when `currentSong` changes, one plays/pauses when `isPlaying` flips, one adjusts `audio.volume` when the slider moves. `handleNext` is reached via a ref so the song-swap effect doesn't need it as a dep.
- The bottom progress bar reflects `audio.currentTime / audio.duration` (previews are usually 30 s) and is click-to-seek.

**Requirements.** Public internet + reachable `itunes.apple.com`. Nothing to configure. Album cover URLs live on Apple's CDN, so they use plain `<img>` (converting to `next/image` would need `remotePatterns`, out of scope).

**Achievement hook:** opening this app unlocks `music_lover`.

---

## Mail — `mail`

**File:** `src/components/apps/MailApp.tsx`

**What it shows.** A three-view mimic:
1. **Compose** — a message-composer with a pre-filled "To: Md Zayed Ghanchi", editable **From**, **Subject**, and message body, and a **Send** button in the toolbar.
2. **Success** — a checkmark screen with contact-method cards (Mail, LinkedIn, GitHub, Resume) and a "Send another" link.
3. **Testimonials** — an "Inbox (0)" empty state. (Sample testimonials exist in the component as commented-out JSX.)

**How it works.**
- `activeSection` state switches between the three views.
- `handleSend()` validates that `from` and `message` are filled, then simulates a 1.5 s API round-trip (`await new Promise(r => setTimeout(r, 1500))`) — there is **no real backend or SMTP integration**. Sending fires a success notification via `NotificationContext` and swaps to the success view.
- The sidebar's Testimonials count uses `count={0}` and relies on the JSX behaviour where `{0 && …}` still renders `0` — this is intentional to keep the original visual.

**Achievement hook:** opening this app unlocks `recruiter`.

**To wire real email sending:** replace the `await new Promise(...)` inside `handleSend` with a `fetch('/api/mail', { method: 'POST', body: JSON.stringify(formData) })` and add a matching route handler under `src/app/api/mail/route.ts`. That's an added feature and needs its own env var story (SMTP creds, Resend/Postmark API key, etc.) — currently out of scope.

---

## Achievements — `achievements`

**File:** `src/components/apps/AchievementsApp.tsx`

**What it shows.** A macOS-style achievements/trophies panel: total XP, current level, an XP-to-next-level progress bar, category tabs (`all` / `system` / `apps` / `hidden`), and a grid of achievement cards (locked or unlocked, each with an icon, title, description, and XP value).

**How it works.**
- The full achievement catalogue is `ACHIEVEMENTS` in `src/data/achievements.data.ts`. Each entry has an `id`, `title`, `description`, `xp`, `icon` (a `LucideIcon`), `category`, and Tailwind `color` gradient tokens.
- Unlocked ids come from `useAchievements()`, backed by `AchievementsContext`. That context reads/writes `localStorage['macOS-achievements']` via `useSyncExternalStore`, so unlocks persist across refreshes and multiple listeners on the page stay in sync.
- Total XP is `Σ xp` for unlocked ids; **level** = `Math.floor(totalXP / 200) + 1`. Whenever the level ticks up, the context fires a "Level Up!" toast (also `NotificationContext`).
- The Achievements window can be opened directly from those toasts because `page.tsx` registers a callback via `setOpenAchievementsApp` on mount.

**How unlocks are triggered.** `handleAppOpen` in `src/app/page.tsx` fires these:

| Trigger                                              | Achievement id      |
| ---------------------------------------------------- | ------------------- |
| Terminal boot sequence completes                     | `boot_up`           |
| Opening Terminal                                     | `terminal_wizard`   |
| Opening Music                                        | `music_lover`       |
| Opening Mail or Resume                               | `recruiter`         |
| Opening a 5th window (any app while ≥4 are open)     | `explorer`          |

Any other ids in `ACHIEVEMENTS` are either hidden lore or wired elsewhere — add new triggers by calling `unlockAchievement('<id>')` from the relevant component.

**To add an achievement:** append to `ACHIEVEMENTS` (unique `id`, category `'system'` / `'apps'` / `'hidden'`) and call `unlockAchievement(id)` from the place that should unlock it.
