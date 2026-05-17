# Nanally Full Data Fill Report

Date: 2026-05-16

## Scope

Nanally only. No global styling, SQL migration, cartridges, weapons, modules, vehicles, news, codes, admin localStorage, or other character imports were changed.

## Files Changed

| File | Change |
| --- | --- |
| `data-entry/characters/nanally.character-data.template.json` | Filled canonical Nanally template from `nanally_character_data_pack.json`, including identity, voice actors, exact Lv.1-Lv.80 HP/ATK/DEF, combat base stat defaults, skill attributes, materials, passives, life skill data, and import readiness notes. |
| `src/data/characterCanonicalAdapter.js` | Added safer canonical normalization for data-pack style fields, string voice actor entries, `amount`/`count` materials, combat base stats, normalized rarity/element/arc type, and cleaner text/attribute handling. |
| `src/data/canonicalCharacters.js` | Preserves existing Nanally site-authored build/team/console guide sections through the loader and marks them `sourceStatus: "site-authored"`. |
| `src/components/CharacterHero.jsx` | Level slider now uses exact canonical keyframes and falls back to separate combat base stats for Crit Rate/Crit DMG instead of showing `-`. |
| `src/pages/CharacterDetailPage.jsx` | Skill attributes now support sparse Lv.1-Lv.13 tabs with missing levels disabled and a clean "Data coming soon" state instead of fake Pending rows. |
| `src/utils/buildCalculator.js` | Build Planner base stats now merge exact level HP/ATK/DEF with separate combat base Crit Rate/Crit DMG defaults. |

## Sections Filled

| Section | Status | Source |
| --- | --- | --- |
| Overview | Filled with Nanally identity, faction, birthday, esper ability, roles, title, and lore/intel preview. | Data pack/PDF canonical template |
| Skills | Filled for Colucci Secret Skill, Colucci Howling Technique, Colucci Ultimate Technique, and Justice from Above. | Data pack plus existing PDF-derived descriptions already in canonical template |
| Skill attributes | Known sparse levels preserved: Basic Lv.13, Howling Lv.1/Lv.6/Lv.13, Ultimate Lv.1/Lv.7/Lv.13, Justice Lv.1/Lv.6/Lv.13. Missing levels disabled. | Data pack |
| Passives | Filled More Than Passionate and Fair Duel, including unlock materials. | Data pack |
| Life Skills | Filled Family Business Lv.1-Lv.5 with effects and materials. | Data pack |
| Awakening | Filled A1-A6 with structural effects preserved. | Canonical PDF template/data pack alignment |
| Breakthrough | Filled Colucci Secrets Part 1 and Part 2. | Canonical PDF template/data pack alignment |
| Materials | Filled ascension, skill, and life skill material names/counts/sources where available. | Data pack |
| Build | Restored recommendations, stat priorities, notes, and skill priority. | Site-authored guide data |
| Teams | Restored Blossom and Hex team recommendations plus synergies. | Site-authored guide data |
| Console | Restored Type II Specialization setup, cartridge recommendation, module layout, and console notes. | Site-authored guide data |
| Lore / Intel | Preserved intel, personal items, stories, and quotes already modeled in the canonical template. | PDF-derived canonical template |
| Skins / Voice Lines | Placeholder arrays preserved. | Future-ready canonical fields |

## Stat Source Confirmation

Nanally level stats now use exact canonical rows:

| Level | HP | ATK | DEF | Crit Rate | Crit DMG |
| --- | ---: | ---: | ---: | ---: | ---: |
| Lv.1 | 1320 | 80 | 75 | 5% | 50% |
| Lv.40 | 5438 | 236 | 309 | 5% | 50% |
| Lv.80 | 9662 | 396 | 549 | 5% | 50% |

Crit Rate and Crit DMG are stored separately as `combatBaseStats` with `sourceStatus: "current-site-default-needs-official-verification"` and do not scale with the level slider.

## Build Planner

- Base Nanally stats come from canonical Lv.1-Lv.80 rows plus combat base defaults.
- Type II Specialization remains calculable from equipped Type II modules:
  - x0 = +0% Crit Rate
  - x1 = +6% Crit Rate
  - x2 = +12% Crit Rate
  - x3 = +18% Crit Rate
  - x4 = +24% Crit Rate
- Conditional effects are preserved and not auto-applied:
  - Ichi-daime's Authority CRIT DMG +30%
  - Followers Everywhere ATK stacks
  - Colucci Secrets Part 2 damage +15%
  - Awakening and battle-state effects

## Remaining Missing / Verification

- JP, KO, and CN voice actor strings are imported but still flagged `needs_manual_verification`.
- Official confirmation is still needed for universal base Crit Rate 5% and Crit DMG 50%.
- Skill levels not present in the data pack remain disabled; no interpolation or fake values were added.
- Exact skins/outfits and voice lines remain future placeholders.
- Build/team/console guide data is preserved as `site-authored` because the data pack does not provide exact replacement IDs/layouts.

## Validation Results

| Test | Result |
| --- | --- |
| Characters page route responds | Pass (`/characters` returned HTTP 200 from preview build) |
| Nanally detail data opens through canonical adapter | Pass |
| Overview canonical identity present | Pass: faction, birthday, esper ability, and roles are populated |
| Skills/passives/life skills/awakening/breakthrough data adapts | Pass |
| Level stats source is canonical/PDF data pack | Pass: 80 rows, Lv.1/Lv.40/Lv.80 checkpoints match |
| Crit Rate / Crit DMG stay 5% / 50% | Pass |
| Materials include names/counts | Pass |
| Build tab data preserved | Pass |
| Teams tab data preserved | Pass |
| Console tab data preserved | Pass |
| Build Planner route responds | Pass (`/build-planner` returned HTTP 200 from preview build) |
| Build Planner base stats | Pass: Lv.80 HP 9662 / ATK 396 / DEF 549 / Crit Rate 5 / Crit DMG 50 |
| Type II trait bonus values | Pass: +0/+6/+12/+18/+24 Crit Rate |
| Other characters untouched | Pass by scope: only Nanally canonical loader/template and shared adapter/render safety changed |

## Build Result

`npm.cmd run build` passed.

Vite still reports the existing large chunk warning after build; no build errors were introduced.
