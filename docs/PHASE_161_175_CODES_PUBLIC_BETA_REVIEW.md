# Phase 161-175 Codes Public Beta Review

Date: 2026-05-18

## Source

Based on `docs/CODES_SOURCE_EXPIRY_REVIEW.md`.

## Current State

| Status | Count |
| --- | ---: |
| active | 7 |
| expired | 6 |
| unknown | 0 |
| total | 13 |

No static code has source URL, source label, or expiry date data.

## Public Beta Risk

Active codes can look more certain than the data supports. Expired codes are useful for history, but active status should be verified before public launch. Rewards are broad labels and should not be expanded without evidence.

## Fix Applied

The Codes page now says active status, expiry dates, and exact reward details may still need source verification.

## Public Beta Decision

Codes can remain visible for beta if:

- Copy keeps source/expiry caveats.
- Active codes are reviewed before launch.
- Missing expiry dates remain missing.
- No exact rewards are invented.
- Expired codes stay clearly separated as history.

## Deferred

- Source URL/label fields in static data.
- Verified expiry dates.
- Automated stale-code checks.
- Production admin workflow for code review/publish.
