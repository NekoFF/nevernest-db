# Phase 86-95 Total Project Audit

Date: 2026-05-17

## Executive Summary

Neverness to Everness / NTE Community Database is a strong local prototype and a plausible read-only public beta candidate after mobile QA, deployment configuration, source/licensing review, and production hardening plans are completed. The default runtime remains static/localStorage. API mode remains opt-in through `VITE_DATA_SOURCE=api`, and local DB-backed reads are available only when the backend is explicitly started in DB mode against a safe local database.

The project is not production-platform ready. Production authentication, public registration, production admin writes, production database access, deployment, backups, monitoring, and production rate limiting remain intentionally disabled or missing.

## Scope Audited

- Project scripts and structure in `package.json`, `scripts/`, `public/`, `docs/`, `server/`, `src/`, Drizzle config, and migrations.
- Frontend shell, route parser, pages, navigation, AdminMode, API client, auth client, repositories, and localStorage usage.
- Backend app assembly, routes, services, repositories, contracts, schemas, plugins, auth/session code, DB safety guard, Drizzle schema, migrations, seed scripts, and tests.
- Data audit, import dry-run, seed preview, local import report, runtime readiness docs, deployment checklist, security baseline, and admin write policy.

## Readiness Snapshot

| Area | Status | Risk |
| --- | --- | --- |
| Static read-only frontend | Usable local prototype; likely beta-ready after mobile QA | Medium |
| API read mode | Works locally behind explicit flags and local DB guard | Medium |
| Backend public reads | Characters, weapons, cartridges/modules, vehicles, tier list, codes, news, guides/community/apartments read skeletons exist | Medium |
| Local admin writes | Codes/news only, gated and smoke-tested locally | High for production |
| Auth | Local-only prototype behind `ENABLE_LOCAL_AUTH=1` | High for production |
| Data | No blocker-level audit issues, but many `needs_verification` rows | Medium |
| Deployment | Not configured | High |
| Production security | Planned/scaffolded, not complete | Critical for production |

## Frontend Runtime Audit

Static mode is the default. Missing, `static`, or unknown `VITE_DATA_SOURCE` values resolve to static mode through `src/api/apiConfig.js` and `src/repositories/dataSource.js`. Static mode uses bundled data plus browser-local AdminMode overrides and Build Planner localStorage state.

API mode is opt-in with:

```sh
$env:VITE_DATA_SOURCE="api"
$env:VITE_API_BASE_URL="http://127.0.0.1:4000"
```

API-mode pages use unified repositories and read from the backend when the flag is set. Admin editing controls on public pages are suppressed in API mode by `effectiveAdminMode = isAdminMode && !apiMode`.

Routes parsed in `src/App.jsx`:

| Route | Current behavior |
| --- | --- |
| `/` | Home page, static data |
| `/characters` | Unified static/API list |
| `/characters/:slug` | Unified static/API detail |
| `/weapons` | Unified static/API list |
| `/weapons/:slug` | Unified static/API detail |
| `/modules` | Unified static/API cartridges/shapes/pieces |
| `/modules/:slug` | Unified static/API cartridge detail |
| `/modules/pieces/:shapeId/:rarity` | Module piece detail UI |
| `/vehicles` | Unified static/API list/showcase |
| `/tier-list` | Unified static/API official tier list plus personal localStorage mode |
| `/codes` | Unified static/API list |
| `/news` | Unified static/API list/detail modal |
| `/guides` | Page exists; backend has read skeleton/DB repository shape, data is sparse |
| `/apartments` | Placeholder page |
| `/community` | Placeholder page |
| `/build-planner` | Static/localStorage runtime, intentionally unchanged |
| `/about`, `/disclaimer`, `/privacy`, `/contact` | Legal/info page variants |
| `/dev/admin` and `/admin-dev` | Dev admin panel component; panel content gated by dev flag |

Navigation:

- Sidebar lists Home, Characters, Weapons, Modules, Vehicles, Build Planner, Apartments, Tier List, Guides, Codes, News, Community, legal/info links, and Dev Admin only when `import.meta.env.DEV && VITE_ENABLE_DEV_ADMIN_PANEL === "1"`.
- Topbar search spans characters, weapons, cartridges, codes, vehicles, and news from merged static/AdminMode data.
- Topbar account menu is placeholder-only for future sign-in/profile features and does not enable production auth.

