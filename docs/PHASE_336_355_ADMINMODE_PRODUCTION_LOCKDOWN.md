# Phase 336-355 AdminMode Production Lockdown

Date: 2026-05-19

## Preview Blocker

The Cloudflare Pages preview exposed browser-local static AdminMode from the top-right account menu. Users could toggle AdminMode, see edit controls, and change visible data locally through localStorage. This did not mutate server data, but it was not acceptable for public preview or beta.

## Root Cause

- `Topbar` always rendered `Admin Mode` / `Exit Admin Mode`.
- `AdminModeContext` always read `nte.admin.mode` from localStorage.
- `AdminModeContext` always loaded browser-local override collections and merged them into public data.
- A production build could therefore honor stale localStorage admin state and local override data.

## Fix

Added `src/admin/adminModeGate.js` with a single rule:

```js
import.meta.env.DEV && import.meta.env.VITE_ENABLE_BROWSER_ADMIN_MODE === '1'
```

When unavailable:

- AdminMode starts inactive.
- Enable/toggle actions are no-ops.
- Existing localStorage AdminMode state is ignored.
- Existing localStorage override collections are ignored for public merged data.
- Topbar hides `Admin Mode`, `Exit Admin Mode`, and `Admin Overview`.
- Edit controls that depend on `isAdminMode` remain hidden.

## Local Development

Browser-local AdminMode remains available only in local Vite dev with:

```sh
$env:VITE_ENABLE_BROWSER_ADMIN_MODE="1"
npm.cmd run dev
```

This flag is separate from `VITE_ENABLE_DEV_ADMIN_PANEL`, which gates `/dev/admin`.

## /dev/admin

No change to `/dev/admin`. It remains disabled in production preview without `import.meta.env.DEV && VITE_ENABLE_DEV_ADMIN_PANEL === '1'`.

## Production Admin

Real production admin still requires future auth/session/CSRF/audit/backups. This phase does not enable auth, backend writes, registration, DB mutations, or schema changes.

