# Phase 206-220 Build Output Verification

Date: 2026-05-18

Command:

```sh
npm run build
```

Result: pass.

## Dist Checks

| Item | Result | Notes |
| --- | --- | --- |
| `dist/_redirects` | Pass | Copied from `public/_redirects`; contains SPA fallback. |
| `dist/_headers` | Pass | Copied from `public/_headers`; contains static beta headers. |
| `dist/robots.txt` | Pass | Copied from `public/robots.txt`. |
| `dist/site.webmanifest` | Pass | Copied from `public/site.webmanifest`. |
| `dist/assets/` | Pass | 59 asset files emitted. |
| `/dev/admin` in sitemap preview | Pass | Not present in `.generated/sitemap-preview.xml`. |

## Build Output Notes

- `dist/index.html`: 1.47 kB raw, 0.57 kB gzip.
- Main CSS: 164.38 kB raw, 21.84 kB gzip.
- Main JS: 486.15 kB raw, 123.38 kB gzip.
- Largest route chunk remains `CharacterDetailPage`: 209.40 kB raw, 37.62 kB gzip.

## Sitemap Preview Check

Command:

```sh
npm run sitemap:preview
```

Result: pass. Generated 122 routes using `http://localhost:5173` and reported excluded local-only routes: `/dev/admin`, `/admin-dev`, admin/API write surfaces.

## Decision

Build output is host-ready for a static preview deployment. Public beta still requires host-level preview verification before launch.
