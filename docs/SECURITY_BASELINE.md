# Security Baseline

Date: 2026-05-17

## Application Security Posture

- **Data Mode:** The frontend runs in static mode by default. API mode is experimental and local-only.
- **Admin Writes:** All backend admin content writes are strictly disabled. Skeleton routes return `501 Not Implemented`.
- **Authentication:** Local admin prototype is available strictly for local development behind `ENABLE_LOCAL_AUTH=1`. Production auth is disabled.
- **Authorization:** Server-side roles and permissions dictate access. Browser-local static AdminMode is not an authority for API-backed access.
- **Session Management:** Opaque session tokens in `HttpOnly` cookies. No JWTs in localStorage.
- **Admin Writes:** Disabled by default. Active endpoints use a unified `runAdminMutation` pipeline. Verified via `npm run smoke:admin-writes`.
- **Audit Logging:** Hardened `AdminAuditService` logs all administrative writes with recursive sensitive data redaction (including CSRF).
- **CSRF:** Real validation implemented for all state-mutating local auth routes via `nte_csrf` cookie and `X-CSRF-Token` header.
- **CORS:** Restricted to explicit origins; `Access-Control-Allow-Credentials` is enabled for local dev origins to support browser-based admin QA.
- **Rate Limiting:** In-memory rate limiting implemented for login and CSRF endpoints.

## Dev Admin Panel Security Notes

- `/dev/admin` is gated by `import.meta.env.DEV && VITE_ENABLE_DEV_ADMIN_PANEL === "1"`.
- The panel displays only safe auth state: authenticated yes/no, display name, roles, and permissions.
- Raw cookies, session tokens, CSRF tokens, and passwords are never displayed.
- CSRF is held only in React memory and is sent as `X-CSRF-Token` for local admin writes and logout.
- The password exists only in the login input state and is cleared after successful login.
- Code/news QA mutates one existing safe field, verifies through public reads, and restores the original value.
- No public auth, public registration, production admin, broad CRUD, or new backend write surfaces are enabled.
- Static browser-local AdminMode remains separate from backend authorization and remains available in static mode.
