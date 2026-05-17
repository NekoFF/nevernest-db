# Sitemap Plan

Date: 2026-05-17

## Current Decision

Do not publish a production sitemap yet. The app does not have a selected public production domain, and API mode remains experimental/local-only.

`scripts/generate-sitemap.mjs` exists as a guarded placeholder. It refuses to run unless `SITE_URL` is provided and must not be run with a fake production domain.

## Stable Static Routes

These routes are stable enough to include once a public domain is chosen:

- `/`
- `/characters`
- `/weapons`
- `/modules`
- `/vehicles`
- `/tier-list`
- `/codes`
- `/news`
- `/about`
- `/disclaimer`
- `/privacy`
- `/contact`

## Dynamic Routes

Dynamic detail routes should be generated from verified static/build artifacts or a production-read DB only after launch policy is approved:

- `/characters/:slug`
- `/weapons/:slug`
- `/modules/:slug`

## Before Publishing

- Choose the canonical production host.
- Confirm route slugs are stable.
- Decide whether detail routes should include all entries or only published/verified entries.
- Add `Sitemap: https://<public-host>/sitemap.xml` to `public/robots.txt`.
- Generate `public/sitemap.xml` with:

```sh
$env:SITE_URL="https://<public-host>"
npm.cmd run sitemap:generate
```

- Review the generated file before publishing.
