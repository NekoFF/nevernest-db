# Phase 151-160 Data Import Parity Audit

Date: 2026-05-18

## Conclusion

The 36 vs 24 module piece gap is not an import blocker, sourceStatus filter, missing DB seed row, shape/rarity mismatch, duplicate static alias, or frontend mapper count bug.

Static data, `audit:data`, import dry-run, seed preview, and the local seed import report all show 36 module pieces. The observed 24 count comes from the API list endpoint default pagination limit: `/api/modules/pieces` defaults to `limit=24`. The full page used by the frontend and smoke check is `/api/modules/pieces?limit=100`, which is expected to return all 36 seeded module pieces from a seeded local DB.

## Exact Counts

### A. Static/source data

| Area | Count | Notes |
| --- | ---: | --- |
| Module shapes | 12 | `src/data/moduleCatalog.js` |
| Module pieces | 36 | 12 shapes x S/A/B rarities from `src/data/modulePieces.js` |
| Cartridge sets | 12 | `src/data/cartridges.js` |
| Cartridge compatible shape rows | 48 | 12 cartridge sets x 4 slots; still needs source verification |

### B. Audit script

`npm run audit:data` result:

| Area | Count |
| --- | ---: |
| Characters | 18 |
| Weapons | 42 |
| Cartridges | 12 |
| Module shapes | 12 |
| Module pieces | 36 |
| Vehicles | 16 |
| Codes | 13 |
| News | 3 |

Warnings: 0. Blockers: 0. Needs verification: 12 cartridge sets marked `missing-compatible-shapes`.

### C. Import dry-run

`npm run import:dry-run` regenerated `docs/IMPORT_DRY_RUN_REPORT.md`.

| Area | Count |
| --- | ---: |
| Module piece rows planned | 36 |
| Module piece blocked rows | 0 |
| Module piece skipped rows | 0 |
| Module piece sourceStatus | 36 unknown |
| Module shape rows planned | 12 |
| Cartridge compatible shape rows planned | 48 |
| Cartridge compatible shape sourceStatus | 48 needs_verification |

Dry-run severity summary: `{"OK":1,"INFO":2,"WARNING":3,"NEEDS_VERIFICATION":48,"BLOCKER":0}`.

Unresolved labels are material-only: `Beetle Coin`, `Dreamless Seed`, `Fons`. They do not affect module pieces.

### D. Seed preview

`npm run server:seed:preview` regenerated `docs/SEED_PREVIEW_REPORT.md`.

| Metric | Count |
| --- | ---: |
| Planned rows | 1801 |
| Preview rows | 1801 |
| Future local import rows | 1759 |
| Blocked rows | 42 |
| Module shape rows planned | 12 |
| Module piece rows planned | 36 |
| Cartridge compatible shape rows planned | 48 |

The 42 blocked rows are character material rows. Module pieces are allowed for preview and future local import.

### E. Local seeded DB/API

`docs/SEED_IMPORT_LOCAL_REPORT.md` records a committed local write import:

| Table | Planned | Inserted | Updated | Skipped | Failed |
| --- | ---: | ---: | ---: | ---: | ---: |
| moduleShapes | 12 | 0 | 12 | 0 | 0 |
| modulePieces | 36 | 0 | 36 | 0 | 0 |
| cartridgeSets | 12 | 0 | 12 | 0 | 0 |
| cartridgeCompatibleShapes | 48 | 0 | 48 | 0 | 0 |

Endpoint behavior:

| Endpoint | Expected seeded DB count |
| --- | ---: |
| `/api/modules/pieces` | 24 by default page limit |
| `/api/modules/pieces?limit=100` | 36 |
| `/api/modules/shapes` | 12 |
| `/api/cartridges` | 12 |

The current API metadata reports `count` and `total` as returned-row counts, not table totals. A paginated response with 24 rows can therefore look like a 24-row dataset unless the caller checks `limit`/`hasMore`.

### F. UI/API mode

`src/repositories/unified/modulesRepository.js` already requests:

- `/api/modules/shapes?limit=100`
- `/api/modules/pieces?limit=100`

`/modules` displays one module card per shape for the selected rarity, so the visible module-piece grid is 12 at a time by design. Rarity switching covers S/A/B variants.

`/modules/pieces/:shapeId/:rarity` currently uses static module helpers for detail rendering. Route coverage exists for all 12 shapes x 3 rarities. This phase did not move module detail to DB-backed detail reads.

## Gap Investigation

| Question | Answer |
| --- | --- |
| Is 36 vs 24 caused by import blocking? | No. Module pieces have 0 blocked/skipped rows. |
| Is it caused by sourceStatus filtering? | No. Module pieces are `unknown`, not filtered out. |
| Is it caused by API pagination/limit? | Yes. `/api/modules/pieces` defaults to `limit=24`. |
| Is it caused by API endpoint not returning all rarity variants? | No when `limit=100` is used. |
| Is it caused by shape/rarity key mismatch? | No. Static ids and seed external ids align. Mapper test added for shape/rarity preservation. |
| Is it caused by static duplicates or aliases? | No duplicate module piece ids were found. |
| Is it caused by DB seed/import missing rows? | No. Local import report records 36 module pieces updated. |
| Is it caused by frontend mapper or count logic? | No confirmed mapper/count bug. Smoke script used the default endpoint page and was updated to request `limit=100`. |

## Module Piece Comparison Table

