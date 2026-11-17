# Security and privacy

LIMITLESS is an independent health-education and wellness project, not a medical device, diagnostic service or emergency dispatcher.

## Responsible disclosure

Report suspected vulnerabilities privately to the repository maintainer or via GitHub private vulnerability reporting, if enabled. Include affected files, a minimal reproduction with synthetic data and potential impact. Never post live API keys, patient records, personal images, coordinates or exploit details in a public issue.

## Current boundaries

- Health logs, journal, profile and chat history use browser local storage, not encrypted clinical record storage. Clearing browser data may remove records. Exported data may be sensitive.
- AI chat and plant recognition send user-supplied content to configured external providers. Hospital lookup may share location or search text with map services. Avoid entering identifiable health information during testing.
- Provider secrets belong on the server; never use NEXT_PUBLIC_ variables for secret values. Only public origin/configuration should use that prefix. Rotate any previously exposed key.
- Current request limiting is in-process and does not establish distributed protection. Review trusted proxy headers, quotas, request-size limits and access controls before public use.
- AI outputs and photo identification are fallible and cannot validate plant safety, recommend ingestion, diagnose disease or replace professional advice.

## Pre-release review

Before publication, validate dependency advisories, healthcare references, emergency resources for the target region, privacy and contact notices, service-worker cache behavior, provider data handling, accessibility and abuse resistance. No security audit or clinical certification is claimed by this document.
