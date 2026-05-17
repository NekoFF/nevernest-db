# Build Planner Formula Audit Strategy

Date: 2026-05-17

## Current Risk

The Build Planner is useful for local theorycrafting, but formula/value outputs may not always match expected in-game values. It should not be treated as a verified production calculator yet.

This phase does not change the Build Planner runtime behavior. The only frontend change is header copy that labels the planner as a prototype and states that formula outputs still need verification.

## Why Accuracy Matters

Inaccurate calculators hurt trust quickly. Users may spend time or resources based on totals, stat priorities, team assumptions, or module choices. A best-in-class fan database should explain what is verified, what is estimated, and what is still unknown.

## What Needs Verification

- Character base stats by level.
- Weapon/arc stat growth.
- Cartridge rarity and main stat values.
- Module main stat and substat ranges.
- Set bonuses.
- Awakening effects.
- Skill/ability scaling.
- Esper cycle effects.
- Team effects and stacking rules.
- Percent vs flat stat handling.
- Rounding order.
- Caps, minimums, and conditional effects.

## Expected Value Test Plan

1. Inventory every formula and source table used by Build Planner.
2. Create small expected-value fixtures for one simple character/weapon/cartridge/module setup.
3. Add edge fixtures for empty build, max level, mixed flat/percent stats, missing data, and duplicate effects.
4. Compare UI output to calculator output.
5. Add regression tests for each verified formula.
6. Mark unverified formula branches as estimated in UI/docs.

## Rounding And Edge Cases

Document and test:

- Rounding after each step vs final output only.
- Percent display precision.
- Flat stat and percent stat stacking.
- Missing/null stat behavior.
- Unknown sourceStatus behavior.
- Multiple bonuses affecting the same stat.
- Conditional bonuses that are not always active.

## Source/Status Plan

Every formula input should eventually carry:

- sourceStatus
- source notes
- patch/version
- last updated
- verification notes

Formula outputs should inherit the weakest status of their inputs. For example, one `needs_verification` module stat should make the resulting total at least `needs_verification`.

## UI Copy Recommendations

Use labels such as:

- `Prototype`
- `Estimated`
- `Needs verification`
- `Source pending`
- `Verified formula`

Avoid:

- “Best”
- “Official”
- “Accurate”
- “Optimal”

unless the underlying data and formula are source-backed and tested.

## Future Phases

| Phase | Goal | Output |
| --- | --- | --- |
| Formula inventory | Map all current calculation paths | `BUILD_PLANNER_FORMULA_INVENTORY.md` |
| Expected fixtures | Define known input/output examples | test fixture JSON |
| Damage/stat model tests | Add automated calculator tests | passing test suite |
| UI explanation | Explain what each total includes | user-facing calculation notes |
| Verified release | Mark tested formulas as verified | documented calculator status |

## Current Decision

Keep the planner available as a prototype/local tool. Do not deeply rewrite formulas until the inventory, fixtures, and sourceStatus model are ready.
