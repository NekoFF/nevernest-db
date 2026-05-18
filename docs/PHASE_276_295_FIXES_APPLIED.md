# Phase 276-295 Fixes Applied

| File | Issue Fixed | Before | After | Why Low-Risk | Verification |
| --- | --- | --- | --- | --- | --- |
| `src/data/characterIntelNotes.js` | No safe place for reviewed corpus notes. | Applying notes required touching canonical character objects. | Added separate source-pending intel module with Lacrimosa pilot notes. | Does not alter canonical character data or formulas. | `npm run test:character-intel` |
| `src/pages/CharacterDetailPage.jsx` | Detail pages could not display optional source-pending notes. | Sparse pages stayed empty or required canonical data edits. | Overview tab renders optional source-pending intel sections only when present. | Conditional UI; no data mutation. | `npm run build`, `npm run smoke:static` |
| `src/utils/searchIndex.js` | Source-pending notes were undiscoverable. | Search only used canonical character fields. | Character search text includes low-priority intel note text while routing to canonical character pages. | No new routes; canonical matches still dominate. | `npm run test:search` |
| `src/data/characterIntelNotes.test.js` | No tests guarding intel-note safety. | Future notes could accidentally use verified status or protected fields. | Added tests for canonical slugs, source status, protected fields, optional lookup, and source path privacy. | Node test only; no DB/corpus required. | `npm run test:character-intel` |
| `src/utils/searchIndex.test.js` | Search integration for intel notes was untested. | Regressions could hide pilot notes or create wrong routes. | Added test for `nightmare` finding Lacrimosa through `/characters/lacrimosa`. | Uses existing search test harness. | `npm run test:search` |
| `package.json` | No direct command for intel-note tests. | Test required manual node command. | Added `test:character-intel`. | Script-only change. | `npm run test:character-intel` |

## Data Safety

- Nanally overwritten: no
- Canonical fields overwritten: no
- Build Planner runtime changed: no
- Backend/schema/auth/admin changed: no
