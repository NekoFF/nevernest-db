# Data Blocker Cleanup Phase 2.5

Date: 2026-05-16

This pass cleaned up SQL-readiness blockers without changing runtime UI, migrating to SQL, adding auth, adding full art, or rewriting the Build Planner.

## What Changed

| Area | Files | Change |
| --- | --- | --- |
| Media aliases | `src/data/mediaAliases.js`, `src/data/mediaRegistry.js` | Added explicit alias mappings and preserved both filename-derived `entityId` and canonical `resolvedEntityId`. |
| Data audit | `scripts/audit-data.mjs`, `docs/DATA_AUDIT_REPORT.md` | Media mismatches covered by aliases now appear under `Resolved media aliases` instead of missing entity warnings. |
| Source status | `src/data/sourceStatus.js` | Added shared source-quality values: `verified`, `needs_verification`, `estimated`, `placeholder`, `mock`, `unknown`. |
| Cartridge export readiness | `src/data/normalizers/normalizeCartridge.js` | Added `sourceStatus`, `compatibilitySourceStatus`, and `verified` to normalized cartridge export objects. |
| Roles/tags | `src/data/taxonomy/roles.js`, `src/data/taxonomy/tags.js` | Added canonical role/tag documentation and low-risk normalizers. |
| Stat naming | `src/data/taxonomy/statNaming.js` | Documented Cognitive/Mental stat naming policy and canonical stat id normalization. |
| Materials | `src/data/materialCatalogDraft.js` | Added an intentionally empty draft material catalog contract. |
| SQL/docs | `docs/DATA_NORMALIZATION_PHASE_2.md`, `docs/SQL_MIGRATION_MAP.md` | Added Phase 2.5 policy notes for SQL import planning. |

## Media Alias Mappings

| Entity type | Alias | Canonical entity id | Reason |
| --- | --- | --- | --- |
| Character | `daffodill` | `daffodil` | Filename spelling differs from canonical character id. |
| Character | `haniel` | `hanizel` | Filename/name differs from canonical character id. |
| Character | `zero` | `zero-female` | Filename needs gender-specific canonical target. |
| Character | `zero-2` | `zero-male` | Filename needs gender-specific canonical target. |
| Cartridge | `fireflies-and-the-forest-a` | `fireflies-and-the-forest` | One filename lacks a space before `(A)`. |
| Vehicle | `a1` | `rover-a1` | Vehicle file alias differs from canonical id. |
| Vehicle | `lavelox` | `la-velox` | Vehicle file alias differs from canonical id. |
| Vehicle | `rivok` | `future-surge` | Vehicle file alias differs from canonical id. |

SQL policy: import canonical media links using `resolvedEntityId`, while preserving the original filename-derived `entityId` as legacy/source metadata.

## Cartridge Verification Policy

Current cartridge compatible shape data may continue powering the frontend. It is not verified enough for a production SQL import.

SQL policy:

- Import cartridge compatibility rows with `source_status = "needs_verification"`.
- Preserve legacy `dataStatus: "missing-compatible-shapes"` during migration.
- Do not present the rows as official until the shape compatibility source is verified.

## Roles vs Tags Policy

Roles are gameplay functions used for filters and structured joins. Tags are descriptive/freeform labels used for display, search, and secondary classification.

Future SQL should separate:

- `roles`
- `tags`
- `character_roles`
- `character_tags`

Current character data still needs a later normalization pass to move mixed role/tag strings into those two buckets.

## Stat Naming Policy

SQL/API data should use stable stat registry ids. The current Cognitive/Mental naming issue should resolve to one canonical id per stat.

Current policy:

- Keep `cognitive_dmg_bonus` as the canonical data id.
- Preserve current UI labels, including `Mental DMG` where already used.
- Do not create separate duplicate `mental_*` and `cognitive_*` SQL stats for the same concept.

## Material Catalog Status

`src/data/materialCatalogDraft.js` is a draft placeholder only. Materials are still embedded in character and skill data.

Before real import:

- Extract embedded material names/usages.
- Create stable material ids.
- Verify rarity/category/source.
- Attach media assets only after the material catalog is real.

## Audit Result

Latest `npm.cmd run audit:data`:

- Warnings: 0
- Needs verification: 12 cartridge compatibility records
- Resolved media aliases: 8
- Blockers: 0

## Build Result

Run after implementation:

- `npm.cmd run build`: passed.
- Remaining warning: existing Vite chunk-size warning for the main JavaScript bundle over 500 kB.

## What Remains

- Verify all cartridge compatible shapes from a reliable source.
- Normalize current character role/tag strings into separate buckets.
- Build a real material catalog.
- Increase depth consistency across character records.
- Model Guides, Community, and Apartments as real seed entities.
- Decide how localStorage admin overrides will be exported or discarded during backend migration.

## Can Phase 3 SQL Schema Drafting Start?

Yes. SQL schema drafting can start because hard blockers are at zero and the remaining issues are now explicit source-quality or content-depth tasks.

Do not start a production SQL import yet. The import should wait for cartridge compatibility verification, material catalog extraction, and a character role/tag cleanup pass.
