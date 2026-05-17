# Data Normalization Phase 2

Date: 2026-05-16

Goal: prepare current frontend/static data for future SQL/backend migration without changing the current runtime UI, Admin Mode, Build Planner, localStorage compatibility, or visual design.

## Additions in This Phase

- JSDoc schema contracts in `src/data/schemas/`.
- Non-invasive export normalizers in `src/data/normalizers/`.
- Static seed export index in `src/data/exportDataIndex.js`.
- Data audit script in `scripts/audit-data.mjs`.
- `npm run audit:data`.
- Generated report in `docs/DATA_AUDIT_REPORT.md`.
- SQL mapping draft in `docs/SQL_MIGRATION_MAP.md`.

## Entity Model Matrix

| Entity | Current source files | Current fields | Recommended canonical fields | Required fields | Optional fields | Display-only fields | SQL/backend fields later | Relationships | Placeholder/mock fields | Risk fields | Migration notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Character | `src/data/characters/*`, `characters/index.js`, `characterSchema.js`, canonical adapter | `id`, `name`, `rarity`, `element`, `arcType`, `roles`, `tags`, `shortDescription`, `stats`, `levelStats`, `overview`, `skills`, `build`, `teams`, `consoleSetup`, `materials` | `id`, `slug`, `name`, `rarity`, `elementId`, `arcTypeId`, `roleIds`, `tagIds`, profile, statsByLevel, skills, materials, media refs | id, slug, name, rarity, elementId, arcTypeId, roleIds | faction, birthday, profile, build, consoleSetup, translations | overview block layout, card gradients, status badges | `characters`, translations, stats, roles, skills, materials, voice actors, banner history | Weapons, cartridges, tier entries, builds, teams | Many non-Nanally details are skeletons | roles/tags overlap; estimated default stats | Keep ids stable; migrate rich fields gradually. |
| Weapon / Arc | `src/data/weapons.js` | id, slug, name, rarity, type, quote, mainStat, subStat, refinements, growthScaling | id, slug, name, rarityId, arcTypeId, stat refs, refinements, growthStats | id, slug, name, rarity, arcTypeId | quote, recommendedCharacterIds, media | shortDescription/card badges | weapons, refinements, growth stats | Characters via recommendations/builds | None major | refinement effects text-only | Good first SQL import candidate. |
| Cartridge Set | `src/data/cartridges.js` | id, slug, name, theme, element, bonusCategory, bonuses, compatibleModules, variants, dataStatus | id, slug, name, elementId, bonusCategory, availableRarities, bonuses, compatibleShapes | id, slug, name, bonusCategory, availableRarities | description, notes, media | icon color/rarity glow | cartridge_sets, bonuses, compatible shapes | Module shapes, builds, characters | `missing-compatible-shapes` on all sets | compatible shapes need verification | Import with `source_status` until verified. |
| Module Shape | `src/data/moduleCatalog.js` | id, type, name, matrix | id, moduleType, name, matrix, cellCount | id, moduleType, name, matrix, cellCount | sortOrder | rendered shape color | module_shapes | Cartridge compatibility, module pieces | None | aliases in `normalizeShapeId` | Stable and SQL-ready. |
| Module Piece | `src/data/modulePieces.js` | generated id, rarity, moduleType, shapeId, stats | id, rarity, moduleType, shapeId, maxLevel, mainStats, possibleSubStats | id, rarity, moduleType, shapeId, maxLevel | icon/image | color blocks | module_pieces or generated view, stat templates | Module shapes, stats, build slots | images empty | generated not authored | Prefer generated view from shapes + stat templates. |
| Vehicle | `src/data/vehicles.js` | id, assetKey, name, type, currency, price, maxSpeed, acceleration, durability, handling | id, slug, name, type, acquisition, stats, handling, media ref | id, slug, name, type, maxSpeed, acceleration, durability | price, description, handling | showroom layout | vehicles, vehicle_stats, acquisition | Media | unknown prices | assetKey aliases | SQL-ready after media alias mapping. |
| Tier List | `src/data/tierList.js`, localStorage | id, title, description, updatedAt, settings, tiers | id, title, listType, settings, tier rows | id, title, listType, tiers | owner, visibility | colors, watermark settings | tier_lists, tier_rows | Characters/users | Personal local-only | localStorage official override | Keep official and personal separate. |
| Tier List Entry | `tierList.js` tiers characterIds | character id arrays | tierListId, tierId, characterId, position | tierListId, tierId, characterId, position | note | token display | tier_entries | Characters, tier rows | None | order encoded by array index | Normalize arrays into rows. |
| Build Planner Draft | `BuildPlannerPage.jsx` localStorage | id, name, state, savedAt | id, userId later, version, name, activeSlotIndex, slots | id, version, name, savedAt, slots | previewStats, activeTab | export image only | build_drafts | Users later, slots | local-only | schema not versioned deeply | Keep local export import until backend. |
| Build Planner Slot | `buildCalculator.js`, planner state | characterId, level, weaponId, console, modules, awakening, abilities | slotIndex, characterId, level, weaponId, cartridgeId, module placements | slotIndex, level | awakening, abilities, toggles | preview panel grouping | build_slots, build_slot_modules, stats | Characters, weapons, cartridges, modules | Awakening/abilities placeholder | conditional effects not modeled | Do not fake formulas; model toggles later. |
| Stats | `src/data/stats.js`, `statAliases.js`, calculator | id, name, category, valueType, allowed flags | id, name, category, valueType, aliases, allowed flags | id, name, category, valueType | iconKey, localized names | labels | stats | All stat-bearing tables | None | alias drift; Cognitive/Mental naming | Centralize before SQL import. |
| Element | `gameMeta.jsx`, filters | id, label, color, icon | id, name, color, sortOrder | id, name | icon/media | SVG icon component | elements | Characters, cartridges, stats | Cognitive partial | case mismatch in pages | Add Cognitive deliberately if game requires it. |
| Arc Type | `gameMeta.jsx`, weapons/chars | id/label | id, name, sortOrder | id, name | icon | SVG icon | arc_types | Characters, weapons | Synthesis icon alias for Bose | title/lowercase mismatch | Normalize ids lowercase. |
| Rarity | `gameMeta.jsx`, module catalogs | S/A/B labels/colors | id, name, sortOrder, color | id, name | entityScope | badges | rarities | Many entities | None | character labels use S-Rank/A-Rank | One table with display mapping. |
| Role | `characters/index.js`, constants | free strings | id, name, category, sortOrder | id, name | description | filter labels | roles, character_roles | Characters | tags mixed as roles | duplicate meaning with tags | Separate role taxonomy from tags. |
| Skill | character data, `skillBlocks.js` | id, name, type, descriptions, attributes | id, characterId, type, name, descriptionBlocks, scaling | id, characterId, name, type | quote, knownLevels, materials | accordions/tabs | skills, skill_scaling | Characters, materials | many missing | text not formula-ready | Preserve sourceStatus. |
| Material | character/skill materials | embedded item arrays | id, name, rarity, source, icon/media | id, name | rarity, source | icons | materials, character_materials | Characters, skills | partial | no central catalog | Create catalog before SQL import. |
| Voice Actor | character overview/voiceActors | lang/name rows | characterId, locale, name, sourceStatus | characterId, locale, name | source | overview block | character_voice_actors | Characters | missing for most | display block not normalized | Extract from overview blocks when present. |
| Banner History | overview blocks | title/date rows | id, characterId, bannerName, dates, version | id, characterId, bannerName | source, version | compact banner cards | character_banner_history | Characters | sparse | date precision | Import as optional records. |
| Translation / Other Language | overview language table | rows | entityType, entityId, locale, field, value | entityType, entityId, locale, field | sourceStatus | language table | translations | Any entity | sparse | field mapping | Use generic translations table. |
| Guide | `GuidesPage.jsx` | hardcoded categories only | id, slug, title, category, body/sections, status | id, slug, title | author, tags | category cards | guides, guide_sections | Users later | placeholder page | no real data | Do not SQL import until content exists. |
| Code | `src/data/codes.js` | id, code, rewardSummary, status, dates, sortOrder | id, code, rewardSummary, status, start/end, source | id, code, status | rewards structured later | active/expired grouping | codes | None | empty dates | reward text only | Good seed table after verification. |
| News | `src/data/news.js` | id, title, description, category, date, source, image | id, slug, title, category, date, source, image/media | id, title, category, date | featured, pinned | cards/modals | news_posts | Media | placeholder seed | few real posts | Add source verification. |
| Community item | Sidebar/placeholder | static Discord card | id, label, url, category, status | id, label | count, icon | sidebar card | community_links | None | placeholder | fake member count | Build model later. |
| Apartment item | Placeholder route/category | none | id, slug, name, category, price, media | id, slug, name | description, acquisition | cards later | apartment_items | Media | all missing | no data | Future feature. |
| Media Asset | `mediaRegistry.js`, public assets, `assetHelpers.js` | id, entityType, entityId, kind, path, alt, status | id, entityType, entityId, kind, path, alt, source/license/dimensions | id, entityType, entityId, kind, path, alt | width, height, source | current image placement | media_assets | All entities | alias-derived ids | filename/entity mismatches | Add explicit mappings for aliases. |
| User/Auth future | `src/auth/*` scaffold | anonymous session only | user, role, session, permissions | backend only | profile settings | account menu placeholders | users, roles, sessions, admin_logs | builds/tier/admin | intentionally inactive | no fake auth | Wait for backend schema. |

