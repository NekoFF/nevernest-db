# Phase 221-235 Robots And Sitemap Result

Date: 2026-05-18

## Local Verification

Command:

```sh
npm run sitemap:preview
```

Result: pass.

Output:

- Generated `.generated/sitemap-preview.xml`.
- Routes: 122.
- Preview origin: `http://localhost:5173`.
- Excluded local-only routes: `/dev/admin`, `/admin-dev`, admin/API write surfaces.

## Robots Policy

`public/robots.txt` remains permissive and does not advertise a fake production sitemap.

Current policy:

- Production domain is not configured.
- Production sitemap generation still requires approved HTTPS `SITE_URL`.
- Do not hard-code a final domain during preview rehearsal.

## Preview Host Verification

Not run because no preview URL is available.

Required after preview deploy:

- Open `<preview-url>/robots.txt`.
- Confirm no fake production sitemap directive.
- Check `<preview-url>/sitemap.xml` only if a production sitemap was intentionally generated with approved HTTPS `SITE_URL`.

## Decision

Local sitemap policy is acceptable. Host-level robots verification is incomplete until a preview URL exists.
