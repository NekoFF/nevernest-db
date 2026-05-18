# Phase 191-205 Mobile Screenshot QA

Date: 2026-05-18

## Result

No Playwright, Puppeteer, or existing screenshot runner is present in this repo. This phase does not add a heavy browser automation framework. Use this as the required manual screenshot checklist before public beta.

## Viewports

- [ ] 375x812 phone
- [ ] 430x932 large phone
- [ ] 768x1024 tablet portrait
- [ ] 1024x768 tablet landscape
- [ ] 1440x900 desktop

## Routes

- [ ] `/`
- [ ] `/characters`
- [ ] `/characters/nanally`
- [ ] `/weapons`
- [ ] `/weapons/good-boys-grand-adventure`
- [ ] `/modules`
- [ ] `/modules/devils-blood-curse`
- [ ] `/modules/pieces/type-ii-horizontal/s`
- [ ] `/vehicles`
- [ ] `/tier-list`
- [ ] `/codes`
- [ ] `/news`
- [ ] `/build-planner`
- [ ] `/disclaimer`
- [ ] `/privacy`
- [ ] `/contact`

## Per-Route Checks

- [ ] No page-level horizontal overflow.
- [ ] Sidebar opens, closes, and scrolls on mobile.
- [ ] Topbar search and menu controls remain tappable.
- [ ] Card grids wrap without cropped labels.
- [ ] Detail headers keep names, badges, and actions readable.
- [ ] Long labels wrap or truncate intentionally.
- [ ] Tables, boards, and rails scroll inside their own containers.
- [ ] Build Planner remains usable enough for prototype public access.
- [ ] Tier List has clear scroll/touch behavior and does not imply official ranking.
- [ ] Vehicle stage height does not bury primary controls below the fold.
- [ ] Modals/dropdowns fit within the viewport.
- [ ] Legal/info pages remain readable without cramped line length.

## Known Higher-Risk Screens

| Route | Risk | Beta decision |
| --- | --- | --- |
| `/build-planner` | Dense controls and local draft panels. | Can ship only with prototype caveat if no blocking overflow. |
| `/tier-list` | Drag/board interaction and horizontal density. | Can ship as reference view if touch behavior is acceptable. |
| `/vehicles` | Large showcase stage can crowd small phones. | Needs visual pass before launch. |
| `/characters/nanally` | Dense details, tabs, stats, and material labels. | Needs visual pass before launch. |
| `/modules/pieces/type-ii-horizontal/s` | Shape/stat detail density. | Needs visual pass before launch. |

## Capture Naming

Use this naming pattern for any manual screenshots:

```text
phase-191-205/<viewport>/<route-slug>.png
```

Example:

```text
phase-191-205/375x812/characters-nanally.png
```

## Follow-Up

If the manual pass finds a concrete layout defect, fix only the narrow layout issue. Avoid speculative redesigns during the beta candidate phase.
