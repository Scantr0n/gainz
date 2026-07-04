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
| 0.1 | Fix dev server port config | Fix | ✅ **Done today** — `vite.config.js` now reads `PORT` env var |
| 0.2 | Init git + push to GitHub | Move | No `.git` currently exists. I'll `git init`, add `.gitignore`, first commit. **You:** create an empty GitHub repo named `gainz` (or tell me to use `gh repo create`) so I can push. |
| 0.3 | Build a Settings/Profile page | Build | Doesn't exist yet — right now there's no way to edit name/bodyweight/goal after onboarding, or reset the app. Needed before launch. |
| 0.4 | Data export/import (JSON backup) | Add | Lives in the new Settings page. Critical since there's no backend — clearing browser data currently means losing everything permanently. |
| 0.5 | Full bug-bash / edge-case QA pass | Fix | Zero/negative weight & reps, deleting all sets, empty chart states, split-switching while mid-week, etc. |

## Phase 1 — Real AI Backend · Mon Jul 6 – Sun Jul 12

| # | Chunk | Type | Notes |
|---|-------|------|-------|
| 1.1 | Stand up a minimal serverless API | Build | A Vercel Function (or small Node endpoint) to hold the Anthropic API key server-side — it can't live in client code. This also becomes our hosting choice (see Phase 3). |
| 1.2 | Replace the fake `setTimeout` recommender with a real Claude call | Upgrade | `Plan.jsx`'s "AI Plan Recommender" is currently hardcoded if/else logic — swap it for a real API call through the new backend, same pattern as the Fuel app. |
| 1.3 *(stretch)* | AI reasoning for injury substitutions | Upgrade | Optional — same backend endpoint, richer explanations than the current static `INJURY_SWAPS` map. Cut if time-tight. |

## Phase 2 — Turn It Into an "App" · Mon Jul 13 – Sun Jul 19

| # | Chunk | Type | Notes |
|---|-------|------|-------|
| 2.1 | PWA setup — manifest, service worker, install icons | Build | This is what makes it installable to a phone home screen and feel like a real app without touching an app store. |
| 2.2 | App icon & branding assets | Build | Favicon, 192/512 app icons, social share (OG) image — I'll generate these with Canva. |
| 2.3 | Rest timer between sets | Add | Small, high-value feature lifters expect. |
| 2.4 | Warm-up weight calculator | Add | Given a working weight, suggests warm-up set weights. |
| 2.5 | Polish pass — loading/empty states, transitions | Update | Cosmetic finishing touches across all 6 pages. |

## Phase 3 — Domain, Hosting, Legal · Mon Jul 20 – Sun Jul 26

| # | Chunk | Type | Notes |
|---|-------|------|-------|
| 3.1 | **Buy a domain** | **Buy (you)** | e.g. `gainzapp.com` / `trygainz.com` — roughly $12–20/yr. I can shortlist name/availability options when we get here; you complete the purchase. |
| 3.2 | Deploy to Vercel + connect domain + SSL | Move/Build | Free tier covers this comfortably at launch traffic levels. |
| 3.3 | Privacy Policy + Terms of Use pages | Add | Needed because profile/goal data now leaves the device to hit the Claude API. I'll draft plain-language versions — have a lawyer glance at them before you scale this into a real business. |
| 3.4 | Lightweight, privacy-friendly analytics | Add | Vercel Analytics or Plausible so you can see launch-day traffic. |

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
| Hosting (Vercel free tier) | $0 |
| Claude API usage (recommender calls) | Usage-based, likely a few $/month at low volume |
| Analytics (optional, Plausible) | $0 (Vercel Analytics) or ~$9/mo (Plausible) |
| **Total to launch** | **~$15–30** |

Native app store costs ($99/yr + $25) are deferred to Phase 6 and not required for the Aug 3 launch.
