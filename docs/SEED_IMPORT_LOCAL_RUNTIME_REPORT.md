# Local Seed Runtime Verification Report

Generated: 2026-05-17

## Scope

This report covers local DB seed runtime verification only. No production database was contacted, no deployment was performed, and no user/admin/localStorage data was imported.

## Local Database Availability

- Docker/PostgreSQL status: skipped
- Reason: `docker compose up -d postgres` failed because `docker` is not installed or not available on PATH in this environment.
- Sanitized intended local database: `postgres://localhost:5432/nte_database`
- Local DB only: yes

## Before DB Counts

Skipped. Local PostgreSQL could not be started in this environment, so no live table counts were read and no `.generated/server-seed-preview/db-counts-before.json` artifact was produced.

## Seed Import Dry Run

Command run with a local-only `DATABASE_URL`:

```sh
npm.cmd run server:seed:import:local
```

Result:

- Mode: dry-run
- Planned local import rows: 1767
- Would insert: 1767
- Would update: 0
- Skipped: 42
- Failed: 0
- Blocked rows: 42
- Transaction: not_started
- Report: `docs/SEED_IMPORT_LOCAL_REPORT.md`
- JSON artifact: `.generated/server-seed-preview/seed-import-local-report.json`

The skipped rows are blocked character material draft references. They were not imported and remain blocked pending source verification and canonical material review.

## Confirmed Import

Skipped. Confirmed local import requires a running local PostgreSQL database plus `CONFIRM_LOCAL_SEED_IMPORT=1`. Docker/PostgreSQL was unavailable, so no write transaction was attempted.

## After DB Counts

Skipped. Because no confirmed import ran, no after-counts were collected and no `.generated/server-seed-preview/db-counts-after.json` artifact was produced.

## Idempotency

Skipped. Idempotency requires a successful confirmed import followed by a second confirmed import against the same local DB. Since local PostgreSQL was unavailable, duplicate-row behavior and stable row counts could not be verified in this environment.

## Transaction Status

- Dry-run transaction: `not_started`
- Confirmed import transaction: skipped
- Runtime import report artifact: not generated because runtime import did not run

## Policy Notes

- This phase remained local-only.
- Production database connections remain disabled.
- Blocked material draft rows were not imported.
- localStorage admin overrides, personal/user data, auth/session data, and Build Planner runtime data were not imported.
- Unverified data was not promoted to verified.
