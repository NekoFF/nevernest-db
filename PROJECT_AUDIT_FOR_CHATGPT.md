# Neverness to Everness Database Project Audit for ChatGPT

Date: 2026-05-16

Audience: another AI assistant continuing development in this repo.

Scope: this document audits the current React/Vite frontend, static data architecture, admin/localStorage system, Build Planner, Tier List, assets, and backend migration needs. It intentionally does not redesign UI, refactor code, delete files, or migrate to SQL.

Status labels used below:

| Label | Meaning |
| --- | --- |
| Confirmed from code | Directly verified in the repository. |
| Inferred from structure | Strongly implied by file names, wiring, or existing docs, but not fully proven at runtime here. |
| Placeholder/mock | Present as UI or seed data but not complete/production-real. |
| Missing | Not implemented or not present as a first-class model. |
| Needs verification | Needs browser QA, game-source verification, or data-source confirmation. |

## 1. High-Level Project Summary

Confirmed from code: this is a Vite + React single-page application for an unofficial Neverness to Everness community database. The app currently covers Home, Characters, Character detail, Weapons/Arcs, Weapon detail, Modules/Cartridges, cartridge/module details, Vehicles, Build Planner, Tier List, Guides, Codes, News, and placeholder Apartments/Community sections.

Product goal: become a polished all-in-one NTE database with structured data for characters, arcs/weapons, cartridges/modules, vehicles, tier lists, builds, guides, codes, news, and community resources. The current app is frontend-only but already shaped like a database product instead of a simple text site.

Current strengths:

| Strength | Evidence |
| --- | --- |
| Strong consistent light UI direction | Tailwind classes across pages use `#f8f8f7`, white panels, rounded cards, capsule filters, soft shadows, pink/red accent `#ff2f6d`. |
| Centralized seed data | `src/data/characters`, `src/data/weapons.js`, `src/data/cartridges.js`, `src/data/vehicles.js`, `src/data/tierList.js`, `src/data/codes.js`, `src/data/news.js`. |
| Real local admin override layer | `src/admin/AdminModeContext.jsx` and `src/admin/adminStorage.js` merge localStorage edits into displayed data. |
| Build Planner is partly functional | `src/pages/BuildPlannerPage.jsx` uses `src/utils/buildCalculator.js` for base stats, weapon stats, cartridge stats, module stats, set bonuses, and some traits. |
| SQL migration thinking already started | `db/schema.sql` exists for modules; `docs/` contains focused audits. |

Current risks:

| Risk | Why it matters |
| --- | --- |
| No backend/auth | Admin data and planner drafts are browser-local only; not production-safe. |
| Static JS data | Useful now, but needs normalized import/export before SQL migration. |
| Some data is placeholder/incomplete | Guides, Community, Apartments, many character details, cartridge compatible shape status. |
| Mixed canonical/display fields | Character details mix UI blocks, canonical facts, build data, and calculator hooks. |
| Asset paths rely on names | Asset helper maps names/aliases to public files; production should use stable media IDs. |
| SEO is minimal | Vite SPA has only `index.html`; no per-route metadata, sitemap, robots, OpenGraph, or SSR. |

## 2. Tech Stack

| Area | Current implementation |
| --- | --- |
| Framework | React 18.3.1 (`react`, `react-dom`). |
| Language | JavaScript/JSX. No TypeScript compiler is configured. Some JSDoc typedefs exist, especially in `weapons.js` and `stats.js`. |
| Styling | Tailwind CSS v4 via `@tailwindcss/vite`, plus global CSS in `src/index.css`. Most styling is inline utility classes. |
| Routing | Confirmed from code: custom SPA state/router in `src/App.jsx` using `window.location.pathname`, `history.pushState`, and `popstate`. No `react-router`. |
| State management | React local state plus `AdminModeContext`. No Redux/Zustand/etc. |
| Persistence | Browser `localStorage` for admin overrides, Build Planner drafts, personal tier lists, presets. No backend sync. |
| Build tool | Vite 6.0.11. |
| Package manager | npm, with `package-lock.json`. |
| Icons | `lucide-react`. Some custom SVG icon components in `src/data/gameMeta.jsx` and `src/components/ui/NteCategoryIcons.jsx`. |

Config files:

| File | Purpose |
| --- | --- |
| `package.json` | Scripts: `dev`, `build`, `preview`; dependencies. |
| `vite.config.js` | React + Tailwind plugins; `server.allowedHosts` contains one ngrok host. |
| `index.html` | Vite HTML entry. |
| `src/main.jsx` | React root; wraps `<App />` in `<AdminModeProvider>`. |
| `src/index.css` | Tailwind import and global base styles. |

Important dependencies:

```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "lucide-react": "^0.468.0",
  "vite": "^6.0.11",
  "@vitejs/plugin-react": "^4.3.4",
  "tailwindcss": "^4.1.4",
  "@tailwindcss/vite": "^4.1.4"
}
```

## 3. File and Folder Structure

| Path | Purpose |
| --- | --- |
| `src/App.jsx` | Main app shell, custom route parser, navigation handlers, topbar search suggestions, page mounting, global character edit modal/admin dashboard. |
| `src/main.jsx` | React DOM entry and admin provider. |
| `src/index.css` | Global Tailwind import, body font/background, scrollbar helper, slider styling. |
| `src/pages/` | Route-level pages. Includes all major app sections. |
| `src/components/` | Shared UI and domain components: layout, cards, detail parts, console board, build/teams sections. |
| `src/components/ui/` | Generic small UI components: counters, admin action wrappers, filter bars, game badges. |
| `src/components/weapons/` | Weapon card/detail subcomponents and weapon styling helpers. |
| `src/components/cartridges/` | Cartridge card/icon/style helpers. |
| `src/components/vehicles/` | Vehicle showroom subcomponents and formatting helpers. |
| `src/admin/` | Admin mode context, localStorage persistence, dashboard, entity editors. |
| `src/data/` | Seed data, normalizers, metadata registries, build/console/team/skill/overview models. |
| `src/data/characters/` | Per-character seed modules and aggregate `index.js`. |
| `src/data/modules/` | Older/derived module adapter files. Current canonical shape source is `src/data/moduleCatalog.js`. |
| `src/utils/` | Asset resolution, stat aliases, module shape refs, Build Planner calculator. |
| `public/assets/nte/` | Runtime public images for characters, weapons, modules, cars, misc icons. |
| `dist/` | Built output. Do not edit by hand. |
| `docs/` | Existing focused audits and fix reports. |
| `db/schema.sql` | Early SQL schema for module rarity/type/shape/modules/stat templates. |
| `data-entry/` | Data-entry templates; currently includes Nanally JSON template. |

