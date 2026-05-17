# Phase 28-30 Backend DTO Enrichment

Date: 2026-05-17

## Summary

Phase 28-30 enriches DB-backed read DTOs so opt-in API mode receives display-ready fields from the backend before falling back to static frontend records.

Static/localStorage remains the default runtime. AdminMode remains local/static. Build Planner runtime, auth, user accounts, admin writes, production DB, deployment, and data verification policy were not changed.

## Enriched DTOs

- Characters: `rarity`, `element`, `arcType`, `roleLabels`, `tagLabels`, `media`, detail `stats` with stat labels, and `skills`.
- Weapons: `rarity`, `arcType`, `mainStat`, `subStat`, `media`, detail `refinements`, and `growthScaling`.
- Cartridges: `element`, `bonusCategoryLabel`, `media`, detail `bonuses`, and `compatibleShapes`.
- Module shapes: `moduleTypeLabel`.
- Module pieces: `rarity`, `moduleShape`, `moduleTypeLabel`, `mainStat`, and `substats`.
- Vehicles: `vehicleTypeLabel`, `media`, detail `stats`, and `acquisition`.
- Official tier lists: list payloads now include joined `rows`; entries include character external id, slug, name, avatar, and rarity when present.

Existing stable id fields remain in place, including `rarityId`, `elementId`, `arcTypeId`, `statId`, `mediaAssetId`, and `characterId`.

## Pagination Meta

List envelopes still return `meta.count` and the validated `query` echo. They now also include:

- `page`
- `limit`
- `total`
- `hasMore`

`total` is currently the returned row count, not a separate `COUNT(*)` query. This keeps the contract non-breaking while avoiding a heavier pagination implementation in this phase.

## Frontend Mapper Behavior

API mappers under `src/repositories/api/mappers/` now prefer backend-enriched fields first:

- Display refs use `displayName` or `label` before static fallbacks.
- Media paths from backend `media` are preferred for avatar/image/icon fields.
- Weapon and module stat blocks prefer backend stat display fields.
- Tier-list entries prefer backend character external ids and display rows when available.

Static frontend bridging remains in place by `externalId` for fields that are still sparse or absent in the seeded DB.

## Remaining Bridges

- Character/weapon/card copy and some image conventions may still come from static records if DB raw/media rows are missing.
- Cartridge compatibility display still falls back to static records when compatible shape rows are incomplete.
- Official tier list falls back to static tier rows when the DB returns no joined rows or entries.
- Guides, community links, and apartment items are still not wired as frontend API-mode pages.

## Known Limitations

- `meta.total` is not yet a full database total count.
- Media enrichment depends on seeded `media_assets`; no synthetic media values are created.
- Vehicle category/type remains token-based because no vehicle taxonomy table exists yet.
- Module piece substats are exposed from `substats_json` without deeper stat-id normalization.
- No missing official values were invented or marked verified.

## Checks

Run:

```sh
npm.cmd run server:check
npm.cmd run server:test
npm.cmd run build
npm.cmd run server:build
npm.cmd run audit:data
npm.cmd run import:dry-run
npm.cmd run server:seed:preview
```

When a local seeded DB backend is running in DB mode, also run:

```sh
npm.cmd run check:api-client
npm.cmd run server:test:db:seeded
```
