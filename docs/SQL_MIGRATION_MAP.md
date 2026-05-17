# SQL Migration Map Draft

Date: 2026-05-16

This is a planning map only. It is not a migration script and does not move the current frontend runtime to SQL.

## Core Taxonomy

| Table | Purpose | Current source mapping | Key columns | Relationships | Migration risk |
| --- | --- | --- | --- | --- | --- |
| `elements` | Element taxonomy | `src/data/gameMeta.jsx`, filters, character records | `id`, `name`, `color`, `sort_order` | Characters, stats, cartridge sets | Low; current ids are stable lowercase except Cognitive appears mostly in stats/modules. |
| `arc_types` | Arc/weapon type taxonomy | `gameMeta.jsx`, `weapons.js`, characters | `id`, `name`, `icon_key`, `sort_order` | Characters, weapons | Low; weapon type currently title-case, character arcType lowercase. |
| `rarities` | Rarity taxonomy | `gameMeta.jsx`, entity records | `id`, `name`, `sort_order`, `color` | Characters, weapons, modules | Low. |
| `roles` | Role taxonomy | `characters/index.js`, `constants.js` | `id`, `name`, `sort_order` | Character roles, filters | Medium; roles/tags overlap. |
| `stats` | Stat registry | `src/data/stats.js`, `statAliases.js` | `id`, `name`, `category`, `value_type`, `sort_order` | All stat-bearing tables | Medium; aliases need cleanup. |

## Characters

| Table | Purpose | Current source mapping | Key columns | Relationships | Migration risk |
| --- | --- | --- | --- | --- | --- |
| `characters` | Core identity/profile | `src/data/characters/*`, `characterSchema.js` | `id`, `slug`, `name`, `rarity_id`, `element_id`, `arc_type_id`, `faction`, `birthday`, `profile_text`, `status` | Taxonomies, media | Medium; records vary in completeness. |
| `character_translations` | Localized fields | Overview language blocks, future data | `id`, `character_id`, `locale`, `field`, `value` | Character | Medium; current translations are display blocks, not normalized. |
| `character_stats` | Stats by level | `stats`, `levelStats` | `character_id`, `level`, `stat_id`, `value`, `source_status` | Character, stats | Medium; many stats are estimated fallback skeletons. |
| `character_roles` | Role join | `roles`, `tags` arrays | `character_id`, `role_id` | Character, roles | Medium; separate tags from roles. |
| `character_skills` | Skills/passives/life skills | `skills`, `skillBlocks.js` | `id`, `character_id`, `name`, `type`, `description`, `max_level` | Character | Medium; skill schema is UI-friendly but not formula-ready. |
| `character_skill_scaling` | Skill level rows | `attributeLevels`, `attributesByLevel` | `skill_id`, `level`, `label`, `value`, `value_type`, `source_status` | Skills | High for damage formulas; source verification needed. |
| `character_materials` | Ascension/skill costs | `materials`, skill materials | `character_id`, `material_id`, `context`, `amount`, `level` | Characters, materials | High; no central material catalog yet. |
| `character_voice_actors` | Voice actor records | `voiceActors`, overview blocks | `character_id`, `locale`, `actor_name`, `source_status` | Character | Medium. |
| `character_banner_history` | Availability | overview banner blocks | `id`, `character_id`, `banner_name`, `start_date`, `end_date`, `version` | Character | Medium; mostly display-block today. |
| `character_quotes` | Quotes/voice lines | overview quote blocks | `id`, `character_id`, `locale`, `quote`, `context` | Character | Medium. |
| `character_personal_items` | Lore/personal items | overview item blocks | `id`, `character_id`, `name`, `description`, `media_asset_id` | Character, media | Medium. |
| `character_build_recommendations` | Recommended weapons/cartridges/stats | `buildBlocks.js`, character build objects | `id`, `character_id`, `target_type`, `target_id`, `priority`, `note` | Weapons, cartridges, stats | Medium; legacy name fallback should be migration-only. |
| `character_team_recommendations` | Team suggestions | `teamBlocks.js`, character teams | `id`, `character_id`, `team_name`, `member_character_id`, `position`, `note` | Characters | Medium. |

## Weapons / Arcs

