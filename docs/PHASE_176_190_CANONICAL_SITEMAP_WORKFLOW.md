# Phase 176-190 Canonical Sitemap Workflow

Date: 2026-05-18

## Current Behavior

Preview sitemap:

```sh
npm run sitemap:preview
```

Writes `.generated/sitemap-preview.xml` using `http://localhost:5173` and includes current public read-only routes. It excludes `/dev/admin`, `/admin-dev`, admin/write surfaces, `/apartments`, and `/community`.

## Production Generation

After the canonical HTTPS host is approved:

```sh
SITE_URL="https://approved.example" npm run sitemap:generate
```

Rules:

- `SITE_URL` must be HTTPS.
- Do not hard-code the domain in source before approval.
- Do not include `/dev/admin`.
- Do not include placeholder/deferred routes unless explicitly approved.
- Commit or publish `public/sitemap.xml` only for an approved public host.

## Robots Update

After `public/sitemap.xml` is generated for the approved host, update `public/robots.txt` with:

```text
Sitemap: https://approved.example/sitemap.xml
```

Do not add a fake sitemap directive for preview/local domains.

## Verification After Deploy

1. Open `/sitemap.xml` on the deployed domain.
2. Confirm all `<loc>` entries use the approved HTTPS origin.
3. Confirm `/dev/admin`, `/admin-dev`, `/apartments`, and `/community` are absent unless policy changes.
4. Confirm detail routes load after direct navigation and refresh.
5. Open `/robots.txt` and confirm the `Sitemap:` directive points to the deployed sitemap.

## Canonical Links Later

The app currently uses route-level SEO with relative canonical paths. After the domain is chosen, consider adding a safe `SITE_URL`/build-time canonical strategy. Do not block static beta on this unless search indexing is a launch requirement.
