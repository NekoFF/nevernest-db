# Phase 9 Schema Parity

Date: 2026-05-16

## Purpose

Phase 9 expands the Drizzle schema mirror under `server/src/db/schema/` for backend contract planning. This is not a migration and was not run against PostgreSQL.

## Mirrored In Drizzle

Core/shared:

- `source_status`
- `publication_status`
- `tier_list_type`
- `visibility_status`

Taxonomy:

- `elements`
- `arc_types`
- `rarities`
- `roles`
- `tags`
- `stats`

Media:

- `media_assets`

Characters/materials:

- `characters`
- `character_roles`
- `character_tags`
- `character_stats`
- `character_skills`
- `materials`
- `character_materials`
- `character_voice_actors`

Weapons:

- `weapons`
- `weapon_refinements`
- `weapon_growth_stats`
- `weapon_recommended_characters`

Cartridges/modules:

- `cartridge_sets`
- `cartridge_set_bonuses`
- `module_shapes`
- `module_pieces`
- `cartridge_compatible_shapes`

Vehicles:

- `vehicles`
- `vehicle_stats`
- `vehicle_acquisition`

Tier lists:

- `tier_lists`
- `tier_rows`
- `tier_entries`
- `user_tier_lists`

Content:

- `guides`
- `guide_sections`
- `codes`
- `news_posts`
- `community_links`
- `apartment_items`

Users/auth/admin:

- `users`
- `auth_roles`
- `user_roles`
- `sessions`
- `admin_logs`

## Not Mirrored Yet

Deferred character/detail tables:

- `character_translations`
- `character_skill_scaling`
- `character_banner_history`
- `character_quotes`
- `character_personal_items`
- `character_build_recommendations`
- `character_team_recommendations`

Deferred module/build planner tables:

- `module_stat_templates`
- `build_drafts`
- `build_slots`
- `build_slot_modules`
- `build_slot_stats`
- `build_effect_toggles`
- `saved_builds`

Deferred auth table:

- `auth_accounts`

## Why Deferred

- Build Planner data remains localStorage/runtime-sensitive and should not be moved into backend contracts until a dedicated persistence phase.
- Character child tables with sparse or missing source data need stronger import payload contracts first.
- `auth_accounts` should wait for a real auth design so password/provider assumptions are not baked in early.
- `module_stat_templates` needs a finalized module stat policy.

## Risks

- The Drizzle mirror is a planning mirror, not the migration source of truth yet.
- Some SQL checks, triggers, comments, and indexes are intentionally not fully mirrored.
- Source verification requirements still block real production seeding.
- Database-backed routes still return `501 Not Implemented`.

## Next Steps Before Migration

- Decide whether Drizzle or SQL draft owns final migration generation.
- Add missing deferred tables intentionally, not mechanically.
- Add migration dry-run tooling that does not touch production.
- Add seed adapter tests using `.generated/import-dry-run/` payloads.
- Verify source-status policies before allowing any row to be marked `verified`.
