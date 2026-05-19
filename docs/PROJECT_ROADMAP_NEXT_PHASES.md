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

Phase 161-175 preparation note: public beta scope, legal/source posture, SEO metadata, sitemap/robots plan, route sweep, code review, Build Planner posture, and security gate are now documented. The next phase should be release-candidate QA and host configuration, not production writes.

Phase 176-190 RC note: hosting options, SPA fallback, security headers, canonical sitemap workflow, release runbook, rollback plan, launch checklist, and contact/takedown strategy are now documented. Next work should choose a host/domain and verify a preview deployment without enabling writes.

Phase 191-205 static beta candidate note: docs-first preview deployment configs, route refresh QA, mobile screenshot checklist, performance budget, content confidence, and dev/admin exposure audit are now documented. Next work should run an actual preview deployment rehearsal on the selected static host, verify headers/fallback/sitemap, and keep auth/admin writes disabled.

Phase 206-220 static preview rehearsal note: Cloudflare/Netlify host config files are now applied, build output and local preview route verification passed, and the preview verification/go-no-go packet is documented. Next work should create an actual Cloudflare Pages preview URL, verify host fallback/headers/CSP, complete mobile screenshots, select the private contact/takedown channel, verify active codes, review image/media rights, and rehearse rollback before public beta approval.

Phase 221-235 final verification note: no actual preview URL was available, so public beta is still NO-GO. The next phase should create the Cloudflare Pages preview deployment, run host route/header/fallback verification, complete mobile screenshots, resolve contact/code/media blockers, rehearse rollback, and then decide between private friends preview and public read-only beta.

Phase 236-255 V1.1 search/filter note: static-first public discovery has been hardened. Global search now covers characters, weapons, cartridges, module pieces, vehicles, codes, news, and planned guides with route metadata and category matching. Browse pages received small filter, reset, no-results, and source-pending copy improvements. Next work should create the real static preview URL, run host route/header/fallback/mobile checks, manually verify active codes/media/contact, and keep production auth/admin/DB writes disabled.

Phase 256-275 character corpus note: a safe local corpus pipeline now inventories `nevernest-intel`, builds a canonical character map, extracts source-pending candidate notes, and reports conflicts/unmatched files without applying live character data. The corpus produced useful candidates but enough mixed-character and rarity/identity conflicts that pilot apply was deferred. Next character work should manually review `.generated/character-candidates/*`, select one clean non-Nanally character, and hand-apply source-pending notes only after evidence review.

Phase 276-295 character intel pilot note: candidate review selected Lacrimosa for a tiny source-pending notes pilot. Notes are stored separately from canonical character objects, shown only as source-pending Character Detail intel, and indexed at low priority through the canonical character route. Nanally, canonical fields, backend/schema/auth/admin behavior, and Build Planner formulas remain unchanged. Next character work should manually verify Lacrimosa notes against source evidence, then repeat the same pattern for one clean candidate at a time.

Phase 296-315 mobile/visual note: a practical launch UX pass reduced phone-height pressure on Home and Vehicles, improved Topbar search dropdown containment, softened placeholder community/support copy, and tightened a few modal/legal/detail responsive classes. Next release work should use a real preview URL for host fallback/header checks and screenshot QA across 375px, 430px, 768px, 1024px, and desktop.

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

## Phase 316-335 Release-Risk Note

Legal/contact, codes, Build Planner, source confidence, media rights, and unsafe-surface reviews are documented. Public beta remains NO-GO until private contact/takedown intake, real preview URL verification, mobile screenshots, active-code/source review, media/takedown readiness, and rollback rehearsal are complete. Next work should create the preview URL and close those launch gates without enabling auth, registration, production admin writes, or API mode by default.

## Phase 336-355 Real Preview Verification Note

The Cloudflare Pages preview is live and passed route, SPA fallback, security header, robots/sitemap, and AdminMode lockdown checks. Private friends preview is now GO with caveats. Next work should finish the human launch gates: private contact/takedown intake, active-code verification, media/takedown acceptance, mobile screenshot QA, Cloudflare rollback rehearsal, and canonical domain/sitemap approval. Do not enable auth, registration, production admin writes, production DB, broad CRUD, or API mode by default.

## Phase 356-375 Product Polish Note

Sidebar compactness, placeholder labels, account-menu future labels, and Character Detail console visual grouping were tightened for V1.1 polish. Next work should verify the updated preview visually on mobile/short-height layouts, then proceed to structured character data batches. Keep visual placement groups separate from real rarity and keep Build Planner formulas gated on verified data only.

## Phase 376-395 Mobile QA Note

Phone/tablet/desktop/short-height QA is documented. The next phase should redeploy the preview, verify the News copy and horizontal overflow fixes on Cloudflare, then begin structured character data batches. Do not add default stats, crit defaults, formulas, auth, admin writes, production DB, or API mode by default.
