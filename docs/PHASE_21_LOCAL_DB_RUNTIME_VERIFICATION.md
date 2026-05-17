# Phase 21 Local DB Runtime Verification

Date: 2026-05-17

## Summary

Phase 21 separates DB integration tests by database state and verifies the seeded local DB read runtime.

No seed data, DB repositories, API response contracts, frontend runtime, auth, admin writes, or production DB behavior were changed.

## DB Test Modes

Empty DB tests now run only when all of these are true:

- `RUN_DB_TESTS=1`
- `RUN_EMPTY_DB_TESTS=1`
- `RUN_SEEDED_DB_TESTS` is not set

Seeded DB tests now run only when:

- `RUN_DB_TESTS=1`
- `RUN_SEEDED_DB_TESTS=1`

If only `RUN_DB_TESTS=1` is set, the test runner skips DB groups and prints which mode flag to use.

## Commands

Empty migrated DB only:

```sh
$env:DATABASE_URL="postgres://postgres:postgres@localhost:5432/nte_database"
npm.cmd run server:test:db:empty
```

Seeded local DB only:

```sh
$env:DATABASE_URL="postgres://postgres:postgres@localhost:5432/nte_database"
npm.cmd run server:test:db:seeded
```

Do not run empty DB tests after seeding unless the local DB was intentionally reset to an empty migrated state.

## Seeded Smoke Results

Current DB-backed API results:

- `GET /api/status`: database configured, mode `db`, dataMode `db`
- `GET /api/characters`: 18 characters
- `GET /api/characters/nanally`: Nanally
- `GET /api/weapons`: DB data
- `GET /api/vehicles`: 16 vehicles
- `GET /api/codes`: 13 codes
- `GET /api/news`: 3 news posts

The seeded DB test now asserts status DB mode, non-empty characters, Nanally detail, non-empty vehicles, 13 codes, and 3 news posts.

## Weapons Count Note

`GET /api/weapons` returning 24 rows is expected because the shared list query schema defaults `limit` to 24. The seed/import count is still 42 weapons/arcs, and `GET /api/weapons?limit=100` returns 42 rows.

This is not a DB repository, query, or import mapping issue. A later phase may add total-count pagination metadata, but no data change is needed for this finding.

## Verification

- `npm.cmd run server:test`: passed
- `npm.cmd run server:test:db:seeded`: passed
- `npm.cmd run server:check`: passed
- `npm.cmd run server:build`: passed
