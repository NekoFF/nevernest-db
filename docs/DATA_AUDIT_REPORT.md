# Data Audit Report

Date: 2026-05-16

Generated from `npm.cmd run audit:data` after Phase 2.5 data blocker cleanup.

## Summary

| Check | Status | Result |
| --- | --- | --- |
| Characters | OK | 18 audited |
| Weapons / Arcs | OK | 42 audited |
| Cartridge sets | OK with verification needs | 12 audited |
| Module shapes | OK | 12 audited |
| Module pieces | OK | 36 generated pieces audited |
| Vehicles | OK | 16 audited |
| Tier list entries | OK | 18 character placements audited |
| Codes | OK | 13 audited |
| News posts | OK | 3 audited |
| Duplicate ids/slugs | OK | None detected by current audit |
| Missing required static seed ids | OK | None detected by current audit |
| Missing references | OK | No warning-level missing references |
| Resolved media aliases | Needs cleanup later | 9 explicit aliases resolved |
| Blockers | OK | 0 blockers |

## Counts

```json
{
  "characters": 18,
  "weapons": 42,
  "cartridges": 12,
  "moduleShapes": 12,
  "modulePieces": 36,
  "vehicles": 16,
  "tierListEntries": 18,
  "codes": 13,
  "news": 3
}
```

## Duplicate ID / Slug Warnings

Status: OK

No duplicate ids or slugs were reported by `scripts/audit-data.mjs`.

## Missing Reference Warnings

Status: OK

No warning-level missing references were reported.

## Cartridge Compatibility Verification

Status: Needs verification

All 12 cartridge sets are currently marked with `dataStatus: "missing-compatible-shapes"`:

- `lost-radiance`
- `fireflies-and-the-forest`
- `crimson-twin-butterflies`
- `diabolos`
- `devils-blood-curse`
- `street-boxer`
- `kingdoms-guard`
- `shadow-creed`
- `theas-night-tavern`
- `tiny-big-adventure`
- `speedy-hedgehog`
- `quiet-manor`

Interpretation: current compatible shape data may remain usable by the frontend UI, but it must not be imported as verified official data. SQL import should set `source_status = "needs_verification"` for cartridge compatibility rows until official/source-checked shape compatibility is confirmed.

## Resolved Media Aliases

Status: Needs cleanup later, not a blocker

The audit now resolves known filename-derived media ids through `src/data/mediaAliases.js`:

| Media id | Filename-derived id | Canonical entity id |
| --- | --- | --- |
| `character-avatar-daffodill` | `daffodill` | `daffodil` |
| `character-avatar-haniel` | `haniel` | `hanizel` |
| `character-avatar-zero-2` | `zero-2` | `zero-male` |
| `character-avatar-zero` | `zero` | `zero-female` |
| `cartridge-image-fireflies-and-the-forest-a` | `fireflies-and-the-forest-a` | `fireflies-and-the-forest` |
| `vehicle-image-a1` | `a1` | `rover-a1` |
| `vehicle-image-lavelox` | `lavelox` | `la-velox` |
| `vehicle-image-novis-st-x-950` | `novis-st-x-950` | `novis-stx-950` |
| `vehicle-image-rivok` | `rivok` | `future-surge` |

Interpretation: strict mismatch still exists at the filename/media level, but the mapping is explicit and SQL-safe. Later asset cleanup can rename files or add database aliases without changing current runtime behavior.

## SQL Migration Blockers

Status: no hard blockers. Some data-quality work remains before real import.

| Blocker | Severity | Notes |
| --- | --- | --- |
| Cartridge compatible shape verification | Needs verification | Exact shape source must be confirmed before treating current compatible shapes as official. |
| Character data depth imbalance | Warning | Nanally is rich; many characters are card/skeleton-level. |
| Materials catalog | Warning | Materials are still embedded in character/skill data; `materialCatalogDraft` is intentionally empty. |
| Roles/tags overlap | Warning | Phase 2.5 added taxonomy policy, but current character records still need normalization. |
| Placeholder Guides/Community/Apartments | Warning | These need real entity records before production database import. |
| localStorage admin data outside static audit | Warning | Current audit covers seed data only, not user/admin local overrides. |

## Raw Audit Output

```text
NTE Data Audit Report

OK
  - No duplicate ids/slugs or missing required static seed ids detected by this audit.
  - Characters audited: 18
  - Weapons audited: 42
  - Cartridges audited: 12
  - Module shapes audited: 12
  - Module pieces audited: 36
  - Vehicles audited: 16
  - Tier list entries audited: 18
  - Codes audited: 13
  - News audited: 3

Warnings
  OK: none

Needs verification
  - Cartridge lost-radiance marked missing-compatible-shapes
  - Cartridge fireflies-and-the-forest marked missing-compatible-shapes
  - Cartridge crimson-twin-butterflies marked missing-compatible-shapes
  - Cartridge diabolos marked missing-compatible-shapes
  - Cartridge devils-blood-curse marked missing-compatible-shapes
  - Cartridge street-boxer marked missing-compatible-shapes
  - Cartridge kingdoms-guard marked missing-compatible-shapes
  - Cartridge shadow-creed marked missing-compatible-shapes
  - Cartridge theas-night-tavern marked missing-compatible-shapes
  - Cartridge tiny-big-adventure marked missing-compatible-shapes
  - Cartridge speedy-hedgehog marked missing-compatible-shapes
  - Cartridge quiet-manor marked missing-compatible-shapes

Resolved media aliases
  - Media character-avatar-daffodill resolves alias "daffodill" -> "daffodil"
  - Media character-avatar-haniel resolves alias "haniel" -> "hanizel"
  - Media character-avatar-zero-2 resolves alias "zero-2" -> "zero-male"
  - Media character-avatar-zero resolves alias "zero" -> "zero-female"
  - Media cartridge-image-fireflies-and-the-forest-a resolves alias "fireflies-and-the-forest-a" -> "fireflies-and-the-forest"
  - Media vehicle-image-a1 resolves alias "a1" -> "rover-a1"
  - Media vehicle-image-lavelox resolves alias "lavelox" -> "la-velox"
  - Media vehicle-image-novis-st-x-950 resolves alias "novis-st-x-950" -> "novis-stx-950"
  - Media vehicle-image-rivok resolves alias "rivok" -> "future-surge"

Blockers
  OK: none
```
