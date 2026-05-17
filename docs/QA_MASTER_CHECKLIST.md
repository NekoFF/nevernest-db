# QA Master Checklist

Date: 2026-05-17

## Static Mode QA

- [ ] Start with default env: `npm.cmd run dev`.
- [ ] Confirm `VITE_DATA_SOURCE` unset or `static`.
- [ ] Visit `/`, `/characters`, `/characters/nanally`, `/weapons`, `/weapons/<slug>`, `/modules`, `/modules/<slug>`, `/modules/pieces/<shape>/<rarity>`, `/vehicles`, `/tier-list`, `/codes`, `/news`, `/about`, `/disclaimer`, `/privacy`, `/contact`.
- [ ] Confirm Build Planner works and remains localStorage/static.
- [ ] Confirm browser-local AdminMode works only as local draft tooling.
- [ ] Confirm no auth tokens, passwords, or session tokens are written to browser storage.

## API Mode QA

- [ ] Start backend DB mode against a safe local seeded DB.
- [ ] Start frontend with `VITE_DATA_SOURCE=api` and matching `VITE_API_BASE_URL`.
- [ ] Confirm `http://127.0.0.1:4000/api/status` or the configured `VITE_API_BASE_URL` responds before judging API pages.
- [ ] Do not mix `localhost` and `127.0.0.1` during one API/auth QA session.
- [ ] Run `npm.cmd run check:api-client`.
- [ ] Run `npm.cmd run smoke:api-mode`.
- [ ] Verify characters, weapons, modules/cartridges, vehicles, tier list, codes, and news read through API mode.
- [ ] If API fetch fails, confirm counters show `API error` rather than misleading zero inventory.
- [ ] Confirm `/modules/:slug` Set Data shows 2pc/4pc bonus text when API detail returns `effectText`.
- [ ] Confirm API mode indicator appears only in dev.
- [ ] Confirm public page AdminMode editing controls are suppressed in API mode.

## Dev Admin QA

- [ ] Bootstrap local admin only against safe local DB if needed.
- [ ] Start backend with `ENABLE_LOCAL_AUTH=1`, `ENABLE_LOCAL_ADMIN_WRITES=1`, DB mode, and exact CORS origins.
- [ ] Start frontend with `VITE_DATA_SOURCE=api`, matching `VITE_API_BASE_URL`, and `VITE_ENABLE_DEV_ADMIN_PANEL=1`.
- [ ] Visit `/dev/admin`.
- [ ] Fetch CSRF.
- [ ] Log in.
- [ ] Refresh `/api/me`.
- [ ] Confirm roles and permissions display without raw cookies/tokens/passwords.
- [ ] Run code update/verify/restore.
- [ ] Run news update/verify/restore.
- [ ] Log out with CSRF.

## Admin Write Smoke QA

- [ ] Run `npm.cmd run smoke:admin-writes` only against a safe local seeded DB.
- [ ] Confirm flow: CSRF -> login -> `/api/me` -> patch code -> verify -> restore -> patch news -> verify -> restore -> logout.
- [ ] Confirm no restore warnings remain.
- [ ] Confirm characters/weapons/modules writes remain unavailable.

## Mobile/Tablet QA

- [ ] Test narrow phone, large phone, tablet, and desktop.
- [ ] For Phase 111-120 route sweep, test 375px, 430px, 768px, 1024px, and full desktop.
- [ ] Confirm `/`, `/characters`, `/characters/nanally`, `/weapons`, one valid weapon detail, `/modules`, one valid cartridge detail, one valid module-piece detail, `/vehicles`, `/tier-list`, `/codes`, `/news`, `/guides`, `/apartments`, `/community`, `/build-planner`, legal/info routes, and `/dev/admin`.
- [ ] Check sidebar overlay open/close.
- [ ] Check topbar search suggestions and keyboard behavior.
- [ ] Check character detail tabs/sections.
- [ ] Check module boards and module detail.
- [ ] Check vehicle showcase.
- [ ] Confirm vehicle showcase does not consume excessive vertical space on 375px/430px.
- [ ] Check tier list drag/edit surfaces only in allowed static contexts.
- [ ] Confirm tier list horizontal scroll is discoverable on mobile.
- [ ] Check Build Planner controls and saved drafts.
- [ ] Confirm Build Planner header/summary pills do not crowd at 1024px.
- [ ] Check modals do not overflow.
- [ ] Confirm placeholder routes communicate planned/deferred scope rather than broken content.

## Data Audit QA

- [ ] Run `npm.cmd run audit:data`.
- [ ] Run `npm.cmd run import:dry-run`.
- [ ] Run `npm.cmd run server:seed:preview`.
- [ ] Review blocked rows.
- [ ] Review needs-verification rows.
- [ ] Review missing-compatible-shapes warnings.
- [ ] Confirm sourceStatus policy is preserved.
- [ ] Confirm media aliases are explicit.

## Security QA

- [ ] Confirm public registration is disabled.
- [ ] Confirm production auth is disabled.
- [ ] Confirm production admin writes are disabled.
- [ ] Confirm `/dev/admin` sidebar link is hidden unless dev flag is enabled.
- [ ] Confirm `/dev/admin` panel content says disabled when flag is missing.
- [ ] Confirm local auth endpoints return `501` when `ENABLE_LOCAL_AUTH` is missing.
- [ ] Confirm admin writes return `501` when `ENABLE_LOCAL_ADMIN_WRITES` is missing.
- [ ] Confirm CSRF failures return `403 csrf_error`.
- [ ] Confirm missing session returns `401`.
- [ ] Confirm missing permission returns `403`.
- [ ] Confirm no tokens/passwords are stored in localStorage/sessionStorage/IndexedDB.

## Deployment QA

- [ ] Select host and document SPA fallback.
- [ ] Select canonical domain and HTTPS policy.
- [ ] Configure production env without enabling auth/admin writes.
- [ ] Configure production CORS for exact allowed origins.
- [ ] Configure security headers.
- [ ] Generate sitemap after canonical host is selected.
- [ ] Review `robots.txt`.
- [ ] Review legal/info pages.
- [ ] Confirm monitoring/error tracking plan.
- [ ] Confirm backups/restore plan before DB-backed production.

## Rollback/Checkpoint QA

- [ ] Confirm clean git status before release candidate work.
- [ ] Create checkpoint branch or commit.
- [ ] Record exact env and commands used.
- [ ] Save build/smoke outputs in reviewer handoff.
- [ ] Confirm rollback path for frontend host.
- [ ] Confirm DB restore path before any mutable DB workflow.

## Git Checkpoint Instructions

```sh
git status --short
git add docs/PHASE_86_95_TOTAL_PROJECT_AUDIT.md docs/PUBLIC_BETA_GAP_REPORT.md docs/PROJECT_ROADMAP_NEXT_PHASES.md docs/SECURITY_RISK_REGISTER.md docs/QA_MASTER_CHECKLIST.md docs/PHASE_86_95_REVIEWER_HANDOFF.md
git commit -m "docs: add phase 86-95 project audit"
```

Add any intentionally updated existing docs to the `git add` command after reviewing `git diff --name-only`.