Generated/test-profile folders: `.edge-*` folders in the app root appear to be browser automation profiles. They are not app source.

## 4. Routing and Page Map

Routing is confirmed in `src/App.jsx::routeFromPath()` and page render switches inside `<main>`.

| Route path | Page state | Component | Data sources | Main actions | Limitations |
| --- | --- | --- | --- | --- | --- |
| `/` | `home` | `src/pages/HomePage.jsx` -> `Hero`, `CategoryCard`, `LatestUpdates` | `categories`, `updates`, admin merged counters through `Hero` | Navigate to sections | Static hero/category copy. |
| `/characters` | `characters` | `src/pages/CharactersPage.jsx` | `useAdminMode().mergedCharacters`, `SORT_OPTIONS`, `gameMeta` | Filters, sort, grid/compact, open detail, Add Character in admin | No URL query params for filters. |
| Character detail | `character-detail` state only | `src/pages/CharacterDetailPage.jsx` | `getCharacterByIdMerged`, overview/skills/material/build/team/console normalizers | Tabs, edit sections in admin, open weapons/cartridges/modules | No URL path for character detail; selected id is state-only. Refresh loses detail. |
| `/weapons` | `weapons` | `src/pages/WeaponsPage.jsx` | `mergedWeapons` | Search/filter/sort, Add Weapon, detail link | Frontend-only filtering; no pagination. |
| `/weapons/:slug` | `weapon-detail` | `src/pages/WeaponDetailPage.jsx` | `mergedWeapons`, weapon detail components | Back, edit in admin if wired | Uses slug path. |
| `/modules` | `modules` | `src/pages/ModulesPage.jsx` | `mergedCartridges`, `modulePieces`, `moduleCatalog` | Content filter, rarity/type/bonus/element filters, Add Cartridge | "Modules" are generated pieces/shapes, not independent stored module item rows. |
| `/modules/:slug` | `cartridge-detail` | `src/pages/CartridgeDetailPage.jsx` | Cartridge data; admin merged lookup | Back, rarity switch, edit cartridge | Exact cartridge compatible shapes marked incomplete in seed status. |
| `/modules/pieces/:shapeId/:rarity` | `module-detail` | `src/pages/ModuleDetailPage.jsx` | `moduleCatalog`, `modulePieces` | Back, rarity selector | No admin edit page for module piece stats; pieces are generated. |
| `/vehicles` | `vehicles` | `src/pages/VehiclesPage.jsx` | `mergedVehicles`, vehicle components | Type/search, carousel-like browse, Add/Edit/Delete Vehicle in admin | No separate vehicle detail route. |
| `/build-planner` | `build-planner` | `src/pages/BuildPlannerPage.jsx` | `mergedCharacters`, `mergedWeapons`, `mergedCartridges`, `buildCalculator`, module pieces/shapes, esper cycles | Pick team slots, select character/weapon/cartridge/modules, save drafts, export/import JSON, export image, reset | Awakening/Abilities tabs are placeholders; no backend account sync. |
| `/tier-list` | `tier-list` | `src/pages/TierListPage.jsx` | `mergedCharacters`, `mergedOfficialTierList`, `tierTemplates` | Official/user tabs, drag/tap placement, save/reset/settings/download image | Personal lists are local only; official edits are local admin overrides. |
| `/guides` | `guides` | `src/pages/GuidesPage.jsx` | Hardcoded guide category cards | Browse future guide categories | Placeholder/content shell. |
| `/codes` | `codes` | `src/pages/CodesPage.jsx` | `mergedCodes`, `codes.js` | Filter active/expired, copy, add/edit/delete in admin | Static seed codes need source/date verification. |
| `/news` | `news` | `src/pages/NewsPage.jsx` | `mergedNews`, `news.js` | Category/sort, details, add/edit/delete/import URL draft in admin | Placeholder news seed; no API ingestion. |
| `/community` | `community` | `PlaceholderPage` in `App.jsx` | None | Back Home | Placeholder. |
| `/apartments` | `apartments` | `PlaceholderPage` in `App.jsx` | None | Back Home | Placeholder. |

## 5. Data Model Audit

### Character

Confirmed source: `src/data/characters/index.js`, per-character modules, `src/data/characterSchema.js`, canonical import adapter files.

Current normalized shape is JS object based. Required fields are not enforced by TypeScript, but UI expects at least `id`, `name`, `rarity`, `element`, `arcType`, `roles`, and `shortDescription`.

Important fields:

| Field | Type | Required now | Notes |
| --- | --- | --- | --- |
| `id` | string | Yes | Stable id used by planner, tier list, references. |
| `name` | string | Yes | Display name and asset lookup fallback. |
| `rarity` | string | Yes | Usually `S` or `A`; `B` exists in rarity meta. UI displays S-Rank/A-Rank. |
| `element` | string id | Yes | Lowercase ids from `gameMeta`: `incantation`, `cosmos`, `chaos`, `psyche`, `anima`, `lakshana`. |
| `arcType` | string id | Yes | Lowercase ids: `bose`, `gas`, `liquid`, `plasma`, `solid`. |
| `roles` | string[] | Yes-ish | Used for filters. |
| `tags` | string[] | Optional | Overlaps roles; used in search/filter. |
| `shortDescription` | string | Optional | Card/list copy. |
| `faction`, `birthday`, `weaponType` | string/null | Optional | Detail summary. |
| `profile`, `profileText` | object/string | Optional | Detail page. |
| `stats` | object of strings/numbers | Optional | Display and calculator fallback. |
| `levelStats` | object | Optional | Calculator prefers this when available. |
| `overview` | object | Optional | Blocks normalized by `overviewBlocks.js`. |
| `skills` | array/object | Optional | Normalized by `skillBlocks.js`. |
| `build` | object | Optional | Recommendations normalized by `buildBlocks.js`. |
| `teams`, `synergies` | array/object | Optional | Team tab. |
| `console`, `consoleSetup` | object | Optional | Console tab and planner traits. |
| `materials` | object/array | Optional | Materials tab. |
| `voiceActors`, `gallery`, `trait`, `buildTraits` | mixed | Optional | Only some characters have rich data. |

Example source object pattern:

```js
export const characters = [
  buildCharacter(baicangCard, baicangDetail),
  buildCharacter(chizCard),
  // ...
  buildCharacter(canonicalCharactersById.nanally || nanallyCard, canonicalCharactersById.nanally ? undefined : nanallyDetail),
]
```

Counts: confirmed from `characters/index.js`, 18 character records are assembled.

