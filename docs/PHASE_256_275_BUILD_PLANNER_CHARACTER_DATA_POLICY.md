# Phase 256-275 Build Planner Character Data Policy

## Policy

Corpus-extracted character passives, build notes, cartridge recommendations, and skill effects are not automatically applied to Build Planner formulas.

## Reason

The corpus is useful for discovery but not yet verified. Build Planner outputs are already source-sensitive and should not change from unreviewed scraped text.

## Allowed In This Phase

- Store extracted effects as generated candidate notes.
- Use candidate notes for manual review.
- Document possible future formula adapters.

## Not Allowed In This Phase

- Silent stat or damage formula changes.
- Automatic passive/awakening effect application.
- Treating candidate recommendations as verified best-in-slot data.
- Changing Build Planner runtime behavior.

## Future Adapter Requirements

A later phase can add formula adapters only when each effect has:

- Canonical character id
- Verified trigger/condition text
- Source evidence
- Patch/build context
- Explicit `autoApply` policy
- Unit tests for calculator behavior
- UI copy explaining limitations

Until then, Build Planner remains prototype/source-pending and candidate data remains informational only.
