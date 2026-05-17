# Build Planner Calculation System Audit

Date: 2026-05-15

## Data Sources

| Feature | Source file | Structured? | Used by calculator? | Notes |
|---|---|---:|---:|---|
| Characters | `src/data/characters.js`, `src/data/characters/*` | Partial | Yes | Base stats and `buildTraits` are structured. Some character passives remain descriptive. |
| Weapons / arcs | `src/data/weapons.js` | Yes | Yes | Selected weapon only. Recommendations do not count. |
| Cartridges | `src/data/cartridges.js` | Yes | Yes | Main/sub stats, compatible shapes, and structured set effects are normalized here. |
| Module shapes | `src/data/moduleCatalog.js` | Yes | Yes | Required set pieces only count if shape IDs resolve to real catalog shapes. |
| Module stats | `src/data/modulePieces.js` | Yes | Yes | Placed module objects add fixed stats and selected sub stats. |
| Character console traits | Character data, currently Nanally `buildTraits` | Yes | Yes | Counts valid placed module objects by module type. |
| Set bonuses | `src/data/cartridges.js` | Yes | Yes | Structured effects are preferred. Text parsing remains fallback for legacy/admin data. |
| Conditional set effects | `src/data/cartridges.js` | Yes | Display/source only | Returned in `conditionalEffects`; not added to final stats. |
| Esper Cycles | `src/data/esperCycles.js` | Yes | Source only | Active cycles are detected and effects are represented, but stat math is not implemented. |
| Preview Stats | `src/utils/buildCalculator.js` | Yes | Yes | Single calculation output for the Build Planner panel. |

## Calculation Pipeline

The central calculator is `src/utils/buildCalculator.js::calculateBuildStats`.

Order:

1. Base character stats at selected level.
2. Selected weapon stats.
3. Selected cartridge main stat and sub stats.
4. Valid placed module fixed stats and sub stats.
5. Active direct cartridge set bonuses.
6. Character build traits / console traits.
7. Explicit auto-applied team/cycle effects, when implemented.
8. Final Preview Stats.

Displayed only:

- Conditional cartridge effects.
- Enemy modifiers such as DEF/RES ignore.
- Esper Cycle effects without implemented stat math.
- Recommended weapons/cartridges/modules until selected or placed.

## Structured Effects Status

| Cartridge | Real compatible shape IDs? | Structured 2-piece? | Structured 4-piece? | Direct effects | Conditional effects | Incomplete data |
|---|---:|---:|---:|---|---|---|
| Lost Radiance | Yes | Yes | Yes | Cosmos DMG +10% | DEF ignore after Ultimate | `missing-compatible-shapes` |
| Fireflies and the Forest | Yes | Yes | Yes | Anima DMG +10% | Crit DMG stacks after team Anima damage | `missing-compatible-shapes` |
| Crimson: Twin Butterflies | Yes | Yes | Yes | Incantation DMG +10% | ATK% stacks after team Incantation damage | `missing-compatible-shapes` |
| Diabolos | Yes | Yes | Yes | Chaos DMG +10% | Chaos RES ignore / reaction condition | `missing-compatible-shapes` |
| Devil's Blood: Curse | Yes | Yes | Yes | Psyche DMG +10%; DMG +18% | Extra DMG against Nova/Stain targets | `missing-compatible-shapes` |
| Street Boxer | Yes | Yes | Yes | Lakshana DMG +10%; Crit Rate +14% | Remora/Stain wording flagged; no extra stat applied | `missing-compatible-shapes` |
| Kingdom's Guard | Yes | Yes | Yes | DEF +15%; Shield Bonus +20% | None | `missing-compatible-shapes` |
| Shadow Creed | Yes | Yes | Yes | ATK +10% | ATK% after Skill | `missing-compatible-shapes` |
| Thea's Night Tavern | Yes | Yes | Yes | HP +10%; Healing Bonus +20% | None | `missing-compatible-shapes` |
| Tiny Big Adventure | Yes | Yes | Yes | HP +10% | HP% stacks after taking damage | `missing-compatible-shapes` |
| Speedy Hedgehog | Yes | Yes | Yes | Charge Efficiency +12% | Team ATK% after Ultimate | `missing-compatible-shapes` |
| Quiet Manor | Yes | Yes | Yes | Cognitive DMG +10% | Cognitive DMG stacks after Basic Attack | `missing-compatible-shapes` |

## Stat Coverage

