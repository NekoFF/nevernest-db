# Phase 206-220 Security Headers Verification

Date: 2026-05-18

## Config Source

Static preview headers are applied in `public/_headers` and copied to `dist/_headers` by Vite.

## Script

Added:

```sh
PREVIEW_URL="https://preview.example.pages.dev" npm run check:preview-headers
```

Script path:

```text
scripts/check-preview-headers.mjs
```

The script requires `PREVIEW_URL` only when explicitly run. It does not require secrets and is not part of local builds.

## Expected Headers

- `Content-Security-Policy`
- `X-Content-Type-Options`
- `Referrer-Policy`
- `X-Frame-Options` or `frame-ancestors` in CSP
- `Permissions-Policy`
- `Strict-Transport-Security` on HTTPS preview/custom domain
- `Cross-Origin-Opener-Policy`
- `Cross-Origin-Resource-Policy`

## Local Status

- `public/_headers`: added.
- `dist/_headers`: verified after `npm run build`.
- Preview URL verification: not run because no preview URL exists.
- `npm run check:preview-headers`: not run because `PREVIEW_URL` is unset.

## Manual Fallback

```sh
curl -I https://preview.example.pages.dev
```

Then compare response headers against the expected list above and open the browser console to check for CSP asset failures.
