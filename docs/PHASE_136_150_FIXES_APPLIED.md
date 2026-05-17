# Phase 136-150 Fixes Applied

Date: 2026-05-18

## Frontend/Data Mapper Fixes

| File | Issue fixed | Before | After | Why low-risk | Manual verification |
| --- | --- | --- | --- | --- | --- |
| `src/repositories/api/mappers/mapApiWeaponToViewModel.js` | API weapon growth rows were one row per stat per level, while UI needed one row per level. | Attack growth column could show `Data coming soon` even when API returned attack values. | Growth rows are grouped by level and mapped to `atk` plus `subStatValue`. | Mapper-only change; no API contract or data mutation. | Open API mode weapon detail such as `/weapons/good-boys-grand-adventure`. |
| `src/repositories/api/mappers/mapApiWeaponToViewModel.js` | API refinement rows used `effectText`, UI read `effect`. | R1-R5 could show `Data coming soon`. | Mapper preserves both `effect` and `effectText`, sorted by rank. | Mapper-only change; no invented text. | Verify refinement rows display seeded text. |
| `src/repositories/api/mappers/mapApiWeaponToViewModel.js` | Percent stat display could prefer numeric-only `valueText`. | Critical Rate / ATK% could display `12` instead of `12%`. | Mapper formats with stat external ids when available. | Uses existing stat formatter. | Check weapon metric and growth table percent values. |
| `src/components/weapons/WeaponGrowthTable.jsx` | High-risk calculated/data table lacked confidence context. | Missing cells said `Data coming soon`; no status badge. | Section shows SourceStatus badge and missing cells say `Source pending`. | Copy/status-only display change. | Inspect weapon detail growth section. |
| `src/components/weapons/WeaponRefinementList.jsx` | High-risk rank text lacked confidence context and only read `effect`. | API `effectText` rows could appear empty. | Reads `effect` or `effectText`, shows SourceStatus badge. | Display-only fallback. | Inspect weapon detail refinement section. |
| `src/pages/WeaponDetailPage.jsx` | SourceStatus was not passed to refinement list. | Refinement list could not show source confidence. | Passes `weapon.sourceStatus`. | Prop-only change. | Inspect weapon detail refinement header. |
| `src/components/CharacterHero.jsx` | Character detail lacked source confidence near identity data. | No badge beside character name. | Badge appears when `character.sourceStatus` exists. | Conditional display only. | Open `/characters/nanally` in API mode. |
| `src/components/vehicles/VehicleStatsPanel.jsx` | Vehicle handling profile lacked source confidence. | No badge near 0-10 scale. | Badge appears when `vehicle.sourceStatus` exists. | Conditional display only. | Open `/vehicles` in API mode. |
| `src/pages/CodesPage.jsx` | Code availability/source confidence was not surfaced. | Status pill only showed active/expired. | SourceStatus badge appears when available. | Conditional display only. | Open `/codes` in API mode. |
| `src/pages/NewsPage.jsx` | News source/publication confidence was not surfaced. | Date/source line had no confidence badge. | SourceStatus badge appears on cards and detail modal when available. | Conditional display only. | Open `/news` and a news modal in API mode. |
| `server/tests/frontend/apiWeaponMapper.test.ts` | No regression test covered API weapon growth/refinement mapper shape. | Mapper bug could regress silently. | Tests cover grouped growth rows, percent formatting, and `effectText` normalization. | Frontend mapper test only; no DB required. | Run `npm.cmd run server:test`. |

## Not Changed

- No backend routes changed.
- No DB schema changed.
- No auth/admin behavior changed.
- No production DB/deploy/auth enabled.
- No mass data entry performed.
- Build Planner formulas/runtime were not changed.
