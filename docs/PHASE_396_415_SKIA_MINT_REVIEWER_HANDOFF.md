# Phase 396-415 Skia / Mint Reviewer Handoff

Date: 2026-05-19

## Copy For Reviewer

Both XLSX files were readable before edits.
Exactly Skia and Mint were imported.
Nanally was not edited.
Imported data remains needs-verification/source-pending.
Weapon and cartridge recommendations link to existing IDs where possible.
Unconfirmed team icons were not assigned fake IDs.
Build Planner formulas/runtime were not changed.
Backend/schema/auth/admin writes were not changed.
Run post-build route smoke after preview redeploy.

## Changed Files

- `src/data/characters/skia.js`
- `src/data/characters/mint.js`
- `src/data/characters/index.js`
- `src/data/characters/otherRoster.js`
- `src/data/characters/skiaMintData.test.js`
- `docs/PHASE_396_415_SKIA_MINT_IMPORT_SUMMARY.md`
- `docs/PHASE_396_415_SKIA_MINT_REVIEWER_HANDOFF.md`
- `docs/IMPORT_DRY_RUN_REPORT.md`
- `docs/SEED_PREVIEW_REPORT.md`
- Main readiness docs updated for Phase 396-415.

## Data Result

Skia and Mint now have structured profile, stats, skills, awakenings/resonance, life skills, builds, recommended weapons, cartridges, stats, skill priority, teams, synergies, console trait/setup, materials, voice actors, and conflict notes where the existing UI supports them.

## Conflicts / Source Pending

- Skia Arc type: current site Plasma preserved over XLSX Gas pending verification.
- Skia RES reduction and exact console grid remain source-pending.
- Mint JP voice actor, Perfect Containment ratio, Thunderous Whirlwind Slash cooldown, Cycle Rate/Energy fields, unknown materials, and some team IDs remain source-pending.

## Build Planner

Existing structured fields are now present for Skia and Mint. Build Planner formulas/runtime were not modified. No source-pending skill formulas or exact growth curves were added.

## Commands Run

- `node --test src/data/characters/skiaMintData.test.js` - PASS.
- `npm run build` - FAILED in PowerShell because `npm.ps1` is blocked by execution policy.
- `npm.cmd run test:character-intel` - PASS.
- `npm.cmd run test:corpus` - PASS.
- `npm.cmd run test:search` - PASS.
- `npm.cmd run server:check` - PASS.
- `npm.cmd run server:build` - PASS.
- `npm.cmd run server:test` - PASS; 114 pass, 5 skipped DB-mode cases.
- `npm.cmd run build` - PASS.
- `npm.cmd run smoke:static` - PASS.
- `npm.cmd run sitemap:preview` - PASS; 122 routes, `/dev/admin` excluded.
- `npm.cmd run audit:data` - PASS; 0 blockers.
- `npm.cmd run import:dry-run` - PASS; 0 blockers.
- `npm.cmd run server:seed:preview` - PASS; 0 blockers.

## Runtime / Safety

- Backend endpoints changed: no.
- DB schema changed: no.
- Auth/admin behavior changed: no.
- Production admin writes enabled: no.
- API mode default changed: no.
- `/dev/admin` changed: no.

## Risks / TODOs

- Manually verify Skia Arc type before changing the current site canonical value.
- Verify Mint cooldown/Cycle labels before any formula use.
- Replace Mint unknown material placeholders only when item names are confirmed.
- Confirm Skia/Mint detail pages visually after preview redeploy.

## Recommended Next Phase

Preview-smoke Skia and Mint detail pages, then continue character batches one or two source-reviewed characters at a time.
