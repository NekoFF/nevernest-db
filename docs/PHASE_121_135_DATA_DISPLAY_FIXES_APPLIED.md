# Phase 121-135 Data Display Fixes Applied

Date: 2026-05-18

| File | Issue fixed | Before | After | Why low-risk | Manual verification |
| --- | --- | --- | --- | --- | --- |
| `src/repositories/api/mappers/mapApiCartridgeToViewModel.js` | API cartridge detail bonus rows used `effectText` while UI expected `text`. | Detail Set Data could miss 2pc/4pc bonus text even when API/static source had it. | Mapper normalizes `effectText`/`effect` into `text` and keeps `effectText`. | Mapper-only DTO normalization; no backend contract or schema change. | API mode: open `/modules/devils-blood-curse` or `/modules/lost-radiance`; Set Data should show bonus text. |
| `src/repositories/api/mappers/mapApiCartridgeToViewModel.js` | API compatible shape rows were mapped to label strings instead of card/detail-compatible objects. | Shape badges could appear pending despite available shape IDs. | Mapper preserves `{ slot, moduleShapeId, shapeSignature, sourceStatus }` objects and `compatibleModuleShapeIds`. | Frontend view model normalization only. | API mode: cartridge cards/details should show compatible shape badges when API DTO has shapes. |
| `src/components/ui/SourceStatusBadge.jsx` | No small reusable display for source/data confidence. | High-risk bonus values had no nearby confidence label. | Added small sourceStatus badge helper with verified/needs-verification/estimated/placeholder/mock/unknown labels. | New presentational component; no data mutation. | Cartridge detail Set Data should show status badges beside bonus labels. |
| `src/pages/CartridgeDetailPage.jsx` | Bonus detail cards did not show sourceStatus and only read `bonus.text`. | Values could be blank if API used `effectText`; confidence invisible. | Cards read `text || effectText` and show `SourceStatusBadge`. | Display-only change. | Open cartridge detail in static and API mode. |
| `src/utils/apiDisplay.js` | API fetch failures produced generic messages and zero counters on list pages. | Users could see "Failed to fetch" plus misleading `0` counts. | Shared helper shows `API error`/`...` count values and a local API/backend/host checklist message. | Display-only error-state helper. | Stop backend, run frontend API mode, open list pages; counters should not imply empty data. |
| `src/pages/ModulesPage.jsx` | API error state could show `0 cartridge sets + 0 module shapes indexed`. | Failed fetch looked like empty dataset. | Header/counters show API unavailable/error state and useful error copy. | No repository fallback or hidden static fallback. | API mode with backend stopped: `/modules` shows controlled error and no misleading zero indexed header. |
| `src/pages/CharactersPage.jsx` | API error state could show zero counters. | Failed fetch looked like empty character inventory. | Counters show `API error`; error copy explains backend/base URL/host checks. | Display-only. | API mode with backend stopped: `/characters` shows controlled error. |
| `src/pages/WeaponsPage.jsx` | Same failed-fetch counter risk. | Failed fetch could imply zero arcs. | Counts/header show API unavailable/error. | Display-only. | API mode with backend stopped: `/weapons` shows controlled error. |
| `src/pages/VehiclesPage.jsx` | Same failed-fetch counter risk. | Failed fetch could imply zero vehicles/0 km/h. | Summary pills show API error while retaining retry error state. | Display-only. | API mode with backend stopped: `/vehicles` shows controlled error. |
| `src/pages/CodesPage.jsx` | Same failed-fetch counter risk. | Failed fetch could imply zero codes. | Counters show API error. | Display-only. | API mode with backend stopped: `/codes` shows controlled error. |
| `src/pages/NewsPage.jsx` | Same failed-fetch counter risk. | Failed fetch could imply zero news rows. | Stats show API error. | Display-only. | API mode with backend stopped: `/news` shows controlled error. |
| `server/tests/frontend/apiCartridgeMapper.test.ts` | No lightweight coverage for cartridge mapper normalization. | Regression could re-drop 2pc/4pc text. | Added mapper tests for `effectText` and compatible shape objects. | Existing Node test runner; no new framework. | `npm.cmd run server:test`. |

## Not Changed

- No backend endpoints changed.
- No DB schema changed.
- No auth/admin/session behavior changed.
- No new write endpoints added.
- No mass data filling or sourceStatus promotion.
- No Build Planner runtime/formula logic changed.
