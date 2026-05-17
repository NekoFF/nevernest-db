# CSRF Strategy

Date: 2026-05-17

## Current State (Phase 50-52)
Real CSRF validation is implemented for local auth unsafe routes.
- **Endpoint:** `GET /api/auth/csrf`
- **Availability:** Only when `ENABLE_LOCAL_AUTH=1`.
- **Behavior:**
  - Issues a random 32-byte hex token.
  - Sets a non-HttpOnly `nte_csrf` cookie.
  - Returns the token in the response body.
- **Validation:**
  - Required for `POST /api/auth/logout`, `POST /api/admin/characters`, and `PATCH /api/admin/characters/:id`.
  - Compares the `nte_csrf` cookie with the `X-CSRF-Token` header.
  - Fails with `403 Forbidden` (`csrf_error`) if missing or mismatched.

## Implementation Details
- Tokens are generated using `node:crypto.randomBytes(32)`.
- Validation is performed in `server/src/plugins/adminGuard.ts`.
- Frontend can retrieve the token via `getCsrfToken()` in `apiAuthClient.js`.

## Future Implementation
- Full token validation for all state-mutating requests (POST, PUT, PATCH, DELETE) once more write routes are added.
- Enforce strict Origin / Referer header checking.