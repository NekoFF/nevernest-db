# Phase 136-150 Reviewer Handoff

Date: 2026-05-18

## Copy For Reviewer

Phase 136-150 focused on seeded API detail parity and source confidence UI.
Seeded API routes loaded in DB mode on `http://localhost:4000`.
The observed weapon Attack/refinement issue was a mapper/display bug, not missing seed data.
Weapon API growth rows are now grouped by level for the detail table.
Weapon API refinement `effectText` now displays as rank effects.
SourceStatus badges expanded to weapon, character, vehicle, codes, and news surfaces.
No backend endpoints, DB schema, auth, admin writes, or Build Planner runtime changed.
All required default and DB-mode checks passed.
Production auth/admin/DB/deploy remain disabled.
Next phase should review data/import parity and source provenance workflow.

## Changed Files

- `src/repositories/api/mappers/mapApiWeaponToViewModel.js`
- `src/components/weapons/WeaponGrowthTable.jsx`
- `src/components/weapons/WeaponRefinementList.jsx`
- `src/pages/WeaponDetailPage.jsx`
- `src/components/CharacterHero.jsx`
- `src/components/vehicles/VehicleStatsPanel.jsx`
- `src/pages/CodesPage.jsx`
- `src/pages/NewsPage.jsx`
- `server/tests/frontend/apiWeaponMapper.test.ts`
- `docs/PHASE_136_150_WEAPON_DETAIL_PARITY_AUDIT.md`
- `docs/PHASE_136_150_SEEDED_API_VISUAL_QA.md`
- `docs/PHASE_136_150_SOURCESTATUS_ROLLOUT.md`
- `docs/PHASE_136_150_FIXES_APPLIED.md`
- `docs/PHASE_136_150_REVIEWER_HANDOFF.md`
- `docs/DATA_COMPLETION_STRATEGY.md`
- `docs/QA_MASTER_CHECKLIST.md`
- `docs/PROJECT_ROADMAP_NEXT_PHASES.md`
- Generated reports updated by scripts: `docs/IMPORT_DRY_RUN_REPORT.md`, `docs/SEED_PREVIEW_REPORT.md`, `docs/SEED_IMPORT_LOCAL_REPORT.md`

## Commands Run

| Command | Result |
| --- | --- |
| `docker compose up -d postgres` | Pass after escalation; local postgres running. |
| `npm.cmd run server:seed:import:local` with local DB confirmation | Pass; updated 1759 rows, skipped 42, failed 0. |
| `curl`/PowerShell API route checks for characters, weapons, cartridges, vehicles, codes, news | Pass; seeded API routes loaded. |
| `npm.cmd run server:check` | Pass. |
| `npm.cmd run server:build` | Pass. |
| `npm.cmd run server:test` | Pass; 113 passed, 5 skipped. |
| `npm.cmd run build` | Pass. Largest chunks remain `index` ~486 kB, `CharacterDetailPage` ~209 kB, `BuildPlannerPage` ~122 kB. |
| `npm.cmd run audit:data` | Pass; 0 blockers, 12 needs-verification cartridge compatible-shape warnings. |
| `npm.cmd run import:dry-run` | Pass; 0 blockers, 48 needs-verification findings. |
| `npm.cmd run server:seed:preview` | Pass; plannedRows 1801, futureLocalImportRows 1759, blockedRows 42. |
| `npm.cmd run smoke:static` | Pass. |
| `npm.cmd run check:api-client` with `VITE_API_BASE_URL=http://localhost:4000` | Pass in DB mode. |
| `npm.cmd run smoke:api-mode` with `VITE_API_BASE_URL=http://localhost:4000` | Pass in DB mode. |
| `npm.cmd run server:test:db:seeded` with local `DATABASE_URL` | Pass; 1 seeded DB integration test passed. |

## Commands Not Run

- `npm.cmd run smoke:admin-writes`: not run because local auth/admin write credentials and enabled admin-write server env were not available in this session. Admin writes remain scoped to local code/news QA only.

## Seeded API QA Summary

- `/characters`: 18 records loaded.
- `/characters/nanally`: detail loaded.
- `/weapons?limit=100`: 42 records loaded through API client check.
- Spot checked weapon details: `good-boys-grand-adventure`, `ready-ready`, `oraora`.
- `/cartridges`: 12 records loaded.
- `/cartridges/devils-blood-curse` and `/cartridges/lost-radiance`: details loaded.
- `/vehicles`: 16 records loaded.
- `/codes`: 13 records loaded.
- `/news`: 3 records loaded.

## Parity Results

- Weapon detail parity: fixed mapper/display bugs for growth rows, percent formatting, and refinement `effectText`.
- Character detail parity: no confirmed mapper bug found; source badge added to hero when status exists.
- Vehicle parity: no confirmed mapper bug found; source badge added to handling profile when status exists.
- Codes/news parity: no confirmed mapper bug found; source badges added where status exists.
- Static/API parity: static remains default; API mode works as opt-in with local DB backend.

## Risks And TODOs

- Source statuses remain mostly `unknown` or `needs_verification`; this is honest but needs provenance workflow.
- Seeded API module piece count is 24 while static audit has 36 module pieces; investigate import/data coverage later.
- Guides/community/apartments remain deferred empty DB payloads in API checks.
- Build Planner remains prototype/needs verification.
- Real browser screenshot QA in API mode remains recommended.

## Unchanged / Disabled

- Backend endpoints changed: No.
- DB schema changed: No.
- Auth/admin behavior changed: No.
- Public registration: disabled.
- Production auth: disabled.
- Production admin writes: disabled.
- Broad CRUD: disabled.
- Characters/weapons/modules/vehicles/tier-list writes: disabled.
- API mode default: disabled.
- Production DB/deployment: disabled.

## Recommended Next Phase

Phase 151-160: data/import parity and source provenance workflow. Focus on module piece count parity, sourceStatus provenance notes, code expiry/source review, and preparation for search/SEO performance work without adding write endpoints.
