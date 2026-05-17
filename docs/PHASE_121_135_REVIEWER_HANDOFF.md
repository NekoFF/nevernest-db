# Phase 121-135 Reviewer Handoff

Date: 2026-05-18

## Copy For Reviewer

Phase 121-135 fixed cartridge detail display parity.
API detail bonuses now normalize `effectText` to UI `text`.
Compatible shape objects are preserved for cards/details.
Set Data now shows sourceStatus badges.
API fetch failures no longer present misleading zero counters.
Static mode remains default.
API mode remains opt-in.
No backend endpoints, schema, auth, or admin behavior changed.
No data was mass-filled or marked verified.
Recommended next phase: seeded API visual QA and broader sourceStatus rollout.

## Changed Files

- `src/repositories/api/mappers/mapApiCartridgeToViewModel.js`
- `src/components/ui/SourceStatusBadge.jsx`
- `src/utils/apiDisplay.js`
- `src/pages/CartridgeDetailPage.jsx`
- `src/pages/ModulesPage.jsx`
- `src/pages/CharactersPage.jsx`
- `src/pages/WeaponsPage.jsx`
- `src/pages/VehiclesPage.jsx`
- `src/pages/CodesPage.jsx`
- `src/pages/NewsPage.jsx`
- `server/tests/frontend/apiCartridgeMapper.test.ts`
- `docs/PHASE_121_135_DATA_DISPLAY_CONSISTENCY_AUDIT.md`
- `docs/PHASE_121_135_DATA_DISPLAY_FIXES_APPLIED.md`
- `docs/PHASE_121_135_REVIEWER_HANDOFF.md`
- `docs/DATA_COMPLETION_STRATEGY.md`
- `docs/QA_MASTER_CHECKLIST.md`
- `docs/PROJECT_ROADMAP_NEXT_PHASES.md`
- `docs/RUNTIME_READINESS.md`
- `docs/IMPORT_DRY_RUN_REPORT.md`
- `docs/SEED_PREVIEW_REPORT.md`

## Commands Run

| Command | Result |
| --- | --- |
| `npm.cmd run server:check` | PASS |
| `npm.cmd run server:build` | PASS |
| `npm.cmd run server:test` | PASS, 111 passed, 5 expected DB-mode skips; includes new mapper tests |
| `npm.cmd run build` | PASS |
| `npm.cmd run audit:data` | PASS, 0 blockers, 12 needs-verification cartridge shape warnings |
| `npm.cmd run import:dry-run` | PASS, 0 blockers; report regenerated |
| `npm.cmd run server:seed:preview` | PASS, 1801 planned rows, 42 blocked rows, 0 blockers; report regenerated |
| `npm.cmd run smoke:static` | PASS |
| Backend running probe: `http://127.0.0.1:4000/api/status` | Not running in this shell: unable to connect |

## Commands Not Run Yet

- Optional DB-mode checks were not run because no backend was already listening on `127.0.0.1:4000`: `check:api-client`, `smoke:api-mode`, `smoke:admin-writes`, `server:test:db:seeded`.

## Main Consistency Issues Found

- API cartridge detail DTOs used `effectText`; UI detail cards expected `text`.
- API compatible shape DTOs were converted to strings, losing `moduleShapeId` for existing card/detail UI.
- API-mode network failures could show zero counters, making fetch failure look like empty data.

## Fixes Applied

- Normalized cartridge bonus display fields in the API mapper.
- Preserved compatible shape view-model objects.
- Added Set Data sourceStatus badges.
- Added shared API display helpers for failed/loading counts and actionable network error copy.
- Added mapper tests.

## SourceStatus Behavior

- `verified`, `needs_verification`, `estimated`, `placeholder`, `mock`, and `unknown` now have a small reusable badge.
- Cartridge Set Data uses badge labels for bonus rows.
- Values are not promoted to verified; fallback/static/API data keeps its existing status.

## Static/API Parity Result

- Static mode keeps existing cartridge bonus display.
- API mode now maps detail bonus `effectText` into the same display field used by static UI.
- API errors remain visible and are not hidden by silent static fallback.

## Behavior Change Confirmation

- Backend endpoints changed: No.
- DB schema changed: No.
- Auth/admin behavior changed: No.
- Build Planner runtime changed: No.

## What Remains Disabled

- Public registration.
- Production authentication.
- Production admin writes.
- Broad CRUD and character/weapon/module/vehicle/tier-list write endpoints.
- Production database connection.
- Deployment.
- User accounts, comments, public contributions, favorites/bookmarks.

## Risks/TODOs

- Seeded API visual QA still needed.
- SourceStatus badges should later expand to weapons, characters, modules, vehicles, codes, and news.
- Character and weapon detail mappers need a deeper parity pass.
- API mode still requires the backend to be running at the configured base URL.

## Recommended Next Phase

Run a seeded API visual QA pass and expand sourceStatus/data confidence treatment across character, weapon, module-piece, vehicle, code, and news detail surfaces.
