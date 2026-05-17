# Phase 121-135 Data Display Consistency Audit

Date: 2026-05-18

Scope: static/API display consistency for public read surfaces, with special focus on cartridge detail bonus text, sourceStatus honesty, mapper safety, and API-mode failure behavior.

## Findings

| Route | Mode | Entity example | Field missing or inconsistent | Expected display | Actual display | Severity | Fix applied or deferred | Reason if deferred |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/modules` to `/modules/:slug` | API | `devils-blood-curse`, `lost-radiance` | Cartridge bonus rows from API detail used `effectText`; detail UI expected `text`. | 2pc/4pc text appears on list and detail when source data exists. | Detail Set Data could render blank/Data coming soon despite list/static data having text. | High | Fixed mapper to normalize `effectText` into `text`; added mapper tests. |  |
| `/modules` to `/modules/:slug` | API | Cartridges with compatible shapes | API `compatibleShapes` were converted to labels, but cards/details expect objects with `moduleShapeId`. | Shape badges remain usable in list/detail. | Shape badges could degrade to pending even when shape IDs existed. | Medium | Fixed mapper to preserve compatible module objects and shape IDs. |  |
| `/modules/:slug` | Static/API | Cartridge Set Data | Bonus source confidence was not visible near high-risk data. | Values that are needs-verification/unknown should be labeled honestly. | Bonus text could appear without confidence context. | Medium | Added `SourceStatusBadge` to Set Data bonus cards. | Broader badge rollout deferred. |
| `/characters` | API | Public list | If API fetch failed, counters could show `0` because initial data is `[]`. | Failed fetch should show controlled API error state, not misleading zero inventory. | Manual observation saw loading then failure; counters could imply empty data. | High | Counters now show `API error`; error copy explains backend/base URL/host checks. |  |
| `/modules` | API | Public list | If API fetch failed, header/counters could show `0 cartridge sets + 0 module shapes`. | Failed fetch should not be confused with missing data. | Manual observation showed failed fetch and zero counters. | High | Header/counters now show API unavailable/error state. |  |
| `/weapons` | API | Public list | Same failed-fetch counter risk. | Controlled API error state. | Potential misleading zero counters. | Medium | Applied shared API count/error display helper. |  |
| `/vehicles` | API | Public showcase | Same failed-fetch counter risk. | Controlled API error state. | Potential misleading zero counters/0 km/h. | Medium | Applied shared API count/error display helper. |  |
| `/codes` | API | Public list | Same failed-fetch counter risk. | Controlled API error state. | Potential misleading zero counters. | Medium | Applied shared API count/error display helper. |  |
| `/news` | API | Public list | Same failed-fetch counter risk. | Controlled API error state. | Potential misleading zero counters. | Medium | Applied shared API count/error display helper. |  |
| `/modules/pieces/:shapeId/:rarity` | Static/API | Type II/III pieces | Module piece detail uses static piece formulas/fallback for display. | If data exists, show main/sub stats; if absent, not found/coming soon. | No concrete mismatch found in this pass. | Low | Deferred. | Needs visual/API seeded DB verification. |
| `/weapons/:slug` | Static/API | `good-boys-grand-adventure` | Weapon detail relies on mapper/static fallback for refinement and growth rows. | List/detail should show rarity/type/stats/refinements consistently. | No concrete mapper drop found in this pass. | Medium | Deferred. | Needs seeded API screenshot/manual verification. |
| `/characters/:slug` | Static/API | `nanally` | Character detail remains dense; mapper has static fallback. | Rarity, element, arcType, roles, media, skills, stats should remain present. | No concrete drop fixed in this phase. | Medium | Deferred. | Needs focused character mapper/detail audit after modules. |
| `/vehicles` | Static/API | Vehicle showcase | Vehicle cards/showcase use mapper fallback for type/stats/media. | No raw IDs or empty state on valid data. | No concrete drop found. | Low | Deferred. | Needs seeded API visual verification. |
| `/codes`, `/news` | Static/API | Content lists/details | Status/source/date display should remain clear. | Failed API != empty content; missing source != verified. | Error copy was generic. | Medium | Improved API failure copy for list pages. | More source badges for content deferred. |

## API Failure Investigation

Observed in this shell: no backend was listening on `http://127.0.0.1:4000/api/status`, so API mode would produce a network failure. That is distinct from a valid empty API response. The frontend now keeps explicit error states and avoids displaying zero inventory counters when the API request failed.

Likely root causes to check when reproducing manually:

- Backend not running.
- `VITE_API_BASE_URL` points at the wrong host or port.
- `localhost`/`127.0.0.1` mixed between frontend and backend during cookie/CORS QA.
- Backend running in default/not-implemented mode rather than DB mode.
- Sparse DB DTOs that require mapper fallback/normalization.

## Manual Verification

Static mode:

- Open `/modules`; confirm cartridge cards show 2pc/4pc text.
- Open `/modules/devils-blood-curse` and `/modules/lost-radiance`; confirm Set Data shows the same bonus text when present.
- Open `/modules/pieces/type-ii-horizontal/S`; confirm module piece detail renders or shows a controlled not-found state.
- Open `/weapons` and `/weapons/good-boys-grand-adventure`.
- Open `/characters` and `/characters/nanally`.
- Open `/vehicles`, `/codes`, and `/news`.

API mode with backend running:

- Start backend DB mode with safe local DB and set `VITE_DATA_SOURCE=api`.
- Confirm `/characters`, `/modules`, `/modules/:slug`, `/weapons`, `/vehicles`, `/codes`, and `/news` load or show controlled API-specific errors.
- Confirm failed fetches show `API error` counters, not `0 indexed`.
- Confirm cartridge detail bonuses display when the API detail returns `effectText`.
