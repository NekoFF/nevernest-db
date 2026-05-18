# Public Beta Launch Checklist

Date: 2026-05-18

## Scope

- [ ] Read-only beta only.
- [ ] Static/localStorage frontend remains default.
- [ ] Unauthenticated public browsing only.
- [ ] No official affiliation claim.

## Git Checkpoint

- [ ] `git status --short` reviewed.
- [ ] Release branch created.
- [ ] Release tag planned.
- [ ] Changed files reviewed.

## Static Checks

- [ ] `npm run server:check`
- [ ] `npm run server:build`
- [ ] `npm run server:test`
- [ ] `npm run build`
- [ ] `npm run audit:data`
- [ ] `npm run import:dry-run`
- [ ] `npm run server:seed:preview`
- [ ] `npm run smoke:static`
- [ ] `npm run sitemap:preview`

## Optional API Checks

- [ ] API beta explicitly approved, or skipped.
- [ ] `npm run check:api-client`
- [ ] `npm run smoke:api-mode`
- [ ] `npm run server:test:db:seeded`
- [ ] API mode remains opt-in.

## Mobile/Browser Checks

- [ ] Desktop route sweep.
- [ ] Tablet route sweep.
- [ ] Mobile route sweep.
- [ ] Direct refresh route sweep.
- [ ] Browser console checked for asset/CSP errors.
- [ ] Phase 191-205 manual screenshot checklist completed for 375, 430, 768, 1024, and 1440 widths.
- [ ] Build Planner, Tier List, Vehicles, character detail, and module-piece detail have no blocking overflow.

## SEO/Sitemap

- [ ] Canonical HTTPS domain approved.
- [ ] `SITE_URL` production sitemap generated.
- [ ] `/dev/admin` absent from sitemap.
- [ ] `robots.txt` has correct `Sitemap:` directive after domain approval.
- [ ] Default metadata reviewed.

## Legal/Source/Contact

- [ ] About/disclaimer/privacy/contact reviewed.
- [ ] Public contact/takedown channel selected.
- [ ] Active codes verified or clearly caveated.
- [ ] Build Planner prototype wording confirmed.
- [ ] Tier list reference wording confirmed.
- [ ] Image/media risk reviewed.

## Security Headers

- [ ] CSP configured.
- [ ] HSTS configured.
- [ ] `X-Content-Type-Options` configured.
- [ ] Frame blocking configured.
- [ ] Referrer policy configured.
- [ ] Permissions policy configured.
- [ ] Headers verified with `curl -I`.

## Deployment Host

- [ ] Host selected.
- [ ] Build command set to `npm run build`.
- [ ] Output directory set to `dist`.
- [ ] SPA fallback configured.
- [ ] HTTPS enabled.
- [ ] Production env does not enable auth/admin/API by default.
- [ ] Preview deployment config reviewed against `docs/PHASE_191_205_PREVIEW_DEPLOYMENT_CONFIG.md`.

## Rollback

- [ ] Previous/known-good deployment available.
- [ ] Rollback procedure tested or documented.
- [ ] Sitemap/robots rollback documented.
- [ ] Incident path for auth/admin exposure documented.

## Post-Launch Monitoring

- [ ] Manual smoke after launch.
- [ ] Uptime check selected or consciously deferred.
- [ ] Issue intake/contact watched.
- [ ] Broken route reports triaged.

## What Remains Disabled

- [ ] Public registration.
- [ ] Production auth.
- [ ] Production admin writes.
- [ ] Production DB mutations.
- [ ] Broad CRUD.
- [ ] Character/weapon/module/vehicle/tier-list write endpoints.
- [ ] Silent localStorage import.
