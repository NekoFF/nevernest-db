# Phase 456-480 Soft Matte Adaptive Glass

## Design Goal

Upgrade the existing light/minimal NTE Community Database UI into a more premium, iOS-like visual system without changing information architecture, content data, backend behavior, auth gates, or Build Planner calculations.

The target material balance is:

- 70% clean solid UI for readable database content.
- 20% softly elevated premium surfaces for cards and panels.
- 10% subtle matte glass for compact controls, topbar/search, tabs, filters, floating controls, and menus.

## What Changed

- Added global visual tokens in `src/index.css` for app background, solid/elevated/glass surfaces, soft and glass borders, focus ring, shadows, radius scale, spacing, text colors, rose accent, and mint/cyan accents.
- Added reusable utility classes: `.surface-solid`, `.surface-elevated`, `.surface-glass`, `.surface-glass-soft`, `.surface-glass-strong`, `.pill-soft`, `.pill-glass`, `.control-glass`, `.card-premium`, `.floating-glass`, `.interactive-soft`, `.premium-input`, and `.premium-select`.
- Tightened app shell spacing and max width for laptop density.
- Upgraded topbar, search input, search results, notification menu, and account menu to subtle matte glass.
- Upgraded sidebar surface, active nav state, legal/footer links, community/support blocks, and short-height density hooks.
- Upgraded home hero, category cards, stat tiles, character cards, weapon cards, cartridge cards, filter bars, character tabs, guide/legal panels, tier-list panels, Character Detail panels, and Build Planner panels.
- Added min-width and select/input safety hooks for dense rows and planner controls.

## Where Glass Is Used

- Topbar shell and compact topbar controls.
- Search command input, search result dropdown, shortcut pill, notification menu, account menu.
- Sidebar active navigation capsule, compact footer/utility blocks, theme/support controls.
- Filter bars, mini filter floaters, segmented tabs, sort/view controls.
- Character detail tabs and back button.
- Home hero carousel controls and small stat surfaces.
- Build Planner tab rail, draft/export utility controls, module library, and select controls.
- Tier-list mode/control bars and pool filters.

Glass is intentionally small/medium/floating. It is not applied to full-page containers or long text-heavy blocks.

## Where Solid Surfaces Remain

- Dense character, weapon, module, cartridge, skill, material, and stat content remains solid/elevated.
- Character Detail long prose, skill blocks, material grids, console details, and source-pending notes stay readable on solid or softly elevated backgrounds.
- Build Planner calculation panels and stat summaries stay solid/elevated.
- Tier-list board rows remain solid/elevated so labels and character tokens stay legible.
- Legal/about pages remain mostly solid cards for readability.

## Laptop Breakpoint Notes

Added compact behavior for common MacBook/Cursor embedded-browser sizes:

- `1440x900`
- `1366x768`
- `1280x800`
- `1180x820`
- `1024x768`

The pass reduces app padding, content gaps, sidebar width, topbar height pressure, hero height, category-card height, compact row column widths, and planner side-panel width. Dense grids use `minmax(0, 1fr)` patterns where practical and global `min-width: 0` safety for inputs/selects.

## Mobile Safety Notes

The material layer keeps mobile blur lighter and avoids applying heavy glass to large full-screen containers. Mobile drawer sizing remains capped to `calc(100vw - 2rem)`, topbar/search dropdown remains viewport-constrained, and mini filter floaters keep horizontal scroll containment.

Target viewports for QA:

- `430x932`
- `390x844`
- `375x812`
- `768x1024`

## Performance Notes

- `backdrop-filter` is limited to topbar, small controls, menus, compact filter/tabs, and floating elements.
- Dense cards and panels use solid/elevated surfaces instead of heavy blur.
- A `@supports not` fallback returns glass utilities to nearly solid white surfaces with normal shadows.
- No large animated blur regions were added.
- Decorative large circular blur accents were reduced in Character Detail material/overview areas.

## Intentionally Not Changed

- Character data, including Nanally, Skia, and Mint content.
- Build Planner formulas, runtime calculation logic, or export payload logic.
- Backend endpoints.
- DB schema.
- Auth/login/registration.
- Production admin writes.
- AdminMode availability or `/dev/admin` gating.
- `sourceStatus` meaning.
- Route structure or public pages.
