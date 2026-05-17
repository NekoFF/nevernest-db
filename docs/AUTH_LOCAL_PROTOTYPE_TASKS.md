# Auth Local Prototype Tasks

Date: 2026-05-17

This plan breaks future auth work into safe local-only steps. It does not enable public login or admin writes.

## Phase A: Local Admin Session Prototype

- Add a local-only admin bootstrap script. Done in Phase 44-46.
- Require an explicit local confirmation environment variable. Done in Phase 44-46.
- Store one admin user in `users`. Done in Phase 44-46.
- Store password credentials using Argon2id or bcrypt. Done with `bcryptjs` cost `12` in Phase 44-46.
- Store only password hashes. Done in Phase 44-46.
- Add backend login route for local development only. Done in Phase 44-46 behind `ENABLE_LOCAL_AUTH=1`.
- Issue an `HttpOnly` session cookie. Done in Phase 44-46.
- Store only `session_token_hash` server-side. Done in Phase 44-46.
- Update `/api/me` to return authenticated admin state only when a valid server-side session exists. Done in Phase 44-46.
- Keep public registration disabled.
- Keep admin write endpoints disabled.

## Phase B: Write Safety Infrastructure

- Add CSRF token issuance and validation for unsafe methods.
- Add rate limiting for login, logout, session refresh, and admin skeleton routes.
- Replace admin skeleton guard with real server-side role checks.
- Add audit-log helpers.
- Keep actual content writes disabled until validation contracts are ready.

## Phase C: Admin Write Endpoints

- Add one write endpoint at a time.
- Require validation schemas per endpoint.
- Require source-status policy checks.
- Emit audit logs for every mutation.
- Add integration tests proving writes only occur with a valid admin session, CSRF token, and permission.
- Keep localStorage overrides out of backend import unless explicitly reviewed.

## Phase D: Optional Public Users

- Decide whether public users are needed.
- Add registration only after email verification, abuse handling, privacy review, and account deletion policy exist.
- Add account recovery only after reset-token hashing and rate limits exist.
- Evaluate OAuth providers if public sign-in becomes important.
