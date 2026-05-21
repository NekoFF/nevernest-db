# Phase: Admin JSON5 Apply and Dropdown Fix

Date: 2026-05-21

## Applied Export

- Source export: `nte-admin-data-2026-05-21.json5`
- Permanent repo baseline: `src/data/adminBaselineExport.js`
- Merge/safety layer: `src/data/adminBaseline.js`
- Characters imported: 18 from `characters.entries`
- Cartridges imported: 12 from direct `cartridges` keys
- Console layouts imported: yes, 18 character console layouts
- Cartridge data imported from direct `cartridges` keys: yes

## Data Integration

- Character baseline data is merged into the canonical static roster in `src/data/characters/index.js`.
- Cartridge baseline data is merged into `baseCartridgeSets` / `cartridgeSets` in `src/data/cartridges.js`, so public pages, audits, static exports, and fresh dev sessions read the same admin-approved source baseline.
- The merge layer preserves existing meaningful source data when the export provides blank strings, empty arrays, empty objects, null, undefined, or placeholder-like values.
- Console placement fields are preserved, including `pieceColor`, `visualColor`, `colorKey`, and `visualGroup`.
- Cartridge compatible shape metadata, set metadata, and admin-verified shape status are preserved.

## Console Color Rendering

- Public console rendering now resolves module placement color in this order:
  `visualColor`, `pieceColor`, `colorKey`, `visualGroup`, then rarity fallback.
- Admin console layout preview uses the same priority.
- This keeps rarity and visual placement group separate, so S-rank pieces no longer collapse visually to one S/legendary color when a saved visual group exists.

## Dropdown Fix

- The avatar/profile dropdown now renders through a `createPortal` into `document.body`.
- Position is computed from the avatar trigger rect and uses fixed positioning below/right of the trigger.
- The menu keeps the matte glass/blur style, uses a high z-index, and is no longer clipped by topbar/search containers or stacking contexts.

## Public Cleanup

- Public character data is sanitized to remove or hide internal/source-extraction phrases such as raw source text, PDF extraction notes, source-pending wording, manual cleanup notes, and generated extraction paths.
- Missing public synergy detail copy now renders as a clean dash instead of internal/source-pending language.

## Intentionally Not Changed

- No Supabase integration.
- No backend writes or production CMS.
- No auth changes.
- No DB schema changes.
- No deployment architecture changes.
- Admin controls remain local/dev/admin-mode only and are not exposed in normal public mode.

## Verification

- `npm.cmd run build`: passed
- `npm.cmd run smoke:static`: passed
- `npm.cmd run sitemap:preview`: passed, 122 routes, local admin routes excluded
- `npm.cmd run test:character-intel`: passed
- `npm.cmd run audit:data`: passed, 0 warnings, 0 needs-verification cartridge shape gaps, 0 blockers
- `npm.cmd run import:dry-run`: passed, 0 blockers

## Manual Browser Checks

Checked with a fresh headless Edge profile against a restarted local dev server at `http://127.0.0.1:5173`.

- Public mode had no admin buttons on checked character pages.
- Avatar dropdown opened under the avatar, fixed to `body`, not clipped, with blur active.
- Nanally, Sakiri, Skia, and Mint console tabs rendered saved layouts.
- Console grids showed multiple distinct placement colors after reload.
- Public character pages did not expose source/debug extraction text.
- `Street Boxer` cartridge page loaded with compatible module/shape content available from the baseline data.
- `/dev/admin` remained local/dev gated; no production backend behavior was added.
