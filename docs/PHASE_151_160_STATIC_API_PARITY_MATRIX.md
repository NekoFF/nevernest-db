# Phase 151-160 Static/API Parity Matrix

Date: 2026-05-18

## Matrix

| Entity | Static count | Audit count | Import dry-run | Seed preview | Seeded API/local import | UI count behavior | Parity status | Gap reason | Fix/defer |
| --- | ---: | ---: | ---: | ---: | ---: | --- | --- | --- | --- |
| Characters | 18 | 18 | 18 | 18 | 18 | `/characters` API QA reported 18 | Pass | none | none |
| Weapons | 42 | 42 | 42 | 42 | 42 | Frontend requests API list with `limit=100` | Pass | none | none |
| Cartridge sets | 12 | 12 | 12 | 12 | 12 | `/modules` shows 12 cartridge sets | Pass | none | none |
| Module shapes | 12 | 12 | 12 | 12 | 12 | `/modules` shows 12 shape cards per selected rarity | Pass | none | none |
| Module pieces | 36 | 36 | 36 | 36 | 36 with `limit=100`; 24 with default limit | `/modules` displays 12 per selected rarity; S/A/B cover 36 | Pass with explicit full page | default endpoint page size is 24 | `check:api-client` now requests `?limit=100` |
| Vehicles | 16 | 16 | 16 | 16 | 16 | `/vehicles` API QA reported 16 | Pass | none | none |
| Codes | 13 | 13 | 13 | 13 | 13 | `/codes` API QA reported 13 | Pass with source caveat | expiry/source fields are sparse | document source/expiry review |
| News | 3 | 3 | 3 | 3 | 3 | `/news` API QA reported 3 | Pass with source caveat | source labels/images remain sparse | document provenance workflow |

## Notes

- Seeded API/local import counts come from `docs/SEED_IMPORT_LOCAL_REPORT.md` and prior seeded API QA where the DB backend was available.
- This environment does not have Docker or a configured `DATABASE_URL`, so DB/API runtime checks that require a live seeded DB were not rerun here.
- API list metadata currently reports returned rows as `count`/`total`. It does not yet expose a table-wide total for paginated DB reads.
- No backend endpoints, DB schema, auth behavior, or admin write behavior changed in this phase.
