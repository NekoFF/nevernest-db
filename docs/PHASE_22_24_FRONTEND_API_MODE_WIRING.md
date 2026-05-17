# Phase 22-24 Frontend API Mode Wiring

Date: 2026-05-17

## Summary

The first read-only frontend pages can now use the existing backend API when `VITE_DATA_SOURCE=api`.

Static/localStorage mode remains the default. AdminMode, Build Planner runtime, auth, admin writes, production DB behavior, and seed data were not changed.

## Pages Wired

- Characters list
- Character detail
- Weapons list
- Weapon detail
- Vehicles list
- Codes
- News list

News detail remains the existing client-side modal flow. It can use list data in API mode, but route-level news detail wiring should wait until that route is needed in the UI.

## Data Source Behavior

Missing `VITE_DATA_SOURCE`, `VITE_DATA_SOURCE=static`, and unknown values resolve to static mode.

API mode is opt-in only:

```sh
$env:VITE_DATA_SOURCE="api"
$env:VITE_API_BASE_URL="http://127.0.0.1:4000"
npm.cmd run dev
```

Static mode:

```sh
$env:VITE_DATA_SOURCE="static"
npm.cmd run dev
```

Or leave `VITE_DATA_SOURCE` unset.

## Backend DB Mode

Run the backend against the local seeded DB only:

```sh
$env:DATABASE_URL="postgres://postgres:postgres@localhost:5432/nte_database"
$env:SERVER_DATA_MODE="db"
npm.cmd run server:dev:db
```

The API smoke script expects the backend to be running in DB mode:

```sh
npm.cmd run check:api-client
```

It checks:

- `/api/status`
- `/api/characters`
- `/api/characters/nanally`
- `/api/weapons?limit=100`
- `/api/vehicles`
- `/api/codes`
- `/api/news`

## Runtime Notes

- Characters, weapons, vehicles, codes, and news show loading, controlled error, and empty states in API mode.
- API repositories unwrap backend response envelopes and return page-compatible arrays or detail objects.
- API DTOs are mapped into frontend view models before page rendering. Character rarity/element/arc type, weapon rarity/type/stat fields, and vehicle type fields use frontend display values instead of raw DB ids.
- Vehicles API mode recomputes visible filters after async API data arrives, so `All` shows all 16 seeded vehicles.
- Phase 25-27 extends the same adapter pattern to Modules / Cartridges and the official tier list.
- Weapons API mode requests `limit=100` so the full seeded weapon list is available instead of the default 24-row page.
- A small development-only API mode indicator appears when Vite runs with `VITE_DATA_SOURCE=api`.
- API mode does not fall back silently to static data after API errors; it shows a controlled error state.

## Still Static-only Or Disabled

- Build Planner runtime remains static/localStorage.
- AdminMode local editing remains available in static mode.
- AdminMode editing is unavailable in API mode because backend admin writes do not exist yet.
- Real authentication, user accounts, and admin write endpoints remain disabled.
- Cartridges/modules, tier lists, guides, community links, and apartment items are not wired to frontend API mode in this phase.

## Known Limitations

- API mode is for local experimental read verification only.
- Production DB and production data are not connected.
- News detail route wiring is deferred.
- API pagination metadata is not surfaced in the current page UI.
- Some DB list DTOs do not yet include joined taxonomy labels or rich raw JSON. API view mappers bridge this using stable frontend static records by `externalId`; backend-side taxonomy joins can replace that bridge in a later phase.

## Verification

- `npm.cmd run server:check`: passed
- `npm.cmd run server:build`: passed
- `npm.cmd run server:test`: passed, with DB integration groups skipped by default
- `npm.cmd run build`: passed, with existing Vite large chunk warning
- `npm.cmd run audit:data`: passed, 0 blockers
- `npm.cmd run import:dry-run`: passed, 0 blockers
- `npm.cmd run server:seed:preview`: passed, 1801 planned rows, 1759 future local import rows, 42 blocked rows
- `npm.cmd run server:test:db:seeded`: passed against local seeded DB
- `npm.cmd run check:api-client`: passed against a temporary local DB-mode backend

API client smoke counts:

- Characters: 18
- Weapons with `limit=100`: 42
- Vehicles: 16
- Codes: 13
- News: 3
