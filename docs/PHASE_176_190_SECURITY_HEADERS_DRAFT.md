# Phase 176-190 Security Headers Draft

Date: 2026-05-18

This is a host configuration draft for a read-only static beta. It is not applied in code because host/domain behavior must be verified after a platform is selected.

## Recommended Headers

```text
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
X-Frame-Options: DENY
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(), serial=(), bluetooth=(), accelerometer=(), gyroscope=(), magnetometer=()
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Resource-Policy: same-origin
Strict-Transport-Security: max-age=31536000; includeSubDomains
Content-Security-Policy: default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; img-src 'self' data: blob:; font-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self'; manifest-src 'self'; worker-src 'self' blob:; upgrade-insecure-requests
```

## CSP Notes

- Vite production builds load hashed JS/CSS from same-origin static assets, so `script-src 'self'` should be viable.
- `style-src 'unsafe-inline'` is included because the app uses inline style attributes and dynamic style values. Removing it may break UI styling.
- `img-src 'self' data: blob:` supports local assets, data URLs, and export/share-card flows.
- If API mode is included in a future public beta, add the approved API origin to `connect-src`.
- Do not add wildcard `connect-src` or third-party analytics until privacy/legal review is complete.

## Host Examples

Cloudflare Pages `_headers` draft:

```text
/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  X-Frame-Options: DENY
  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(), serial=(), bluetooth=(), accelerometer=(), gyroscope=(), magnetometer=()
  Cross-Origin-Opener-Policy: same-origin
  Cross-Origin-Resource-Policy: same-origin
  Strict-Transport-Security: max-age=31536000; includeSubDomains
  Content-Security-Policy: default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; img-src 'self' data: blob:; font-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self'; manifest-src 'self'; worker-src 'self' blob:; upgrade-insecure-requests
```

nginx draft:

```nginx
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header X-Frame-Options "DENY" always;
add_header Permissions-Policy "camera=(), microphone=(), geolocation=(), payment=(), usb=(), serial=(), bluetooth=(), accelerometer=(), gyroscope=(), magnetometer=()" always;
add_header Cross-Origin-Opener-Policy "same-origin" always;
add_header Cross-Origin-Resource-Policy "same-origin" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header Content-Security-Policy "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; img-src 'self' data: blob:; font-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self'; manifest-src 'self'; worker-src 'self' blob:; upgrade-insecure-requests" always;
```

## Verification

- Use browser devtools Network tab or `curl -I`.
- Confirm app still loads and route refreshes work.
- Confirm Build Planner export/import UI still works.
- Confirm no API mode request is blocked if API mode is explicitly included later.
