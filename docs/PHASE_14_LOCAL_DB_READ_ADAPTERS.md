# Phase 14 Local DB Read Adapters

Date: 2026-05-16

## What Changed

Phase 14 added local-only DB-backed read repository adapters behind explicit `SERVER_DATA_MODE=db`.

The default backend mode is still disabled, mock mode still uses tiny in-memory fixtures, and DB mode is only allowed after `DATABASE_URL` passes the local safety guard.

No seed import, production data write, auth flow, admin write endpoint, frontend API switch, UI change, Build Planner runtime change, localStorage change, or AdminMode change was added.

## DB Read Adapters

Created `server/src/repositories/db/` with read-only Drizzle adapters:

- `DbCharacterRepository`
- `DbWeaponRepository`
- `DbCartridgeRepository`
- `DbModuleRepository`
- `DbVehicleRepository`
- `DbTierListRepository`
- `DbContentRepository`
- `DbMediaRepository`

The adapters only call `select`. They do not insert, update, delete, seed, or run migrations.

## DB Mode

`createServiceContainer({ mode: 'db' })` now:

1. requires `DATABASE_URL`
2. runs `assertLocalDatabaseUrl()`
3. creates the lazy Drizzle client
4. wires DB repositories into existing services

Unsafe or missing URLs fail cleanly. DB mode does not fall back to mock data.

Start local DB mode after local PostgreSQL is running and migrated:

```sh
npm.cmd run server:dev:db
```

## Empty DB Behavior

List endpoints against an empty migrated DB return:

```json
{
  "ok": true,
  "data": [],
  "meta": {
    "source": "db",
    "mode": "db",
    "count": 0
  }
}
```

Detail endpoints return clean `404 not_found` responses without stack traces.

`GET /api/tier-lists/official` remains a list-style endpoint and returns `ok: true` with an empty array when no official tier list exists.

`GET /api/status` reports `database: "configured"` and `mode: "db"` when DB mode is active.

## DB Tests

Normal backend tests skip DB integration tests unless explicitly enabled.

Run DB tests only after starting local PostgreSQL and applying migrations:

```sh
docker compose up -d postgres
npm.cmd run server:db:migrate
npm.cmd run server:db:check
npm.cmd run server:test:db
```

DB tests assume an empty, migrated, local database. They verify empty list behavior, missing detail `404` behavior, and DB mode status metadata.

## Still Disabled

- production database connections
- seed import into PostgreSQL
- DB writes
- real authentication
- admin write endpoints
- frontend API integration
- user account flows
- Build Planner persistence changes
- localStorage/AdminMode changes

## Recommended Phase 15

Phase 15 should add seed adapter contract tests against generated dry-run payloads and a local-only seed preview/import planner. Keep actual seed writes behind explicit approval until the import mapping and source verification blockers are reviewed.
