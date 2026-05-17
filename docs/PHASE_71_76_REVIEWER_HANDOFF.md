# PHASE 71–76 Reviewer Handoff

## Copy for Reviewer
> [!IMPORTANT]
> This phase adds a **Dev-only Admin QA Panel** at `/dev/admin`.
> - **Strict Gating**: Only visible/active when `VITE_ENABLE_DEV_ADMIN_PANEL=1` and in `DEV` mode.
> - **Security**: No tokens or passwords stored in `localStorage`. CSRF held only in React memory.
- **CORS**: Enabled `Access-Control-Allow-Credentials: true` and local dev origins to fix Firefox blocking.
- **Verification**: Allows manual "Login -> Fetch CSRF -> Update -> Verify -> Restore" flow in-browser.
> - **No Backend Changes**: Reuses existing stable `PATCH` endpoints for Codes and News.
> - **Status**: All smoke tests and project checks passing.

## Changed Files
- `src/App.jsx`: Added `/dev/admin` route and gating logic.
- `src/components/Sidebar.jsx`: Added conditional "Dev Admin" link.
- `src/pages/DevAdminPage.jsx`: (New) Main QA panel implementation.
- `docs/PHASE_71_76_DEV_ADMIN_PANEL.md`: (New) Phase documentation.
- `docs/DEV_ADMIN_PANEL_LOCAL_QA.md`: (New) Local QA instructions.
- `docs/PHASE_71_76_REVIEWER_HANDOFF.md`: (New) This handoff file.
- `server/src/config/env.ts`: Updated `corsOrigin` to support multiple local dev origins.
- `server/src/plugins/cors.ts`: Enabled `credentials: true` and allowed headers for dev admin panel.
- `server/tests/routes/cors.test.ts`: (New) Verification tests for CORS headers.

## Commands Run & Results
- `npm run server:check`: PASS
- `npm run server:build`: PASS
- `npm.cmd run build`: PASS
- `npm.cmd run smoke:static`: PASS
- `npm.cmd run server:test`: PASS (Includes new CORS verification)
- `npm.cmd run smoke:admin-writes`: PASS (Requires local DB mode)

## Route & Gating
- **Route**: `/dev/admin`
- **Logic**: `import.meta.env.DEV && VITE_ENABLE_DEV_ADMIN_PANEL === '1'`
- **Sidebar**: Link appears at bottom of nav only when enabled.

## Admin Operations
- Manual Login/Logout.
- Manual CSRF fetch.
- Automated QA cycle for `PATCH /api/admin/codes/:idOrSlug`.
- Automated QA cycle for `PATCH /api/admin/news/:slug`.

## Restore Behavior
Both QA tests capture the original value before mutation and automatically restore it after verifying the update was successful.

## Remaining Risks / TODOs
- Ensure production build process strips dev-only routes (standard Vite behavior).
- Public registration remains disabled.
- No characters/weapons/modules write endpoints added yet.
