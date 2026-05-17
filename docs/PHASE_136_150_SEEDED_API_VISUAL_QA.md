# Phase 136-150 Seeded API Visual QA

Date: 2026-05-18

Scope: seeded local DB-backed API mode checks for public read pages. This was API/DTO/view-model QA plus build/smoke verification; no production DB or deployment was used.

## Environment

- PostgreSQL: local Docker postgres.
- Backend: `SERVER_DATA_MODE=db`.
- API base: `http://localhost:4000`.
- Host rule: kept API checks on `localhost` to avoid localhost/127.0.0.1 cookie/CORS confusion.
- Seed import: local-safe seed import was run with confirmation; report updated in `docs/SEED_IMPORT_LOCAL_REPORT.md`.

## Route Results

| Route | Loaded | API error | Suspicious missing data | Field mismatch | SourceStatus visible | Fixed now | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `/characters` | Yes | No | No | No | List-level status is not prominent | No | API returned 18 characters. |
| `/characters/nanally` | Yes | No | Some sections remain sparse by data policy | No clear mapper bug found | Character hero badge added when status exists | Yes | No mass-fill performed. |
| `/weapons` | Yes | No | No | No | Detail sections now show badges | Yes | API client check reported weapon display fields OK. |
| `/weapons/good-boys-grand-adventure` | Yes | No | Growth/refinement looked missing before mapper fix | Yes | Growth/refinement badges added | Yes | Main bug case. |
| `/weapons/ready-ready` | Yes | No | SourceStatus mostly unknown | No confirmed mapper bug | Growth/refinement badges added | Yes | Spot checked endpoint. |
| `/weapons/oraora` | Yes | No | SourceStatus mostly unknown | No confirmed mapper bug | Growth/refinement badges added | Yes | Spot checked endpoint. |
| `/modules` | Yes | No | Module piece count from seeded API is 24 while static audit has 36 | No page crash observed | Cartridge detail already has badges | Deferred | Count difference is data/import coverage, not this phase's mapper fix. |
| `/modules/devils-blood-curse` | Yes | No | No for Set Data bonus text | Previously fixed in Phase 121-135 | Set Data badges visible | No | Confirmed endpoint loaded. |
| `/modules/lost-radiance` | Yes | No | Compatible-shape verification remains pending | No new bug | Set Data badges visible | No | Keep needs-verification honest. |
| `/vehicles` | Yes | No | Some stats remain sparse/source unknown | No clear mapper bug found | Handling panel badge added when status exists | Yes | API returned 16 vehicles. |
| `/codes` | Yes | No | Expiry/source detail still needs editorial review | No clear mapper bug found | Code card badge added when status exists | Yes | API returned 13 codes. |
| `/news` | Yes | No | Source labels/images depend on imported raw data | No clear mapper bug found | News card/detail badge added when status exists | Yes | API returned 3 news items. |

## API Failure State Review

Phase 121-135 behavior remains appropriate: API failures should show controlled error states and `API error` counters rather than misleading zero inventory. This phase did not hide API failures with silent static fallback.

## Deferred

- Real browser screenshot pass in API mode remains useful.
- SourceStatus provenance needs data workflow, not visual-only patches.
- Module piece count parity should be reviewed in data/import phases.
