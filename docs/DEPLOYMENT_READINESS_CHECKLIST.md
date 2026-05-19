# Deployment Readiness Checklist

Date: 2026-05-17

This checklist tracks what must be true before public beta or production deployment. It is documentation only; this phase does not deploy anything.

## Frontend Hosting

- Select hosting provider.
- Configure SPA fallback routing.
- Confirm static mode remains default.
- Confirm API mode is enabled only by explicit environment configuration.

## Backend Hosting

- Select backend host.
- Define read-only API hosting policy.
- Add production-safe configuration review.
- Keep production admin writes disabled until production auth, authorization, CSRF, audit logging, backups, and rate limiting exist.

## PostgreSQL Hosting

- Select managed PostgreSQL provider.
- Define migration process.
- Define seed/import approval process.
- Verify production DB URL is never used by local scripts without an explicit production-safe workflow.

## Backups

- Define automated backup schedule.
- Test restore process.
- Document retention policy.

## HTTPS And Domain

- Choose canonical public domain.
- Enable HTTPS.
- Configure redirects from alternate hosts.
- Update canonical SEO host and sitemap.
- Generate production sitemap only with approved HTTPS `SITE_URL`.

## Environment Variables

- Document frontend env vars.
- Document backend env vars.
- Store secrets only in hosting secret managers.
- Keep `.env` files local and uncommitted.

## Logging And Monitoring

- Add structured backend logs.
- Add uptime monitoring.
- Add error-rate and latency dashboards.
- Define alert ownership.

## Error Tracking

- Select frontend/backend error tracking.
- Redact user/input data.
- Keep production UI free of raw stack traces.

## Legal And Privacy

- Review About, Disclaimer, Privacy, and Contact pages.
- Confirm unofficial fan-site wording.
- Select public contact channel.
- Review image and source licensing.
- Confirm code active/expired labels and Build Planner prototype copy are not misleading.

## Performance And QA

- Address large bundle warning or set an accepted budget.
- Review image optimization.
- Test mobile and tablet layouts.
- Add smoke checks for static and API modes.

## Security

- Add security headers.
- Add rate limiting.
- Define CORS policy.
- Define auth/session plan before writes.
- Review `docs/AUTH_ARCHITECTURE_PLAN.md`.
- Review `docs/AUTH_IMPLEMENTATION_DECISION.md`.
- Review `docs/CSRF_STRATEGY.md`.
- Review `docs/RATE_LIMITING_PLAN.md`.
- Review `docs/AUTH_SCHEMA_REVIEW.md`.
- Review `docs/ADMIN_WRITE_POLICY.md`.
- Review `docs/AUTH_SECURITY_CHECKLIST.md`.
- Keep admin/auth/user accounts disabled until approved.

## Current Disabled Status

- Real auth: disabled.
- User accounts: disabled.
- Production admin write endpoints: disabled. Local code/news write QA exists only behind explicit local flags.
- Production DB: disabled.
- Deployment: not configured.

## Phase 161-175 Notes

- Sitemap preview exists: `npm run sitemap:preview`.
- Production sitemap generation still requires canonical HTTPS `SITE_URL`.
- `/dev/admin`, admin/write surfaces, and placeholder community/apartment routes are excluded from sitemap.
- Public beta remains read-only and unauthenticated.

## Phase 176-190 RC Notes

- Hosting recommendation and fallback/header drafts are in `docs/PHASE_176_190_HOSTING_OPTIONS.md`, `docs/PHASE_176_190_SPA_FALLBACK_PLAN.md`, and `docs/PHASE_176_190_SECURITY_HEADERS_DRAFT.md`.
- Use `docs/PUBLIC_BETA_RELEASE_RUNBOOK.md` and `docs/PUBLIC_BETA_ROLLBACK_PLAN.md` before any deployment attempt.
- Do not launch until a public contact/takedown channel is selected.

## Phase 191-205 Static Beta Candidate Notes

- Review docs-first host drafts in `docs/PHASE_191_205_PREVIEW_DEPLOYMENT_CONFIG.md` before adding platform config files.
- Static preview route QA passed locally, but host-level SPA fallback still must be verified on a preview deployment.
- Current build budget is acceptable for beta; mobile screenshot QA remains the main launch blocker.

## Phase 206-220 Static Preview Rehearsal Notes

- Cloudflare/Netlify-compatible `public/_redirects` and `public/_headers` are now applied and verified in `dist/`.
- Local preview direct-route verification passed again for core routes and `/dev/admin` disabled-shell access.
- `scripts/check-preview-headers.mjs` can verify host headers once `PREVIEW_URL` exists.
- Public beta remains blocked until actual preview deployment, host fallback/header verification, mobile screenshots, private contact/takedown channel, active code verification, image/media review, and rollback rehearsal are complete.

## Phase 221-235 Final Verification Notes

- No real preview URL was available, so host route, SPA fallback, security header, mobile screenshot, robots, and rollback verification remain incomplete.
- Local validation passed again, but local checks do not clear public beta deployment gates.
- Current public beta decision is NO-GO until the preview URL and remaining launch blockers are resolved.

## Phase 316-335 Release-Risk Notes

- Public beta remains NO-GO without a real private contact/takedown intake channel.
- Public beta remains NO-GO without a real preview URL route/fallback/header verification.
- Codes may remain visible only with source/expiry caveats until manual redemption/source checks complete.
- Build Planner may remain public only as a clearly labelled local prototype.
- Do not enable production auth, public registration, production admin writes, production DB mutations, or API mode by default.

## Phase 336-355 Preview Verification Notes

- Cloudflare preview `https://nevernest-db.pages.dev/` passed route, SPA fallback, security header, robots/sitemap, and AdminMode lockdown verification.
- Browser-local AdminMode is hidden and ignored in production preview/builds unless local Vite development explicitly sets `VITE_ENABLE_BROWSER_ADMIN_MODE=1`.
- `/dev/admin` remains disabled without its separate dev flag.
- Private friends preview is GO with caveats.
- Public beta remains NO-GO until contact/takedown, active-code/media review, mobile screenshot QA, rollback rehearsal, and canonical-domain sitemap approval are complete.