| Stat | Calculated? | Sources | Conditional support | Known issues |
|---|---:|---|---|---|
| HP | Yes | Character, cartridge/module flat HP | Conditional records only | Percent ordering is sequential. |
| HP% | Yes | Cartridge set effects, cartridge/module stats | Conditional records only | Applied into HP immediately. |
| ATK | Yes | Character, weapon, cartridge/module flat ATK | Conditional records only | Percent ordering is sequential. |
| ATK% | Yes | Weapon, set effects, cartridge/module stats | Conditional records only | Team-wide conditional ATK is not auto-applied. |
| DEF | Yes | Character, cartridge/module flat DEF | Conditional records only | Percent ordering is sequential. |
| DEF% | Yes | Cartridge set effects, cartridge/module stats | Conditional records only | Enemy DEF ignore is not a Preview Stat. |
| Crit Rate | Yes | Character, weapon, cartridge/module stats, Nanally trait | Conditional records only | Street Boxer wording needs source verification. |
| Crit DMG | Yes | Character, weapon, cartridge/module stats | Conditional records only | Fireflies 4-piece is listed but not auto-applied. |
| Charge Efficiency | Yes | Weapon, cartridge stats, Speedy 2-piece | Conditional records only | No cycle energy math yet. |
| Essence | Yes | Character fallback, cartridge/module stats | Conditional records only | Registry uses Essentia alias. |
| Destruction Intensity | Yes | Cartridge/module stats | Conditional records only | Enemy destruction reduction is not a Preview Stat. |
| Damage Bonus | Yes | Cartridge/module stats, direct set effects | Conditional records only | Conditional target-state bonuses are not auto-applied. |
| Cosmos DMG | Yes | Cartridge stats, Lost Radiance 2-piece | Conditional records only | Requires valid set pieces. |
| Anima DMG | Yes | Cartridge stats, Fireflies 2-piece | Conditional records only | Verified +10% when active. |
| Incantation DMG | Yes | Cartridge stats, Crimson 2-piece | Conditional records only | Requires valid set pieces. |
| Chaos DMG | Yes | Cartridge stats, Diabolos 2-piece | Conditional records only | RES ignore remains non-stat effect. |
| Psyche DMG | Yes | Cartridge stats, Devil's Blood 2-piece | Conditional records only | Requires valid set pieces. |
| Lakshana DMG | Yes | Cartridge stats, Street Boxer 2-piece | Conditional records only | Requires valid set pieces. |
| Cognitive DMG | Yes | Cartridge stats, Quiet Manor 2-piece | Conditional records only | Seed text says Mental; normalized to Cognitive. |

## Known Limitations

- Seed cartridge shape IDs are resolvable, but the exact per-cartridge screenshot shape requirements still need verification; seed cartridges remain marked `missing-compatible-shapes`.
- Conditional effects are structured and surfaced in calculation sources, but there is no battle-state toggle system yet.
- Enemy DEF/RES ignore and target received-damage modifiers are not Preview Stats and are not auto-applied.
- Esper Cycle effects have structured metadata and active-cycle detection, but no final-stat math is implemented.
- Text parsing remains only as a fallback for older/admin data without structured effects.

## Manual Test Results

| Test | Result |
|---|---|
| 1. Nanally only | PASS: HP 15998, Crit Rate 5%. |
| 2. Nanally + weapon | PASS: selected Ready-Ready increased ATK and Crit Rate. |
| 3. Nanally + Fireflies with Anima DMG main stat | PASS: Anima DMG 37.5%. |
| 4. Nanally + cartridge DEF sub stat | PASS: DEF increased from 909 to 989. |
| 5. Fireflies + 2 correct required modules | PASS: 2-piece active, Anima DMG +10%. |
| 6. Remove one required module | PASS: 2-piece inactive, Anima DMG returned to 0%. |
| 7. Fireflies + 4 correct required modules | PASS: 4-piece active; conditional Fireflies effect listed, not auto-applied. |
| 8. Nanally + one Type II module | PASS: trait x1, Crit Rate +6%. |
| 9. Nanally + two Type II module objects | PASS: trait x2, Crit Rate +12%. |
| 10. Nanally + one Type III module | PASS: trait x0, no Crit Rate trait bonus. |
| 11. Move one Type II module | PASS: placed module count stayed 1, trait count stayed 1. |
| 12. Delete module | PASS: placed module count and trait count returned to 0. |
| 13. Clear board | PASS: no set bonus, no module trait bonus, no stale stats. |
| 14. Team cycle with incomplete implementation | PASS: active cycles returned as informational/conditional; no fake stat bonus applied. |
