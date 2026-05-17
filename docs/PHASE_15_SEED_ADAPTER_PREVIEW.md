# Phase 15 Seed Adapter Preview

Date: 2026-05-17

## What Changed

Phase 15 added a backend-side seed adapter contract layer that reads generated import dry-run artifacts and produces a local seed preview report.

This phase does not write to PostgreSQL, import production data, run production migrations, connect the frontend to the backend, add auth, add admin writes, add user flows, or change the frontend runtime.

## Files Added

- `server/src/seed/loadGeneratedPayloads.ts`
- `server/src/seed/seedTypes.ts`
- `server/src/seed/seedValidation.ts`
- `server/src/seed/seedPlan.ts`
- `server/src/seed/seedPreview.ts`
- `server/src/seed/index.ts`
- `server/src/scripts/seedPreview.ts`
- `server/tests/seed/seed.test.ts`
- `docs/SEED_PREVIEW_REPORT.md`
- `.generated/server-seed-preview/seed-plan.json`
- `.generated/server-seed-preview/seed-validation.json`

## Workflow

Run the frontend/static dry-run first:

```sh
npm.cmd run import:dry-run
```

Then generate the backend seed preview:

```sh
npm.cmd run server:seed:preview
```

The preview reads:

- `.generated/import-dry-run/payloads.json`
- `.generated/import-dry-run/payload-summary.json`
- `.generated/import-dry-run/issues.json`

It writes:

- `docs/SEED_PREVIEW_REPORT.md`
- `.generated/server-seed-preview/seed-plan.json`
- `.generated/server-seed-preview/seed-validation.json`

## Validation

The seed adapter validates:

- required external ids
- duplicate external ids per table
- required slugs where generated
- required and allowed `source_status` values
- unresolved references where detectable
- unsafe verified status in known unverified areas
- forbidden admin/user/session/localStorage payloads
- draft or placeholder areas that should not be imported yet

Severity levels:

- `OK`
- `INFO`
- `WARNING`
- `NEEDS_VERIFICATION`
- `BLOCKER`

## Current Preview Summary

- Planned rows: 1809
- Future local import rows: 1767
- Blocked rows: 42
- Blockers: 0
- Warnings: 3
- Needs verification: 97

Blocked rows are character material draft references. They remain available for preview, but are not allowed for future local import until the material catalog and source verification work is complete.

## Still Disabled

- seed writes to PostgreSQL
- production data import
- production database connections
- production migrations
- real authentication
- admin write endpoints
- user account flows
- frontend API switch
- Build Planner runtime changes
- localStorage/AdminMode changes

## Recommended Phase 16

Phase 16 should add a local-only seed staging design and DB-aware preview comparison. It can inspect empty/non-empty local table counts after the local DB guard passes, but actual insert/update/delete seed writes should remain disabled until explicitly approved.
