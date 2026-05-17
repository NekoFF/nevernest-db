# API / Backend Plan

Date: 2026-05-16

Phase 8 added a backend scaffold under `server/`. The frontend is not connected to it yet, and the scaffold does not connect to a production database.

Current safe endpoints:

- `GET /health`
- `GET /api/status`

Current route skeletons return `501 Not Implemented` until database-backed reads are implemented in a later phase.

Phase 9 added:

- API contracts in `server/src/contracts/`
- Valibot validation schemas in `server/src/schemas/`
- read-only repository interfaces in `server/src/repositories/`
- service boundaries in `server/src/services/`
- broader Drizzle schema mirror in `server/src/db/schema/`

These additions still do not connect to PostgreSQL, run migrations, or change frontend runtime behavior.

Phase 11 added route dependency injection and explicit mock-backed read endpoints. Mock mode is enabled with `SERVER_DATA_MODE=mock` or `npm.cmd run server:dev:mock`.

Mock-backed endpoints currently include characters, weapons, cartridges, vehicles, the official tier list route, codes, and news. Default mode remains disabled and returns `501` for database-backed reads.

Phase 12 completed mock coverage for the remaining public read skeletons: module shapes, module pieces, news detail, guides, community links, and apartment items. It also added API response contract snapshots under `server/tests/snapshots/`.

Phase 13 added local-only PostgreSQL and Drizzle migration setup:

- `docker-compose.yml` for local PostgreSQL 16
- `drizzle.config.ts` for Drizzle Kit
- guarded DB commands for check, generate, and migrate
- local URL safety checks in `server/src/db/safety.ts`
- DB safety tests

These additions still do not connect to production PostgreSQL, run migrations automatically, write seed data, enable auth, or change frontend runtime behavior.

Phase 14 added local-only DB-backed read adapters behind explicit `SERVER_DATA_MODE=db`. DB mode requires `DATABASE_URL` to pass the local safety guard before repositories are created. Empty local tables return stable empty list envelopes, and missing detail rows return clean `404 not_found` responses.

Phase 15 added backend seed adapter contracts and a read-only seed preview command. The seed preview reads generated import dry-run artifacts, validates Drizzle-oriented seed policy, builds an ordered plan, and writes preview reports without touching PostgreSQL.

Phase 16 added optional DB-aware seed preview comparison. It reads local table counts after the database URL safety guard passes and compares them against the generated seed plan. It remains read-only.

Phase 17 added local seed import v1. It is dry-run by default and requires `CONFIRM_LOCAL_SEED_IMPORT=1` before local DB writes are allowed. It imports only approved seed-plan rows and skips blocked draft material rows.

Phase 18-20 added seeded DB verification scaffolding plus a dormant frontend API client. In this environment, confirmed local seed import and DB-backed API smoke were skipped because Docker/PostgreSQL was unavailable (`docker` was not installed or not on PATH). The local seed import dry-run remained current: 1767 planned local import rows, 1767 would insert, 0 would update, 42 blocked material rows skipped, and 0 failed.

The frontend now has a fetch-based API client scaffold in `src/api/`, API repositories in `src/repositories/api/`, and a data source selector in `src/repositories/dataSource.js`. The frontend still defaults to `static` mode, existing static/localStorage behavior remains intact, and the API switch is not enabled by default. Experimental API reads require `VITE_DATA_SOURCE=api` and `VITE_API_BASE_URL`.

## Recommended Backend Direction

Target stack: Node.js backend with PostgreSQL.

| Option | Strengths | Tradeoffs | Fit |
| --- | --- | --- | --- |
| Express + Prisma | Familiar, fast to start, large ecosystem, Prisma migrations/client are approachable. | Express leaves more architecture decisions to the project. Prisma can be less flexible for very custom SQL. | Good early choice. |
| Fastify + Drizzle | Fast, typed routes/plugins, Drizzle maps closely to SQL and keeps migrations transparent. | Slightly more setup; Drizzle has less "batteries included" admin ergonomics than Prisma. | Best fit for SQL-conscious migration. |
| NestJS + Prisma/Drizzle | Strong architecture, DI, modules, guards. | Heavier framework than this project needs right now. | Later if team grows. |

Preferred option for this project: Fastify + Drizzle + PostgreSQL.

Reason: the project is data-heavy, SQL-readiness matters, and Drizzle keeps the schema close to PostgreSQL while Fastify stays lighter than NestJS. Prisma remains a valid fallback if admin CRUD speed becomes more important than SQL transparency.

Phase 8 scaffold status:

- Root-managed backend scripts are available.
- TypeScript is scoped to `server/`.
- Fastify app creation is isolated in `server/src/app.ts`.
- DB client creation is lazy and never called by health/status routes.
- Drizzle schema mirror currently includes only a small taxonomy slice.
- Phase 9 expanded that mirror to core public API tables and future auth/admin audit tables.
- Phase 11 added a service container so routes can use mock services without changing the default DB-free behavior.
- Phase 12 added response snapshot tests so future frontend integration has stable envelopes to target.
- Phase 13 added local-only PostgreSQL and Drizzle command scaffolding behind explicit safety guards.
- Phase 14 added read-only Drizzle repository adapters and skipped-by-default empty DB contract tests.
- Phase 15 added seed adapter contract tests and a local-only seed preview report.
- Phase 16 added DB-aware seed preview comparison and seed staging design docs.
- Phase 17 added a guarded local seed import command with dry-run default behavior.
- Phase 18-20 added gated seeded DB route tests and a frontend API client scaffold while keeping the API switch disabled by default.

