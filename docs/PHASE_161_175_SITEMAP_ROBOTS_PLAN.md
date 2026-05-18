# Phase 161-175 Sitemap/Robots Plan

Date: 2026-05-18

## Result

`robots.txt` remains public-read friendly and avoids a fake production sitemap URL. Sitemap generation now supports both preview and production modes.

## Commands

Preview:

```sh
npm run sitemap:preview
```

Writes:

```text
.generated/sitemap-preview.xml
```

Production after canonical HTTPS host is selected:

```sh
SITE_URL="https://example.com" npm run sitemap:generate
```

Writes:

```text
public/sitemap.xml
```

## Included Routes

- `/`
- `/characters`
- `/characters/:slug`
- `/weapons`
- `/weapons/:slug`
- `/modules`
- `/modules/:slug`
- `/modules/pieces/:shapeId/:rarity`
- `/vehicles`
- `/tier-list`
- `/codes`
- `/news`
- `/guides`
- `/build-planner`
- `/about`
- `/disclaimer`
- `/privacy`
- `/contact`

## Excluded Routes

- `/dev/admin`
- `/admin-dev`
- API endpoints
- Admin/write/local-only surfaces
- Future private/account routes
- `/apartments` and `/community` for now, because they are placeholder sections.

## Current Preview Count

`npm run sitemap:preview` generated 122 routes using `http://localhost:5173`.

## Robots Policy

`public/robots.txt` currently allows crawling and documents that a production sitemap should be added only after the canonical public host is selected. Do not add a fake `Sitemap:` directive.
