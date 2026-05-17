# Phase 77-85: Dev Admin Hardening

Date: 2026-05-17

## Scope

This phase hardens the existing development-only admin QA panel at `/dev/admin`. It does not add public registration, production authentication, production admin, schema changes, or new backend mutation endpoints.

## What Changed

- Dev Admin Panel now shows a runtime checklist for API mode, API base URL, dev flag, CSRF readiness, authentication, and required code/news write permissions.
- Auth state display is safe: authenticated yes/no, user display name, roles, and permissions only.
- CSRF remains only in React memory and is never printed.
- Password remains only in the password input state and is cleared after successful login.
- Login refreshes `/api/me` after success.
- Logout sends the in-memory `X-CSRF-Token`, refreshes `/api/me`, clears CSRF, and resets auth-sensitive QA status.
- Code and News QA now allow selecting an existing item from the API-loaded lists.
- QA status is explicit: idle, updating, verifying, restoring, success/restored, or failed.
- If an update succeeds but restore fails, the page shows a warning with the entity id/slug and original value summary.

## Local Runtime Commands

Backend:

```powershell
$env:DATABASE_URL="postgres://postgres:postgres@localhost:5432/nte_database"
$env:SERVER_DATA_MODE="db"
$env:ENABLE_LOCAL_AUTH="1"
$env:LOCAL_AUTH_SECURE_COOKIE="0"
$env:ENABLE_LOCAL_ADMIN_WRITES="1"
$env:CORS_ORIGIN="http://localhost:5173,http://127.0.0.1:5173"
npm.cmd run server:dev:db
```

Frontend:

```powershell
$env:VITE_DATA_SOURCE="api"
$env:VITE_API_BASE_URL="http://localhost:4000"
$env:VITE_ENABLE_DEV_ADMIN_PANEL="1"
npm.cmd run dev
```

Open `http://localhost:5173/dev/admin`.

## Hostname Rule

Do not mix `localhost` and `127.0.0.1` between the browser, `VITE_API_BASE_URL`, and CORS origin while testing cookie auth. Cookies are host-scoped, so a session created for one hostname may not be sent to the other.

## What The Page Can Do

- Fetch local CSRF.
- Log in with a bootstrapped local admin account.
- Refresh `/api/me`.
- Run update, verify, restore QA cycles for existing codes and news.
- Log out with CSRF protection.

## What Remains Disabled

- Public registration.
- Production authentication.
- Public auth.
- New write endpoints for characters, weapons, modules, vehicles, guides, or users.
- Broad CRUD.
- Production database access.
- Token, cookie, CSRF, or password persistence in browser storage.

## Restore Failure Procedure

If the page reports that restore may be needed, use the displayed entity id/slug and original value summary. Re-run the same QA action after confirming auth/CSRF is still valid, or restore manually against the local database only.

## Final Checks

```powershell
npm.cmd run server:check
npm.cmd run server:build
npm.cmd run server:test
npm.cmd run build
npm.cmd run audit:data
npm.cmd run import:dry-run
npm.cmd run server:seed:preview
npm.cmd run smoke:static
```

With backend DB mode running:

```powershell
npm.cmd run check:api-client
npm.cmd run smoke:api-mode
npm.cmd run smoke:admin-writes
npm.cmd run server:test:db:seeded
```
