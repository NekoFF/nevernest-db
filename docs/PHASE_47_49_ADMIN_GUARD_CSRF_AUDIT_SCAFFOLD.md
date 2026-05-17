# Phase 47-49: Admin Guard, CSRF, and Audit Scaffold

This phase focuses on replacing the placeholder admin guard with real session, role, and permission checks for skeleton admin routes, and adding CSRF/audit scaffolding without enabling content writes.

## Admin Guard Behavior

The admin guard/middleware has been updated to:
- Read the current session from the `nte_session` cookie.
- Resolve the current user, their roles, and permissions server-side.
- Require specific permissions for admin skeleton routes.

**Expected Behavior:**
- **No session:** Returns `401 Unauthorized` for unauthenticated requests to protected routes.
- **Valid session but missing permission:** Returns `403 Forbidden` for authenticated users without the required permission.
- **Valid admin permission but endpoint not implemented:** Returns `501 Not Implemented` for skeleton admin write routes, as actual content writes are still disabled.
- **No DB writes:** No database write operations occur during this phase for admin routes.

## Permission Constants

The following stable permission constants are defined in `server/src/auth/permissions.ts` and used in guards and tests:
- `content/read`
- `content/write`
- `content/publish`
- `characters/write`
- `weapons/write`
- `modules/write`
- `vehicles/write`
- `codes/write`
- `news/write`
- `users/manage`
- `admin/audit/read`

The transitional `manage:content` permission has been removed from the guard logic.

## Admin Skeleton Route Behavior

The representative routes `POST /api/admin/characters` and `PATCH /api/admin/characters/:id` have been updated to:
- Require an authenticated admin session.
- Require the `characters/write` permission.
- Return `501 Not Implemented` after the guard passes, as actual DB writes are not yet enabled.
- Do not perform any database write operations.
- Do not import `localStorage` or change seed data.

## CSRF Scaffold

A safe CSRF scaffold has been added with an endpoint `GET /api/auth/csrf`.

**Behavior:**
- The endpoint is only available when `ENABLE_LOCAL_AUTH=1`.
- It issues/returns a dummy CSRF token (`csrf-scaffold-token-not-validated-yet`) for now, adhering to the "do not pretend full CSRF is complete" policy.
- It does not affect existing GET read endpoints.
- Full CSRF validation is documented as a next phase.

## Audit Helper Scaffold

A new service `server/src/services/AdminAuditService.ts` has been created.

**Behavior:**
- It prepares a function signature for future audit logging (`logAction`).
- It can write audit logs only if explicitly called later.
- It is not called from skeleton write routes in this phase, as no actual writes occur.
- Expected before/after payloads and metadata for audit logs are documented within the service.

## What Remains Intentionally Disabled

In line with the project's security policy, the following remain intentionally disabled:
- Public registration.
- Production authentication.
- Real admin content writes.
- Admin CRUD operations.
- API mode as default.
- Removal of static/localStorage runtime.
- Removal of browser-local AdminMode in static mode.
- Changes to Build Planner runtime.
- Connection to a production database.
- Deployment of any changes.
- Storing tokens in `localStorage`.
- Changes to visual identity.
- Breaking existing static mode or API mode pages.
- Full CSRF validation (only the scaffold is in place).
