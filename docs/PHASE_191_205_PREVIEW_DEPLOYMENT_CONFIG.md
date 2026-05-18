# Phase 191-205 Preview Deployment Config

Date: 2026-05-18

## Policy

This phase keeps deployment configuration docs-first. No production host files were added because the host/domain are not selected and header behavior must be verified on the chosen platform.

Static beta rules:

- Build command: `npm run build`
- Output directory: `dist`
- API mode remains unset by default.
- No production secrets.
- No production database.
- No auth/admin write flags.
- Generate production sitemap only with approved HTTPS `SITE_URL`.

## A. Cloudflare Pages

Recommended first preview host for a static beta.

Build settings:

```text
Framework preset: Vite
Build command: npm run build
Build output directory: dist
Root directory: repository root
```

Environment policy:

```text
VITE_DATA_SOURCE: unset
VITE_API_BASE_URL: unset
VITE_ENABLE_DEV_ADMIN_PANEL: unset
SITE_URL: set only in a controlled sitemap-generation step, not required for normal build
```

`_redirects` draft:

```text
/* /index.html 200
```

`_headers` draft:

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

Preview deployment checks:

1. Confirm `/`, `/characters/nanally`, `/modules/pieces/type-ii-horizontal/s`, `/build-planner`, and `/contact` direct refresh.
2. Confirm `/dev/admin` is not in navigation or sitemap and shows disabled state if opened directly.
3. Confirm `/robots.txt` has no fake sitemap directive.
4. Confirm browser console has no CSP asset failures.
5. Confirm static mode is active and no backend API is required.

## B. Netlify

`netlify.toml` draft:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    X-Frame-Options = "DENY"
    Permissions-Policy = "camera=(), microphone=(), geolocation=(), payment=(), usb=(), serial=(), bluetooth=(), accelerometer=(), gyroscope=(), magnetometer=()"
    Cross-Origin-Opener-Policy = "same-origin"
    Cross-Origin-Resource-Policy = "same-origin"
    Strict-Transport-Security = "max-age=31536000; includeSubDomains"
    Content-Security-Policy = "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; img-src 'self' data: blob:; font-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self'; manifest-src 'self'; worker-src 'self' blob:; upgrade-insecure-requests"
```

Netlify caveat: verify that static metadata files such as `/robots.txt`, `/site.webmanifest`, and `/sitemap.xml` are served directly and not shadowed by the SPA fallback.

## C. Vercel

`vercel.json` draft:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    { "source": "/((?!assets/|robots.txt|site.webmanifest|sitemap.xml|vite.svg).*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=(), payment=(), usb=(), serial=(), bluetooth=(), accelerometer=(), gyroscope=(), magnetometer=()" },
        { "key": "Cross-Origin-Opener-Policy", "value": "same-origin" },
        { "key": "Cross-Origin-Resource-Policy", "value": "same-origin" },
        { "key": "Strict-Transport-Security", "value": "max-age=31536000; includeSubDomains" },
        { "key": "Content-Security-Policy", "value": "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; img-src 'self' data: blob:; font-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self'; manifest-src 'self'; worker-src 'self' blob:; upgrade-insecure-requests" }
      ]
    }
  ]
}
```

Vercel caveat: keep the project static-only for beta. Do not add serverless API/auth functions as part of this launch.
