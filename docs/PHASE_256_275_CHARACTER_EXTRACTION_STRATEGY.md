# Phase 256-275 Character Extraction Strategy

## Principle

The local corpus is evidence, not authority. Raw scraped files may be duplicated, mixed across characters, stale, partially parsed, or wrong. Existing site character data remains canonical.

## Protected Canonical Fields

The pipeline must not overwrite:

- Character id / slug
- Display name
- Rarity / rank
- Element
- Weapon / arc type
- Curated role
- Avatar/card identity
- Existing Nanally structured content

If corpus text conflicts with any protected field, the value is recorded as a conflict with `sourceStatus: "needs_verification"` and stays out of live data.

## Candidate Shape

```json
{
  "characterSlug": "nanally",
  "canonicalName": "Nanally",
  "candidate": {
    "summary": [],
    "skills": [],
    "passives": [],
    "combatNotes": [],
    "buildNotes": [],
    "recommendedWeapons": [],
    "recommendedCartridges": [],
    "teamNotes": [],
    "rotationNotes": [],
    "rawSnippets": []
  },
  "conflicts": [],
  "sourceFiles": [],
  "sourceStatus": "needs_verification",
  "confidence": "low|medium|high"
}
```

Each snippet carries:

- `sourceStatus: "needs_verification"`
- confidence estimate
- source file path
- extraction batch id
- extraction timestamp
- parsing notes when uncertain

## Extraction Rules

- Read text-like files only: JSON, Markdown, TXT, HTML, CSV.
- Skip dependency folders, generated folders, images/media, and oversized files.
- Map only to existing site character slugs; never create new canonical characters automatically.
- Deduplicate repeated snippets by normalized text.
- Use path/name matching for candidate mapping, then flag mixed-character files as conflicts.
- Keep raw snippets capped so generated output remains reviewable.
- Never promote corpus-derived values to `verified`.

## Build Planner Rule

Extracted passives, skill notes, cartridge notes, and build effects can inform future review. They must not silently alter Build Planner calculations until a separate verified formula adapter exists with tests.
