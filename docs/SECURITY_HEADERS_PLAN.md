# Security Headers Plan

Date: 2026-05-17

This is a planning document only. Do not apply a strict production CSP to Vite development until it has been tested, because it may break dev tooling, inline style behavior, or asset loading.

## Content-Security-Policy

Future goal:

- Restrict scripts to the application host and approved CDNs only.
- Restrict images to self and approved asset hosts.
- Restrict connections to the public API host.
- Avoid broad `unsafe-inline` allowances in production where possible.
- Test separately for static hosting and backend-hosted API mode.

## X-Content-Type-Options

Recommended:

```text
X-Content-Type-Options: nosniff
```

## Referrer-Policy

Recommended starting point:

```text
Referrer-Policy: strict-origin-when-cross-origin
```

## Permissions-Policy

Recommended starting point:

```text
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

Expand only if a future feature explicitly needs browser permissions.

## HSTS

Production HTTPS only:

```text
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

Only enable after HTTPS and domain routing are confirmed.

## Frame Ancestors / X-Frame-Options

Preferred CSP directive:

```text
frame-ancestors 'none'
```

Fallback header where needed:

```text
X-Frame-Options: DENY
```

## CORS Policy

Before public backend hosting:

- Allow only the selected frontend origin.
- Avoid wildcard origins with credentials.
- Keep read-only API methods scoped to the current contract.
- Revisit policy before any authenticated write path exists.

## Rate Limiting

Before public API launch:

- Add global read API rate limits.
- Add tighter limits for expensive endpoints.
- Log limited requests.
- Document proxy/IP trust settings for the hosting provider.