Reality status: mixed. Nanally is rich/canonical-adapted; Baicang/Hotori have detail patches; many others are roster cards with default skeleton data.

Relationships: tier list uses `characterIds`; Build Planner slots store `characterId`; recommended teams use character ids or fallbacks; character build data references weapons/cartridges.

### Weapon / Arc

Confirmed source: `src/data/weapons.js`.

JSDoc typedef exists:

```js
/**
 * @typedef {{
 *   id: string,
 *   slug: string,
 *   name: string,
 *   rarity: 'S' | 'A' | 'B',
 *   type: 'Bose' | 'Gas' | 'Liquid' | 'Plasma' | 'Solid',
 *   quote?: string,
 *   shortDescription?: string,
 *   mainStat: { type: 'ATK', value: number },
 *   subStat: { type: string, value: string | number },
 *   refinements: { rank: 1 | 2 | 3 | 4 | 5, effect: string }[],
 *   growthScaling: { level: string, atk: number, subStatType: string, subStatValue: string | number }[],
 *   image?: string,
 *   icon?: string,
 *   recommendedCharacters?: string[],
 *   tags?: string[],
 * }} WeaponData
 */
```

Counts: confirmed by generated asset/source list and existing docs: 42 weapons/arcs.

Reality status: generated from spreadsheet comment: `nte_weapons_arcs_database_complete_v5.xlsx`. More structured than most data. Refinement effects are text; growth rows are structured enough for planner stats.

Relationships: character builds reference weapon ids; Build Planner selected slot stores `weaponId` and `arcId`; weapon detail path uses `slug`.

### Cartridge Set

Confirmed source: `src/data/cartridges.js`. The file comment says generated from `NTE_cartridges_stats_database.xlsx` on 2026-05-14.

Fields:

| Field | Type | Notes |
| --- | --- | --- |
| `id`, `sourceId`, `slug`, `name` | string | Stable id/display/URL. |
| `theme`, `element` | string | Themes include elements; `Cognitive` appears as module/cartridge category via filters and stat aliases. |
| `bonusCategory` | string | `damage`, `defense`, `healing`, `break`, `utility`, `support`. |
| `description` | string | Display. |
| `bonuses` | array | `{ pieces: 2|4, text }`; structured effects are also derived in the file. |
| `compatibleModules` | array | Uses `moduleShapeId` and slot metadata. |
| `compatibleModuleShapeIds` | string[] | Normalized convenience relation. |
| `variants`, `availableRarities` | array | B/A/S support and icon/color status. |
| `dataStatus` | string | Currently often `missing-compatible-shapes`. |

Counts: confirmed by existing docs and seed shape: 12 cartridge sets. UI headline says cartridge sets + 12 module shapes; user-visible "24 items / 12 shapes" likely comes from total cartridges plus shapes, while generated module pieces are 36 (3 rarities x 12 shapes). Confirm exact visible label in browser if needed.

Reality status: set bonuses and stat values are structured; exact compatible shape data is flagged incomplete/needs verification.

### Module Shape and Module Piece

Canonical shape source: `src/data/moduleCatalog.js`.

Shape fields: `id`, `type`, `name`, `matrix`.

Confirmed shape count: 12:

| Shape id | Type |
| --- | --- |
| `type-ii-horizontal`, `type-ii-vertical` | Type II |
| `type-iii-horizontal`, `type-iii-vertical`, four L shapes | Type III |
| `type-iv-horizontal`, `type-iv-vertical`, `type-iv-z-left`, `type-iv-z-right` | Type IV |

Generated module pieces: `src/data/modulePieces.js` creates one piece for each rarity and shape:

```js
export const modulePieces = MODULE_RARITIES.flatMap((rarity) =>
  MODULE_SHAPES.map((shape) => ({
    id: `module-${rarity.toLowerCase()}-${slug(shape.id)}`,
    rarity,
    moduleType,
    cellCount,
    shapeId: shape.id,
    mainStats: getModuleMainStats({ rarity, moduleType }),
    subStatValues: getModulePossibleSubStats({ rarity, cellCount }),
    maxLevel: 20,
  }))
)
```

Reality status: module stat values are structured seed data. Images for generated module pieces are generally empty; cartridge set images exist for many sets in `public/assets/nte/modules`.

### Vehicle

Confirmed source: `src/data/vehicles.js`.

Fields: `id`, `assetKey`, `name`, `type`, `currency`, `price`, `maxSpeed`, `acceleration`, `durability`, `description`, `handling`.

Confirmed count: 16 vehicles.

Vehicle types: `Car`, `Sports Car`, `Convertible Sports Car`, `Hypercar`, `Motorcycle`, `SUV`, `Scooter`, `Kart`, `Special`.

Reality status: structured seed records; likely hand-entered/curated. No separate detail route.

### Tier List

Confirmed source: `src/data/tierList.js`, local persistence in `src/pages/TierListPage.jsx` and admin override in `adminStorage.js`.

Tier list fields: `id`, `title`, `description`, `updatedAt`, `settings`, `tiers[]`.

Tier fields: `id`, `label`, `subtitle`, `color`, `characterIds`.

Confirmed official placements: 18 character ids across S+, S, A, B, C, Unranked. User statement "18 placed" is derived from data, not just visual.

LocalStorage keys:

| Key | Purpose |
| --- | --- |
| `nte.personal-tier-list`? | Not used. |
| `nte-personal-tier-list` | Personal tier list state. |
| `nte-personal-tier-list-presets` | Saved personal tier presets. |
| `nte.admin.tierList` | Admin official tier list override. |
| `nte-official-tier-list-override` | Legacy official override key. |

### Build Planner Draft and Team Slot

Confirmed source: `src/pages/BuildPlannerPage.jsx`, `src/utils/buildCalculator.js`.

State shape:

```js
{
  slots: Array.from({ length: 4 }, () => ({
    characterId: null,
    level: 80,
    weaponId: null,
    arcId: null,
    arcLevel: 80,
    weaponLevel: 80,
    console: {
      cartridgeId: null,
      rarity: 'S',
      mainStat: null,
      subStats: []
    },
    modules: [],
    awakening: {},
    abilities: {},
    activeCycles: []
  })),
  activeSlotIndex: 0,
  teamEffects: [],
  esperCycles: []
}
```

Draft export payload:

```js
{
  version: 1,
  source: 'NTE Community Database',
  type: 'build-planner-draft',
  createdAt: 'ISO date',
  teamSlots: buildState.slots,
  selectedSlot: buildState.activeSlotIndex,
  activeTab,
  plannerState: buildState,
  previewStats: calculation?.stats || null,
  characterName: selectedCharacter?.name || null
}
```

LocalStorage:

