# Security Baseline

Date: 2026-05-17

## Application Security Posture

- **Data Mode:** The frontend runs in static mode by default. API mode is experimental and local-only.
- **Admin Writes:** All backend admin content writes are strictly disabled. Skeleton routes return `501 Not Implemented`.
- **Authentication:** Local admin prototype is available strictly for local development behind `ENABLE_LOCAL_AUTH=1`. Production auth is disabled.
- **Authorization:** Server-side roles and permissions dictate access. Browser-local static AdminMode is not an authority for API-backed access.
- **Session Management:** Opaque session tokens in `HttpOnly` cookies. No JWTs in localStorage.
- **Admin Writes:** Disabled by default. First endpoint (`PATCH /api/admin/codes/:idOrSlug`) enabled only via `ENABLE_LOCAL_ADMIN_WRITES=1`. Isolated in dedicated admin routes module.
- **Audit Logging:** Hardened `AdminAuditService` logs all administrative writes with recursive sensitive data redaction (including CSRF).
- **CSRF:** Real validation implemented for all state-mutating local auth routes via `nte_csrf` cookie and `X-CSRF-Token` header.
- **Rate Limiting:** In-memory rate limiting implemented for login and CSRF endpoints.