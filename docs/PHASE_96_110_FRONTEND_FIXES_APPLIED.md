# Phase 96-110 Frontend Fixes Applied

Date: 2026-05-17

## Summary

This phase applied only bounded frontend polish fixes. No backend endpoints, DB schema, auth/session logic, admin write pipeline, data architecture, API mode default, or Build Planner runtime behavior changed.

## Fixes

| File | Issue fixed | Before | After | Why low-risk | Manual verification |
| --- | --- | --- | --- | --- | --- |
| `src/components/Sidebar.jsx` | Sidebar support button label encoding/text mismatch | Button displayed non-English/encoding-mismatched text in an otherwise English shell | Button reads `Support project` | Text-only label fix; no behavior change | Open sidebar on desktop/mobile and inspect footer button |
| `src/components/Topbar.jsx` | Mobile search input lost space to hidden shortcut padding | Input kept `pr-24` even when shortcut badge was hidden | Mobile uses `pr-4`; `sm` and up keep `pr-24` | Class-only responsive spacing fix | At 375px, focus search and confirm text field is usable |
| `src/components/Topbar.jsx` | Search suggestions could exceed viewport height | Dropdown used `overflow-hidden` with no max height | Dropdown has `max-h` and vertical scrolling | Containment-only change | Type a broad query and scroll suggestions on mobile |
| `src/components/Topbar.jsx` | Notification/account menus had fixed widths | Menus could press past small viewport edges | Menus use `min(..., calc(100vw - 2rem))` widths | CSS-only containment | Open menus at 375px and confirm they remain within viewport |
| `src/components/Topbar.jsx` | Search suggestion thumbnails lacked async decode hint | Lazy-loaded thumbnails could still decode synchronously | Added `decoding="async"` | Browser hint only | Search and confirm thumbnails still render |
| `src/components/CharacterPortrait.jsx` | Character portrait images lacked async decode hint | Portrait decoding could compete with layout on dense pages | Added `decoding="async"` | Browser hint only | Open character grid/detail and confirm portraits render |
| `src/components/vehicles/VehicleStage.jsx` | Vehicle showcase/reflection images lacked lazy/async hints | Large images decoded without explicit hints | Added `loading="lazy"` and `decoding="async"` | Browser hint only; paths unchanged | Open `/vehicles` and switch vehicles |
| `src/components/Hero.jsx` | Optional hero image lacked decode hint | Custom hero images decoded without explicit hint | Added `decoding="async"` while preserving eager loading | Browser hint only | Open `/` with/without custom hero image |
| `src/pages/BuildPlannerPage.jsx` | Build Planner trust status was too confident for current formula maturity | Copy implied planning before committing resources | Copy now clearly labels the planner as prototype and formula outputs as needing verification | Text-only; runtime unchanged | Open `/build-planner` and inspect header copy |

## Not Fixed In Code This Phase

- No Build Planner formula changes.
- No tier-list interaction rewrite.
- No vehicle stage height change.
- No character/detail page layout refactor.
- No placeholder route hiding.
- No backend/API/auth/admin changes.

These were deferred because they require visual QA, product decisions, or later architecture work.
