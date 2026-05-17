# Auth Security Checklist

Date: 2026-05-17

## Phase 56-58 Status

### Hardened Admin Writes
- [x] Admin routes isolated to `server/src/routes/admin.ts`.
- [x] Audit logging redacts CSRF tokens and cookies.
- [x] Manual local DB QA process documented.
- [x] Verified successful code updates trigger audit logs in tests.

## Phase 53-55 Status

### Implemented First Admin Write
- [x] `PATCH /api/admin/codes/:idOrSlug` implemented with full mutation pipeline.
- [x] Gated by `ENABLE_LOCAL_ADMIN_WRITES=1`.
- [x] Validates body using `codeUpdateSchema`.
- [x] Enforces `codes/write` permission.
- [x] Enforces CSRF validation.
- [x] Records audit log on success.

## Phase 50-52 Status

### Implemented Safety Infrastructure
- [x] Real CSRF validation for all unsafe routes (`nte_csrf` cookie + `X-CSRF-Token` header).
- [x] In-memory rate limiting for Login and CSRF endpoints.
- [x] Hardened `AdminAuditService` with sensitive data sanitization.
- [x] Skeleton write validation schemas (Valibot) and contracts.
- [x] Admin skeleton routes (`POST /api/admin/characters`, `PATCH /api/admin/characters/:id`) protected by both CSRF and Session checks.
- [x] Frontend `apiAuthClient` updated with `getCsrfToken()`.

### Implemented Scaffolding
- [x] Admin skeleton routes protected by server-side session checks.
- [x] Unauthenticated requests return `401 Unauthorized`.
- [x] Missing permissions return `403 Forbidden`.
- [x] Authorized but unimplemented write routes return `501 Not Implemented`.
- [x] Stable backend permission constants established (e.g., `characters/write`).

### Pending for Production Writes
- [ ] Real database mutations for admin CRUD.
- [ ] Full CSRF token validation on unsafe methods.
- [ ] Strict rate limiting on all auth/admin routes.
- [ ] Public registration/authentication (disabled for now).
- [ ] Full integration of `AdminAuditService` to write logs on every mutation.