| Key | Purpose |
| --- | --- |
| `nte.admin.plannerDrafts` | Current saved Build Planner drafts. |
| `nte-build-planner-drafts` | Legacy draft key migrated into current key. |

### Stats

Confirmed source: `src/data/stats.js`, `src/utils/statAliases.js`, planner stat defs in `src/utils/buildCalculator.js`.

Stat definition fields: `id`, `name`, `displayName`, `category`, `valueType`, `iconKey`, allowed flags, `sortOrder`. Categories include core, offense, defense, healing, elemental damage/resistance, special. `cognitive_dmg_bonus` exists and displays as Mental DMG Bonus in the registry, while planner key uses `cognitiveDmg`.

### Skill

Confirmed source/normalizer: `src/data/skillBlocks.js`.

Normalized fields: `id`, `name`, `type`, `icon`, `enabled`, `descriptionBlocks`, `quote`, `attributeLevels`, `attributesByLevel`, `knownLevels`, `maxLevel`, `upgradeMaterials`, `currencyCost`, `sourceStatus`, `canonicalType`.

Status: rich enough for detail display, not yet a full damage formula engine.

### Material

Confirmed source/normalizer: `src/data/materialBlocks.js` and skill material normalization in `skillBlocks.js`.

Status: partial. Materials are currently embedded under characters/skills; no central material catalog or SQL-ready material id table exists yet.

### Voice Actor, Banner History, Language/Translation, Quotes, Personal Items

Confirmed from code: `overviewBlocks.js` supports block types such as `voiceActors`, `bannerHistory`, `languageTable`, `itemCards`, `quoteCards`, `quoteList`. Character detail page renders overview blocks.

Status: these are currently UI block data rather than normalized first-class entity tables. Nanally has richer examples; many characters do not.

### Guide, Code, News, Community, Apartment

| Entity | Current status |
| --- | --- |
| Guide | Placeholder page with hardcoded categories in `GuidesPage.jsx`; no guide data file/table. |
| Code | Structured seed in `src/data/codes.js`, admin-editable via localStorage. |
| News | Structured seed in `src/data/news.js`, admin-editable via localStorage, YouTube thumbnail helper only. |
| Community item | Placeholder route/page only. Sidebar has static Discord panel text. |
| Apartment item | Placeholder route/page only. Home/category card exists. No data model. |

## 6. Relationship Map

Current actual relationships:

| Relationship | Current implementation |
| --- | --- |
| Character -> element | `character.element` string id, resolved through `gameMeta`. |
| Character -> arc type | `character.arcType` string id, resolved through `gameMeta`. |
| Character -> roles/tags | Arrays of strings; not normalized table. |
| Character -> skills/materials/overview | Embedded object/arrays under character record. |
| Character -> weapon recommendations | `build.recommendedWeaponIds` and `recommendedWeapons[].weaponId`. |
| Character -> cartridge recommendations | `build.recommendedCartridges[].cartridgeId`. |
| Character -> teams | Embedded team/synergy objects with ids/name fallbacks. |
| Weapon -> growth/refinement | Embedded arrays. |
| Cartridge -> module shapes | `compatibleModules[].moduleShapeId` and derived ids. |
| Build Planner -> character/weapon/cartridge/module | Slot stores ids and placement objects. |
| Tier List -> characters | `tiers[].characterIds`. |
| Vehicle | Independent structured entity. |

Ideal future relationships:

| Future relation | Recommended model |
| --- | --- |
| Character roles/elements/arc types | Foreign keys or taxonomy join tables. |
| Character stats | `character_stats` rows by level and stat id. |
| Skills/effects | `character_skills` plus `skill_effects` / `skill_scaling`. |
| Weapons | `weapons`, `weapon_refinements`, `weapon_growth_stats`. |
| Cartridges/modules | `cartridge_sets`, `cartridge_set_bonuses`, `module_shapes`, `cartridge_module_shapes`. |
| Planner | Draft -> slots -> equipped weapon/cartridge/modules/stats. |
| Tier list | Tier list -> tier rows -> character entries. |
| Media | Stable `media_assets` referenced by all entities. |

## 7. Build Planner Deep Audit

Files:

| File | Role |
| --- | --- |
| `src/pages/BuildPlannerPage.jsx` | Main planner UI, state, local draft persistence, export/import/image export, character picker, weapon tab, cartridge tab, module tab, placeholder awakening/abilities tabs, Esper cycle panel. |
| `src/utils/buildCalculator.js` | Pure stat calculation pipeline. |
| `src/utils/buildPlannerCalculations.js` | Re-export shim for `buildCalculator.js`. |
| `src/data/esperCycles.js` | Esper cycle definitions and active cycle preview. |
| `src/data/modulePieces.js` | Module piece stats and generated pieces. |
| `src/utils/moduleShapeRefs.js` | Shape/ref normalization and active cartridge set shape matching. |
| `src/components/ConsoleModuleBoard.jsx` | Interactive module board used by planner/modules. |

Current flows:

| Flow | Status |
| --- | --- |
| Team slots | Confirmed: four slots in build state; selecting a character updates slot `characterId`. |
| Character selection | Confirmed: modal picker with query, rarity, element, arc type, role filters using `mergedCharacters`. |
| Arc/weapon selection | Confirmed: filterable weapon list using `mergedWeapons`; selected weapon id and level affect preview stats. |
| Cartridge selection | Confirmed: selects `console.cartridgeId`, rarity, main stat, substats from cartridge stat options. |
| Module placement | Confirmed: can select shapes/rarity, place modules on board, edit main/sub stats; placed modules flow into calculator. |
| Awakening tab | Placeholder/mock: copy says it will track unlocked nodes; no real awakening effect engine. |
| Abilities tab | Placeholder/mock: copy says future skill/passive comparisons; no formula engine. |
| Esper Cycle tab | Partly real: detects active cycles from selected team elements; does not fully apply cycle math to final stats. |
| Save Draft | Confirmed: saves draft object to `nte.admin.plannerDrafts`. |
| Drafts modal | Confirmed: load, rename, delete local drafts. |
| Export Draft | Confirmed: downloads JSON payload with `type: build-planner-draft`. |
| Import Draft | Confirmed: validates payload type and `plannerState`, sanitizes state. |
| Export Image | Confirmed: canvas-based PNG export; requires selected character. |
| Reset | Confirmed: resets to `createEmptyBuildState()`. |

Calculation pipeline confirmed in `buildCalculator.js`:

1. Get active slot and selected character/weapon/cartridge.
2. Get base character stats at selected level.
3. Apply selected weapon growth stats.
4. Apply console cartridge main/sub stats.
5. Apply module fixed/sub stats.
6. Evaluate active cartridge set bonuses from placed required shapes.
7. Apply direct set bonuses.
8. Apply character console/build traits when structured.
9. Include active Esper cycles/conditional effects as sources; not all become stat math.

Real calculations today: HP, ATK, DEF, crit, charge efficiency, essence/essentia, destruction/break intensity, damage bonus, element damage bonuses, healing/shield where structured, weapon stats, module stats, direct set bonuses, some character traits.

Missing/placeholder calculations: battle-state toggles, awakening effects, ability formula scaling, damage output simulation, enemy DEF/RES effects, conditional stack handling, generalized passive engine, account-backed saved builds.

Future SQL/backend tables for planner:

| Table | Purpose |
| --- | --- |
| `build_drafts` | Draft metadata: owner, name, active slot, visibility, version, timestamps. |
| `build_slots` | One row per team slot with character, level, weapon/arc, cartridge selection, awakening settings. |
| `build_slot_modules` | Placed module instances: shape id, rarity, x/y, main stat, substats, level. |
| `build_slot_stats` | Optional cached calculated stats for fast display/share. |
| `saved_builds` | Published/community builds separate from private drafts. |
| `user_builds` | User ownership/favorites/copies. |
| `build_effect_toggles` | Manual toggles for conditional passives, stacks, enemy state, cycle effects. |

## 8. Admin Mode Audit

Admin mode is real but local-only.

Toggle:

| Behavior | File |
| --- | --- |
| Account menu button toggles Admin Mode | `src/components/Topbar.jsx` |
| Admin state stored as `nte.admin.mode` (`1` means enabled) | `src/admin/adminStorage.js` |
| Context exposes merged data and save/create/delete helpers | `src/admin/AdminModeContext.jsx` |
| Admin Overview modal exports/imports/resets local data | `src/admin/AdminDashboard.jsx` |

Admin localStorage keys:

| Current key | Legacy key(s) | Entity |
| --- | --- | --- |
| `nte.admin.mode` | `nte-admin-mode` | Admin mode toggle. |
| `nte.admin.version` | none | Admin data version. |
| `nte.admin.meta` | none | Last save metadata. |
| `nte.admin.characters` | `nte-character-overrides` | Character overrides. |
| `nte.admin.cartridges` | `nte.admin.modules`, `nte-cartridge-overrides` | Cartridge overrides. |
| `nte.admin.moduleShapes` | `nte-module-shape-overrides` | Module shape overrides, but not broadly surfaced in UI. |
| `nte.admin.weapons` | `nte-weapon-overrides` | Weapon overrides. |
| `nte.admin.vehicles` | `nte-vehicle-overrides` | Vehicle overrides. |
| `nte.admin.codes` | `nte-code-overrides` | Code overrides. |
| `nte.admin.tierList` | `nte-official-tier-list-override` | Official tier list override. |
| `nte.admin.news` | `nte-news-overrides` | News overrides. |

Editable entities confirmed:

| Entity | UI/editor |
| --- | --- |
| Characters | `CharacterEditModal`, plus detail-page editors: overview, skills, materials, teams, console info/layout, build. |
| Weapons | `WeaponEditor`; used by Weapons page/admin flows. |
| Cartridges | `CartridgeEditor`; Modules page and Cartridge detail. |
| Vehicles | `VehicleEditor`; Vehicles page. |
| Codes | Inline `CodeEditor` inside `CodesPage.jsx`. |
| News | Inline `NewsEditor` inside `NewsPage.jsx`. |
| Official tier list | `TierListPage.jsx` edit/save in admin mode. |

Persistence: all edits persist to browser localStorage only. They do not write back to JS files, JSON files, SQL, or a server.

Incomplete/risky admin areas:

| Issue | Status |
| --- | --- |
| No authentication or role checks | Missing. Anyone with UI access can toggle local admin. |
| No backend persistence | Missing. Data is per browser profile. |
| Character override allowlist can drop future unknown fields | Confirmed in `adminStorage.js::applyCorePatch`. |
| Module shape override helpers exist but no full module shape admin workflow is obvious | Needs verification. |
| Admin buttons can overlap/z-index on detail pages | Needs browser verification; many floating/edit controls use sticky/topbar/modal z-index. |
| No conflict/version history | Missing except minimal local metadata. |

Future admin should use login/auth/backend roles, server-side validation, revision history, import review, and audit logs.

## 9. Visual/UI System Audit

Current visual style to preserve:

| Element | Current style |
| --- | --- |
| Background | `#f8f8f7`, soft off-white. |
| Text | Primary `#111111`; muted `#6b7280`, `#9ca3af`. |
| Accent | Pink/red `#ff2f6d`; hover tones like `#be123c`. |
| Cards | White/near-white panels with `border-black/[0.05-0.08]`, large radii often 22-28px, soft shadows. |
| Navigation | Fixed/sticky left rounded sidebar; top rounded search/nav capsule. |
| Filters | Rounded chips/buttons and compact control bars. |
| Badges | Element/rarity/type chips, icon badges. |
| Layout | Spacious cards and responsive grids. |
| Light/dark | Light mode visible; dark mode button is preview/coming soon, not real theme switch. |

Needs polish later:

| Area | Notes |
| --- | --- |
| Admin positioning | Floating edit controls should be checked against sticky topbar and content. |
| Responsive QA | Need screenshots for mobile/tablet/desktop for all major pages. |
| Hierarchy | Some hero/detail sections may have empty space or uneven block placement. |
| Placeholder sections | Guides/Community/Apartments should not look final until data exists. |
| Encoding | Some text in Sidebar/support button and docs/data appears mojibake. Needs UTF-8 cleanup in a controlled pass. |
| Icons/assets | Some section card visuals/icons can be made more consistent without redesigning. |

Do not replace this with heavy neon/cyberpunk. The liked direction is light iOS/Apple-like, soft glass/capsule UI, premium anime/game database.

## 10. Component Inventory

