# Nanally Supplemental Source Rendering Report

## Files changed
- `data-entry/characters/nanally.character-data.template.json`
- `src/data/characterCanonicalAdapter.js`
- `src/data/skillBlocks.js`
- `src/data/materialBlocks.js`
- `src/pages/CharacterDetailPage.jsx`
- `src/components/CharacterHero.jsx`
- `src/data/characters/nanally.js`

## Supplemental fields imported
- Profile Snapshot: real name, gender, birthday, affiliation, obtain source, release date, rarity, element, arc type, and roles.
- Availability: Scarborough Fair / The Ichi-daime / 2026-04-29.
- Other Languages: localized Nanally and Nanally Coluccis names/romanizations.
- Trivia: Ichi-daime nickname/meaning and Coluccis/Collins localization notes.
- Ascension-phase stat table from the Fandom/wiki screenshot.
- Fandom/wiki ascension material total as a separate conflict variant.

## Guide/opinion fields
- Gameplay Identity / Review Summary.
- Pros and Cons.
- Damage T0 rating for Endgame PVE.
- Best cartridge names, best main stats, best sub stats, recommended endgame stats, skill priority, and guide awakening priority.
- Existing site-authored Build/Teams/Console content was preserved; unclear weapon IDs remain verification-gated.

## Conflicts
- Stats: PDF/data-pack base Lv.80 is HP 9662 / ATK 396 / DEF 549, while Fandom ascension-phase Lv.80 is HP 15984 / ATK 636 / DEF 909. Both are stored; the level slider still uses PDF/base rows.
- Materials: PDF/data-pack ascension total and Fandom screenshot total are both visible as source variants. Fandom is marked `conflict-needs-manual-verification`.

## Ascension phase stats
Added `stats.ascensionPhaseStats`, `selectedAscensionPhase`, `selectedLevel`, and an ascension source-status label. The Character Page shows a visible note that the table is available but not connected to Build Planner.

## Level slider
Behavior stayed safe. The slider continues using exact PDF/data-pack base level rows. Crit Rate and Crit DMG remain non-scaling combat base stats at 5% and 50%.

## Now visible
- Overview blocks: Profile Snapshot, Voice Actors, Availability, Gameplay Identity, Pros, Cons, Rating, Stat Model Note, Trivia, Other Languages, Intel, Personal Items, Stories, and Quotes.
- Build guide blocks: cartridges, main stats, sub stats, endgame stats, skill priority, notes, and console summary remain visible.
- Skills/Passives/Life Skills/Awakening/Breakthrough/Materials render through the page systems, not just JSON.

## Validation
- Preview routes checked: `/characters` and `/build-planner` returned HTTP 200.
- Headless DOM check confirmed Nanally page content across Overview, Skills, Passives, Life Skills, Awakening, Breakthrough, Materials, Build, Teams, and Console.
- `npm.cmd run build`: passed.
