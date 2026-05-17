# Phase 111-120 Mobile Tablet QA

Date: 2026-05-18

Scope: real practical mobile/tablet route QA for the public frontend shell and high-risk pages. This pass used code/layout inspection, production build verification, and local Vite preview route reachability because no Playwright/Puppeteer browser automation dependency is present in the project.

Viewports audited: 375px mobile, 430px large phone, 768px tablet, 1024px small desktop, and full desktop.

Local preview route check: all requested routes returned HTTP 200 from `npm.cmd run preview -- --host 127.0.0.1 --port 4173`.

| Route | Viewport | Issue found | Severity | Action taken | Deferred reason if not fixed | Manual verification note |
| --- | --- | --- | --- | --- | --- | --- |
| Global shell | 375/430 | Sidebar link for `/dev/admin` remains hidden unless dev flag is enabled. Direct route renders through the app shell. | Low | Confirmed by code inspection and preview reachability. | No change needed. | Verify direct `/dev/admin` shows disabled/local-only state when flag is missing. |
| Global shell | 375/430/768 | Topbar search/dropdowns already had viewport containment from Phase 96-110. | Low | No new code change. | Needs real device keyboard QA later. | Check search suggestions with mobile keyboard open. |
| `/` | 375/430/768/1024/desktop | Responsive hero/card layout appears structurally safe. | Low | No code change. | No concrete defect found. | Preview route returned 200. |
| `/characters` | 375/430/768/1024/desktop | Grid/list breakpoints and mini filters appear contained. | Low | No code change. | Needs visual screenshot/device QA. | Confirm card density and mini filter rail by hand. |
| `/characters/nanally` | 375/430/768 | Dense detail sections remain a mobile risk, especially tabs, stat/material cards, and long labels. | Medium | No runtime rewrite. | Needs screenshot QA and possibly a later character detail pass. | Confirm no page-level horizontal overflow and tabs scroll locally. |
| `/weapons` | 375/430/768 | Card/list grids and filters appear contained. | Low | No code change. | No concrete defect found. | Preview route returned 200. |
| `/weapons/good-boys-grand-adventure` | 375/430/768 | Long weapon refinement text remains dense but structurally contained. | Medium | No code change. | Needs content-density review, not a quick layout fix. | Check growth/refinement tables on phone. |
| `/modules` | 375/430/768 | Filters/chips wrap and mini filter rail is intentionally horizontal. | Low | No code change. | No concrete defect found. | Confirm long element labels remain tappable. |
| `/modules/lost-radiance` | 375/430/768 | Compatible module cards are dense but use wrapping and stacked grids. | Medium | No code change. | Needs visual screenshot QA. | Confirm shape cards and stat tables remain readable. |
| `/modules/pieces/type-ii-horizontal/S` | 375/430/768 | Module piece detail stacks naturally; badge row wraps. | Low | No code change. | No concrete defect found. | Preview route returned 200. |
| `/vehicles` | 375/430 | Showcase stage consumed too much vertical space on phones. | Medium | Reduced mobile/small-tablet stage and image max heights while preserving large desktop height. | None. | Verify selected vehicle remains centered and not clipped. |
| `/vehicles` | 768/1024/desktop | Vehicle stage should retain the fuller showroom composition at `lg` and above. | Low | Kept `lg:min-h-[500px]` and desktop max image height. | None. | Confirm desktop composition still feels cinematic. |
| `/tier-list` | 375/430 | Board intentionally scrolls horizontally but lacked an obvious mobile affordance. | Medium | Added mobile-only swipe guidance above the board. | Board redesign deferred. | Confirm horizontal board scroll remains scoped to the board. |
| `/tier-list` | 768/1024/desktop | Board width is intentional; desktop/tablet interaction still needs touch/mouse QA. | Medium | No structural change. | Drag/tap behavior should be tested on real devices. | Confirm tap-to-send path on touch devices. |
| `/codes` | 375/430/768 | Cards and admin-disabled public view appear contained. | Low | No code change. | No concrete defect found. | Check long reward text manually. |
| `/news` | 375/430/768 | News cards and modal-style detail remain a scroll-density risk. | Low | No code change. | Needs real visual QA. | Confirm body scroll and close button on phone. |
| `/guides` | 375/430/768 | Placeholder/category surface appears intentional enough for current phase. | Low | No code change. | Guide IA/content deferred. | Preview route returned 200. |
| `/apartments` | 375/430/768 | Placeholder copy was generic and could feel broken. | Low | Updated copy to say it is a planned section pending source policy. | None. | Confirm route feels parked, not broken. |
| `/community` | 375/430/768 | Placeholder copy did not clearly say accounts/comments are not enabled. | Low | Updated copy to clarify community tools are later and no accounts/comments/submissions are enabled. | None. | Confirm no public account expectation is created. |
| `/build-planner` | 375/430 | Planner is dense; tabs and controls rely on horizontal scroll/stacking. | High | No runtime/calculation change. | Larger planner mobile mode and formula verification remain future work. | Confirm sticky tabs scroll and controls remain tappable. |
| `/build-planner` | 1024 | Header summary pills could force a cramped `lg` row next to the title in the app shell. | Medium | Moved header row breakpoint/min-width to `xl`, so 1024 stacks more safely. | None. | Confirm summary pills stack below intro at 1024. |
| `/about` | 375/430/768 | Legal/info content is single-column and safe. | Low | No code change. | Legal copy review remains before launch. | Preview route returned 200. |
| `/disclaimer` | 375/430/768 | Legal/info content is single-column and safe. | Low | No code change. | Legal copy review remains before launch. | Preview route returned 200. |
| `/privacy` | 375/430/768 | Legal/info content is single-column and safe. | Low | No code change. | Legal copy review remains before launch. | Preview route returned 200. |
| `/contact` | 375/430/768 | Legal/info content is single-column and safe. | Low | No code change. | Public contact policy remains before launch. | Preview route returned 200. |
| `/dev/admin` without flag | 375/430/768/1024/desktop | Direct route is reachable but should stay safe/disabled without the dev flag. | Medium | Confirmed sidebar link remains gated; no auth/admin behavior changed. | Enabled panel mobile QA needs local dev flag session. | Preview route returned 200 without enabling writes. |
| `/dev/admin` with flag | 375/430/768 | Enabled panel not exercised in this pass. | Medium | Deferred. | Requires local dev env flag and, for write actions, local admin credentials. | Run local-only admin QA when credentials are intentionally provided. |

## Summary

Concrete fixes were limited to layout/copy containment: Build Planner small-desktop header stacking, Vehicle Stage mobile height, Tier List mobile horizontal-scroll affordance, and planned-section copy for Apartments/Community. Remaining mobile risks are mostly dense-page visual QA rather than obvious broken layout.