## API Route Groups

### Public Database Endpoints

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
- `GET /api/news/:slug`
- `GET /api/guides`
- `GET /api/guides/:slug`
- `GET /api/community-links`
- `GET /api/apartments/items`

### Authenticated User Endpoints

- `GET /api/me`
- `GET /api/me/build-drafts`
- `POST /api/me/build-drafts`
- `PATCH /api/me/build-drafts/:id`
- `DELETE /api/me/build-drafts/:id`
- `POST /api/me/saved-builds`
- `GET /api/me/tier-lists`
- `POST /api/me/tier-lists`
- `PATCH /api/me/tier-lists/:id`

### Admin Endpoints

- `POST /api/admin/characters`
- `PATCH /api/admin/characters/:id`
- `POST /api/admin/weapons`
- `PATCH /api/admin/weapons/:id`
- `POST /api/admin/cartridges`
- `PATCH /api/admin/cartridges/:id`
- `POST /api/admin/vehicles`
- `PATCH /api/admin/vehicles/:id`
- `POST /api/admin/codes`
- `PATCH /api/admin/codes/:id`
- `POST /api/admin/news`
- `PATCH /api/admin/news/:id`
- `POST /api/admin/media`
- `GET /api/admin/logs`

Admin writes must create `admin_logs` rows.

## Auth Flow Plan

Do not implement real auth until backend exists.

Future plan:

- Use backend-owned sessions or OAuth provider sessions.
- Store session tokens server-side hashed in `sessions`.
- Use `auth_roles` for permissions, not gameplay `roles`.
- Never store passwords in localStorage.
- Frontend `src/auth/AuthContext.jsx` remains inactive until connected to real `/api/me`.

## Upload / Media Plan

Initial production-safe path:

1. Keep static/public assets for seed media.
2. Store media metadata in `media_assets`.
3. Preserve `entity_external_id` from filename-derived ids.
4. Use `resolved_entity_external_id` from `src/data/mediaAliases.js` for canonical links.
5. Later add admin uploads to object storage such as S3/R2 with virus/type/size validation.

## Seed Import Plan

Use `src/data/exportDataIndex.js` as the static seed snapshot source later. Import should call normalizers first, not scrape UI components directly.

Seed import should be repeatable and idempotent by `external_id` or `slug`.

Current scaffold command:

- `npm.cmd run server:seed:dry-run`

This delegates to the existing import dry-run and does not write to PostgreSQL.

Seed preview command:

- `npm.cmd run server:seed:preview`
- `npm.cmd run server:seed:preview:db`
- `npm.cmd run server:seed:import:local`

This reads `.generated/import-dry-run/` artifacts, validates them, and writes `docs/SEED_PREVIEW_REPORT.md` plus `.generated/server-seed-preview/` JSON artifacts. It does not insert, update, delete, or connect to production data.

The DB-aware variant additionally requires a safe local `DATABASE_URL`, inspects table counts, and writes `docs/SEED_DB_PREVIEW_REPORT.md`. It still does not write data.

The local import command writes only when `CONFIRM_LOCAL_SEED_IMPORT=1` is set and `DATABASE_URL` passes the local safety guard. Production import remains disabled.

Local-only DB commands:

- `npm.cmd run server:db:check`
- `npm.cmd run server:db:generate`
- `npm.cmd run server:db:migrate`

These commands require `DATABASE_URL` to pass the local DB guard. They are not production migration commands.

Explicit DB read mode:

- `npm.cmd run server:dev:db`
- `npm.cmd run server:test:db`

DB mode is local-only, read-only, and does not import seed data.

## Validation Strategy

- Use Zod or Valibot for API request validation.
- Use database constraints for uniqueness, enums, foreign keys, and basic value checks.
- Keep source-quality flags explicit with `source_status`.
- Validate export snapshot before SQL import using `npm.cmd run audit:data`.

## Rate Limiting / Security Notes

- Public GET endpoints can be cached and rate-limited generously.
- Admin and user mutation endpoints need strict CSRF/session protections.
- Upload endpoints need file type, file size, extension, and content checks.
- Admin actions must be logged in `admin_logs`.
- Fan-site legal/disclaimer content should be visible before production launch.

## Deployment Notes

Suggested future deployment:

- Frontend: static hosting/CDN.
- Backend: Node service on VPS, Render, Fly.io, Railway, or similar.
- Database: managed PostgreSQL with backups.
- Media: CDN-backed object storage.
- Observability: request logs, error tracking, uptime monitor.

Do not place ads until mobile layout, performance, legal disclaimers, and asset licensing are production-reviewed.