| Component/file | Purpose | Props/signature (observed) | Used by | Issues |
| --- | --- | --- | --- | --- |
| `src/App.jsx` | Shell/router/search/page orchestration | Internal state | Entire app | Custom router lacks character detail URL. |
| `src/components/Sidebar.jsx` | Fixed/mob sidebar nav | `mobileOpen`, `onClose`, `activePage`, `onNavigate` | App | Static Discord/support/theme/collapse controls; support text encoding issue. |
| `src/components/Topbar.jsx` | Search, suggestions, admin toggle/menu | search/admin callbacks | App | Theme/settings are placeholders. |
| `src/components/Hero.jsx` | Home hero counters/features | `onNavigate` | Home | Uses merged counts; Community hardcoded 0. |
| `src/components/CategoryCard.jsx` | Home category card | category, navigate | Home | Data-driven from `categories`. |
| `src/components/CharacterCard.jsx` | Character grid card | character/open/admin edit | Characters | Uses name-based asset helper fallback. |
| `src/components/CharacterFilters.jsx` | Character filter chip UI | filters/update/resultCount | Characters | Page-local filter model. |
| `src/components/CharacterHero.jsx` | Character detail hero/summary | character-related | Character detail | Needs z-index/admin QA. |
| `src/components/CharacterTabs.jsx` | Detail tabs | tab config | Character detail | Simple reusable tab strip. |
| `src/components/BuildSection.jsx` | Character detail build recommendations | build/console callbacks | Character detail | Resolves recommendations; not the planner itself. |
| `src/components/TeamSection.jsx` | Character teams/synergies | character/team data | Character detail | Embedded character team data. |
| `src/components/ConsoleTab.jsx` and console components | Console layout rendering | console setup data | Character detail | Separate from planner board but related. |
| `src/components/ConsoleModuleBoard.jsx` | Interactive grid board | placements/shape callbacks | Build Planner/admin | Large complex component; inspect before changes. |
| `src/components/weapons/*` | Weapon card/detail metrics/growth/refinement | weapon props | Weapons/detail/planner | Good separation. |
| `src/components/cartridges/*` | Cartridge card/icon/style | cartridge/rarity props | Modules/detail/planner | Relies on cartridge data. |
| `src/components/vehicles/*` | Vehicle showroom/stats/rail/nav | vehicle list/active callbacks | Vehicles | No separate detail page. |
| `src/components/ui/FilterControlBar.jsx` | Shared sort/view/clear bar | result count/sort/view callbacks | Characters/Modules/etc | Good reusable component. |
| `src/components/ui/SummaryCounters.jsx` | Metric capsules | `items` | Pages | Good reusable component. |
| `src/components/ui/PageAdminActions.jsx` | Admin action wrapper/add button | children/className/label | Pages | Helps align add buttons. |

Admin editors:

| File | Purpose |
| --- | --- |
| `src/admin/CharacterEditModal.jsx` | Core character add/edit/delete/reset. |
| `src/admin/OverviewBlockEditor.jsx` | Overview block editing. |
| `src/admin/SkillsEditor.jsx` | Skill editing. |
| `src/admin/CharacterMaterialsEditor.jsx` | Materials editing. |
| `src/admin/TeamsEditor.jsx` | Teams editing. |
| `src/admin/ConsoleInfoEditor.jsx` | Console info/recommended arc/cartridge editing. |
| `src/admin/ConsoleLayoutEditor.jsx` | Console grid/layout editing. |
| `src/admin/BuildEditor.jsx` | Character build recommendation editing. |
| `src/admin/WeaponEditor.jsx` | Weapon editing. |
| `src/admin/CartridgeEditor.jsx` | Cartridge editing. |
| `src/admin/VehicleEditor.jsx` | Vehicle editing. |
| `src/admin/AdminDashboard.jsx` | Export/import/reset/status modal. |

## 11. State Management and Persistence

State types:

| State | Location |
| --- | --- |
| Current route/page/search | `src/App.jsx` local state. |
| Filters/sort/view modes | Individual page local state. |
| Admin mode and merged data | `src/admin/AdminModeContext.jsx`. |
| Entity overrides | `localStorage` through `adminStorage.js`. |
| Build Planner active build | `BuildPlannerPage.jsx` local state. |
| Build Planner saved drafts | `localStorage` key `nte.admin.plannerDrafts`. |
| Tier personal list/presets | `localStorage` keys in `TierListPage.jsx`. |

Nothing syncs to a backend. Export/import is JSON download/upload in the browser.

For SQL migration: replace `AdminModeContext` localStorage write functions with API calls or add a repository layer that can read from API while preserving local drafts as fallback. Keep seed JS only as migration/import source.

## 12. Assets and Images Audit

Confirmed asset folders:

| Folder | Contents |
| --- | --- |
| `public/assets/nte/characters` | 18 character PNGs. Includes aliases like `Zero.png`, `Zero (2).png`, `Daffodill.png`, `Haniel.png`. |
| `public/assets/nte/characters_f` | At least `Nanally_f.png` full art. |
| `public/assets/nte/weapons` | 42 weapon PNGs. |
| `public/assets/nte/modules` | Cartridge set images with rarity suffixes `(S)`, `(A)`, `(B)` for 12 sets. |
| `public/assets/nte/cars` | Vehicle images, 16 files; vehicle `Future Surge` maps to `Rivok.png`. |
| `public/assets/nte/misc` | Element/type/rank icons. |

Runtime resolution: `src/utils/assetHelpers.js` uses `BASE_PATH = '/assets/nte'`, hardcoded file lists, aliases, and category helpers.

Current risks:

| Risk | Example |
| --- | --- |
| Name-based lookup | `getCharacterAsset(character.name)`, `getWeaponAsset(weapon.name)`. |
| Alias cleanup needed | Daffodil asset is `Daffodill.png`; Hanizel maps to Haniel; Bose maps to synthesis icon. |
| Full art not normalized | `characters_f/Nanally_f.png` exists, but full art media is not a general entity field/table. |
| Images not optimized | No responsive sizes, CDN, width/height metadata, or alt/source metadata. |

Production recommendation: create `media_assets` records with `id`, `entity_type`, `entity_id`, `kind` (`avatar`, `fullArt`, `card`, `icon`, `transparent`), path/url, alt text, source/license, width/height, and status.

## 13. SQL/Backend Migration Preparation

Current SQL: `db/schema.sql` only covers module rarities/types/shapes/modules/stat templates/substat pools. It is useful but not complete.

Proposed relational schema:

| Table | Purpose | Important columns | Relationships/notes |
| --- | --- | --- | --- |
| `users` | Accounts | `id`, `email`, `display_name`, `created_at` | Own drafts/builds; optional public profile. |
| `roles` | Auth roles | `id`, `name` | Admin/editor/moderator roles. |
| `user_roles` | Role join | `user_id`, `role_id` | Many-to-many. |
| `characters` | Core character identity | `id`, `slug`, `name`, `rarity`, `element_id`, `arc_type_id`, `faction`, `birthday`, `profile`, `release_status` | Main entity. |
| `character_translations` | Localized names/profile | `character_id`, `locale`, `name`, `profile`, `quotes_json` | Supports languages/translations. |
| `character_stats` | Stats by level | `character_id`, `level`, `stat_id`, `value`, `source_status` | Calculator source. |
| `character_skills` | Skill records | `id`, `character_id`, `type`, `name`, `description`, `max_level` | Detail and future formulas. |
| `character_skill_scaling` | Skill level rows | `skill_id`, `level`, `label`, `value`, `value_type` | Damage/formula-ready. |
| `character_roles` | Character role taxonomy | `character_id`, `role_id` | Replace free strings. |
| `character_materials` | Ascension/skill/life materials | `character_id`, `material_id`, `context`, `amount`, `level_range` | Needs central `materials`. |
| `materials` | Material catalog | `id`, `name`, `rarity`, `icon_asset_id` | Shared. |
| `character_voice_actors` | Voice actors | `character_id`, `locale`, `actor_name`, `source_status` | Detail overview. |
| `character_banner_history` | Availability | `id`, `character_id`, `banner_name`, `start_date`, `end_date`, `version` | Future banners. |
| `weapons` | Arcs/weapons | `id`, `slug`, `name`, `rarity`, `arc_type_id`, `quote`, `main_stat_id`, `main_stat_value`, `sub_stat_id`, `sub_stat_value` | Current `weapons.js`. |
| `weapon_refinements` | R1-R5 effects | `weapon_id`, `rank`, `effect_text`, `effect_json` | Structured later. |
| `weapon_growth_stats` | Level growth | `weapon_id`, `level`, `atk`, `sub_stat_id`, `sub_stat_value` | Planner. |
| `module_shapes` | Shape catalog | `id`, `type`, `name`, `matrix_json`, `cell_count` | From `moduleCatalog.js`. |
| `module_sets` / `cartridge_sets` | Cartridge set identity | `id`, `slug`, `name`, `element_id`, `bonus_category`, `description` | Use one naming convention. |
| `module_set_bonuses` | 2pc/4pc effects | `set_id`, `pieces`, `effect_text`, `effect_json`, `is_conditional` | Planner. |
| `cartridge_shape_requirements` | Set compatible shapes | `set_id`, `module_shape_id`, `slot`, `status` | Exact shape verification. |
| `module_stat_values` | Module stat table | `rarity`, `module_type`, `stat_id`, `value`, `slot_type` | From `modulePieces.js` and cartridge stat max values. |
| `vehicles` | Vehicle records | `id`, `name`, `type`, `currency`, `price`, `max_speed`, `acceleration`, `durability`, `handling_json`, `asset_id` | Vehicle page. |
| `tier_lists` | Tier list metadata | `id`, `title`, `description`, `updated_at`, `owner_id`, `visibility`, `settings_json` | Official/user. |
| `tier_list_entries` | Placements | `tier_list_id`, `tier_id`, `character_id`, `position` | Ordered placements. |
| `build_drafts` | Draft metadata | `id`, `user_id`, `name`, `active_slot_index`, `version`, `created_at`, `updated_at` | Planner drafts. |
| `build_slots` | Draft team slots | `id`, `draft_id`, `slot_index`, `character_id`, `level`, `weapon_id`, `weapon_level`, `cartridge_id`, `cartridge_rarity`, `main_stat_id` | Planner selections. |
| `build_slot_modules` | Placed modules | `id`, `slot_id`, `shape_id`, `rarity`, `x`, `y`, `main_stat_id`, `substats_json` | Board placements. |
| `build_slot_stats` | Cached output | `slot_id`, `stat_id`, `value`, `source_breakdown_json` | Optional. |
| `guides` | Guide articles | `id`, `slug`, `title`, `category`, `body`, `author_id`, `status` | Future content. |
| `codes` | Redeem codes | `id`, `code`, `reward_summary`, `status`, `start_date`, `end_date`, `source_url` | Codes page. |
| `news_posts` | News records | `id`, `title`, `description`, `category`, `date`, `source_label`, `source_url`, `image_asset_id`, `featured`, `pinned` | News page. |
| `community_links` | Community resources | `id`, `label`, `url`, `category`, `status` | Future Community page. |
| `apartments` | Housing items | `id`, `name`, `category`, `description`, `price`, `asset_id` | Future Apartments. |
| `media_assets` | Images/icons/videos | `id`, `entity_type`, `entity_id`, `kind`, `path`, `alt`, `source`, `license`, `width`, `height` | Asset normalization. |
| `admin_logs` | Audit trail | `id`, `admin_user_id`, `entity_type`, `entity_id`, `action`, `before_json`, `after_json`, `created_at` | Production admin safety. |

Current data mapping:

| Current source | Future SQL target |
| --- | --- |
| `src/data/characters/*` | `characters`, `character_translations`, stats/skills/materials/voice/banner/team/build tables. |
| `src/data/weapons.js` | `weapons`, `weapon_refinements`, `weapon_growth_stats`, media. |
| `src/data/cartridges.js` | `cartridge_sets`, `module_set_bonuses`, shape requirement tables, stat values. |
| `src/data/moduleCatalog.js` | `module_shapes`. |
| `src/data/modulePieces.js` | `module_stat_values` / generated view. |
| `src/data/vehicles.js` | `vehicles`, media. |
| `src/data/tierList.js` | `tier_lists`, `tier_list_entries`. |
| localStorage planner drafts | `build_drafts`, `build_slots`, `build_slot_modules`, stats caches. |
| `src/data/codes.js` | `codes`. |
| `src/data/news.js` | `news_posts`. |

## 14. API/Backend Planning

Public endpoints:

| Endpoint | Purpose |
| --- | --- |
| `GET /characters` | Character list/filter payload. |
| `GET /characters/:idOrSlug` | Character detail. |
| `GET /weapons` | Weapon list. |
| `GET /weapons/:idOrSlug` | Weapon detail. |
| `GET /cartridges` | Cartridge set list. |
| `GET /cartridges/:idOrSlug` | Cartridge detail. |
| `GET /module-shapes` | Module shape catalog. |
| `GET /vehicles` | Vehicle list. |
| `GET /tier-lists/official` | Official tier list. |
| `GET /guides`, `GET /guides/:slug` | Guide content. |
| `GET /codes` | Public active/expired codes. |
| `GET /news` | News feed. |
| `GET /community-links` | Community page links. |

User endpoints:

| Endpoint | Purpose |
| --- | --- |
| `POST /builds` | Save draft/build. |
| `GET /users/:id/builds` | User saved builds. |
| `PATCH /builds/:id` | Update draft. |
| `DELETE /builds/:id` | Delete draft. |
| `POST /tier-lists` | Create personal tier list. |
| `PATCH /tier-lists/:id` | Update personal tier list. |

Admin-only endpoints:

