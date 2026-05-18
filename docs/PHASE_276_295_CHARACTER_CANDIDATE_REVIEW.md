# Phase 276-295 Character Candidate Review

## Summary

Reviewed `.generated/character-candidates/*` from the Phase 256-275 corpus extraction. Most candidates are useful for future manual research but unsafe for live data because folders contain mixed-character guide pages, aggregated build links, OCR artifacts, and protected-field conflicts.

## Candidate Ranking

| Slug | Name | Confidence | Source Files | Conflicts | Protected Conflict | Specificity | Public Usefulness | Decision |
| --- | --- | --- | ---: | ---: | --- | --- | --- | --- |
| `adler` | Adler | low | 5 | 4 | identity/mixed source | mostly Haniel/aggregate text | not safe | reject for now |
| `aurelia` | Aurelia | low | 6 | 5 | identity/mixed source | mostly aggregate text | not safe | reject for now |
| `baicang` | Baicang | low | 7 | 7 | rarity plus mixed source | mostly Haniel/aggregate text | not safe | reject for now |
| `chiz` | Chiz | low | 10 | 7 | rarity plus mixed source | mixed guide text | not safe | reject for now |
| `daffodil` | Daffodil | medium | 1 | 0 | no | metadata only | too thin | review later |
| `edgar` | Edgar | low | 6 | 5 | identity/mixed source | mostly aggregate text | not safe | reject for now |
| `fadia` | Fadia | low | 6 | 7 | rarity plus mixed source | mixed guide text | not safe | reject for now |
| `hanizel` | Hanizel | low | 6 | 5 | alias/mixed source | Haniel/Hanizel ambiguity | risky | review later |
| `hathor` | Hathor | low | 9 | 5 | identity/mixed source | mixed guide text | not safe | reject for now |
| `hotori` | Hotori | low | 14 | 5 | identity/mixed source | mixed with Haniel/comments | risky | review later |
| `jiuyuan` | Jiuyuan | low | 5 | 5 | rarity plus mixed source | mixed guide text | not safe | reject for now |
| `lacrimosa` | Lacrimosa | medium | 6 | 3 | mixed source only | most character-specific useful notes, with OCR artifacts | useful if paraphrased and source-pending | pilot candidate |
| `mint` | Mint | low | 6 | 22 | rarity plus mixed source | high conflict volume | not safe | reject for now |
| `nanally` | Nanally | low | 5 | 5 | rarity plus mixed source | existing page is stronger | compare-only | compare-only |
| `sakiri` | Sakiri | low | 5 | 5 | rarity plus mixed source | mixed guide text | not safe | reject for now |
| `skia` | Skia | low | 6 | 5 | identity/mixed source | mixed guide text | not safe | reject for now |

## Decision

Only `lacrimosa` is selected for a tiny pilot. The applied data is paraphrased, source-pending, and limited to public character notes. No canonical fields, stats, formulas, recommendations, or Build Planner effects were applied.
