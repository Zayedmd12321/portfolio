# Deployment

The portfolio is set up for **Vercel** (the default Next.js target). Other platforms work but need extra care because of the Puppeteer/Chromium dependency in `src/app/api/proxy/route.ts`.

## Vercel (recommended)

1. Push the repo to GitHub / GitLab / Bitbucket.
2. Import the repo into Vercel. Framework is auto-detected as Next.js — no build overrides needed.
3. Set environment variables under **Settings → Environment Variables**:
   - `GEMINI_API_KEY` — your Google AI Studio key. Scope to **Production** (and **Preview** if you want previews to have Siri too).
4. Deploy.

`next.config.ts` already sets `serverExternalPackages: ['puppeteer-core', '@sparticuz/chromium']`, which is what makes the Safari proxy work on Vercel's serverless runtime. Do not remove that line.

### Vercel + the Puppeteer proxy

The `/api/proxy` route has `export const maxDuration = 60;` — Vercel needs your plan to allow 60 s function duration (Hobby currently caps at 60 s for serverless functions on Next.js, so this is fine). If you want to deploy on a plan with a lower cap, drop `maxDuration` accordingly and expect more timeouts.

Cold starts are large because `@sparticuz/chromium` ships a ~50 MB binary. The first Safari request after a deploy will be slow (5–10 s). This is normal.

## Local production build

```bash
npm run build
npm run start        # serves on http://localhost:3000
```

Set `GEMINI_API_KEY` in `.env.local` before `npm run start` if you want Siri to work.

## Deploying elsewhere

### Any Node.js host (Render, Railway, Fly, self-hosted)

- Provide `GEMINI_API_KEY` as an env var.
- The Puppeteer proxy uses `@sparticuz/chromium` in production, which is built for AWS Lambda / Vercel. On a long-running Node host it will *usually* work, but you may want to swap it for a system-installed Chromium and point `puppeteer.launch({ executablePath })` at that binary. Change is confined to `src/app/api/proxy/route.ts`.
- Run `npm run build`, then `npm run start`.

### Static export

**Not supported.** The site has server routes (`/api/siri`, `/api/proxy`) and cannot be exported as static HTML.

### Docker

There is no `Dockerfile` in the repo. If you add one, remember to install a Chromium binary (or accept that `/api/proxy` will fail) and pass `GEMINI_API_KEY` at runtime, not build time.

## Post-deploy checklist

- Load the site — boot screen plays, terminal opens, notes app appears.
- Open Siri and send a test message — you should get a Gemini reply, not the error fallback.
- Open Safari and load a public URL (e.g. `example.com`) — the proxy should return rendered HTML.
- Refresh: wallpaper choice and unlocked achievements should persist (they live in `localStorage`).

## Rollback

Vercel keeps every previous deploy — promote the last known-good one from the dashboard. Nothing else in this repo persists state, so a rollback is safe.
