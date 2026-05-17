# Global Data Architecture Audit

Date: 2026-05-15

Scope: Characters, Weapons/Arcs, Modules/Cartridges, module shapes, Vehicles, Codes, News, and Build Planner data flow. This audit checks source-of-truth ownership, ID-based relations, admin/localStorage merge behavior, and backend/SQL readiness. UI layout and visual design were not changed.

## Executive Summary

The app is mostly organized around shared seed files plus `AdminModeContext` merged data. Characters, weapons/arcs, cartridges, vehicles, codes, and news all have central seed files and admin override flows. Build Planner uses the merged character, weapon, and cartridge collections, so admin edits generally flow into planner selection and calculation.

The highest-risk areas are legacy compatibility fallbacks that resolve by display names, derived module adapter files that can look like duplicate catalogs, and frontend-only localStorage persistence. These are acceptable for the current static app, but they should be normalized before a backend/SQL migration.

## Source Of Truth Table

| Entity | Source of truth file | Used by list page | Used by detail page | Used by admin edit | Used by Build Planner | Problems |
| --- | --- | --- | --- | --- | --- | --- |
| Characters | `src/data/characters.js`, `src/data/characters/index.js`, per-character files in `src/data/characters/` | Yes, `CharactersPage` uses `mergedCharacters` | Yes, `CharacterDetailPage` uses `getCharacterByIdMerged` | Yes, `saveCharacterOverride`, `createCharacterOverride`, `mergeCharactersWithOverrides` | Yes, character picker and calculator use `mergedCharacters` | Character assets still use some name/display fallback helpers; legacy build data accepts name fallbacks. |
| Weapons / Arcs | `src/data/weapons.js` | Yes, `WeaponsPage` uses `mergedWeapons` | Yes, `WeaponDetailPage` uses `getWeaponByIdMerged` | Yes, `WeaponEditor` and override storage | Yes, weapon picker and calculator use `mergedWeapons` | `getWeaponByName` remains for legacy console normalization. |
| Cartridges | `src/data/cartridges.js` | Yes, `ModulesPage` uses `mergedCartridges` | Yes, detail resolves via merged cartridge lookup | Yes, `CartridgeEditor` and cartridge overrides | Yes, cartridge picker, board, and calculator use `mergedCartridges` | All current compatible shape refs resolve; every cartridge is marked `dataStatus: "missing-compatible-shapes"` because exact official compatible shape data is incomplete. |
| Module Shapes | `src/data/moduleCatalog.js` | Yes, module shape UI imports shared catalog | Yes, `ModuleDetailPage` uses the catalog/adapters | Yes, cartridge and console editors select from `MODULE_SHAPES` | Yes, board pieces and set matching resolve against the same shape IDs | `src/data/modules/moduleShapes.js`, `src/data/modules/moduleCatalog.js`, and `src/data/modulePieces.js` are derived adapters; keep them derived to avoid drift. |
| Vehicles | `src/data/vehicles.js` | Yes, `VehiclesPage` uses `mergedVehicles` | Detail is currently page/card based, not a separate detail route | Yes, vehicle override storage and page editor | No direct Build Planner dependency | Images are asset-key/path fields, not normalized media records. |
| Codes | `src/data/codes.js` | Yes, `CodesPage` uses `mergedCodes` | No separate detail route | Yes, page editor and code overrides | No direct Build Planner dependency | Frontend-only localStorage persistence. |
| News | `src/data/news.js` | Yes, `NewsPage` uses `mergedNews` | No separate detail route | Yes, news editor, URL draft, and news overrides | No direct Build Planner dependency | URL import creates a frontend draft only; future backend should own source metadata and ingestion. |
| Build Planner Drafts | `BuildPlannerPage` localStorage state | Not applicable | Not applicable | Not through Admin Mode | Yes, selected IDs, modules, stats, save/export/import draft | Drafts are browser-local only and need backend ownership for account/device sync. |

## Current Data Sources

### Characters

- Seed data: `src/data/characters.js` re-exports `src/data/characters/index.js`, which aggregates per-character files.
- Schema/normalization: `src/data/characterSchema.js`, `src/data/buildBlocks.js`, `src/data/consoleBlocks.js`.
- List/detail: `CharactersPage` and `CharacterDetailPage` consume admin-merged data from `useAdminMode`.
- Admin: `CharacterEditModal`, `BuildEditor`, `TeamsEditor`, `ConsoleInfoEditor`, and `AdminModeContext` write local overrides.
- Build Planner: `BuildPlannerPage` uses `mergedCharacters`; `calculateBuildStats` receives the merged character array.
- Recommended builds/teams: stored under character data. Current Nanally recommendations use `weaponId`, `cartridgeId`, and `characterId`.

### Weapons / Arcs

