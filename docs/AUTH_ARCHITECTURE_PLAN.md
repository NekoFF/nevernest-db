# Auth Architecture Plan

Date: 2026-05-17

## Current Decision

Real authentication is not enabled yet. The project does not have public user registration, login, account recovery, production sessions, or admin persistence. This avoids insecure placeholder auth and keeps the current static/localStorage runtime safe.

## Recommended Session Strategy

- Use backend-issued, opaque session cookies.
- Store only a session token hash in the database.
- Send cookies as `HttpOnly`, `Secure`, and `SameSite=Lax` or stricter where possible.
- Do not store session tokens in localStorage.
- Do not trust client-provided roles or permissions.

## Password Handling Policy

- Never store plaintext passwords.
- Use a modern password hash such as Argon2id or bcrypt with appropriate cost settings.
- Add password reset and account recovery only after email ownership and abuse handling are designed.
- Do not implement password login until rate limiting, CSRF protection, and audit logging plans are ready.

## OAuth / Provider Option

OAuth providers may reduce password-handling surface area, but they still require:

- provider account linking tables
- verified email policy
- session issuance
- CSRF/state validation
- account recovery and account deletion policy

## CSRF Plan

- Cookie-backed writes must include CSRF protection.
- Use a server-generated CSRF token or double-submit strategy.
- Exempt only safe read-only endpoints.

## Role Model

Initial future roles:

- `anonymous`
- `user`
- `editor`
- `admin`

Roles must be resolved server-side from `auth_roles` and `user_roles`; they must not come from localStorage or frontend flags.

## Production Blockers Before Public Login

- Final auth provider/session strategy.
- Rate limiting.
- CSRF protection.
- Security headers.
- Admin audit logging.
- Account recovery policy.
- Privacy/legal review.
- Monitoring and error tracking.
- Backup and restore verification.
