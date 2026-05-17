# Character Data Model Audit

Date: 2026-05-16

Scope: current static character files, admin overrides, Character detail page, Build Planner, and Nanally reference PDF (`Document 7.pdf`). This is a schema/data architecture audit only. No UI redesign, no SQL migration, and no mass character data overwrite is included.

## Current Storage

Character data currently lives in three layers:

1. Static roster/detail modules under `src/data/characters/*.js`, merged by `src/data/characters/index.js`.
2. Client normalization in `src/data/characterSchema.js`, `src/data/skillBlocks.js`, `src/data/materialBlocks.js`, and `src/data/buildBlocks.js`.
3. Admin local overrides in browser `localStorage`, managed by `src/admin/adminStorage.js` and surfaced through `src/admin/AdminModeContext.jsx`.

Nanally is the closest thing to a full reference record today (`src/data/characters/nanally.js`), but even Nanally mixes canonical data, display text, build notes, console layout, and Build Planner calculation hooks in one JavaScript object.

## Current Field Audit

| Field | Exists now? | Current location | Needed for UI? | Needed for Build Planner? | Needed for SQL later? | Notes |
|---|---:|---|---:|---:|---:|---|
| id | Yes | `nanallyCard`, all card modules | Yes | Yes | Yes | Stable key used by routing, planner slots, and references. |
| name | Yes | Character card objects | Yes | Yes | Yes | Used everywhere. |
| title/tagline | Partial | `shortDescription`, `profileText`, overview text | Yes | No | Yes | Duplicated across short description, profile, and overview. Needs one canonical field plus display blocks. |
| rarity | Yes | Card/detail, admin core editor | Yes | Filter only | Yes | Current values are simple ranks like `S`, `A`, `B`. |
| element | Yes | Card/detail, admin core editor | Yes | Team cycle and damage context | Yes | Used by filters, icons, Build Planner team cycle preview. |
| arcType | Yes | Card/detail, admin core editor | Yes | Weapon/arc matching context | Yes | Stored as lower-case ids such as `plasma`. |
| roles | Yes | Card/detail, filters, admin core editor | Yes | Character selection context | Yes | Role names are free-form-ish and duplicated with `tags`. |
| tags | Yes | Card/detail, filters | Yes | No | Yes | Mostly overlaps roles and advanced filters. Needs taxonomy. |
| faction | Yes | Detail/admin | Yes | No | Yes | Nanally current file says `Elbon Antique Shop`; PDF says `Eibon Antique Shop`, needs verification/correction before import. |
| birthday/birthdate | Yes | Detail/admin | Yes | No | Yes | Current field is `birthday`; PDF label is `Birthdate`. |
| esperAbility | Missing | Not a first-class field | Yes | Possible effects later | Yes | PDF has `Genius Ichi-daime: Earth Flip`; current text only implies it in skills/lore. |
| releaseStatus | Partial | `releaseDate`, `isNew`, `statusBadge`, `showNewBadge` | Yes | No | Yes | Status fields are scattered. |
| version | Partial | `versionLabel`, overview tracker patch strings | Yes | No | Yes | Needs canonical source/update metadata. |
| portraitImageUrl | Yes | Card/admin, asset helper fallback | Yes | Export image | Yes | Current local assets are resolved by name, not stored as stable URLs. |
| cardImageUrl | Missing | Not first-class | Yes | No | Yes | Needed for future API/CDN and cards. |
| fullBodyImageUrl | Partial | `image`, `fullImage`, `profile.image` | Yes | No | Yes | Multiple current aliases should collapse to one media object. |
| voice actors | Partial | `voiceActors` array in Nanally only | Yes | No | Yes | Current shape is `[{ lang, name }]`; target should be keyed by locale (`EN`, `JP`, `KO`, `CN`) with unknown-safe entries. |
| base/display stats | Yes | `stats` strings in detail objects | Yes | Yes fallback | Yes | Display strings duplicate level stats and are easy to drift. |
| level stats | Partial | `levelStats.keyframes` or `level1`/`level90` | Yes | Yes | Yes | Current Build Planner interpolates; Nanally PDF provides exact Lv.1-Lv.80 HP/ATK/DEF. Canonical schema should store exact rows when known. |
| growth notes | Partial | `levelStats.note` | Yes | No | Yes | Good concept, currently embedded under the interpolation model. |
| stat source status | Missing | Not first-class | Admin/debug | Yes | Yes | Needed to distinguish verified, interpolated, estimated, and pending. |
| skills | Yes | `skills` arrays, `skillBlocks` normalizer | Yes | Future | Yes | Current skill data is UI-friendly and JS-only. |
| skill descriptions | Yes | `description` or `descriptionBlocks` | Yes | No | Yes | Normalizer supports both, but canonical source should use `descriptionBlocks`. |
| skill flavor text | Yes | `flavorText` normalized to `quote` | Yes | No | Yes | Current names differ (`flavorText`, `quote`). |
| skill attributes/multipliers | Partial | `skills[].attributes` or `attributeLevels` | Yes | Future damage calcs | Yes | Current rows lack `valueType`, source status, estimated flag, and sparse-level conventions. |
| attributesByLevel | Missing | Not first-class | Yes | Yes later | Yes | Requested canonical shape should preserve sparse known levels by key. |
| knownLevels/maxLevel | Missing | Not first-class | Yes | Yes later | Yes | Current UI only renders known levels, cannot show disabled missing Lv tabs. |
| skill materials | Partial | `skills[].materials` or normalized `upgradeMaterials` | Yes | No | Yes | Nanally current file undercounts versus PDF max-skill totals. Needs source-verified import. |
| passive skills | Partial | `passives` array but not rendered through skill category | Yes | Yes later | Yes | Current `AbilitySection` only filters `character.skills`; standalone `passives` are not shown by that path. |
| passive effects | Partial | Description text only | Yes | Yes | Yes | Effects like CRIT DMG +30% should be structural, not just prose. |
| life skills | Partial | `lifeSkills` array | Yes | No | Yes | Current UI has a `LifeSkills` component but ability tab filters `character.skills`, so standalone life skills are not fully integrated. |
| life skill materials | Missing/partial | Not in current Nanally detail | Yes | No | Yes | PDF includes per-level Fons/Dreamless Seed costs. |
| awakenings | Partial | `awakenings` and `breakthroughs` arrays | Yes | Yes | Yes | Current detail has text-only effects; order mismatch risk exists vs PDF. |
| awakening bonuses | Partial | `breakthroughs` | Yes | Yes | Yes | Should be modeled as bonuses unlocked by awakening count. |
| awakening effects | Missing/partial | Text descriptions only | Yes | Yes | Yes | Needs structural `effects`, `conditionalEffects`, and `affectsBuildPlanner`. |
| character ascension materials | Partial | `materials` object, but Nanally currently only maps skill materials | Yes | No | Yes | PDF includes Nanally ascension totals and sources. |
| material sources | Partial | Material item `sources` arrays | Yes | No | Yes | Sources are duplicated on skill and ascension materials; should normalize to material records. |
| lore/intel | Partial | `overview` blocks only; PDF has full Intel | Yes | No | Yes | Current lore is summarized, not canonical. |
| personal items/stories/quotes | Missing/partial | PDF only | Future | No | Yes | Needs structured lore buckets. |
| skins/outfits | Missing | Not present | Future | No | Yes | Reserve media model. |
| voice lines | Missing | Not present | Future | No | Yes | Reserve localized line model. |
| recommended weapons | Yes | `build.recommendedWeaponIds`, `recommendedWeapons` | Yes | Yes | Yes | Uses weapon ids plus labels/notes; good direction. |
| recommended cartridges | Yes | `build.recommendedCartridges` | Yes | Yes | Yes | Uses cartridge ids plus rarity/priority. |
| recommended stats | Yes | `build.mainStats`, `subStats`, `endgameStats` | Yes | Yes | Yes | Uses stat ids; good SQL-ready shape. |
| recommended teams | Partial | `teams`, `synergies` | Yes | Team context | Yes | Need one canonical relationship model. |
| console setup | Yes | `consoleSetup` | Yes | Yes | Yes | Currently mixes recommendation, layout, and trait display. |
| buildTraits | Partial | `buildTraits`, `consoleTrait` | No direct | Yes | Yes | Build Planner applies `module_type_count` traits automatically. Other passive/awakening effects are not generalized. |
| conditional effects | Partial | Cartridge/cycle conditional source list in calculator | Planner source panel | Yes | Yes | Character-specific conditional effects are not yet modeled or toggled. |
| Build Planner baseStatsSource | Partial | `getBaseCharacterStats()` chooses `levelStats` then `stats` | No | Yes | Yes | Needs explicit source priority and verification flags. |
| admin overrides | Yes | `localStorage` keys in `adminStorage.js` | Admin | Yes indirectly | Temporary | Admin merge allowlist would drop many proposed fields today unless extended. |

