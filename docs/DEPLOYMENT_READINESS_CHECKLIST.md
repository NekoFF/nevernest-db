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
- Keep admin writes disabled until auth and authorization exist.

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
- Admin write endpoints: disabled.
- Production DB: disabled.
- Deployment: not configured.
