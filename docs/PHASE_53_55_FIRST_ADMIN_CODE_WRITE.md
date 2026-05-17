# Phase 53-55: First Admin Code Write

Date: 2026-05-17

This phase implements the first real local-only admin write endpoint for Codes, proving the full safe mutation pipeline.

## First Admin Write Endpoint
- **Route:** `PATCH /api/admin/codes/:idOrSlug`
- **Purpose:** Update existing code details in the local database.
## Safety Gating
Only active when `ENABLE_LOCAL_ADMIN_WRITES=1` is set in the environment. Otherwise returns `501 Not Implemented`.

> **Note (Phase 56-58 update):** This route has been moved to `server/src/routes/admin.ts` to keep authentication routes clean.

## Security Pipeline
The endpoint enforces the following security checks in order:
1. **Local Writes Flag:** `ENABLE_LOCAL_ADMIN_WRITES=1` check.
2. **Local Auth Flag:** `ENABLE_LOCAL_AUTH=1` check.
3. **CSRF Validation:** Validates `nte_csrf` cookie against `X-CSRF-Token` header.
4. **Authentication:** Validates session cookie.
5. **Authorization:** Enforces `codes/write` permission.
6. **Input Validation:** Enforces `codeUpdateSchema` (Valibot).

## Implementation Details
- **Repository:** `DbContentRepository` now includes an `update` method for codes.
- **Service:** `ContentService` includes `updateCode` method.
- **Validation:** 
    - Allowed fields: `code`, `rewardSummary`, `status`, `sourceUrl`, `startDate`, `endDate`.
    - Disallowed fields: `id`, `externalId`, `slug`, `sourceStatus`.
    - Rejects empty bodies and unknown fields.
- **Audit Logging:** Every successful update is logged to the `AdminAuditService`.

## Verified Scenarios
- Missing `ENABLE_LOCAL_ADMIN_WRITES` -> `501 Not Implemented`.
- Missing CSRF -> `403 Forbidden` (`csrf_error`).
- No session -> `401 Unauthorized`.
- Missing `codes/write` permission -> `403 Forbidden`.
- Invalid body -> `400 Validation Error`.
- Valid admin + CSRF + permission -> `200 OK` (Successful update).

## What Remains Intentionally Disabled
- Broad Admin CRUD (Only Codes update is enabled).
- Characters, Weapons, Modules, Vehicles, News, and Guides writes.
- Public registration and production authentication.
- API mode as default.
- Production database connections.
