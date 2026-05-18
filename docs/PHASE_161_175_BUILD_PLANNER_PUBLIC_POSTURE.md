# Phase 161-175 Build Planner Public Posture

Date: 2026-05-18

## Result

The Build Planner can remain public in a read-only beta only as a prototype/local theorycrafting tool. It must not be described as formula-verified or production-accurate.

## Current Copy

The page already states:

- It is a prototype planner.
- Totals are useful for local theorycrafting.
- Formula outputs still need verification before being treated as production-accurate.
- Drafts are stored in browser localStorage.

## Decision

Keep `/build-planner` public but prototype-labelled. Do not hide it unless mobile QA finds blocking defects.

## Allowed Public Behavior

- Local browser drafts.
- JSON/image export.
- Importing explicit user-selected build draft files.
- Static data-driven theorycrafting.

## Not Allowed

- Claims of official formula accuracy.
- Production account storage.
- Silent upload/import of localStorage data.
- Formula/runtime changes during this phase.

## Deferred

- Formula verification.
- Source labels for formulas.
- Public sharing/accounts.
- Server-backed saved builds.
