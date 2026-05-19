# Phase 336-355 AdminMode Lockdown Reviewer Handoff

Reviewer copy: Browser-local AdminMode was exposed in production preview through the top-right account menu. It is now gated behind local Vite dev plus `VITE_ENABLE_BROWSER_ADMIN_MODE=1`. Production builds ignore old admin localStorage mode and override collections, so public users should not see AdminMode toggles or edit controls. `/dev/admin` was not enabled.

## Changed Files

- `src/admin/adminModeGate.js`
- `src/admin/adminModeGate.test.js`
- `src/admin/AdminModeContext.jsx`
- `src/components/Topbar.jsx`
- `docs/PHASE_336_355_ADMINMODE_PRODUCTION_LOCKDOWN.md`
- `docs/PHASE_336_355_UNSAFE_SURFACE_VERIFICATION.md`
- Main beta/security readiness docs

## Commands Run

- PASS `node --test src/admin/adminModeGate.test.js`
- PASS `npm.cmd run test:character-intel`
- PASS `npm.cmd run test:corpus`
- PASS `npm.cmd run test:search`
- PASS `npm.cmd run server:check`
- PASS `npm.cmd run server:build`
- PASS `npm.cmd run server:test`
- PASS `npm.cmd run build`
- PASS `npm.cmd run smoke:static`
- PASS `npm.cmd run sitemap:preview`
- PASS `npm.cmd run audit:data`
- PASS `npm.cmd run import:dry-run`
- PASS `npm.cmd run server:seed:preview`
- PASS `$env:PREVIEW_URL='https://nevernest-db.pages.dev'; npm.cmd run check:preview-headers`

## Before

Production preview account menu showed `Admin Mode` / `Exit Admin Mode`, rendered local edit controls, and honored localStorage admin state/overrides.

## Now

Production preview should hide AdminMode menu controls, keep `isAdminMode=false`, ignore old admin localStorage state, ignore local override collections, and hide edit controls.

## Local Dev Enablement

Run Vite dev with `VITE_ENABLE_BROWSER_ADMIN_MODE=1`. `/dev/admin` still separately requires `VITE_ENABLE_DEV_ADMIN_PANEL=1`.

## Backend / Schema / Auth

- `/dev/admin` changed: No.
- Backend endpoints changed: No.
- DB schema changed: No.
- Auth behavior changed: No.
- Admin writes changed: No.

## Remains Disabled

Production auth, public registration, production admin writes, production DB mutations, broad CRUD, user accounts, comments, submissions, silent localStorage import, and API mode as default.

## Preview Redeploy / Manual Verification

Redeploy the static build to Cloudflare Pages, then verify home, account menu, `/characters`, `/characters/nanally`, `/characters/lacrimosa`, `/dev/admin`, old-localStorage state, and incognito state. Public beta remains blocked until this manual preview verification is recorded.

## Risks / TODOs

Cloudflare env must not set `VITE_ENABLE_BROWSER_ADMIN_MODE` or `VITE_ENABLE_DEV_ADMIN_PANEL`. Add screenshot or browser QA evidence after redeploy.
