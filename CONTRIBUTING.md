# Contributing to LIMITLESS

## Local development

Use Node.js 22 and npm. Install the committed dependency lockfile with `npm ci`; run `npm run dev`. Copy `.env.example` to `.env.local` only if testing an integration with an authorized provider. Never commit credentials or real health data.

## Checks before opening a pull request

- Run `npm test`, `npm run typecheck` and `npm run build`.
- Describe what changed and include evidence from synthetic-data testing.
- Check mobile and desktop layouts, keyboard interaction, reduced motion and all affected themes.
- Keep medical education references traceable and separate traditional use from evidence of efficacy. Do not introduce diagnostic certainty, medication dosages or unsupported claims.
- Preserve permission prompts and error states; do not add analytics or transmit sensitive information without an explicit design and privacy review.

Deployment and public release require the maintainer's approval.
