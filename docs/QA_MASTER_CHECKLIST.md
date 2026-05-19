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
- [ ] Confirm seeded API weapon detail pages show growth Attack values when API detail returns main-stat growth rows.
- [ ] Confirm seeded API weapon refinement/resonance rows show `effectText` instead of falling back to missing-data copy.
- [ ] Confirm sourceStatus badges appear on high-risk API display surfaces without marking unknown data verified.

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
- [ ] Confirm topbar search dropdown stays within the viewport on 375px/430px screens.
- [ ] Check character detail tabs/sections.
- [ ] Check module boards and module detail.
- [ ] Check vehicle showcase.
- [ ] Confirm vehicle showcase does not consume excessive vertical space on 375px/430px.
- [ ] Confirm Home hero does not push all browse entry points below the first phone viewport.
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
- [ ] Run `npm.cmd run corpus:characters:inspect` when local `nevernest-intel` corpus data is available.
- [ ] Run `npm.cmd run corpus:characters:canonical` before any character corpus apply.
- [ ] Run `npm.cmd run corpus:characters:extract` and review conflicts before any character corpus apply.
- [ ] Run `npm.cmd run test:corpus` after changing corpus pipeline scripts.
- [ ] Run `npm.cmd run test:character-intel` after changing source-pending character intel notes.
- [ ] Review blocked rows.
- [ ] Review needs-verification rows.
- [ ] Confirm character corpus output never overwrites canonical id, slug, name, rarity, element, arc type, curated roles, or Nanally reference data.
- [ ] Confirm extracted character snippets remain `needs_verification` until manually reviewed.
- [ ] Confirm public character intel notes do not expose raw local source paths or protected canonical fields.
- [ ] Review missing-compatible-shapes warnings.
- [ ] Confirm sourceStatus policy is preserved.
- [ ] Confirm media aliases are explicit.
- [ ] Compare static/API counts for module pieces with `/api/modules/pieces?limit=100`; unqualified `/api/modules/pieces` returns the default 24-row page.
- [ ] Confirm code active/expired labels have source/expiry review before public beta.
- [ ] Confirm provenance fields are preserved by any future import/export workflow.

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
- [ ] Review `docs/PHASE_176_190_HOSTING_OPTIONS.md`.
- [ ] Review `docs/PHASE_191_205_PREVIEW_DEPLOYMENT_CONFIG.md`.
- [ ] Review `docs/PHASE_206_220_HOST_CONFIG_APPLIED.md`.
- [ ] Apply and test SPA fallback from `docs/PHASE_176_190_SPA_FALLBACK_PLAN.md`.
- [ ] Apply and test security headers from `docs/PHASE_176_190_SECURITY_HEADERS_DRAFT.md`.
- [ ] Confirm `dist/_redirects` and `dist/_headers` exist after `npm.cmd run build`.
- [ ] Complete `docs/PHASE_206_220_PREVIEW_URL_VERIFICATION.md` on a real preview URL.
- [ ] Run `PREVIEW_URL="..." npm.cmd run check:preview-headers`.
- [ ] Complete `docs/PHASE_221_235_PREVIEW_DEPLOYMENT_RESULT.md` with a real preview URL.
- [ ] Complete `docs/PHASE_221_235_PREVIEW_ROUTE_VERIFICATION.md`.
- [ ] Complete `docs/PHASE_221_235_PREVIEW_SECURITY_HEADERS_RESULT.md`.
- [ ] Complete `docs/PHASE_221_235_SPA_FALLBACK_RESULT.md`.
- [ ] Select canonical domain and HTTPS policy.
- [ ] Run `npm.cmd run sitemap:preview`.
- [ ] After canonical HTTPS domain approval, run production sitemap generation with `SITE_URL`.
- [ ] Configure production env without enabling auth/admin writes.
- [ ] Configure production CORS for exact allowed origins.
- [ ] Configure security headers.
- [ ] Generate sitemap after canonical host is selected.
- [ ] Review `robots.txt`.
- [ ] Review legal/info pages.
- [ ] Confirm codes page caveat covers missing source/expiry data.
- [ ] Confirm tier-list page does not imply an official affiliation claim.
- [ ] Confirm global Topbar search returns useful grouped results for `nanally`, `good`, `good boy`, `devil`, `module`, `code`, `vehicle`, `news`, `incantation`, and `plasma`.
- [ ] Confirm Characters, Weapons, Modules, Codes, News, Vehicles, and Guides filters show counts, reset paths, and no-results states on mobile.
- [ ] Confirm source/confidence filters do not mark source-pending or unknown data as verified.
- [ ] Confirm Guides remain planned/source pending rather than appearing as complete guide content.
- [ ] Confirm Build Planner remains prototype-labelled.
- [ ] Complete `docs/PHASE_191_205_MOBILE_SCREENSHOT_QA.md`.
- [ ] Complete `docs/PHASE_206_220_MOBILE_SCREENSHOT_QA_RESULTS.md`.
- [ ] Complete `docs/PHASE_221_235_MOBILE_SCREENSHOT_QA_RESULT.md`.
- [ ] Review `docs/PHASE_191_205_PERFORMANCE_BUDGET.md`.
- [ ] Confirm monitoring/error tracking plan.
- [ ] Confirm backups/restore plan before DB-backed production.

## Rollback/Checkpoint QA

