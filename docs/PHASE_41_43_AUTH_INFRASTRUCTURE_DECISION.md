# Phase 41-43 Auth Infrastructure Decision

Date: 2026-05-17

## Summary

Phase 41-43 finalizes the auth infrastructure direction without enabling public login, production auth, user accounts, session persistence, or admin writes.

## Decision

The recommended first implementation is a local-only admin email/password prototype using backend-owned opaque session cookies.

OAuth remains deferred because the project first needs a controlled admin path, not public account onboarding.

## Session Policy

Future sessions should use `HttpOnly` backend cookies, `Secure` in production, `SameSite=Lax` initially, `Path=/`, short absolute expiry, token rotation, logout revocation, and server-side session token hashes.

No passwords or session tokens should be stored in localStorage.

## CSRF And Rate Limiting

CSRF is required before cookie-backed writes are enabled. The recommended first approach is a double-submit CSRF token with an `X-CSRF-Token` header for unsafe methods.

Rate limiting must exist before login or admin writes, with separate policies for login attempts, session operations, admin writes, and public read API traffic.

## Permission Model

Initial permission constants are documented in `docs/ADMIN_WRITE_POLICY.md`. Permissions must be resolved server-side from authenticated sessions and database roles.

## Schema Review

The Phase 41-43 review found that the draft SQL included `auth_accounts` but the Drizzle mirror did not. Phase 44-46 added the Drizzle mirror before local password credentials were introduced.

## Still Disabled

- Public registration
- Public login
- Production authentication
- Persistent sessions
- Admin CRUD writes
- Production database
- Deployment
- Token/password localStorage storage

## Recommended Next Phase

Phase 44-46 should implement the local-only admin bootstrap and session prototype behind explicit local guards, still leaving admin content writes disabled until CSRF, rate limiting, validation, and audit logging are proven.