| Endpoint | Purpose |
| --- | --- |
| `POST /admin/characters`, `PATCH /admin/characters/:id`, `DELETE /admin/characters/:id` | Character CMS. |
| `POST/PATCH/DELETE /admin/weapons` | Weapon CMS. |
| `POST/PATCH/DELETE /admin/cartridges` | Cartridge CMS. |
| `POST/PATCH/DELETE /admin/vehicles` | Vehicle CMS. |
| `POST/PATCH/DELETE /admin/codes` | Code CMS. |
| `POST/PATCH/DELETE /admin/news` | News CMS. |
| `PATCH /admin/tier-lists/official` | Official tier list update. |
| `POST /admin/media` | Upload/register media. |
| `GET /admin/logs` | Audit log. |

## 15. SEO and Production Readiness Audit

Current status: Vite SPA with no confirmed route-specific SEO. `index.html` exists but no sitemap/robots/OpenGraph route generation was found in source inspection.

Production needs:

| Area | Recommendation |
| --- | --- |
| Titles/meta | Per route/entity title and meta description. |
| OpenGraph | Character/weapon/news share cards. |
| Sitemap | Generate static sitemap for public entity URLs. Character detail needs real URL route first. |
| Robots | Add `robots.txt` after launch strategy is decided. |
| Clean URLs | Existing weapons/modules have URL paths; character detail needs `/characters/:idOrSlug`. |
| Performance | Optimize images, lazy load heavy grids, consider code splitting. |
| Accessibility | Audit keyboard navigation, labels, focus states, color contrast, drag alternatives. |
| Mobile | Screenshot test every route; fix overflow/overlap. |
| Error pages | Add not found/invalid entity handling for deep links. |
| Analytics | Add privacy-conscious analytics after launch. |
| Ads | Avoid intrusive ads that damage premium UI or mobile usability. |
| Legal/fan disclaimer | Add unofficial fan-site disclaimer and asset/source policy. |
| Copyright | Track source/licensing for screenshots, icons, official art, and translations. |

## 16. Problems and Risks

| Risk | Location/evidence | Impact |
| --- | --- | --- |
| Hardcoded JS seed data | `src/data/*.js` | Manual migration and merge conflicts later. |
| Mock/local admin mode | `Topbar`, `AdminModeContext`, `adminStorage` | Not secure or collaborative. |
| No backend/auth | Whole app | Cannot safely host real admin features. |
| localStorage-only drafts | Build Planner/Tier/Admin | Data loss across browsers/devices. |
| Build Planner incomplete | Placeholder Awakening/Abilities; conditional effects display-only | Calculator not yet final. |
| Inconsistent names/aliases | `assetHelpers`, stat aliases, mojibake text | Migration and polish risk. |
| Duplicated/derived module catalogs | `moduleCatalog.js`, `modulePieces.js`, `src/data/modules/*` | Drift if edited independently. |
| Weak type safety | JS only; JSDoc partial | Runtime regressions possible. |
| Missing relationships | materials/guides/community/apartments not normalized | Backend schema work needed. |
| Asset paths hardcoded | `assetHelpers.js` | Production media management not ready. |
| Responsive/z-index issues | Needs browser QA; admin floating controls | UI polish risk. |
| SEO not ready | SPA only | Poor discoverability if launched now. |
| Deployment not documented | No deployment config found | Production launch work needed. |
| Fan asset/legal risk | No source/license metadata | Monetization and public launch risk. |

## 17. Prioritized Roadmap

Phase 1: Documentation and stabilization

- Keep this audit updated.
- Fix obvious UI bugs only; do not redesign.
- Add smoke tests/build checks.
- Standardize entity ids and data references.
- Preserve current light/premium design.

Phase 2: Visual polish

- Polish character detail hero/layout spacing.
- Improve full art support without changing visual identity.
- Improve section cards/icons.
- Fix admin button positioning and z-index.
- Perform responsive screenshot QA.

Phase 3: Data architecture

- Normalize frontend data shapes.
- Remove duplicated hardcoded values and legacy name fallbacks from write paths.
- Define stable schemas for characters, weapons, cartridges, vehicles, tier lists, news/codes.
- Convert central data to JSON-safe structures or generate JS from canonical JSON.
- Prepare full SQL schema and migration scripts.

Phase 4: Build Planner real logic

- Connect every selected character/weapon/cartridge/module stat structurally.
- Add real awakening/passive/ability toggles.
- Implement conditional effect system.
- Add team effects and Esper cycle math only where verified.
- Harden draft import/export with schema versions.

Phase 5: Backend and admin

- Add SQL database.
- Add API layer.
- Add login/auth/admin roles.
- Replace local admin overrides with server persistence.
- Add admin logs and content review workflow.

Phase 6: Production launch

- Domain/hosting/server plan.
- SEO metadata, sitemap, robots, OpenGraph.
- Performance/image optimization.
- Analytics.
- Careful ad placement.
- Community feedback loop.
- Legal/fan-site disclaimer and source/license tracking.

## 18. Context for ChatGPT Continuing This Project

This project is a serious unofficial Neverness to Everness fan database. The current design is liked and should be preserved: light iOS-like premium UI, soft white/gray background, rounded cards, capsule navigation, glass-like panels, soft shadows, pink/red accent, left fixed sidebar, top search capsule, clean data cards.

Current architecture: React/Vite SPA, custom route state in `App.jsx`, Tailwind utility styling, static JS seed data, `AdminModeContext` localStorage override layer, Build Planner local state plus pure calculator helpers. No backend, no auth, no SQL runtime yet.

Most important files to inspect first:

1. `src/App.jsx`
2. `src/admin/AdminModeContext.jsx`
3. `src/admin/adminStorage.js`
4. `src/pages/BuildPlannerPage.jsx`
5. `src/utils/buildCalculator.js`
6. `src/data/characters/index.js`
7. `src/data/characterSchema.js`
8. `src/data/weapons.js`
9. `src/data/cartridges.js`
10. `src/data/moduleCatalog.js`

Biggest problems: localStorage-only admin/planner persistence, no auth/backend, mixed canonical/display data, placeholder guide/community/apartment models, incomplete Build Planner effect system, name-based asset paths, and no production SEO/legal readiness.

What not to change: do not redesign the site, do not replace the clean light UI, do not migrate to SQL until the frontend data model is stabilized, do not remove existing data or assets casually, and do not refactor broad architecture before fixing known bugs and documenting schemas.

Next safest step: add a small stabilization pass that preserves visuals while making entity routes and data references more reliable, starting with a real `/characters/:idOrSlug` route and a JSON-safe schema contract for characters/weapons/cartridges/planner drafts.

