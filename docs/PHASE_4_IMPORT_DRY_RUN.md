# Phase 4 Import Dry Run

Date: 2026-05-16

Phase 4 added a non-runtime seed import dry-run pipeline. It does not connect to PostgreSQL, write SQL, add a backend server, change frontend pages, alter Build Planner runtime, remove localStorage, or touch Admin Mode.

## Created

- `scripts/import-dry-run.mjs`
- `scripts/import-dry-run/loadSnapshot.mjs`
- `scripts/import-dry-run/mapTaxonomy.mjs`
- `scripts/import-dry-run/mapMedia.mjs`
- `scripts/import-dry-run/mapCharacters.mjs`
- `scripts/import-dry-run/mapWeapons.mjs`
- `scripts/import-dry-run/mapCartridgesModules.mjs`
- `scripts/import-dry-run/mapVehicles.mjs`
- `scripts/import-dry-run/mapTierLists.mjs`
- `scripts/import-dry-run/mapContent.mjs`
- `scripts/import-dry-run/validateImportPayloads.mjs`
- `scripts/import-dry-run/writeDryRunReport.mjs`
- `scripts/import-dry-run/index.mjs`
- `docs/IMPORT_DRY_RUN_REPORT.md`
- `docs/IMPORT_MAPPING_DETAILS.md`

Updated:

- `package.json` with `import:dry-run`
- `src/data/mediaAliases.js` with a dry-run-discovered vehicle alias for `novis-st-x-950`

## What The Dry Run Validates

- Missing required external ids, slugs, names, and key fields.
- Duplicate `external_id` and `slug` values per payload table.
- Invalid `source_status` values.
- Character, weapon, cartridge, module, media, and tier-list references.
- Resolved vs unresolved media aliases.
- Cartridge compatible shapes marked as `needs_verification`.
- Placeholder/sparse data areas that should not be production-imported yet.

## Counts Summary

| Group | Rows |
| --- | --- |
| taxonomy | 60 |
| media | 126 |
| characters | 85 |
| weapons | 1008 |
| cartridgesModules | 132 |
| vehicles | 48 |
| tierLists | 25 |
| content | 16 |

## Validation Summary

Latest `npm.cmd run import:dry-run`:

- OK: 1
- INFO: 0
- WARNING: 27
- NEEDS_VERIFICATION: 48
- BLOCKER: 0
- resolved media aliases: 9

The 48 `NEEDS_VERIFICATION` items are cartridge compatible shape rows: 12 cartridge sets times 4 slots.

Warnings are expected at this phase and mostly cover:

- role/tag labels that still need cleanup
- missing material catalog mapping
- placeholder Guides, Community, and Apartments

## Check Results

- `npm.cmd run audit:data`: passed with 0 warnings, 0 blockers, 12 cartridge verification items, and 8 audit-level resolved media aliases.
- `npm.cmd run import:dry-run`: passed with 0 blockers and wrote `docs/IMPORT_DRY_RUN_REPORT.md`.
- `npm.cmd run build`: passed with the existing Vite chunk-size warning.

## Is Real SQL Import Allowed Yet?

No. The project is ready for importer design, not production import.

Real SQL import should wait for:

- cartridge shape verification
- role/tag normalization
- material catalog extraction
- stat alias normalization in import payloads
- admin override review/export policy
- backend/ORM choice and migration runner

## Recommended Phase 5

Create a canonical export validation layer:

- add schema-level validators for each payload table
- add stat alias normalization to mapper outputs
- add a material extraction draft
- add role/tag cleanup suggestions report
- optionally emit JSON dry-run artifacts under a generated ignored folder

Still do not connect to a real database until the importer can produce a clean dry-run with reviewed source statuses.