| Table | Purpose | Current source mapping | Key columns | Relationships | Migration risk |
| --- | --- | --- | --- | --- | --- |
| `weapons` | Core weapon/arc records | `src/data/weapons.js` | `id`, `slug`, `name`, `rarity_id`, `arc_type_id`, `quote`, `main_stat_id`, `main_stat_value`, `sub_stat_id`, `sub_stat_value` | Rarity, arc type, stats, media | Low; data is generated/structured. |
| `weapon_refinements` | Rank effects | `weapons[].refinements` | `weapon_id`, `rank`, `effect_text`, `effect_json` | Weapons | Medium; effects are text-first. |
| `weapon_growth_stats` | Level stat rows | `weapons[].growthScaling` | `weapon_id`, `level`, `atk`, `sub_stat_id`, `sub_stat_value` | Weapons, stats | Low. |
| `weapon_recommended_characters` | Recommended users | `recommendedCharacters` | `weapon_id`, `character_id`, `priority` | Weapons, characters | Medium; currently sparse. |

## Cartridges / Modules

| Table | Purpose | Current source mapping | Key columns | Relationships | Migration risk |
| --- | --- | --- | --- | --- | --- |
| `cartridge_sets` | Cartridge set identity | `src/data/cartridges.js` | `id`, `slug`, `name`, `element_id`, `bonus_category`, `description`, `data_status` | Elements, media | Medium; compatible shapes need verification. |
| `cartridge_set_bonuses` | 2pc/4pc effects | `bonuses`, structured effects | `cartridge_set_id`, `pieces`, `effect_text`, `effect_json`, `is_conditional` | Cartridge sets, stats | Medium. |
| `module_shapes` | Shape catalog | `src/data/moduleCatalog.js` | `id`, `module_type`, `name`, `matrix_json`, `cell_count` | Module pieces, cartridge compatible shapes | Low. |
| `module_pieces` | Generated rarity/shape pieces | `src/data/modulePieces.js` | `id`, `rarity_id`, `module_type`, `shape_id`, `max_level` | Shapes, rarity | Low; can be generated view instead of table. |
| `cartridge_compatible_shapes` | Shape compatibility | `compatibleModules` | `cartridge_set_id`, `module_shape_id`, `slot`, `notes`, `source_status` | Cartridge sets, shapes | High until exact official shapes are verified. |
| `module_stat_templates` | Main/sub stat values | `modulePieces.js`, cartridge stat values | `rarity_id`, `module_type`, `stat_id`, `slot_type`, `value` | Stats, rarity | Medium; merge cartridge and module stat concepts carefully. |

## Vehicles

| Table | Purpose | Current source mapping | Key columns | Relationships | Migration risk |
| --- | --- | --- | --- | --- | --- |
| `vehicles` | Vehicle identity | `src/data/vehicles.js` | `id`, `slug`, `name`, `type`, `description`, `media_asset_id` | Media | Low. |
| `vehicle_stats` | Performance stats | vehicle fields/handling | `vehicle_id`, `max_speed`, `acceleration`, `durability`, `handling_json` | Vehicles | Low. |
| `vehicle_acquisition` | Price/source | `currency`, `price` | `vehicle_id`, `currency`, `price`, `source_status` | Vehicles | Medium for unknown prices. |

## Tier Lists

| Table | Purpose | Current source mapping | Key columns | Relationships | Migration risk |
| --- | --- | --- | --- | --- | --- |
| `tier_lists` | List metadata | `tierList.js`, localStorage personal lists | `id`, `title`, `description`, `updated_at`, `list_type`, `owner_user_id`, `settings_json` | Users later | Medium; current official edits are localStorage. |
| `tier_rows` | Tier row labels/colors | `tiers[]` | `id`, `tier_list_id`, `label`, `subtitle`, `color`, `sort_order` | Tier lists | Low. |
| `tier_entries` | Character placements | `characterIds` | `tier_list_id`, `tier_row_id`, `character_id`, `position` | Characters | Low. |
| `user_tier_lists` | User-owned lists later | localStorage personal lists | `id`, `user_id`, `tier_list_id`, `visibility` | Users | Future. |

## Build Planner

| Table | Purpose | Current source mapping | Key columns | Relationships | Migration risk |
| --- | --- | --- | --- | --- | --- |
| `build_drafts` | Saved build metadata | Build Planner localStorage | `id`, `user_id`, `name`, `version`, `active_slot_index`, `created_at`, `updated_at` | Users later | Medium. |
| `build_slots` | Team slots | planner `slots[]` | `id`, `draft_id`, `slot_index`, `character_id`, `level`, `weapon_id`, `weapon_level`, `cartridge_id`, `cartridge_rarity` | Characters, weapons, cartridges | Medium. |
| `build_slot_modules` | Placed modules | planner `modules[]` | `id`, `slot_id`, `module_shape_id`, `rarity_id`, `x`, `y`, `main_stat_id`, `substats_json` | Module shapes, stats | Medium. |
| `build_slot_stats` | Cached final stats | calculator output | `slot_id`, `stat_id`, `value`, `source_breakdown_json` | Stats | Future optimization. |
| `build_effect_toggles` | Conditional effects | future abilities/awakening/passive toggles | `slot_id`, `effect_id`, `enabled`, `stacks` | Effects | High; not implemented yet. |
| `saved_builds` | Published/community builds | future | `id`, `draft_id`, `visibility`, `rating` | Users | Future. |

