# Phase 161-175 Public Beta Scope

Date: 2026-05-18

## Safest Scope

The safest public beta is read-only, unauthenticated, static-first, and explicitly unofficial. It should validate public browsing, route stability, mobile usability, SEO metadata, and source-aware copy without enabling accounts or writes.

## Public Users Can

- Browse characters, weapons, cartridges/modules, vehicles, tier list, codes, news, guides, and legal/info pages.
- Use static search/filter/sort controls.
- Use the Build Planner as a local prototype with verification caveats.
- Save local browser-only planner/personal tier-list drafts where existing static features already do so.
- Copy redeem codes, with source/expiry caveats.

## Public Users Cannot

- Register accounts or log in.
- Comment, submit data, upload files, or create public content.
- Mutate production database records.
- Use `/dev/admin` as a public feature.
- Treat localStorage AdminMode as real authorization.
- Assume the site is official or affiliated with the game owner/publisher.

## Production Admins Cannot Yet

- Use production admin writes.
- Publish character/weapon/module/vehicle/tier-list edits.
- Import localStorage overrides.
- Connect local scripts to production DB.
- Mark data verified without provenance and review workflow.

## Deferred

- Production auth and public accounts.
- Public submissions/comments.
- Production DB-backed writes.
- Broad CRUD.
- Source editor and verified-by workflow.
- Media manager and takedown workflow implementation.
- True API deployment unless explicitly scoped.

## Acceptance Criteria

- Static build and smoke pass.
- Public route sweep has no broken core routes.
- Legal/disclaimer/privacy/contact posture reviewed.
- Codes page clearly states expiry/source uncertainty.
- Build Planner clearly says formula outputs need verification.
- SourceStatus remains visible on high-risk surfaces.
- `robots.txt` and sitemap plan are reviewed.
- `/dev/admin` remains hidden/disabled without local dev flags.
- API mode remains opt-in.

## Rollback Criteria

- Any production auth/admin write surface is exposed.
- Static pages show API failures as zero-data states.
- Public copy implies official affiliation.
- Codes are advertised as verified without source evidence.
- Build Planner outputs are presented as production-accurate.
- Mobile route sweep finds blocking layout defects.
- Deployment host cannot provide SPA fallback or security headers.
