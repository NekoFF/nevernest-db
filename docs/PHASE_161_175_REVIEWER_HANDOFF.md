# Phase 161-175 Reviewer Handoff

## Copy For Reviewer

Phase 161-175 keeps beta preparation static-first, read-only, unauthenticated, and unofficial. I strengthened SEO defaults, legal/source copy, code confidence copy, tier-list wording, and sitemap preview generation. Sitemap preview now emits 122 public read-only routes and excludes `/dev/admin`. No deployment, production DB, auth, admin writes, schema, or backend endpoint changes were made.

## Changed Files

- `index.html`
- `package.json`
- `public/robots.txt`
- `scripts/generate-sitemap.mjs`
- `src/pages/CodesPage.jsx`
- `src/pages/TierListPage.jsx`
- `src/pages/LegalInfoPage.jsx`
- `docs/PHASE_161_175_PUBLIC_BETA_SCOPE.md`
- `docs/PHASE_161_175_LEGAL_SOURCE_REVIEW.md`
- `docs/PHASE_161_175_SEO_METADATA_AUDIT.md`
- `docs/PHASE_161_175_SITEMAP_ROBOTS_PLAN.md`
- `docs/PHASE_161_175_PUBLIC_ROUTE_SWEEP.md`
- `docs/PHASE_161_175_CODES_PUBLIC_BETA_REVIEW.md`
- `docs/PHASE_161_175_BUILD_PLANNER_PUBLIC_POSTURE.md`
- `docs/PHASE_161_175_PUBLIC_BETA_SECURITY_GATE.md`
- `docs/PHASE_161_175_FIXES_APPLIED.md`
- `docs/PHASE_161_175_REVIEWER_HANDOFF.md`
- `docs/PUBLIC_BETA_GAP_REPORT.md`
- `docs/DEPLOYMENT_READINESS_CHECKLIST.md`
- `docs/SECURITY_RISK_REGISTER.md`
- `docs/QA_MASTER_CHECKLIST.md`
- `docs/PROJECT_ROADMAP_NEXT_PHASES.md`
- `docs/RUNTIME_READINESS.md`

## Commands Run

| Command | Result |
| --- | --- |
| `npm run server:check` | Pass |
| `npm run server:build` | Pass |
| `npm run server:test` | Pass: 114 passed, 5 DB-gated skipped |
| `npm run build` | Pass |
| `npm run audit:data` | Pass |
| `npm run import:dry-run` | Pass; report regenerated |
| `npm run server:seed:preview` | Pass; report regenerated |
| `npm run smoke:static` | Pass |
| `npm run sitemap:preview` | Pass; generated 122 preview routes |

## Commands Not Run And Why

DB/API/admin checks require a live local seeded DB/backend and local auth/admin env. This environment has no configured `DATABASE_URL`/running backend for those checks, so these were not run:

- `npm run check:api-client`
- `npm run smoke:api-mode`
- `npm run server:test:db:seeded`
- `npm run smoke:admin-writes`

## Public Beta Scope Summary

Read-only, unauthenticated, static-first, no public accounts, no comments/submissions, no production admin writes, no production DB mutations, no official affiliation claim.

## Legal/Source Posture Summary

Public copy now more clearly says unofficial, source review is ongoing, assets belong to rights holders, and a contact/takedown channel must be selected before launch.

## SEO/Metadata Changes

Default `index.html` metadata was improved. Route SEO helper remains in place. Final canonical domain and structured data are deferred.

## Sitemap/Robots Result

`npm run sitemap:preview` generates `.generated/sitemap-preview.xml` with 122 public routes. Production `sitemap:generate` still requires HTTPS `SITE_URL`. `/dev/admin` is excluded.

## Route Sweep Summary

Core read-only routes are beta-appropriate with caveats. `/apartments` and `/community` remain placeholder/deferred and are excluded from sitemap.

## Codes Review Summary

Codes remain 7 active / 6 expired. No source URLs, source labels, or expiry dates were invented. Copy now warns that active status, expiry, and exact rewards may need verification.

## Build Planner Posture

Keep public only as a prototype/local theorycrafting tool. Formula outputs are not verified.

## Public Beta Security Gate

Static read-only beta can proceed only after host, HTTPS, security headers, legal/source, route/mobile QA, and rollback basics. Production auth, registration, writes, and DB mutations stay blocked.

## Backend/Schema/Auth/Admin

- Backend endpoints changed: no.
- DB schema changed: no.
- Auth behavior changed: no.
- Admin behavior changed: no.

## Still Disabled

Production auth, public registration, production admin writes, production DB, deployment, broad CRUD, character/weapon/module/vehicle/tier-list writes, comments/submissions, and silent localStorage import.

## Risks/TODOs

- Choose canonical domain and generate production sitemap.
- Configure SPA fallback and security headers.
- Select public contact/takedown channel.
- Verify active codes.
- Complete browser/mobile route sweep.
- Review image/media rights.

## Recommended Next Phase

Phase 176-190 should be a public beta release-candidate QA pass: browser/mobile screenshots, host config draft, security headers, canonical domain/sitemap finalization, and no production writes.
