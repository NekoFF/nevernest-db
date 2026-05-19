# Runtime Readiness

Date: 2026-05-17

## Local Database

Start local PostgreSQL:

```sh
docker compose up -d postgres
```

Use a safe local URL:

```sh
$env:DATABASE_URL="postgres://postgres:postgres@localhost:5432/nte_database"
```

Do not point local scripts at a production database.

## Backend DB Mode

Run explicit local DB mode:

```sh
$env:DATABASE_URL="postgres://postgres:postgres@localhost:5432/nte_database"
$env:SERVER_DATA_MODE="db"
npm.cmd run server:dev:db
```

Health checks:

```sh
curl http://127.0.0.1:4000/health
curl http://127.0.0.1:4000/api/status
```

## Frontend Static Mode

Static/localStorage mode is default:

```sh
npm.cmd run dev
```

## Frontend API Mode

API mode is explicit and experimental:

```sh
$env:VITE_DATA_SOURCE="api"
$env:VITE_API_BASE_URL="http://localhost:4000"
npm.cmd run dev
```

Before opening API-mode pages, confirm the backend is reachable at the exact configured base URL:

```sh
curl http://localhost:4000/api/status
```

If the frontend points to `http://127.0.0.1:4000`, check that exact host instead. A stopped backend or host mismatch should be treated as an API/runtime failure, not empty data. Public list pages should show an API error state and must not be interpreted as "0 indexed" data.

For cookie-backed local admin QA, do not mix `localhost` and `127.0.0.1` during one browser session. Cookies are host-scoped, and CORS must list the exact frontend origin.

## Dev Admin Panel

The local browser QA route is:

```text
http://localhost:5173/dev/admin
```

Enable it only in development:

```sh
$env:VITE_ENABLE_DEV_ADMIN_PANEL="1"
```

The panel can fetch CSRF, log in with local admin auth, display safe `/api/me` state, run update/verify/restore QA for existing codes/news, and log out with CSRF. It cannot register users, enable production auth, create/delete content, or mutate characters/weapons/modules.

## Checks

Run before public beta candidates:

```sh
npm.cmd run build
npm.cmd run smoke:static
npm.cmd run server:check
npm.cmd run server:build
npm.cmd run server:test
npm.cmd run audit:data
npm.cmd run import:dry-run
npm.cmd run server:seed:preview
npm.cmd run sitemap:preview
```

Character corpus commands are local/report-only and do not require a database:

```sh
npm.cmd run corpus:characters:inspect
npm.cmd run corpus:characters:canonical
npm.cmd run corpus:characters:extract
npm.cmd run test:corpus
```

These commands read `../nevernest-intel` by default or `CHARACTER_CORPUS_ROOT` when set. They write reports under `docs/` and generated review artifacts under `.generated/`, and must not be treated as live data import.

With backend DB mode running:

```sh
npm.cmd run check:api-client
npm.cmd run smoke:api-mode
npm.cmd run smoke:admin-writes
npm.cmd run server:test:db:seeded
```

Do not run empty DB tests against a seeded database.

Phase 151-160 note: module-piece API parity requires the full list query (`/api/modules/pieces?limit=100`). The default endpoint page is 24 rows by shared pagination policy and should not be interpreted as a seeded-row loss.

Phase 161-175 note: `npm.cmd run sitemap:preview` writes `.generated/sitemap-preview.xml` with localhost preview URLs. Production sitemap generation still requires an approved HTTPS `SITE_URL` and must exclude `/dev/admin` and admin/write surfaces.

Phase 176-190 note: before any beta deployment, configure host SPA fallback, apply security headers, generate the production sitemap with approved `SITE_URL`, and verify route refreshes. Use `docs/PUBLIC_BETA_RELEASE_RUNBOOK.md` and `docs/PUBLIC_BETA_ROLLBACK_PLAN.md`.

Phase 191-205 note: local Vite preview route refresh QA passed for the public route set, but final host fallback and security headers still require preview deployment verification. Current build budget is acceptable for static beta; mobile screenshot QA remains required.

Phase 206-220 note: `public/_redirects` and `public/_headers` are now part of the static build output for Cloudflare Pages/Netlify preview rehearsal. `npm run check:preview-headers` is available once `PREVIEW_URL` exists. Static mode remains default; API mode, production auth, public registration, production admin writes, and production DB remain disabled.

Phase 221-235 note: local validation passed, but no real preview URL was available. Public beta remains NO-GO until `PREVIEW_URL` is set to an actual Cloudflare/Netlify preview and host route, SPA fallback, security header, mobile, contact, active-code, media, and rollback checks are completed.

