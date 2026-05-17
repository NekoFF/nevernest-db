# Environment Configuration

Date: 2026-05-17

This is the production-readiness environment reference. Static mode remains the default and no production database is enabled in this phase.

## Frontend

`VITE_DATA_SOURCE`

- Optional.
- Default: `static`.
- Allowed values: `static`, `api`.
- `static` keeps the existing static/localStorage runtime.
- `api` enables experimental read-only API mode for selected pages.
- API mode must not become the default without an explicit future phase.

`VITE_API_BASE_URL`

- Optional unless `VITE_DATA_SOURCE=api`.
- Local development default: `http://127.0.0.1:4000`.
- Should point to a local backend during development.
- Do not use this to connect the public frontend to a production backend in this phase.

## Backend

`SERVER_DATA_MODE`

- Optional.
- Supported development values include `mock` and `db`.
- Omit it for disabled/default route skeleton behavior.
- `db` is local-only and read-only.

`DATABASE_URL`

- Required only for explicit DB mode and DB scripts.
- Must point to a local/dev PostgreSQL database.
- Safety guards reject missing or production-looking URLs.

Example local value:

```sh
postgres://postgres:postgres@localhost:5432/nte_database
```

## Current Policy

- Static mode is the frontend default.
- API mode is experimental and opt-in.
- Backend DB mode is local-only.
- Production database access is not enabled.
- Real authentication, user accounts, admin write endpoints, and production deployment remain disabled.
