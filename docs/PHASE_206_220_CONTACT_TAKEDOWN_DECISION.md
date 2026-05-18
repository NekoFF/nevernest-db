# Phase 206-220 Contact And Takedown Decision

Date: 2026-05-18

## Decision

Public beta launch is blocked until a private contact/takedown channel is selected.

## Recommendation

Use a dedicated project email controlled by the maintainer or project team.

GitHub issues can be acceptable for public bug reports, data corrections, and source review requests. They are not sufficient for private legal, licensing, privacy, or takedown requests because those reports may need confidential handling.

## Where To Add The Channel

After the channel is selected, update:

- `src/pages/LegalInfoPage.jsx` contact page copy.
- `docs/PUBLIC_BETA_LAUNCH_CHECKLIST.md`.
- `docs/PUBLIC_BETA_RELEASE_RUNBOOK.md`.
- `docs/PHASE_206_220_PUBLIC_BETA_GO_NO_GO.md` or the latest go/no-go packet.
- `public/robots.txt` only if the contact/sitemap policy changes after a canonical domain is chosen.

## App Copy Update

The Contact page was updated to clarify that public project workflows are acceptable for public corrections/bugs, while private legal, licensing, and takedown requests still need a dedicated project contact before beta launch.

No real email was invented.
