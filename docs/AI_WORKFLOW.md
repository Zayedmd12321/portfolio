# AI Workflow

How AI coding agents (Claude Code, Codex, Cursor, Copilot, …) should approach this repository. If you're an agent reading this, read `CLAUDE.md` and/or `AGENTS.md` first — this file is the deeper "how to work here safely" reference.

## Before you touch anything

1. **Read the task carefully.** Distinguish an "add a small feature" ask from a "rebuild this" ask. This repo has a specific macOS-shell architecture; don't invent a new one.
2. **Load the right context.** For any change touching an app: read `src/app/page.tsx`, `src/components/layouts/WindowLayout.tsx`, and the target app under `src/components/apps/`. For a content-only change: usually just `src/data/*.ts` and the consuming component.
3. **`git status` first.** Never begin work on a dirty tree without acknowledging what's there. Stash or commit the user's work-in-progress before making destructive moves.

## Inspection order (for a typical change)

1. `README.md` — feature list, tech stack, structure.
2. `docs/ARCHITECTURE.md` — window manager, contexts, data flow.
3. `package.json` — confirm scripts and dependency versions before invoking any tool.
4. `tsconfig.json` — confirm the `@/*` alias and strict mode.
5. The specific source files touched by the task — read them fully, not just the sections you'll edit.

## When adding an app

Follow the four-place checklist in `docs/ARCHITECTURE.md`. Skipping any one of them leaves the app invisible or breaks its dock animation.

## When adding a dependency

Ask first. The stack is deliberately small (Next.js, React, Tailwind, framer-motion, react-rnd, lucide-react, clsx, tailwind-merge, plus the AI/Puppeteer/PDF triad). If a task can be done with what's already installed, it should be.

If the user approves, use `npm install --save` (or `--save-dev`), commit both `package.json` and `package-lock.json`, and mention the added dependency and its purpose in your task summary.

## When modifying route handlers

- `src/app/api/siri/route.ts` — depends on `GEMINI_API_KEY` and the shape of `profileData` / `skills` / `experiences` in `src/data/portfolio.data.ts`. Don't reshape those types without updating the prompt.
- `src/app/api/proxy/route.ts` — has intentional timing (`waitUntil: 'domcontentloaded'`, 4 s hard wait, scroll, 2 s settle). Don't "optimise" those away.

## When editing styles

- Tailwind v4 utilities only. No `tailwind.config.js` exists — utilities are discovered from source.
- Prefer the existing tokens (`.glass-panel`, `.glass-dock`, `.window-shadow`, `.icon-text`, `.macos-scrollbar`) over new custom CSS.
- If you must add global CSS, add it to `src/app/globals.css` in the appropriate section and mention it in your summary.

## Validation you're expected to run

```bash
npm run lint
npm run typecheck
npm run build
```

Actually run them. Report each command's exit status. If a command fails because of missing deps, missing env vars, or sandbox limits, say so plainly instead of skipping it silently.

There is no test suite, so **do not** claim tests passed. If the change is UI-only and you can't see a browser from your environment, state that visual verification wasn't possible and list the user-facing behaviours you *did* reason about.

## Safety rails

- Do not rewrite `src/app/page.tsx`'s window manager for stylistic reasons — its shape is load-bearing.
- Do not rename any existing app `id` (`finder`, `terminal`, `vscode`, `safari`, `calculator`, `siri`, `photos`, `contacts`, `notes`, `bin`, `resume`, `music`, `mail`, `achievements`). They're referenced by string in several places and in the Siri prompt.
- Do not print, log, or commit `GEMINI_API_KEY` (or any other secret).
- Do not delete files that "look unused" — some are wired by string id and won't show up in grep for their identifier.
- Do not run destructive git commands without confirming there's nothing valuable to lose (`git status`, `git stash -u` if needed).
- If you spot an unrelated bug or security issue, document it in your task summary; don't silently fix half the file.

## Preferred change size

Small and reversible. If a task naturally grows past ~200 lines of diff across ~5 files, pause and confirm the scope with the user before continuing.

## Task summary you should produce

At the end of every task:

1. **Files changed:** each with a one-line note ("Added window entry", "Renamed prop", …).
2. **Files intentionally not changed:** anything the task seemed to imply but you left alone, with the reason.
3. **Decisions and assumptions:** in bullets. Flag anything the user should double-check.
4. **Validation:** commands run, exit status, notable output.
5. **Remaining risks / follow-ups:** including anything you couldn't validate in this environment.
