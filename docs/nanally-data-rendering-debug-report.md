# Nanally Data Rendering Debug Report

## 1. Files changed
- `data-entry/characters/nanally.character-data.template.json`
- `src/data/characterCanonicalAdapter.js`
- `src/data/skillBlocks.js`
- `src/data/materialBlocks.js`
- `src/pages/CharacterDetailPage.jsx`
- `src/components/CharacterHero.jsx`
- `src/admin/adminStorage.js`
- `src/data/characters/nanally.js`

## 2. Final Nanally object field paths
- Canonical source: `data-entry/characters/nanally.character-data.template.json`
- Adapter: `adaptCanonicalCharacter()` in `src/data/characterCanonicalAdapter.js`
- Roster merge: `canonicalCharactersById.nanally` in `src/data/characters/index.js`
- Admin merge: `mergeCharactersWithOverrides()` in `src/admin/adminStorage.js`
- Page reads:
  - Overview: `character.overview.blocks`
  - Skills and ability categories: `character.skills`
  - Skill attributes: `skill.attributeLevels`, `skill.maxLevel`, `skill.attributesByLevel`
  - Skill materials: `skill.upgradeMaterials`
  - Materials tab: `character.materials.ascensionMaterials`, `skillMaterials`, `lifeSkillMaterials`, `ascensionTotals`
  - Stats slider: `character.levelStats.rows` plus `character.combatBaseStats.values`

## 3. Field mismatches found
- `normalizeSkills()` discarded `maxLevel`, `knownLevels`, `attributesByLevel`, and source fields, so level pills and known attribute rows could collapse to empty states.
- `CharacterDetailPage` Materials only read `materials.items`, ignoring canonical `ascensionMaterials`, `skillMaterials`, `lifeSkillMaterials`, and conflict variants.
- Life skill material data lived under `lifeSkills.levels[].materials`, but no renderer received it as material cards.
- The final blocker was stale browser admin overrides: `patch.overview`, `patch.skills`, and `patch.materials` replaced Nanally’s canonical data wholesale, causing old generic blocks, empty ability categories, and `New material` placeholders to win over verified source data.

## 4. Renderers fixed
- Skill normalizer now preserves attribute-level metadata and material/source fields.
- Skill Attributes now render level pills Lv.1-Lv.13 and an `Attribute | Values` table for enabled known levels.
- Materials tab now renders character ascension materials, source-conflict totals, shared skill materials, and life-skill materials.
- Canonical adapter now maps overview supplemental blocks, passive unlock materials, life-skill materials, ascension phase stats, and material conflict variants.
- Admin override merge now protects Nanally canonical `overview`, `skills`, `materials`, `stats`, and `levelStats` from stale localStorage overrides unless an override explicitly opts in with `__allowCanonicalSectionOverride`.

## 5. Sections now visible
- Overview: Profile Snapshot, Voice Actors, Availability / Banner History, Trivia, Other Languages, Gameplay Identity, Pros, Cons, Rating, Intel, Personal Items, Stories, Quotes, and the ascension stat note.
- Skills: Colucci Secret Skill, Colucci Howling Technique, Colucci Ultimate Technique, Justice from Above.
- Attributes: known levels render, missing levels stay disabled/clean.
- Passives: More Than Passionate and Fair Duel.
- Life Skills: Family Business Lv.1-Lv.5.
- Awakening: A1-A6.
- Breakthrough: Colucci Secrets Part 1 and Part 2.
- Materials: ascension, skill, life skill, and source-conflict material groups.

## 6. Still cannot render
- No required Nanally source section remains intentionally empty.
- Ascension-phase stat selection is stored and noted, but not wired into Build Planner calculations yet.

## 7. Fake placeholders
- Stale `New material` / `Data coming soon` Nanally overrides are no longer allowed to hide canonical Nanally materials.
- Empty-category placeholders remain available globally for genuinely missing data on other records.

## 8. Material conflict
- Stored in `materials.ascensionTotals` with `source: "pdf"` and `source: "fandom-screenshot"`.
- The Fandom variant is marked `conflict-needs-manual-verification`.

## 9. Ascension phase stats
- Stored in `stats.ascensionPhaseStats`.
- The level slider still uses PDF/data-pack base level stats to avoid silently mixing stat models.

## 10. Build Planner
- Build Planner logic was not changed.
- Preview route `/build-planner` returned HTTP 200.

## 11. Build result
- `npm.cmd run build`: passed.
