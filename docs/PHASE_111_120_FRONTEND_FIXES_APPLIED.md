# Phase 111-120 Frontend Fixes Applied

Date: 2026-05-18

Scope: bounded frontend layout and copy fixes only. No backend, database, auth, admin write, or Build Planner calculation/runtime behavior changed.

| File | Issue fixed | Before | After | Why low-risk | How to verify |
| --- | --- | --- | --- | --- | --- |
| `src/pages/BuildPlannerPage.jsx` | Build Planner header used `lg:flex-row` and a `lg:min-w-[520px]` summary area, which could crowd the 1024px app shell. | At small desktop width, title/copy and summary pills could compete for horizontal room. | Header stays stacked until `xl`; the summary min-width also begins at `xl`. | Class-only breakpoint change; no planner state, formulas, localStorage, or data flow touched. | Open `/build-planner` at 1024px and confirm intro and summary pills stack cleanly. |
| `src/components/vehicles/VehicleStage.jsx` | Vehicle showcase stage was very tall on phones. | `min-h-[410px]` mobile, `sm:min-h-[500px]`, image max `392px/490px`. | `min-h-[340px]` mobile, `sm:min-h-[430px]`, `lg:min-h-[500px]`; image max is reduced before `lg`. | Presentation-only sizing change; vehicle data, controls, swipe behavior, and assets unchanged. | Open `/vehicles` at 375px and 430px and confirm image remains contained with less vertical crowding. |
| `src/pages/TierListPage.jsx` | Tier board intentionally scrolls horizontally but mobile users had no affordance. | Board appeared clipped on mobile unless the user guessed to swipe. | Added a mobile-only note: "Swipe horizontally to view every tier and character placement." | Copy-only affordance; board width and tier-list logic unchanged. | Open `/tier-list` at 375px and confirm note appears above the board and the board still scrolls horizontally. |
| `src/App.jsx` | `/apartments` and `/community` placeholder copy was generic. | Generic "Coming later" copy could feel unfinished or imply broken content. | Route-specific planned-section copy clarifies source policy for Apartments and account/moderation safety for Community. | Copy-only placeholder update; routes and navigation unchanged. | Open `/apartments` and `/community`; confirm they read as intentionally parked sections. |

## Not Changed

- No backend endpoints changed.
- No database schema changed.
- No auth/session/CSRF/admin behavior changed.
- No production auth or public registration enabled.
- No Build Planner formulas, stat calculations, draft schema, or localStorage runtime changed.
