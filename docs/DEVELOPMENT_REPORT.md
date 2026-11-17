# Original development and verification notes

> Historical project-maintainer report preserved from the initial repository README. Measurements, provider availability and test results below were reported by the original development process; they have not been independently reproduced by this documentation update. Do not use them as current operational or clinical evidence.

# LIMITLESS

**Beyond Boundaries. Towards Better Health.**

A health-education and personal wellness application: traditional healthcare knowledge with its safety and evidence intact, medicinal-plant safety, yoga and meditation, nutrition, personal tracking, reminders, emergency guidance, a live hospital locator and an AI assistant with a server-side multi-provider core.

Built with Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Motion, GSAP, Lucide and Recharts.

---

## Run it

```bash
npm install
cp .env.example .env.local   # then fill in the provider keys you have
npx next dev -p 3200        # port 3000 may already be in use on this machine
```

Production check:

```bash
npx tsc --noEmit
npm run build
npm run start -- -p 3200
```

Node 18+ is required (the AI routes use `AbortSignal.timeout`).

---

## What is implemented

| Area | Status |
| --- | --- |
| Design system: three themes, liquid glass, tokens, responsive shell | Implemented and verified in a browser |
| Cinematic intro (GSAP, once per session, skippable, reduced-motion aware) | Implemented and verified |
| Dashboard with real logged data only | Implemented and verified |
| Traditional healthcare library (14 entries, references, evidence levels) | Implemented and verified |
| Medicinal plant database incl. poisonous species and lookalikes | Implemented and verified |
| AI plant scanner (OpenRouter vision, live) | Implemented and tested against the live provider |
| Yoga, pranayama, meditation with timers | Implemented and verified |
| Nutrition guide, recipes, filters, allergen notes | Implemented and verified |
| Health tracker with validated logging and charts | Implemented and verified |
| Reminders with in-app due checks and notification permission | Implemented; background delivery requires a native build |
| Emergency SOS, numbers, contacts, medical card, first aid | Implemented and verified |
| Hospital locator on live OpenStreetMap data | Implemented; tested with a location query |
| LIMITLESS AI chat (OpenRouter → Groq → Gemini → OpenAI failover) | Implemented and tested against live providers |
| AI action registry (navigate, theme, language, text size) with audit log | Implemented and verified |
| Voice input (Web Speech) and spoken replies (speech synthesis) | Implemented; depends on browser support |
| Learning centre, quizzes, in-app learning record | Implemented and verified |
| Government schemes with official links | Implemented and verified |
| Offline library, service worker, PWA manifest, icons | Implemented and verified |
| Privacy policy, terms, disclaimer, data export and deletion | Implemented and verified |
| Custom domain + public deployment | **Not done — intentionally awaiting domain approval** |

### Deliberately not shipped

- **User accounts, email verification, Google sign-in, cloud sync.** There is no Supabase (or other) backend configured, so no account system was fabricated. Health data is device-local with export and deletion.
- **A community feed.** Unmoderated health discussion requires authentication, moderation and reporting infrastructure. The community page provides reviewed education and official reporting channels instead.
- **Push notifications while the app is closed.** Web notifications only fire while a tab is open; a Capacitor build is required for true background reminders.
- **Automatic medical measurements from a phone camera.** Not clinically valid, so it is not offered.
- **Full translations for all 22 languages.** English, Telugu and Hindi interface strings are translated; the rest are selectable and fall back to English. Library content is English. Medical text is not machine-translated silently.

---

## Design system

LIMITLESS uses one semantic token contract (`app/globals.css`) rather than per-page colours, so every page, chart, dialog and form follows the same palette.

| Token | Royal Midnight (default) | Royal Ivory | Obsidian Night |
| --- | --- | --- | --- |
| Background | `#08070B` | `#F7F5F8` | `#000000` |
| Sidebar | `#0D0B10` | `#FFFFFF` | `#08070B` |
| Surface / elevated | `#121015` / `#211526` | `#FFFFFF` / `#EBE5EF` | `#121015` / `#1C1821` |
| Primary action | burgundy `#6D001A` | burgundy `#6D001A` | burgundy `#6D001A` |
| AI action | violet `#713B91` | deep violet `#4D0A57` | violet `#713B91` |
| Text / secondary | `#FFFFFF` / `#B8B2BF` | `#121015` / `#59535F` | `#FFFFFF` / `#B8B2BF` |