## Media

| Table | Purpose | Current source mapping | Key columns | Relationships | Migration risk |
| --- | --- | --- | --- | --- | --- |
| `media_assets` | Images/icons/videos | `mediaRegistry.js`, `assetHelpers.js`, public assets | `id`, `entity_type`, `entity_id`, `kind`, `path`, `alt`, `status`, `source_url`, `license_note`, `width`, `height` | All entities | Medium; aliases must be explicit. |

## Content

| Table | Purpose | Current source mapping | Key columns | Relationships | Migration risk |
| --- | --- | --- | --- | --- | --- |
| `guides` | Guide articles | `GuidesPage.jsx` placeholder | `id`, `slug`, `title`, `category`, `status`, `author_user_id` | Users later | High; no real data yet. |
| `guide_sections` | Guide body sections | future | `guide_id`, `heading`, `body`, `sort_order` | Guides | Future. |
| `codes` | Redeem codes | `src/data/codes.js` | `id`, `code`, `reward_summary`, `status`, `start_date`, `end_date`, `source_url` | None | Low/medium; dates empty. |
| `news_posts` | News feed | `src/data/news.js` | `id`, `slug`, `title`, `description`, `category`, `date`, `source_url`, `image_asset_id`, `featured`, `pinned` | Media | Medium; seed is placeholder. |
| `community_links` | Community resources | Community placeholder/sidebar | `id`, `label`, `url`, `category`, `status` | None | High; no model yet. |
| `apartment_items` | Housing items later | Apartments placeholder | `id`, `name`, `category`, `description`, `price`, `media_asset_id` | Media | Future. |

## Users / Admin Later

| Table | Purpose | Current source mapping | Key columns | Relationships | Migration risk |
| --- | --- | --- | --- | --- | --- |
| `users` | Accounts | `src/auth` scaffold only | `id`, `email`, `display_name`, `created_at`, `status` | Drafts, tier lists, admin logs | Future backend work. |
| `roles` | Role taxonomy | `authModel.js` constants | `id`, `name`, `permissions_json` | Users | Future. |
| `user_roles` | Role join | future | `user_id`, `role_id` | Users, roles | Future. |
| `sessions` | Auth sessions | future backend | `id`, `user_id`, `expires_at`, `created_at` | Users | Must be backend-only. |
| `admin_logs` | Audit trail | future | `id`, `admin_user_id`, `entity_type`, `entity_id`, `action`, `before_json`, `after_json`, `created_at` | All admin actions | Important before real admin launch. |

## Phase 2.5 Data Cleanup Mapping Notes

These notes are confirmed from the Phase 2.5 additive cleanup files. They do not represent a live migration.

| Area | Current cleanup file | SQL mapping note | Remaining risk |
| --- | --- | --- | --- |
| Media aliases | `src/data/mediaAliases.js` | Import original filename-derived ids as trace metadata, but link `media_assets.entity_id` to the alias-resolved canonical entity id. | Low; aliases are explicit, but filenames can be cleaned later. |
| Media assets | `src/data/mediaRegistry.js` | `entity_id` should use `resolvedEntityId`; keep `legacy_entity_id` or `source_entity_id` for the original `entityId`. | Medium if SQL import ignores alias resolution. |
| Cartridge compatibility | `src/data/normalizers/normalizeCartridge.js` | Import `cartridge_compatible_shapes.source_status = "needs_verification"` while `dataStatus` remains `missing-compatible-shapes`. | Medium/high until official shape compatibility is verified. |
| Source quality | `src/data/sourceStatus.js` | Use a check constraint or enum for `verified`, `needs_verification`, `estimated`, `placeholder`, `mock`, `unknown`. | Low. |
| Roles/tags | `src/data/taxonomy/roles.js`, `src/data/taxonomy/tags.js` | Use separate `roles`, `tags`, `character_roles`, and `character_tags` tables. | Medium; current seed data still overlaps roles and tags. |
| Stat naming | `src/data/taxonomy/statNaming.js`, `src/utils/statAliases.js` | Use canonical `stats.id` values such as `cognitive_dmg_bonus`; map Mental/Cognitive labels through aliases. | Medium if duplicate `mental_*` rows are introduced later. |
| Materials | `src/data/materialCatalogDraft.js` | Create `materials` only after embedded character/skill costs are extracted and source-verified. | High; catalog is intentionally empty draft. |
