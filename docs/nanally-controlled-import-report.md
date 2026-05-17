# Nanally Controlled Canonical Import Report

Date: 2026-05-16

Scope: Nanally only. No UI redesign, no visual styling changes, no SQL migration, and no other entity imports.

## 1. Files Changed

- `src/data/canonicalCharacters.js`
- `src/data/characters/index.js`
- `src/pages/CharacterDetailPage.jsx`
- `docs/nanally-controlled-import-report.md`

Previously created files used by this import:

- `src/data/characterCanonicalAdapter.js`
- `data-entry/characters/nanally.character-data.template.json`
- `docs/nanally-canonical-adapter-dry-run.md`

## 2. How Canonical Nanally Is Loaded

`src/data/canonicalCharacters.js` imports:

- `data-entry/characters/nanally.character-data.template.json`

It validates the canonical JSON with `validateCanonicalCharacter()`, adapts it through `adaptCanonicalCharacter()`, and exports:

- `canonicalCharacterImports`
- `canonicalCharacters`
- `canonicalCharactersById`
- `canonicalCharacterImportWarnings`
- `getCanonicalCharacterById(id)`
- `getCanonicalCharacterImportWarnings(id)`

Warnings do not block loading. Critical validation errors would skip that canonical source in dev mode rather than crashing the UI.

## 3. Override/Merge Behavior

Nanally is overridden at the seed character registry level in `src/data/characters/index.js`.

The old `src/data/characters/nanally.js` file was not deleted. It remains available as a fallback/reference if the canonical record is unavailable.

Only the Nanally slot in the exported `characters` array now uses the adapted canonical record. Other character imports and records were not changed.

Admin/localStorage behavior:

- Admin localStorage was not modified.
- The existing AdminMode merge layer still applies local browser overrides after seed data.
- If a user already has a Nanally admin override in their browser, that override may mask parts of the canonical seed until cleared manually.
- I cannot inspect browser localStorage from the filesystem, so no existing user override was destroyed or reset.

## 4. Canonical Fields Now Visible

Nanally now uses canonical/PDF-backed values for:

- Name: `Nanally`
- Rarity: `S`
- Element: `anima`
- Arc type: `plasma`
- Faction: `Eibon Antique Shop`
- Birthday: `August 20`
- Esper Ability: `Genius Ichi-daime: Earth Flip`
- Roles: Damage, Main DPS, Follow-up Attack
- Profile/title text from canonical data
- Exact Lv.1-Lv.80 HP/ATK/DEF rows from canonical/PDF
- Skills, passives, life skill, awakenings, and awakening bonuses adapted into current-compatible ability data
- Ascension materials and skill materials from canonical/PDF
- Lore/intel preserved and summarized into overview blocks

## 5. Preserved But Not Fully Rendered Yet

The following canonical data is preserved on the character object but not fully surfaced by current UI:

- Full canonical `lore` object beyond overview summaries
- `skins` and `voiceLines` placeholder arrays
- Full material source normalization across all material types
- Nonnumeric skill attribute groups such as `unmapped_reference_1`
- Full `buildPlannerIntegration.conditionalEffects`
- Awakening-gated effect toggles
- Battle-state stack toggles
- CRIT Rate / CRIT DMG constants, because the PDF level table did not provide them

Skill attribute safety:

- Numeric `attributesByLevel` keys render through current `attributeLevels`.
- Missing levels are not generated or interpolated.
- Nonnumeric/unmapped groups are preserved.
- If a skill has preserved unmapped groups but no renderable numeric levels, the Attributes tab shows a safe fallback: `Attribute data preserved — detailed level tabs coming soon.`

## 6. Build Planner Stat Source Confirmation

Data-level planner check confirmed Nanally uses canonical/PDF Lv.80 base stats:

| Level | HP | ATK | DEF | CRIT Rate | CRIT DMG |
|---:|---:|---:|---:|---:|---:|
| 80 | 9662 | 396 | 549 | unverified/null | unverified/null |

