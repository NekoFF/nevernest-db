# Public Beta Rollback Plan

Date: 2026-05-18

## Static Rollback

1. Identify last known-good commit or tag.
2. Use the hosting provider rollback/redeploy UI to restore that deployment.
3. If provider rollback is unavailable, redeploy from the known-good tag.
4. Verify `/`, core list routes, one detail route, `/robots.txt`, and `/sitemap.xml`.

For the static beta candidate, rehearse this once on a preview deployment before launch. No database rollback should be part of the static beta path.

Phase 206-220 note: after the Cloudflare/Netlify preview exists, rehearse rollback from the preview deployment UI and record the known-good deployment URL, commit, rollback target, and verification result before public beta approval.

Phase 221-235 note: rollback rehearsal is still not run because no preview deployment URL exists. Public beta remains blocked until a preview deployment can be rolled back and reverified.

## Git Rollback

Preferred:

```sh
git checkout public-beta-rc-YYYYMMDD
npm run build
```

Avoid destructive local commands unless explicitly approved.

## Sitemap/Robots Rollback

- If sitemap has bad URLs, regenerate with the correct `SITE_URL`.
- If robots has a bad `Sitemap:` directive, remove or correct it.
- Recheck `/robots.txt` and `/sitemap.xml` after redeploy.

## DB Rollback

No DB rollback should be needed for a static read-only beta because production DB writes are not enabled. If any DB mutation occurred, treat that as an incident and stop the beta rollout.

## If Admin/Auth Is Accidentally Exposed

1. Roll back immediately.
2. Remove any production env flags enabling auth/admin writes.
3. Rotate any exposed secrets.
4. Review server logs if a backend was involved.
5. Document incident and root cause before redeploy.

## If Legal/Source Issue Is Reported

1. Acknowledge through the approved contact/takedown channel.
2. Remove or hide the disputed asset/content if needed.
3. Do not argue ownership in app copy.
4. Document source and resolution.
5. Redeploy static build if content changed.

## If Broken Route Is Found

1. Confirm whether it is SPA fallback, data, asset, or client-route issue.
2. If fallback/host config, fix host config and redeploy.
3. If app bug, patch and run clean checks.
4. If severe, roll back to previous deployment.

## Phase 316-335 Note

Rollback rehearsal is still required on the real preview deployment. Public beta remains NO-GO until the known-good preview URL, commit, rollback target, and post-rollback route/header checks are recorded.

## Phase 336-355 Note

Cloudflare preview route/header/AdminMode checks passed, but Cloudflare deployment UI rollback was not rehearsed. Public beta remains NO-GO until rollback is rehearsed and the known-good deployment, commit, rollback target, and post-rollback route/header/AdminMode checks are recorded.
