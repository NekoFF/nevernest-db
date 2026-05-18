# Phase 221-235 Preview Route Verification

Date: 2026-05-18

Preview URL: `TBD`

## Result

Not run against a real preview URL because no preview deployment URL is available.

Local build and Phase 206-220 local preview probes passed previously, but that is not host-level preview verification.

## Route Matrix

| Route | URL | HTTP status | Renders expected page? | Refresh works? | Beta appropriate? | Issue/fix/defer |
| --- | --- | ---: | --- | --- | --- | --- |
| `/` | `TBD/` | Not run | Not verified on host | Not verified on host | Pending | Requires preview URL. |
| `/characters` | `TBD/characters` | Not run | Not verified on host | Not verified on host | Pending | Requires preview URL. |
| `/characters/nanally` | `TBD/characters/nanally` | Not run | Not verified on host | Not verified on host | Pending | Requires preview URL. |
| `/weapons` | `TBD/weapons` | Not run | Not verified on host | Not verified on host | Pending | Requires preview URL. |
| `/weapons/good-boys-grand-adventure` | `TBD/weapons/good-boys-grand-adventure` | Not run | Not verified on host | Not verified on host | Pending | Requires preview URL. |
| `/weapons/ready-ready` | `TBD/weapons/ready-ready` | Not run | Not verified on host | Not verified on host | Pending | Requires preview URL. |
| `/weapons/oraora` | `TBD/weapons/oraora` | Not run | Not verified on host | Not verified on host | Pending | Requires preview URL. |
| `/modules` | `TBD/modules` | Not run | Not verified on host | Not verified on host | Pending | Requires preview URL. |
| `/modules/devils-blood-curse` | `TBD/modules/devils-blood-curse` | Not run | Not verified on host | Not verified on host | Pending | Requires preview URL. |
| `/modules/lost-radiance` | `TBD/modules/lost-radiance` | Not run | Not verified on host | Not verified on host | Pending | Requires preview URL. |
| `/modules/pieces/type-ii-horizontal/s` | `TBD/modules/pieces/type-ii-horizontal/s` | Not run | Not verified on host | Not verified on host | Pending | Requires preview URL. |
| `/vehicles` | `TBD/vehicles` | Not run | Not verified on host | Not verified on host | Pending | Requires preview URL and mobile QA. |
| `/tier-list` | `TBD/tier-list` | Not run | Not verified on host | Not verified on host | Pending | Requires preview URL and wording check. |
| `/codes` | `TBD/codes` | Not run | Not verified on host | Not verified on host | Pending | Requires active-code verification. |
| `/news` | `TBD/news` | Not run | Not verified on host | Not verified on host | Pending | Requires preview URL. |
| `/guides` | `TBD/guides` | Not run | Not verified on host | Not verified on host | Pending | Requires preview URL. |
| `/build-planner` | `TBD/build-planner` | Not run | Not verified on host | Not verified on host | Pending | Requires prototype label check. |
| `/about` | `TBD/about` | Not run | Not verified on host | Not verified on host | Pending | Requires preview URL. |
| `/disclaimer` | `TBD/disclaimer` | Not run | Not verified on host | Not verified on host | Pending | Requires legal copy check. |
| `/privacy` | `TBD/privacy` | Not run | Not verified on host | Not verified on host | Pending | Requires preview URL. |
| `/contact` | `TBD/contact` | Not run | Not verified on host | Not verified on host | Pending | Blocked until private channel selected. |
| `/dev/admin` | `TBD/dev/admin` | Not run | Not verified on host | Not verified on host | Not public | Must render disabled state if opened directly. |
| `/robots.txt` | `TBD/robots.txt` | Not run | Not verified on host | n/a | Pending | Requires preview URL. |
| `/site.webmanifest` | `TBD/site.webmanifest` | Not run | Not verified on host | n/a | Pending | Requires preview URL. |

## Decision

Host route verification is incomplete. Public beta remains NO-GO.
