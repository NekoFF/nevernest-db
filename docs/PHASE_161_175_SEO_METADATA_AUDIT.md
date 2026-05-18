# Phase 161-175 SEO/Metadata Audit

Date: 2026-05-18

## Result

The app has route-level SEO through `Seo`/`setSeo`, and `index.html` now has stronger default description plus Open Graph/Twitter summary tags. Final production canonical domain remains unset by design.

## Audit

| Area | Status | Notes |
| --- | --- | --- |
| `index.html` title | Present | `NTE Community Database`. |
| Default description | Improved | Now states unofficial fan DB and verification caveat. |
| Route titles/descriptions | Present | Core pages use `<Seo>`. Some descriptions were improved this phase. |
| Open Graph | Added defaults | `og:title`, `og:description`, `og:type`, `og:site_name`. |
| Twitter metadata | Added defaults | Summary card tags added. |
| Canonical domain | Not selected | Runtime canonical links use relative paths until a site URL strategy is chosen. |
| `robots.txt` | Present | Allows crawling but notes production sitemap needs canonical host. |
| Sitemap | Preview script added | `npm run sitemap:preview` writes `.generated/sitemap-preview.xml`; production generation requires HTTPS `SITE_URL`. |
| Structured data | Deferred | Feasible later for WebSite/Breadcrumb/ItemList, but needs canonical domain and source posture first. |
| Route slug stability | Good for current static data | Character, weapon, cartridge, and module-piece routes derive from stable ids/slugs. |
| SPA fallback | Needs host config | Must be configured on chosen host. |
| Image alt text basics | Generally present in components, but not exhaustively audited | Needs visual route sweep before beta. |

## Fixes Applied

- Improved `index.html` default meta description and social metadata.
- Added sitemap preview/generation route expansion.
- Kept final production domain out of code.

## Deferred

- Absolute canonical URLs.
- Final `Sitemap:` directive in `robots.txt`.
- Structured data.
- Social preview image.
- Host-specific SPA fallback docs.
