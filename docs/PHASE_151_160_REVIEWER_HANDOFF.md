# Phase 151-160 Reviewer Handoff

## Copy For Reviewer

Phase 151-160 found the module piece gap was pagination, not missing data. Static, audit, dry-run, seed preview, and local seed import all show 36 module pieces. The unqualified API endpoint returns 24 because default `limit=24`; full parity uses `/api/modules/pieces?limit=100`. I updated the API client smoke endpoint and added a module mapper regression test. Source provenance and code expiry reviews were documented. No schema, backend endpoint, auth, admin write, or production behavior changed.

## Changed Files

- `scripts/check-api-client.mjs`
- `server/tests/frontend/apiModuleMapper.test.ts`
- `docs/PHASE_151_160_DATA_IMPORT_PARITY_AUDIT.md`
- `docs/PHASE_151_160_STATIC_API_PARITY_MATRIX.md`
- `docs/PHASE_151_160_SOURCESTATUS_UI_REVIEW.md`
- `docs/SOURCE_PROVENANCE_WORKFLOW.md`
- `docs/CODES_SOURCE_EXPIRY_REVIEW.md`
- `docs/PHASE_151_160_FIXES_APPLIED.md`
- `docs/PHASE_151_160_REVIEWER_HANDOFF.md`
- `docs/DATA_COMPLETION_STRATEGY.md`
- `docs/QA_MASTER_CHECKLIST.md`
- `docs/PROJECT_ROADMAP_NEXT_PHASES.md`
- `docs/RUNTIME_READINESS.md`
- `docs/IMPORT_DRY_RUN_REPORT.md`
- `docs/SEED_PREVIEW_REPORT.md`

## Commands Run

| Command | Result |
| --- | --- |
| `npm run server:check` | Pass |
| `npm run server:build` | Pass |
| `npm run server:test` | Pass: 114 passed, 5 skipped DB-gated |
| `npm run build` | Pass |
| `npm run audit:data` | Pass |
| `npm run import:dry-run` | Pass; report regenerated |
| `npm run server:seed:preview` | Pass; report regenerated |
| `npm run smoke:static` | Pass |
| `npx tsx --test server/tests/frontend/apiModuleMapper.test.ts` | Pass |

## Commands Not Run Yet

DB/API runtime checks need a live local seeded DB and backend. This environment has no `DATABASE_URL` and no Docker command available, so these were not run here:

- `npm run check:api-client`
- `npm run smoke:api-mode`
- `npm run server:test:db:seeded`
- `npm run smoke:admin-writes`

## Module Piece Count Gap Conclusion

36 vs 24 was endpoint pagination/default-limit behavior. It was not import blocking, sourceStatus filtering, seed loss, shape/rarity mismatch, static duplication, or frontend mapper loss.

## Fixes Applied

- API smoke now asks for the full module piece page with `?limit=100`.
- Module API mapper test verifies DB shape external id and rarity label survive mapping.

## Source Provenance Workflow Summary

Created a provenance plan covering `sourceStatus`, source URL/label/notes, verification notes, patch/version metadata, future reviewer fields, evidence policy, UI display policy, import/export preservation, and draft/publish gates.

## Code Expiry/Source Review Summary

Codes have 7 active and 6 expired entries. No static code has expiry date, source URL, or source label data. Statuses were not changed because no official expiry evidence was added.

## Static/API Parity Result

All core counts align across static, audit, dry-run, seed preview, and local seed import. Module pieces align at 36 when the API is queried with `limit=100`.

## Backend/Schema/Auth/Admin

- Backend endpoints changed: no.
- DB schema changed: no.
- Auth behavior changed: no.
- Admin behavior changed: no.

## Still Disabled

API mode remains opt-in. Production auth, public registration, production admin writes, production DB, deployment, broad CRUD, character/weapon/module/vehicle/tier-list writes, and silent localStorage import remain disabled.

## Risks/TODOs

- API pagination metadata still reports returned-row `total`, not table total.
- Static code source/expiry provenance remains incomplete.
- Cartridge compatible shapes still need trusted source verification.
- DB/API runtime checks should be rerun on a machine with local seeded PostgreSQL.

## Recommended Next Phase

Phase 161-170 should stay read-only/public-beta focused: route sweep, source copy review, code verification, API pagination metadata improvement if needed, and deployment readiness without enabling production writes.
