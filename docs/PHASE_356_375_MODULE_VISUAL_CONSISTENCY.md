# Phase 356-375 Module Visual Consistency

Date: 2026-05-19

## Result

Character Detail console placement colors now separate real module rarity from presentation-only placement grouping.

## Root Cause

`normalizeConsole()` resolved a placement's module piece and then set `colorKey` from the resolved piece rarity before considering saved custom placement colors. As a result, helper/custom placement colors could collapse back to S/legendary-style display.

## Fix

- Added named visual group colors in `src/data/moduleCatalog.js`:
  - `group-pink`
  - `group-blue`
  - `group-green`
  - `group-purple`
  - `group-amber`
  - `group-cyan`
- Preserved legacy `helper-1`, `helper-2`, and `helper-3` by mapping them to named groups.
- Updated console normalization to preserve `visualGroup` and `colorKey` from placement data before falling back to rarity.
- Updated local console layout editor to label extra colors as visual groups, not rarity.
- Updated public Character Detail console display to render visual groups without showing fake rarity labels.

## Data Distinction

- `rarity`: real module rarity/game data (`S`, `A`, `B`).
- `visualGroup`: presentation-only console placement color for readability.
- `colorKey`: backward-compatible display color key.

## Safety

Build Planner formulas/runtime, module database rarity, cartridge rarity, compatible module data, character stats, backend endpoints, and DB schema were not changed.
