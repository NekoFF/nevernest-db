# Public Beta Gap Report

Date: 2026-05-17

## Current Readiness Summary

The project is close to a read-only public beta, provided the beta scope is conservative: public visitors can browse static data or a read-only API-backed database, with no public login, no user accounts, no production admin writes, and no production database mutation workflow.

It is not ready to operate as a production platform with authentication, user accounts, production database writes, or production admin tools.

Phase 161-175 update: beta scope is now documented in `docs/PHASE_161_175_PUBLIC_BETA_SCOPE.md`. Legal/source copy, codes copy, visible tier-list wording, default SEO metadata, and sitemap preview tooling were tightened for read-only beta preparation.

Phase 176-190 update: release-candidate gaps, hosting options, SPA fallback, security headers, canonical sitemap workflow, release runbook, rollback plan, launch checklist, and contact/takedown strategy are now documented.

Phase 191-205 update: static preview direct-route QA passed locally and the current bundle budget is acceptable for beta. Public beta remains blocked on preview deployment configuration, host-level fallback/header verification, manual mobile screenshot QA, public contact/takedown channel, and active-code verification.

Phase 206-220 update: static host config files are now applied for Cloudflare Pages/Netlify preview (`public/_redirects`, `public/_headers`), build output verification passed, and local preview direct-route probing passed. Public beta remains blocked on actual preview deployment, host-level fallback/header verification, manual mobile screenshot QA, private contact/takedown channel selection, active-code verification, image/media rights review, and rollback rehearsal.

Phase 221-235 update: no real preview URL was available, so actual host verification could not be completed. Public beta remains NO-GO until preview deployment, host route/fallback/header checks, mobile screenshot QA, private contact/takedown channel, active-code verification, image/media rights review, and rollback rehearsal are complete.

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
| Performance | Medium | Bundle budget is acceptable for beta; image/mobile perceived performance still needs screenshot review. |

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
- Preview deployment, host-level SPA fallback, canonical domain, HTTPS, and production env are not verified.
- Host-level security headers are not verified on a preview URL.
- Sitemap policy needs a canonical host before publishing.
- Legal/privacy/contact/source/image licensing review is not complete.
- Image/mobile perceived performance still needs screenshot review.
- Public beta runbook and rollback/checkpoint process need preview-host rehearsal.
- Public contact/takedown channel still needs a real selected destination before launch.
- Active codes still need manual redemption/source verification before launch.
- Rollback rehearsal still needs an actual preview deployment.

## Phase 236-255 Progress

- Static global search/filter UX is improved for V1.1 readiness.
- Source-aware discovery copy is clearer on modules, guides, codes, news, and tier list.
- Static module piece browsing is restored in the Modules page.
- Search/filter tests now cover core public categories and source-status mapping.

## Phase 256-275 Character Corpus Progress

- Local character corpus inventory, canonical map, extraction, conflict, and handoff reports are now available.
- Corpus-derived data is generated as `needs_verification` candidates only.
- Canonical character fields and Nanally reference data were not overwritten.
- No Build Planner formula/runtime behavior changed.
- No character pilot apply was made because the extraction found mixed-character files and protected-field conflicts.

## Phase 276-295 Character Intel Progress

- Lacrimosa now has a tiny source-pending character intel section on the detail page.
- Character intel notes are separate from canonical character data and remain `needs_verification`.
- Global search can discover the notes through the canonical Lacrimosa route.
- Build Planner formulas, backend endpoints, DB schema, auth, and admin behavior were not changed.

## Phase 296-315 Mobile/Visual Progress

- Home and Vehicle phone-height pressure was reduced.
- Topbar search dropdown is more viewport-contained on narrow screens.
- Sidebar placeholder community/support copy no longer implies live production systems.
- Codes local edit modal and legal/info sizing received small mobile containment fixes.
- Public beta remains blocked on real preview deployment, host fallback/headers, manual mobile screenshots, contact/takedown, active-code verification, media rights review, and rollback rehearsal.

## Remaining After Phase 236-255

- Real preview URL is still required before public beta.
- Host-level fallback/security headers still need verification on the preview URL.
- Mobile screenshot QA remains required.
- Active code source/redeem verification remains required.
- Contact/takedown destination and media-rights review remain required.

## Remaining After Phase 256-275

- Manually review generated character candidates and conflicts.
- Pick one clean non-Nanally character for a future source-pending pilot apply.
- Add UI exposure only after candidate snippets are manually accepted.

## Remaining After Phase 276-295

- Manually verify Lacrimosa source-pending notes against trusted source evidence.
- Decide whether to keep, refine, or remove the Lacrimosa pilot before public beta.
- Repeat candidate review one character at a time; do not mass-apply corpus output.

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

## Phase 316-335 Update

Final content-confidence review improved legal/contact, codes, and Build Planner caveats without changing backend endpoints, DB schema, auth/admin behavior, Build Planner formulas, or canonical character fields. Public beta remains NO-GO until a real private contact/takedown route is selected, a real preview URL is verified for route/fallback/security headers, mobile screenshot QA is complete, active codes/media posture are manually checked, and rollback is rehearsed. Private friends preview remains GO if the build stays read-only/static-first and caveats remain visible.

## Phase 336-355 Update

Cloudflare preview exposed browser-local static AdminMode from the account menu. AdminMode is now locked to local Vite development only when `VITE_ENABLE_BROWSER_ADMIN_MODE=1`; production preview/builds ignore old admin localStorage mode and override collections, hide AdminMode menu items, and keep edit controls hidden. Public beta remains blocked until the redeployed preview is manually verified.

## Phase 336-355 Final Preview Verification

Cloudflare preview `https://nevernest-db.pages.dev/` now passes route, SPA fallback, security header, robots/sitemap preview, and rendered AdminMode lockdown checks. `/dev/admin` renders disabled, the account menu does not expose `Admin Mode` / `Exit Admin Mode`, and old admin localStorage state is ignored. Private friends preview is GO with caveats. Public read-only beta remains NO-GO until a private contact/takedown channel is selected, active codes and media posture are manually accepted, mobile screenshot QA is completed, rollback is rehearsed, and a canonical domain/sitemap policy is approved.

## Phase 356-375 Product Polish

Sidebar/footer and account/home placeholder labels were compacted so planned sections read as planned instead of broken. Character Detail console placement colors now preserve presentation-only `visualGroup` values separately from real module rarity. Build Planner formulas/runtime, character data, backend endpoints, DB schema, production auth, public registration, production admin writes, and API default behavior were not changed.

## Phase 376-395 Mobile / Short-Height QA

Automated viewport QA covered phone, tablet, desktop, and short-height layouts. Two concrete polish fixes were applied: public News placeholder copy no longer mentions AdminMode, and decorative detail-page horizontal bleed is clipped at the app shell. Live preview already shows Phase 356 changes, but Phase 376 fixes require redeploy and a quick post-redeploy visual smoke before moving into character data batches.