## Current Weaknesses

- Character records are JavaScript modules, not portable canonical data files.
- Nanally detail contains good data but it is not consistently canonical: stats, skills, materials, passives, awakenings, console setup, build recommendations, teams, and lore are mixed together.
- `stats` display strings and `levelStats` checkpoints duplicate stat meaning. The Build Planner uses interpolation rather than exact per-level rows when exact rows exist in the PDF.
- Skill attributes are normalized as `attributeLevels`, but the source record still uses `attributes`, and rows only have `label`/`value`.
- The current ability tab filters only `character.skills`; separate `passives`, `lifeSkills`, `awakenings`, and `breakthroughs` are present but not all wired through the same display path.
- Admin character overrides only merge a limited set of fields. Rich canonical fields like `esperAbility`, `voiceActors`, `lore`, `skins`, `voiceLines`, and future planner effects would need an import/normalization layer before admin editing can safely round-trip them.
- Build Planner currently calculates base stats, weapon stats, console main/sub stats, module stats, set bonuses, Nanally-style console trait, and explicit auto-applied team cycle effects. It does not have a general character effect/toggle engine.

## Proposed Canonical Character Schema

The canonical import record should be JSON-safe, SQL-ready, and separable from current UI components. Current client normalizers can later adapt this shape into existing display props without changing styling.