- **Typography:** Cinzel for the wordmark, Cormorant Garamond for greetings and editorial headings, Inter for interface and healthcare copy. No decorative serif is used for buttons, forms or long text.
- **Shell:** 288–320 px sidebar with grouped care/knowledge/access/account navigation, 84 px utility header (search, language, settings, notifications, emergency), and a five-item glass bottom bar below 1024 px. Active navigation uses a burgundy glass surface, a thin crimson edge and a 3 px left indicator.
- **Surfaces:** Liquid Glass is limited to the floating navigation, dashboard panels, dialogs and AI controls. Long-form healthcare pages use the quieter `surface` tokens.
- **Dashboard composition:** circular infinity badge, time-aware greeting and date, violet AI action, burgundy SOS, eight purpose-built module cards with individual icons and vector motifs, three editorial library cards, a wellness panel with a CSS/SVG droplet and ripples, and a burgundy emergency panel. No stock photography is used, so motifs are original vector drawings rather than unrelated stock images.
- **Motion:** 160–220 ms interaction transitions, 2.4 s skippable intro, CSS-only ambient waves, `prefers-reduced-motion` and the performance-mode engine both suppress decorative animation.

Screens that the brief lists but this build does not contain: splash/onboarding, login, registration and an administrative dashboard. There is no authentication or backend, so those screens are not implemented rather than mocked.

---

## Architecture

```
app/                     routes (30 pages, 3 API routes)
  api/ai/chat            chat proxy with validation + rate limit
  api/ai/status          provider inventory and live probe
  api/scan               vision identification
  library/[slug]         article detail
  learn/[id]             module detail with quiz
components/              shell, design primitives, intro, AI orb, logo
lib/
  ai/core.ts             provider adapters, routing, failover, circuit breaker
  ai/prompt.ts           system prompt + grounding context
  content/*              reviewed healthcare content with references
  health.ts              tracker hooks, wellness summary, saved items
  store.ts               device-local persistence, export, delete
  i18n.ts                language catalogue + dictionaries
public/                  manifest, service worker, icon set
```

### AI CORE

- Providers: OpenRouter (text + vision), Groq, Google Gemini, OpenAI. Configured only when an env key exists.
- Routing: complexity classification (`simple` / `complex`) plus vision requirement → health check → priority order (simple text prefers the lowest-latency configured provider; complex or safety-sensitive text and all vision starts at OpenRouter) → first healthy provider.
- Streaming: OpenAI-compatible providers stream token deltas as `text/plain`; Gemini and any non-streaming path fall back to a single buffered response. The client renders tokens progressively and can abort with the stop button.
- Grounding: `lib/ai/retrieval.ts` scores the curated library and plant set against the user's question and injects at most three articles and two plants, instead of a fixed dump of the whole corpus. This keeps prompts short and citations relevant.
- Metrics: `lib/ai/metrics.ts` keeps real per-instance counters (requests, streams, failovers, rate-limit rejections, per-provider latency and last error) on `globalThis`; `/api/ai/status` returns them and Settings displays them. They are diagnostics, not global analytics.
- Failover: retryable statuses (429/5xx/network) are classified, the provider's circuit breaker opens after two failures for 60s, and the next provider receives the full conversation. Non-retryable errors skip to the fallback.
- Guardrails: system prompt forbids diagnosis, prescribing and invented citations; it forces emergency routing for red flags, forbids dosages, and restricts proposed app actions to an allowlist that the client validates again.
- Limits: 20 chat requests per 5 minutes per IP, 10 scans per 5 minutes, 14 messages and 4,000 characters per message, 5 MB images, 45 s provider timeout.
- Caching: AI responses and scan results are always `Cache-Control: no-store`; they are never placed in a shared cache.
- Keys are server-only (`OPENAI_API_KEY`, `GROQ_API_KEY`, `OPENROUTER_API_KEY`, `GEMINI_API_KEY`). None are exposed as `NEXT_PUBLIC_*`, in client bundles, storage or logs.

Provider credentials verified during development:

- OpenRouter — working (text and vision).
- Groq — working; model `openai/gpt-oss-120b`.
- Google Gemini — key reaches the API; `gemini-3.8-flash` was rate-limited during testing, so it is a fallback.
- OpenAI — **the supplied key is rejected by the API**; the adapter is implemented but awaits a valid key.

### Data and privacy

All health data (profile, tracker, journal, reminders, saved items, learning progress, chat history, action log) is stored in `localStorage` under the `limitless.v1.` prefix. There is no analytics, advertising or tracking script. Messages go to the configured AI provider when you use the assistant; photos go to the vision provider when you scan; coordinates or place text go to OpenStreetMap when you search for hospitals. The full policy is at `/privacy`.

---

## Deployment

The app is **not deployed**, by instruction: launch waits for a custom domain.

Before publishing:

