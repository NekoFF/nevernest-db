# Phase 176-190 Reviewer Handoff

## Copy For Reviewer

Phase 176-190 creates the read-only public beta release-candidate package: RC gap audit, hosting comparison, SPA fallback plan, security headers draft, route RC sweep, canonical sitemap workflow, release runbook, rollback plan, launch checklist, and contact/takedown strategy. It does not deploy, choose a real domain, connect production DB, or enable auth/admin writes. Only a small Contact copy clarification was made.

## Changed Files

- `src/pages/LegalInfoPage.jsx`
- `docs/PHASE_176_190_PUBLIC_BETA_RC_GAP_AUDIT.md`
- `docs/PHASE_176_190_HOSTING_OPTIONS.md`
- `docs/PHASE_176_190_SPA_FALLBACK_PLAN.md`
- `docs/PHASE_176_190_SECURITY_HEADERS_DRAFT.md`
- `docs/PHASE_176_190_PUBLIC_ROUTE_RC_SWEEP.md`
- `docs/PHASE_176_190_CANONICAL_SITEMAP_WORKFLOW.md`
- `docs/PUBLIC_BETA_RELEASE_RUNBOOK.md`
- `docs/PUBLIC_BETA_ROLLBACK_PLAN.md`
- `docs/PUBLIC_BETA_LAUNCH_CHECKLIST.md`
- `docs/PHASE_176_190_CONTACT_TAKEDOWN_STRATEGY.md`
- `docs/PHASE_176_190_REVIEWER_HANDOFF.md`
- `docs/DEPLOYMENT_READINESS_CHECKLIST.md`
- `docs/PUBLIC_BETA_GAP_REPORT.md`
- `docs/SECURITY_RISK_REGISTER.md`
- `docs/QA_MASTER_CHECKLIST.md`
- `docs/PROJECT_ROADMAP_NEXT_PHASES.md`
- `docs/RUNTIME_READINESS.md`

## Commands Run

- `npm run server:check` - passed.
- `npm run server:build` - passed.
- `npm run server:test` - passed: 119 tests, 114 pass, 5 skipped, 0 fail.
- `npm run build` - passed.
- `npm run audit:data` - passed: 18 characters, 42 weapons, 12 cartridges, 12 module shapes, 36 module pieces, 16 vehicles, 18 tier rows, 13 codes, 3 news; 0 blockers.
- `npm run import:dry-run` - passed: 0 blockers; report regenerated.
- `npm run server:seed:preview` - passed: 1801 planned rows, 1759 future local import rows, 42 blocked rows, 0 blockers; report regenerated.
- `npm run smoke:static` - passed.
- `npm run sitemap:preview` - passed: generated `.generated/sitemap-preview.xml` with 122 public routes.
- Local preview route probe - passed: all requested routes returned HTTP 200 from `npm run preview -- --host 127.0.0.1 --port 4173`.

## Commands Not Run And Why

- `npm run check:api-client` - not run; no backend was reachable at `http://127.0.0.1:4000/api/status`.
- `npm run smoke:api-mode` - not run; no backend DB mode server was running.
- `npm run server:test:db:seeded` - not run; no seeded local DB/backend environment was active, and empty DB tests must not be run against a seeded DB.
- `npm run smoke:admin-writes` - not run; local auth/admin write env flags were not set.

## RC Gap Audit Summary

Main blockers are host/domain/HTTPS, SPA fallback, security headers, contact/takedown channel, active-code verification, browser/mobile route sweep, and rollback rehearsal.

## Hosting Recommendation

Cloudflare Pages for static beta; Netlify is close second. Keep API/backend out of first beta unless separately approved.

## SPA Fallback Summary

Every public client route must serve `index.html` on direct load/refresh. Static assets and metadata files must remain real files.

## Security Headers Draft Summary

Docs include CSP, HSTS, frame, referrer, permissions, content-type, COOP, and CORP drafts. Not applied until host is selected and verified.

## Route Sweep Summary

Core public routes are beta-appropriate with caveats and returned HTTP 200 from local preview direct-route probes. Production direct refresh risk remains until host fallback is configured. `/dev/admin` is excluded from sitemap/navigation and the production build keeps the panel disabled by runtime gate.

## Sitemap/Canonical Workflow Summary

Preview sitemap remains local. Production sitemap requires approved HTTPS `SITE_URL`; update `robots.txt` with `Sitemap:` only after domain approval.

## Release Runbook/Rollback Summary

Runbook covers git checkpoint, checks, sitemap, host config, route sweep, headers, legal/source review, approval, and post-release smoke. Rollback covers host/git/sitemap/legal/admin-exposure incidents.

## Contact/Takedown Strategy

Prefer dedicated project email before beta. If unavailable, GitHub issues can only cover non-sensitive reports; a private takedown path is still needed.

## Backend/Schema/Auth/Admin

- Backend endpoints changed: no.
- DB schema changed: no.
- Auth behavior changed: no.
- Admin behavior changed: no.

## Still Disabled

Deployment, production DB, production auth, public registration, production admin writes, API as default, broad CRUD, entity write endpoints, comments/submissions, and silent localStorage import.

## Risks/TODOs

- Select host and domain.
- Apply/test SPA fallback and security headers.
- Select contact/takedown channel.
- Verify active codes.
- Run browser/mobile route sweep.
- Review image/media rights.

## Recommended Next Phase

Phase 191-205 should be final static beta launch rehearsal: choose host/domain, apply preview config, run browser/mobile screenshots, verify headers/fallback/sitemap, and still avoid production writes/auth.
