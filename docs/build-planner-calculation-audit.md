# Build Planner Calculation Audit

Date: 2026-05-15

## Current Data Flow

Build Planner uses the active build slot as the calculation root:

`character data -> active build slot -> weapon level/stat data -> cartridge main/sub stats -> valid placed modules -> active cartridge set bonuses -> character console trait -> team/esper effects -> Preview Stats`

The calculation entry point is `src/utils/buildCalculator.js::calculateBuildStats`. The Build Planner page passes merged admin-aware character, weapon, and cartridge lists into that calculator.

## Source Of Truth

| Feature | Source file / data source | Used by Build Planner? | Notes |
|---|---|---:|---|
| Characters | `src/data/characters.js` plus character detail files | Yes | Build Planner receives `mergedCharacters` from AdminMode, same source used by character pages. |
| Character base stats | `character.levelStats` or fallback `character.stats` | Yes | Interpolates `levelStats.keyframes` when present; falls back to static stats. |
| Weapons / arcs | `src/data/weapons.js` plus admin overrides | Yes | Selected weapon only; recommendations are not counted. |
| Weapon level scaling | `weapon.growthScaling` | Yes | Uses nearest row at or below selected level. |
| Cartridges | `src/data/cartridges.js` plus admin overrides | Yes | Main/sub stat values come from cartridge stat tables. |
| Cartridge set bonuses | `cartridge.bonuses` and compatible shape IDs | Partially | Direct stat bonuses now calculate when set pieces are active. Conditional effects remain informational. |
| Modules | `src/data/modulePieces.js` | Yes | Placed module fixed main stats and selected sub stats calculate. |
| Module shapes | `src/data/moduleCatalog.js` | Yes | Used for board cells and required shape matching. |
| Character console traits | `character.consoleTrait` | Yes | Counts valid placed module objects by type, not cells. |
| Preview stats | `src/utils/buildCalculator.js` | Yes | Panel renders `PLANNER_STAT_DEFS`. |
| Team cycle effects | `buildState.teamEffects`, `buildState.esperCycles` | Placeholder/partial | Calculator can merge supplied effects, but planner UI does not fully author these effects yet. |
| Esper Cycle visual | `src/data/esperCycles.js`, Build Planner page | Visual/partial | Preview visualization exists; full stat contribution is not complete. |
| Draft save/import/export | Build Planner localStorage/export helpers | Yes | Stores/restores raw planner state. Export image uses current calculation plus separate visual set-progress summary. |

## Calculation Checklist

| Stat | Calculated? | Sources | Live update? | Known bug/risk |
|---|---:|---|---:|---|
| HP | Yes | Character base, weapon/cartridge/module flat HP, HP% through `applyTypedStat`, direct set bonuses | Yes | Percent order depends on current sequential application. |
| ATK | Yes | Character base, weapon ATK, cartridge/module ATK, ATK% | Yes | Same percent-order note as HP. |
| DEF | Yes | Character base, cartridge/module DEF, DEF% | Yes | Same percent-order note as HP. |
| Crit Rate | Yes | Character base, weapon, cartridge/module sub stats, Nanally console trait | Yes | Fixed module type parser so Type III is not counted as Type II. |
| Crit DMG | Yes | Character base, weapon, cartridge/module stats | Yes | Conditional set effects are not auto-applied. |
| Charge Efficiency | Yes | Weapon, cartridge main stats | Yes | No character base examples verified beyond data availability. |
| Essence | Yes | Character/base fallback and cartridge/module stats via `essentia` alias | Yes | UI label uses Essence while stat registry uses Essentia. |
| Destruction Intensity | Yes | Cartridge/module stats via `break_intensity` alias | Yes | Label differs from registry Break Intensity. |
| Damage Bonus | Yes | Cartridge/module stats and direct set bonus text | Yes | Conditional text is intentionally skipped. |
| Cosmos DMG | Yes | Cartridge main stat and direct set bonus text | Yes | Requires valid active set matching for set bonuses. |
| Anima DMG | Yes | Cartridge main stat and direct set bonus text | Yes | Fireflies 2-piece direct bonus now applies when active. |
| Incantation DMG | Yes | Cartridge main stat and direct set bonus text | Yes | Requires valid active set matching. |
| Chaos DMG | Yes | Cartridge main stat and direct set bonus text | Yes | Requires valid active set matching. |
| Psyche DMG | Yes | Cartridge main stat and direct set bonus text | Yes | Requires valid active set matching. |
| Lakshana DMG | Yes | Cartridge main stat and direct set bonus text | Yes | Requires valid active set matching. |
| Cognitive DMG | Yes | Cartridge main stat and direct set bonus text (`Cognitive` or `Mental`) | Yes | Text/data sometimes says Mental; mapped to Cognitive. |

