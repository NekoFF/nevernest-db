# Phase 151-160 SourceStatus UI Review

Date: 2026-05-18

## Surfaces Reviewed

| Surface | Current behavior | Assessment |
| --- | --- | --- |
| Cartridge Set Data | Bonus rows show `SourceStatusBadge` using bonus or cartridge status. | Appropriate high-risk placement. Compatible shapes remain needs-verification in reports. |
| Weapon growth/refinement | Growth table and refinement list show badges. | Appropriate because numeric/effect data is high-risk. |
| Character hero | Hero shows badge when status exists. | Good summary-level placement without dense badge spam. |
| Vehicle handling | Vehicle stats panel shows badge when status exists. | Appropriate for stats/handling trust. |
| Code cards | API code cards show badge when sourceStatus exists. | Useful, but static code provenance is still sparse. |
| News cards/modal | News list/detail show badge when sourceStatus exists. | Useful; source labels/images still need provenance enrichment. |

## Copy Consistency

Current badge copy:

| Status | Label |
| --- | --- |
| `verified` | Verified |
| `needs_verification` | Needs verification |
| `estimated` | Estimated |
| `placeholder` | Source pending |
| `mock` | Mock data |
| `unknown` | Source unknown |

The labels are consistent and honest. `unknown` can become noisy if shown on every dense list item, but current usage is limited to selected public trust surfaces rather than all fields.

## Visual Assessment

Badges are subtle enough for current surfaces: small type, pill styling, and muted colors. No redesign was made.

## Risks/TODO

- Static codes do not carry sourceStatus, source labels, or expiry dates yet.
- API news summary currently exposes sourceStatus but source labels depend on raw/source data.
- Future source display should prefer local placement near the risky data, not a global page-level warning.
- If list pages become visually noisy, hide `unknown` in dense card grids while keeping `needs_verification`, `estimated`, and `placeholder` visible.

No SourceStatus UI code changes were required beyond the API client smoke count fix and mapper test coverage.
