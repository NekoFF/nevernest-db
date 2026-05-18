# Phase 206-220 Mobile Screenshot QA Results

Date: 2026-05-18

Source checklist: `docs/PHASE_191_205_MOBILE_SCREENSHOT_QA.md`.

No Playwright, Puppeteer, or existing screenshot runner is present. No heavy browser automation was added in this phase.

## Overall Status

Not run. Manual screenshot QA remains a public beta blocker.

## Viewport Results

| Viewport | Status | Issue | Severity | Fix/defer |
| --- | --- | --- | --- | --- |
| 375x812 | Not run | Manual screenshot required. | High before launch | Defer to human/mobile pass. |
| 430x932 | Not run | Manual screenshot required. | High before launch | Defer to human/mobile pass. |
| 768x1024 | Not run | Manual screenshot required. | High before launch | Defer to human/tablet pass. |
| 1024x768 | Not run | Manual screenshot required. | Medium before launch | Defer to human/tablet pass. |
| 1440x900 | Not run | Manual screenshot required. | Medium before launch | Defer to human/desktop pass. |

## Route Matrix

Each route below must be checked at every viewport listed above:

| Route | Status | Issue | Severity | Fix/defer |
| --- | --- | --- | --- | --- |
| `/` | Not run | Needs screenshot. | Medium | Defer. |
| `/characters` | Not run | Needs screenshot. | Medium | Defer. |
| `/characters/nanally` | Not run | Dense detail page risk. | High | Defer. |
| `/weapons` | Not run | Needs screenshot. | Medium | Defer. |
| `/weapons/good-boys-grand-adventure` | Not run | Detail page risk. | Medium | Defer. |
| `/modules` | Not run | Needs screenshot. | Medium | Defer. |
| `/modules/devils-blood-curse` | Not run | Dense cartridge detail risk. | High | Defer. |
| `/modules/pieces/type-ii-horizontal/s` | Not run | Module piece density risk. | High | Defer. |
| `/vehicles` | Not run | Vehicle stage phone height/composition risk. | High | Defer. |
| `/tier-list` | Not run | Scroll/touch behavior risk. | High | Defer. |
| `/codes` | Not run | Needs screenshot and caveat check. | Medium | Defer. |
| `/news` | Not run | Needs screenshot. | Medium | Defer. |
| `/build-planner` | Not run | Dense prototype controls risk. | High | Defer. |
| `/disclaimer` | Not run | Legal readability check. | Medium | Defer. |
| `/privacy` | Not run | Legal readability check. | Medium | Defer. |
| `/contact` | Not run | Contact blocker copy check. | High | Defer until real channel selected. |

## Allowed Fixes After Manual QA

- Small responsive class fixes.
- Overflow containment.
- Copy clarity.
- Spacing/padding.

No redesign should be bundled into the beta rehearsal.
