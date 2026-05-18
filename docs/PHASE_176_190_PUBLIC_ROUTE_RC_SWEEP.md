# Phase 176-190 Public Route RC Sweep

Date: 2026-05-18

Static build and smoke passed. A local Vite preview direct-route probe returned HTTP 200 for every requested route below. Production direct refresh still depends on host SPA fallback, so every public route keeps fallback risk until the chosen host is configured and verified.

| Route | Static preview reachable? | Direct refresh risk | Beta appropriate | Copy/source risk | Mobile risk | SEO/sitemap status | Fix/defer |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `/` | yes | yes until fallback | yes | low | medium | included | Defer browser screenshot pass. |
| `/characters` | yes | yes | yes | medium | medium | included | Keep caveats. |
| `/characters/nanally` | yes | yes | yes | medium | medium | included | No mass-fill. |
| `/weapons` | yes | yes | yes | medium | medium | included | Keep source badges on details. |
| `/weapons/good-boys-grand-adventure` | yes | yes | yes | medium | medium | included | Route in sitemap. |
| `/weapons/ready-ready` | yes | yes | yes | medium | medium | included | Route in sitemap. |
| `/weapons/oraora` | yes | yes | yes | medium | medium | included | Route in sitemap. |
| `/modules` | yes | yes | yes | medium | medium | included | 36 vs 24 documented as pagination. |
| `/modules/devils-blood-curse` | yes | yes | yes/caveat | high compatible-shape source risk | medium | included | Keep needs-verification. |
| `/modules/lost-radiance` | yes | yes | yes/caveat | high compatible-shape source risk | medium | included | Keep needs-verification. |
| `/modules/pieces/type-ii-horizontal/s` | yes | yes | yes | medium | medium | included | Route in sitemap. |
| `/vehicles` | yes | yes | yes | medium | high | included | Needs browser/mobile pass. |
| `/tier-list` | yes | yes | yes/caveat | medium; reference wording improved | high | included | Keep source caveat. |
| `/codes` | yes | yes | yes/caveat | high active-code verification risk | medium | included | Verify active codes before beta. |
| `/news` | yes | yes | yes | medium | medium | included | Source labels sparse. |
| `/guides` | yes | yes | caveat | sparse content | medium | included | Public only if placeholder posture accepted. |
| `/build-planner` | yes | yes | caveat | formula verification risk | high | included | Prototype posture only. |
| `/about` | yes | yes | yes | low | low | included | OK. |
| `/disclaimer` | yes | yes | yes | low | low | included | OK. |
| `/privacy` | yes | yes | yes | low | low | included | OK. |
| `/contact` | yes | yes | yes/caveat | channel not selected | low | included | Contact/takedown channel needed. |
| `/dev/admin` | app shell returns 200; panel disabled by production runtime gate | not public | no | high if exposed | medium | excluded | Keep hidden/disabled without dev flag and excluded from sitemap/navigation. |

## Summary

No route was found that requires code removal for a read-only beta. The launch blockers are production host fallback/security/contact/mobile verification, not local route availability.

## Local Preview Probe

Command used:

```sh
npm run preview -- --host 127.0.0.1 --port 4173
node -e "/* fetch each route and print status */"
```

Result: all requested routes returned HTTP 200 from the Vite preview server. `curl` was unavailable in this shell, so the probe used Node's built-in `fetch`.
