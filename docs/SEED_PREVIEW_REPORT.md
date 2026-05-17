# Seed Preview Report

Generated: 2026-05-17T21:48:40.892Z

## Summary

- Snapshot source: exportDataIndex-node-safe
- Total planned rows: 1801
- Preview rows: 1801
- Future local import rows: 1759
- Blocked rows: 42
- Blockers: 0
- Warnings: 3
- Needs verification: 97
- Can preview: yes
- Can future local import without review: no

This report is read-only. It does not write to PostgreSQL.

## Seed Plan

| Order | Group | Table | Rows | Preview | Future Local Import | Blocked Reason |
| --- | --- | ---: | ---: | --- | --- | --- |
| 1 | taxonomy | elements | 6 | yes | yes |  |
| 2 | taxonomy | arcTypes | 5 | yes | yes |  |
| 3 | taxonomy | rarities | 3 | yes | yes |  |
| 4 | taxonomy | roles | 10 | yes | yes |  |
| 5 | taxonomy | tags | 15 | yes | yes |  |
| 6 | taxonomy | stats | 28 | yes | yes |  |
| 7 | media | mediaAssets | 126 | yes | yes |  |
| 8 | characters | characters | 18 | yes | yes |  |
| 9 | characters | characterRoles | 20 | yes | yes |  |
| 10 | characters | characterTags | 47 | yes | yes |  |
| 11 | characters | characterStats | 240 | yes | yes |  |
| 12 | characters | characterSkills | 16 | yes | yes |  |
| 13 | characters | characterSkillScaling | 0 | yes | yes |  |
| 14 | characters | characterMaterials | 42 | yes | no | Draft material references need source verification and canonical material review before import. |
| 15 | characters | characterVoiceActors | 4 | yes | yes |  |
| 16 | characters | characterBannerHistory | 0 | yes | yes |  |
| 17 | characters | characterQuotes | 0 | yes | yes |  |
| 18 | characters | characterPersonalItems | 0 | yes | yes |  |
| 19 | characters | characterBuildRecommendations | 0 | yes | yes |  |
| 20 | characters | characterTeamRecommendations | 0 | yes | yes |  |
| 21 | weapons | weapons | 42 | yes | yes |  |
| 22 | weapons | weaponRefinements | 210 | yes | yes |  |
| 23 | weapons | weaponGrowthStats | 748 | yes | yes |  |
| 24 | weapons | weaponRecommendedCharacters | 0 | yes | yes |  |
| 25 | cartridgesModules | cartridgeSets | 12 | yes | yes |  |
| 26 | cartridgesModules | cartridgeSetBonuses | 24 | yes | yes |  |
| 27 | cartridgesModules | moduleShapes | 12 | yes | yes |  |
| 28 | cartridgesModules | modulePieces | 36 | yes | yes |  |
| 29 | cartridgesModules | cartridgeCompatibleShapes | 48 | yes | yes |  |
| 30 | cartridgesModules | moduleStatTemplates | 0 | yes | yes |  |
| 31 | vehicles | vehicles | 16 | yes | yes |  |
| 32 | vehicles | vehicleStats | 16 | yes | yes |  |
| 33 | vehicles | vehicleAcquisition | 16 | yes | yes |  |
| 34 | tierLists | tierLists | 1 | yes | yes |  |
| 35 | tierLists | tierRows | 6 | yes | yes |  |
| 36 | tierLists | tierEntries | 18 | yes | yes |  |
| 37 | content | codes | 13 | yes | yes |  |
| 38 | content | newsPosts | 3 | yes | yes |  |
| 39 | content | guides | 0 | yes | no | Placeholder guide content is not mapped for production import. |
| 40 | content | communityLinks | 0 | yes | no | Community links do not have a reviewed production seed policy yet. |
| 41 | content | apartmentItems | 0 | yes | no | Apartment items do not have a reviewed production seed policy yet. |

## Blocked Or Review-gated Areas

- characterMaterials: Draft material references need source verification and canonical material review before import.
- guides: Placeholder guide content is not mapped for production import.
- communityLinks: Community links do not have a reviewed production seed policy yet.
- apartmentItems: Apartment items do not have a reviewed production seed policy yet.

