# Phase 176-190 SPA Fallback Plan

Date: 2026-05-18

## Why Fallback Is Required

The app is a Vite React SPA with client-side routing in `src/App.jsx`. Static hosts must serve `index.html` for direct links and refreshes, otherwise routes such as `/characters/nanally` or `/modules/pieces/type-ii-horizontal/s` will 404 at the host layer.

## Public Routes That Need Fallback

| Route | Expected behavior |
| --- | --- |
| `/` | Serve app shell. |
| `/characters` | Serve app shell, render Characters. |
| `/characters/:slug` | Serve app shell, render character detail or not-found state. |
| `/weapons` | Serve app shell, render Weapons. |
| `/weapons/:slug` | Serve app shell, render weapon detail or not-found state. |
| `/modules` | Serve app shell, render Modules. |
| `/modules/:slug` | Serve app shell, render cartridge detail or not-found state. |
| `/modules/pieces/:shapeId/:rarity` | Serve app shell, render module piece detail or not-found state. |
| `/vehicles` | Serve app shell, render Vehicles. |
| `/tier-list` | Serve app shell, render Tier List. |
| `/codes` | Serve app shell, render Codes. |
| `/news` | Serve app shell, render News. |
| `/guides` | Serve app shell, render Guides. |
| `/build-planner` | Serve app shell, render prototype-labelled Build Planner. |
| `/about` | Serve app shell, render About. |
| `/disclaimer` | Serve app shell, render Disclaimer. |
| `/privacy` | Serve app shell, render Privacy. |
| `/contact` | Serve app shell, render Contact. |

## Recommended Host Config

Cloudflare Pages `_redirects` draft:

```text
/* /index.html 200
```

Netlify `_redirects` draft:

```text
/* /index.html 200
```

nginx draft:

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

## Test Plan

1. Build the app: `npm run build`.
2. Deploy preview or run equivalent static host.
3. Open each public route directly in a fresh tab.
4. Refresh each detail route.
5. Confirm static assets under `/assets/`, `/robots.txt`, `/site.webmanifest`, and `/sitemap.xml` are served as files, not rewritten to the app shell.
6. Confirm `/dev/admin` is not linked publicly and remains local/dev-disabled unless explicit dev flag is set.

## Must Not Be Exposed

- `/dev/admin` as a public feature.
- Admin/write endpoints.
- Production auth routes.
- Production DB credentials.
- `.env` files or generated local artifacts.
