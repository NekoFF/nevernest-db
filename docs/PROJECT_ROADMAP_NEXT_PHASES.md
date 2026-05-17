# Project Roadmap Next Phases

Date: 2026-05-17

## Phase 96-100: Mobile/Tablet Frontend QA And Layout Polish

Goal: verify every public route on phone and tablet viewports and fix only concrete layout defects.

Why it matters: mobile users will be a large share of public beta traffic, and dense pages like character detail, vehicles, modules, tier list, and Build Planner carry the highest layout risk.

Risk: Medium.

Expected checks:

- `npm.cmd run build`
- `npm.cmd run smoke:static`
- manual mobile/tablet route sweep
- screenshot notes for any fixed defects

What NOT to touch:

- Do not redesign visual identity.
- Do not change Build Planner runtime.
- Do not enable auth, API default, or production admin.

## Phase 101-105: Data Quality Cleanup For Cartridges/Modules/SourceStatus

Goal: reduce `needs_verification` and warning rows, especially cartridge compatible shapes and material draft data.

Why it matters: public beta can tolerate clearly labeled incomplete data, but production should not present unverified data as official.

Risk: Medium.

Expected checks:

- `npm.cmd run audit:data`
- `npm.cmd run import:dry-run`
- `npm.cmd run server:seed:preview`

What NOT to touch:

- Do not mark unverified rows as verified.
- Do not import production data.
- Do not silently import localStorage overrides.

## Phase 106-110: Performance And Image Optimization

Goal: reduce large chunks and image cost without broad rewrites.

Why it matters: route-level lazy loading exists, but public beta should have acceptable first-load and mobile performance.

Risk: Medium.

Expected checks:

- `npm.cmd run build`
- inspect Vite chunk output
- route smoke checks after optimization

What NOT to touch:

- Do not change page behavior for style-only refactors.
- Do not replace the data/runtime architecture.

## Phase 111-115: Public Beta Deployment Preparation

Goal: choose hosts, domain, HTTPS, SPA fallback, env policy, and read-only deployment runbook.

Why it matters: deployment is currently not configured, and production-like hosting must preserve static default and disabled auth/write posture.

Risk: High.

Expected checks:

- deployment dry-run/checklist review
- `npm.cmd run build`
- `npm.cmd run smoke:static`
- API smoke only if a read-only backend is intentionally staged

What NOT to touch:

- Do not connect to production DB.
- Do not enable public login or registration.
- Do not enable production writes.

## Phase 116-120: Production Security Headers/Rate Limiting/Monitoring

Goal: implement or configure production-grade security headers, rate limiting, monitoring, alerting, and error tracking.

Why it matters: these are production blockers and should be in place before any real production platform behavior.

Risk: High.

Expected checks:

- security header verification
- rate-limit behavior tests
- monitoring/error tracking smoke
- secret redaction review

What NOT to touch:

- Do not introduce production auth shortcuts.
- Do not store tokens or passwords in browser storage.
- Do not enable admin writes.

## Phase 121-125: Read-Only Public Beta Launch

Goal: launch the smallest safe public beta: read-only, unauthenticated, static-first.

Why it matters: this validates public browse traffic while avoiding the highest-risk account and write surfaces.

Risk: Medium to High.

Expected checks:

- final static smoke
- deployed route sweep
- sitemap/robots verification
- legal/info page review
- rollback checkpoint

What NOT to touch:

- Do not enable public registration.
- Do not make API mode default unless explicitly approved.
- Do not enable production admin writes.

## Later: Production Auth And Admin Writes

Goal: add real auth/admin only after security gates pass.

Why it matters: admin writes can corrupt public data or expose privileged behavior if enabled prematurely.

Risk: Critical.

Expected checks:

- production auth threat model
- durable audit logs
- CSRF/session review
- permissions test matrix
- backup/restore rehearsal
- admin write E2E for each endpoint

What NOT to touch:

- Do not add broad CRUD.
- Do not start with characters/weapons/modules writes.
- Do not treat browser-local AdminMode as authorization.

## Recommended Admin Write Order

1. Keep existing code/news local write QA stable.
2. Add durable audit logging before new write surfaces.
3. Add backup/restore and production rate limiting.
4. Add a low-risk content write only after production auth gates.
5. Defer characters, weapons, modules/cartridges, and tier-list writes until data provenance and relational update plans are mature.
