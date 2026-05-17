# Dev Admin Panel Local QA

The Dev Admin Panel at `/dev/admin` verifies the local admin auth, CSRF, and code/news admin write pipeline from the browser. It is development-only and requires `VITE_ENABLE_DEV_ADMIN_PANEL=1`.

## Backend

```powershell
$env:DATABASE_URL="postgres://postgres:postgres@localhost:5432/nte_database"
$env:SERVER_DATA_MODE="db"
$env:ENABLE_LOCAL_AUTH="1"
$env:LOCAL_AUTH_SECURE_COOKIE="0"
$env:ENABLE_LOCAL_ADMIN_WRITES="1"
$env:CORS_ORIGIN="http://localhost:5173,http://127.0.0.1:5173"
npm.cmd run server:dev:db
```

## Frontend

```powershell
$env:VITE_DATA_SOURCE="api"
$env:VITE_API_BASE_URL="http://localhost:4000"
$env:VITE_ENABLE_DEV_ADMIN_PANEL="1"
npm.cmd run dev
```

Open `http://localhost:5173/dev/admin`.

Use the same browser hostname and API hostname family during one QA run. Do not mix `localhost:5173` with `127.0.0.1:4000` unless CORS and cookies are intentionally configured for that exact combination; cookie auth is host-scoped.

## Verification Steps

1. Confirm the panel only opens when the Vite flag is enabled.
2. Confirm Runtime Checklist shows API mode, API base URL, and Dev Admin flag.
3. Click Fetch CSRF and confirm CSRF readiness is Ready.
4. Log in with the bootstrapped local admin.
5. Confirm `/api/me` displays Authenticated YES, user display name, roles, and permissions.
6. Confirm mutation buttons are enabled only when CSRF, auth, and permissions are present.
7. Select a code item and run Code QA. Expect update, verify, restore, success/restored.
8. Select a news item and run News QA. Expect update, verify, restore, success/restored.
9. Click Logout. Expect `POST /api/auth/logout` 200, `/api/me` authenticated false, and UI Authenticated NO.
10. Confirm no raw cookie, session, CSRF token, or password is visible.
11. Confirm normal site pages still work.

## Disabled Reasons

The panel explains why mutation buttons are disabled:

- missing CSRF
- not authenticated
- missing permission
- no API items loaded
- QA is already running

Server errors are shown safely:

- 401: authentication required
- 403: forbidden, CSRF, or permission problem
- 501: writes disabled or unavailable
- validation error: invalid update body

## Restore Behavior

Each QA action captures the original value, applies a temporary value, verifies through the public API, and restores the original value. If restore fails after update, the page shows a warning with the entity id/slug and original value summary. Restore manually only against the local database if needed.

## Safety Notes

- No public registration.
- No production auth.
- No new write endpoints.
- No create/delete behavior.
- No id, slug, or externalId mutation.
- No token, cookie, CSRF, or password persistence in localStorage, sessionStorage, or IndexedDB.
- Static browser-local AdminMode is untouched.
