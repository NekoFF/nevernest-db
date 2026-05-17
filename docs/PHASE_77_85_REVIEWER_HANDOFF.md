# Phase 77-85 Reviewer Handoff

## Copy For Reviewer
Dev-only `/dev/admin` was hardened for local admin QA.
Logout now sends in-memory CSRF and returns the UI to authenticated NO.
The page shows safe runtime/auth/permission checklists.
Code/news QA supports selecting existing API-loaded items.
QA still only updates, verifies, and restores existing code/news fields.
No secrets are displayed or persisted in browser storage.
No backend endpoints or DB schema were added.
Public auth, registration, production admin, and broad CRUD remain disabled.
Run local QA with the documented localhost-only frontend/backend commands.
Recommended next phase: browser automation for the dev admin happy path.

## Changed Files

- `src/pages/DevAdminPage.jsx`
- `src/auth/apiAuthClient.js`
- `src/auth/AuthContext.jsx`
- `server/tests/frontend/apiAuthClient.test.ts`
- `docs/PHASE_77_85_DEV_ADMIN_HARDENING.md`
- `docs/PHASE_77_85_REVIEWER_HANDOFF.md`
- `docs/DEV_ADMIN_PANEL_LOCAL_QA.md`
- `docs/RUNTIME_READINESS.md`
- `docs/SECURITY_BASELINE.md`
- `docs/ADMIN_WRITE_E2E_LOCAL_QA.md`

## Checks Run And Results

- `npm.cmd run server:check`: PASS
- `npm.cmd run server:build`: PASS
- `npm.cmd run server:test`: PASS
- `npm.cmd run build`: PASS
- `npm.cmd run audit:data`: PASS
- `npm.cmd run import:dry-run`: PASS
- `npm.cmd run server:seed:preview`: PASS
- `npm.cmd run smoke:static`: PASS
- `npm.cmd run check:api-client`: PASS against local DB backend
- `npm.cmd run smoke:api-mode`: PASS against local DB backend
- `npm.cmd run server:test:db:seeded`: PASS against safe local DB
- `npm.cmd run smoke:admin-writes`: NOT RUN; `LOCAL_ADMIN_EMAIL` and `LOCAL_ADMIN_PASSWORD` were not present in this shell

## Manual QA Result

Not completed in this shell because local admin credentials were not available. Browser QA should verify Fetch CSRF, Login, Authenticated YES, Code QA success/restored, News QA success/restored, Logout 200, `/api/me` authenticated false, and UI Authenticated NO.

## Route And Gating

- Route: `/dev/admin`
- Sidebar link appears only when `import.meta.env.DEV && VITE_ENABLE_DEV_ADMIN_PANEL === "1"`.
- The page renders a disabled state when the flag is missing.

## Auth And CSRF Behavior

- CSRF is fetched from `GET /api/auth/csrf`.
- CSRF token is held only in React memory.
- Login uses cookie-backed local auth and then refreshes `/api/me`.
- Logout sends `X-CSRF-Token`, clears in-memory CSRF after success, and refreshes `/api/me`.
- No raw cookies, session tokens, CSRF tokens, or passwords are displayed.

## Code And News QA Behavior

- The page loads existing codes/news through the current content repository.
- The user selects a target from a small dropdown.
- The QA cycle updates one safe field, verifies via public read API, and restores the original value.
- Buttons stay disabled until CSRF, authentication, and the required permission are present.

## Restore Behavior

If restore fails after a successful update, the page shows a warning with the entity id/slug and original value summary. No create, delete, id, slug, or externalId mutation is performed.

## Safety Guarantees

- No public registration.
- No production authentication.
- No new backend mutation endpoints.
- No DB schema changes.
- No localStorage/sessionStorage/IndexedDB token storage.
- No wildcard CORS with credentials.
- Static/localStorage AdminMode remains untouched.

## Risks And TODOs

- Manual browser QA still depends on a seeded local DB and bootstrapped local admin.
- Future phase should add browser automation for `/dev/admin` using a local test profile.
- If restore fails, a local-only manual restore may be required using the displayed summary.

## Recommended Next Phase

Phase 86: automated local browser QA for the Dev Admin Panel happy path and restore-failure simulation.
