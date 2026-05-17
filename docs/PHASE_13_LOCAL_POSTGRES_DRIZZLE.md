# Phase 13 Local PostgreSQL Drizzle Setup

Date: 2026-05-16

## What Changed

Phase 13 added local-only PostgreSQL and Drizzle migration setup for development. It does not connect the frontend to the backend, enable production database access, import production data, add authentication, or add admin write endpoints.

Created setup:

- `docker-compose.yml` with a local PostgreSQL 16 service
- `drizzle.config.ts` for Drizzle Kit
- initial generated migration files under `server/drizzle/`
- local database safety guard in `server/src/db/safety.ts`
- explicit DB command wrappers in `server/src/scripts/`
- DB safety tests in `server/tests/db/safety.test.ts`

## Local PostgreSQL

Start the local database:

```sh
docker compose up -d postgres
```

The service uses:

- container: `nte-postgres-local`
- database: `nte_database`
- user: `postgres`
- password: `postgres`
- port: `5432`
- volume: `nte_postgres_local_data`

Stop it:

```sh
docker compose stop postgres
```

Remove the local data volume only when you intentionally want to reset local data:

```sh
docker compose down -v
```

## Safety Guard

DB scripts call `assertLocalDatabaseUrl()` before connecting or invoking Drizzle Kit. Allowed hosts are:

- `localhost`
- `127.0.0.1`
- `postgres`

The database name must be present and end with one of:

- `_database`
- `_dev`
- `_local`
- `test`

The guard rejects missing URLs, invalid URLs, non-PostgreSQL protocols, production-looking hosts, and URLs without a database name.

## Commands

Check the local database connection:

```sh
npm.cmd run server:db:check
```

Generate migrations from the Drizzle schema mirror:

```sh
npm.cmd run server:db:generate
```

Apply migrations locally:

```sh
npm.cmd run server:db:migrate
```

`server:db:migrate` must only be used with an explicit local/dev `DATABASE_URL`. It is not a production migration command.

Initial migration generation succeeded and produced:

- `server/drizzle/0000_faulty_deathstrike.sql`
- `server/drizzle/meta/0000_snapshot.json`
- `server/drizzle/meta/_journal.json`

Migration application was not run in this environment because Docker/PostgreSQL was not available.

## Drizzle Setup

`drizzle.config.ts` uses:

- schema: `server/src/db/schema/index.ts`
- output: `server/drizzle`
- dialect: PostgreSQL
- connection source: `DATABASE_URL`

If `DATABASE_URL` is missing, Drizzle config fails with a clear message. Normal frontend builds and backend tests do not load this config.

## Still Disabled

- production database connections
- production migrations
- seed writes to PostgreSQL
- real repository DB queries
- frontend API integration
- real authentication
- admin write endpoints
- Build Planner persistence changes
- localStorage/AdminMode changes

## Next Phase Recommendation

Phase 14 should add local-only DB read adapters behind explicit `SERVER_DATA_MODE=db`, plus repository contract tests against an empty/local migrated database. Keep seed writes, production migrations, auth, admin writes, and frontend integration disabled until those boundaries are reviewed.