- Seed data: `src/data/weapons.js`.
- List/detail: `WeaponsPage` and `WeaponDetailPage` use `mergedWeapons` / `getWeaponByIdMerged`.
- Admin: `WeaponEditor` plus generic collection override helpers in `adminStorage.js`.
- Build Planner: weapon picker and calculator resolve selected `weaponId`/`arcId` from `mergedWeapons`.
- Recommended weapons: character build data is normalized to stable `weaponId` references, with legacy migration fallback for old name/slug data.

### Modules / Cartridges

- Cartridge seed data: `src/data/cartridges.js`.
- Module shape source: `src/data/moduleCatalog.js`.
- Derived module adapters: `src/data/modules/moduleShapes.js`, `src/data/modules/moduleCatalog.js`, `src/data/modulePieces.js`.
- List/detail: `ModulesPage`, `CartridgeDetailPage`, and `ModuleDetailPage`.
- Admin: `CartridgeEditor` chooses compatible module shapes from `MODULE_SHAPES` and stores `moduleShapeId` references.
- Build Planner: cartridge picker uses `mergedCartridges`; board placements store `moduleShapeId` plus placement data; set matching uses resolvable shape IDs only.

### Vehicles

- Seed data: `src/data/vehicles.js`.
- Page/admin: `VehiclesPage` uses `mergedVehicles` and local override helpers.
- Stored data includes IDs, names, type/category fields, stats, handling, and image/asset fields.

### Codes

- Seed data: `src/data/codes.js`.
- Page/admin: `CodesPage` uses `mergedCodes`, active/expired filters, create/save/delete override helpers.
- Stored fields include `id`, `code`, `status`, dates, rewards, source, notes, and enabled/deleted state.

### News

- Seed data: `src/data/news.js`.
- Page/admin: `NewsPage` uses `mergedNews`, category filters, URL draft/import helper, and create/save/delete override helpers.
- Stored fields include `id`, `title`, `description`, `category`, `date`, `sourceLabel`, `sourceUrl`, image, pinned/featured state.

### Build Planner

- Page state: `src/pages/BuildPlannerPage.jsx`.
- Calculation: `src/utils/buildCalculator.js`.
- Shape validation: `src/utils/moduleShapeRefs.js`.
- Esper cycles: `src/data/esperCycles.js`.
- Drafts: `localStorage` keys `nte.admin.plannerDrafts` and legacy `nte-build-planner-drafts`.
- Draft slots store `characterId`, `weaponId`/`arcId`, `console.cartridgeId`, and placed module objects with `moduleShapeId`, `placementId`, rarity, position, and stat fields.

## Duplicated Or Hardcoded Data Findings

| Finding | Status | Risk | Recommendation |
| --- | --- | --- | --- |
| Build recommendations still support name-based cartridge fallback in `buildBlocks.js` via `getCartridgeByName`. | Legacy fallback, not primary current data. | Medium during migration because display names can change. | Keep temporarily for imports, but write only `cartridgeId` from editors and backend. |
| Console normalization supports `mainCartridgeName`, `arcName`, and `getWeaponByName`. | Legacy/display fallback. | Medium if used as primary data. | Store `mainCartridgeId` and `arcId` in character console data; treat names as display cache only. |
| Module shape adapters exist in multiple files. | Derived from `src/data/moduleCatalog.js`. | Low now, higher if adapters are manually edited later. | Keep `MODULE_SHAPES` as canonical; generate/adapt everything else from it. |
| Asset lookup uses names/asset keys in some places. | Display/media concern, not core relation data. | Low for calculator, medium for backend migration. | Add normalized media records or stable asset IDs later. |
| Static UI filter option arrays exist in pages/editors. | UI taxonomy, not entity records. | Low. | Accept for now; centralize only if backend needs editable taxonomies. |
| `ConsoleInfoEditor` can add a default required piece with `type-ii-horizontal`. | Editor convenience default. | Low if user edits it; medium if saved accidentally as real recommendation. | Prefer requiring an explicit shape choice in a future data-quality pass. |
| Cartridge placeholder alias map still exists in normalization code. | Compatibility guard only; output data now stores real IDs. | Low. | Keep dev warning and do not seed placeholder IDs. Remove alias after all legacy imports are cleaned. |

No separate hardcoded character, weapon, cartridge, vehicle, code, or news catalogs were found inside the primary pages. Pages generally consume `AdminModeContext` merged arrays.

## ID-Based Relation Check

