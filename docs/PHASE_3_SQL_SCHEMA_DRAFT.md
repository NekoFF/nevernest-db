# Phase 3 SQL Schema Draft

Date: 2026-05-16

Phase 3 created planning artifacts for a future PostgreSQL backend. It did not connect a database, add backend code, migrate runtime data, change frontend pages, or alter localStorage/Admin Mode behavior.

## Created

- `db/schema.draft.sql`
- `docs/API_BACKEND_PLAN.md`
- `docs/SEED_IMPORT_PLAN.md`
- `docs/PHASE_3_SQL_SCHEMA_DRAFT.md`

## Schema Overview

The draft uses:

- PostgreSQL
- `gen_random_uuid()` internal primary keys
- frontend-stable ids as `external_id` and URL values as `slug`
- `source_status` enum for data quality
- foreign keys for stable relationships
- JSONB where current formulas/effects/planner state are still unstable
- indexes for common lookups and filters
- `created_at` / `updated_at` timestamps and update triggers

## Table Groups

| Group | Tables |
| --- | --- |
| Core taxonomy | `elements`, `arc_types`, `rarities`, `roles`, `tags`, `stats` |
| Media | `media_assets` |
| Characters | `characters`, translations, stats, roles/tags, skills, scaling, materials, voice actors, banners, quotes, items, build/team recommendations |
| Weapons / Arcs | `weapons`, `weapon_refinements`, `weapon_growth_stats`, `weapon_recommended_characters` |
| Cartridges / Modules | `cartridge_sets`, bonuses, `module_shapes`, `module_pieces`, compatible shapes, stat templates |
| Vehicles | `vehicles`, `vehicle_stats`, `vehicle_acquisition` |
| Tier lists | `tier_lists`, `tier_rows`, `tier_entries`, `user_tier_lists` |
| Build Planner | `build_drafts`, `build_slots`, `build_slot_modules`, `build_slot_stats`, `build_effect_toggles`, `saved_builds` |
| Content | `guides`, `guide_sections`, `codes`, `news_posts`, `community_links`, `apartment_items` |
| Users/Admin/Auth | `users`, `auth_accounts`, `auth_roles`, `user_roles`, `sessions`, `admin_logs` |

## Biggest Design Decisions

- Gameplay `roles` and account/admin `auth_roles` are separate to avoid naming collisions.
- Cognitive/Mental stat naming maps to one canonical stat id; duplicate `mental_*` stat ids are blocked by schema check.
- Media keeps original filename-derived ids and resolved canonical entity ids so aliases remain auditable.
- Character detail tables allow sparse import because current character data depth is uneven.
- Skill/refinement/bonus effects are text-first with JSONB reserved for future structured formulas.
- Build Planner is relational where stable, but keeps JSONB for experimental ability/awakening/effect state.
- Module pieces are stored in the draft, but the import plan notes they may later be generated instead.

## Current Frontend Data Mapping

| Frontend source | SQL target |
| --- | --- |
| `src/data/gameMeta.jsx` | `elements`, `arc_types`, `rarities` |
| `src/data/taxonomy/roles.js` | `roles` |
| `src/data/taxonomy/tags.js` | `tags` |
| `src/data/stats.js`, `src/utils/statAliases.js` | `stats` |
| `src/data/mediaRegistry.js`, `src/data/mediaAliases.js` | `media_assets` |
| `src/data/characters/*` | `characters` and character child tables |
| `src/data/weapons.js` | `weapons` and weapon child tables |
| `src/data/cartridges.js` | `cartridge_sets`, `cartridge_set_bonuses`, `cartridge_compatible_shapes` |
| `src/data/moduleCatalog.js`, `src/data/modulePieces.js` | `module_shapes`, `module_pieces`, `module_stat_templates` |
| `src/data/vehicles.js` | `vehicles`, `vehicle_stats`, `vehicle_acquisition` |
| `src/data/tierList.js` | `tier_lists`, `tier_rows`, `tier_entries` |
| `src/data/codes.js` | `codes` |
| `src/data/news.js` | `news_posts` |
| Build Planner localStorage | later `build_drafts` only after user/export flow exists |

## Intentionally Not Implemented

- No live database connection.
- No migration runner.
- No backend server.
- No ORM schema.
- No real auth.
- No frontend runtime migration.
- No data import.
- No UI redesign.

## Remaining Blockers Before Real Import

- Verify all cartridge compatible shapes.
- Normalize current character role/tag strings into separate role and tag joins.
- Extract a real material catalog from embedded material data.
- Improve character data depth consistency.
- Decide review workflow for localStorage admin overrides.
- Model Guides, Community, and Apartments with real content before production import.

## Validation

Completed after creating the draft:

- `npm.cmd run build`: passed with the existing Vite chunk-size warning.
- `npm.cmd run audit:data`: passed with 0 warnings, 0 blockers, 12 cartridge compatibility verification items, and 8 resolved media aliases.

## Recommended Next Phase

Phase 4 should be seed importer design and dry-run validation:

- create a non-runtime import script draft
- validate `getExportDataSnapshot()`
- produce an import dry-run report
- map current normalizers to SQL table payloads
- do not connect production database yet
