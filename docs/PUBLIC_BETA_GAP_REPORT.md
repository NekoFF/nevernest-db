# Public Beta Gap Report

Date: 2026-05-17

## Current Readiness Summary

The project is close to a read-only public beta, provided the beta scope is conservative: public visitors can browse static data or a read-only API-backed database, with no public login, no user accounts, no production admin writes, and no production database mutation workflow.

It is not ready to operate as a production platform with authentication, user accounts, production database writes, or production admin tools.

Phase 161-175 update: beta scope is now documented in `docs/PHASE_161_175_PUBLIC_BETA_SCOPE.md`. Legal/source copy, codes copy, visible tier-list wording, default SEO metadata, and sitemap preview tooling were tightened for read-only beta preparation.

Phase 176-190 update: release-candidate gaps, hosting options, SPA fallback, security headers, canonical sitemap workflow, release runbook, rollback plan, launch checklist, and contact/takedown strategy are now documented.

Recommended beta scope:

- Read-only static frontend as default.
- Optional read-only API mode only after deployment configuration is reviewed.
- No public login.
- No public registration.
- No production admin writes.
- No user accounts initially.
- No localStorage AdminMode authority outside static browser-local drafts.

## Risk By Area

| Area | Risk | Notes |
| --- | --- | --- |
| Static frontend browse | Medium | Usable, but mobile/tablet QA and text/layout polish remain. |
| API read mode | Medium | Works locally; production API hosting and CORS are not final. |
| Data quality | Medium | No blockers, but sourceStatus and cartridge shape verification remain. |
| Auth | High | Local prototype only; production auth disabled. |
| Admin writes | High | Codes/news local QA only; no production write posture. |
| Deployment | High | Host, domain, HTTPS, env, monitoring, backups missing. |
| Production security | Critical | Rate limiting, headers, durable audit logs, monitoring, and incident workflow missing. |
| Legal/licensing | High | Fan-site, source, image, privacy, and contact review needed. |
| Performance | Medium | Lazy pages exist, but bundle/image/mobile budgets need review. |

## Ready For Public Read-Only Beta

- Static/localStorage frontend remains default.
- Public pages exist for core browse surfaces: home, characters, weapons, modules, vehicles, tier list, codes, news, and legal/info pages.
- API-mode unified repositories exist for characters, character detail, weapons, weapon detail, modules/cartridges, cartridge detail, vehicles, tier list, codes, and news.
- Backend has read routes and stable response envelopes.
- Local DB-backed read mode works behind explicit `SERVER_DATA_MODE=db`.
- Data audit and import dry-run currently report 0 blockers.
- `robots.txt` exists and is permissive while noting the missing production domain.
- `npm run sitemap:preview` generates a local preview sitemap for public read-only routes without assuming a final domain.
- Fan-site disclaimer/info pages exist and should be reviewed before launch.

## Blocks Public Beta

- Mobile/tablet QA has not been completed for dense pages and modals.
- Hosting provider, SPA fallback, canonical domain, HTTPS, and production env are not configured.
- Sitemap policy needs a canonical host before publishing.
- Legal/privacy/contact/source/image licensing review is not complete.
- Build output and image performance need a public-beta budget decision.
- Public beta runbook and rollback/checkpoint process need final review.
- Public contact/takedown channel still needs a real selected destination before launch.

## Blocks Production

- Production auth is not ready or enabled.
- Public registration is disabled and should remain disabled.
- Production admin writes are not approved.
- Durable audit logging is not implemented.
- Production-grade rate limiting is missing.
- Production CORS and security headers are not finalized.
- Production database, migrations, backups, restore tests, monitoring, and error tracking are missing.
- Source verification and sourceStatus governance need more cleanup.

## Intentionally Disabled

- Public registration.
- Production authentication.
- Production admin writes.
- Broad CRUD endpoints.
- Character, weapon, module/cartridge, vehicle, and tier-list write endpoints.
- Production DB connection/import/deployment.
- API mode as the default frontend runtime.
- Silent import of browser-local AdminMode/localStorage overrides.

## Required Before Beta

- Run and record clean default checks.
- Complete mobile/tablet pass for the public routes.
- Fix obvious layout/text defects found during QA.
- Pick hosting and configure SPA fallback.
- Pick canonical domain and HTTPS.
- Generate/update sitemap after canonical host is known.
- Run `npm run sitemap:preview` during release-candidate QA and `SITE_URL="https://..." npm run sitemap:generate` only after canonical HTTPS host approval.
- Review About, Disclaimer, Privacy, and Contact copy.
- Review source/image licensing posture.
- Confirm no auth/admin UI is exposed in production build.
- Keep static mode as default.

## Required Before Production

- Design and approve production auth/session model.
- Add production rate limiting with shared store.
- Add durable audit logs and audit review process.
- Add production security headers.
- Add monitoring, alerting, error tracking, and log retention.
- Add production DB migration and backup/restore runbooks.
- Add incident response and rollback runbooks.
- Validate sourceStatus policy and data provenance.
- Perform security review before enabling any production writes.

## Optional After Launch

- CDN/image optimization.
- True API pagination totals.
- Expanded guide/community/apartment content.
- Search indexing.
- User accounts and saved builds after auth design.
- Production admin tooling after security gates.
- Asset filename cleanup for media aliases.

## Beta Decision

Recommended decision: proceed toward a read-only public beta preparation phase, not a production launch. The safest public beta is static-first, read-only, and unauthenticated.
