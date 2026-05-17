# Seed DB Preview Report

Generated: 2026-05-17T02:41:46.051Z

## Database

- Host: localhost
- Database: nte_database
- Sanitized URL: postgres://localhost:5432/nte_database

No writes were performed. This command only inspected table existence and row counts.

## Summary

- Planned seed rows: 1801
- Existing DB rows across inspected tables: 1759
- Empty tables: 5
- Non-empty tables: 29
- Missing tables: 0
- Skipped tables: 8
- Future local import rows currently allowed by policy: 1759
- Blocked rows: 42

## Table Comparison

| Plan Table | DB Table | Planned Rows | Existing Rows | Difference | Status | Note |
| --- | --- | ---: | ---: | ---: | --- | --- |
| elements | elements | 6 | 6 | 0 | non_empty |  |
| arcTypes | arc_types | 5 | 5 | 0 | non_empty |  |
| rarities | rarities | 3 | 3 | 0 | non_empty |  |
| roles | roles | 10 | 10 | 0 | non_empty |  |
| tags | tags | 15 | 15 | 0 | non_empty |  |
| stats | stats | 28 | 28 | 0 | non_empty |  |
| mediaAssets | media_assets | 126 | 126 | 0 | non_empty |  |
| characters | characters | 18 | 18 | 0 | non_empty |  |
| characterRoles | character_roles | 20 | 20 | 0 | non_empty |  |
| characterTags | character_tags | 47 | 47 | 0 | non_empty |  |
| characterStats | character_stats | 240 | 240 | 0 | non_empty |  |
| characterSkills | character_skills | 16 | 16 | 0 | non_empty |  |
| characterSkillScaling | n/a | 0 | n/a | n/a | skipped | No DB table mapping exists for this preview step. |
| characterMaterials | character_materials | 42 | 0 | 42 | empty | Draft material references need source verification and canonical material review before import. |
| materials | materials | 0 | 0 | 0 | empty | Material catalog seed rows are draft-only and are not part of the current import plan. |
| characterVoiceActors | character_voice_actors | 4 | 4 | 0 | non_empty |  |
| characterBannerHistory | n/a | 0 | n/a | n/a | skipped | No DB table mapping exists for this preview step. |
| characterQuotes | n/a | 0 | n/a | n/a | skipped | No DB table mapping exists for this preview step. |
| characterPersonalItems | n/a | 0 | n/a | n/a | skipped | No DB table mapping exists for this preview step. |
| characterBuildRecommendations | n/a | 0 | n/a | n/a | skipped | No DB table mapping exists for this preview step. |
| characterTeamRecommendations | n/a | 0 | n/a | n/a | skipped | No DB table mapping exists for this preview step. |
| weapons | weapons | 42 | 42 | 0 | non_empty |  |
| weaponRefinements | weapon_refinements | 210 | 210 | 0 | non_empty |  |
| weaponGrowthStats | weapon_growth_stats | 748 | 748 | 0 | non_empty |  |
| weaponRecommendedCharacters | n/a | 0 | n/a | n/a | skipped | No DB table mapping exists for this preview step. |
| cartridgeSets | cartridge_sets | 12 | 12 | 0 | non_empty |  |
| cartridgeSetBonuses | cartridge_set_bonuses | 24 | 24 | 0 | non_empty |  |
| moduleShapes | module_shapes | 12 | 12 | 0 | non_empty |  |
| modulePieces | module_pieces | 36 | 36 | 0 | non_empty |  |
| cartridgeCompatibleShapes | cartridge_compatible_shapes | 48 | 48 | 0 | non_empty |  |
| moduleStatTemplates | n/a | 0 | n/a | n/a | skipped | No DB table mapping exists for this preview step. |
| vehicles | vehicles | 16 | 16 | 0 | non_empty |  |
| vehicleStats | vehicle_stats | 16 | 16 | 0 | non_empty |  |
| vehicleAcquisition | vehicle_acquisition | 16 | 16 | 0 | non_empty |  |
| tierLists | tier_lists | 1 | 1 | 0 | non_empty |  |
| tierRows | tier_rows | 6 | 6 | 0 | non_empty |  |
| tierEntries | tier_entries | 18 | 18 | 0 | non_empty |  |
| codes | codes | 13 | 13 | 0 | non_empty |  |
| newsPosts | news_posts | 3 | 3 | 0 | non_empty |  |
| guides | guides | 0 | 0 | 0 | empty | Placeholder guide content is not mapped for production import. |
| communityLinks | community_links | 0 | 0 | 0 | empty | Community links do not have a reviewed production seed policy yet. |
| apartmentItems | apartment_items | 0 | 0 | 0 | empty | Apartment items do not have a reviewed production seed policy yet. |

## Empty Tables

- character_materials
- materials
- guides
- community_links
- apartment_items

## Non-empty Tables

- elements: 6
- arc_types: 5
- rarities: 3
- roles: 10
- tags: 15
- stats: 28
- media_assets: 126
- characters: 18
- character_roles: 20
- character_tags: 47
- character_stats: 240
- character_skills: 16
- character_voice_actors: 4
- weapons: 42
- weapon_refinements: 210
- weapon_growth_stats: 748
- cartridge_sets: 12
- cartridge_set_bonuses: 24
- module_shapes: 12
- module_pieces: 36
- cartridge_compatible_shapes: 48
- vehicles: 16
- vehicle_stats: 16
- vehicle_acquisition: 16
- tier_lists: 1
- tier_rows: 6
- tier_entries: 18
- codes: 13
- news_posts: 3

## Missing Or Skipped Tables

- characterSkillScaling: skipped
- characterBannerHistory: skipped
- characterQuotes: skipped
- characterPersonalItems: skipped
- characterBuildRecommendations: skipped
- characterTeamRecommendations: skipped
- weaponRecommendedCharacters: skipped
- moduleStatTemplates: skipped

## Blocked Seed Areas

- characterMaterials: Draft material references need source verification and canonical material review before import.
- guides: Placeholder guide content is not mapped for production import.
- communityLinks: Community links do not have a reviewed production seed policy yet.
- apartmentItems: Apartment items do not have a reviewed production seed policy yet.

## Needs Verification Areas

- characterMaterials: 42
- cartridgeSets: 12
- cartridgeSetBonuses: 24
- cartridgeCompatibleShapes: 48
- vehicleAcquisition: 2
- codes: 13

## Local Import Readiness

Local import is not enabled yet. A future local import would only be safe after reviewed seed staging exists, blocked rows remain excluded, and needs-verification rows are handled according to source policy.
