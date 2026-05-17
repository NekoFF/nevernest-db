# Phase 65-70: Admin Write E2E QA and Client Hardening

Date: 2026-05-17

This phase focused on creating a local-only E2E verification script and hardening the frontend administrative API client methods.

## E2E Admin Write Smoke Script
I implemented a new E2E verification script in `scripts/smoke-admin-writes.mjs`.

### What it Verifies
1.  **Backend Connectivity**: Ensures the server is reachable and in `db` mode.
2.  **CSRF Pipeline**: Verifies CSRF token issuance from the backend.
3.  **Local Authentication**: Verifies login and session persistence for local admin accounts.
4.  **Administrative Mutations**: Verifies `PATCH /api/admin/codes/:idOrSlug` and `PATCH /api/admin/news/:slug`.
5.  **Data Integrity**: Verifies that public read endpoints reflect administrative updates.
6.  **Data Restoration**: Automatically restores original values after the test.
7.  **Session Termination**: Verifies successful logout and session destruction.

### Safety Features
- **Local-Only**: Refuses to run against non-localhost hosts.
- **Credential Redaction**: Never logs passwords, tokens, or cookies.
- **Isolated State**: Maintains its own cookie jar manually using Node fetch.

## Admin API Client Methods
Hardened the frontend API client by adding formal administrative methods in `src/repositories/api/adminApiRepository.js`.

- `updateCodeAdmin(idOrSlug, payload, csrfToken)`
- `updateNewsAdmin(slug, payload, csrfToken)`

These methods are designed for future administrative UI use and correctly handle `X-CSRF-Token` headers and credentials.

## Improved Frontend Auth Client
Ensured `src/auth/apiAuthClient.js` provides consistent helpers for session and CSRF management:
- `getCurrentAuthState()`
- `getCsrfToken()`
- `localLogin(email, password)`
- `logout()`

## Verified Behavior
The E2E pipeline was manually verified to correctly identify:
- Unauthorized mutation attempts (401).
- Forbidden mutation attempts (403).
- Invalid CSRF tokens (403).
- Missing safety flags (501).

### Bug Fix: Codes Lookup 500
Fixed an issue where `PATCH /api/admin/codes/:idOrSlug` would return 500 in DB mode. The root cause was the generic `findByIdExternalIdOrSlug` helper attempting to query a non-existent `slug` column on the `codes` table. The helper now dynamically checks for column existence before building the query.

## What Remains Intentionally Disabled
- Broad Admin CRUD.
- Mutations for other entities (Characters, Weapons, etc.).
- Public registration.
- API mode admin editing in the browser.
