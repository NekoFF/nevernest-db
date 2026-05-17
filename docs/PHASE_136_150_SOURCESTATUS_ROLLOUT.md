# Phase 136-150 SourceStatus Rollout

Date: 2026-05-18

## Summary

SourceStatus display was expanded carefully to high-risk public surfaces that already receive `sourceStatus` from current view models. This phase did not change source values, mark anything verified, or add a new status system.

## Added Surfaces

| Surface | Behavior |
| --- | --- |
| Weapon growth scaling | Shows `SourceStatusBadge` beside the section title. Missing cells say `Source pending` instead of implying a fetch failure. |
| Weapon refinement/resonance | Shows `SourceStatusBadge` beside the section title and reads `effectText` when present. |
| Character detail hero | Shows a badge beside the character name when `character.sourceStatus` exists. |
| Vehicle handling profile | Shows a badge near the 0-10 scale when `vehicle.sourceStatus` exists. |
| Code cards | Shows a badge in the date/source block when `entry.sourceStatus` exists. |
| News cards and detail modal | Shows a badge near publication/source metadata when `entry.sourceStatus` exists. |

## Policy

- `verified` remains verified only if the source data already says so.
- `needs_verification`, `estimated`, `placeholder`, `mock`, and `unknown` remain honest confidence labels.
- Missing values remain missing; UI copy may say `Source pending` when the data is absent but the route loaded.
- API failures remain errors and are not converted to `Data coming soon`.

## Deferred

- Full provenance notes, source URLs, verification notes, and patch/version metadata.
- Admin source-status editor.
- Audit-log viewer and draft/publish workflow.
- SourceStatus badges on every single low-risk text field; this phase intentionally avoided clutter.
