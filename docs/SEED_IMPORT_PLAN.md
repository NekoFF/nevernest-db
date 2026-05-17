# Seed Import Plan

Date: 2026-05-16

This plan describes a later import path. It does not import data today.

## Source Snapshot

Use `src/data/exportDataIndex.js` later:

```js
import { getExportDataSnapshot } from '../src/data/exportDataIndex.js'
```

The snapshot currently includes static seed data only. It intentionally does not include localStorage admin overrides, personal tier lists, or Build Planner drafts.

## Import Principles

- Import by stable `external_id` or `slug`, never by display name alone.
- Run normalizers before SQL writes.
- Preserve unknown legacy fields in JSONB `raw` or `metadata`.
- Use `source_status` everywhere data quality is uneven.
- Keep import idempotent with upserts.
- Do not import unverified data as `verified`.

## Seed Order

1. Taxonomy
   - `elements`
   - `arc_types`
   - `rarities`
   - `roles`
   - `tags`
   - `stats`

2. Media
   - `media_assets`
   - Use `entity_external_id` for original filename-derived id.
   - Use `resolved_entity_external_id` for canonical entity id after alias resolution.

3. Characters
   - `characters`
   - `character_roles`
   - `character_tags`
   - `character_stats`
   - `character_skills`
   - sparse optional character detail tables as data exists

4. Weapons / Arcs
   - `weapons`
   - `weapon_refinements`
   - `weapon_growth_stats`
   - `weapon_recommended_characters`

5. Cartridges / Modules
   - `cartridge_sets`
   - `cartridge_set_bonuses`
   - `module_shapes`
   - `module_pieces`
   - `cartridge_compatible_shapes`
   - `module_stat_templates`

6. Vehicles
   - `vehicles`
   - `vehicle_stats`
   - `vehicle_acquisition`

7. Tier Lists
   - `tier_lists`
   - `tier_rows`
   - `tier_entries`

8. Content
   - `codes`
   - `news_posts`
   - `guides`
   - `community_links`
   - `apartment_items`

9. User/demo data if needed
   - only after real auth/session design exists

## Media Aliases

Use `src/data/mediaAliases.js` during import.

Policy:

- Store the filename-derived id in `media_assets.entity_external_id`.
- Store the canonical resolved id in `media_assets.resolved_entity_external_id`.
- Keep both values so future cleanup can rename files or rebuild references without losing traceability.

## Source Status

Use `source_status` enum values:

- `verified`
- `needs_verification`
- `estimated`
- `placeholder`
- `mock`
- `unknown`

Cartridge compatibility rows must import as `needs_verification` until source-checked.

## localStorage Admin Overrides

Do not import localStorage by default.

Later options:

- Admin export tool: export overrides to reviewed JSON.
- Review queue: compare local override against current seed/SQL row.
- Import only approved changes with an `admin_logs` entry.

Do not silently merge browser-local edits into production SQL.

## What Should Not Be Imported Yet

- Fake auth users or passwords.
- Personal tier lists from localStorage without a real user account.
- Build Planner drafts from localStorage without user consent/export.
- Cartridge compatible shapes as verified data.
- Empty material catalog rows.
- Placeholder Guides, Community, or Apartments as production content.

## Pre-Import Checks

Before real import:

- `npm.cmd run audit:data`
- export snapshot validation against canonical JSDoc schemas
- duplicate external id/slug checks
- media alias resolution check
- source status report
- dry-run SQL transaction

