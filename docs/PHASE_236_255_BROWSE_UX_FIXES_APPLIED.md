# Phase 236-255 Browse UX Fixes Applied

| File | Issue fixed | Before | After | Why low-risk | Verification |
| --- | --- | --- | --- | --- | --- |
| `src/utils/searchScoring.js` | Broad category searches missed items with custom `searchText`. | `code`, `vehicle`, or `news` could miss expected categories. | Category/id/name/meta are always included in the haystack. | Pure scoring/search utility change. | `npm run test:search` passed. |
| `src/utils/searchIndex.js` | Search results lacked explicit public route metadata. | Results navigated by callback only. | Public `route` is present for indexed entity types. | Metadata only; no route table change. | `npm run test:search` passed. |
| `src/pages/ModulesPage.jsx` | Static module pieces could disappear from browse filters. | Static `modulePieces` list was empty in the page. | Static mode uses bundled module pieces; API mode still uses API pieces. | Restores static read-only data path. | `npm run build` passed. |
| `src/pages/ModulesPage.jsx` | Combined no-results state could be confusing. | Separate cartridge/module empty states could show unevenly. | Combined empty state and source-pending copy added. | Copy/control flow only. | `npm run build` passed. |
| `src/pages/CharactersPage.jsx` | Character page search did not include id/slug. | Name and display fields only. | id/slug included in filter haystack. | Filter-only change. | `npm run build` passed. |
| `src/pages/WeaponsPage.jsx` | Weapon page search did not include id/slug/source status. | Display fields only. | id/slug/source status included in filter haystack. | Filter-only change; detail page untouched. | `npm run build` passed. |
| `src/pages/CodesPage.jsx` | Codes filters had no quick reset. | Manual unselect required. | Reset filters button added. | Local UI state only. | `npm run build` passed. |
| `src/pages/NewsPage.jsx` | News filters had no quick reset. | Manual unselect required. | Reset filters button added. | Local UI state only. | `npm run build` passed. |
| `src/pages/VehiclesPage.jsx` | Vehicle type filter had no quick reset. | Manual All selection required. | Reset filters button added. | Local UI state only. | `npm run build` passed. |
| `src/pages/GuidesPage.jsx` | Guides were not searchable from page context and lacked SEO. | Static planned cards only. | Topbar query filtering, SEO, count, no-results, source-pending label. | Read-only planned content only. | `npm run build` passed. |
| `src/pages/TierListPage.jsx` | Some visible labels still said official. | Could imply official endorsement. | Public-facing labels use reference wording. | Copy-only; data model unchanged. | `npm run build` passed. |

