# Phase 16 DB-aware Seed Preview

Date: 2026-05-17

## What Changed

Phase 16 added an optional DB-aware seed preview command and a seed staging design.

The DB-aware preview:

- requires `DATABASE_URL`
- runs `assertLocalDatabaseUrl()`
- connects only to a local/dev PostgreSQL URL
- checks table existence
- reads table row counts
- compares existing rows to the generated seed plan
- closes the DB connection

It does not insert, update, delete, upsert, import production data, or run migrations.

## Files Added

- `server/src/seed/dbPreview.ts`
- `server/src/scripts/seedPreviewDb.ts`
- `server/tests/seed/seedDbPreview.test.ts`
- `docs/SEED_DB_PREVIEW_REPORT.md`
- `docs/SEED_STAGING_DESIGN.md`
- `docs/PHASE_16_DB_AWARE_SEED_PREVIEW.md`

## How To Run

Baseline preview:

```sh
npm.cmd run import:dry-run
npm.cmd run server:seed:preview
```

DB-aware preview:

```sh
docker compose up -d postgres
npm.cmd run server:db:migrate
npm.cmd run server:db:check
npm.cmd run server:seed:preview:db
```

## What It Checks

At minimum it inspects:

- taxonomy tables
- `media_assets`
- character tables
- material tables
- weapon tables
- cartridge/module tables
- vehicle tables
- tier list tables
- content tables

Missing tables are reported as missing. Preview-only generated groups with no DB mirror are reported as skipped.

## Runtime Status

DB-aware runtime preview was skipped in this environment because Docker/PostgreSQL is not available on PATH.

The non-DB seed preview remains current:

- planned rows: 1809
- future local import rows: 1767
- blocked rows: 42
- blockers: 0
- warnings: 3
- needs verification: 97

## Still Disabled

- seed writes to PostgreSQL
- inserts, updates, deletes, upserts
- production database connections
- production migrations
- production data import
- frontend API switch
- real authentication
- admin write endpoints
- user account flows
- Build Planner runtime changes
- localStorage/AdminMode changes

## Recommended Phase 17

Phase 17 should add a local-only seed staging executor in dry-run mode. It should calculate intended insert/update/skip actions per row without writing, then compare that action plan against the DB-aware preview report.
