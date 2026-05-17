# Phase 8 Backend Scaffold

Date: 2026-05-16

## What Changed

Phase 8 added a safe backend scaffold without changing the current frontend runtime.

Chosen stack:

- Node.js
- Fastify
- TypeScript scoped to `server/`
- Drizzle ORM
- PostgreSQL driver
- dotenv

Package setup: root-managed scripts and dependencies. This keeps the frontend and backend in one lockfile while leaving the frontend Vite build unchanged.

## Files Created

- `.env.example`
- `server/README.md`
- `server/tsconfig.json`
- `server/scripts/db-generate-placeholder.mjs`
- `server/scripts/db-migrate-placeholder.mjs`
- `server/src/app.ts`
- `server/src/index.ts`
- `server/src/config/env.ts`
- `server/src/db/client.ts`
- `server/src/db/schema/taxonomy.ts`
- `server/src/db/schema/index.ts`
- `server/src/plugins/cors.ts`
- `server/src/routes/public.ts`
- `server/src/routes/characters.ts`
- `server/src/routes/weapons.ts`
- `server/src/routes/cartridges.ts`
- `server/src/routes/vehicles.ts`
- `server/src/routes/tierLists.ts`
- `server/src/routes/content.ts`
- `server/src/routes/routeHelpers.ts`
- `server/src/scripts/seedDryRun.ts`
- `server/src/schemas/.gitkeep`
- `server/src/services/.gitkeep`
- `server/src/repositories/.gitkeep`
- `server/src/utils/apiResponse.ts`

## Scripts Added

- `npm.cmd run server:dev`
- `npm.cmd run server:check`
- `npm.cmd run server:build`
- `npm.cmd run server:start`
- `npm.cmd run server:seed:dry-run`
- `npm.cmd run server:db:generate`
- `npm.cmd run server:db:migrate`

The DB scripts are placeholders and do not contact a database.

## Endpoints Created

Working endpoints:

- `GET /health`
- `GET /api/status`

Route skeletons returning `501 Not Implemented`:

- `GET /api/characters`
- `GET /api/characters/:idOrSlug`
- `GET /api/weapons`
- `GET /api/weapons/:idOrSlug`
- `GET /api/cartridges`
- `GET /api/cartridges/:idOrSlug`
- `GET /api/modules/shapes`
- `GET /api/modules/pieces`
- `GET /api/vehicles`
- `GET /api/vehicles/:idOrSlug`
- `GET /api/tier-lists/official`
- `GET /api/codes`
- `GET /api/news`
- `GET /api/news/:slug`
- `GET /api/guides`
- `GET /api/guides/:slug`
- `GET /api/community-links`
- `GET /api/apartments/items`

## Architecture

`buildApp()` creates a Fastify app, registers CORS, public health/status routes, and future API route skeletons.

The DB layer exposes a lazy `createDbClient()` factory. Importing backend modules does not connect to PostgreSQL. Health/status routes report `database: "not_connected"` unless a future phase explicitly creates a client.

The Drizzle schema mirror is intentionally tiny and limited to taxonomy examples. Full schema parity with `db/schema.draft.sql` is a later phase.

## Intentionally Disabled

- Real PostgreSQL connection
- Production data import
- Real migrations
- Frontend API integration
- Real authentication
- Admin write endpoints
- localStorage or AdminMode changes
- Build Planner runtime changes

## Next Phase Recommendation

Phase 9 should add backend validation contracts and a broader Drizzle schema mirror while keeping database writes disabled:

- route response schemas
- read-service interfaces
- repository contracts
- schema parity plan against `db/schema.draft.sql`
- no-op import adapter boundaries
