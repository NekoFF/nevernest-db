# Accessibility UX Quality Audit

Date: 2026-05-17

## Summary

The app has a reasonable accessibility foundation for a local prototype: most interactive elements are real buttons, many icon buttons have labels, modals use `role="dialog"` and `aria-modal`, form inputs often have labels, and topbar search has an accessible label. The remaining issues are typical for a rich single-page app and should be worked down before public beta.

## Findings

| Area | Risk | Recommendation | Fixed now? |
| --- | --- | --- | --- |
| Icon/action buttons | Some icon buttons rely on title or visual context | Ensure every icon-only button has `aria-label` | Partial existing; no broad pass |
| Modals | Dialogs do not consistently trap focus or restore focus | Add focus trap/return pattern later | No |
| Escape key | Some menus close on Escape; not all modals have consistent Escape handling | Add shared modal/menu behavior later | No |
| Focus states | Many buttons have hover states; focus-visible coverage is uneven | Add consistent focus-visible utility pass | No |
| Search input | Search has label and keyboard shortcut | Keep; later add suggestion keyboard navigation | No |
| Search suggestions | Dropdown needed viewport containment | Add max-height/scroll | Yes |
| Forms | Most editor fields use labels; some custom toggles/selects need review | Audit all admin/editor fields later | No |
| Color contrast | Main text contrast is strong; subtle gray text should be sampled | Run contrast audit before beta | No |
| Semantic headings | Pages generally use `h1`, section titles vary | Normalize hierarchy during page polish | No |
| Empty/error states | Existing `EmptyState` gives clear copy and retry actions | Continue pattern | No |
| Mobile tap targets | Most controls are 40px+; dense chips need real-device QA | Verify on 375/430px | No |
| Horizontal scroll areas | Tier list and chip rails use horizontal scroll | Add stronger visual affordances if user testing shows confusion | No |

## Small Fixes Applied

- Topbar suggestion dropdown now scrolls instead of clipping content.
- Topbar mobile input spacing is more usable.
- Sidebar support label is readable.
- Build Planner copy now communicates prototype/verification status.
- Prominent images have async decode hints.

## Next Accessibility Pass

1. Add shared focus-visible styling for buttons, links, selects, and inputs.
2. Add focus trap and return-focus utilities for modals.
3. Add keyboard navigation for topbar search suggestions.
4. Review all custom toggles for accessible state announcements.
5. Run contrast checks for gray text and pink-on-light combinations.
6. Test with keyboard-only navigation on static public routes.
