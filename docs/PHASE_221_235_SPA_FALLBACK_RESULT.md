# Phase 221-235 SPA Fallback Result

Date: 2026-05-18

Preview URL: `TBD`

## Result

Not verified on a real preview host because no preview URL is available.

Local build status:

- `public/_redirects`: present.
- `dist/_redirects`: verified by `npm run build`.
- Fallback rule: `/* /index.html 200`.

## Required Host Refresh Checks

| Route | Host refresh result | Issue/fix/defer |
| --- | --- | --- |
| `/characters/nanally` | Not run | Requires preview URL. |
| `/weapons/good-boys-grand-adventure` | Not run | Requires preview URL. |
| `/modules/devils-blood-curse` | Not run | Requires preview URL. |
| `/modules/pieces/type-ii-horizontal/s` | Not run | Requires preview URL. |
| `/build-planner` | Not run | Requires preview URL. |

## If Refresh 404s

1. Confirm `_redirects` exists at deployment root.
2. Confirm Cloudflare/Netlify output directory is `dist`.
3. Confirm static files are not being deployed from the repo root.
4. Rebuild and redeploy preview.
5. Re-run route verification before beta decision.

## Decision

Host-level SPA fallback verification is incomplete. Public beta remains NO-GO.