## Normalization Rules

- Preserve existing ids as external primary keys.
- Use `slug` for routing/display only.
- Keep unknown legacy fields under `raw` during export/migration.
- Do not mutate source objects.
- Prefer id references over names.
- Keep name fallback only for import compatibility.
- Use `sourceStatus` for estimated, placeholder, or verification-needed records.
- Treat localStorage admin overrides as a separate future migration path, not part of static seed export.

## Export-Friendly Structures

`src/data/exportDataIndex.js` exposes static seed data:

```js
export const exportDataIndex = {
  characters,
  weapons,
  cartridges,
  moduleShapes,
  modulePieces,
  vehicles,
  tierList,
  codes,
  news,
  media,
  mediaAliases,
}
```

`getExportDataSnapshot()` wraps it with `generatedAt` and `version`.

## Audit Script

Run:

```powershell
npm.cmd run audit:data
```

The script reports warnings and verification needs. It does not fail the build for data warnings.

Current result summary:

- OK: 18 characters, 42 weapons, 12 cartridges, 12 module shapes, 36 module pieces, 16 vehicles, 18 tier entries, 13 codes, 3 news posts.
- Warnings: 0.
- Needs verification: 12 cartridge compatibility records.
- Resolved media aliases: 8 explicit mappings.
- Blockers: 0.

