# Phase 276-295 Character Intel UI

## Result

Character detail pages can now render optional source-pending intel notes from `src/data/characterIntelNotes.js`.

## Public UI Behavior

- Renders only when a character has intel notes.
- Appears in the Overview tab.
- Uses the heading `Source-pending intel`.
- Shows `Needs verification` source status and confidence.
- Displays concise, player-useful notes grouped by section.
- Does not show raw source file paths.
- Does not call the notes official or verified.

## Pilot Content

Only `lacrimosa` currently has pilot intel notes.

## Search

Global search includes intel note text at low priority inside the canonical character search result. Searching source-pending terms such as `nightmare` can find Lacrimosa, but results still route to `/characters/lacrimosa` and do not create a new route.

## Safety

The intel module is separate from canonical character objects. It does not contain rarity, element, arc type, role, avatar, stats, formulas, or Build Planner inputs.
