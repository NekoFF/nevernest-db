# Rate Limiting Plan

Date: 2026-05-17

## Current State (Phase 50-52)

Lightweight in-memory rate limiting is implemented for local auth and CSRF:
- **Login attempts:** Limited by IP + normalized email (60s window, max 5 attempts).
- **CSRF endpoint:** Limited by IP (60s window, max 10 attempts).

This is acceptable only while production deployment and real admin writes remain disabled.

## Login Attempts
Implemented in `server/src/auth/loginRateLimit.ts`.
- Limit by IP address + normalized email.
- Returns generic `invalid_credentials` errors.
- Resets every 60 seconds.

## CSRF Endpoint
Implemented in `server/src/auth/loginRateLimit.ts`.
- Limit by IP address.
- Returns `429 Too Many Requests` on failure.
- Resets every 60 seconds.

## Logout And Session Refresh

Logout can use a moderate limit because it is low risk but still mutates session state.

Session refresh or rotation should be limited by:

- session id or token hash
- IP address
- user id

## Admin Writes

Admin writes should have stricter limits than public reads:

- per authenticated admin user
- per IP address
- per entity family if bulk edits are added later

Rate-limit failures should not write partial changes.

## Public Read API

Public reads should eventually use broad limits to protect availability:

- global IP-based limits
- tighter limits for expensive search or aggregation endpoints
- cache-friendly headers for stable read-only responses

## IP And Proxy Trust

Do not trust forwarded IP headers until hosting is selected. Future deployment must define:

- trusted proxy count or trusted proxy network
- which header provides the client IP
- behavior for missing or malformed forwarded headers

## Hosting Considerations

For single-instance local development, in-memory limits are enough for testing. For production, use a shared store such as Redis or provider-managed rate limiting so limits work across instances.

## Deferred

- Middleware implementation.
- Redis or hosted rate-limit store.
- Public API quota policy.
- Admin bulk-edit rate limits.

