# Nanally Canonical Adapter Dry Run

Date: 2026-05-16

Input:

- `data-entry/characters/nanally.character-data.template.json`

Adapter:

- `src/data/characterCanonicalAdapter.js`

This was a dry run only. It did not import Nanally into production data, did not modify `src/data/characters/nanally.js`, and did not touch admin localStorage.

## Parse Result

The adapter can parse the Nanally canonical template.

Dry-run summary:

| Check | Result |
|---|---:|
| Critical errors | 0 |
| Warnings | 8 |
| Adapted character id | `nanally` |
| Adapted character name | `Nanally` |
| Exact level stat rows | 80 |
| Adapted ability records | 15 |
| Held conditional effects | 7 |

## Mapped Fields

| Canonical section | Current app shape mapping |
|---|---|
| `id` / `identity.name` | `id`, `slug`, `name` |
| `identity.title` | `shortDescription`, `profileText`, overview `At a glance` |
| `identity.rarity` | `rarity` |
| `identity.element` | `element` |
| `identity.arcType` | `arcType` |
| `identity.roles` / `identity.tags` | `roles`, `tags` |
| `identity.faction` | `faction`, overview identity block |
| `identity.birthday` | `birthday`, overview identity block |
| `identity.esperAbility` | `esperAbility`, overview identity block |
| `identity.releaseStatus` / `identity.version` | `releaseStatus`, `versionLabel` |
| `media.portraitImageUrl` | `portraitImageUrl` |
| `media.cardImageUrl` / `fullBodyImageUrl` | preserved as `cardImageUrl`, `fullBodyImageUrl` |
| `media.skins` / `voiceLines` | preserved as future arrays |
| `voiceActors` | current `voiceActors: [{ lang, name, sourceStatus }]` |
| `stats.levelStats` | `levelStats.mode: "exact"`, `rows`, and `keyframes` for current stat readers |
| `stats.growthNotes` / `statSourceStatus` | preserved under `levelStats` metadata |
| `skills[].attributesByLevel` | preserved, plus numeric levels converted to current `attributeLevels` |
| `passives` | preserved as `passives`, also adapted into `skills` with type `Passive` |
| `lifeSkills` | preserved as `lifeSkills`, also adapted into `skills` with type `Life Skill` |
| `awakenings` | current `awakenings`, also adapted into `skills` with type `Awakening` |
| `awakeningBonuses` | current `breakthroughs`, also adapted into `skills` with type `Breakthrough` |
| `materials.ascensionMaterials` | current `materials.items` plus `currencyCost`; canonical material groups preserved |
| `materials.skillMaterials` | skill `upgradeMaterials` when skills reference `materials.skillMaterials` |
| `lore` | current overview blocks plus preserved `lore` object |
| `build` | current `build.recommendedWeapons`, `recommendedCartridges`, `mainStats`, `subStats`, `notes` |
| `buildPlannerIntegration.activeTraits` | current `buildTraits` and `consoleTrait` when compatible |
| `buildPlannerIntegration.conditionalEffects` | preserved under `buildPlannerIntegration.conditionalEffects` |

## Validation Warnings

Warnings do not block dry-run import. They mark data that should remain visibly unverified or future-only.

| Code | Warning |
|---|---|
| `unverified_faction` | Faction has verification notes or unverified source status. |
| `partial_combat_stats` | Some level stat rows are missing CRIT Rate or CRIT DMG. |
| `missing_voice_actor_locale` | JP voice actor is missing or needs verification. |
| `missing_voice_actor_locale` | KO voice actor is missing or needs verification. |
| `missing_voice_actor_locale` | CN voice actor is missing or needs verification. |
| `unmapped_skill_attribute_level` | Colucci Secret Skill has nonnumeric attribute level keys preserved but not rendered as level tabs yet. |
| `unmapped_skill_attribute_level` | Colucci Howling Technique has nonnumeric attribute level keys preserved but not rendered as level tabs yet. |
| `unmapped_skill_attribute_level` | Justice from Above has nonnumeric attribute level keys preserved but not rendered as level tabs yet. |

