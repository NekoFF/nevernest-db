# Phase 44-46 Local Admin Session Prototype

Date: 2026-05-17

## Summary

Phase 44-46 adds a local-only admin bootstrap and session prototype. It does not enable public registration, production authentication, admin content writes, production DB access, deployment, or token/password storage in localStorage.

## Auth Account Schema

`server/src/db/schema/usersAuth.ts` now mirrors the draft `auth_accounts` table with:

- `user_id`
- `provider`
- `provider_account_id`
- `email`
- `password_hash`
- `metadata`
- `created_at`
- `updated_at`

No production migration was run.

## Password Hashing

The prototype uses `bcryptjs` with cost `12`.

Argon2id remains preferred for a future production review, but `bcryptjs` avoids native build friction for this local-only Windows-friendly prototype. Plaintext passwords are never stored or logged.

## Bootstrap Command

Local admin bootstrap is explicit and guarded:

```sh
$env:DATABASE_URL="postgres://postgres:postgres@localhost:5432/nte_database"
$env:CONFIRM_LOCAL_ADMIN_BOOTSTRAP="1"
$env:LOCAL_ADMIN_EMAIL="admin@example.test"
$env:LOCAL_ADMIN_PASSWORD="Use-A-Strong-Local-Password1!"
npm.cmd run server:auth:bootstrap-local-admin
```

The script refuses unsafe database URLs, missing confirmation, missing credentials, and weak passwords. It creates or updates one local admin user, password auth account, admin role, and role assignment.

## Runtime Flags

Local auth endpoints are disabled unless:

```sh
$env:ENABLE_LOCAL_AUTH="1"
```

Optional cookie override:

```sh
$env:LOCAL_AUTH_SECURE_COOKIE="0"
```

`LOCAL_AUTH_SECURE_COOKIE=0` is only for localhost development. Production should use secure cookies.

## Endpoints

Added local-only endpoints:

- `POST /api/auth/local-login`
- `POST /api/auth/logout`

`GET /api/me` still returns unauthenticated by default. With a valid local session, it returns safe user, role, permission, and session metadata. It never returns passwords, password hashes, or session tokens.

## Session Cookie

The session cookie is named `nte_session` and uses:

- `HttpOnly`
- `SameSite=Lax`
- `Path=/`
- `Secure` in production or when configured
- 7-day local prototype expiry

The browser receives only the opaque token cookie. PostgreSQL stores only the SHA-256 session token hash.

## Rate Limit Placeholder

Local login has an in-memory guard keyed by IP and email with generic invalid-credential responses. This is not production-grade distributed rate limiting.

## Frontend Client

Frontend auth client methods exist for:

- `getMe()`
- `localLogin(email, password)`
- `logout()`

They use credentials-aware API calls and do not store passwords or tokens. No global public login UI was added.

## Still Disabled

- Public registration
- Public login
- Production authentication
- Admin content writes
- Admin CRUD persistence
- API mode by default
- Static AdminMode removal
- Build Planner backend persistence
- Production DB
- Deployment

