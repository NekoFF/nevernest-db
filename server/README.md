# NTE Backend Scaffold

This folder is a safe Phase 8 scaffold for the future Neverness to Everness Community Database backend.

Current stack:

- Node.js
- Fastify
- Drizzle ORM
- PostgreSQL driver
- TypeScript scoped to `server/`
- Valibot for lightweight route validation

## Run Commands

```sh
npm.cmd run server:dev
npm.cmd run server:dev:mock
npm.cmd run server:dev:db
npm.cmd run server:check
npm.cmd run server:build
npm.cmd run server:test
npm.cmd run server:test:db
npm.cmd run server:test:db:empty
npm.cmd run server:test:db:seeded
npm.cmd run server:start
npm.cmd run server:seed:preview
npm.cmd run server:seed:preview:db
npm.cmd run server:seed:import:local
npm.cmd run server:db:check
npm.cmd run server:db:generate
npm.cmd run server:db:migrate
npm.cmd run server:auth:bootstrap-local-admin
```

The server defaults to `127.0.0.1:4000`.

## Working Endpoints

- `GET /health`
- `GET /api/status`

Both endpoints are safe and do not require a database connection.

Route skeleton endpoints validate basic params/query and then return `501 Not Implemented`.

In explicit mock mode, selected public read endpoints return tiny in-memory fixtures:

```sh
npm.cmd run server:dev:mock
```

Mock mode sets `SERVER_DATA_MODE=mock`. PostgreSQL is still not required.

Mock-backed endpoints:

- `GET /api/characters`
- `GET /api/characters/:idOrSlug`
- `GET /api/weapons`
- `GET /api/weapons/:idOrSlug`
- `GET /api/cartridges`
- `GET /api/cartridges/:idOrSlug`
- `GET /api/vehicles`
- `GET /api/vehicles/:idOrSlug`
- `GET /api/tier-lists/official`
- `GET /api/codes`
- `GET /api/news`
- `GET /api/news/:idOrSlug`
- `GET /api/guides`
- `GET /api/guides/:idOrSlug`
- `GET /api/community-links`
- `GET /api/apartments/items`

## Tests

Backend contract tests use Node's built-in test runner through `tsx`.

```sh
npm.cmd run server:test
npm.cmd run server:test:watch
```

The tests use tiny in-memory mock repositories from `server/src/repositories/mock/` and fixtures from `server/tests/fixtures/`. They do not require PostgreSQL and do not import frontend seed data.

Current coverage:

- health/status route shape
- route validation and stable `501` responses
- CSRF validation and session guards
- Shared administrative mutation pipeline
- in-memory rate limiting
- service/repository contract behavior
- response helper and domain error conversion
- Valibot query/param schemas
- mock-backed public read endpoints
- API response contract snapshots in `server/tests/snapshots/`

## Contracts And Boundaries

- API contracts live in `server/src/contracts/`.
- Validation schemas live in `server/src/schemas/`.
- Read-only repository interfaces live in `server/src/repositories/`.
- Mock repositories live in `server/src/repositories/mock/`.
- Local DB read repositories live in `server/src/repositories/db/`.
- Service boundaries live in `server/src/services/`.
- The service container lives in `server/src/services/container.ts`.
- Domain errors live in `server/src/utils/errors.ts`.
- Drizzle schema mirror files live in `server/src/db/schema/`.
- Environment policy is documented in `docs/ENVIRONMENT_CONFIGURATION.md`.

## Intentional Gaps

- No production database connection is opened automatically.
- No migrations run.
- No seed import writes to PostgreSQL.
- No real authentication exists yet.
- No admin write endpoints exist yet.
- DB repositories are read-only and only active in explicit local DB mode.
- Mock repositories exist for tests only.
- The frontend still uses its existing static/localStorage runtime.
- A frontend API client and selected read-only API-mode pages exist, but API mode is experimental and not enabled by default.

## Seed Dry Run

`npm.cmd run server:seed:dry-run` delegates to the existing root import dry-run pipeline and does not write to a database.

## Seed Preview

Phase 15 adds a read-only backend seed adapter preview. Run the static import dry-run first, then generate the backend seed plan:

