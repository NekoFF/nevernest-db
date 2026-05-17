# Phase 18-20 Full-stack Bridge

Generated: 2026-05-17

## Summary

This phase added the next bridge pieces without changing the default runtime:

- Local seed import dry-run was refreshed.
- Confirmed DB seed runtime verification was skipped because Docker/PostgreSQL was unavailable.
- Seeded DB API test coverage was scaffolded behind explicit environment flags.
- Frontend API client and API repositories were added behind `VITE_DATA_SOURCE=api`.
- The frontend still defaults to static/localStorage.

## Seed Runtime Verification

- `docker compose up -d postgres`: failed, `docker` command unavailable.
- `npm.cmd run server:seed:import:local`: passed in dry-run mode with local-only `DATABASE_URL`.
- Planned local import rows: 1767
- Would insert: 1767
- Would update: 0
- Skipped: 42
- Failed: 0
- Transaction: not_started
- Confirmed import: skipped
- Idempotency: skipped

See `docs/SEED_IMPORT_LOCAL_RUNTIME_REPORT.md`.

## DB-backed API Verification

- Runtime DB smoke was skipped because local PostgreSQL could not be started.
- Normal backend tests passed with DB and seeded DB tests skipped by default.
- Added `server/tests/routes/db-mode.seeded.test.ts`.
- Seeded DB tests require `RUN_DB_TESTS=1`, `RUN_SEEDED_DB_TESTS=1`, and a safe local `DATABASE_URL`.

See `docs/DB_BACKED_API_VERIFICATION_REPORT.md`.

## Frontend API Client Scaffold

Added a fetch-based API client and dormant API repositories:

- Base URL: `VITE_API_BASE_URL`
- Data source flag: `VITE_DATA_SOURCE`
- Default mode: `static`
- Experimental API mode: `api`

No pages were switched to API mode in this phase.

See `docs/FRONTEND_API_CLIENT_PLAN.md`.

## Files Changed

- `src/api/apiConfig.js`
- `src/api/apiErrors.js`
- `src/api/client.js`
- `src/api/responseEnvelope.js`
- `src/api/index.js`
- `src/repositories/dataSource.js`
- `src/repositories/api/charactersApiRepository.js`
- `src/repositories/api/weaponsApiRepository.js`
- `src/repositories/api/cartridgesApiRepository.js`
- `src/repositories/api/vehiclesApiRepository.js`
- `src/repositories/api/tierListsApiRepository.js`
- `src/repositories/api/contentApiRepository.js`
- `src/repositories/api/index.js`
- `scripts/check-api-client.mjs`
- `server/tests/routes/db-mode.seeded.test.ts`
- `server/scripts/test-db.mjs`
- `docs/SEED_IMPORT_LOCAL_RUNTIME_REPORT.md`
- `docs/DB_BACKED_API_VERIFICATION_REPORT.md`
- `docs/FRONTEND_API_CLIENT_PLAN.md`
- `docs/PHASE_18_20_FULLSTACK_BRIDGE.md`
- `docs/API_BACKEND_PLAN.md`
- `server/README.md`

Generated/refreshed:

- `docs/IMPORT_DRY_RUN_REPORT.md`
- `docs/SEED_PREVIEW_REPORT.md`
- `docs/SEED_IMPORT_LOCAL_REPORT.md`
- `.generated/import-dry-run/*`
- `.generated/server-seed-preview/seed-plan.json`
- `.generated/server-seed-preview/seed-validation.json`
- `.generated/server-seed-preview/seed-import-local-report.json`

## Still Disabled

- Production DB connections
- Deployments
- Real authentication
- Admin write endpoints
- User account flows
- API as the default frontend runtime
- localStorage import/removal
- AdminMode changes
- Build Planner runtime changes
- Blocked material draft import
- Personal/user/localStorage admin override import

## Checks

- `npm.cmd run server:check`: passed
- `npm.cmd run server:build`: passed
- `npm.cmd run server:test`: passed
- `npm.cmd run build`: passed with existing large chunk warning
- `npm.cmd run audit:data`: passed with existing needs-verification cartridge shape notes
- `npm.cmd run import:dry-run`: passed
- `npm.cmd run server:seed:preview`: passed

DB-specific checks were skipped because Docker/PostgreSQL was unavailable.

## Recommended Next Phase

Phase 21 should be a Docker-enabled local DB verification pass:

- Start local PostgreSQL.
- Run migrations and DB check.
- Capture before counts.
- Run confirmed local seed import twice.
- Capture after counts and idempotency.
- Start backend in DB mode.
- Smoke seeded API endpoints.
- Run seeded DB tests with explicit flags.
- Only then consider wiring one low-risk frontend read page behind `VITE_DATA_SOURCE=api`.
