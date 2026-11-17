<div align="center">

<img src="docs/assets/limitless-banner.svg" width="100%" alt="LIMITLESS — Beyond Boundaries. Towards Better Health."/>

# LIMITLESS

**Beyond Boundaries. Towards Better Health.**

An integrated health-education and personal wellness web application combining traditional healthcare knowledge, everyday wellness tools and responsible AI-assisted exploration.

![Next.js](https://img.shields.io/badge/Next.js-15-08070B?logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white)
![Status](https://img.shields.io/badge/Status-Development-713B91)

[Features](#application-overview) · [Architecture](#architecture) · [Local setup](#local-development) · [Privacy](#privacy--safety) · [Development report](docs/DEVELOPMENT_REPORT.md)

</div>

---

## Purpose

LIMITLESS explores a single accessible experience for health learning, personal wellness logs and safer engagement with traditional healthcare knowledge. It is designed around a mobile-friendly interface and a server-side AI integration rather than a collection of disconnected tools.

> [!IMPORTANT]
> LIMITLESS is an independent educational project, not a medical device, clinical diagnosis or emergency response service. AI responses and plant recognition can be wrong. Do not consume a plant or make treatment decisions based on app output. Seek qualified medical advice and use local emergency services when appropriate. Production launch approval and current public availability have not been independently verified.

## Application overview

| Module | Experience |
| --- | --- |
| **Health dashboard** | Personal wellness overview, quick navigation and logged-data summaries |
| **Traditional healthcare** | Library of traditional practices, evidence context and references |
| **Medicinal plants** | Plant information, toxicity and lookalike guidance; AI-assisted photo exploration |
| **Yoga and nutrition** | Yoga, breathing, meditation, recipes and nutrition learning |
| **Health tracker** | Water, sleep, activity and other personal logs with visual summaries |
| **Reminders and journal** | Device-local records and reminders while the web app is open |
| **AI assistant** | Server-side provider routing, streamed responses and local library retrieval |
| **Hospitals and emergency** | OpenStreetMap-based facility search and emergency information |
| **Learning and accessibility** | Learning modules, quizzes, language selection, themes and reduced-motion support |
| **Progressive web app** | Installable web manifest and offline-support design |

The initial README reported development verification of these modules. This portfolio update inspected key source files and tests but has not independently reproduced every feature or live external service. English, Telugu and Hindi interface translations are documented; other locales may fall back to English.

## Application preview

The related [LIMITLESS repository](https://github.com/svsramakrishnanaidu-rgb/limitless) contains uploaded dashboard preview files. This repository excludes local preview artifacts by design; no unverified live-site link or screenshot is advertised here.

## Technology stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 15.5.9, App Router, React 19.1 |
| Language | TypeScript |
| Interface | Tailwind CSS 3, Lucide, Motion, GSAP |
| Visualization | Recharts |
| AI | OpenRouter, Groq, Gemini and OpenAI adapters |
| Persistence | Browser localStorage |
| Tests | Vitest |
| Maps | OpenStreetMap / Nominatim / Overpass |

## Architecture

~~~mermaid
flowchart TD
  U[Web or mobile browser] --> UI[Next.js application shell]
  UI --> L[Learning and wellness modules]
  UI --> S[Device-local wellness records]
  UI --> A[Chat and plant scan API routes]
  A --> V[Input validation and request limits]
  V --> R[AI routing and retrieval]
  R --> P[Configured external AI providers]
  UI --> M[OpenStreetMap facility lookup]
  P --> A
  A --> UI
~~~

| Source | Responsibility |
| --- | --- |
| [app/layout.tsx](app/layout.tsx) | Metadata, typography, app shell and preferences |
| [app/page.tsx](app/page.tsx) | Dashboard and module navigation |
| [app/globals.css](app/globals.css) | Shared design system and theme tokens |
| [app/api/ai/chat/route.ts](app/api/ai/chat/route.ts) | Chat input checks, request limiting and streaming |
| [app/api/ai/status/route.ts](app/api/ai/status/route.ts) | Provider inventory and diagnostics |
| [app/api/scan/route.ts](app/api/scan/route.ts) | Plant-image validation and identification |
| [lib/ai/core.ts](lib/ai/core.ts) | Provider adapters and failover |
| [lib/store.ts](lib/store.ts) | Device-local persistence, export and deletion |
| [public/manifest.webmanifest](public/manifest.webmanifest) | PWA metadata and shortcuts |

## Local development

Recommended environment: Git, Node.js 22 LTS and npm.

~~~bash
git clone https://github.com/svsramakrishnanaidu-rgb/limitless.ai.git
cd limitless.ai
npm ci
npm run dev
~~~

Open http://localhost:3000. For a different development port use `npx next dev -p 3200`.

For optional AI integration, copy [the environment template](.env.example) to `.env.local` and fill only the provider credentials you are authorized to use. The template uses empty API-key fields; do not commit real values. External provider availability is not guaranteed.

| Check | Command |
| --- | --- |
| Tests | `npm test` |
| TypeScript | `npm run typecheck` |
| Production build | `npm run build` |
| Run compiled app | `npm run start` |

The repository contains [wellness tests](lib/health.test.ts) and [AI retrieval tests](lib/ai/retrieval.test.ts). The original development report records 18 passing tests; fresh execution results should be checked separately. A build may require network access for Next.js font fetching.

## Troubleshooting AI availability

If the assistant reports that no provider can be reached:

1. Configure at least one authorized server-side credential from `.env.example` in `.env.local` for local development, or in your hosting project's environment settings. Supported adapters are OpenRouter, Groq, Gemini and OpenAI.
2. Restart the local server after changing environment variables. Hosted changes require a separately approved deployment.
3. Check the provider inventory at `/api/ai/status` or Settings. A configured key does not prove that it is valid, funded or authorized for the selected model.
4. Review provider quotas, model permissions and private server logs; do not share actual key values or sensitive health data.

When all providers fail, the chat route returns HTTP 503. This is a diagnostic guide, not evidence that a particular deployed provider has been repaired.

## Visual identity

| Design token | Color |
| --- | --- |
| Royal Midnight | `#08070B` |
| Burgundy | `#6D001A` |
| Violet | `#713B91` |
| Royal Ivory | `#F7F5F8` |
| Obsidian Night | `#000000` |

The existing interface uses three themes, scoped glass surfaces, responsive navigation, a skippable intro and reduced-motion support. Brand graphics in this README are original documentation assets, not application screenshots.

## Privacy & safety

- Wellness records are device-local and not encrypted by the app. No account or cross-device synchronization is provided.
- Chat, photos and location searches may be sent to configured service providers. Use synthetic data for development and do not share identifiable medical details.
- API keys remain server-side; never put them in public environment variables.
- In-process request limiting is not a distributed abuse-protection layer. Public release requires further security and privacy review.
- AI output and image identification are educational hypotheses, not medical or botanical certification.

Read [SECURITY.md](SECURITY.md) for responsible disclosure and release safeguards.

## Reviewer walkthrough

| Scenario | What to check |
| --- | --- |
| Open the dashboard | Navigation, responsive layout, theme contrast and empty states |
| Log a fictional activity | Valid input and device-local persistence |
| Browse a library article | Traceable references and safety context |
| Open the assistant with no provider key | Clear unavailable-service behavior |
| Review plant identification | Uncertainty, safety limitations and invalid image handling |
| Review emergency and hospital pages | Regional accuracy and no misleading claims of dispatch or verified availability |

These are suggested manual review scenarios, not a completed acceptance-test report.

## Roadmap

- [ ] Review dependency security and API abuse controls.
- [ ] Verify regional emergency information and healthcare references.
- [ ] Expand automated tests, accessibility checks and real-device verification.
- [ ] Validate provider behavior, costs, privacy and failure states.
- [ ] Approve a domain and release only after completing deployment review.

## Project documentation

- [Original development and verification report](docs/DEVELOPMENT_REPORT.md) — preserves the original measurements, design details, provider test notes and deployment requirements.
- [Contributing guide](CONTRIBUTING.md) — setup, tests and review expectations.
- [Security policy](SECURITY.md) — privacy and responsible disclosure.

**Repository:** [GitHub / limitless.ai](https://github.com/svsramakrishnanaidu-rgb/limitless.ai) · **Related portfolio:** [BSR Learning](https://github.com/svsramakrishnanaidu-rgb/bsr-learning)

<div align="center"><sub>Traditional knowledge · Everyday wellness · Responsible AI</sub></div>
