# Phase 336-355 Mobile Screenshot QA

Date: 2026-05-19

## Result

NOT RUN as a full screenshot QA pass.

## Status

Automated route/header checks passed, but final manual screenshot QA remains required before public beta.

## Required Viewports

- 375x812
- 430x932
- 768x1024
- 1024x768
- 1440x900

## Required Routes

- `/`
- `/characters`
- `/characters/nanally`
- `/characters/lacrimosa`
- `/weapons`
- `/modules`
- `/vehicles`
- `/tier-list`
- `/codes`
- `/build-planner`
- `/disclaimer`
- `/privacy`
- `/contact`

## Manual QA Criteria

- No overlapping topbar/sidebar/dropdown content.
- No hidden legal/contact copy.
- No edit/pencil/AdminMode controls visible.
- Dense tables and cards remain readable.
- Build Planner prototype caveats remain visible.
- Character intel source-pending caveats remain visible where applicable.

## Decision

Private friends preview can proceed if the user accepts screenshot QA risk. Public read-only beta remains NO-GO until this pass is completed and recorded.
