# Phase 37-40 Auth/Admin Scaffold

Date: 2026-05-17

## Summary

Phase 37-40 adds safe auth/admin architecture scaffolding without enabling real authentication, public registration, user accounts, admin writes, production DB access, or deployment.

## Backend Contracts

Added auth contract shapes for:

- current user response
- session metadata
- login request placeholder
- logout response
- roles and permissions

`GET /api/me` now returns a stable authenticated-false envelope:

```json
{
  "ok": true,
  "data": {
    "authenticated": false,
    "user": null,
    "roles": [],
    "permissions": []
  },
  "meta": {
    "source": "auth-disabled"
  }
}
```

## Admin Guard Skeleton

Representative admin routes exist but are disabled:

- `POST /api/admin/characters`
- `PATCH /api/admin/characters/:id`

They return `not_implemented` and do not write to the database.

## DB Schema Review

Existing schema files:

- `server/src/db/schema/usersAuth.ts`
- `server/src/db/schema/index.ts`
- `db/schema.draft.sql`

Current Drizzle auth scaffold includes:

- `users`
- `auth_roles`
- `user_roles`
- `sessions`
- `admin_logs`

This is enough for a future local prototype of users, roles, sessions, and admin audit logs. It does not yet include OAuth provider account tables, password credential tables, password reset tokens, email verification tokens, or session revocation metadata beyond expiry. No migration was run in this phase.

## Frontend Scaffold

Added frontend auth API scaffold for `/api/me`.

It defaults to unauthenticated, does not store tokens, does not store passwords, and does not enable login UI.

## AdminMode Relationship

Static AdminMode remains browser-local and available in static mode. API mode admin editing remains unavailable. Future admin persistence requires real auth, admin write endpoints, validation, source-status policy, and audit logging.

LocalStorage overrides must not be silently imported into production DB.

## Still Disabled

- Public user registration
- Password login
- OAuth login
- Persistent sessions
- User accounts
- Admin write endpoints
- Production DB
- Deployment

## Recommended Next Phase

Phase 41-43 completed the provider/session decision work in `docs/PHASE_41_43_AUTH_INFRASTRUCTURE_DECISION.md`. The next implementation phase should remain local-only and should start with an admin bootstrap/session prototype, still without public login or admin writes.
