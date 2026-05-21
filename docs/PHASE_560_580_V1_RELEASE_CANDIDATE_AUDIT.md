# Phase 560-580 - V1 Release Candidate Audit

Date: 2026-05-21

## Release Scope

- Public read-only website.
- Static/localStorage frontend remains the default.
- No public login, registration, comments, public accounts, production admin writes, production DB mutation, or API mode by default.
- Admin and dev tooling must stay hidden or disabled in production.
- Character filling continues separately; this audit covers the release shell.

## Final Recommendation

GO for the V1 read-only shell, ignoring remaining character filling.

This is not a full public launch GO until human launch gates are closed: final contact/takedown route, active code/source acceptance, media/takedown acceptance, rollback rehearsal, and canonical HTTPS `SITE_URL` approval.

## Blockers Found

None.

## Fixes Applied

- Restored Topbar/search to full content width after the narrow layout regression.
- Strengthened sticky Topbar visual separation with a higher z-index, matte glass background, stronger floating shadow, backdrop blur, and inner highlight.
- Kept the Back to Characters button visually subordinate to the wider global Topbar/search surface.
- Disabled deferred account-menu actions (`Sign in`, `Saved Builds`, `Profile`, `Theme`, `Settings`) so they no longer appear as functional login/account controls.

No character data, Build Planner formulas/runtime, backend defaults, auth gates, production write paths, DB schema, or API-mode defaults were changed.

## Routes Checked

HTTP preview route check returned 200 for:

- `/`
- `/characters`
- `/characters/nanally`
- `/characters/skia`
- `/characters/mint`
- `/weapons`
- `/modules`
- `/vehicles`
- `/tier-list`
- `/codes`
- `/news`
- `/guides`
- `/build-planner`
- `/about`
- `/disclaimer`
- `/privacy`
- `/contact`
- `/dev/admin`

Rendered Edge/CDP check confirmed each route had populated `main` content and no raw crash text. `/dev/admin` rendered `Dev Admin Panel Disabled`.

## Responsive Checks

Measured with built preview at:

- `1920x1080`
- `1440x900`
- `1366x768`
- `1280x800`
- `1024x768`
- `768x1024`
- `430x932`
- `390x844`
- `375x812`

Focused routes:

- `/characters`
- `/characters/skia`
- `/characters/nanally`
- `/weapons`
- `/modules`
- `/build-planner`

Result:

- No horizontal overflow found.
- Account dropdown was not clipped.
- AdminMode/Exit AdminMode text was not visible.
- Back button was not wider than the Topbar on character detail routes.
- Topbar width is restored to a wide content-surface posture on desktop/laptop and remains contained on tablet/mobile.

## Admin/Security Exposure Result

- `src/admin/adminModeGate.js` keeps browser-local AdminMode available only in Vite dev with `VITE_ENABLE_BROWSER_ADMIN_MODE=1`.
- Production build ignores old localStorage admin mode and override collections.
- Sidebar dev-admin link is hidden unless `DEV` and `VITE_ENABLE_DEV_ADMIN_PANEL=1`.
- `/dev/admin` remains routed but gated and disabled without the dev flag.
- Production rendered check showed no `Admin Mode`, `Exit Admin Mode`, or edit/pencil controls.
- No production write UI was exposed.
- Account/login-looking menu actions are disabled and labelled as later.

## Legal/Public Copy Result

- About explains the site purpose as an unofficial community database.
- Disclaimer states unofficial fan-site status and ownership caveats.
- Privacy matches current reality: no public accounts, payments, analytics, ads, or tracking cookies; localStorage is browser-local.
- Contact does not invent an email; it clearly says a stable private contact/takedown route must be selected before public launch.
- Codes page includes source/expiry caveats.
- Tier List copy uses reference/source-review-pending language and does not claim official status.
- Build Planner is labelled as a local prototype with unverified formula/source-review caveats.
- Guides/community/apartments remain planned/source-pending instead of broken production content.

## SEO/Sitemap/Robots

- `index.html` includes title and meta descriptions.
- Route SEO helper is active on public pages.
- `npm.cmd run sitemap:preview` generated `.generated/sitemap-preview.xml`.
- Sitemap preview generated 122 routes and excludes `/dev/admin`, `/admin-dev`, and admin/API write surfaces.
- `robots.txt` does not point to a fake production domain.
- Production sitemap generation still requires an approved HTTPS `SITE_URL`.

## Commands Run

- `npm.cmd run build` - pass. Vite emitted the existing large chunk warning for `assets/index-*.js`.
- `npm.cmd run smoke:static` - pass.
- `npm.cmd run sitemap:preview` - pass, 122 routes, `/dev/admin` excluded.
- `npm.cmd run test:character-intel` - pass, 4 tests.
- `npm.cmd run test:search` - pass, 9 tests.
- `npm.cmd run audit:data` - pass, 0 blockers, 0 warnings, 12 needs-verification cartridge compatible-shape notes.
- `npm.cmd run import:dry-run` - pass, 0 blockers, 48 needs-verification rows.
- `npm.cmd run server:check` - pass.
- `npm.cmd run server:build` - pass.
- `npm.cmd run server:test` - pass, 114 passed, 5 skipped.
- Built preview route check - pass, all requested routes returned 200.
- Headless Edge/CDP rendered route and viewport checks - pass.

## Remaining TODO Before Public Launch

SHOULD FIX BEFORE V1:

- Select and publish the real private contact/takedown route.
- Manually accept active-code/source posture for the launch snapshot.
- Manually accept media rights/takedown posture for the launch snapshot.
- Rehearse rollback on the selected host.
- Approve canonical HTTPS `SITE_URL`, then generate production sitemap.
- Redeploy and repeat a final preview smoke after these local changes land.

NICE TO HAVE AFTER V1:

- Reduce the large main bundle warning through further chunking.
- Fill remaining character data in separate source-reviewed batches.
- Expand planned guides/community/apartments content.
- Clean up media aliases and filename mismatches.
- Add real account/saved-build/comment features only after privacy, auth, moderation, and production write designs are approved.

## GO / NO-GO

GO for V1 read-only shell readiness.

NO-GO for unconstrained public launch until the human launch gates above are completed.
