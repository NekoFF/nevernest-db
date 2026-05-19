# Phase 356-375 Fixes Applied

Date: 2026-05-19

## Fixes

| File | Issue | Fix | Low-Risk Reason | Verification |
| --- | --- | --- | --- | --- |
| `src/components/Sidebar.jsx` | Footer used too much vertical space and future nav was under-labelled. | Reduced padding/sizing and added compact planned/source-pending badges. | Presentation-only; no routes removed. | Build passed. |
| `src/components/Topbar.jsx` | Account/notification menu could imply working accounts. | Added clear `Later` labels and safer no-account copy. | Copy/UI only; AdminMode gate unchanged. | Build passed. |
| `src/components/CategoryCard.jsx` / `src/data/categories.js` / `src/pages/HomePage.jsx` | Home future cards lacked clean status chips. | Added optional status chip for planned/source-pending categories. | Presentation-only. | Build passed. |
| `src/data/moduleCatalog.js` | Extra helper colors were limited and unclearly named. | Added named `group-*` visual colors and legacy helper aliases. | Visual display only; real rarities unchanged. | `node --test src/data/consoleBlocks.test.js` passed. |
| `src/data/consoleBlocks.js` | Console placement colors could fall back to real rarity and lose custom colors. | Preserved `visualGroup`/layout color before rarity fallback. | Optional field, backward-compatible aliases. | New console test passed. |
| `src/admin/ConsoleLayoutEditor.jsx` | Local editor labelled custom colors as helper colors near rarity. | Split real rarity from visual group color selection. | Local AdminMode-only tooling; production gate unchanged. | Build passed. |
| `src/components/ConsoleTab.jsx` | Public console display did not clearly explain placement colors. | Rendered visual group colors and added short explanation that colors are not rarity. | Public copy/display only. | Build passed. |

## Not Changed

Backend endpoints, DB schema, production auth, public registration, production admin writes, API mode default, Build Planner formulas/runtime, character stats, and canonical character data.
