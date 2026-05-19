# Phase 336-355 Preview Route Verification

Date: 2026-05-19

Preview URL: `https://nevernest-db.pages.dev/`

## Result

PASS for direct route availability on the checked preview URL.

## Routes Checked

All routes returned HTTP 200.

| Route | Result |
| --- | --- |
| `/` | 200, app shell |
| `/characters` | 200, app shell |
| `/characters/nanally` | 200, app shell |
| `/characters/lacrimosa` | 200, app shell |
| `/weapons` | 200, app shell |
| `/weapons/good-boys-grand-adventure` | 200, app shell |
| `/weapons/ready-ready` | 200, app shell |
| `/weapons/oraora` | 200, app shell |
| `/modules` | 200, app shell |
| `/modules/devils-blood-curse` | 200, app shell |
| `/modules/lost-radiance` | 200, app shell |
| `/modules/pieces/type-ii-horizontal/s` | 200, app shell |
| `/vehicles` | 200, app shell |
| `/tier-list` | 200, app shell |
| `/codes` | 200, app shell |
| `/news` | 200, app shell |
| `/guides` | 200, app shell |
| `/build-planner` | 200, app shell |
| `/about` | 200, app shell |
| `/disclaimer` | 200, app shell |
| `/privacy` | 200, app shell |
| `/contact` | 200, app shell |
| `/dev/admin` | 200, app shell; rendered disabled state verified separately |
| `/robots.txt` | 200, static asset |
| `/site.webmanifest` | 200, static asset |

## Notes

Raw HTTP route probing can verify direct-open behavior and SPA fallback, but client-rendered state such as `/dev/admin` disabled copy and account-menu contents requires a rendered browser check. Those checks are recorded in `docs/PHASE_336_355_ADMINMODE_LOCKDOWN_VERIFICATION.md`.
