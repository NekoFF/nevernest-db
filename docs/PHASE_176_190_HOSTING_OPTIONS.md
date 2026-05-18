# Phase 176-190 Hosting Options

Date: 2026-05-18

## Recommendation

Recommended static beta host: **Cloudflare Pages** for the first read-only beta, with Netlify as the closest alternative. Cloudflare Pages fits a static-first SPA well, gives automatic HTTPS/custom domains, preview deployments, edge caching, and straightforward header/redirect files. Keep the API/backend separate and out of scope for the first public beta unless explicitly approved later.

No host config file was added in this phase. Use the examples below only after a host is selected.

## Comparison

| Host | SPA fallback | Custom domain/HTTPS | Security headers | Env vars | Preview deploys | Sitemap/robots | Pros | Cons |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Vercel | `rewrites` in `vercel.json` | Strong | `headers` in `vercel.json` | Good | Good | Static files in `public/` | Excellent DX, easy Vite deploy | Serverless defaults can blur static/API scope if not disciplined |
| Netlify | `_redirects` or `netlify.toml` | Strong | `_headers` or `netlify.toml` | Good | Good | Static files in `public/` | Simple SPA fallback/headers, good static hosting | Header syntax must be tested carefully |
| Cloudflare Pages | `_redirects` and `_headers` | Strong | `_headers` | Good | Good | Static files in `public/` | Fast edge, good static security, clear separation from backend | Some header/CSP behavior should be verified after deploy |
| GitHub Pages | Needs 404 fallback workaround | HTTPS for supported domains | Limited | Poor | Limited | Static files | Simple/free for static pages | SPA fallback and headers are weak |
| nginx static host | Configurable | Depends on ops | Full control | Depends on ops | Depends on ops | Full control | Maximum control | More ops burden, easy to misconfigure |

## Cloudflare Pages Draft

Build command:

```sh
npm run build
```

Output directory:

```text
dist
```

SPA fallback example:

```text
/* /index.html 200
```

Headers should follow `docs/PHASE_176_190_SECURITY_HEADERS_DRAFT.md`.

## Netlify Draft

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## Vercel Draft

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    { "source": "/((?!assets|robots.txt|site.webmanifest|sitemap.xml).*)", "destination": "/index.html" }
  ]
}
```

## Decision Rules

- Choose Cloudflare Pages if static-only beta and strong edge/header control are the priority.
- Choose Netlify if the team prefers simplest redirects/headers workflow.
- Choose Vercel if the future roadmap expects frontend/backend integration on the same platform, but keep API/auth/write features disabled for beta.
- Avoid GitHub Pages unless header requirements are relaxed or handled elsewhere.
