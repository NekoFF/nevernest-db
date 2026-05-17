# Phase 17 Local Seed Import v1

Date: 2026-05-17

## What Changed

Phase 17 added a local-only seed import command with dry-run as the default mode.

The command can plan and, only with explicit confirmation, write approved seed rows into a local/dev PostgreSQL database after `DATABASE_URL` passes the local safety guard.

No production import, frontend backend switch, authentication, admin write endpoint, user flow, UI redesign, Build Planner runtime change, localStorage change, AdminMode change, or entity id rename was added.

## Command

Dry-run, no writes:

```sh
$env:DATABASE_URL="postgres://postgres:postgres@localhost:5432/nte_database"; npm.cmd run server:seed:import:local
```

Confirmed local import:

```sh
$env:DATABASE_URL="postgres://postgres:postgres@localhost:5432/nte_database"
$env:CONFIRM_LOCAL_SEED_IMPORT="1"
npm.cmd run server:seed:import:local
```

The command refuses unsafe or missing `DATABASE_URL` values. It does not fall back to mock mode.

## v1 Import Scope

Imported when confirmed:

- taxonomy tables
- `media_assets`
- character core rows
- character roles, tags, stats, skills, voice actors
- weapons, refinements, growth stats
- cartridge sets, bonuses, module shapes, module pieces, compatible shapes
- vehicles, stats, acquisition rows
- tier lists, rows, entries
- codes and news posts

Skipped:

- character material draft rows
- material catalog draft rows
- guides
- community links
- apartment items
- users, sessions, auth roles, user roles
- admin logs
- Build Planner drafts
- localStorage overrides
- personal/user data

## Transaction And Upsert Policy

Confirmed import runs inside one transaction.

If a row fails:

- the transaction rolls back
- a failure report is written when possible
- no partial import should remain

Rows are matched by stable keys:

- `external_id` for canonical tables
- composite keys for join/detail tables

Existing `verified` `source_status` values are not downgraded by lower-confidence generated values. Unverified generated data is not marked verified.

## Current Dry-run Result

- `npm.cmd run import:dry-run`: passed with 0 blockers after regenerating payloads.
- `npm.cmd run server:seed:preview`: passed with 1,801 planned rows, 1,759 future local import rows, 42 blocked rows, and 0 blockers.
- Dry-run local import remains the default unless `CONFIRM_LOCAL_SEED_IMPORT=1` is set.

Report:

- `docs/SEED_IMPORT_LOCAL_REPORT.md`
- `.generated/server-seed-preview/seed-import-local-report.json`

## Runtime Status

Confirmed local import was run against `postgres://localhost:5432/nte_database`.

Initial confirmed import after the numeric normalization fix:

- Transaction: committed
- Inserted: 1,759
- Updated: 0
- Skipped: 42
- Failed: 0

Idempotency rerun:

- Transaction: committed
- Inserted: 0
- Updated: 1,759
- Skipped: 42
- Failed: 0

DB-aware preview after import:

- Planned seed rows: 1,801
- Existing DB rows across inspected tables: 1,759
- Missing tables: 0
- Empty tables: 5, all expected blocked or currently unmapped tables

## Numeric Normalization Fix

The failed payload was in the weapon seed group:

- Table: `weapons`
- Row: `good-boys-grand-adventure`
- Field: `sub_stat_value`
- Raw value: `"45%"`

The same displayed percent format also appeared in `weaponGrowthStats` for `good-boys-grand-adventure` at levels 70 and 80.

Seed import now normalizes displayed percent strings for numeric DB columns before insert or update:

- `"45%"` -> `45`
- `"27.5%"` -> `27.5`
- `"12"` -> `12`
- `12` -> `12`

Invalid numeric strings now fail validation before the DB transaction and include table, identifier, field, and raw value in import reports where detectable.

While regenerating seed payloads, blank optional weapon substat growth values for `raging-flames` were stopped at the mapper so they are not emitted as non-null `weapon_growth_stats.value` rows.

The local importer also now:

- writes JSONB arrays and objects explicitly
- allows nullable foreign keys only when the source external reference is also empty
- casts `source_status` update parameters to the enum type for idempotent reruns
- skips `updated_at` touching for join tables that do not have that column

## Still Disabled

- production database connections
- production migrations
- production seed import
- frontend API integration
- real authentication
- admin write endpoints
- user account flows
- Build Planner persistence changes
- localStorage/AdminMode changes

## Recommended Phase 18

Phase 18 can build on the confirmed local import by adding local DB integration assertions for imported row counts and route reads. Production import should remain disabled.