Phase 236-255 note: static search/filter discovery was hardened without changing runtime gates. Global search and page filters run from bundled/static data plus browser-local AdminMode merges in static mode. API mode remains opt-in. Production auth, public registration, production admin writes, production DB mutations, broad CRUD, comments, submissions, and silent localStorage import remain disabled.

Phase 256-275 note: character corpus inspection/extraction is script-only and report-only. It does not connect to production DB, change schema, enable writes, or alter Build Planner formulas. Corpus candidates remain `needs_verification` until manually reviewed and applied in a future phase.

Phase 276-295 note: source-pending character intel notes are static frontend data only. They do not require a database, do not enable writes, do not alter canonical character fields, and do not affect Build Planner formulas. Run `npm.cmd run test:character-intel` after changing the intel module.

Phase 296-315 note: mobile/visual polish was limited to static frontend layout and copy. It does not require API mode, database mode, auth, or admin write flags. Public beta still requires a real preview URL for host fallback/header verification and manual screenshot QA.

## Auth/Admin Runtime Status

`GET /api/me` is available as an auth-disabled scaffold and returns `authenticated: false`.

Administrative writes are gated by `ENABLE_LOCAL_ADMIN_WRITES=1`. Verified via `npm.cmd run smoke:admin-writes` against a local DB for codes/news only. Static AdminMode remains browser-local in static mode and must not be treated as backend authorization.

The selected auth path is a local-only admin email/password prototype with backend-owned opaque session cookies. It is disabled by default and only runs when explicitly enabled for local testing. Public login, public registration, production sessions, and admin writes remain disabled.

Phase 44-46 adds the local prototype behind explicit flags. Bootstrap one local admin only against a safe local database:

```sh
$env:DATABASE_URL="postgres://postgres:postgres@localhost:5432/nte_database"
$env:CONFIRM_LOCAL_ADMIN_BOOTSTRAP="1"
$env:LOCAL_ADMIN_EMAIL="admin@example.test"
$env:LOCAL_ADMIN_PASSWORD="Use-A-Strong-Local-Password1!"
npm.cmd run server:auth:bootstrap-local-admin
```

Enable local auth endpoints only while testing locally:

```sh
$env:ENABLE_LOCAL_AUTH="1"
```

Public registration, production auth, production admin content writes, and broad CRUD remain disabled.

## Public Beta Gate

Before public beta:

- Static mode smoke passes.
- API-mode smoke passes against local seeded DB.
- Legal/info pages are reviewed.
- Security headers plan is converted into host config.
- Large bundle warning is accepted or reduced.
- Mobile/tablet QA is complete.
- Production domain and sitemap policy are approved.
- Auth, admin writes, user accounts, and production DB remain disabled unless a future approved phase changes that policy.

## Phase 316-335 Note

Legal/contact, codes, and Build Planner caveat copy changed only in the static frontend. Runtime gates did not change: static mode remains default, API mode remains opt-in, local auth still requires explicit local environment flags, and production auth/registration/admin writes/DB mutations remain disabled. Public beta is still blocked without private contact/takedown intake and a verified real preview URL.

## Phase 336-355 Note

Browser-local AdminMode is no longer a production-preview runtime feature. It is available only in local Vite development with `VITE_ENABLE_BROWSER_ADMIN_MODE=1`. Production preview/builds ignore persisted admin mode and local override collections. `/dev/admin` remains separately gated by dev mode plus `VITE_ENABLE_DEV_ADMIN_PANEL=1`.

Phase 336-355 preview verification note: `https://nevernest-db.pages.dev/` passed build-output, route, SPA fallback, security header, robots/sitemap, and rendered AdminMode lockdown checks. Private friends preview is runtime GO with caveats. Public beta remains blocked by contact/takedown, active-code/media review, mobile screenshot QA, rollback rehearsal, and canonical-domain sitemap approval.

Phase 356-375 note: product polish was limited to static frontend presentation and local AdminMode-only console editor copy. Console `visualGroup` colors are presentation-only and separate from real module rarity. Build Planner formulas/runtime, backend endpoints, DB schema, auth, admin writes, API mode default, and character data were not changed.

Phase 376-395 note: mobile/short-height QA produced static frontend fixes only. `src/App.jsx` clips decorative horizontal overflow and `src/data/news.js` removes public AdminMode wording from placeholder news copy. Runtime gates did not change.

Phase 396-415 note: Skia and Mint were added through static structured character detail patches only. Runtime gates did not change: static mode remains default, API mode remains opt-in, production auth/registration/admin writes/DB mutations remain disabled, `/dev/admin` remains gated, and Build Planner formulas/runtime were not changed.