```json
{
  "schemaVersion": 1,
  "id": "nanally",
  "identity": {
    "name": "Nanally",
    "title": "The Ichi-daime of the Coluccis - currently seeking new recruits!",
    "rarity": "S",
    "element": "anima",
    "arcType": "plasma",
    "roles": ["Damage", "Main DPS", "Follow-up Attack"],
    "tags": ["Main DPS", "Damage", "Follow-up Attack"],
    "faction": "Eibon Antique Shop",
    "birthday": "August 20",
    "esperAbility": "Genius Ichi-daime: Earth Flip",
    "releaseStatus": "released",
    "version": null
  },
  "media": {
    "portraitImageUrl": "",
    "cardImageUrl": "",
    "fullBodyImageUrl": "",
    "skins": [],
    "voiceLines": []
  },
  "voiceActors": {
    "EN": { "name": "Brittany Lauda", "sourceStatus": "verified" },
    "JP": { "name": null, "sourceStatus": "needs_verification" },
    "KO": { "name": null, "sourceStatus": "needs_verification" },
    "CN": { "name": null, "sourceStatus": "needs_verification" }
  },
  "stats": {
    "baseStatsSource": "levelStats",
    "statSourceStatus": "verified_from_reference_pdf",
    "growthNotes": "",
    "levelStats": [
      { "level": 1, "hp": 1320, "atk": 80, "def": 75, "critRate": 5, "critDmg": 50 }
    ]
  },
  "skills": [
    {
      "id": "colucci-howling-technique",
      "name": "Colucci Howling Technique",
      "type": "Redirect Skill",
      "icon": "",
      "enabled": true,
      "descriptionBlocks": [],
      "flavorText": "",
      "attributesByLevel": {
        "1": [
          { "label": "Area DMG Ratio", "value": "100% x5", "valueType": "multiplier", "notes": "" }
        ]
      },
      "knownLevels": [1],
      "maxLevel": 13,
      "cooldown": "16s",
      "energyCost": null,
      "cycleEnergy": 11,
      "tags": ["Anima DMG", "Buff", "Mobility"],
      "materials": []
    }
  ],
  "passives": [],
  "lifeSkills": [],
  "awakenings": [],
  "materials": {
    "ascensionMaterials": [],
    "skillMaterials": [],
    "lifeSkillMaterials": [],
    "materialSources": []
  },
  "lore": {
    "intel": [],
    "personalItems": [],
    "stories": [],
    "quotes": []
  },
  "build": {
    "recommendedWeaponIds": [],
    "recommendedCartridgeIds": [],
    "recommendedMainStats": [],
    "recommendedSubStats": [],
    "recommendedTeams": [],
    "buildNotes": []
  },
  "buildPlannerIntegration": {
    "baseStatsSource": "stats.levelStats",
    "activeTraits": [],
    "awakeningsAvailable": [],
    "conditionalEffects": [],
    "calculatedEffects": []
  }
}
```