| Static id | Shape | Rarity | Expected UI path | Static | Seed preview | DB/API full page | Reason/fix |
| --- | --- | --- | --- | --- | --- | --- | --- |
| module-s-type-ii-horizontal | type-ii-horizontal | S | `/modules/pieces/type-ii-horizontal/s` | yes | yes | yes | no fix needed |
| module-s-type-ii-vertical | type-ii-vertical | S | `/modules/pieces/type-ii-vertical/s` | yes | yes | yes | no fix needed |
| module-s-type-iii-horizontal | type-iii-horizontal | S | `/modules/pieces/type-iii-horizontal/s` | yes | yes | yes | no fix needed |
| module-s-type-iii-vertical | type-iii-vertical | S | `/modules/pieces/type-iii-vertical/s` | yes | yes | yes | no fix needed |
| module-s-type-iii-l-bottom-right | type-iii-l-bottom-right | S | `/modules/pieces/type-iii-l-bottom-right/s` | yes | yes | yes | no fix needed |
| module-s-type-iii-l-top-right | type-iii-l-top-right | S | `/modules/pieces/type-iii-l-top-right/s` | yes | yes | yes | no fix needed |
| module-s-type-iii-l-top-left | type-iii-l-top-left | S | `/modules/pieces/type-iii-l-top-left/s` | yes | yes | yes | no fix needed |
| module-s-type-iii-l-bottom-left | type-iii-l-bottom-left | S | `/modules/pieces/type-iii-l-bottom-left/s` | yes | yes | yes | no fix needed |
| module-s-type-iv-horizontal | type-iv-horizontal | S | `/modules/pieces/type-iv-horizontal/s` | yes | yes | yes | no fix needed |
| module-s-type-iv-vertical | type-iv-vertical | S | `/modules/pieces/type-iv-vertical/s` | yes | yes | yes | no fix needed |
| module-s-type-iv-z-left | type-iv-z-left | S | `/modules/pieces/type-iv-z-left/s` | yes | yes | yes | mapper test added |
| module-s-type-iv-z-right | type-iv-z-right | S | `/modules/pieces/type-iv-z-right/s` | yes | yes | yes | no fix needed |
| module-a-type-ii-horizontal | type-ii-horizontal | A | `/modules/pieces/type-ii-horizontal/a` | yes | yes | yes | no fix needed |
| module-a-type-ii-vertical | type-ii-vertical | A | `/modules/pieces/type-ii-vertical/a` | yes | yes | yes | no fix needed |
| module-a-type-iii-horizontal | type-iii-horizontal | A | `/modules/pieces/type-iii-horizontal/a` | yes | yes | yes | no fix needed |
| module-a-type-iii-vertical | type-iii-vertical | A | `/modules/pieces/type-iii-vertical/a` | yes | yes | yes | no fix needed |
| module-a-type-iii-l-bottom-right | type-iii-l-bottom-right | A | `/modules/pieces/type-iii-l-bottom-right/a` | yes | yes | yes | no fix needed |
| module-a-type-iii-l-top-right | type-iii-l-top-right | A | `/modules/pieces/type-iii-l-top-right/a` | yes | yes | yes | no fix needed |
| module-a-type-iii-l-top-left | type-iii-l-top-left | A | `/modules/pieces/type-iii-l-top-left/a` | yes | yes | yes | no fix needed |
| module-a-type-iii-l-bottom-left | type-iii-l-bottom-left | A | `/modules/pieces/type-iii-l-bottom-left/a` | yes | yes | yes | no fix needed |
| module-a-type-iv-horizontal | type-iv-horizontal | A | `/modules/pieces/type-iv-horizontal/a` | yes | yes | yes | no fix needed |
| module-a-type-iv-vertical | type-iv-vertical | A | `/modules/pieces/type-iv-vertical/a` | yes | yes | yes | no fix needed |
| module-a-type-iv-z-left | type-iv-z-left | A | `/modules/pieces/type-iv-z-left/a` | yes | yes | yes | no fix needed |
| module-a-type-iv-z-right | type-iv-z-right | A | `/modules/pieces/type-iv-z-right/a` | yes | yes | yes | no fix needed |
| module-b-type-ii-horizontal | type-ii-horizontal | B | `/modules/pieces/type-ii-horizontal/b` | yes | yes | yes | no fix needed |
| module-b-type-ii-vertical | type-ii-vertical | B | `/modules/pieces/type-ii-vertical/b` | yes | yes | yes | no fix needed |
| module-b-type-iii-horizontal | type-iii-horizontal | B | `/modules/pieces/type-iii-horizontal/b` | yes | yes | yes | no fix needed |
| module-b-type-iii-vertical | type-iii-vertical | B | `/modules/pieces/type-iii-vertical/b` | yes | yes | yes | no fix needed |
| module-b-type-iii-l-bottom-right | type-iii-l-bottom-right | B | `/modules/pieces/type-iii-l-bottom-right/b` | yes | yes | yes | no fix needed |
| module-b-type-iii-l-top-right | type-iii-l-top-right | B | `/modules/pieces/type-iii-l-top-right/b` | yes | yes | yes | no fix needed |
| module-b-type-iii-l-top-left | type-iii-l-top-left | B | `/modules/pieces/type-iii-l-top-left/b` | yes | yes | yes | no fix needed |
| module-b-type-iii-l-bottom-left | type-iii-l-bottom-left | B | `/modules/pieces/type-iii-l-bottom-left/b` | yes | yes | yes | no fix needed |
| module-b-type-iv-horizontal | type-iv-horizontal | B | `/modules/pieces/type-iv-horizontal/b` | yes | yes | yes | no fix needed |
| module-b-type-iv-vertical | type-iv-vertical | B | `/modules/pieces/type-iv-vertical/b` | yes | yes | yes | no fix needed |
| module-b-type-iv-z-left | type-iv-z-left | B | `/modules/pieces/type-iv-z-left/b` | yes | yes | yes | no fix needed |
| module-b-type-iv-z-right | type-iv-z-right | B | `/modules/pieces/type-iv-z-right/b` | yes | yes | yes | no fix needed |
