# Admin Write E2E Local QA Guide

This guide covers the scripted local admin write smoke test. It verifies CSRF, login, `/api/me`, code update/verify/restore, news update/verify/restore, logout, and final unauthenticated state.

## Backend Environment

```powershell
$env:DATABASE_URL="postgres://postgres:postgres@localhost:5432/nte_database"
$env:SERVER_DATA_MODE="db"
$env:ENABLE_LOCAL_AUTH="1"
$env:LOCAL_AUTH_SECURE_COOKIE="0"
$env:ENABLE_LOCAL_ADMIN_WRITES="1"
$env:CORS_ORIGIN="http://localhost:5173,http://127.0.0.1:5173"
npm.cmd run server:dev:db
```

## Smoke Test Environment

```powershell
$env:LOCAL_ADMIN_EMAIL="admin@example.test"
$env:LOCAL_ADMIN_PASSWORD="your-local-admin-password"
$env:VITE_API_BASE_URL="http://localhost:4000"
npm.cmd run smoke:admin-writes
```

Keep the smoke test target local. The script rejects non-local hosts.

## What The Script Does

1. Confirms backend is reachable and in DB mode.
2. Fetches CSRF.
3. Logs in with local admin credentials.
4. Verifies `/api/me` is authenticated.
5. Updates an existing code reward summary.
6. Verifies code persistence through public `/api/codes`.
7. Restores the original code reward summary.
8. Updates an existing news title.
9. Verifies news persistence through public `/api/news`.
10. Restores the original news title.
11. Logs out with CSRF.
12. Verifies `/api/me` is unauthenticated.

## Restore Safety

The script captures original values before mutation and restores them after verification. It does not create, delete, or mutate ids/slugs/external ids. If a restore step fails, inspect the summary and restore the displayed entity manually against the local database only.

## Browser QA Companion

Use `http://localhost:5173/dev/admin` with `VITE_ENABLE_DEV_ADMIN_PANEL=1` to run the same flow manually in the app. Do not mix `localhost` and `127.0.0.1` during cookie-auth QA unless the exact frontend origin and API base URL are intentionally paired.

## Troubleshooting

- 401: credentials are wrong or local admin is not bootstrapped.
- 403: missing/invalid CSRF or missing permission.
- 501: local auth or admin writes are disabled.
- Unreachable: backend is not running at `VITE_API_BASE_URL`.

## Guarantees

- No production auth is enabled.
- No public registration is enabled.
- No new admin write endpoints are used.
- No token, cookie, CSRF, or password is stored in browser storage.