```sh
npm.cmd run import:dry-run
npm.cmd run server:seed:preview
```

The preview reads `.generated/import-dry-run/` artifacts and writes:

- `docs/SEED_PREVIEW_REPORT.md`
- `.generated/server-seed-preview/seed-plan.json`
- `.generated/server-seed-preview/seed-validation.json`

It validates payload contracts and source-status policy, but it does not write to PostgreSQL.

DB-aware preview is optional and local-only:

```sh
npm.cmd run server:seed:preview:db
```

It requires a safe local `DATABASE_URL`, reads table counts, writes `docs/SEED_DB_PREVIEW_REPORT.md`, and still performs no inserts, updates, deletes, or upserts.

Local seed import v1 is dry-run by default:

```sh
$env:DATABASE_URL="postgres://postgres:postgres@localhost:5432/nte_database"; npm.cmd run server:seed:import:local
```

Confirmed local writes require an explicit flag:

```sh
$env:CONFIRM_LOCAL_SEED_IMPORT="1"; npm.cmd run server:seed:import:local
```

It imports only approved seed-plan rows, skips blocked character material drafts, and writes `docs/SEED_IMPORT_LOCAL_REPORT.md`.

## Local Database Setup

Phase 13 adds a local-only PostgreSQL and Drizzle setup. Start the local database with:

```sh
docker compose up -d postgres
```

Use `.env.example` as the local configuration reference. Do not commit production secrets.

Database commands are guarded by `server/src/db/safety.ts` and only allow clearly local/dev PostgreSQL URLs such as `localhost`, `127.0.0.1`, or the Docker Compose service host `postgres`.

```sh
npm.cmd run server:db:check
npm.cmd run server:db:generate
npm.cmd run server:db:migrate
```

Migration generation writes to `server/drizzle/`. Migration application is still a local-only action and is never run automatically by the app.

After local migrations are applied, start explicit DB read mode with:

```sh
npm.cmd run server:dev:db
```

DB mode returns empty arrays for empty list tables, clean `404 not_found` responses for missing detail rows, and reports `database: "configured"` from `GET /api/status`.

DB integration tests are split by database state. Do not run empty DB tests after seeding unless the local database was reset back to an empty migrated state.

Empty DB tests require an empty migrated local database and only run when `RUN_DB_TESTS=1`, `RUN_EMPTY_DB_TESTS=1`, and `RUN_SEEDED_DB_TESTS` is not set:

```sh
$env:DATABASE_URL="postgres://postgres:postgres@localhost:5432/nte_database"
npm.cmd run server:test:db:empty
```

Seeded DB tests require a confirmed local seed import and only run when `RUN_DB_TESTS=1` and `RUN_SEEDED_DB_TESTS=1` are set against a safe local `DATABASE_URL`:

```sh
$env:DATABASE_URL="postgres://postgres:postgres@localhost:5432/nte_database"
npm.cmd run server:test:db:seeded
```

`npm.cmd run server:test:db` without `empty` or `seeded` mode prints a guidance message and skips both DB groups. The mode-specific scripts set the matching flags for Windows-friendly use.

Current seeded smoke coverage confirms:

- `GET /api/status` reports `database: "configured"`, `mode: "db"`, and `dataMode: "db"`.
- `GET /api/characters` returns seeded rows.
- `GET /api/characters/nanally` returns Nanally.
- `GET /api/weapons` returns DB rows using the default list limit.
- `GET /api/vehicles` returns seeded rows.
- `GET /api/codes` returns 13 rows.
- `GET /api/news` returns 3 rows.

## Phase 18-20 Runtime Status

The local seed import dry-run was refreshed with a local-only `DATABASE_URL`:

- planned local import rows: 1767
- would insert: 1767
- would update: 0
- skipped blocked material rows: 42
- failed: 0

Confirmed local import, DB-backed API smoke, and seeded DB tests now pass in the local seeded database environment. Empty DB tests remain available only for an empty migrated database.

The frontend now has a fetch-based API client under `src/api/`, API repositories under `src/repositories/api/`, and unified read adapters under `src/repositories/unified/`. Characters, character detail, weapons, weapon detail, vehicles, modules/cartridges, cartridge detail, official tier list, codes, and news can opt into DB-backed reads with `VITE_DATA_SOURCE=api`.

