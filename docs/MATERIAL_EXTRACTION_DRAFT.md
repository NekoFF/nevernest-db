# Material Extraction Draft

Date: 2026-05-16

Phase 5 added a draft material candidate scanner. This is not a production material catalog.

## Result

Material candidates found: 7

| Candidate id | Name | Source | Amount observed | source_status |
| --- | --- | --- | --- | --- |
| `blurred-silhouette` | Blurred Silhouette | `src/data/characters/nanally.js` | 10 | `needs_verification` |
| `chaos-silhouette` | Chaos Silhouette | `src/data/characters/nanally.js` | 16 | `needs_verification` |
| `co` | CO | `src/data/characters/nanally.js` | 10 | `needs_verification` |
| `fading-silhouette` | Fading Silhouette | `src/data/characters/nanally.js` | 10 | `needs_verification` |
| `fng` | FNG | `src/data/characters/nanally.js` | 10 | `needs_verification` |
| `good-boy-stamp` | Good Boy Stamp | `src/data/characters/nanally.js` | 8 | `needs_verification` |
| `white-rose` | White Rose | `src/data/characters/nanally.js` | 16 | `needs_verification` |

Generated artifact:

- `.generated/import-dry-run/material-candidates.json`

## Missing Fields

- verified material rarity
- material category
- source/drop location taxonomy
- icon/media asset id
- exact usage context by level/skill
- official source URL or screenshot reference

## Future Material Catalog Shape

Recommended fields:

- `external_id`
- `slug`
- `name`
- `rarity_id`
- `category`
- `source_text`
- `media_asset_id`
- `source_status`
- `raw`

## Manual Verification Required

- Confirm names and amounts against game/source screenshots.
- Split generic sources into structured acquisition tables only after enough data exists.
- Decide whether short labels such as `FNG` and `CO` are final display names or abbreviations.
- Do not import these candidates as verified production materials yet.

