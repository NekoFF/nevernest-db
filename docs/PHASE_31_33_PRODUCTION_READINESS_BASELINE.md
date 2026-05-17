# Phase 31-33 Production Readiness Baseline

Date: 2026-05-17

## Summary

Phase 31-33 adds low-risk production-readiness scaffolding without enabling production deployment. Static/localStorage remains the default runtime, API mode remains opt-in, AdminMode remains browser-local, Build Planner runtime is unchanged, and no auth/admin writes/user accounts were added.

## SEO Changes

- Reusable SEO support exists in `src/components/Seo.jsx` and `src/utils/seo.js`.
- Pages can set title, description, canonical path, Open Graph title/description/url, and Twitter card metadata.
- Core static/API-mode pages already define page-level titles and descriptions:
  - Home
  - Characters
  - Character detail
  - Weapons
  - Weapon detail
  - Modules / Cartridges
  - Cartridge detail
  - Vehicles
  - Tier List
  - Codes
  - News
  - About
  - Disclaimer
  - Privacy
  - Contact

## Legal Pages

Added lightweight info pages for:

- `/about`
- `/disclaimer`
- `/privacy`
- `/contact`

The pages state that Nevernest DB is an unofficial fan/community database and do not imply partnership, endorsement, official ownership, analytics, ads, or tracking that do not exist.

## Public Files And Sitemap

- `public/robots.txt` allows crawling but does not include a production sitemap URL.
- `public/site.webmanifest` provides a basic app manifest.
- `docs/SITEMAP_PLAN.md` documents when to add a real sitemap after a public canonical host is selected.

## Environment Docs

- `docs/ENVIRONMENT_CONFIGURATION.md` documents frontend and backend env vars.
- `docs/ENVIRONMENT.md` remains as the prior environment reference.
- Static mode is documented as default.
- API mode and DB mode are documented as experimental/local-only.
- Production DB remains disabled.

## Deployment Checklist

`docs/DEPLOYMENT_READINESS_CHECKLIST.md` covers frontend hosting, backend hosting, PostgreSQL hosting, backups, HTTPS/domain, environment variables, logging, monitoring, error tracking, legal/privacy, performance, QA, security headers, rate limiting, and disabled auth/admin status.

## Security Baseline

`docs/SECURITY_BASELINE.md` documents:

- local DB safety guard
- production DB disabled status
- auth/admin writes disabled status
- no passwords or tokens in localStorage
- future session/CSRF/rate-limit/upload-validation plans
- launch blockers before public release

## Performance Baseline

`docs/PERFORMANCE_BASELINE.md` documents:

- current Vite large chunk warning
- image optimization plan
- lazy-loading and bundle splitting opportunities
- API pagination considerations
- mobile/tablet QA
- CDN/cache plan

## Error Boundary

`src/components/ErrorBoundary.jsx` wraps the app through `src/main.jsx`. Unexpected frontend errors render a polished fallback without raw stack traces in production UI, while development still logs useful console details.

## Still Disabled

- API mode default: disabled
- Production deployment: disabled
- Production DB connection: disabled
- Real auth: disabled
- User accounts: disabled
- Admin write endpoints: disabled
- Build Planner API runtime: disabled

## Recommended Next Phase

Phase 34-36 should focus on low-risk runtime hardening: route-level lazy loading, static/API smoke automation, security header planning, sitemap generation after a public domain is chosen, and mobile QA screenshots.