Static/localStorage mode remains the default:

```sh
npm.cmd run dev
```

API mode remains explicit and local-only:

```sh
$env:VITE_DATA_SOURCE="api"
$env:VITE_API_BASE_URL="http://127.0.0.1:4000"
npm.cmd run dev
```

API mode expects the backend to be running in explicit DB read mode against a local seeded database. AdminMode editing remains available in static mode and is unavailable in API mode until backend admin writes exist. Build Planner runtime remains static/localStorage.

Smoke the local DB-backed API client with:

```sh
npm.cmd run check:api-client
```

## Phase 28-30 DTO Enrichment

DB read repositories now add non-breaking display fields for API mode. Stable raw id fields remain available, while characters, weapons, cartridges/modules, vehicles, and official tier lists can also return taxonomy labels, media display paths, joined stats/detail rows, compatible shapes, and official tier rows/entries when those rows exist in the local seeded DB.

List envelopes still keep `meta.count` and `meta.query`; they now also expose `page`, `limit`, `total`, and `hasMore`. `total` is currently the returned row count rather than a separate full-table count.

See `docs/PHASE_28_30_BACKEND_DTO_ENRICHMENT.md` for the endpoint-by-endpoint summary and remaining sparse DTO fields.

## Auth/Admin Scaffold

`GET /api/me` returns an explicit unauthenticated envelope while real auth is disabled. Representative admin write skeletons under `/api/admin/characters` return `not_implemented` and perform no database writes.

Phase 44-46 adds a local-only admin bootstrap and session prototype. It remains disabled unless `ENABLE_LOCAL_AUTH=1` is set.

Planning docs:

- `docs/AUTH_ARCHITECTURE_PLAN.md`
- `docs/AUTH_IMPLEMENTATION_DECISION.md`
- `docs/CSRF_STRATEGY.md`
- `docs/RATE_LIMITING_PLAN.md`
- `docs/AUTH_SCHEMA_REVIEW.md`
- `docs/AUTH_LOCAL_PROTOTYPE_TASKS.md`
- `docs/ADMIN_WRITE_POLICY.md`
- `docs/AUTH_SECURITY_CHECKLIST.md`
- `docs/PHASE_37_40_AUTH_ADMIN_SCAFFOLD.md`
- `docs/PHASE_41_43_AUTH_INFRASTRUCTURE_DECISION.md`
- `docs/PHASE_44_46_LOCAL_ADMIN_SESSION_PROTOTYPE.md`

The current implementation is a local-only admin email/password prototype with backend-owned opaque session cookies. Public registration, production authentication, and admin writes remain disabled.

Bootstrap a local admin only against a safe local database:

```sh
$env:DATABASE_URL="postgres://postgres:postgres@localhost:5432/nte_database"
$env:CONFIRM_LOCAL_ADMIN_BOOTSTRAP="1"
$env:LOCAL_ADMIN_EMAIL="admin@example.test"
$env:LOCAL_ADMIN_PASSWORD="Use-A-Strong-Local-Password1!"
npm.cmd run server:auth:bootstrap-local-admin
```

Enable local auth endpoints only for local testing:

```sh
$env:ENABLE_LOCAL_AUTH="1"
npm.cmd run server:dev:db
```

Local auth endpoints:

- `POST /api/auth/local-login`
- `POST /api/auth/logout`

They do not return session tokens in response bodies. The browser receives an `HttpOnly` `nte_session` cookie, and the database stores only the session token hash.

## Next Backend Phase

Continue API-mode coverage for remaining read-only surfaces while keeping production migrations, production import, auth, admin writes, and default frontend API integration disabled until explicitly approved.

### Phase 47-49 Updates
Phase 47-49 replaced placeholder admin guards with real session and role/permission checks for the skeleton admin routes. 
- Missing session returns `401 Unauthorized`.
- Missing permission returns `403 Forbidden`. 
- A valid session with the correct permission returns `501 Not Implemented`. 
A CSRF scaffold (`GET /api/auth/csrf`) and an Audit helper scaffold (`AdminAuditService`) were also added, though real content writes remain disabled.
