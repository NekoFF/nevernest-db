# Public Beta Release Runbook

Date: 2026-05-18

This runbook is for a future static read-only public beta. It does not authorize production auth, writes, or DB mutations.

## 1. Scope Check

- Confirm beta is static-first, read-only, unauthenticated, and unofficial.
- Confirm API mode is not default.
- Confirm production auth/admin writes/DB mutations are disabled.

## 2. Git Checkpoint

```sh
git status --short
git checkout -b release/public-beta-rc
```

After approval:

```sh
git tag public-beta-rc-YYYYMMDD
```

## 3. Clean Checks

```sh
npm run server:check
npm run server:build
npm run server:test
npm run build
npm run audit:data
npm run import:dry-run
npm run server:seed:preview
npm run smoke:static
npm run sitemap:preview
```

Optional only if DB/API beta is explicitly scoped:

```sh
npm run check:api-client
npm run smoke:api-mode
npm run server:test:db:seeded
```

## 4. Sitemap

Preview:

```sh
npm run sitemap:preview
```

Production after domain approval:

```sh
SITE_URL="https://approved.example" npm run sitemap:generate
```

Update `robots.txt` with `Sitemap:` only after the final domain is approved.

## 5. Host Config

- Build command: `npm run build`.
- Output directory: `dist`.
- Configure SPA fallback to `index.html`.
- Configure security headers.
- For Cloudflare Pages or Netlify static preview, confirm `public/_redirects` and `public/_headers` are copied to `dist/`.
- Keep environment static/default. Do not set API mode unless explicitly scoped.
- Use `docs/PHASE_206_220_CLOUDFLARE_PREVIEW_DEPLOYMENT_STEPS.md` for the preview deployment rehearsal.

## 6. Route Sweep

Direct-open and refresh:

- `/`
- `/characters`
- `/characters/nanally`
- `/weapons`
- three weapon detail routes
- `/modules`
- `/modules/devils-blood-curse`
- `/modules/lost-radiance`
- `/modules/pieces/type-ii-horizontal/s`
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

Confirm `/dev/admin` is not publicly linked and remains disabled/hidden without dev flags.

For final static beta candidate review, also complete `docs/PHASE_191_205_STATIC_PREVIEW_ROUTE_REFRESH_QA.md` and the manual screenshot checklist in `docs/PHASE_191_205_MOBILE_SCREENSHOT_QA.md`.

## 7. Security Header Check

Use:

```sh
curl -I https://approved.example
```

Confirm CSP, HSTS, referrer, frame, content-type, permissions, COOP, and CORP headers.

For a preview URL, the scripted check is:

```sh
PREVIEW_URL="https://preview.example.pages.dev" npm run check:preview-headers
```

## 8. Legal/Source Review

- Confirm unofficial fan-site copy.
- Confirm asset/source/takedown copy.
- Confirm code active/expired caveat.
- Confirm Build Planner prototype wording.
- Confirm tier-list reference wording.

## 9. Final Approval

- Host/domain/HTTPS approved.
- Route/mobile/browser sweep passed.
- Performance budget reviewed against `docs/PHASE_191_205_PERFORMANCE_BUDGET.md`.
- Security headers passed.
- Rollback path confirmed.
- Contact/takedown channel selected.
- No production writes/auth/DB enabled.

## 10. Post-Release Smoke

- Open home, core lists, detail routes, legal pages.
- Check `/robots.txt` and `/sitemap.xml`.
- Check browser console for obvious asset/CSP failures.
- Record deployed commit/tag and timestamp.

## Phase 206-220 Preview Rehearsal Note

Before launch approval, complete `docs/PHASE_206_220_PREVIEW_URL_VERIFICATION.md`, `docs/PHASE_206_220_MOBILE_SCREENSHOT_QA_RESULTS.md`, `docs/PHASE_206_220_CONTACT_TAKEDOWN_DECISION.md`, and `docs/PHASE_206_220_ACTIVE_CODES_VERIFICATION_PLAN.md`.
