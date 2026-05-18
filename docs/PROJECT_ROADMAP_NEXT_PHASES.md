# Project Roadmap Next Phases

Date: 2026-05-17

This roadmap has two layers:

1. Safe implementation order: preserve the working static/API/local-admin foundation.
2. Best-in-class ambition: build toward a trusted, fast, source-aware NTE fan database with excellent UX, data workflow, and later admin/community capabilities only after security gates.

## Phase 111-120: Continue Mobile/UX Polish If Needed

Status: Phase 111-120 practical QA pass completed on 2026-05-18. Bounded fixes were applied for Build Planner small-desktop header containment, Vehicle Stage phone height, Tier List mobile scroll affordance, and planned-section placeholder copy. Real screenshot/device QA remains recommended.

Goal: complete real viewport QA and fix concrete layout issues found on 375px, 430px, 768px, 1024px, and desktop.

Why it matters: the public-facing experience must feel good on phones, not just pass desktop checks.

Risk: Medium.

Expected checks:

- `npm.cmd run build`
- `npm.cmd run smoke:static`
- manual route sweep on public pages
- screenshot notes for fixed defects

What NOT to touch:

- Do not redesign visual identity.
- Do not change Build Planner runtime behavior.
- Do not enable auth, registration, production admin writes, or API default.

Best-in-class ambition:

- Make dense fan-database views feel calm and scannable on mobile.
- Add consistent empty/error/loading and focus behavior.
- Improve table/card/chip wrapping before adding new features.

## Phase 121-130: Data Structure, SourceStatus, And Admin Workflow Improvements

Status: Phase 121-135 began the display side of this work by fixing cartridge list/detail parity, adding a small sourceStatus badge pattern for cartridge Set Data, and making API failure states less misleading. Phase 136-150 continued this by fixing weapon seeded API detail parity for growth/refinement display and expanding sourceStatus badges to selected high-risk public surfaces.

Goal: prepare the structure and workflow for future data completion without mass-filling or pretending unofficial values are verified.

Why it matters: a best-in-class database is trusted because it shows provenance, uncertainty, and update history.

Risk: Medium to High.

Expected checks:

- `npm.cmd run audit:data`
- `npm.cmd run import:dry-run`
- `npm.cmd run server:seed:preview`
- sourceStatus UI review

What NOT to touch:

- Do not mark unverified rows as verified.
- Do not silently import localStorage overrides.
- Do not add new backend write endpoints.

Best-in-class ambition:

- SourceStatus badges.
- Patch/version and last-updated strategy.
- Verification notes and source notes.
- Admin draft/publish design before production writes.

Near-term follow-up:

- Review seeded API/static count parity for module pieces.
- Add provenance/source notes before mass data completion.
- Keep sourceStatus unknown/needs-verification honest until reviewed.

## Phase 131-140: Advanced Search, Filter, And Compare Foundation

Goal: upgrade browse/discovery foundations without account systems or risky backend writes.

Why it matters: advanced search, filtering, and comparison are high-value fan database features that can remain read-only.

Risk: Medium.

Expected checks:

- static and API mode smoke
- search/filter route QA
- mobile filter QA

What NOT to touch:

- Do not introduce public accounts.
- Do not add comments/contributions.
- Do not require schema changes unless a real mismatch is documented.

Best-in-class ambition:

- Fuzzy global search.
- Compare characters/weapons/modules.
- Better source-aware filters.
- Tier list explanations.
- Code expiry/source tracking.

## Phase 141-150: Build Planner Formula Audit And Verification

Goal: turn Build Planner from a useful prototype into a tested, source-aware calculator.

Why it matters: inaccurate calculators damage trust more than incomplete calculators.

Risk: High.

Expected checks:

- formula inventory
- expected-value fixture tests
- stat/rounding edge case tests
- UI copy review for estimated/verified states

What NOT to touch:

- Do not rewrite formulas before inventory.
- Do not call planner output official/accurate until tests exist.
- Do not change localStorage draft behavior without migration planning.

Best-in-class ambition:

- Explain calculations.
- Inherit sourceStatus into output confidence.
- Support shareable/exportable builds later.
- Add synergy/team recommendation logic only after formulas and data are verified.

## Phase 151-160: Performance, Image, SEO, And Sitemap

Goal: make public pages fast, indexable, and stable for public beta.

Why it matters: polished content still fails if mobile loads are heavy or canonical metadata is weak.

Risk: Medium.

Expected checks:

- `npm.cmd run build`
- bundle/chunk review
- image dimension/format inventory
- sitemap generation after canonical domain choice
- robots/canonical review

What NOT to touch:

- Do not rewrite the asset pipeline without measurements.
- Do not hard-code a temporary production domain.
- Do not make API mode default for SEO convenience.

Best-in-class ambition:

- Bundle budget.
- CDN/cache policy.
- Structured data.
- SEO-friendly public route metadata.
- Image optimization without broken asset paths.

## Phase 161-170: Read-Only Public Beta Deployment

Goal: launch the smallest safe public beta with strong UX and clear scope.

Why it matters: public beta should validate browsing and data presentation while avoiding account/write/security risk.

Risk: High.

Expected checks:

- final static build/smoke
- deployed route sweep
- legal/info/source review
- code source/expiry verification
- module piece parity check using `/api/modules/pieces?limit=100` if API mode is in scope
- security headers check
- rollback checkpoint
- read-only API checks only if API deployment is explicitly in scope

What NOT to touch:

- Do not enable public registration.
- Do not enable production auth.
- Do not enable production admin writes.
- Do not connect local scripts to production DB.

Best-in-class ambition:

- Static-first read-only launch.
- Clear unofficial fan-site posture.
- Public feedback path that does not require accounts.
- Monitoring and analytics only if privacy-safe.

## Later: Production Auth/Admin/User/Community Only After Security Gates

Goal: add real production platform features only after security, moderation, audit, and backup foundations are mature.

Why it matters: account and write surfaces create the highest risk.

Risk: Critical.

Expected gates:

- production auth threat model
- durable audit logs
- production CSRF/session review
- shared rate limiting
- backup/restore rehearsal
- monitoring/error tracking
- permission matrix tests
- moderation plan for public content

What NOT to touch:

- Do not add broad CRUD.
- Do not start with characters/weapons/modules writes.
- Do not treat browser-local AdminMode as authorization.
- Do not store tokens/passwords in browser storage.

Best-in-class ambition:

- Admin draft/publish workflow.
- Audit log viewer.
- Source-status editor.
- Media manager.
- Public contribution queues.
- Favorites/bookmarks and comments only after privacy/security/moderation are ready.

## Recommended Admin Write Order

1. Keep existing local code/news QA stable.
2. Add durable audit logging.
3. Add backup/restore and production rate limiting.
4. Add admin draft/review workflow.
5. Add one low-risk content write after production auth gates.
6. Defer characters, weapons, modules/cartridges, vehicles, and tier-list writes until relational update plans and source workflow are mature.
