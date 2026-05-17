# Phase 5 Canonical Export Validation

Date: 2026-05-16

Phase 5 made the seed import dry run cleaner and closer to future SQL import. It did not connect a database, create a backend server, write PostgreSQL, change frontend pages, alter Build Planner runtime, remove localStorage, or remove Admin Mode.

## What Changed

- Added schema-group validator modules under `scripts/import-dry-run/validators/`.
- Updated role/tag taxonomy to resolve current seed labels.
- Updated character import mapping to use `normalizeRoleId` and `normalizeTagId`.
- Updated weapon import mapping to use canonical stat id normalization.
- Added draft material extraction via `mapMaterialsDraft.mjs`.
- Added generated dry-run artifacts under `.generated/import-dry-run/`.
- Ignored `.generated/` in `.gitignore`.
- Updated import dry-run report output.

## Validation Layer Overview

Validators now check:

- required fields
- duplicate `external_id`
- duplicate `slug`
- invalid `source_status`
- character/taxonomy/media/reference integrity
- invalid stat ids
- invalid role/tag ids
- empty expected-future tables
- placeholder content areas

Known placeholder areas are warnings or info, not blockers.

## Taxonomy Cleanup Result

Before Phase 5 dry run:

- OK: 1
- WARNING: 27
- NEEDS_VERIFICATION: 48
- BLOCKER: 0

After Phase 5 dry run:

- OK: 1
- INFO: 4
- WARNING: 4
- NEEDS_VERIFICATION: 48
- BLOCKER: 0

Role/tag missing reference warnings are resolved. Remaining warnings are expected content/data-depth gaps.

## Stat Alias Result

Weapon main/sub stats and weapon growth stats now use canonical stat ids through `normalizeCanonicalStatId`.

Important policy preserved:

- UI labels are unchanged.
- Build Planner calculations are untouched.
- Cognitive/Mental naming still maps to one canonical stat id.

## Material Extraction Result

Draft material candidates found: 7.

They come from `src/data/characters/nanally.js` and are marked `needs_verification`.

The generated candidate list is useful for future catalog work, but not production import-ready.

## Generated Artifacts

Generated and ignored:

- `.generated/import-dry-run/payload-summary.json`
- `.generated/import-dry-run/payloads.json`
- `.generated/import-dry-run/issues.json`
- `.generated/import-dry-run/material-candidates.json`

These files are not imported by the frontend runtime.

## Final Check Results

- `npm.cmd run audit:data`: passed with 0 warnings, 0 blockers, 12 cartridge verification items, and 9 resolved media aliases.
- `npm.cmd run import:dry-run`: passed with 0 blockers, 4 warnings, 4 info items, 48 verification items, and 7 material candidates.
- `npm.cmd run build`: passed with the existing Vite chunk-size warning.

## Is SQL Import Cleaner Now?

Yes. The dry-run payloads are cleaner:

- no blockers
- role/tag references resolve
- weapon stats normalize to canonical stat ids
- media aliases resolve
- material candidates are surfaced separately

Real SQL import is still not allowed yet because cartridge compatibility, material catalog verification, and deeper character extraction remain unfinished.

## Can Backend Scaffold Start?

Yes, a backend scaffold can start next as long as it stays disconnected from production data and does not replace the frontend runtime yet.

Recommended guardrails:

- no production database writes
- no auth launch
- no admin UI migration
- use schema/dry-run artifacts for planning only

## Recommended Phase 6

Backend scaffold planning/prototype:

- create a backend workspace folder
- choose Fastify + Drizzle or another documented stack
- add environment config examples
- add read-only route skeletons using mock/generated payloads
- add no real DB connection by default
- keep frontend unchanged
