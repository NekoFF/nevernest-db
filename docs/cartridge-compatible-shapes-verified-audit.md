# Cartridge Compatible Shapes Verified Audit

Date: 2026-05-16

Scope: cartridge compatible module shape references, set-bonus stat effect normalization, and Mental/Cognitive stat alias behavior.

Important note: the user's manually entered Admin Mode cartridge shapes live in that browser's `localStorage`. The workspace filesystem cannot read that private browser storage directly without an exported Admin Data JSON or access to the exact browser profile. I did not reset, overwrite, or edit any admin overrides. This report therefore documents:

- the source/runtime code path that preserves admin overrides;
- the seed/runtime cartridge data visible from the workspace;
- the stat alias validation results;
- what must be checked against exported admin data to confirm the user's exact 12 manual entries.

## Persistence And Merge Path

Admin cartridge overrides are stored under:

`nte.admin.cartridges`

Runtime cartridge data is merged in this order:

`src/data/cartridges.js` seed data -> `nte.admin.cartridges` local overrides -> `mergeCartridgeSetsWithOverrides(...)`

Build Planner reads `mergedCartridges` from `AdminModeContext`, so admin-entered compatible module shapes are the cartridge shapes used for set matching and calculation when present in the browser's localStorage.

## Mental / Cognitive Canonical Choice

Canonical internal Build Planner stat key:

`cognitiveDmg`

Reason: existing saved builds, structured cartridge effects, and calculator code already use `cognitiveDmg`. Changing the canonical key would risk breaking old admin data and drafts.

User-facing label:

`Mental DMG`

Reason: Quiet Manor's displayed bonus uses "Mental DMG", and that appears to be the game-facing terminology. `Mental DMG`, `mentalDmg`, `Mental Damage`, `cognitiveDmg`, and `Cognitive DMG` now all resolve to the same canonical internal key.

## Stat Alias Validation

| Input | Canonical key | User-facing label | Status |
| --- | --- | --- | --- |
| Mental DMG | `cognitiveDmg` | Mental DMG | Resolved |
| Mental Damage | `cognitiveDmg` | Mental DMG | Resolved |
| mentalDmg | `cognitiveDmg` | Mental DMG | Resolved |
| mentalDamage | `cognitiveDmg` | Mental DMG | Resolved |
| Cognitive DMG | `cognitiveDmg` | Mental DMG | Resolved |
| cognitiveDmg | `cognitiveDmg` | Mental DMG | Resolved |
| Crit Chance | `critRate` | CRIT Rate | Resolved |
| Crit Damage | `critDmg` | CRIT DMG | Resolved |
| Energy Recharge | `chargeEfficiency` | Charge Efficiency | Resolved |
| Cosmos Damage | `cosmosDmg` | Cosmos DMG | Resolved |

Unknown stat key handling: unresolved keys do not crash the app. The alias helper returns the raw key and emits a dev warning with context.

## Workspace-Visible Cartridge Audit

This table is based on source-visible merged data without the user's private browser localStorage overrides.

