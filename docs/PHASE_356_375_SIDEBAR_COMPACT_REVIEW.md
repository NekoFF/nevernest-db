# Phase 356-375 Sidebar Compact Review

Date: 2026-05-19

## Result

Sidebar compact polish applied.

## Findings

- The footer area was taking more height than needed on shorter screens.
- Legal links were available but padded like primary actions.
- Community/support planned blocks were visually heavier than their current feature status.

## Fixes

- Reduced sidebar width, corner radius, header padding, nav row padding, and footer padding slightly.
- Kept nav body scrollable with footer fixed at the bottom.
- Kept About, Disclaimer, Privacy, and Contact visible in a compact two-column legal link grid.
- Compressed Community hub and Support later blocks.
- Added compact planned/source-pending badges for Apartments, Guides, and Community.

## Safety

No routes were removed. `/dev/admin` remains hidden unless its dev flag is enabled.
