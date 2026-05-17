# Character Detail Cleanup Report

## Files Changed

- `src/components/CharacterHero.jsx`
- `src/pages/CharacterDetailPage.jsx`
- `src/data/characterCanonicalAdapter.js`
- `src/data/materialBlocks.js`
- `docs/character-detail-cleanup-report.md`

## Hero Portrait Fix Summary

The character detail hero portrait frame now uses a square frame instead of the taller 4:5 rectangle. The portrait image is slightly scaled within the reusable `CharacterPortrait` render path so character art sits more naturally in the frame without a large empty lower rectangle.

This applies to all character detail hero portraits, not only Nanally.

## Duplicate Role / Info Cleanup

The role chips under the portrait were removed. Roles now appear once inside the hero info grid under `Combat Style / Roles`.

The old `Weapon: Unknown` field was removed from the hero info grid. The replacement hero fields are:

- Faction
- Birthday
- Combat Style / Roles
- Esper Ability, falling back to Release / Obtain Info when needed

## Overview Block Order After Cleanup

The separate `Identity` overview block was removed from canonical overview generation and filtered from rendering for stale/local overview data.

Current intended overview order:

1. At a glance
2. Profile Snapshot
3. Voice Actors
4. Availability / Banner History
5. Gameplay Identity
6. Pros / Cons
7. Rating / Stat Model Note
8. Trivia / Intel
9. Stories
10. Personal Items
11. Quotes
12. Other Languages

`Esper Ability` now lives in Profile Snapshot.

## Materials Empty-State Crash Root Cause

`normalizeCharacterMaterials(null)` returned only legacy material fields, while the Materials tab expected the normalized object to always include arrays such as `ascensionMaterials`, `skillMaterials`, `lifeSkillMaterials`, `materialSources`, and `ascensionTotals`.

Characters with missing or partial material data could therefore hit undefined properties and white-screen when opening the Materials tab.

## Materials Crash Fix

`normalizeCharacterMaterials` now always returns a complete safe material shape. Materials rendering also defensively handles:

- missing `materials`
- missing arrays
- malformed life-skill rows
- empty material sections
- missing material source metadata
- missing material images/counts

Characters with no material data now show:

`Character Materials`

`No verified material data is available for this character yet.`

## Build Result

`npm.cmd run build` passed.

Vite still reports the existing large chunk warning, but the production build completed successfully.
