# Best In Class Feature Roadmap

Date: 2026-05-17

Goal: make the NTE Community Database better than typical fan database sites while preserving safety, source quality, and maintainability.

## A. Must Have Before Public Beta

| Feature | Value to users | Complexity | Risk | Prerequisites | Recommended phase | What not to do prematurely |
| --- | --- | --- | --- | --- | --- | --- |
| Mobile/tablet QA polish | Makes core browsing comfortable on real devices | Medium | Medium | Current responsive shell | 111-120 | Do not redesign visual identity |
| Clear incomplete/sourceStatus presentation | Prevents unofficial data from looking official | Medium | Medium | Source policy and UI badge patterns | 121-130 | Do not mark data verified without evidence |
| Legal/disclaimer/source review | Sets fan-site expectations | Low | High if skipped | Public copy review | 161-170 | Do not publish ambiguous licensing claims |
| Read-only launch runbook | Makes beta repeatable and reversible | Medium | Medium | Deployment choice | 161-170 | Do not deploy mutable DB/admin features |
| Sitemap/robots/canonical host | Helps discovery and avoids bad indexing | Low | Low | Domain selected | 151-160 | Do not hard-code a temporary host |
| Performance budget | Keeps mobile UX credible | Medium | Medium | Build output baseline | 151-160 | Do not over-optimize with risky rewrites |

## B. Strongly Recommended Before Public Beta

| Feature | Value to users | Complexity | Risk | Prerequisites | Recommended phase | What not to do prematurely |
| --- | --- | --- | --- | --- | --- | --- |
| Advanced filter polish | Faster character/weapon/module browsing | Medium | Low | Current filters | 131-140 | Do not introduce new data model requirements |
| SourceStatus badges on key data | Builds trust | Medium | Medium | Source policy | 121-130 | Do not badge unknown values as official |
| Code expiry/source tracking | Reduces stale code frustration | Low | Low | Codes data fields | 121-130 | Do not add code write surfaces in production |
| Tier list explanations | Makes rankings understandable | Medium | Medium | Tier list content model | 131-140 | Do not invent rankings or official rationale |
| Build Planner warning/status copy | Protects trust before formula verification | Low | Low | Current planner | 96-110 | Do not rewrite formulas yet |
| Image loading/decoding hygiene | Improves perceived speed | Low | Low | Existing assets | 96-110/151-160 | Do not rewrite asset pipeline yet |

## C. After Beta / Quality Expansion

| Feature | Value to users | Complexity | Risk | Prerequisites | Recommended phase | What not to do prematurely |
| --- | --- | --- | --- | --- | --- | --- |
| Fuzzy global search | Users find entities despite spelling/alias uncertainty | Medium | Low | Search index shape | 131-140 | Do not add external search service first |
| Compare characters/weapons/modules | Helps decisions | Medium | Medium | Normalized comparable fields | 131-140 | Do not compare unverified formulas as facts |
| Character detail changelog | Shows data freshness | Medium | Medium | `lastUpdated`, source notes, admin workflow | 121-130 | Do not add public edits |
| Patch history | Helps meta/history readers | Medium | Medium | Patch version field strategy | 121-130 | Do not pretend unknown patch data is complete |
| Guide system improvements | Moves beyond placeholder pages | Medium | Medium | Content model and editorial policy | 131-140 | Do not enable community posting yet |
| Media manager planning | Reduces asset drift | High | Medium | Admin workflow and source policy | Later | Do not expose upload writes without auth/security |
| Privacy-safe analytics | Helps product decisions | Medium | Medium | Privacy policy and consent posture | 161-170 | Do not collect personal data silently |

## D. Advanced Best-In-Class Features

| Feature | Value to users | Complexity | Risk | Prerequisites | Recommended phase | What not to do prematurely |
| --- | --- | --- | --- | --- | --- | --- |
| Build Planner 2.0 | High-trust theorycrafting and shareable builds | High | High | Formula audit, expected fixtures, sourceStatus | 141-150+ | Do not release as verified until tests pass |
| Synergy recommendations | Helps team building | High | High | Verified skills, roles, tags, formula model | Later | Do not generate opaque recommendations |
| Team templates | Gives practical starting points | Medium | Medium | Verified characters/roles and editorial notes | Later | Do not imply official meta if community-made |
| Weapon/module recommendation logic | Better build guidance | High | High | Verified stats, formulas, source policy | Later | Do not rank on incomplete fields |
| Admin draft/publish workflow | Safer data operations | High | High | Production auth, permissions, audit logs | Later after security gates | Do not add production writes first |
| Audit log viewer | Operational transparency | Medium | High | Durable audit logs and auth | Later after security gates | Do not expose logs publicly |
| Admin source-status editor | Better verification workflow | Medium | High | Durable auth/admin workflow | Later after security gates | Do not allow unreviewed verification |
| Monitoring/admin health dashboard | Operational confidence | Medium | Medium | Monitoring infrastructure | 161-170+ | Do not expose sensitive internals publicly |
| SEO structured data | Better search presence | Medium | Low | Stable public URLs and content | 151-160 | Do not overstate unofficial content |
| i18n/localization readiness | Wider audience | High | Medium | Content model and stable UI text | Later | Do not mix languages ad hoc in core UI |

## E. Dangerous Until Auth/Security/Moderation Is Mature

| Feature | Value to users | Complexity | Risk | Prerequisites | Recommended phase | What not to do prematurely |
| --- | --- | --- | --- | --- | --- | --- |
| User accounts | Saved builds, preferences, future community | High | Critical | Production auth, privacy, monitoring | Later | Do not enable registration now |
| Favorites/bookmarks sync | Personal utility | Medium | High | User accounts and privacy | Later | Keep local-only until auth exists |
| Public contributions | Faster data growth | High | Critical | Moderation, audit, review queue, auth | Much later | Do not allow direct writes |
| Community comments | Engagement | High | Critical | Moderation, abuse handling, privacy | Much later | Do not ship without moderation |
| Public build sharing | Useful theorycrafting | High | High | Spam controls, privacy, stable planner | Later | Do not publish unverified planner outputs as official |
| Production admin writes | Operational necessity eventually | High | Critical | Auth, CSRF, rate limits, audit, backups | Later after gates | Do not add broad CRUD |

## Product Principle

Best-in-class should mean trusted, fast, explainable, source-aware, and pleasant on mobile. It should not mean rushing account/community/admin features before the security and moderation foundations are ready.
