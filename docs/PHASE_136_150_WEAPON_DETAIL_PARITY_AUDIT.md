# Phase 136-150 Weapon Detail Parity Audit

Date: 2026-05-18

Scope: seeded API weapon detail parity, especially growth scaling and refinement/resonance display. This phase did not add write endpoints, change schema, or invent weapon values.

## Summary

Seeded API weapon detail data was present for the observed mismatch, but the frontend mapper was handing the detail components the wrong display shape.

- API detail returned one `growthScaling` row per stat per level.
- `WeaponGrowthTable` expected one combined row per level with `atk` and `subStatValue`.
- API detail returned refinement text as `effectText`.
- `WeaponRefinementList` read `effect`.
- API `valueText` for percent stats is numeric-only, so the mapper must format via stat external ids.

Result: fixed as a mapper/display bug, not a data-fill task.

## Observed Seeded API Example

Route: `/api/weapons/good-boys-grand-adventure`

- Main stat: `atk`, value `474`.
- Sub stat: `atk_percent`, value `45`.
- Growth rows returned: 18 raw rows, representing 9 levels x 2 stats.
- Refinement rows returned: 5 rows.
- Refinement text field: `effectText`.
- Source status: seeded rows currently mostly `unknown`.

## Fields Audited

| Field | Static mode | API mode before | API mode after | Result |
| --- | --- | --- | --- | --- |
| Rarity/type/arcType | Displayed | Displayed | Displayed | No change |
| Main stat metric | Displayed | Displayed | Displayed | No change |
| Sub stat metric | Displayed | Percent could display numeric-only in sparse DTOs | Formats by stat external id | Fixed |
| Growth Attack column | Displayed when static row has `atk` | Showed `Data coming soon` despite API values | Groups API stat rows by level and shows attack | Fixed |
| Growth sub stat column | Displayed | Mostly displayed | Formats percent values consistently | Fixed |
| Refinement R1-R5 | Displayed when static row has `effect` | Showed `Data coming soon` when API row only had `effectText` | Normalizes `effectText` to `effect` | Fixed |
| SourceStatus | Limited | Limited | Badge on growth/refinement sections | Improved |
| Media | Displayed | Displayed through mapper/static fallback | Displayed | No change |

## Determination

- Attack growth mismatch: mapper/display bug.
- Refinement rows mismatch: mapper/display bug.
- Percent formatting mismatch: mapper/display bug when DTO carries DB stat ids plus stat external ids.
- Missing refinement values, when truly absent in future rows: remain source pending, not invented.

## Remaining Risks

- Seeded API weapon list count differs from static weapon count in some checks depending on endpoint limit or seeded availability.
- Source status remains mostly `unknown`; that is honest but should be improved by future source verification workflow.
- Formula/planner behavior was not changed and remains prototype/needs verification.