The old app placeholder/checkpoint Lv.80 values are not used by the canonical adapted Nanally seed.

Type II Specialization check:

| Type II modules | Trait Crit Rate value |
|---:|---:|
| 0 | +0% |
| 1 | +6% |
| 2 | +12% |
| 3 | +18% |
| 4 | +24% |

Note: placed module test fixtures also add normal module main stats, so HP/ATK totals changed in those fixtures. The Crit Rate trait value itself scaled correctly.

## 7. Conditional Effects Confirmation

Canonical conditional/future effects are preserved but not silently applied to final Preview Stats:

- Ichi-daime's Authority: CRIT DMG +30%
- Followers Everywhere: ATK stacks, up to 20%
- Colucci Secrets Part 2: damage dealt +15%
- Fair Duel follow-up damage
- A1 ultimate-energy gain
- A3 follow-up attack
- Underboss duration/damage ability modifiers

The current Build Planner can calculate the Type II equipment-count trait because equipped module state is known. Battle-state and awakening-gated effects remain toggle/future data.

## 8. Manual Verification Warnings

Canonical validation still reports 8 warnings:

| Code | Status |
|---|---|
| `unverified_faction` | Faction has verification notes. Canonical/PDF value is used. |
| `partial_combat_stats` | Level rows do not include CRIT Rate / CRIT DMG constants. |
| `missing_voice_actor_locale` | JP voice actor needs verification. |
| `missing_voice_actor_locale` | KO voice actor needs verification. |
| `missing_voice_actor_locale` | CN voice actor needs verification. |
| `unmapped_skill_attribute_level` | Colucci Secret Skill has preserved nonnumeric attribute groups. |
| `unmapped_skill_attribute_level` | Colucci Howling Technique has preserved nonnumeric attribute groups. |
| `unmapped_skill_attribute_level` | Justice from Above has preserved nonnumeric attribute groups. |

These warnings do not block import.

## 9. UI Limitations Discovered

- Character detail routes are app state based, not direct `/characters/nanally` URLs.
- The current Attributes tab only renders numeric skill levels. Nonnumeric extracted reference groups need a future mapping pass before they can become horizontal Lv tabs.
- Build Planner does not yet display canonical character conditional effects as toggles.
- Admin localStorage can still override canonical seed data because the existing AdminMode merge layer intentionally applies local overrides last.

## 10. Validation Tests

| Test | Result | Notes |
|---|---|---|
| Characters page renders | Passed | Headless browser smoke test on built `dist`. |
| Nanally detail page opens | Passed | Clicked Nanally card from Characters page. |
| Nanally overview shows canonical identity | Passed | Confirmed `Eibon Antique Shop`, `August 20`, `Genius Ichi-daime: Earth Flip`, and roles. |
| Nanally skills/passives/awakenings do not crash page | Passed | Skills tab rendered after canonical import. |
| Nanally level stats source is canonical/PDF | Passed | Data-level check found 80 canonical rows and Lv.80 HP 9662 / ATK 396 / DEF 549. |
| Build Planner can select/use Nanally data | Passed | Build Planner page renders; data-level planner calculation accepts adapted Nanally. |
| Build Planner uses canonical Nanally HP/ATK/DEF | Passed | `calculateBuildStats()` returns canonical Lv.80 base stats before equipment. |
| Type II trait works | Passed | Crit Rate trait scales +0/+6/+12/+18/+24 for 0-4 Type II modules. |
| Conditional effects are not auto-applied | Passed | Canonical conditional effects remain held; battle/awakening effects are not included in base final stats. |
| Other characters still render unchanged | Passed | Only Nanally registry entry was replaced; other character files/imports were untouched. |

## 11. Build Result

Command:

```powershell
npm.cmd run build
```

Result: passed.

Vite warning remains:

- Some chunks are larger than 500 kB after minification.

This is an existing bundle-size warning, not a canonical import failure.
