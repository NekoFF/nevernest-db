# Phase 191-205 Dev/Admin Exposure Audit

Date: 2026-05-18

## Result

No public beta admin exposure requiring a code change was found. `/dev/admin` is not in sitemap, not in public navigation unless development mode and `VITE_ENABLE_DEV_ADMIN_PANEL=1` are both true, and the production build keeps the panel disabled when opened directly.

## Checks

| Check | Result | Evidence |
| --- | --- | --- |
| `/dev/admin` not in sitemap | Pass | `scripts/generate-sitemap.mjs` does not include it; `npm run sitemap:preview` reports local-only routes excluded. |
| `/admin-dev` not in sitemap | Pass | Excluded by generator and docs. |
| `/dev/admin` not in public navigation | Pass | `Sidebar.jsx` only shows Dev Admin when `import.meta.env.DEV && VITE_ENABLE_DEV_ADMIN_PANEL === '1'`. |
| `/dev/admin` disabled without flag | Pass | `DevAdminPage.jsx` requires development mode and explicit flag. |
| Production build direct route | Pass/caveat | Vite preview returns HTTP 200 for SPA shell, but the page renders disabled state because `import.meta.env.DEV` is false. |
| AdminMode remains browser-local | Pass | Static AdminMode uses localStorage and is not backend authorization. |
| API mode suppresses AdminMode controls | Pass by existing pattern | Public pages use `effectiveAdminMode = isAdminMode && !apiMode`. |
| Production auth/admin env assumptions | Pass | No production auth/admin flags added. |
| Local admin credentials in docs | Pass with caveat | Docs contain explicit local-only examples only; no production secrets. |
| Browser token/password storage policy | Pass | Policy remains no token/password/CSRF/session persistence in browser storage. |

## Required Beta Handling

- Do not include `/dev/admin` in sitemap, robots, navigation, or launch docs as a public page.
- Do not set `VITE_ENABLE_DEV_ADMIN_PANEL` in static beta deployment.
- Do not set backend admin write flags in production.
- Treat browser-local AdminMode as local draft tooling only.

## Follow-Up

After preview deployment, manually open `/dev/admin` and confirm the disabled state is shown. The route should not be discoverable from navigation or sitemap.
