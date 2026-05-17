# Mobile Tablet UX Audit

Date: 2026-05-17

Scope: conceptual/code-layout audit for 375px mobile, 430px large phone, 768px tablet, 1024px small desktop, and full desktop. No production browser/device lab was used in this pass.

| Route | Viewport risk | Issue | Severity | Recommendation | Fixed now? | Deferred reason |
| --- | --- | --- | --- | --- | --- | --- |
| Global shell | 375/430 | Topbar search had desktop-sized right padding while the shortcut chip is hidden on mobile, reducing usable input width. | Medium | Use smaller mobile right padding and restore larger padding at `sm`. | Yes |  |
| Global shell | 375/430 | Search suggestions could grow past available height and trap content below viewport. | Medium | Add max-height and vertical scrolling to suggestions. | Yes |  |
| Global shell | 375/430 | Notification/account dropdown widths were fixed and could press against viewport edges. | Low | Use viewport-constrained widths. | Yes |  |
| Global shell | All | Sidebar support button had a visible encoding/text mismatch. | Low | Replace with stable English label matching surrounding UI language. | Yes |  |
| Global shell | 375/430 | Sidebar overlay uses a close backdrop and slide-in panel; behavior is structurally sound. | Low | Verify manually on device for focus return and scroll lock later. | No | Needs real device/browser QA. |
| `/` | 375/430 | Hero uses split layout only at `md`; mobile stacks cleanly. | Low | Keep current layout; watch card stat labels. | No | No concrete defect found. |
| `/` | 375/430 | Optional hero slide image lacked explicit async decode. | Low | Add decoding hint while preserving eager hero loading. | Yes |  |
| `/characters` | 375/430 | Grid stacks to one column; compact rows stack before `md`. | Low | Keep; verify mini filter overlay on real phone. | No | Needs visual QA. |
| `/characters` | 768 | Five-column desktop grid is not active yet; tablet uses three columns. | Low | Good current breakpoint behavior. | No | No defect found. |
| `/characters/:slug` | 375/430 | Dense sections, materials, stats, and tabs are high-risk for vertical density. | Medium | Keep horizontal tab scrolling; run screenshot QA for long material labels. | No | Larger pass required; no safe single-line defect found. |
| `/weapons` | 375/430 | Grid/list layouts collapse before `md`; filter chips scroll horizontally. | Low | Keep; verify long weapon names in compact mode. | No | Needs visual QA. |
| `/weapons/:slug` | 375/430 | Detail header has separate mobile and large layout; tables use horizontal overflow. | Medium | Verify growth/refinement table scanability. | No | Manual viewport QA needed. |
| `/modules` | 375/430 | Filter chip groups wrap; mini filter rail scrolls horizontally. | Low | Keep; verify long element/category labels. | No | No concrete defect found. |
| `/modules/:slug` | 375/430 | Cartridge detail uses large visual panels; likely okay but dense. | Medium | Check compatible shapes and bonus cards on phone. | No | Manual QA needed. |
| `/modules/pieces/:shapeId/:rarity` | 375/430 | Module shape/detail panels may be dense but stack naturally. | Medium | Verify shape board minimum sizes. | No | Manual QA needed. |
| `/vehicles` | 375/430 | Showcase image is large and animated; image decode could be expensive. | Medium | Add lazy/async image decode hints. | Yes |  |
| `/vehicles` | 375/430 | Stage height is large on small phones. | Medium | Consider a later mobile-specific min-height reduction if screenshots show crowding. | No | Needs visual QA; changing height now may affect composition. |
| `/tier-list` | 375/430 | Board intentionally has a `min-width` and horizontal scroll. | Medium | Keep for now; add stronger mobile affordance later if needed. | No | Larger UX decision. |
| `/tier-list` | 375/430 | Drag-and-drop is supported by tap-to-send path, but needs device QA. | Medium | Verify selected character flow on touch devices. | No | Manual QA needed. |
| `/codes` | 375/430 | Cards and editor modal are scrollable; risk is long reward text wrapping. | Low | Keep; test long code/reward values. | No | No concrete defect found. |
| `/news` | 375/430 | Cards and detail modal stack; risk is long titles and body scroll. | Low | Keep; verify modal close affordance on mobile. | No | Manual QA needed. |
| `/guides` | 375/430 | Placeholder/category cards stack cleanly. | Low | Later replace placeholder strategy with real guide IA. | No | Content not ready. |
| `/apartments` | All | Placeholder route is visible without real content. | Low | Keep as planned surface; decide before public beta whether to hide or label more clearly. | No | Product/content decision. |
| `/community` | All | Placeholder route is visible without real content. | Low | Keep as future surface; avoid account/community features before security. | No | Product/security decision. |
| `/build-planner` | 375/430 | Large, dense planner tabs and controls are high-risk on phone. | High | Do not rewrite runtime now; add trust/status copy and plan formula/layout audit. | Yes, copy only | Runtime changes deferred by phase constraint. |
| `/build-planner` | 768 | Sticky tab rail and side stat panel become dense. | Medium | Later test tablet screenshots and consider planner-specific mobile mode. | No | Larger UX pass. |
| Legal/info routes | 375/430 | Single-column content should be safe. | Low | Review copy before launch. | No | Content/legal review later. |
| `/dev/admin` | 375/430 | Dev panel has two-column layout only at `lg`; mobile stacks. | Low | Keep; verify long select labels and disabled reasons. | No | Local QA only. |
| `/dev/admin` | Production | Route component can render disabled state if URL is typed, but sidebar link is hidden without dev flag. | Medium | Keep current gate; production route hardening can be considered later without removing local QA. | No | Must preserve `/dev/admin`. |

## Summary

The highest mobile risks are Build Planner, character detail, tier-list board interactions, module boards, and the vehicle showcase. The fixes applied now target concrete issues with low blast radius. The remaining risks need screenshot/device QA rather than speculative rewrites.

## Phase 111-120 Follow-Up

Date: 2026-05-18

This follow-up performed a practical route QA pass across 375px, 430px, 768px, 1024px, and desktop by code/layout inspection plus local Vite preview route reachability. All requested routes returned HTTP 200 in preview.

| Route/Area | Phase 111-120 result |
| --- | --- |
| `/build-planner` | Fixed small-desktop header crowding by moving the intro/summary row behavior from `lg` to `xl`. Planner runtime and formulas were not changed. |
| `/vehicles` | Reduced phone/tablet vehicle stage height before `lg` while preserving the fuller desktop showroom height. |
| `/tier-list` | Added mobile-only copy that tells users to swipe horizontally across the tier board. Board behavior was not redesigned. |
| `/apartments` | Replaced generic placeholder copy with planned-section/source-policy copy. |
| `/community` | Replaced generic placeholder copy with planned-section/account-safety copy. |
| `/dev/admin` | Sidebar link remains gated by the dev flag. Direct preview route returns 200 without enabling auth/admin writes. |

Remaining risks: real screenshot QA on browser/device viewports, Build Planner mobile density, character/detail page density, tier-list touch interactions, and Dev Admin enabled-state mobile QA with local-only flags.
