# Frontend API Client Plan

Generated: 2026-05-17

## Status

The frontend API client scaffold exists, and the first read-only pages can opt into API-backed reads with `VITE_DATA_SOURCE=api`. The app still defaults to the existing static/localStorage runtime. API mode is experimental and is not enabled by default.

## Enable Experimental API Mode

Use Vite environment variables when intentionally testing API-backed reads:

```sh
VITE_DATA_SOURCE=api
VITE_API_BASE_URL=http://127.0.0.1:4000
```

Allowed `VITE_DATA_SOURCE` values:

- `static`
- `api`

Any missing or unknown value resolves to `static`.

See `docs/ENVIRONMENT_CONFIGURATION.md` for the full frontend/backend environment policy.

## Response Envelope Expectations

Successful backend responses are expected to look like:

```json
{
  "ok": true,
  "data": [],
  "meta": {}
}
```

Error responses are expected to use:

```json
{
  "ok": false,
  "status": "not_found",
  "message": "..."
}
```

The client parses both shapes and throws clean `ApiError` instances for backend errors, HTTP errors, invalid envelopes, and request timeouts.

## Scaffolded Files

- `src/api/apiConfig.js`
- `src/api/apiErrors.js`
- `src/api/client.js`
- `src/api/responseEnvelope.js`
- `src/api/index.js`
- `src/repositories/dataSource.js`
- `src/repositories/api/charactersApiRepository.js`
- `src/repositories/api/weaponsApiRepository.js`
- `src/repositories/api/cartridgesApiRepository.js`
- `src/repositories/api/vehiclesApiRepository.js`
- `src/repositories/api/tierListsApiRepository.js`
- `src/repositories/api/contentApiRepository.js`
- `src/repositories/api/index.js`
- `src/repositories/unified/charactersRepository.js`
- `src/repositories/unified/weaponsRepository.js`
- `src/repositories/unified/vehiclesRepository.js`
- `src/repositories/unified/contentRepository.js`
- `src/repositories/unified/index.js`
- `src/hooks/useAsyncData.js`

## Scaffolded Repositories

- Characters: `/api/characters`, `/api/characters/:idOrSlug`
- Weapons: `/api/weapons`, `/api/weapons/:idOrSlug`
- Cartridges: `/api/cartridges`, `/api/cartridges/:idOrSlug`
- Vehicles: `/api/vehicles`, `/api/vehicles/:idOrSlug`
- Tier lists: `/api/tier-lists/official`
- Content: `/api/codes`, `/api/news`, `/api/news/:idOrSlug`

## Fallback Strategy

The current app remains static-first. Future page wiring should choose the API repositories only when `isApiMode()` returns true, otherwise it should continue using existing static/localStorage repositories.

If an API read fails during an experimental test path, pages should show a controlled error state or fall back to static data only where that fallback is explicit and documented.

API repositories unwrap backend response envelopes before data reaches page adapters. List repository methods return arrays, and detail repository methods return entity objects. Invalid backend shapes fail with clear repository errors such as `Expected characters API data to be an array.`

API DTOs are also mapped into frontend view models before page rendering. The mappers now prefer backend-enriched display fields such as `rarity.displayName`, `element.displayName`, `arcType.displayName`, `mainStat.stat.displayName`, media paths, vehicle `vehicleTypeLabel`, and tier-list entry character labels before falling back to static frontend records by `externalId`. Mapper files under `src/repositories/api/mappers/` keep raw DB ids from leaking into badges, filters, or cards.

Async API-mode pages must include loaded API arrays in filter memo dependencies. Vehicles uses the same static-compatible `type` field and recomputes its visible list when API data arrives, so the `All` filter shows the full seeded vehicle set.

## Pages Wired Behind API Mode

- Characters list and detail
- Weapons list and detail
- Vehicles list
- Modules / Cartridges list and cartridge detail
- Official tier list
- Codes
- News list

Weapons API mode requests `/api/weapons?limit=100` so the full seeded list is shown instead of the default 24-row page.

## Pages Not Switched Yet

Guides, community links, apartment items, Build Planner runtime, route-level news detail, module detail, personal tier lists, auth, admin writes, and user account flows remain static-only or unavailable. AdminMode local editing remains available in static mode and is unavailable in API mode until backend admin writes exist.

## Optional Smoke Script

`scripts/check-api-client.mjs` can smoke selected backend endpoints using Node fetch. It is not part of the normal build and expects a running backend in DB mode. The smoke now reports enrichment signals for character, weapon, cartridge, module, and official tier-list DTOs without failing on documented deferred fields.

## Next Steps

- Add route-level news detail API wiring if the UI grows a stable detail route.
- Continue reducing static-record view-model bridging as more DB media/detail rows are imported.
- Add full-count pagination metadata if API consumers need totals beyond returned row counts.
- Wire deferred placeholder-light pages only after DB mode returns meaningful payloads.
- Add focused frontend tests for unified repositories and API-mode page states.
- Keep static/localStorage as the default until API mode has broader coverage and admin write policy.
