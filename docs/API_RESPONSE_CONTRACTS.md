# API Response Contracts

Date: 2026-05-16

## Purpose

This document describes the backend response envelope that future frontend integration must follow. These contracts are currently enforced by backend route snapshot tests and do not require PostgreSQL.

## Success Envelope

```json
{
  "ok": true,
  "data": {},
  "meta": {}
}
```

## List Response

List endpoints return an array in `data`.

```json
{
  "ok": true,
  "data": [],
  "meta": {
    "source": "mock",
    "mode": "mock",
    "count": 1,
    "page": 1,
    "limit": 24,
    "total": 1,
    "hasMore": false,
    "query": {
      "page": 1,
      "limit": 24
    }
  }
}
```

## Detail Response

Detail endpoints return one object in `data`.

```json
{
  "ok": true,
  "data": {
    "externalId": "nanally",
    "slug": "nanally",
    "name": "Nanally"
  },
  "meta": {
    "source": "mock",
    "mode": "mock"
  }
}
```

## Meta Fields

- `source`: current backing source, such as `mock`.
- `mode`: app data mode, such as `mock`.
- `count`: number of rows in a list response.
- `page`: validated list page.
- `limit`: validated list limit.
- `total`: currently the returned row count; full DB total count is deferred.
- `hasMore`: true when the returned row count reaches the requested limit.
- `query`: validated query echo for list endpoints.

## Enriched Read DTOs

DB-backed read DTOs may include display-friendly objects in addition to stable id fields. Existing id fields are not removed.

Examples include:

- Characters: `rarity`, `element`, `arcType`, `roleLabels`, `tagLabels`, `media`, and detail `stats`.
- Weapons: `rarity`, `arcType`, `mainStat`, `subStat`, `media`, `refinements`, and `growthScaling`.
- Cartridges/modules: element, rarity, module shape, bonus/type labels, compatible shapes, and media fields where seeded.
- Vehicles: `vehicleTypeLabel`, `media`, `stats`, and `acquisition`.
- Official tier lists: `rows` with joined entries and character display fields when DB rows exist.

## Error Envelope

```json
{
  "ok": false,
  "status": "not_found",
  "message": "Resource not found."
}
```

## Validation Error

Validation errors use:

```json
{
  "ok": false,
  "status": "validation_error",
  "message": "Invalid route parameters or query.",
  "issues": []
}
```

Snapshot tests sanitize the `issues` array because Valibot issue internals are verbose and may change shape.

## Not Found

Missing detail records return `404` with:

```json
{
  "ok": false,
  "status": "not_found",
  "message": "News post not found."
}
```

## Not Implemented

Disabled/default mode returns `501` for database-backed reads:

```json
{
  "ok": false,
  "status": "not_implemented",
  "message": "Database-backed character list planned for a later phase."
}
```

## Snapshot Files

Snapshots live in `server/tests/snapshots/`:

- `health.json`
- `status.json`
- `characters.list.json`
- `characters.detail.json`
- `weapons.list.json`
- `cartridges.list.json`
- `modules.shapes.list.json`
- `modules.pieces.list.json`
- `vehicles.list.json`
- `tier-list.official.json`
- `codes.list.json`
- `news.list.json`
- `news.detail.json`
- `guides.list.json`
- `guides.detail.json`
- `community-links.list.json`
- `apartments.items.list.json`
- `error.validation.json`
- `error.not-found.json`
- `error.not-implemented.json`

Frontend integration must conform to these envelopes later instead of assuming raw arrays or raw entity objects.
