# Node-Safe Data Export Plan

Date: 2026-05-16

## Status

Phase 6 completed the first Node-safe data layer refactor.

`src/data/exportDataIndex.js` is the intended seed snapshot entrypoint, and plain Node can now import it directly.

Current dry-run behavior:

- Imports `getExportDataSnapshot()` from `src/data/exportDataIndex.js`.
- Reports loader `exportDataIndex-node-safe`.
- Keeps `fallback-node-loader` only as an emergency fallback.

The dry run is independent from Vite and React while loading the canonical snapshot instead of regex-parsed character cards.

## Target

Make `getExportDataSnapshot()` fully Node-safe so future importers can load one canonical export without JSX transforms.

## Completed Refactor

- Pure taxonomy arrays live in `src/data/gameTaxonomy.js`.
- React/SVG icon components remain in `src/data/gameMeta.jsx`.
- `gameMeta.jsx` composes icons with pure taxonomy data and keeps existing public exports working.
- Character constants derive from pure taxonomy.
- `src/data/canonicalCharacters.js` uses a Node-compatible JSON import attribute.
- `exportDataIndex.js` imports only Node-safe data modules.

## Guardrails

- Do not import `.jsx`, React components, browser APIs, or UI-only modules from seed/export paths.
- Do not remove `gameMeta.jsx`; it is still the UI metadata layer.
- Do not remove the emergency fallback loader until CI covers the Node-safe entrypoint.
- Do not treat draft material rows or cartridge compatible shapes as verified import data.

## Benefit

The Node-safe export path now allows:

- deeper character detail extraction
- stable backend seed scripts
- simpler CI validation
- less regex fallback parsing
- more faithful SQL import dry runs

See `docs/PHASE_6_NODE_SAFE_DATA_LAYER.md` for the implementation report.
