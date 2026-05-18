# Phase 206-220 Public Beta Go/No-Go

Date: 2026-05-18

## Current Decision

Likely NO-GO until preview deployment, host-level headers, mobile screenshots, contact/takedown channel, and active codes verification are complete.

## Ready

- Static/localStorage frontend remains default.
- API mode remains opt-in only.
- Cloudflare/Netlify-compatible `_redirects` and `_headers` are added.
- Local build passes.
- Local preview direct-route checks pass.
- `robots.txt` and `site.webmanifest` are present in build output.
- Preview sitemap excludes `/dev/admin`.
- Static smoke and data checks pass.
- Contact copy now states that private legal/takedown requests need a dedicated project channel.

## Blocks

- Actual Cloudflare/Netlify preview deployment has not been performed.
- Host-level SPA fallback has not been verified on a real preview URL.
- Host-level security headers have not been verified on a real preview URL.
- Manual mobile screenshot QA has not been run.
- Private contact/takedown channel has not been selected.
- Active codes have not been manually verified.
- Image/media rights review remains open.
- Rollback rehearsal has not been performed on a preview deployment.

## Can Ship With Caveat

- Static browse pages if direct-route and mobile QA pass.
- Build Planner only as a prototype/local theorycrafting tool.
- Tier List only as reference wording, not official ranking.
- Codes only if active statuses are verified or visibly caveated.
- Source-pending data only if labels remain visible.

## Must Remain Disabled

- Production auth.
- Public registration.
- Production admin writes.
- Production database mutations.
- API mode as default.
- Broad CRUD.
- Character/weapon/module/vehicle/tier-list write endpoints.
- Silent localStorage import.

## Exact Next Human Actions

1. Deploy a Cloudflare Pages preview from the selected branch.
2. Record the preview URL in `docs/PHASE_206_220_PREVIEW_URL_VERIFICATION.md`.
3. Run direct-route refresh checks on the preview URL.
4. Run `PREVIEW_URL="..." npm run check:preview-headers`.
5. Complete manual mobile screenshot QA for the listed viewports/routes.
6. Select a private contact/takedown channel and update Contact/legal docs.
7. Verify all active codes or keep/remove active claims accordingly.
8. Review image/media rights.
9. Rehearse preview rollback.
10. Re-run the release command suite before launch approval.
