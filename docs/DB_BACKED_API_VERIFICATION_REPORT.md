# DB-backed API Verification Report

Generated: 2026-05-17

## Scope

This report covers DB-backed read API verification for the local-only backend mode. No production database was contacted.

## Local DB Status

- Confirmed local seed import: completed against `postgres://localhost:5432/nte_database`
- Seeded DB test mode: passing
- Empty DB test mode: still available, but only for an empty migrated DB
- Frontend runtime: unchanged; API mode is not enabled by default

Do not run empty DB tests after seeding unless the DB was reset back to an empty migrated state.

## DB Test Modes

Empty DB tests require:

- `RUN_DB_TESTS=1`
- `RUN_EMPTY_DB_TESTS=1`
- `RUN_SEEDED_DB_TESTS` unset
- an empty migrated local DB

Seeded DB tests require:

- `RUN_DB_TESTS=1`
- `RUN_SEEDED_DB_TESTS=1`
- a seeded local DB

`npm.cmd run server:test:db` without either mode selected prints guidance and skips both DB groups.

## Seeded Smoke Results

Current seeded DB-backed API smoke results:

- `GET /api/status`: `database: "configured"`, `mode: "db"`, `dataMode: "db"`
- `GET /api/characters`: 18 characters
- `GET /api/characters/nanally`: Nanally
- `GET /api/weapons`: DB data, default page returns 24 rows
- `GET /api/weapons?limit=100`: 42 rows
- `GET /api/vehicles`: 16 vehicles
- `GET /api/codes`: 13 codes
- `GET /api/news`: 3 news posts

The `24` row result for `GET /api/weapons` is expected pagination behavior, not seed loss. The shared list query schema defaults `limit` to 24. The DB repository returns 42 weapon rows when the request raises the limit.

## Verification Performed

- `npm.cmd run server:test`: passed with DB integration tests skipped by default
- `npm.cmd run server:test:db:seeded`: passed against the seeded local DB
- `npm.cmd run server:check`: passed
- `npm.cmd run server:build`: passed

## Remaining DB/API Notes

- Empty DB tests should be run only before seeding or after an intentional local reset.
- Seeded DB tests should remain opt-in until a deterministic DB fixture/reset strategy exists.
- Production import, auth, admin writes, and default frontend API integration remain disabled.
