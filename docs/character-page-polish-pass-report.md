# Character Page Polish Pass Report

## 1. Files Changed

- `src/pages/CharacterDetailPage.jsx`
- `src/components/TeamSection.jsx`
- `src/data/overviewBlocks.js`
- `src/admin/OverviewBlockEditor.jsx`
- `src/data/characterCanonicalAdapter.js`
- `docs/character-page-polish-pass-report.md`

## 2. Public Source Labels Removed From Materials

Public Materials cards no longer render material source chips or source/status wording. Source metadata is still preserved in normalized material data and may appear in Admin Mode where useful.

Hidden publicly:
- `source`
- `PDF/Data Pack`
- `Fandom Screenshot`
- `Essential Tool`
- `Source status`
- `primary-needs-recheck`
- `conflict-needs-manual-verification`
- source-pack/source-status wording

Public Materials now show clean category titles, material names, and counts.

## 3. Overview Order After Changes

The Overview renderer now enforces this order:

1. At a Glance
2. Profile Snapshot
3. Identity
4. Voice Actors
5. Availability / Banner History
6. Gameplay Identity
7. Pros / Cons
8. Rating
9. Stat Model Note
10. Trivia
11. Intel
12. Stories
13. Personal Items
14. Quotes
15. Other Languages

## 4. Overview Block Sizing Support

`overviewBlocks.js` now preserves reusable block layout metadata:

- `size`: `full`, `half`, `third`, `twoThird`, `compact`
- `icon`
- `accentColor`
- `layout`

`OverviewBlockEditor` exposes these fields for Admin Mode editing. The character page maps size values to a responsive 6-column desktop grid, 2-column tablet grid, and 1-column mobile grid.

## 5. Other Languages Moved To Bottom

Yes. `characterCanonicalAdapter.js` now appends `Other Languages` after quotes, and `CharacterDetailPage.jsx` also enforces it as the final known Overview block during rendering.

## 6. At A Glance Styling

The hard top stripe was removed. The hero summary now uses a softer glass-style surface with teal/pink glow layers, a subtle corner aura, and the `Character Overview` pill.

## 7. Passives / Life Skills / Breakthrough Merge

The ability sub-tabs are now:

- Skills
- Passives
- Awakening

The Passives tab groups structured cards under:

- Combat Passives
- Life Skill
- Breakthrough / Resonance

Empty groups are hidden.

## 8. Synergy Card Improvements

Synergy cards now use a fixed header area with consistent avatar placement, aligned name/badge chips, a separated notes body, and natural card height in the responsive grid.

## 9. Team Card Improvements

Team cards now use a softer glass/capsule composition, clearer team heading chips, portrait rows with role chips, and a separated explanation area. Existing team data is reused as-is.

## 10. Materials Improvements

Materials are grouped by clean public purpose:

- Character Ascension Materials
- Total Materials
- Skill Upgrade Materials
- Life Skill Upgrade Materials

Material cards now use a stable placeholder icon, name, and `Count` label, without public source chips.

## 11. Admin Mode

Admin Mode edit buttons remain in place for Overview, Abilities, Teams, Build, Console, and Materials. Overview editing now supports the new layout metadata fields. Material source/status details are still available only when Admin Mode passes source display through.

## 12. Build Result

`npm.cmd run build` passed.

Vite emitted the existing large chunk warning, but the production build completed successfully.
