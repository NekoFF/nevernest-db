# Runtime Readiness

Date: 2026-05-17

## Local Database

Start local PostgreSQL:

```sh
docker compose up -d postgres
```

Use a safe local URL:

```sh
$env:DATABASE_URL="postgres://postgres:postgres@localhost:5432/nte_database"
```

Do not point local scripts at a production database.

## Backend DB Mode

Run explicit local DB mode:

```sh
$env:DATABASE_URL="postgres://postgres:postgres@localhost:5432/nte_database"
$env:SERVER_DATA_MODE="db"
npm.cmd run server:dev:db
```

Health checks:

```sh
curl http://127.0.0.1:4000/health
curl http://127.0.0.1:4000/api/status
```

## Frontend Static Mode

Static/localStorage mode is default:

```sh
npm.cmd run dev
```

## Frontend API Mode

API mode is explicit and experimental:

```sh
$env:VITE_DATA_SOURCE="api"
$env:VITE_API_BASE_URL="http://127.0.0.1:4000"
npm.cmd run dev
```

## Checks

Run before public beta candidates:

```sh
npm.cmd run build
npm.cmd run smoke:static
npm.cmd run server:check
npm.cmd run server:build
npm.cmd run server:test
npm.cmd run audit:data
npm.cmd run import:dry-run
npm.cmd run server:seed:preview
```

With backend DB mode running:

```sh
npm.cmd run smoke:api-mode
npm.cmd run server:test:db:seeded
```

Do not run empty DB tests against a seeded database.

## Auth/Admin Runtime Status

`GET /api/me` is available as an auth-disabled scaffold and returns `authenticated: false`.

Administrative writes are gated by `ENABLE_LOCAL_ADMIN_WRITES=1`. Verified via `npm run smoke:admin-writes` against a local DB. Static AdminMode remains browser-local in static mode and must not be treated as backend authorization.

The selected auth path is a local-only admin email/password prototype with backend-owned opaque session cookies. It is disabled by default and only runs when explicitly enabled for local testing. Public login, public registration, production sessions, and admin writes remain disabled.

Phase 44-46 adds the local prototype behind explicit flags. Bootstrap one local admin only against a safe local database:

```sh
$env:DATABASE_URL="postgres://postgres:postgres@localhost:5432/nte_database"
$env:CONFIRM_LOCAL_ADMIN_BOOTSTRAP="1"
$env:LOCAL_ADMIN_EMAIL="admin@example.test"
$env:LOCAL_ADMIN_PASSWORD="Use-A-Strong-Local-Password1!"
npm.cmd run server:auth:bootstrap-local-admin
```

Enable local auth endpoints only while testing locally:

```sh
$env:ENABLE_LOCAL_AUTH="1"
```

Public registration, production auth, and admin content writes remain disabled.

## Public Beta Gate

Before public beta:

- Static mode smoke passes.
- API-mode smoke passes against local seeded DB.
- Legal/info pages are reviewed.
- Security headers plan is converted into host config.
- Large bundle warning is accepted or reduced.
- Mobile/tablet QA is complete.
- Production domain and sitemap policy are approved.
- Auth, admin writes, user accounts, and production DB remain disabled unless a future approved phase changes that policy.
