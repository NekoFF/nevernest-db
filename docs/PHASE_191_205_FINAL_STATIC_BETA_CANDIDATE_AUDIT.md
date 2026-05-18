# Phase 191-205 Final Static Beta Candidate Audit

Date: 2026-05-18

## Conclusion

The project is a strong static read-only beta candidate, but it is not ready for an actual public deployment until the final external launch items are completed: approved host/domain/HTTPS, host SPA fallback, security headers, production sitemap/robots update, public contact/takedown channel, and real mobile/browser screenshot QA.

No backend, schema, auth, production admin, or database behavior needs to change for this beta candidate.

## A. Blocks Static Beta

| Area | Blocker | Required action |
| --- | --- | --- |
| Host/domain/HTTPS | No approved public host or canonical HTTPS domain. | Select host and domain; use static-only build output. |
| SPA fallback | Host-level refresh/direct-link behavior is unverified. | Configure fallback to `index.html` and test direct route refresh on preview deployment. |
| Security headers | Header policy is drafted but not applied on a host. | Apply tested static headers for preview and verify app still loads. |
| Sitemap/robots | Production sitemap needs an approved HTTPS `SITE_URL`; robots should not point at a placeholder sitemap. | Generate only after domain approval, then add real `Sitemap:` directive. |
| Contact/takedown | No real public private channel is selected. | Choose dedicated project contact before launch. |
| Mobile/browser route sweep | No fresh screenshot pass on target viewports has been completed in this phase. | Run manual or automated screenshot QA before public beta. |

## B. Should Fix Before Beta

| Area | Reason | Action |
| --- | --- | --- |
| Active codes verification | Codes are public-facing and missing some source/expiry data. | Recheck active status and keep caveat visible. |
| Image/media rights review | Fan database media has legal/source risk. | Review asset provenance and takedown readiness. |
| Performance/image budget | Build is acceptable for beta but main bundle and detail pages are large. | Track budget and defer heavier optimization unless mobile QA exposes blocking issues. |
| Rollback rehearsal | Runbook exists but has not been tested on a real preview host. | Rehearse host rollback once preview deployment exists. |
| Monitoring/contact intake | Static beta can launch without analytics, but reports need intake. | Decide minimal incident/contact workflow. |

## C. Can Ship With Caveat

| Area | Caveat |
| --- | --- |
| Build Planner | Public only as a prototype/local theorycrafting tool; formulas are not production-verified. |
| Tier List | Reference wording must remain visible; do not imply official ranking. |
| SourceStatus/data quality | Unknown/estimated/needs-verification data can ship if labels and missing-data states remain honest. |
| Guides | Sparse guide content can ship if treated as early reference material. |
| API mode | Can remain in code as opt-in local/experimental mode; not part of static public beta. |
| LocalStorage drafts | Existing local planner/personal/static AdminMode drafts can remain if not treated as backend authority. |

## D. Must Remain Disabled

- Production auth.
- Public registration.
- Production admin writes.
- Production database access.
- API mode as default.
- Broad CRUD.
- Character/weapon/module/vehicle/tier-list write endpoints.
- Comments, public submissions, or user-generated content.
- Silent localStorage/AdminMode import.
- `/dev/admin` public navigation or sitemap inclusion.

## E. Later After Beta

- Production API deployment plan.
- Real admin draft/publish workflow.
- Source provenance editor and verification trail.
- Formula-verified Build Planner.
- Performance/code-splitting and image pipeline upgrades.
- Monitoring/analytics with privacy review.
- Backups only if production DB is introduced later.