| Cartridge | Compatible module shape IDs | Verified status visible in workspace | All refs valid | 2-piece direct stat effect | Normalized stat key | User-facing stat label | 4-piece effect | Alias used | Unresolved stat keys |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Lost Radiance | `type-ii-horizontal`, `type-ii-vertical`, `type-iii-horizontal`, `type-iii-vertical` | Seed: `missing-compatible-shapes`; admin override not workspace-visible | Yes | Cosmos DMG +10% | `cosmosDmg` | Cosmos DMG | Conditional enemy DEF ignore; not auto-applied | No | None |
| Fireflies and the Forest | `type-ii-horizontal`, `type-ii-vertical`, `type-iii-horizontal`, `type-iii-vertical` | Seed: `missing-compatible-shapes`; admin override not workspace-visible | Yes | Anima DMG +10% | `animaDmg` | Anima DMG | Conditional CRIT DMG; not auto-applied | No | None |
| Crimson: Twin Butterflies | `type-ii-horizontal`, `type-ii-vertical`, `type-iii-horizontal`, `type-iii-vertical` | Seed: `missing-compatible-shapes`; admin override not workspace-visible | Yes | Incantation DMG +10% | `incantationDmg` | Incantation DMG | Conditional ATK%; not auto-applied | No | None |
| Diabolos | `type-ii-horizontal`, `type-ii-vertical`, `type-iii-horizontal`, `type-iii-vertical` | Seed: `missing-compatible-shapes`; admin override not workspace-visible | Yes | Chaos DMG +10% | `chaosDmg` | Chaos DMG | Enemy modifier; not auto-applied | No | None |
| Devil's Blood: Curse | `type-ii-horizontal`, `type-ii-vertical`, `type-iii-horizontal`, `type-iii-vertical` | Seed: `missing-compatible-shapes`; admin override not workspace-visible | Yes | Psyche DMG +10% | `psycheDmg` | Psyche DMG | Direct DMG Bonus + conditional DMG Bonus | No | None |
| Street Boxer | `type-ii-horizontal`, `type-ii-vertical`, `type-iii-horizontal`, `type-iii-vertical` | Seed: `missing-compatible-shapes`; admin override not workspace-visible | Yes | Lakshana DMG +10% | `lakshanaDmg` | Lakshana DMG | Direct CRIT Rate + conditional note | No | None |
| Kingdom's Guard | `type-ii-horizontal`, `type-ii-vertical`, `type-iii-horizontal`, `type-iii-vertical` | Seed: `missing-compatible-shapes`; admin override not workspace-visible | Yes | DEF +15% | `defPercent` | DEF% | Direct Shield Bonus | No | None |
| Shadow Creed | `type-ii-horizontal`, `type-ii-vertical`, `type-iii-horizontal`, `type-iii-vertical` | Seed: `missing-compatible-shapes`; admin override not workspace-visible | Yes | ATK +10% | `atkPercent` | ATK% | Conditional ATK%; not auto-applied | No | None |
| Thea's Night Tavern | `type-ii-horizontal`, `type-ii-vertical`, `type-iii-horizontal`, `type-iii-vertical` | Seed: `missing-compatible-shapes`; admin override not workspace-visible | Yes | HP +10% | `hpPercent` | HP% | Direct Healing Bonus | No | None |
| Tiny Big Adventure | `type-ii-horizontal`, `type-ii-vertical`, `type-iii-horizontal`, `type-iii-vertical` | Seed: `missing-compatible-shapes`; admin override not workspace-visible | Yes | HP +10% | `hpPercent` | HP% | Conditional HP%; not auto-applied | No | None |
| Speedy Hedgehog | `type-ii-horizontal`, `type-ii-vertical`, `type-iii-horizontal`, `type-iii-vertical` | Seed: `missing-compatible-shapes`; admin override not workspace-visible | Yes | Charge Efficiency +12% | `chargeEfficiency` | Charge Efficiency | Team ATK%; not auto-applied | No | None |
| Quiet Manor | `type-ii-horizontal`, `type-ii-vertical`, `type-iii-horizontal`, `type-iii-vertical` | Seed: `missing-compatible-shapes`; admin override not workspace-visible | Yes | Mental DMG +10% | `cognitiveDmg` | Mental DMG | Conditional Mental DMG; not auto-applied | Yes, Mental/Cognitive terminology resolves to `cognitiveDmg` | None |

## Validation Results

| Test | Result |
| --- | --- |
| Quiet Manor + 2 matching required modules | Passed against source-visible merged data. `cognitiveDmg` / Mental DMG becomes +10. |
| Quiet Manor after removing one required module | Passed. Mental DMG returns to 0. |
| Old data using `cognitiveDmg` | Passed. Still resolves to canonical `cognitiveDmg`. |
| New data using `mentalDmg` or `Mental DMG` | Passed. Resolves to canonical `cognitiveDmg`. |
| Fireflies and the Forest | Passed. Anima DMG +10 still applies. |
| Other direct 2-piece bonuses | Passed for Cosmos, Incantation, Chaos, Psyche, Lakshana, ATK%, DEF%, HP%, and Charge Efficiency normalization. |

## Manual Admin Override Verification Status

The exact browser-local manual entries for all 12 cartridges were not read by this workspace session, because doing so would require either:

1. an exported Admin Data JSON from the browser where the entries were made, or
2. controlled access to the exact browser profile containing `nte.admin.cartridges`.

No admin override was reset, overwritten, or edited during this audit.

To verify the exact manually entered shapes, export Admin Data from Admin Overview and inspect `cartridges[*].compatibleModuleShapeIds` / `compatibleModules`. The expected status for each manually verified cartridge is:

- `compatibleModulesVerified: true`
- `dataStatus: "admin-verified-compatible-shapes"`
- every `moduleShapeId` exists in `src/data/moduleCatalog.js`
