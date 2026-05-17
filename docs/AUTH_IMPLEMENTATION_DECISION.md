# Auth Implementation Decision

Date: 2026-05-17

## Decision

The recommended initial path is Option A: email/password for an admin-only local prototype, backed by backend-owned opaque session cookies.

This is not approval to enable public login. Public registration, public login, production authentication, user accounts, and admin writes remain disabled.

## Why This Path

Email/password with backend-owned sessions is the most practical first implementation for this project because the near-term need is controlled admin access, not public community accounts. It keeps the provider surface small, avoids OAuth app setup and provider account-linking complexity, and can be tested locally without adding external dependencies.

OAuth remains a good later option if public users become important, but OAuth-first would still require provider allowlists, redirect URI policy, account linking, state validation, verified email handling, and production callback configuration. That is more moving machinery than the current admin-only goal needs.

## Password Policy

When password auth is implemented:

- Store only password hashes.
- Use Argon2id if the runtime dependency is acceptable; otherwise use bcrypt with reviewed cost settings.
- Never log passwords.
- Never return password fields in API responses.
- Never store passwords or password-derived values in localStorage.
- Do not add password reset until email delivery, abuse controls, and token hashing are designed.

## Prototype Hashing Choice

Phase 44-46 uses `bcryptjs` with cost `12` for the local-only prototype. This avoids native Argon2 build friction on the current Windows development path while keeping plaintext passwords out of storage and logs. Revisit Argon2id before any production authentication decision.

## Session Cookie Policy

Browser sessions should use backend-issued opaque session cookies.

Intended cookie behavior:

- Name: `nte_session` unless a future host policy requires a prefix such as `__Host-nte_session`.
- `HttpOnly`: always.
- `Secure`: always in production; local development may use non-secure cookies on `localhost`.
- `SameSite`: `Lax` for the first prototype; consider `Strict` if OAuth/cross-site entry flows are not needed.
- `Path`: `/`.
- Expiry: short-lived absolute expiry, initially 7 days for local prototype sessions.
- Rotation: rotate the session token on login and periodically on privileged activity or session refresh.
- Logout: delete the browser cookie and revoke/delete the server-side session row.
- Storage: store only a hash of the session token in PostgreSQL.
- Client storage: do not store session tokens in localStorage, sessionStorage, IndexedDB, or frontend state beyond the current `/api/me` response.

## Session Metadata

Future `/api/me` responses may include safe metadata such as:

- `authenticated`
- user id or external id
- display name
- roles
- permissions
- session expiry

The frontend must treat this as display state only. Authorization decisions belong on the backend.

## Initial Scope

The first implementation should be local-only:

- Bootstrap one admin user with a local script.
- Disable public registration.
- Disable public login routes until explicitly approved.
- Create sessions only through a local admin login prototype.
- Keep admin write endpoints disabled until CSRF, rate limiting, validation, and audit logs are wired.

## Deferred

- Public user accounts.
- OAuth providers.
- Password reset.
- Email verification.
- Account deletion.
- Production identity provider configuration.
- Remember-me sessions.
- Multi-factor authentication.
