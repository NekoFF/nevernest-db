# Phase 11 Mock Read Endpoints

Date: 2026-05-16

## What Changed

Phase 11 added dependency injection for backend routes and a mock service container. Public read endpoints can now return predictable in-memory mock data when the backend is explicitly started in mock mode.

Default behavior remains safe: without mock services, read routes still return stable `501 Not Implemented` responses.

## Dependency Injection

`buildApp()` now accepts optional dependencies:

```ts
buildApp({
  services,
  mode: 'mock',
})
```

The service container lives in `server/src/services/container.ts`.

Modes:

- `disabled`: default; routes return `501`.
- `mock`: routes use in-memory mock repositories.
- `db`: placeholder only; throws a controlled `NotImplementedError`.

## Mock API Command

```sh
npm.cmd run server:dev:mock
```

This starts the backend with `SERVER_DATA_MODE=mock` without requiring PostgreSQL.

`.env.example` now includes:

```env
SERVER_DATA_MODE=disabled
```

## Mock-backed Endpoints

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

Successful mock responses use:

```json
{
  "ok": true,
  "data": [],
  "meta": {
    "source": "mock",
    "mode": "mock"
  }
}
```

List responses include `meta.count` and the validated query echo.

## Tests Added

Route tests now cover:

- mock character list
- mock character detail
- missing mock character returns `404`
- mock weapons/cartridges/vehicles/tier list/codes/news lists
- default disabled mode still returns `501`
- invalid query still returns validation error

## Still Disabled

- PostgreSQL connection
- migrations
- DB writes
- production data import
- frontend backend integration
- real auth
- admin write endpoints
- user build drafts
- Build Planner runtime changes

## Recommended Phase 12

Phase 12 should add mock-backed route coverage for the remaining public skeletons and introduce response contract snapshots for API consumers, still with no PostgreSQL requirement.
