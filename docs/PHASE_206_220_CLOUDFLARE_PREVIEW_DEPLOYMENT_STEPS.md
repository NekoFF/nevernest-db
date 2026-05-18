# Phase 206-220 Cloudflare Preview Deployment Steps

Date: 2026-05-18

These steps are for a static read-only preview deployment only. Do not launch production from this checklist.

## Cloudflare Pages

1. Open Cloudflare Dashboard.
2. Go to Workers & Pages.
3. Choose Create application.
4. Choose Pages.
5. Choose Connect to Git.
6. Select the GitHub account and the Nevernest/NTE database repository.
7. Select the preview branch to rehearse.
8. Set project name to a temporary preview-safe name.
9. Set Framework preset to `Vite`.
10. Set Build command to `npm run build`.
11. Set Build output directory to `dist`.
12. Leave Root directory as the repository root.
13. Do not add production environment variables.
14. Confirm no `VITE_DATA_SOURCE` is set. Static mode remains default.
15. Confirm no `VITE_API_BASE_URL` is set.
16. Confirm no auth/admin flags are set.
17. Do not add `DATABASE_URL` or production DB secrets.
18. Deploy preview.
19. Open the deployment details and record the preview URL in `docs/PHASE_206_220_PREVIEW_URL_VERIFICATION.md`.
20. Verify `dist/_redirects` and `dist/_headers` were included in the build output.
21. Run direct-route, robots, manifest, and header checks against the preview URL.

## Required Cloudflare Verification

- Direct refresh `/characters/nanally`.
- Direct refresh `/modules/pieces/type-ii-horizontal/s`.
- Direct refresh `/build-planner`.
- Open `/robots.txt`.
- Open `/site.webmanifest`.
- Check headers with `curl -I` or `PREVIEW_URL="..." npm run check:preview-headers`.
- Confirm `/dev/admin` is not linked and renders disabled if opened directly.

## Netlify Alternative

1. Open Netlify.
2. Choose Add new site.
3. Choose Import an existing project.
4. Connect the GitHub repository.
5. Select the preview branch.
6. Set Build command to `npm run build`.
7. Set Publish directory to `dist`.
8. Do not set `VITE_DATA_SOURCE`, API, auth/admin, or database env vars.
9. Deploy preview.
10. Verify `_redirects`, `_headers`, direct route refreshes, static files, and security headers.

## Non-Goals

- No production launch.
- No production database.
- No public registration.
- No production auth.
- No production admin writes.
- No API mode default.
