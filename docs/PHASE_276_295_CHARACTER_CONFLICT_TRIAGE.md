# Phase 276-295 Character Conflict Triage

## Summary

Phase 256-275 extraction found 95 conflicts:

- `identity-context`: 66
- `rarity`: 29

No element or weapon/arc type conflicts were detected by the extractor, but those fields remain protected.

## Conflict Types

| Type | Risk | Decision | Blocks Pilot Apply |
| --- | --- | --- | --- |
| Rarity/rank conflict | Could overwrite curated S/A rank data with stale or cross-page values. | Never apply from corpus. Keep report-only. | Yes, for affected character canonical fields. |
| Element conflict | Would mislead filters/builds if present. | Treat as protected; manual source review required. | Yes. |
| Weapon/arc type conflict | Would mislead filters/builds if present. | Treat as protected; manual source review required. | Yes. |
| Name/alias conflict | Could merge separate identities incorrectly. | Do not guess. Use only existing site slug mapping. | Yes when identity is uncertain. |
| Mixed-character source | Common in corpus folders and aggregate pages. | Do not expose raw snippets; only paraphrase clearly character-specific notes. | Usually yes. |
| Uncertain source file | Metadata/raw-page files can point to useful pages but may not contain player-facing text. | Review later unless notes are independently useful. | Usually yes. |
| Duplicate/aggregated guide text | Inflates confidence and repeats stale recommendations. | Deduplicate and avoid copy-paste apply. | Yes unless manually cleaned. |
| Unknown mapping | Could create new or wrong characters. | Never create canonical characters automatically. | Yes. |

## Special Naming Issues

- `Zero` / `Esper Zero`: the site has separate `zero-female` and `zero-male` entries. Corpus text using broad Zero labels is review-later.
- `Haniel` / `Hanizel`: the corpus commonly uses Haniel while the site canonical slug/name is `hanizel`. This remains review-later and must not be guessed into a live alias change.
- `Daffodill` / `Daffodil`: handled as a mapping alias only. No canonical display name change was made.

## Pilot Impact

`lacrimosa` has mixed-source conflicts, but the selected notes avoid identity, rarity, element, arc type, role, stat, recommendation, and formula claims. That makes a source-pending notes-only pilot acceptable.