1. Choose and verify a domain (for example `limitlesshealth.app`). Do not register one without the owner's approval.
2. Set `NEXT_PUBLIC_SITE_URL` to the production origin and rebuild.
3. Add provider keys to the host's encrypted environment (never to the repository). `.env.local` is git-ignored; `.env.example` documents the names.
4. Deploy the Next.js build to the chosen host, then connect the domain and confirm HTTPS plus a canonical redirect from the `www` variant.
5. Replace the placeholder "contact" wording in `/privacy` and `/terms` with a monitored address.
6. Re-test sign-in-free flows, the AI endpoints, the locator and the PWA install on the real domain.
7. Have the medical content and emergency numbers reviewed for the target region.

**Domain checklist:** DNS A/ALIAS for apex, CNAME for `www`, TLS certificate issued, HSTS optional, `NEXT_PUBLIC_SITE_URL` updated, sitemap and robots regenerated, Open Graph image added, and the emergency-number review date refreshed.

---

## Mobile and PWA

- `public/manifest.webmanifest` provides standalone install, shortcuts and icons (192/512/maskable/apple-touch).
- `public/sw.js` precaches the shell and offline route, network-first for navigations, cache-first for static assets.
- Capacitor is not installed. A native build would add: background notifications, secure storage for journals, calendar integration and on-device camera capture. Those are prerequisites before claiming mobile parity.

---

## Performance optimisation (measured)

These numbers come from `next build` on this machine before and after the optimisation pass. Only measured values are listed; anything not measured is marked unverified rather than estimated.

### JavaScript per route

A recorded baseline existed only for `/tracker`. Current values for the rest are listed as measured, without a claimed before value.

| Route | Before | After | Change |
| --- | --- | --- | --- |
| `/tracker` first load | 227 kB | **119 kB** | −108 kB (−47.6%) |
| `/tracker` route chunk | 121 kB | **8.51 kB** | −112 kB (−93%) |
| `/ai` first load | not captured | 159 kB | — |
| `/journal` route chunk | not captured | 5.23 kB | — |
| `/nutrition` route chunk | not captured | 6.70 kB | — |
| `/library/[slug]` route chunk | not captured | 2.61 kB | — |
| `/learn/[id]` route chunk | not captured | 4.58 kB | — |
| shared by all routes | 102 kB | 102 kB | unchanged |

What changed:

- Recharts moved into `components/TrackerCharts.tsx`, imported with `next/dynamic` and `ssr: false`; `/tracker` no longer ships a charting library to every visitor.
- GSAP's cinematic intro is a dynamic client-only chunk instead of being pulled into the shell that every route imports, so initial route chunks no longer include it.
- `optimizePackageImports` for `lucide-react` in `next.config.ts`.

### AI latency and payload

- Time from request to first response byte (provider headers): **364 ms** (Groq, local dev) and **921 ms** (OpenRouter, production build), measured with `curl -w`. End-to-end for short answers: 1.65–2.18 s.
- The answer is now rendered token-by-token, so the first words are visible while generation continues, instead of appearing only when the completion finishes. A previous non-streaming request for a similarly short answer took about 2 s end to end.
- Grounding context is scoped per question (max 3 articles + 2 plants) rather than the whole library on every request; prompt size therefore scales with the question. Token counts per request were not recorded, so the exact reduction is **unverified**.
- Device-local state (tracker, journal, chat history) means no database round trip on any page; there is no server database in this deployment.

### Runtime and rendering

- Adaptive performance engine: `auto` detects `deviceMemory`, `hardwareConcurrency`, `connection.saveData` / `effectiveType`, and `prefers-reduced-motion`; the resolved mode is written to `data-perf` on `<html>` and also exposed in Settings as an override. On this machine auto resolved to `performance` (glass blur 9 px instead of the full value) — verified in the browser.
- Animations pause when the tab is hidden (`data-paused`), and reduced-motion removes transitions and the intro.
- Security and cache headers added in `next.config.ts`: CSP (production only), `nosniff`, `DENY` framing, referrer policy, permissions policy; `immutable` caching for `/icons`, revalidation for `/sw.js`, one-hour caching for the manifest. Verified with `curl -I` against the production build.
- Hydration mismatch on the dashboard date is fixed; the production console showed **zero** messages on load.

### Verification of this pass

