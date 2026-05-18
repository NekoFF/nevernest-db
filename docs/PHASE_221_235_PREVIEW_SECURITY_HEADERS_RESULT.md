# Phase 221-235 Preview Security Headers Result

Date: 2026-05-18

Preview URL: `TBD`

## Result

Not run because no preview URL is available.

Command not run:

```sh
PREVIEW_URL="<preview-url>" npm run check:preview-headers
```

Manual command not run:

```sh
curl -I <preview-url>
```

## Expected Headers

- `Content-Security-Policy`
- `X-Content-Type-Options`
- `Referrer-Policy`
- `X-Frame-Options` or `frame-ancestors` in CSP
- `Permissions-Policy`
- `Cross-Origin-Opener-Policy`
- `Cross-Origin-Resource-Policy`
- `Strict-Transport-Security` if HTTPS host supports it

## Local Config Status

- `public/_headers`: present.
- `dist/_headers`: verified by `npm run build`.
- CSP remains same-origin for static beta: `connect-src 'self'`.
- No API origin was added.

## If Headers Are Missing On Preview

1. Confirm Cloudflare Pages publish output is `dist`.
2. Confirm `dist/_headers` exists in the deployment artifact.
3. Confirm header syntax is accepted by the host.
4. Fix only `public/_headers` or deployment docs.
5. Do not weaken CSP or add API origins unless API beta is explicitly scoped.

## Decision

Host-level security header verification is incomplete. Public beta remains NO-GO.
