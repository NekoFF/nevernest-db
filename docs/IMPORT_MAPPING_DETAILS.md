# Import Mapping Details

Date: 2026-05-16

This document describes the Phase 4 dry-run mapping from current frontend seed data to future SQL-shaped payloads. It does not write to PostgreSQL.

## Loader

Primary intent: load `getExportDataSnapshot()` from `src/data/exportDataIndex.js`.

Current Node-only behavior: the script imports `getExportDataSnapshot()` directly and reports loader `exportDataIndex-node-safe`. The fallback loader remains available as an emergency regression path, but normal runs no longer use regex-parsed character cards.

## Mapping Modules

| Module | Frontend source | SQL-shaped payloads | Notes |
| --- | --- | --- | --- |
| `mapTaxonomy.mjs` | `src/data/gameTaxonomy.js`, `src/data/stats.js`, `src/data/taxonomy/roles.js`, `src/data/taxonomy/tags.js` | `elements`, `arcTypes`, `rarities`, `roles`, `tags`, `stats` | Keeps gameplay roles separate from tags. |
| `mapMedia.mjs` | `src/data/mediaRegistry.js`, `src/data/mediaAliases.js` | `mediaAssets` | Preserves original `entity_external_id` and alias-resolved `resolved_entity_external_id`. |
| `mapCharacters.mjs` | `snapshot.data.characters` from `src/data/exportDataIndex.js` | character core tables and low-risk child tables | Does not import React or JSX. Maps structured stats, skills, material references, and voice actors when present. |
| `mapWeapons.mjs` | `src/data/weapons.js` | `weapons`, refinements, growth stats, recommended characters | Effects stay text-first; `effect_json` stays empty. |
| `mapCartridgesModules.mjs` | `src/data/cartridges.js`, `moduleCatalog.js`, `modulePieces.js` | cartridge/module tables | Compatible shapes are always `needs_verification`. Non-element cartridge themes are not forced into `element_id`. |
| `mapVehicles.mjs` | `src/data/vehicles.js` | `vehicles`, `vehicleStats`, `vehicleAcquisition` | Vehicle stats are structurally importable. |
| `mapTierLists.mjs` | `src/data/tierList.js` | `tierLists`, `tierRows`, `tierEntries` | Official tier list only; personal localStorage lists are not imported. |
| `mapContent.mjs` | `src/data/codes.js`, `src/data/news.js` | `codes`, `newsPosts`, empty guide/community/apartment arrays | Placeholder content remains draft/placeholder. |
| `mapMaterialsDraft.mjs` | `payloads.characters.characterMaterials`, `src/data/materialCatalogDraft.js`, `src/data/materialAliases.js` | draft material candidates, material usage rows, unresolved material labels | Writes review artifacts only; not production material rows. |

## Validator Layer

Phase 5 added validators under `scripts/import-dry-run/validators/`.

They validate by schema group:

- taxonomy
- media
- characters
- weapons
- cartridges/modules
- vehicles
- tier lists
- content

Known placeholder areas use `INFO` or `WARNING`; blocker severity is reserved for required-field failures, duplicate keys, unresolved required parents, invalid source statuses, and unresolved media aliases.

## Preserved Raw / Metadata

- Character rows preserve the normalized source character object in `raw`.
- Weapon rows preserve the source weapon object in `raw`.
- Cartridge rows preserve the source cartridge object in `raw`.
- Media rows preserve the original registry `status` in `metadata.originalStatus`.
- Build Planner, skill formulas, conditional effects, awakenings, and unstable effect parsing are not invented.

## Source Status Assignment

| Data area | Assigned source_status | Reason |
| --- | --- | --- |
| Core taxonomy | `unknown` | Stable enough for draft, but not source-verified. |
| Media | `unknown` | Local seed paths, license/source metadata not complete. |
| Characters | `unknown` | Data depth is uneven. |
| Character stats | `estimated` unless source data says otherwise | Current detail stat depth is not fully normalized. |
| Weapons | `unknown` | Structured, but not externally source-verified in SQL terms. |
| Cartridge sets | `needs_verification` when `dataStatus` includes missing compatibility | Compatibility still source-pending. |
| Cartridge compatible shapes | `needs_verification` | Required by Phase 2.5 policy. |
| Codes | `needs_verification` when dates are missing | Redeem availability should be source-checked. |
| News | `placeholder` when source URL is missing | Current news seed is mostly internal placeholder content. |

## Stat Alias Normalization

Weapon main stats, sub stats, and growth stats now use `normalizeCanonicalStatId`.

This maps labels such as:

- `ATK%` -> `atk_percent`
- `CRIT Rate` -> `crit_rate`
- `Charge Efficiency` -> `charge_efficiency`
- Mental/Cognitive aliases -> canonical cognitive ids

UI labels and Build Planner runtime keys are unchanged.

## Taxonomy Alias Resolution

Character role/tag mapping now uses `normalizeRoleId` and `normalizeTagId`.

Legacy/current labels such as `Damage`, `Special`, `Follow-up Attack`, `Main DPS`, `Burst DPS`, `Healing`, `Shield`, and `Control` resolve before validation.

## Character Detail Mapping

Phase 6 added deeper extraction from Node-safe full character objects:

- `characterStats`: structured level keyframes, currently `estimated`.
- `characterSkills`: structured skills with text and effect JSON.
- `characterMaterials`: draft skill material references marked `needs_verification`.
- `characterVoiceActors`: structured voice actor rows when present.

## Material Draft Mapping

Phase 7 added a reviewed draft material layer:

- `materialCandidates`: seven reviewed draft candidates, all `needs_verification`.
- `materialUsageRows`: resolved character/skill usage rows for those candidates.
- `unresolvedMaterialLabels`: observed labels not yet included in the reviewed catalog draft.

Generated material artifacts:

- `.generated/import-dry-run/material-candidates.json`
- `.generated/import-dry-run/material-usages.json`
- `.generated/import-dry-run/material-unresolved.json`

The current unresolved labels are `Beetle Coin`, `Dreamless Seed`, and `Fons`.

## Skipped / Empty Mappings

- `characterSkillScaling`: skipped until stable skill formula/scaling extraction exists.
- `characterBannerHistory`, `characterQuotes`, `characterPersonalItems`: no stable plain data source yet.
- `moduleStatTemplates`: skipped until module stat template policy is finalized.
- `guides`, `communityLinks`, `apartmentItems`: placeholder-level and intentionally empty.
- Build Planner localStorage drafts: not included; needs real user/export flow.
- Admin localStorage overrides: not included; needs review workflow and admin logs.

## Generated Artifacts

`npm.cmd run import:dry-run` writes ignored generated files:

- `.generated/import-dry-run/payload-summary.json`
- `.generated/import-dry-run/payloads.json`
- `.generated/import-dry-run/issues.json`
- `.generated/import-dry-run/material-candidates.json`

## Known Lossy Mappings

- Character loader now uses the Node-safe canonical snapshot; fallback card parsing is emergency-only.
- Some role/tag labels remain mixed and produce warnings.
- Weapon stat display labels are slug-normalized; final import should use `normalizeRegistryStatKey`.
- Cartridge themes that are actually stat categories are kept out of `element_id`.
- Media dimensions and licensing metadata are not known.

## Manual Review Before Real Import

- Verify cartridge compatible shape source.
- Normalize current character roles/tags into separate buckets.
- Extract a material catalog.
- Add source URLs/licensing notes for media where possible.
- Decide whether module pieces should be stored rows or generated from shapes/rarity templates.
- Create a reviewed admin override export path before importing localStorage edits.
