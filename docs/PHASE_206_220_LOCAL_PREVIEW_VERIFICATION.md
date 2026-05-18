# Phase 206-220 Local Preview Verification

Date: 2026-05-18

Commands:

```sh
npm run build
npm run preview -- --host 127.0.0.1 --port 4173
```

Probe method: Node `fetch` against `http://127.0.0.1:4173`.

## Results

| Route | HTTP status | Expected route behavior | In sitemap? | Beta appropriate | Fix/defer |
| --- | ---: | --- | --- | --- | --- |
| `/` | 200 | Home route | yes | yes | No fix. |
| `/characters` | 200 | Characters index | yes | yes | No fix. |
| `/characters/nanally` | 200 | Character detail | yes | yes with caveats | Keep source labels. |
| `/weapons` | 200 | Weapons index | yes | yes | No fix. |
| `/weapons/good-boys-grand-adventure` | 200 | Weapon detail | yes | yes | No fix. |
| `/weapons/ready-ready` | 200 | Weapon detail | yes | yes | No fix. |
| `/weapons/oraora` | 200 | Weapon detail | yes | yes | No fix. |
| `/modules` | 200 | Modules index | yes | yes | No fix. |
| `/modules/devils-blood-curse` | 200 | Cartridge detail | yes | yes with caveats | Shape/source verification deferred. |
| `/modules/lost-radiance` | 200 | Cartridge detail | yes | yes with caveats | Shape/source verification deferred. |
| `/modules/pieces/type-ii-horizontal/s` | 200 | Module piece detail | yes | yes | No fix. |
| `/vehicles` | 200 | Vehicles route | yes | yes with caveats | Mobile screenshot QA still required. |
| `/tier-list` | 200 | Reference tier list | yes | yes with caveats | Keep reference wording. |
| `/codes` | 200 | Codes route | yes | yes with caveats | Active code verification required. |
| `/news` | 200 | News route | yes | yes | No fix. |
| `/guides` | 200 | Guides route | yes | yes with caveats | Sparse content caveat. |
| `/build-planner` | 200 | Prototype build planner | yes | yes with caveats | Keep prototype label. |
| `/about` | 200 | About page | yes | yes | No fix. |
| `/disclaimer` | 200 | Disclaimer page | yes | yes | No fix. |
| `/privacy` | 200 | Privacy page | yes | yes | No fix. |
| `/contact` | 200 | Contact page | yes | yes with blocker | Real private contact required. |
| `/dev/admin` | 200 | SPA shell; disabled dev-admin state in production build | no | no public feature | Keep excluded from sitemap/navigation. |
| `/robots.txt` | 200 | Static robots file | n/a | yes | No fake sitemap directive. |
| `/site.webmanifest` | 200 | Static manifest | n/a | yes | No fix. |

## Summary

Local Vite preview direct-route verification passed. This confirms app routing and static build serving locally, but it does not replace Cloudflare/Netlify host-level fallback verification.
