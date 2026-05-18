# Phase 176-190 Public Beta RC Gap Audit

Date: 2026-05-18

## Conclusion

The project is close to a static read-only public beta release candidate, but it is not launch-ready until host/domain/HTTPS, SPA fallback, security headers, contact/takedown channel, active-code verification, and browser/mobile route QA are completed. Nothing in this phase should enable production writes, auth, registration, or production DB access.

## A. Must Fix Before Beta

| Gap | Why it blocks beta | Required action |
| --- | --- | --- |
| Hosting provider not selected | No deployment target, redirect/fallback, or headers can be verified. | Pick static host and document exact config. |
| Canonical domain/HTTPS not selected | Sitemap, robots, canonical URLs, and HSTS depend on final host. | Approve HTTPS public origin. |
| SPA fallback not configured | Direct links like `/characters/nanally` can 404 on static hosts. | Configure all public routes to serve `index.html`. |
| Security headers not configured | Public site should not ship without baseline browser protections. | Apply host headers from security draft and verify. |
| Public contact/takedown channel missing | Legal/source/image issues need a public reporting path. | Choose minimal channel before launch. |
| Active codes not verified | Codes can quickly become stale and currently lack expiry/source data. | Verify active codes or keep strong caveat/disable prominence. |
| Browser/mobile route sweep incomplete | Dense pages may have mobile issues not caught by build/smoke. | Manual sweep on phone/tablet/desktop. |
| Rollback process not rehearsed | Static launch needs fast revert path. | Tag release and confirm host rollback. |

## B. Should Fix Before Beta

| Gap | Recommended action |
| --- | --- |
| Performance/bundle/image budget | Accept current bundle/image cost or reduce obvious oversized assets. |
| Social preview image missing | Add only after a safe public asset is selected. |
| Structured data missing | Defer unless canonical domain and source policy are final. |
| SourceStatus coverage incomplete | Keep badges on high-risk surfaces; do not add noisy badges everywhere. |
| Guides sparse | Keep public only if placeholder posture remains clear. |

## C. Can Ship With Caveat

| Area | Caveat |
| --- | --- |
| Build Planner | Public as prototype/local theorycrafting only; formulas need verification. |
| Codes | Public with source/expiry caveat; no invented expiry dates. |
| Tier List | Public as reference/personal tool, not official affiliation claim. |
| API mode | Not part of static beta unless explicitly scoped and separately hosted. |
| Unknown/needs-verification data | Allowed if visibly not official/verified. |

## D. Must Remain Disabled

- Public registration.
- Production authentication.
- Production admin writes.
- Production DB mutations/imports.
- Broad CRUD endpoints.
- Character/weapon/module/vehicle/tier-list write endpoints.
- Silent localStorage/AdminMode import.
- `/dev/admin` as a public feature.
- API mode as frontend default.

## E. Later Production-Only

- Production auth/session threat model.
- Durable audit logs.
- Shared production rate limiting.
- Monitoring/error tracking ownership.
- Production DB backups/restore.
- Admin draft/publish workflow.
- Public submissions/comments.
- Verified source editor workflow.

## Risk Notes

- API mode production risk remains CORS, uptime, pagination metadata, and DB safety.
- localStorage AdminMode is safe only as browser-local draft tooling.
- No DB rollback is needed for static read-only beta, but production DB work remains blocked.
