# Phase 6 Node-Safe Data Layer

Date: 2026-05-16

## What Changed

- Added `src/data/gameTaxonomy.js` as the pure JS taxonomy source for elements, arc types, and rarities.
- Updated `src/data/gameMeta.jsx` to compose UI-only SVG icon components onto the pure taxonomy data.
- Updated character constants and admin option constants to read taxonomy from `.js` data instead of `gameMeta.jsx`.
- Updated the dry-run loader so the primary `getExportDataSnapshot()` path succeeds in plain Node and reports `exportDataIndex-node-safe`.
- Kept the fallback loader in place as an emergency path only.
- Updated character dry-run mapping to extract structured stats, skills, skill material references, and voice actors when available.

## Node-Safe Files

- `src/data/exportDataIndex.js`
- `src/data/gameTaxonomy.js`
- `src/data/characters.js`
- `src/data/characters/index.js`
- `src/data/canonicalCharacters.js`
- `scripts/import-dry-run/loadSnapshot.mjs`

`src/data/gameMeta.jsx` remains UI-only and still owns React/SVG icon composition.

## Snapshot Result

Plain Node can import `src/data/exportDataIndex.js` directly.

Verified command:

```sh
node -e "import('./src/data/exportDataIndex.js').then((m)=>{const s=m.getExportDataSnapshot(); console.log('ok', s.data.characters.length);})"
```

Result: `ok 18`

## Fallback Loader

The fallback loader is still present, but normal dry runs no longer use it.

Current dry-run loader: `exportDataIndex-node-safe`

## Character Extraction

Character extraction improved because the dry run now receives normalized character objects instead of regex-parsed card rows.

New low-risk mapped tables:

- `characterStats`: 240 rows from structured keyframe stats.
- `characterSkills`: 16 rows from structured skill data.
- `characterMaterials`: 42 draft join rows from structured skill material references.
- `characterVoiceActors`: 4 rows.

Not extracted yet:

- `characterSkillScaling`: current canonical skill shape does not expose stable scaling rows.
- `characterBannerHistory`, `characterQuotes`, `characterPersonalItems`: no stable plain data source yet.

## Risks

- `characterStats` are marked `estimated` unless source data says otherwise.
- `characterMaterials` remain `needs_verification` because the material catalog is still draft-only.
- Cartridge compatible shapes still require trusted-source verification.
- `gameMeta.jsx` should stay out of import/seed paths.

## Next Recommended Phase

Phase 7 should build a reviewed material catalog and source-verification pass:

- normalize material candidate ids
- dedupe material references across skills/characters
- define material categories and acquisition sources
- keep all output dry-run only until a real migration/import runner exists
