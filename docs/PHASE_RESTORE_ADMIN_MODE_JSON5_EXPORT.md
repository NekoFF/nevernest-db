# Phase Restore Admin Mode JSON5 Export

## Scope

Focused restoration pass for the local Admin Mode workflow, Sakiri character-detail parity, public character rendering cleanup, and console/module color persistence.

This pass did not enable backend writes, database writes, auth, registration, production admin mode, or public mutation routes.

## What Was Restored

- Local Admin Mode availability now accepts `VITE_ENABLE_ADMIN_MODE=true`.
- The legacy `VITE_ENABLE_BROWSER_ADMIN_MODE=1` flag still works.
- `?admin=1` can enable Admin Mode automatically in development only.
- Character page pencil controls are available again when local Admin Mode is active.
- Admin Overview remains the centralized local draft management surface.
- Admin Overview exports one full-site handoff file covering characters, weapons, cartridges/modules, module shapes, vehicles, codes, news, and tier list overrides.

## How To Enable Local Admin Mode

PowerShell:

```powershell
$env:VITE_ENABLE_ADMIN_MODE="true"
npm.cmd run dev
```

Alternative local-only URL trigger:

```text
http://127.0.0.1:5173/?admin=1
```

Production/public mode keeps Admin Mode unavailable because the gate requires Vite development mode.

## How To Export JSON5

1. Enable local Admin Mode.
2. Use the avatar menu.
3. Select `Admin Mode` if not already active.
4. Select `Admin Overview`.
5. Click `Export Admin JSON5`.

The exported file is one centralized `.json5` handoff file. It is intentionally localStorage based and contains no production write action.

## Where The JSON5 Should Be Applied Later

The JSON5 export is a source-data handoff for Cursor/Codex to apply back into the repository data files, primarily:

- `src/data/characters/*`
- `src/data/characters/pdfSourceImports.js`
- `src/data/cartridges.js`
- `src/data/moduleCatalog.js`
- `src/data/weapons.js`
- `src/data/vehicles.js`
- `src/data/codes.js`
- `src/data/news.js`

## Console Color Bug Fixed

Console placements now preserve visual color separately from rarity.

Supported placement fields:

- `pieceColor`
- `visualColor`
- `visualGroup`
- `layoutColor`
- `placementColor`
- `colorKey`
- `rarity`

Rendering now prefers `pieceColor` / `visualColor` before falling back to rarity. Save/export paths preserve these fields, so local admin-edited console pieces no longer collapse visually to the same S-rank/legendary color after save.

## Sakiri Updates

- Added guide build data for Good Boy's Grand Adventure, Speedy Hedgehog, and Crimson: Twin Butterflies.
- Added main stat, sub stat, endgame stat, and skill priority recommendations.
- Added Type III Specialization console trait and editable console setup placeholder.
- Added review summary, strengths, tradeoffs, awakening review, and roster-only team/synergy entries.
- Updated A4 and A5 awakening text with the provided values.
- Kept unconfirmed screenshot identities internal instead of rendering fake public team cards.

## Public Rendering Cleanup

- Public Nanally/Sakiri skill tables are covered by regression tests against parser/debug text leaks.
- Public character pages do not show raw source paths, extraction notes, source-pending badges, or needs-verification wording for Nanally/Sakiri.
- Character overview hero accents now follow the character element color, so Sakiri uses the Incantation accent instead of Nanally's Anima-leaning accent.
- The avatar dropdown now renders as a fixed floating menu below the avatar with a higher z-index, avoiding clipping inside the topbar.

## Intentionally Not Changed

- No backend endpoints changed.
- No database schema changed.
- No auth, registration, comments, or production admin writes were enabled.
- Build Planner formulas/runtime were not changed.
- Exact Sakiri console grid coordinates were not invented; the layout remains editable through local Admin Mode.

## Verification

- `npm.cmd run build` - PASS.
- `npm.cmd run smoke:static` - PASS.
- `npm.cmd run sitemap:preview` - PASS; 122 routes, `/dev/admin` excluded.
- `npm.cmd run test:character-intel` - PASS; includes Nanally/Sakiri public provenance leak regression.
- `npm.cmd run test:search` - PASS.
- `npm.cmd run audit:data` - PASS; 0 blockers, 12 cartridge compatible-shape verification items remain.
- `npm.cmd run import:dry-run` - PASS; 0 blockers.
- `node --test src/admin/adminModeGate.test.js` - PASS.
- Local dev check with `VITE_ENABLE_ADMIN_MODE=true` - `/characters/sakiri?admin=1` and `/characters/nanally?admin=1` returned 200.
- Static preview route check - `/characters/sakiri`, `/characters/nanally`, `/characters`, `/weapons`, `/modules`, `/modules/speedy-hedgehog`, `/modules/pieces/type-iii-horizontal/S`, and `/build-planner` returned 200.