Loading/error/empty states:

- Route-level lazy fallback exists.
- Public data pages use local loading/error handling through `useAsyncData` patterns and page-level empty states.
- API-mode failures surface as frontend error messages; no global retry/backoff policy exists.

Frontend risk areas:

- Mobile/tablet needs a focused QA pass across dense character detail, vehicles, module detail, Build Planner, topbar search, sidebar overlay, and modal editors.
- Some placeholder surfaces, including Apartments and Community, are visible before real content exists.
- The sidebar has a visible text-encoding issue in the support button label.
- Build output currently needs bundle-size review and route-splitting follow-up.

## Backend API Audit

The backend is assembled in `server/src/app.ts`, uses Fastify, registers CORS, public routes, auth routes, admin routes, and read routes. Default data mode is `disabled`. `mock` and `db` are explicit.

Public routes:

- `GET /health`
- `GET /api/status`
- `GET /api/characters`
- `GET /api/characters/:idOrSlug`
- `GET /api/weapons`
- `GET /api/weapons/:idOrSlug`
- `GET /api/cartridges`
- `GET /api/cartridges/:idOrSlug`
- `GET /api/modules/shapes`
- `GET /api/modules/pieces`
- `GET /api/vehicles`
- `GET /api/vehicles/:idOrSlug`
- `GET /api/tier-lists/official`
- `GET /api/codes`
- `GET /api/news`
- `GET /api/news/:idOrSlug`
- `GET /api/guides`
- `GET /api/guides/:idOrSlug`
- `GET /api/community-links`
- `GET /api/apartments/items`

Response envelopes are mostly consistent:

- Success: `{ ok: true, data, meta }`
- Domain errors: `{ ok: false, status, message, issues? }`
- Health/status are plain operational envelopes and do not use the shared `ok(data, meta)` helper.

Behavior:

- Disabled mode returns stable `501 not_implemented` for DB-backed read routes.
- Mock/test mode returns fixture-backed reads.
- DB mode requires `DATABASE_URL` to pass `assertLocalDatabaseUrl`.
- Missing detail rows return `404 not_found`.
- Validation errors return `400 validation_error`.
- Auth failures return `401 unauthorized`; missing permissions return `403 forbidden`.
- Unknown server errors are redacted to `Internal server error`.

Known limitations:

- Pagination metadata reports `total` as returned row count, not a separate full-table count.
- Guides, community links, and apartments have endpoint/repository shapes but little or no production-ready seed content.
- No production API hosting configuration exists.

## Auth And Security Audit

Local auth status:

- Disabled unless `ENABLE_LOCAL_AUTH=1`.
- Local admin bootstrap requires `CONFIRM_LOCAL_ADMIN_BOOTSTRAP=1` and a safe local DB URL.
- Login sets an opaque `HttpOnly` `nte_session` cookie.
- Session token hashes are stored server-side.
- Password hashes are stored in `auth_accounts`; passwords are not returned to the frontend.
- Logout requires CSRF and clears the cookie.

CSRF:

- `GET /api/auth/csrf` is local-auth gated.
- CSRF uses an `nte_csrf` cookie and `X-CSRF-Token` header comparison.
- The Dev Admin Panel stores the token only in React state.

CORS:

- CORS allows configured origins and credentials.
- Default local dev origins are `http://localhost:5173` and `http://127.0.0.1:5173`.
- Production CORS policy still needs a final canonical host.

Rate limiting:

- Login and CSRF endpoints have in-memory rate limits.
- This is acceptable for local testing but not production.

Remaining production risks:

- Production auth is not designed or enabled.
- Rate limiting needs a production store.
- Security headers are planned but not configured in hosting.
- Audit logs are sanitized scaffolds, not durable DB writes.
- Backups, monitoring, error tracking, and incident response are missing.
- Browser-local AdminMode must never become backend authorization.

## Admin/Write Infrastructure Audit

Active backend write endpoints:

- `PATCH /api/admin/codes/:idOrSlug`
- `PATCH /api/admin/news/:slug`

Skeleton-only endpoints:

- `POST /api/admin/characters`
- `PATCH /api/admin/characters/:id`

The functional endpoints use `runAdminMutation`:

1. `ENABLE_LOCAL_ADMIN_WRITES=1`
2. CSRF validation
3. session lookup
4. permission check
5. service availability
6. Valibot body validation
7. DB mutation
8. sanitized audit scaffold

This is sufficient for local QA of existing code/news rows. It is not production admin infrastructure because durable audit logging, production auth, production rate limiting, backup/restore, and operator runbooks are missing.

Characters, weapons, modules/cartridges, vehicles, and tier-list writes should remain disabled because their models are deeper, their source-status implications are higher, and partial writes could corrupt related tables or source verification state.

## Database And Data Pipeline Audit

Database/migrations:

- Drizzle config requires `DATABASE_URL` and writes migrations to `server/drizzle`.
- Migration `0000_faulty_deathstrike.sql` creates the main read schema.
- Migration `0001_classy_mathemanic.sql` adds `auth_accounts`.
- Auth/user/session/admin log schema exists in `server/src/db/schema/usersAuth.ts`.
- Production migrations are not automated.

Data pipeline:

- `npm.cmd run audit:data` reports 0 blockers.
- `npm.cmd run import:dry-run` reports 0 blockers, 48 needs-verification issues, and 3 warnings.
- `npm.cmd run server:seed:preview` reports 1801 preview rows, 1759 future local import rows, 42 blocked rows, 97 needs-verification rows, 0 blockers, and 3 warnings.
- Local seed import is dry-run unless `CONFIRM_LOCAL_SEED_IMPORT=1`.
- Production DB import remains disabled.

Data gaps:

- Cartridge compatible shapes remain `needs_verification`.
- Character material rows are blocked from local import pending source verification and canonical material review.
- Guides, community links, and apartment items are not production-ready.
- Many rows carry `unknown`, `estimated`, `needs_verification`, or `placeholder` source status.
- Media aliases are explicit and safe but should be cleaned up later.

## Deployment/Public Beta Audit

Missing before public beta:

- Hosting provider and SPA fallback config.
- Canonical domain and HTTPS.
- Production environment variable plan.
- Sitemap with canonical host.
- Mobile/tablet QA.
- Legal/privacy/contact/source review.
- Static smoke and build verification after final deployment config.

Missing before production platform:

- Production DB, migration policy, backups, and restore tests.
- Monitoring, error tracking, alerting, and logging runbooks.
- Production CORS, security headers, and rate limiting.
- Production auth/session design.
- Durable audit logs.
- Admin write approval workflow.

## Performance Audit

Current status:

- React pages are lazy-loaded at the route-module level.
- Static assets live under `public/assets/nte`.
- API list limits are fixed in frontend repositories, often `limit: 100`.
- Backend list metadata does not provide a true full count.

Risks:

- Large images and build chunks need review before public beta.
- Vehicle showcase, character detail, module boards, and Build Planner are likely mobile performance hotspots.
- No CDN/image transform plan exists.
- No formal performance budget exists.

Public beta blocker level:

- Mobile QA and obvious image/layout regressions should block beta.
- Deep CDN optimization can wait if build/smoke checks pass and mobile is acceptable.

## Safest Next Implementation Order

1. Mobile/tablet QA and layout fixes.
2. Data quality cleanup for modules/cartridges/materials/sourceStatus.
3. Bundle/image/performance pass.
4. Public beta deployment prep for read-only static/API scope.
5. Production security headers, rate limiting, monitoring, and backups.
6. Read-only public beta.
7. Production auth and admin writes only after explicit security gates.

## Conclusion

Ready: local static prototype, local DB-backed read API, local code/news admin QA, seed/import preview pipeline, and security scaffolds.

Unsafe: production auth, production admin writes, production DB operations, public registration, and broad CRUD.

Incomplete: deployment, backups, monitoring, mobile QA, source/licensing review, durable audit logs, production rate limiting, true pagination totals, and production security headers.
