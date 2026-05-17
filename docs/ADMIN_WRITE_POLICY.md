# Admin Write Policy

Date: 2026-05-17

## Current State (Phase 56-58)

The first real local-only admin write endpoint is hardened and isolated:
- **Endpoint:** `PATCH /api/admin/codes/:idOrSlug` (defined in `server/src/routes/admin.ts`)
- **Safety Flag:** Requires `ENABLE_LOCAL_ADMIN_WRITES=1`.
- **Guards:** Requires valid Session, `codes/write` permission, and CSRF validation.
- **Audit:** All successful updates are logged via `AdminAuditService` with sensitive field redaction (passwords, tokens, cookies, CSRF).
- **QA:** Manual local QA steps are documented in `docs/ADMIN_CODE_WRITE_LOCAL_QA.md`.

## Permission Constants

Future admin writes should use stable slash-delimited permission constants:

- `content/read`
- `content/write`
- `content/publish`
- `characters/write`
- `weapons/write`
- `modules/write`
- `vehicles/write`
- `codes/write`
- `news/write`
- `users/manage`
- `admin/audit/read`

Earlier skeleton routes are now wired to real permissions. The transitional `manage:content` placeholder has been removed. Before enabling writes, update route guards and tests to use the stable constants above.

The backend must derive permissions from authenticated sessions and database roles, not frontend state.

Frontend permission displays are allowed only as hints. They are not trusted authority.

## Write Requirements

Before enabling any admin write endpoint:

- Real session authentication.
- Role/permission checks.
- CSRF protection for cookie-backed writes.
- Rate limiting.
- Validation schemas per write contract.
- Source-status policy enforcement.
- Audit log row for every create/update/delete.

## Audit Logging

Audit logs should capture:

- admin user id
- entity type
- entity id or external id
- action
- before JSON summary
- after JSON summary
- IP address
- user agent
- timestamp

The existing `admin_logs` schema is a reasonable scaffold for this.

## LocalStorage Override Policy

Static AdminMode localStorage overrides must not be silently imported into a production database. Any future import must be explicit, reviewed, validated, source-status aware, and audited.

## Current Skeleton Routes

Representative backend skeletons exist:

- `POST /api/admin/characters`
- `PATCH /api/admin/characters/:id`

They now require authentication and `characters/write` permission. After successful authorization, they continue to return stable `not_implemented` responses and do not write to the database.

