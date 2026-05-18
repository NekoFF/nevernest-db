# Phase 206-220 Host Config Applied

Date: 2026-05-18

## Files Added

- `public/_redirects`
- `public/_headers`

## Why This Is Safe

The files are static host configuration only. They do not enable API mode, auth, public registration, admin writes, backend mutations, production database access, or secrets.

`public/_redirects` contains the SPA fallback required for client-side routes:

```text
/* /index.html 200
```

`public/_headers` applies the read-only static beta security headers from `docs/PHASE_176_190_SECURITY_HEADERS_DRAFT.md`. The CSP uses `connect-src 'self'`, includes no production domain, includes no API origin, and keeps API mode opt-in.

## Vite Copy Behavior

Vite copies files in `public/` to the build output root. After `npm run build`, these files should exist:

- `dist/_redirects`
- `dist/_headers`

## How To Verify In Dist

```sh
npm run build
ls -la dist/_redirects dist/_headers dist/robots.txt dist/site.webmanifest
```

Also verify that assets are still emitted under `dist/assets/`.

## Cloudflare Pages Behavior

Cloudflare Pages reads `_redirects` and `_headers` from the published output root. With build command `npm run build` and output directory `dist`, these files are available at the correct location for Pages preview deployments.

Expected behavior:

- Direct refreshes such as `/characters/nanally` serve `index.html`.
- Static files such as `/robots.txt` and `/site.webmanifest` remain static file responses.
- Headers apply to all routes matched by `/*`.

## Netlify Behavior

Netlify also supports `_redirects` and `_headers` in the publish directory. These files are compatible with a Netlify static preview as a close second host option.

## Limitations

- This does not deploy anything.
- Host-level behavior still must be verified on an actual preview URL.
- `Strict-Transport-Security` only has meaningful effect over HTTPS.
- `/dev/admin` is intentionally covered by the SPA fallback but remains excluded from sitemap/navigation and disabled unless local development flags are set.
- A production sitemap still requires an approved HTTPS `SITE_URL`.