| Relation | Current status | Notes |
| --- | --- | --- |
| Character recommended weapon | ID-based | Uses `recommendedWeaponIds` and `recommendedWeapons[].weaponId`; legacy build normalization can migrate old names/slugs. |
| Character recommended cartridge | ID-based | Uses `recommendedCartridges[].cartridgeId`; legacy fallback can resolve old names. |
| Character recommended teams/synergies | ID-based | Uses `characterId`; optional `name` remains a display fallback. |
| Cartridge compatible modules | ID-based | Uses `compatibleModules[].moduleShapeId`, `compatibleModuleShapeIds`, and `requiredSetPieceShapeIds`; all current refs resolve. |
| Build Planner selected character | ID-based | Slot stores `characterId`. |
| Build Planner selected weapon | ID-based | Slot stores `weaponId` and `arcId`; calculator resolves from merged weapons. |
| Build Planner selected cartridge | ID-based | Slot stores `console.cartridgeId`; calculator resolves from merged cartridges. |
| Build Planner placed module | ID-based object | Placement stores `moduleShapeId`, `placementId`, rarity, row/col, and stat arrays. |
| News source | Structured text/source URL | Stores `sourceUrl`, `sourceLabel`, `category`, and `date`; no backend source table yet. |
| Vehicles | ID-based entity | Vehicles store `id`; image/asset data is still path/key based. |
| Tier list | ID-based | Tiers store `characterIds`. |

Remaining name/text-based paths are compatibility fallbacks rather than the preferred write path. They should be phased out after backend migration import tooling exists.

## Admin System Check

| Admin action | Current behavior |
| --- | --- |
| Edit a character | `saveCharacterOverride` updates localStorage; `mergedCharacters` feeds Characters page, detail page, topbar, teams, tier list, and Build Planner. |
| Edit a weapon | `saveWeaponOverride` updates `mergedWeapons`; Weapons page, detail page, recommended build display, and Build Planner receive the merged object. |
| Edit a cartridge | `saveCartridgeOverride` updates `mergedCartridges`; Modules page, cartridge detail, build recommendations, and Build Planner receive the merged object. |
| Edit compatible module shapes | `CartridgeEditor` writes real `moduleShapeId` values; Build Planner set matching uses merged cartridge data. |
| Add a character | `createCharacterOverride` appends to `mergedCharacters`; it appears in Characters and Build Planner. |
| Add a weapon | `createWeaponOverride` appends to `mergedWeapons`; it appears in Weapons and Build Planner. |
| Add a cartridge | `createCartridgeOverride` appends to `mergedCartridges`; it appears in Modules and Build Planner. |
| Add a vehicle | `createVehicleOverride` appends to `mergedVehicles`; it appears in Vehicles. |
| Add/edit/delete codes | `CodesPage` writes local overrides and filters from `mergedCodes`. |
| Add/edit/delete news | `NewsPage` writes local overrides and filters from `mergedNews`. |

Persisted only in localStorage:

- Admin mode state: `nte.admin.mode`.
- Character overrides: `nte.admin.characters`.
- Cartridge overrides: `nte.admin.modules`.
- Weapon overrides: `nte.admin.weapons`.
- Vehicle overrides: `nte.admin.vehicles`.
- Code overrides: `nte.admin.codes`.
- News overrides: `nte.admin.news`.
- Tier list override: `nte.admin.tierList`.
- Build Planner drafts: `nte.admin.plannerDrafts`.

Hardcoded seed files:

- Characters, weapons/arcs, cartridges, module shapes, vehicles, codes, news, tier list presets, and Esper cycle definitions.

Backend/SQL later:

- Admin localStorage overrides should become database records or draft revisions.
- Build Planner drafts need owner/session IDs and normalized slot/module records.
- Media paths should become stable asset records or asset IDs.

## Backend / SQL Readiness Recommendations

Suggested normalized entities:

| Table / Entity | Key IDs | Important relations |
| --- | --- | --- |
| `characters` | `character_id` | Element, role, faction, profile, media asset IDs. |
| `character_stats_by_level` | `character_id`, `level` | Base stat rows used by calculator. |
| `character_skills` | `skill_id`, `character_id` | Skill metadata, type, tags. |
| `character_skill_scaling` | `skill_id`, `level` | Scaling values and stat references. |
| `character_traits` | `trait_id`, `character_id` | Structured build/passive traits such as module type count. |
| `weapons` | `weapon_id` | Type, rarity, base stats, descriptions. |
| `weapon_stats_by_level` | `weapon_id`, `level` | ATK/substat growth. |
| `weapon_refinements` | `weapon_id`, `rank` | Structured effects where known. |
| `cartridges` | `cartridge_id` | Rarity, tags, images, status. |
| `cartridge_effects` | `effect_id`, `cartridge_id` | Piece count, direct/conditional effects, stat IDs, conditions. |
| `module_shapes` | `module_shape_id` | Type, matrix, dimensions. |
| `cartridge_module_shapes` | `cartridge_id`, `module_shape_id`, `slot` | Required/compatible shape relations. |
| `character_recommended_weapons` | `character_id`, `weapon_id` | Priority, label, note. |
| `character_recommended_cartridges` | `character_id`, `cartridge_id` | Priority, rarity, label, note. |
| `character_team_recommendations` | `team_id`, `character_id` | Team members by `character_id`. |
| `build_planner_drafts` | `draft_id`, `owner_id` | Name, active slot, version, timestamps. |
| `build_planner_slots` | `slot_id`, `draft_id`, `character_id`, `weapon_id`, `cartridge_id` | Selected entities and levels. |
| `build_planner_modules` | `module_instance_id`, `slot_id`, `module_shape_id` | Placement, rarity, main/sub stats. |
| `vehicles` | `vehicle_id` | Type, stats, media asset IDs. |
| `news_posts` | `post_id` | Source URL, source label, category, author/source, dates. |
| `codes` | `code_id` | Code text, status, active window, rewards. |
| `media_assets` | `asset_id` | Path/URL, alt text, source, dimensions. |

