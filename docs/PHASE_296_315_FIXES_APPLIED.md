# Phase 296-315 Fixes Applied

| File | Issue Fixed | Before | After | Why Low-Risk | Verification |
| --- | --- | --- | --- | --- | --- |
| `src/components/Topbar.jsx` | Search dropdown could be too narrow on phone because it matched the input width. | Dropdown was absolutely positioned inside the search box at all sizes. | Dropdown uses viewport-contained fixed positioning on mobile and reverts to input-width absolute positioning on larger screens. | Presentation-only; existing selection handlers unchanged. | `npm run build`, `npm run test:search` |
| `src/components/Hero.jsx` | Home first viewport was tall on phones and showed a fake community count. | Hero media min-height started at 320px; Community stat showed `0`; CTA implied live community path. | Phone min-height reduced, Community stat says `Planned`, CTA says `Community later`. | Copy/layout only; routes unchanged. | `npm run build`, `npm run smoke:static` |
| `src/components/Sidebar.jsx` | Sidebar footer copy implied live community/support systems. | Displayed a specific online-member count and `Support project`. | Uses launch-safe planned labels. | Copy only; no nav/runtime change. | `npm run build` |
| `src/components/vehicles/VehicleStage.jsx` | Vehicle showroom could consume too much vertical space on 375px/430px screens. | Mobile min-height 340px and large-phone min-height 430px. | Mobile min-height 260px and large-phone min-height 340px; mobile image max height reduced. | Layout-only; vehicle data untouched. | `npm run build`, `npm run smoke:static` |
| `src/components/vehicles/VehicleStatsPanel.jsx` | Handling profile header could crowd on narrow screens. | Header used a single row at all sizes. | Header stacks on phone and returns to row at `sm`. | Layout-only. | `npm run build` |
| `src/pages/CodesPage.jsx` | Local admin code edit modal could overflow short mobile screens. | Modal had no max-height or inner scrolling. | Modal has `max-h-[88vh]` and `overflow-y-auto`. | Local/admin-only presentation change; writes still gated. | `npm run build` |
| `src/pages/LegalInfoPage.jsx` | Legal hero icon used a nonstandard size utility. | `h-13 w-13`. | `h-12 w-12`. | Class-only consistency fix. | `npm run build` |
| `src/pages/CharacterDetailPage.jsx` | Lacrimosa source-pending intel panel felt heavy on phone. | Panel padding was fixed at `p-5`. | Phone padding reduced and restored at `sm`. | Layout-only; intel data/status unchanged. | `npm run test:character-intel`, `npm run build` |

## Not Changed

- No backend endpoints.
- No DB schema.
- No auth/admin runtime behavior.
- No Build Planner formulas.
- No production feature gates.
