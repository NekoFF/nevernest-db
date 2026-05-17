# Phase 50-52: CSRF Validation and Admin Write Safety

Date: 2026-05-17

This phase focuses on implementing real CSRF validation and write-safety infrastructure for future admin writes, while keeping all admin content writes disabled.

## CSRF Validation
Implemented real CSRF validation for all state-mutating local auth routes.
- **Issuance:** `GET /api/auth/csrf` issues a random 32-byte hex token and sets a non-HttpOnly `nte_csrf` cookie.
- **Validation:** Required for `POST /api/auth/logout`, `POST /api/admin/characters`, and `PATCH /api/admin/characters/:id`.
- **Mechanism:** Compares the `nte_csrf` cookie with the `X-CSRF-Token` header.
- **Security:** CSRF tokens are never accepted from the URL query string.

## Rate Limiting
Lightweight in-memory rate limiting hardened for local auth:
- **Login attempts:** Limited by IP + normalized email (60s window, max 5 attempts).
- **CSRF endpoint:** Limited by IP (60s window, max 10 attempts).
- **Responses:** Returns generic `invalid_credentials` for login and `429 rate_limited` for CSRF.

## Admin Audit Service
Hardened the `AdminAuditService` scaffold:
- **Sanitization:** Implemented recursive sanitization of sensitive keys (password, token, secret, hash, cookie) in audit payloads.
- **Metadata:** Safely formats IP and User-Agent metadata.
- **Safety:** Does not perform actual DB writes and is not called from skeleton routes yet.

## Write Validation Scaffold
Added skeleton schemas and contracts for future admin writes:
- **Schemas:** `server/src/schemas/adminWrites.ts` includes Valibot schemas for character create/update.
- **Contracts:** `server/src/contracts/adminWrites.ts` defines request and response shapes.
- **Status:** These are not yet wired to active mutations.

## Frontend Auth Client
- Updated `src/auth/apiAuthClient.js` with `getCsrfToken()` helper.
- Admin editing remains unavailable in API mode.

## Verified Behavior
- **Missing/Invalid CSRF:** Returns `403 Forbidden` (`csrf_error`).
- **Valid CSRF + Missing Session:** Returns `401 Unauthorized`.
- **Valid CSRF + Valid Session + Permission:** Returns `501 Not Implemented`.
- **Public GET Routes:** Remain unaffected by CSRF requirements.

## What Remains Intentionally Disabled
- Public registration and production authentication.
- Real admin content writes and CRUD operations.
- Persistent sessions and user accounts.
- API mode as default (Static mode is primary).
- Connection to a production database.
