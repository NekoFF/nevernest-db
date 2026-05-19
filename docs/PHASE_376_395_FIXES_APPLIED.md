# Phase 376-395 Fixes Applied

Date: 2026-05-19

## Fixes

| File | Issue | Fix | Why Low Risk | Verification |
| --- | --- | --- | --- | --- |
| `src/App.jsx` | Decorative absolute backgrounds on detail pages could increase horizontal `scrollWidth` on desktop/tablet widths. | Added `overflow-x-hidden` to the app shell. | Presentation containment only; routes/data/runtime unchanged. | Local production preview QA found no overflow on sampled affected routes. |
| `src/data/news.js` | Public placeholder News descriptions mentioned `Admin Mode`, which could confuse normal visitors. | Reworded placeholders as reserved/source-reviewed news slots without admin wording. | Static copy only; no data claims invented. | `npm run test:search`, `npm run build`, and `npm run smoke:static` passed. |

## Not Changed

No character data filling, formulas, Build Planner runtime, backend endpoints, DB schema, auth, registration, admin writes, API default, accounts, comments, or submissions changed.
