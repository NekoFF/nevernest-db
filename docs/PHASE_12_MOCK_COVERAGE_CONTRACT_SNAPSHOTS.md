# Phase 12 Mock Coverage Contract Snapshots

Date: 2026-05-16

## What Changed

Phase 12 completed mock-backed coverage for remaining public read route skeletons and added API response contract snapshots.

No PostgreSQL connection, migration, DB write, production import, auth, admin write endpoint, frontend API switch, or Build Planner runtime change was added.

## Newly Mock-backed Endpoints

- `GET /api/modules/shapes`
- `GET /api/modules/pieces`
- `GET /api/news/:idOrSlug`
- `GET /api/guides`
- `GET /api/guides/:idOrSlug`
- `GET /api/community-links`
- `GET /api/apartments/items`

Existing mock-backed endpoints remain:

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

## Mock Data

Tiny backend-only fixtures now include:

- module shapes
- module pieces
- news detail
- guides
- community links
- apartment items

These fixtures do not import frontend seed data or React/UI modules.

## Snapshot Coverage

Snapshot helper: `server/tests/helpers/snapshot.ts`

Snapshot folder: `server/tests/snapshots/`

Snapshots cover:

- health/status
- primary public list/detail success envelopes
- validation error
- not found error
- not implemented error

Dynamic timestamps are sanitized to `<timestamp>`. Validation issue arrays are sanitized to `<issues>`.

## Tests

Backend tests now cover:

- all current mock-backed public reads
- disabled/default mode `501`
- detail `404`
- query and param validation
- response contract snapshots

## Still Disabled

- PostgreSQL connection
- migrations
- DB writes
- production data import
- real authentication
- admin write endpoints
- frontend backend integration
- Build Planner persistence/runtime changes
- localStorage/AdminMode changes

## Recommended Phase 13

Phase 13 should add local-only database readiness checks and migration dry-run design:

- verify `DATABASE_URL` parsing without connecting by default
- add a local-only DB connection smoke command behind explicit opt-in
- document Drizzle migration ownership
- add seed adapter contract tests against generated dry-run payloads
- keep production writes disabled