## Validation Issues

| Severity | Area | Table | Message |
| --- | --- | --- | --- |
| NEEDS_VERIFICATION | source-verification | cartridgeCompatibleShapes | Cartridge compatible shape is allowed for preview but needs trusted source verification before production import. |
| NEEDS_VERIFICATION | source-verification | cartridgeCompatibleShapes | Cartridge compatible shape is allowed for preview but needs trusted source verification before production import. |
| NEEDS_VERIFICATION | source-verification | cartridgeCompatibleShapes | Cartridge compatible shape is allowed for preview but needs trusted source verification before production import. |
| NEEDS_VERIFICATION | source-verification | cartridgeCompatibleShapes | Cartridge compatible shape is allowed for preview but needs trusted source verification before production import. |
| NEEDS_VERIFICATION | source-verification | cartridgeCompatibleShapes | Cartridge compatible shape is allowed for preview but needs trusted source verification before production import. |
| NEEDS_VERIFICATION | source-verification | cartridgeCompatibleShapes | Cartridge compatible shape is allowed for preview but needs trusted source verification before production import. |
| NEEDS_VERIFICATION | source-verification | cartridgeCompatibleShapes | Cartridge compatible shape is allowed for preview but needs trusted source verification before production import. |
| NEEDS_VERIFICATION | source-verification | cartridgeCompatibleShapes | Cartridge compatible shape is allowed for preview but needs trusted source verification before production import. |
| NEEDS_VERIFICATION | source-verification | cartridgeCompatibleShapes | Cartridge compatible shape is allowed for preview but needs trusted source verification before production import. |
| NEEDS_VERIFICATION | source-verification | cartridgeCompatibleShapes | Cartridge compatible shape is allowed for preview but needs trusted source verification before production import. |
| NEEDS_VERIFICATION | source-verification | cartridgeCompatibleShapes | Cartridge compatible shape is allowed for preview but needs trusted source verification before production import. |
| NEEDS_VERIFICATION | source-verification | cartridgeCompatibleShapes | Cartridge compatible shape is allowed for preview but needs trusted source verification before production import. |
| NEEDS_VERIFICATION | source-verification | cartridgeCompatibleShapes | Cartridge compatible shape is allowed for preview but needs trusted source verification before production import. |
| NEEDS_VERIFICATION | source-verification | cartridgeCompatibleShapes | Cartridge compatible shape is allowed for preview but needs trusted source verification before production import. |
| NEEDS_VERIFICATION | source-verification | cartridgeCompatibleShapes | Cartridge compatible shape is allowed for preview but needs trusted source verification before production import. |
| NEEDS_VERIFICATION | source-verification | cartridgeCompatibleShapes | Cartridge compatible shape is allowed for preview but needs trusted source verification before production import. |
| NEEDS_VERIFICATION | source-verification | cartridgeCompatibleShapes | Cartridge compatible shape is allowed for preview but needs trusted source verification before production import. |
| NEEDS_VERIFICATION | source-verification | cartridgeCompatibleShapes | Cartridge compatible shape is allowed for preview but needs trusted source verification before production import. |
| NEEDS_VERIFICATION | source-verification | cartridgeCompatibleShapes | Cartridge compatible shape is allowed for preview but needs trusted source verification before production import. |
| NEEDS_VERIFICATION | source-verification | cartridgeCompatibleShapes | Cartridge compatible shape is allowed for preview but needs trusted source verification before production import. |
| NEEDS_VERIFICATION | source-verification | cartridgeCompatibleShapes | Cartridge compatible shape is allowed for preview but needs trusted source verification before production import. |
| NEEDS_VERIFICATION | source-verification | cartridgeCompatibleShapes | Cartridge compatible shape is allowed for preview but needs trusted source verification before production import. |
| NEEDS_VERIFICATION | source-verification | cartridgeCompatibleShapes | Cartridge compatible shape is allowed for preview but needs trusted source verification before production import. |
| NEEDS_VERIFICATION | source-verification | cartridgeCompatibleShapes | Cartridge compatible shape is allowed for preview but needs trusted source verification before production import. |
| NEEDS_VERIFICATION | source-verification | cartridgeCompatibleShapes | Cartridge compatible shape is allowed for preview but needs trusted source verification before production import. |
| NEEDS_VERIFICATION | source-verification | cartridgeCompatibleShapes | Cartridge compatible shape is allowed for preview but needs trusted source verification before production import. |
| NEEDS_VERIFICATION | source-verification | cartridgeCompatibleShapes | Cartridge compatible shape is allowed for preview but needs trusted source verification before production import. |
| NEEDS_VERIFICATION | source-verification | cartridgeCompatibleShapes | Cartridge compatible shape is allowed for preview but needs trusted source verification before production import. |
| NEEDS_VERIFICATION | source-verification | cartridgeCompatibleShapes | Cartridge compatible shape is allowed for preview but needs trusted source verification before production import. |
| NEEDS_VERIFICATION | source-verification | cartridgeCompatibleShapes | Cartridge compatible shape is allowed for preview but needs trusted source verification before production import. |
| NEEDS_VERIFICATION | source-verification | cartridgeCompatibleShapes | Cartridge compatible shape is allowed for preview but needs trusted source verification before production import. |
| NEEDS_VERIFICATION | source-verification | cartridgeCompatibleShapes | Cartridge compatible shape is allowed for preview but needs trusted source verification before production import. |
| NEEDS_VERIFICATION | source-verification | cartridgeCompatibleShapes | Cartridge compatible shape is allowed for preview but needs trusted source verification before production import. |
| NEEDS_VERIFICATION | source-verification | cartridgeCompatibleShapes | Cartridge compatible shape is allowed for preview but needs trusted source verification before production import. |
| NEEDS_VERIFICATION | source-verification | cartridgeCompatibleShapes | Cartridge compatible shape is allowed for preview but needs trusted source verification before production import. |
| NEEDS_VERIFICATION | source-verification | cartridgeCompatibleShapes | Cartridge compatible shape is allowed for preview but needs trusted source verification before production import. |
| NEEDS_VERIFICATION | source-verification | cartridgeCompatibleShapes | Cartridge compatible shape is allowed for preview but needs trusted source verification before production import. |
| NEEDS_VERIFICATION | source-verification | cartridgeCompatibleShapes | Cartridge compatible shape is allowed for preview but needs trusted source verification before production import. |
| NEEDS_VERIFICATION | source-verification | cartridgeCompatibleShapes | Cartridge compatible shape is allowed for preview but needs trusted source verification before production import. |
| NEEDS_VERIFICATION | source-verification | cartridgeCompatibleShapes | Cartridge compatible shape is allowed for preview but needs trusted source verification before production import. |
| NEEDS_VERIFICATION | source-verification | cartridgeCompatibleShapes | Cartridge compatible shape is allowed for preview but needs trusted source verification before production import. |
| NEEDS_VERIFICATION | source-verification | cartridgeCompatibleShapes | Cartridge compatible shape is allowed for preview but needs trusted source verification before production import. |
| NEEDS_VERIFICATION | source-verification | cartridgeCompatibleShapes | Cartridge compatible shape is allowed for preview but needs trusted source verification before production import. |
| NEEDS_VERIFICATION | source-verification | cartridgeCompatibleShapes | Cartridge compatible shape is allowed for preview but needs trusted source verification before production import. |
| NEEDS_VERIFICATION | source-verification | cartridgeCompatibleShapes | Cartridge compatible shape is allowed for preview but needs trusted source verification before production import. |
| NEEDS_VERIFICATION | source-verification | cartridgeCompatibleShapes | Cartridge compatible shape is allowed for preview but needs trusted source verification before production import. |
| NEEDS_VERIFICATION | source-verification | cartridgeCompatibleShapes | Cartridge compatible shape is allowed for preview but needs trusted source verification before production import. |
| NEEDS_VERIFICATION | source-verification | cartridgeCompatibleShapes | Cartridge compatible shape is allowed for preview but needs trusted source verification before production import. |
| NEEDS_VERIFICATION | seed-policy | characterMaterials | characterMaterials is draft/placeholder-level and blocked from future local import for now. |
| NEEDS_VERIFICATION | cartridge_compatible_shapes |  | lost-radiance slot 1 needs source verification |
| NEEDS_VERIFICATION | cartridge_compatible_shapes |  | lost-radiance slot 2 needs source verification |
| NEEDS_VERIFICATION | cartridge_compatible_shapes |  | lost-radiance slot 3 needs source verification |
| NEEDS_VERIFICATION | cartridge_compatible_shapes |  | lost-radiance slot 4 needs source verification |
| NEEDS_VERIFICATION | cartridge_compatible_shapes |  | fireflies-and-the-forest slot 1 needs source verification |
| NEEDS_VERIFICATION | cartridge_compatible_shapes |  | fireflies-and-the-forest slot 2 needs source verification |
| NEEDS_VERIFICATION | cartridge_compatible_shapes |  | fireflies-and-the-forest slot 3 needs source verification |
| NEEDS_VERIFICATION | cartridge_compatible_shapes |  | fireflies-and-the-forest slot 4 needs source verification |
| NEEDS_VERIFICATION | cartridge_compatible_shapes |  | crimson-twin-butterflies slot 1 needs source verification |
| NEEDS_VERIFICATION | cartridge_compatible_shapes |  | crimson-twin-butterflies slot 2 needs source verification |
| NEEDS_VERIFICATION | cartridge_compatible_shapes |  | crimson-twin-butterflies slot 3 needs source verification |
| NEEDS_VERIFICATION | cartridge_compatible_shapes |  | crimson-twin-butterflies slot 4 needs source verification |
| NEEDS_VERIFICATION | cartridge_compatible_shapes |  | diabolos slot 1 needs source verification |
| NEEDS_VERIFICATION | cartridge_compatible_shapes |  | diabolos slot 2 needs source verification |
| NEEDS_VERIFICATION | cartridge_compatible_shapes |  | diabolos slot 3 needs source verification |
| NEEDS_VERIFICATION | cartridge_compatible_shapes |  | diabolos slot 4 needs source verification |
| NEEDS_VERIFICATION | cartridge_compatible_shapes |  | devils-blood-curse slot 1 needs source verification |
| NEEDS_VERIFICATION | cartridge_compatible_shapes |  | devils-blood-curse slot 2 needs source verification |
| NEEDS_VERIFICATION | cartridge_compatible_shapes |  | devils-blood-curse slot 3 needs source verification |
| NEEDS_VERIFICATION | cartridge_compatible_shapes |  | devils-blood-curse slot 4 needs source verification |
| NEEDS_VERIFICATION | cartridge_compatible_shapes |  | street-boxer slot 1 needs source verification |
| NEEDS_VERIFICATION | cartridge_compatible_shapes |  | street-boxer slot 2 needs source verification |
| NEEDS_VERIFICATION | cartridge_compatible_shapes |  | street-boxer slot 3 needs source verification |
| NEEDS_VERIFICATION | cartridge_compatible_shapes |  | street-boxer slot 4 needs source verification |
| NEEDS_VERIFICATION | cartridge_compatible_shapes |  | kingdoms-guard slot 1 needs source verification |
| NEEDS_VERIFICATION | cartridge_compatible_shapes |  | kingdoms-guard slot 2 needs source verification |
| NEEDS_VERIFICATION | cartridge_compatible_shapes |  | kingdoms-guard slot 3 needs source verification |
| NEEDS_VERIFICATION | cartridge_compatible_shapes |  | kingdoms-guard slot 4 needs source verification |
| NEEDS_VERIFICATION | cartridge_compatible_shapes |  | shadow-creed slot 1 needs source verification |
| NEEDS_VERIFICATION | cartridge_compatible_shapes |  | shadow-creed slot 2 needs source verification |
| NEEDS_VERIFICATION | cartridge_compatible_shapes |  | shadow-creed slot 3 needs source verification |


Additional issues omitted from markdown: 20. See .generated/server-seed-preview/seed-validation.json.


## Import Policy

- Cartridge compatible shapes with `needs_verification` are allowed for preview but require source review before production import.
- Character material rows are draft references and are blocked from future local import until material catalog verification is complete.
- Placeholder guides, community links, and apartment items remain blocked from import planning.
- Admin, user, session, and localStorage data are not allowed in seed payloads.
- Unverified data must not be promoted to `verified`.
