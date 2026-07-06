# Gainz — Launch Plan

Created 2026-07-04. Target launch: **Monday, August 3, 2026** (~4.5 weeks out).

## Assumptions (flag anything wrong and I'll rebuild the plan)
- **Launch = public web app** at a real domain, installable as a PWA (Add to Home Screen). Native iOS/Android App Store apps are pushed to a **Phase 6 backlog**, not required for launch.
- **No accounts/backend for v1.** Data stays in the browser (localStorage) like today. Multi-device sync is a post-launch project, not a launch blocker.
- You (Jack) handle anything that needs your money or identity: buying the domain, approving costs, recruiting beta testers, posting on your own social accounts. I handle all building/fixing/coding.
- Dates below are session targets, not hard deadlines — each chunk is sized to one focused work session (roughly 2–4 hrs of my work, less of your time since you're mostly reviewing/approving).

---

## Phase 0 — Foundation & Safety Net · Sat Jul 4 – Sun Jul 5

| # | Chunk | Type | Notes |
|---|-------|------|-------|
| 0.1 | Fix dev server port config | Fix | ✅ **Done 7/4** — `vite.config.js` now reads `PORT` env var |
| 0.2 | Init git + push to GitHub | Move | ✅ **Done 7/6** — installed `gh` CLI, authenticated, created [github.com/Scantr0n/gainz](https://github.com/Scantr0n/gainz) (private), pushed all history. |
| 0.3 | Build a Settings/Profile page | Build | ✅ **Done 7/4** — gear icon on Workout header; edit name/bodyweight/goal; two-tap reset |
| 0.4 | Data export/import (JSON backup) | Add | ✅ **Done 7/4** — export downloads dated JSON; import validates + restores |
| 0.5 | Full bug-bash / edge-case QA pass | Fix | ✅ **Done 7/4** — fixed UTC "today" bug (evening logs went to tomorrow), photo compression (raw photos overflowed localStorage and silently killed all saves), negative input clamps, lint clean |

## Phase 1 — Real AI Backend · Mon Jul 6 – Sun Jul 12

| # | Chunk | Type | Notes |
|---|-------|------|-------|
| 1.1 | Stand up a minimal serverless API | Build | ✅ **Done 7/6** — `netlify/functions/claude-proxy.js` + `netlify.toml`, copied from Fuel's exact pattern. Holds the Anthropic API key server-side. |
| 1.2 | Replace the fake `setTimeout` recommender with a real Claude call | Upgrade | ✅ **Done 7/6** — `Plan.jsx`'s AI recommender now calls Claude for real via `src/utils/api.js` (same local-dev/deployed dual-path pattern as Fuel). Old rule-based logic kept as automatic fallback for demo mode and API failures — verified live: demo-mode badge, and a bad-key request correctly falls back with a visible warning instead of crashing. Added a dev-only API key field to Settings (stored separately from the exportable backup, confirmed it never leaks into exported JSON). No live Claude key available on this machine, so full end-to-end (a real recommendation) is untested until Phase 3 deploy sets `ANTHROPIC_API_KEY` in Netlify. |
| 1.3 *(stretch)* | AI reasoning for injury substitutions | Upgrade | Optional — same backend endpoint, richer explanations than the current static `INJURY_SWAPS` map. Cut if time-tight. |

## Phase 2 — Turn It Into an "App" · Mon Jul 13 – Sun Jul 19

| # | Chunk | Type | Notes |
|---|-------|------|-------|
| 2.1 | PWA setup — manifest, service worker, install icons | Build | ✅ **Done 7/4** — `vite-plugin-pwa` generates the manifest + service worker; branded 192/512/apple-touch icons and matching favicon created (dumbbell glyph on the app's lime-yellow), replacing leftover unrelated template assets. Verified installable via production build: manifest served, SW registered, correct title/theme-color. |
| 2.2 | App icon & branding assets | Build | ✅ **Done 7/4** — social share (OG) image generated (1200×630, matches brand); og:/twitter: meta tags wired into index.html; verified image resolves correctly in a production build. |
| 2.3 | Rest timer between sets | Add | ✅ **Done 7/4** — sticky 90s timer auto-starts whenever a set is logged; +15s/-15s adjust, skip (X), "Rest complete" celebration state with vibration + 15s auto-dismiss. Verified full countdown → complete → skip cycle live. |
| 2.4 | Warm-up weight calculator | Add | ✅ **Done 7/4** — expandable "Warm-up sets" panel on each non-bodyweight exercise, computed from the heaviest weight already logged that day (50/70/85% × 8/5/3 reps, rounded to 5 lb or 2.5 lb plates depending on load). Verified math and edge cases (zero weight, small dumbbell loads). |
| 2.5 | Polish pass — loading/empty states, transitions | Update | ✅ **Done 7/4** — found and fixed a real bug: the rest timer overlapped the last exercise card's content since bottom padding didn't account for its height. Fixed via a shared `PageContainer` used by all 6 pages. Also lifted the rest timer to app-level context so it now survives switching tabs mid-rest (previously died on navigation), removed ~200 lines of dead Vite-template CSS (`App.css`, fully unused), and added an icon to Progress's empty state for consistency with Photos/Tiers. |

## Phase 3 — Domain, Hosting, Legal · Mon Jul 20 – Sun Jul 26

| # | Chunk | Type | Notes |
|---|-------|------|-------|
| 3.1 | **Buy a domain** | **Buy (you)** | e.g. `gainzapp.com` / `trygainz.com` — roughly $12–20/yr. I can shortlist name/availability options when we get here; you complete the purchase. |
| 3.2 | Deploy to Netlify + connect domain + SSL | Move/Build | Free tier covers this comfortably at launch traffic levels; matches Fuel's existing setup. |
| 3.3 | Privacy Policy + Terms of Use pages | Add | Needed because profile/goal data now leaves the device to hit the Claude API. I'll draft plain-language versions — have a lawyer glance at them before you scale this into a real business. |
| 3.4 | Lightweight, privacy-friendly analytics | Add | Netlify Analytics or Plausible so you can see launch-day traffic. |

## Phase 4 — QA & Beta · Mon Jul 27 – Sun Aug 2

| # | Chunk | Type | Notes |
|---|-------|------|-------|
| 4.1 | Cross-device/browser pass | Fix | iOS Safari, Android Chrome, tablet, desktop. |
| 4.2 | Lighthouse performance + accessibility audit | Fix | Fix whatever it flags. |
| 4.3 | **Friends & family beta round** | **You** | Get 5–10 real people using it for a few days, collect feedback/bugs before the public sees it. |

## Phase 5 — Launch Day · Mon Aug 3

| # | Chunk | Type | Notes |
|---|-------|------|-------|
| 5.1 | Launch graphics + copy | Build | Canva assets + post copy for your socials. |
| 5.2 | Go live | Launch | Final deploy, DNS cutover, you post the announcement. |

---

## Phase 6 — Post-Launch Backlog (no fixed dates)
- Native iOS/Android wrap (Capacitor) + App Store/Play Store submission — **Buy:** Apple Developer Program $99/yr, Google Play $25 one-time
- Accounts + real backend for multi-device sync (bigger project — real database, auth)
- Monetization (premium tier, paywall)
- Social/sharing features, PR celebration moments
- Push notifications (workout reminders)

## Budget to Launch (Phase 0–5)
| Item | Cost |
|---|---|
| Domain | ~$12–20/yr |
| Hosting (Netlify free tier) | $0 |
| Claude API usage (recommender calls) | Usage-based, likely a few $/month at low volume |
| Analytics (optional, Plausible) | $0 (Netlify Analytics) or ~$9/mo (Plausible) |
| **Total to launch** | **~$15–30** |

Native app store costs ($99/yr + $25) are deferred to Phase 6 and not required for the Aug 3 launch.