Migration priorities:

1. Keep all entity references as IDs in write paths.
2. Add database constraints for `weapon_id`, `cartridge_id`, `module_shape_id`, and `character_id` relations.
3. Move localStorage override structures into database-backed draft/published records.
4. Preserve legacy name import helpers only in migration/import tools, not runtime calculators.
5. Keep calculator inputs as normalized records, not page-local display models.

## Validation Results

| Check | Result |
| --- | --- |
| Character edited in admin should still render on Characters page | Passed by architecture inspection: `saveCharacterOverride` -> `mergedCharacters` -> `CharactersPage`. |
| Same character should be selectable in Build Planner | Passed by architecture inspection: Build Planner character picker consumes `mergedCharacters`. |
| Weapon selected in Build Planner should resolve from Weapons data | Passed by architecture inspection: picker/calculator consume `mergedWeapons`; selected slot stores `weaponId`. |
| Cartridge selected in Build Planner should resolve from Modules/Cartridges data | Passed by architecture inspection: picker/calculator consume `mergedCartridges`; selected slot stores `console.cartridgeId`. |
| Cartridge compatible module shapes should resolve from Module Shapes data | Passed by Node smoke check: 12 cartridges checked, 0 invalid compatible shape refs. |
| Vehicles page should still render | Covered by production build and source inspection: `VehiclesPage` consumes `mergedVehicles`. |
| News page should still render | Covered by production build and source inspection: `NewsPage` consumes `mergedNews`. |
| Codes page should still render | Covered by production build and source inspection: `CodesPage` consumes `mergedCodes`. |
| `npm run build` | See final run result in the task response. |

Smoke check command:

```bash
node --input-type=module -e "import { cartridgeSets } from './src/data/cartridges.js'; import { MODULE_SHAPE_BY_ID } from './src/data/moduleCatalog.js'; const bad=[]; const incomplete=[]; for (const c of cartridgeSets) { const ids=(c.compatibleModules||[]).map(m=>m.moduleShapeId).filter(Boolean); const unresolved=ids.filter(id=>!MODULE_SHAPE_BY_ID.has(id)); if (unresolved.length) bad.push({id:c.id, unresolved}); if (c.dataStatus==='missing-compatible-shapes') incomplete.push(c.id); } console.log(JSON.stringify({cartridges:cartridgeSets.length, invalidCompatibleShapeRefs:bad, incomplete}, null, 2)); if (bad.length) process.exit(1);"
```

Result:

```json
{
  "cartridges": 12,
  "invalidCompatibleShapeRefs": [],
  "incomplete": [
    "lost-radiance",
    "fireflies-and-the-forest",
    "crimson-twin-butterflies",
    "diabolos",
    "devils-blood-curse",
    "street-boxer",
    "kingdoms-guard",
    "shadow-creed",
    "theas-night-tavern",
    "tiny-big-adventure",
    "speedy-hedgehog",
    "quiet-manor"
  ]
}
```

## Safe Fix Applied

- `src/admin/adminStorage.js` now preserves `buildTraits` when character admin patches are merged. This keeps structured calculator trait data, such as Nanally Type II specialization, from being dropped by admin edits/imports.

## Known Limitations

- Admin persistence is localStorage only. It is useful for the static app, but it is not a durable backend.
- Build Planner drafts are localStorage only and cannot sync across browsers or users.
- Some runtime normalizers still support legacy name-based resolution for old build/console data.
- Cartridge compatible shape IDs now resolve, but all cartridges are honestly marked incomplete because exact official compatible shape data is not fully known.
- Module shape adapters are derived from one catalog today; future edits must avoid making them independent sources.
- News URL import is a frontend draft helper, not a backend ingestion system.
- Vehicles have structured IDs and stats, but media assets are still path/key fields rather than normalized records.
