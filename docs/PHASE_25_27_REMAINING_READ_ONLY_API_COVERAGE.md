# Phase 25-27 Remaining Read-only API Coverage

Date: 2026-05-17

## Summary

Phase 25-27 extends opt-in frontend API mode to the remaining safe read-only surfaces without changing the default static/localStorage runtime.

Static remains default. AdminMode local editing remains static-only. Build Planner, auth, user accounts, admin writes, production DB, deployment, DB schema, and seed data were not changed.

## Newly API-mode Capable

- Modules / Cartridges list
- Cartridge detail
- Official Tier List

Existing API-mode pages remain wired:

- Characters list and detail
- Weapons list and detail
- Vehicles
- Codes
- News list

## Deferred Static-only Areas

- Guides
- Community links
- Apartment items
- Build Planner
- Personal/user tier lists
- Module detail

Guides, community links, and apartment items currently return empty DB payloads in local DB mode, so wiring them would only replace intentional static placeholders with empty API shells. Personal tier lists and Build Planner stay local/static until auth, user accounts, and write policy exist.

## Modules / Cartridges

API mode reads:

- `/api/cartridges`
- `/api/cartridges/:idOrSlug`
- `/api/modules/shapes`
- `/api/modules/pieces`

The page maps API DTOs into the same frontend view-model fields used by the static page. Cartridge display values are bridged by stable `externalId` against existing static frontend records so badges, filters, set bonuses, and shape labels do not show raw DB ids.

Current DB-backed API-mode smoke:

- Cartridge sets: 12
- Module shapes: 12
- API module pieces: 24
- Visible S-rank module pieces: 12
- Cartridge detail: Fireflies and the Forest

The Modules page still presents 12 cartridge sets + 12 module shapes as indexed catalog items, matching the existing UI model.

## Tier List

API mode reads `/api/tier-lists/official`.

Phase 28-30 enriched the DB endpoint to return joined official tier rows and character placements when rows exist in the local DB. The frontend still keeps the static official tier list bridge as a fallback for sparse DB payloads. Personal tier lists remain local.

Current API-mode smoke:

- Official list title: Official Character Tier List
- API tier rows available when seeded `tier_rows` exist
- API tier entries available when seeded `tier_entries` exist

## Smoke Script

`npm.cmd run check:api-client` now checks:

- `/api/status`
- `/api/characters`
- `/api/characters/nanally`
- `/api/weapons?limit=100`
- `/api/vehicles`
- `/api/codes`
- `/api/news`
- `/api/cartridges`
- `/api/modules/shapes`
- `/api/modules/pieces`
- `/api/tier-lists/official`

Deferred endpoints are reported as deferred instead of failing the normal smoke:

- `/api/guides`
- `/api/community-links`
- `/api/apartments/items`

## Run Modes

Backend DB mode:

```sh
$env:DATABASE_URL="postgres://postgres:postgres@localhost:5432/nte_database"
$env:SERVER_DATA_MODE="db"
npm.cmd run server:dev:db
```

Frontend static mode:

```sh
npm.cmd run dev
```

Frontend API mode:

```sh
$env:VITE_DATA_SOURCE="api"
$env:VITE_API_BASE_URL="http://127.0.0.1:4000"
npm.cmd run dev
```

## Known Limitations

- API mode is still experimental and opt-in only.
- Some DB DTO fields still depend on seeded media/detail rows being present.
- Official tier-list static bridging remains as a fallback for empty or sparse DB rows/entries.
- Guides, community links, and apartment items are intentionally deferred while DB payloads are empty.
- Admin writes, auth, user accounts, production DB, and Build Planner API runtime remain disabled.
