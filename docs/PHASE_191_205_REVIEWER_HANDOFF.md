# Phase 191-205 Reviewer Handoff

## Copy For Reviewer

Phase 191-205 prepares the final static beta candidate package without deploying or enabling writes/auth. It adds docs-first preview deployment config drafts, static preview route refresh QA, manual mobile screenshot checklist, performance budget, content confidence checklist, and dev/admin exposure audit. Local route probing passed for all requested routes. Remaining launch blockers are preview deployment fallback/header verification, mobile screenshot QA, contact/takedown channel, active-code verification, and host/domain approval.

## Changed Files

- `docs/PHASE_191_205_FINAL_STATIC_BETA_CANDIDATE_AUDIT.md`
- `docs/PHASE_191_205_PREVIEW_DEPLOYMENT_CONFIG.md`
- `docs/PHASE_191_205_STATIC_PREVIEW_ROUTE_REFRESH_QA.md`
- `docs/PHASE_191_205_MOBILE_SCREENSHOT_QA.md`
- `docs/PHASE_191_205_PERFORMANCE_BUDGET.md`
- `docs/PHASE_191_205_CONTENT_CONFIDENCE_CHECKLIST.md`
- `docs/PHASE_191_205_DEV_ADMIN_EXPOSURE_AUDIT.md`
- `docs/PHASE_191_205_REVIEWER_HANDOFF.md`
- `docs/PUBLIC_BETA_LAUNCH_CHECKLIST.md`
- `docs/PUBLIC_BETA_RELEASE_RUNBOOK.md`
- `docs/PUBLIC_BETA_ROLLBACK_PLAN.md`
- `docs/DEPLOYMENT_READINESS_CHECKLIST.md`
- `docs/PUBLIC_BETA_GAP_REPORT.md`
- `docs/QA_MASTER_CHECKLIST.md`
- `docs/PROJECT_ROADMAP_NEXT_PHASES.md`
- `docs/RUNTIME_READINESS.md`
- `docs/SECURITY_RISK_REGISTER.md`
- `docs/IMPORT_DRY_RUN_REPORT.md`
- `docs/SEED_PREVIEW_REPORT.md`

## Commands Run

- `npm run server:check` - passed.
- `npm run server:build` - passed.
- `npm run server:test` - passed: 119 tests, 114 pass, 5 skipped, 0 fail.
- `npm run build` - passed.
- `npm run audit:data` - passed: 18 characters, 42 weapons, 12 cartridges, 12 module shapes, 36 module pieces, 16 vehicles, 18 tier rows, 13 codes, 3 news; 0 blockers.
- `npm run import:dry-run` - passed: 0 blockers; report regenerated.
- `npm run server:seed:preview` - passed: 1801 planned rows, 1759 future local import rows, 42 blocked rows, 0 blockers; report regenerated.
- `npm run smoke:static` - passed.
- `npm run sitemap:preview` - passed: 122 public routes, localhost preview origin, `/dev/admin` excluded.
- `npm run preview -- --host 127.0.0.1 --port 4173` plus Node `fetch` route probe - passed: all requested routes returned HTTP 200.

## Commands Not Run And Why

- `npm run check:api-client` - not run; no backend was reachable at `http://127.0.0.1:4000/api/status`.
- `npm run smoke:api-mode` - not run; no backend DB mode server was running.
- `npm run server:test:db:seeded` - not run; no seeded local DB/backend environment was active.
- `npm run smoke:admin-writes` - not run; local auth/admin write env flags were not set.

## Final Beta Gap Conclusion

The project is a static beta candidate but still blocked on selecting host/domain/HTTPS, applying and verifying SPA fallback/security headers on a preview deployment, choosing a public contact/takedown channel, active-code verification, and real mobile screenshot QA.

## Preview Deployment Config Summary

Docs-first drafts were added for Cloudflare Pages, Netlify, and Vercel. Cloudflare Pages remains the recommended static beta host. No platform config file was added.

## Static Preview Route QA Summary

All requested routes returned HTTP 200 from local Vite preview. `/dev/admin` receives the SPA shell but remains disabled in production build and excluded from sitemap/navigation.

## Mobile Screenshot QA Summary

No browser automation dependency exists, so no heavy framework was added. A manual screenshot checklist covers 375, 430, 768, 1024, and 1440 widths across high-risk routes.

## Performance Budget Summary

Current build is acceptable for beta: main JS 123.39 kB gzip, CSS 21.84 kB gzip, largest route chunk `CharacterDetailPage` 37.63 kB gzip, sitemap 122 routes. Remaining risk is mobile/image perception.

## Content Confidence Summary

Codes, Build Planner, Tier List, legal/source posture, sourceStatus, and deferred routes were reviewed. Caveats are acceptable if kept visible; active codes and image/media rights still need final review.

## Dev/Admin Exposure Audit

`/dev/admin` is excluded from sitemap/navigation unless dev flag is set, disabled without `import.meta.env.DEV` and `VITE_ENABLE_DEV_ADMIN_PANEL=1`, and does not change production auth/admin state.

## Backend/Schema/Auth/Admin

- Backend endpoints changed: no.
- DB schema changed: no.
- Auth behavior changed: no.
- Admin behavior changed: no.

## Still Disabled

Deployment, production DB, production auth, public registration, production admin writes, API as default, broad CRUD, entity write endpoints, public submissions/comments, and silent localStorage import.

## Risks/TODOs

- Choose static host/domain.
- Apply preview deployment fallback and headers.
- Run manual mobile screenshot checklist.
- Select public contact/takedown channel.
- Verify active codes.
- Review image/media rights.
- Rehearse rollback on preview deployment.

## Recommended Next Phase

Phase 206-220 should perform an actual static preview deployment rehearsal on the selected host, verify fallback/headers/sitemap/robots/mobile screenshots, and prepare a final go/no-go packet without enabling production auth, admin writes, or database mutations.
