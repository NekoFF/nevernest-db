# Phase 59-61: Second Admin News Write

Date: 2026-05-17

This phase implements the second real local-only admin write endpoint for News, following the proven pipeline established for Codes.

## Second Admin Write Endpoint
- **Route:** `PATCH /api/admin/news/:slug`
- **Purpose:** Update existing news post details in the local database.
- **Safety Gating:** Only active when `ENABLE_LOCAL_ADMIN_WRITES=1` is set in the environment.

## Security Pipeline
The endpoint enforces the same security checks as the Codes endpoint:
1. **Safety Flag:** `ENABLE_LOCAL_ADMIN_WRITES=1` check.
2. **Local Auth Flag:** `ENABLE_LOCAL_AUTH=1` check.
3. **CSRF Validation:** Validates `nte_csrf` cookie against `X-CSRF-Token` header.
4. **Authentication:** Validates session cookie.
5. **Authorization:** Enforces `news/write` permission.
6. **Input Validation:** Enforces `newsUpdateSchema` (Valibot).

## Implementation Details
- **Repository:** `DbContentRepository` now includes an `update` method for news posts.
- **Service:** `ContentService` includes `updateNews` method.
- **Validation:** 
    - Allowed fields: `title`, `description`, `body`, `category`, `featured`, `pinned`, `postedAt`, `sourceUrl`.
    - Disallowed fields: `id`, `externalId`, `slug`, `sourceStatus`.
    - Rejects empty update bodies.
- **Audit Logging:** Every successful update is logged to the `AdminAuditService`.

## Verified Scenarios
- Missing `ENABLE_LOCAL_ADMIN_WRITES` -> `501 Not Implemented`.
- Missing CSRF -> `403 Forbidden` (`csrf_error`).
- No session -> `401 Unauthorized`.
- Missing `news/write` permission -> `403 Forbidden`.
- Invalid body -> `400 Validation Error`.
- Valid admin + CSRF + permission -> `200 OK` (Successful update).

## What Remains Intentionally Disabled
- Broad Admin CRUD (Only Codes and News update enabled).
- Characters, Weapons, Modules, Vehicles, and Guides writes.
- Public registration and production authentication.
- API mode as default.
