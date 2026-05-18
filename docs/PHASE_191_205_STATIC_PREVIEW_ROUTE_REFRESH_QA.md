# Phase 191-205 Static Preview Route Refresh QA

Date: 2026-05-18

## Scope

This is a Vite production-build preview route reachability check. It is useful for validating app route parsing and built asset availability, but it is not a replacement for host-level SPA fallback testing on Cloudflare Pages, Netlify, Vercel, or another final host.

Commands:

```sh
npm run build
npm run preview -- --host 127.0.0.1 --port 4173
node -e "/* fetch direct routes and print status */"
```

`curl` is not available in this shell, so route probing uses Node's built-in `fetch`.

## Results

| Route | HTTP status from preview | App renders expected route or disabled state | In sitemap? | Beta appropriate | Issue/fix/defer |
| --- | --- | --- | --- | --- | --- |
| `/` | 200 | Expected home route by app router | yes | yes | No fix. |
| `/characters` | 200 | Expected character index | yes | yes | No fix. |
| `/characters/nanally` | 200 | Expected character detail route | yes | yes | Keep source caveats. |
| `/weapons` | 200 | Expected weapon index | yes | yes | No fix. |
| `/weapons/good-boys-grand-adventure` | 200 | Expected weapon detail route | yes | yes | No fix. |
| `/weapons/ready-ready` | 200 | Expected weapon detail route | yes | yes | No fix. |
| `/weapons/oraora` | 200 | Expected weapon detail route | yes | yes | No fix. |
| `/modules` | 200 | Expected modules index | yes | yes | No fix. |
| `/modules/devils-blood-curse` | 200 | Expected cartridge detail route | yes | yes/caveat | Compatible-shape verification remains caveated. |
| `/modules/lost-radiance` | 200 | Expected cartridge detail route | yes | yes/caveat | Compatible-shape verification remains caveated. |
| `/modules/pieces/type-ii-horizontal/s` | 200 | Expected module piece detail route | yes | yes | No fix. |
| `/vehicles` | 200 | Expected vehicles route | yes | yes/caveat | Mobile screenshot QA still needed. |
| `/tier-list` | 200 | Expected reference tier-list route | yes | yes/caveat | Keep reference wording. |
| `/codes` | 200 | Expected codes route | yes | yes/caveat | Active-code verification still needed. |
| `/news` | 200 | Expected news route | yes | yes | Source labels remain sparse. |
| `/guides` | 200 | Expected guides route | yes | yes/caveat | Sparse content caveat. |
| `/build-planner` | 200 | Expected planner route | yes | yes/caveat | Prototype caveat required. |
| `/about` | 200 | Expected legal/info route | yes | yes | No fix. |
| `/disclaimer` | 200 | Expected legal/info route | yes | yes | No fix. |
| `/privacy` | 200 | Expected legal/info route | yes | yes | No fix. |
| `/contact` | 200 | Expected contact route | yes | yes/caveat | Real channel still needed. |
| `/dev/admin` | 200 | SPA shell loads; production build shows disabled dev admin state | no | no | Keep excluded from sitemap/navigation. |

## Summary

All requested routes returned HTTP 200 from local Vite preview. Host-level direct refresh remains a beta blocker until the selected deployment preview is configured and tested.