- [ ] Confirm clean git status before release candidate work.
- [ ] Create checkpoint branch or commit.
- [ ] Record exact env and commands used.
- [ ] Save build/smoke outputs in reviewer handoff.
- [ ] Confirm rollback path for frontend host.
- [ ] Confirm DB restore path before any mutable DB workflow.
- [ ] Review `docs/PUBLIC_BETA_RELEASE_RUNBOOK.md`.
- [ ] Review `docs/PUBLIC_BETA_ROLLBACK_PLAN.md`.

## Git Checkpoint Instructions

```sh
git status --short
git add docs/PHASE_86_95_TOTAL_PROJECT_AUDIT.md docs/PUBLIC_BETA_GAP_REPORT.md docs/PROJECT_ROADMAP_NEXT_PHASES.md docs/SECURITY_RISK_REGISTER.md docs/QA_MASTER_CHECKLIST.md docs/PHASE_86_95_REVIEWER_HANDOFF.md
git commit -m "docs: add phase 86-95 project audit"
```

Add any intentionally updated existing docs to the `git add` command after reviewing `git diff --name-only`.

## Phase 316-335 Additions

- [ ] Review `docs/PHASE_316_335_REVIEWER_HANDOFF.md`.
- [ ] Confirm contact page does not invent an email/URL and blocks public beta until private intake is selected.
- [ ] Confirm codes show source/expiry caveats and `needs_verification` badges when source status is missing.
- [ ] Confirm Build Planner prototype warning is visible and formulas were not changed.
- [ ] Confirm `/dev/admin` is hidden from public nav unless dev flag is enabled.
- [ ] Keep public beta NO-GO until real preview URL, headers, mobile screenshots, contact/takedown, code/media checks, and rollback are complete.

## Phase 336-355 AdminMode Lockdown

- [x] Confirm `src/admin/adminModeGate.js` requires `import.meta.env.DEV` and `VITE_ENABLE_BROWSER_ADMIN_MODE=1`.
- [x] Confirm production preview account menu does not show `Admin Mode` or `Exit Admin Mode`.
- [x] Confirm old `nte.admin.mode` localStorage does not activate AdminMode in production preview.
- [x] Confirm old localStorage admin overrides do not change public character/card data in production preview.
- [x] Confirm `/dev/admin` still shows disabled state without dev flag.
- [ ] Confirm no edit/pencil controls render on every public page during final mobile screenshot QA.

## Phase 336-355 Real Preview Verification

- [x] Review `docs/PHASE_336_355_BUILD_OUTPUT_HOST_CONFIG_VERIFICATION.md`.
- [x] Review `docs/PHASE_336_355_PREVIEW_ROUTE_VERIFICATION.md`.
- [x] Review `docs/PHASE_336_355_SPA_FALLBACK_VERIFICATION.md`.
- [x] Review `docs/PHASE_336_355_SECURITY_HEADERS_VERIFICATION.md`.
- [x] Review `docs/PHASE_336_355_ADMINMODE_LOCKDOWN_VERIFICATION.md`.
- [x] Review `docs/PHASE_336_355_ROBOTS_SITEMAP_VERIFICATION.md`.
- [ ] Complete `docs/PHASE_336_355_MOBILE_SCREENSHOT_QA.md`.
- [ ] Complete private contact/takedown selection.
- [ ] Complete active-code manual verification.
- [ ] Complete media rights/takedown acceptance.
- [ ] Rehearse Cloudflare rollback.

## Phase 356-375 Product Polish

- [ ] Review `docs/PHASE_356_375_SIDEBAR_COMPACT_REVIEW.md`.
- [ ] Review `docs/PHASE_356_375_PLACEHOLDER_LABELS_REVIEW.md`.
- [ ] Review `docs/PHASE_356_375_MODULE_VISUAL_CONSISTENCY.md`.
- [ ] Confirm Character Detail console visual groups render as placement colors, not fake rarity.
- [ ] Confirm Build Planner ignores console visual group colors for calculations.
- [ ] Confirm account menu still has no AdminMode in production preview after redeploy.
- [ ] Confirm sidebar footer does not crowd at short viewport heights.
- [ ] Confirm no character batch filling/default stats were added.

## Phase 376-395 Mobile / Short-Height QA

- [ ] Review `docs/PHASE_376_395_PREVIEW_REDEPLOY_VERIFICATION.md`.
- [ ] Review `docs/PHASE_376_395_MOBILE_SCREENSHOT_QA.md`.
- [ ] Review `docs/PHASE_376_395_SIDEBAR_SHORT_HEIGHT_QA.md`.
- [ ] Review `docs/PHASE_376_395_CONSOLE_VISUAL_GROUP_QA.md`.
- [ ] Confirm Phase 376-395 fixes are visible after Cloudflare redeploy.
- [ ] Confirm News public copy does not mention AdminMode.
- [ ] Confirm detail pages do not create horizontal page overflow.
- [ ] Repeat quick manual visual smoke on phone/tablet after redeploy.

## Phase 396-415 Skia / Mint Structured Import

- [ ] Review `docs/PHASE_396_415_SKIA_MINT_IMPORT_SUMMARY.md`.
- [ ] Review `docs/PHASE_396_415_SKIA_MINT_REVIEWER_HANDOFF.md`.
- [ ] Confirm Skia and Mint detail pages render profile, stats, skills, build, console, materials, and teams without layout regressions.
- [ ] Confirm Nanally detail data remains unchanged.
- [ ] Confirm Skia/Mint imported data shows `needs_verification`/source-pending posture.
- [ ] Confirm unresolved Skia/Mint conflicts are documented before any public verified claim.
- [ ] Confirm Build Planner formulas/runtime were not changed.