## Character Page Dry Run

If the adapted character were wired into the current app, the Character page/detail data would receive:

- Name: `Nanally`
- Rarity: `S`
- Element: `anima`
- Arc type: `plasma`
- Roles: Damage, Main DPS, Follow-up Attack
- Faction: `Eibon Antique Shop`
- Birthday: `August 20`
- Esper Ability: `Genius Ichi-daime: Earth Flip`
- Profile/title text from the PDF
- Lv.1-Lv.80 exact HP/ATK/DEF rows from the PDF
- CRIT Rate and CRIT DMG left blank/unverified instead of copied from old app data
- Skills, passives, life skill, awakenings, and awakening bonuses in a single current-compatible ability list
- Ascension materials from the PDF, with Beetle Coin mapped as currency cost
- Lore/intel preserved in structured form and summarized into overview blocks

Sparse skill level handling:

- Numeric `attributesByLevel` keys become current `attributeLevels`.
- Missing levels are not generated.
- Nonnumeric or unmapped reference groups are preserved on the skill object but not rendered as fake level tabs.
- `missingLevelBehavior` is set to `data_coming_soon`.

## Build Planner Dry Run

The adapted record would provide:

- Base stat source: exact `stats.levelStats` rows.
- Recommended weapons from site-authored build data:
  - `ready-ready`
  - `fluff-of-fortitude`
  - `raging-flames`
  - `oraora`
  - `song-of-the-whale`
- Recommended cartridges:
  - `fireflies-and-the-forest`
  - `shadow-creed`
  - `lost-radiance`
  - `devils-blood-curse`
- Recommended main stats:
  - `anima_dmg_bonus`
  - `crit_dmg`
  - `atk_percent`
  - `crit_rate`
- Recommended sub stats:
  - `crit_rate`
  - `crit_dmg`
  - `atk_percent`
  - `dmg_bonus`
  - `atk`
- Calculable equipment trait:
  - Type II Specialization, `critRate +6%` per equipped Type II module.

The adapter does not auto-apply battle conditional or awakening-gated effects.

## Held Conditional/Future Data

These effects are preserved for future toggles/calculation but not added to final stats:

- Ichi-daime's Authority: CRIT DMG +30% while authority is active.
- Fair Duel follow-up damage while Nanally is in Ichi-daime's Authority.
- A1 Gang Formation ultimate-energy gain from follow-up attacks.
- A3 Call Me the Boss follow-up damage while authority is active.
- A5 Followers Everywhere ATK stacks, up to 20%.
- Colucci Secrets Part 2 damage dealt +15%, gated behind 6 awakenings.
- Ability modifiers such as Underboss duration/damage changes, retained for a future damage simulator rather than stat totals.

## Needs Manual Verification Before Real Import

- Confirm faction spelling from game UI/source: PDF says `Eibon Antique Shop`.
- Verify JP/KO/CN voice actor names manually because extraction was unreadable or absent.
- Map sparse skill attribute groups to exact levels, especially max/reference groups currently stored as `unmapped_reference_*`.
- Decide whether CRIT Rate/CRIT DMG should be repeated across level rows or stored as separate base combat constants.
- Confirm that the current Build Planner should use PDF Lv.80 HP/ATK/DEF values immediately when real import happens.
- Add UI support for canonical `attributesByLevel` if full Lv.1-Lv.13 disabled tabs are desired.

## Import Safety

Current app data remains untouched.

The adapter is ready for a controlled import path, but the real import should wait until:

1. A loader is added for canonical JSON files.
2. Current character normalization accepts/adapts canonical records intentionally.
3. Sparse skill tabs are supported in UI if needed.
4. Manual verification items above are resolved or marked as intentionally pending.
