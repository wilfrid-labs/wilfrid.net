# Change log

Short notes on user-visible changes and decisions. Keep entries brief; detailed setup belongs in the maintenance notes and architecture decisions.

## 2026-11-27

- Configured production `workers.dev` and Worker Version URLs off for the next deployment, preserving the manually attached Custom Domain and deployment-only CI permissions.
- Recorded the live canonical site, completed DNS/DNSSEC migration, and ongoing GitHub Actions operations; distinguished Worker Previews from Version URLs.
- Added deferred PR preview deployment and staging evaluation requirements to the existing TODO backlog. No preview/staging resources or production deployment were created.

## 2026-11-26

- Consolidated documentation by purpose, shortened repeated explanations, and linked shared details to their primary location.

- Added secret-free pull request validation and guarded GitHub Actions deployment to Cloudflare Workers, with SHA-pinned Actions and monthly Dependabot updates.
- Documented CI/CD security decisions, manual GitHub setup, and first-deployment checks. No deployment or remote settings changes were made.
- Clarified Action pins, manual dispatch, Wrangler installation, and the absence of staging. Split initial deployment, security risks, and PR guidance into focused documents.
- Tracked production build/deployment isolation as a security follow-up and documented the maintainer-confirmed availability of private vulnerability reporting.

## 2026-11-17

- Refined the landing page copy, project links and years, colors, and contact layout.
- Added a Calendly booking link and removed the duplicate GitHub link from the header.
- Updated the social preview artwork to match the current headline.
- Reworked email contact: keep the address out of initial page text, offer mail and copy actions, show a temporary copied confirmation, and provide selectable text if clipboard access fails.
- Documented the architecture, maintenance details, and preference for simple, clear, self-documenting code with performance in mind.
