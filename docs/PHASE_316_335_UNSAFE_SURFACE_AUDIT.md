# Phase 316-335 Unsafe Surface Audit

Date: 2026-05-19

## Reviewed

- `src/App.jsx`
- `src/components/Sidebar.jsx`
- `src/repositories/dataSource.js`
- `src/api/apiConfig.js`
- `server/src/app.ts`
- `server/src/auth/localAuthConfig.ts`
- `server/src/plugins/adminGuard.ts`
- sitemap generator and static smoke checks

## Result

No new unsafe surface was introduced in this phase.

## Confirmed

- `/dev/admin` is routeable but not shown in public nav unless `import.meta.env.DEV` and `VITE_ENABLE_DEV_ADMIN_PANEL === '1'`.
- Sitemap preview generator excludes `/dev/admin` and admin/write surfaces.
- Static mode remains default; API mode requires `VITE_DATA_SOURCE=api`.
- Production auth and public registration remain disabled.
- Local auth requires explicit `ENABLE_LOCAL_AUTH=1`.
- Browser-local AdminMode remains local draft tooling only.
- Public write controls are hidden in default static mode unless local AdminMode is enabled.
- No token/password storage was introduced.

## Residual Risk

The DevAdmin route still exists for local development. Keep it hidden from public navigation and excluded from sitemap/production launch checks.

