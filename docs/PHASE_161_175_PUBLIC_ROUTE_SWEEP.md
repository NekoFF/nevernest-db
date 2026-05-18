# Phase 161-175 Public Route Sweep

Date: 2026-05-18

This is a static-mode code/config sweep plus build/smoke validation, not a browser screenshot pass.

| Route | Static works? | Beta appropriate? | Copy/source risk | SEO/meta risk | Data confidence risk | Fix/defer |
| --- | --- | --- | --- | --- | --- | --- |
| `/` | yes | yes | Low | Low | Medium | Default metadata improved. |
| `/characters` | yes | yes | Medium | Low | Medium | Keep sourceStatus and incomplete-state copy. |
| `/characters/nanally` | yes | yes | Medium | Low | Medium | No mass-fill; source caveats remain. |
| `/weapons` | yes | yes | Medium | Low | Medium | Existing source badges on details. |
| `/weapons/good-boys-grand-adventure` | yes | yes | Medium | Low | Medium | Included in sitemap. |
| `/weapons/ready-ready` | yes | yes | Medium | Low | Medium | Included in route policy. |
| `/weapons/oraora` | yes | yes | Medium | Low | Medium | Included in route policy. |
| `/modules` | yes | yes | Medium | Low | Medium | Module 36 vs 24 issue already resolved as pagination. |
| `/modules/devils-blood-curse` | yes | yes | Medium | Low | High | Compatible-shape verification remains pending. |
| `/modules/lost-radiance` | yes | yes | Medium | Low | High | Compatible-shape verification remains pending. |
| `/modules/pieces/type-ii-horizontal/s` | yes | yes | Low | Low | Medium | Included in sitemap. |
| `/vehicles` | yes | yes | Medium | Low | Medium | Source/status review remains. |
| `/tier-list` | yes | yes with caveat | "Official" wording risk | Low | High | Visible label changed to Reference and caveat added. |
| `/codes` | yes | yes with caveat | Expiry/source risk | Low | High | Copy now says status/expiry/rewards may need verification. |
| `/news` | yes | yes | Medium | Low | Medium | Source labels still sparse. |
| `/guides` | yes | cautiously | Placeholder/sparse guide content | Low | Medium | Include in sitemap because public route exists; content expansion deferred. |
| `/apartments` | yes placeholder | no for primary beta nav | Placeholder section | Medium | High | Excluded from sitemap; leave parked. |
| `/community` | yes placeholder | no | Privacy/moderation not ready | Medium | High | Excluded from sitemap; leave parked. |
| `/build-planner` | yes | yes if prototype-labelled | Formula verification risk | Low | High | Existing prototype copy retained; posture documented. |
| `/about` | yes | yes | Low | Low | Low | No issue. |
| `/disclaimer` | yes | yes | Low | Low | Low | Asset/takedown copy added. |
| `/privacy` | yes | yes | Low | Low | Low | No-public-accounts copy added. |
| `/contact` | yes | yes with launch task | Public channel missing | Low | Low | Do not invent channel; select before launch. |
| `/dev/admin` | local disabled/flagged | no | High if exposed | Excluded | High | Keep hidden/disabled without dev flag. |

## Summary

Core read-only routes are public-beta appropriate with caveats. `/apartments` and `/community` should remain placeholder/deferred and are excluded from sitemap. `/build-planner` can be public only as a prototype/needs-verification tool.
