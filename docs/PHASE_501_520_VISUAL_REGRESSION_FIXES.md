# Phase 501-520 Visual Regression Fixes

## Goal

Finish the Soft Matte Adaptive Glass consistency pass without changing database content, imported character data, Build Planner calculations, backend behavior, auth, admin gating, routes, imports, or production runtime behavior.

## Specific Regressions Fixed

- Removed the character hero card's full accent outline. Character detail heroes now use a soft white/matte card surface with shadow and internal accent treatment only.
- Replaced the search input's hard pink focus ring with a soft inset capsule state. Keyboard `:focus-visible` still has a subtle accessible ring.
- Restored a desktop sticky sidebar slot and kept the sidebar shell height constrained to the viewport.
- Kept the topbar as a sticky soft matte glass surface and preserved the sticky character detail back button style.
- Redesigned the sidebar footer into a smaller legal cluster plus compact community/support/theme controls.
- Restyled summary counters into soft elevated matte tiles instead of hard bordered boxes.
- Updated source/status badges to use the shared soft badge treatment.
- Improved overlay glass tokens for dropdowns, sticky bars, floating controls, and topbar/search surfaces.
- Fixed module and cartridge rarity segmented active states so S/A/B use gold, purple, and blue accents respectively.
- Preserved unresolved synergy behavior as source-pending notes instead of fake linked character cards.

## Files Changed

- `src/index.css`
- `src/App.jsx`
- `src/components/CharacterHero.jsx`
- `src/components/Sidebar.jsx`
- `src/components/StatItem.jsx`
- `src/components/TeamSection.jsx`
- `src/components/ui/SourceStatusBadge.jsx`
- `src/components/ui/SummaryCounters.jsx`
- `src/pages/CharacterDetailPage.jsx`
- `src/pages/CartridgeDetailPage.jsx`
- `src/pages/GuidesPage.jsx`
- `src/pages/ModuleDetailPage.jsx`
- `src/pages/ModulesPage.jsx`
- `src/pages/WeaponsPage.jsx`

## What Was Not Changed

- No character data, Skia/Mint/Nanally content, imports, formulas, backend endpoints, auth, AdminMode exposure, DB schema, routes, or production admin behavior were changed.
- The existing white minimal structure and route architecture were preserved.
- Large dense content cards remain mostly solid/elevated instead of becoming transparent glass panels.

## Responsive Checks

Targeted density rules remain focused on 1440px, 1366px, 1280px, and 1024px desktop ranges. The sidebar footer, card padding, filter pills, topbar padding, and character detail card density were reduced for MacBook and Full HD-style viewports while keeping mobile behavior separate.

## Manual Route Notes

Local route availability was checked against `http://127.0.0.1:5173`:

- `/`
- `/characters`
- `/characters/skia`
- `/characters/mint`
- `/characters/nanally`
- `/characters/adler`
- `/weapons`
- `/modules`
- `/modules/pieces/straight-line/S`
- `/guides`
- `/build-planner`

Viewport targets:

- 1440x900
- 1366x768
- 1280x800
- 1024x768

Screenshot-based viewport inspection still needs a browser pass. The code-side density fixes were targeted to the listed desktop ranges and preserve the existing mobile drawer behavior.

## Commands Run

- `npm.cmd run build` - passed, with the pre-existing Vite large chunk warning.
- `npm.cmd run smoke:static` - passed.
- `npm.cmd run sitemap:preview` - passed, generated 122 preview routes.
- `npm.cmd run test:character-intel` - passed, 4 tests.
- `npm.cmd run test:search` - passed, 9 tests.
- `npm.cmd run audit:data` - passed, 0 blockers, 12 existing needs-verification cartridge shape notes.
- `npm.cmd run import:dry-run` - passed, 0 blockers. The generated timestamp change was not kept.

## Remaining Visual TODOs

- Continue replacing older one-off hard borders in less-traveled pages as those pages receive dedicated polish.
- Full screenshot QA still needs a browser viewport pass to verify the sticky overlap feel visually at every listed size.