## Phase 2.5 Cleanup Notes

Confirmed from code:

- `src/data/mediaAliases.js` now documents known filename-derived media aliases separately from canonical entity ids.
- `src/data/mediaRegistry.js` preserves the original `entityId` and adds `resolvedEntityId` for SQL/export safety.
- `scripts/audit-data.mjs` reports known media mismatches under `Resolved media aliases` instead of treating them as unknown entities.
- `src/data/sourceStatus.js` defines the shared source quality vocabulary: `verified`, `needs_verification`, `estimated`, `placeholder`, `mock`, and `unknown`.
- `src/data/normalizers/normalizeCartridge.js` now emits `sourceStatus`, `compatibilitySourceStatus`, and `verified` for export preparation.
- `src/data/taxonomy/roles.js` and `src/data/taxonomy/tags.js` document the split between gameplay roles and descriptive tags.
- `src/data/taxonomy/statNaming.js` documents the Cognitive/Mental naming policy without changing Build Planner calculations.
- `src/data/materialCatalogDraft.js` marks the future material catalog as draft-only.

Cartridge compatibility policy:

- Current cartridge compatible shape data may be used by the existing UI.
- It must be imported to SQL with `source_status = "needs_verification"` until official/source-checked compatibility is confirmed.
- Do not treat `dataStatus: "missing-compatible-shapes"` as verified official compatibility.

Media alias policy:

- Keep current filenames and asset paths unchanged.
- Store canonical SQL links using `resolvedEntityId`.
- Keep original filename-derived ids for traceability and cleanup planning.

Roles/tags policy:

- Roles are gameplay functions used for filters and structured joins.
- Tags are descriptive/freeform labels used for display, search, and secondary classification.
- SQL should use separate `roles`, `tags`, `character_roles`, and `character_tags` tables.

Stat naming policy:

- SQL/API stat ids should use stable snake_case registry ids.
- Cognitive/Mental variants should map to one canonical id, currently `cognitive_dmg_bonus`, while the UI may continue showing `Mental DMG` where appropriate.
- Do not create separate duplicate `mental_*` and `cognitive_*` rows for the same stat.

## Ready for Phase 3?

Ready:

- Schema contracts exist.
- Non-invasive normalizers exist.
- Static export index exists.
- Audit script exists and runs.
- SQL mapping draft exists.
- Media aliases are explicit and audit-visible.
- Source-status vocabulary exists.
- Roles vs tags and stat naming policies are documented.
- No runtime UI migration was made.

Not ready:

- Cartridge compatible shapes still need source verification.
- Character detail depth is uneven.
- Materials, guides, community, apartments, and account entities are not production-modeled yet.

Can SQL start?

SQL schema drafting can start. Real SQL import should wait until cartridge compatibility, material catalog, and core character depth decisions are finalized.

Data blockers before real SQL import:

- Verify cartridge compatible shapes.
- Split character roles vs tags.
- Create material catalog.
- Mark estimated vs verified character stats.

Accounts/auth:

Accounts/auth should wait until backend schema and admin audit strategy exist. The current auth scaffold should remain inactive.
