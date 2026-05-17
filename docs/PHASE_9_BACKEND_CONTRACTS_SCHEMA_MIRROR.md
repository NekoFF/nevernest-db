# Phase 9 Backend Contracts Schema Mirror

Date: 2026-05-16

## What Changed

Phase 9 strengthened the backend scaffold without connecting it to PostgreSQL or the frontend.

Added:

- public API TypeScript contracts
- Valibot validation schemas
- read-only repository interfaces
- service boundary classes
- domain error helpers
- route param/query validation on 501 skeleton endpoints
- broader Drizzle schema mirror

## Validation And Contracts

Contracts live in `server/src/contracts/` and cover common response envelopes plus public summaries/details for taxonomy, media, characters, weapons, cartridges, modules, vehicles, tier lists, and content.

Validation lives in `server/src/schemas/`.

Valibot was chosen because it is small and sufficient for current route params/query validation.

Current validation covers:

- `idOrSlug`
- pagination query
- search query
- basic filters: rarity, element, arc type, role, source status, publication status

No admin mutation schemas were added.

## Repository And Service Summary

Repository interfaces live in `server/src/repositories/`.

Service classes live in `server/src/services/`.

All boundaries are read-only and future-facing. No real DB queries were implemented.

## Schema Mirror Summary

Drizzle schema files now live under `server/src/db/schema/`:

- `common.ts`
- `taxonomy.ts`
- `media.ts`
- `characters.ts`
- `weapons.ts`
- `cartridgesModules.ts`
- `vehicles.ts`
- `tierLists.ts`
- `content.ts`
- `usersAuth.ts`
- `index.ts`

The mirror covers the core public API tables and future auth/admin audit tables. Build Planner persistence and several sparse character child tables remain deferred.

See `docs/PHASE_9_SCHEMA_PARITY.md` for table-by-table coverage.

## Checks

Run after implementation:

- `npm.cmd run server:check`
- `npm.cmd run server:build`
- `npm.cmd run build`
- `npm.cmd run audit:data`
- `npm.cmd run import:dry-run`

## Still Disabled

- PostgreSQL connection
- migrations
- DB writes
- production data import
- real auth
- admin write endpoints
- frontend API integration
- Build Planner persistence changes

## Before Migrations

- Decide final migration ownership between Drizzle and the SQL draft.
- Add missing deferred tables in a dedicated phase.
- Add read repository implementations only against a local/dev database.
- Add no-write migration dry-run checks.
- Preserve source verification gates.

## Recommended Phase 10

Phase 10 should add backend read adapter scaffolding and route response tests without requiring a database:

- route-level contract tests
- repository mock implementations
- service tests for not-implemented and validation behavior
- import payload adapter interfaces
- migration dry-run design document
