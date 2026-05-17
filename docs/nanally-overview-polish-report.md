# Nanally Overview Polish Report

## 1. Files changed
- `src/data/overviewBlocks.js`
- `src/admin/OverviewBlockEditor.jsx`
- `src/data/characterCanonicalAdapter.js`
- `src/pages/CharacterDetailPage.jsx`

## 2. Public source/debug labels hidden
Public character pages no longer show internal labels such as:
- `PDF/Data Pack`
- `Fandom Screenshot`
- `Source status`
- `primary-needs-recheck`
- `conflict-needs-manual-verification`
- `verified_hp_atk_def_from_nanally_data_pack_pdf_source`
- `sourceStatus`

Materials still keep metadata for Admin Mode. Public users see neutral copy such as `Material totals are being verified.`

## 3. New Overview block types added
Reusable block types added to `overviewBlocks.js`:
- `heroSummary`
- `profileGrid`
- `voiceActors`
- `prosCons` support through paired Pros/Cons rendering
- `quoteList`
- `keyValueGrid`
- `languageTable`
- `loreCards`
- `compactBannerHistory`
- `gameplaySummary`

Existing `text`, `list`, and `meta` blocks still work.

## 4. Overview sections visually improved
- At a glance now renders as a larger hero summary block with identity chips.
- Profile Snapshot is a compact dense grid.
- Voice Actors render as a four-column language strip.
- Pros and Cons render as a paired split card.
- Gameplay Identity renders as a larger editorial card.
- Availability / Banner History is compact.
- Other Languages renders as grouped tables for Nanally and Nanally Coluccis.
- Personal Items render as lore cards.
- Quotes render as quote cards.
- Intel, Stories, Trivia, Identity, and Rating remain visible with tighter card layouts.

## 5. Empty space reduced
- Small factual blocks use compact padding.
- Profile and identity rows use denser grids instead of oversized repeated rows.
- Overview uses an auto-row two-column grid on desktop and one column on small screens.
- Materials headers no longer create large debug/source cards for tiny notes.

## 6. Admin Mode compatibility
Admin Mode still edits overview blocks through `OverviewBlockEditor`.
The editor now preserves and can create the new block types while continuing to support row, list, text, enable/disable, delete, and reorder behavior.

## 7. Other Nanally sections
Verified after polish:
- Skills still render.
- Skill Attributes still use level pills and the Attribute/Values table.
- Materials still render ascension, skill, and life skill material names/counts.
- Passives still render.
- Life Skills still render.
- Awakening still renders.
- Breakthrough still renders.
- Level slider was not changed.
- Build Planner logic was not changed.

## 8. Build result
- `npm.cmd run build`: passed.
- Preview checks: `/characters` and `/build-planner` returned HTTP 200.