## Known Bugs Found

### Active set bonus visual state was disconnected from Preview Stats

- Reproduction: Select a cartridge with valid required module shape IDs, activate its 2-piece bonus, and check Preview Stats.
- Expected: Direct 2-piece stat text such as `Anima DMG +10%` adds to the relevant stat.
- Actual before fix: UI showed 2-piece active, but `animaDmg` stayed `0`.
- Cause: `calculateBuildStats` only applied `slot.activeSets`; Modules tab set activation was visual-only and never populated `slot.activeSets`.
- Files/functions: `src/utils/buildCalculator.js::calculateBuildStats`, `applySetBonuses`.
- Fix: `calculateBuildStats` now derives active cartridge set bonuses from selected cartridge + valid placed modules + cartridge required shape IDs, then applies direct stat bonuses generically.

### Current cartridge seed data lacks real compatible shape IDs

- Reproduction: Inspect `Fireflies and the Forest` in seed cartridge data.
- Expected: Compatible module shape IDs resolve to `type-...` module shape IDs.
- Actual: Seed compatible modules normalize placeholder `module_shape_1` values to empty IDs.
- Impact: The calculation fix works for valid shape IDs, including admin-populated data, but seed cartridge set activation cannot calculate until real shape IDs are populated.
- Suggested fix: Populate `compatibleModules[].moduleShapeId` with real IDs from `src/data/moduleCatalog.js`.

### Conditional set bonuses are not automatically calculated

- Example: Text with `when`, `after`, `stacks`, timed effects, or other combat conditions.
- Expected: Display active/informational unless combat condition controls exist.
- Actual: Conditional direct stat changes are intentionally skipped.
- Suggested fix: Add explicit structured conditional toggles later instead of parsing assumptions from text.

## Manual Test Matrix

| Test | Setup | Expected |
|---|---|---|
| A | Character only selected | Preview Stats equals character base stats at selected level. |
| B | Character + weapon selected | Weapon main/sub stats are added; weapon level changes stats when growth data exists. |
| C | Character + cartridge main stat selected | Main stat applies once using selected rarity value. |
| D | Character + cartridge sub stat selected | Sub stat applies once using selected rarity value. |
| E | Fireflies and the Forest + 2 required modules | 2-piece active; Anima DMG +10% when Fireflies has valid required shape IDs. |
| F | Fireflies and the Forest + 4 required modules | 2-piece and 4-piece active; direct calculable stats apply, conditional text remains informational. |
| G | Nanally + one Type II module | Type II Specialization x1; Crit Rate +6%. |
| H | Nanally + two Type II modules | Type II Specialization x2; Crit Rate +12%. |
| I | Nanally + one Type III module | Type II Specialization x0; no Crit Rate bonus. |
| J | Move a module on the board | Placed module count unchanged; stats unchanged unless valid set shape matching changes. |
| K | Delete a module | Placed module count decreases; set and trait bonuses update; no stale stats. |
| L | Clear board | Placed modules 0; set bonuses inactive; trait x0; module-derived Preview Stats removed. |

## Implementation Notes

- Direct set bonus parser supports HP, HP%, ATK, ATK%, DEF, DEF%, Crit Rate, Crit DMG, Charge Efficiency, Damage Bonus, element DMG bonuses, Healing Bonus, and Shield Bonus when the text is an unconditional direct stat bonus.
- Conditional text is deliberately not auto-applied.
- Build Planner still needs structured effect records for long-term reliability; parsing text is a bridge for MVP data.
