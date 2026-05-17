# Material Catalog Review

Date: 2026-05-16

## Status

The material catalog is draft-only. No material candidate is verified and no production SQL rows should be created from this file yet.

Source path: Node-safe `getExportDataSnapshot()` via `exportDataIndex-node-safe`.

Observed character: `nanally`

Likely source files:

- `src/data/characters/nanally.js`
- `data-entry/characters/nanally.character-data.template.json`

## Reviewed Draft Candidates

| Material id | Name | Aliases / original labels | Usage rows | Total observed amount | source_status |
| --- | --- | --- | --- | --- | --- |
| `blurred-silhouette` | Blurred Silhouette | Blurred Silhouette | 4 | 280 | `needs_verification` |
| `chaos-silhouette` | Chaos Silhouette | Chaos Silhouette | 4 | 192 | `needs_verification` |
| `co` | CO | CO | 4 | 280 | `needs_verification` |
| `fading-silhouette` | Fading Silhouette | Fading Silhouette | 4 | 144 | `needs_verification` |
| `fng` | FNG | FNG | 4 | 144 | `needs_verification` |
| `good-boy-stamp` | Good Boy Stamp | Good Boy Stamp | 4 | 152 | `needs_verification` |
| `white-rose` | White Rose | White Rose | 4 | 192 | `needs_verification` |

## Unresolved Observed Labels

These labels are present in character material usage rows but are not part of the reviewed Phase 7 catalog draft yet.

| Label | Usage rows | Total observed amount | Character | Review note |
| --- | --- | --- | --- | --- |
| Beetle Coin | 4 | 10,588,000 | `nanally` | Decide whether this belongs in materials or currency. |
| Dreamless Seed | 5 | 112 | `nanally` | Verify identity, category, and whether life-skill materials should be cataloged here. |
| Fons | 5 | 42,100 | `nanally` | Likely currency; decide separate currency model before cataloging. |

## Missing Fields

All reviewed candidates are missing:

- verified source URL
- evidence type
- rarity id
- material category
- media asset id
- official acquisition source confirmation
- reviewer and verification timestamp

`CO` and `FNG` also need official full-name review because they may be abbreviations.

## Manual Review Checklist

- Confirm official names and spelling.
- Resolve abbreviation labels.
- Assign rarity and category only from trusted evidence.
- Confirm all acquisition source labels.
- Decide whether currency-like labels are part of the material catalog.
- Add media asset ids only after real material icons exist.
- Keep `sourceStatus: "needs_verification"` until evidence is attached.
