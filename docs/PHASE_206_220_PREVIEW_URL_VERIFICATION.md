# Phase 206-220 Preview URL Verification

Date: 2026-05-18

Preview URL: `TBD`

Deployment commit: `TBD`

Host: `Cloudflare Pages preview` or `TBD`

## Checklist

- [ ] Open preview URL.
- [ ] Confirm static mode remains default.
- [ ] Direct refresh `/`.
- [ ] Direct refresh `/characters`.
- [ ] Direct refresh `/characters/nanally`.
- [ ] Direct refresh `/weapons`.
- [ ] Direct refresh `/weapons/good-boys-grand-adventure`.
- [ ] Direct refresh `/weapons/ready-ready`.
- [ ] Direct refresh `/weapons/oraora`.
- [ ] Direct refresh `/modules`.
- [ ] Direct refresh `/modules/devils-blood-curse`.
- [ ] Direct refresh `/modules/lost-radiance`.
- [ ] Direct refresh `/modules/pieces/type-ii-horizontal/s`.
- [ ] Direct refresh `/vehicles`.
- [ ] Direct refresh `/tier-list`.
- [ ] Direct refresh `/codes`.
- [ ] Direct refresh `/news`.
- [ ] Direct refresh `/guides`.
- [ ] Direct refresh `/build-planner`.
- [ ] Direct refresh `/about`.
- [ ] Direct refresh `/disclaimer`.
- [ ] Direct refresh `/privacy`.
- [ ] Direct refresh `/contact`.
- [ ] Open `/robots.txt`.
- [ ] Check `/sitemap.xml` only if a production sitemap was generated with an approved HTTPS `SITE_URL`.
- [ ] If no production sitemap exists, confirm robots does not advertise a fake sitemap.
- [ ] Check `_headers` effect with `curl -I PREVIEW_URL` or `PREVIEW_URL="..." npm run check:preview-headers`.
- [ ] Confirm `Content-Security-Policy`.
- [ ] Confirm `X-Content-Type-Options`.
- [ ] Confirm `Referrer-Policy`.
- [ ] Confirm `X-Frame-Options` or `frame-ancestors` in CSP.
- [ ] Confirm `Permissions-Policy`.
- [ ] Confirm `Strict-Transport-Security` on HTTPS preview/custom domain.
- [ ] Confirm `Cross-Origin-Opener-Policy`.
- [ ] Confirm `Cross-Origin-Resource-Policy`.
- [ ] Check browser console for CSP errors.
- [ ] Confirm `/dev/admin` is not linked.
- [ ] Open `/dev/admin` directly and confirm disabled state.
- [ ] Confirm source/legal/unofficial copy is visible.
- [ ] Complete mobile screenshots.
- [ ] Confirm Build Planner prototype label.
- [ ] Confirm codes caveat.
- [ ] Confirm tier-list reference wording.
- [ ] Confirm no API mode banner in static default.
- [ ] Confirm no admin controls visible in static default.

## Status

Not run. No preview URL has been provided or deployed in this phase.