- `npx tsc --noEmit` — clean.
- `npm test` — **18/18 passing** (`lib/health.test.ts` 11, `lib/ai/retrieval.test.ts` 7).
- `npm run build` — succeeded, 30 routes.
- Production server (`next start`): `/`, `/ai`, `/library/ayurveda`, `/scanner`, `/tracker`, `/hospitals`, `/emergency`, `/settings` return 200; CSP, cache and permissions headers present; streamed chat returned headers `x-ai-provider`, `x-ai-model`, `x-ai-latency` and `Cache-Control: no-store`.
- `/api/ai/status` counters reflected a real chat (1 request, 1 streamed, Groq latency 799 ms), proving the shared metrics store works across separately bundled routes.

Not measured, therefore **unverified**: Lighthouse/Core Web Vitals scores, INP, real-device mobile timings, memory usage, k6 load capacity, database query plans (no database exists), and CDN edge performance. No targets from the brief are claimed as met.

---

## Verification performed

- `npx tsc --noEmit` — clean.
- `npm run build` — succeeded, 30 routes, no errors.
- Dev server: all routes return 200 (`/`, `/ai`, `/library`, `/library/ayurveda`, `/plants`, `/scanner`, `/yoga`, `/nutrition`, `/tracker`, `/hospitals`, `/emergency`, `/reminders`, `/journal`, `/learn`, `/learn/safety`, `/compare`, `/schemes`, `/community`, `/offline`, `/saved`, `/settings`, `/profile`, `/help`, `/privacy`, `/terms`); unknown paths return 404.
- Live chat request returned a grounded answer from OpenRouter in ~2 s.
- Provider probe reported a healthy provider with failover accounting.
- Vision scan correctly refused a blank image and returned `identified: false` with a limitation note.
- Browser console reached zero application errors after fixing a locale-driven hydration mismatch on the dashboard date line.

Design-refresh verification (reference-matched dashboard):

- Full-page render captured at 1920×1200 in the production build; greeting, eight module cards, library cards, wellness panel and emergency panel follow the reference order and proportions.
- Computed layout at 1920 px: sidebar 320 px, dashboard grid `838 px / 518 px`; at 390 px: sidebar and desktop header hidden, mobile top bar and five-item bottom bar shown, no horizontal overflow (`scrollWidth - innerWidth = -11`, scrollbar allowance).
- All three themes switched in the browser: Royal Midnight (`#08070B` background), Royal Ivory (`#F7F5F8` background, white fields, dark text), Obsidian Night (`#000000`). No console errors in any theme.
- Water ripples verified at 104 px wide and centred on the droplet (orb centre 1279, ripple centre 1279).
- Browser console: zero messages on `/`, `/library` and `/ai` after the service-worker cache version was bumped to `limitless-v2`.
- `npx tsc --noEmit` clean; `npm test` 18/18; `npm run build` succeeded (30 routes).

Not performed: a full Playwright suite, cross-browser matrix, two-account data-isolation tests (no accounts exist), real payment/auth flows, accessibility audit tooling, and Lighthouse/Core Web Vitals measurement. No performance scores are claimed. Pixel-perfect equivalence with the reference image is not claimed: screenshots were compared by eye at 1920 px, no image-diff tooling was run, and the reference's photographic botanical imagery is replaced with original vector motifs because no licensed photography is bundled.

---

## Known limitations

1. Device-local storage is not encrypted at rest by the app and is lost when browser data is cleared. There is no multi-device sync.
2. The supplied OpenAI key is invalid; only OpenRouter, Groq and Gemini can serve requests today.
3. Emergency numbers and scheme details need regional review before production, and the app never places a call itself.
4. Hospital results depend on OpenStreetMap completeness and include no ratings, waiting times or confirmed services.
5. AI and plant identification can be wrong; both are presented as hypotheses with explicit escalation steps.
6. Reminders only fire while a tab is open.
7. `/ai` is now the heaviest route at 159 kB first load; the Recharts and GSAP chunks load only where they are used.
8. No Redis, Sentry, OpenTelemetry, k6 or hosted database is configured, so distributed caching, APM, load testing and SQL tuning from the brief are not implemented; in-process counters are the only real telemetry.
9. Intro and glass effects honour reduced motion, but very old browsers without `backdrop-filter` get the solid fallback.

---

## Attribution

- Medical references: WHO, US NCCIH, NIH Office of Dietary Supplements, EMA herbal monographs, Memorial Sloan Kettering, PubMed-indexed literature, Government of India (MoHFW, AYUSH, NHA). Per-article citations appear in the app.
- Maps and place data: © OpenStreetMap contributors, available under the ODbL. Geocoding by Nominatim; facility queries by the Overpass API.
- Icons: Lucide (ISC). Charts: Recharts (MIT). Motion (MIT), GSAP (standard licence), Next.js and React (MIT).
- No stock photography is used. Plant and recipe cards use typographic plates drawn in CSS and SVG so no unlicensed imagery is presented.