## Skill Attribute Model

Use `attributesByLevel` as the canonical source. It allows sparse known levels without inventing values.

Rules:

- `knownLevels` lists only levels supported by source data.
- `maxLevel` can be higher than the known levels.
- Missing levels must render as disabled or "Data coming soon".
- Values must not be extrapolated unless `sourceStatus: "estimated"` or `estimated: true` is present on the row.
- Rows should allow `label`, `value`, `valueType`, `notes`, `sourceStatus`, and `estimated`.

Example:

```json
{
  "attributesByLevel": {
    "1": [
      { "label": "Area DMG Ratio", "value": "100% x5", "valueType": "multiplier" },
      { "label": "CRIT DMG Increase", "value": "30%", "valueType": "percent" },
      { "label": "CD", "value": "16s", "valueType": "duration" },
      { "label": "Cycle Energy", "value": "11", "valueType": "energy" }
    ],
    "6": [],
    "13": []
  },
  "knownLevels": [1, 6, 13],
  "maxLevel": 13
}
```

## Build Planner Integration Rules

Character effects should be structural and categorized:

- `always_on`: direct stat effects that are safe to apply automatically.
- `equipment_conditional`: effects that depend on equipped modules, weapons, or cartridges.
- `battle_conditional`: effects that depend on combat state, enemy state, stacks, duration, or rotation.
- `awakening`: effects unlocked by awakening level/count.
- `manual_toggle`: effects the Build Planner can expose as optional toggles.

Nanally examples:

| Effect | Suggested model | Planner behavior |
|---|---|---|
| Ichi-daime's Authority: CRIT DMG +30% | `battle_conditional`, stat `critDmg`, value `30`, trigger `authority_active` | Store, expose toggle later, do not silently apply. |
| Type II Specialization: CRIT Rate +6% per Type II module equipped | `equipment_conditional`, trigger `module_type_count`, stat `critRate`, valuePerModule `6` | Current planner can auto-calculate because equipped module count is known. |
| Followers Everywhere: ATK +2% per follow-up attack, up to 20% | `battle_conditional`, stackable, maxStacks `10` | Store, expose manual stacks later, do not silently apply. |
| Colucci Secrets Part 2: damage dealt +15% | `awakening`, stat/effect `damageBonus`, value `15`, unlock `awakening_count: 6` | Can be auto-applied only when awakening count is explicitly selected. |
| Underboss duration +3s / damage +100% | `awakening`, non-stat ability modifier | Store for damage simulator later, not base stat total. |

Direct always-on effects can be calculated. Conditional or battle-state effects must be stored but not included in final stats unless the user enables a toggle or the selected build state proves the condition.

## SQL Readiness

Do not migrate yet. The canonical JSON should map cleanly to future tables:

- `characters`
- `character_level_stats`
- `character_skills`
- `character_skill_attributes`
- `character_skill_materials`
- `character_passives`
- `character_life_skills`
- `character_awakenings`
- `character_material_requirements`
- `materials`
- `material_sources`
- `character_voice_actors`
- `character_skins`
- `character_voice_lines`
- `character_build_recommendations`
- `character_team_recommendations`

Recommended mapping notes:

- Keep `characters` narrow: identity, taxonomy ids, release status, media ids, and source metadata.
- Store every per-level stat as one row in `character_level_stats`.
- Store skill attribute rows one row per `character_id + skill_id + level + label`.
- Store materials globally in `materials`, then use join rows for ascension, skill, and life skill requirements.
- Store build recommendations as references to existing weapon/cartridge/stat/team ids, not duplicated display text.
- Store build planner effects in a normalized effect table or JSON column initially, then split when effect taxonomy stabilizes.

## Recommended Next Steps Before Mass Import

1. Add a canonical JSON importer/normalizer that adapts `data-entry/characters/*.character-data.template.json` into the current UI shape.
2. Extend character normalization to preserve `identity`, `stats.levelStats`, `skills.attributesByLevel`, `materials`, `lore`, and `buildPlannerIntegration`.
3. Add source status fields everywhere imported data can be incomplete.
4. Decide whether admin localStorage should edit canonical records or only current display patches.
5. Add tests for `getBaseCharacterStats()` once exact Lv.1-Lv.80 rows are supported.
6. Keep SQL/backend work for after canonical JSON import succeeds for several characters.
