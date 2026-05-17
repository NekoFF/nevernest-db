# Nanally Visible Data Rendering Fix Report

## Files changed
- `data-entry/characters/nanally.character-data.template.json`
- `src/data/characterCanonicalAdapter.js`
- `src/data/skillBlocks.js`
- `src/data/materialBlocks.js`
- `src/pages/CharacterDetailPage.jsx`
- `src/components/CharacterHero.jsx`
- `src/data/characters/nanally.js`

## Data path traced
Nanally canonical data loads from `data-entry/characters/nanally.character-data.template.json`, is adapted by `src/data/characterCanonicalAdapter.js`, then exposed through `src/data/canonicalCharacters.js`. `src/data/characters/index.js` uses `canonicalCharactersById.nanally` as the Nanally character record. `CharacterDetailPage` renders overview, skills, passives, life skills, awakening, breakthrough, and materials from that adapted object.

## Found but not rendered before
- `skill.maxLevel`, `knownLevels`, `attributesByLevel`, and `sourceStatus` existed after the canonical adapter but were dropped by `normalizeSkills`.
- `materials.ascensionMaterials`, `skillMaterials`, `lifeSkillMaterials`, `materialSources`, and source variants existed but the Materials tab only read `materials.items`.
- Life skill level materials existed in canonical `lifeSkills.levels[].materials` but were not flattened for the Life Skill material view.
- Supplemental lore/intel, profile, voice, and localization data had no overview blocks.

## Field mappings fixed
- Preserved `maxLevel`, `knownLevels`, `attributesByLevel`, `canonicalType`, and `sourceStatus` in `normalizeSkills`.
- Added life-skill material flattening in the canonical adapter.
- Added Materials rendering for ascension totals, skill totals, life skill totals, sources, and conflict variants.
- Added overview mappings for profile snapshot, voice actors, availability, gameplay identity, pros/cons, rating, stat model note, trivia, other languages, intel, personal items, stories, and quotes.

## Now visible
- Overview: title/tagline, S-Rank, Anima, Plasma, roles, Eibon Antique Shop, birthday, Esper Ability, EN/JP/KO/CN voice actors, lore/intel, personal items, stories, quotes, guide summary, pros/cons, rating, availability, other-language names, and ascension-stat warning.
- Skills: four combat skills with descriptions, flavor where available, Attribute/Values rows, level pills up to Lv.13 with unknown levels disabled, and material cards.
- Enabled skill levels: Secret Skill Lv.1 and Lv.13; Howling Lv.1/Lv.6/Lv.13; Ultimate Lv.1/Lv.7/Lv.13; Justice Lv.1/Lv.6/Lv.13. Other Lv.1-Lv.13 pills remain disabled.
- Materials: PDF ascension total, Fandom screenshot conflict total, shared skill upgrade materials, and Family Business life-skill materials.
- Passives: More Than Passionate and Fair Duel render through the Passives category, with unlock materials.
- Life Skills: Family Business Lv.1-Lv.5 render, with materials available in its Materials sub-tab and the main Materials tab.
- Awakening: A1-A6 render in PDF/data-pack order.
- Breakthrough: Colucci Secrets - Part 1 and Part 2 render.

## Still missing
- Ascension-phase stat selection is stored and warned about, but not connected to Build Planner yet.
- Some weapon/arc guide screenshot IDs remain site-authored or verification-gated.

## Validation
- Build Planner route: yes, preview returned HTTP 200.
- `npm.cmd run build`: passed.
