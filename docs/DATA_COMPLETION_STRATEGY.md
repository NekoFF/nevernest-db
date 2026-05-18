# Data Completion Strategy

Date: 2026-05-17

## Principle

Do not require all character, weapon, module, or guide data to be complete before the structure and workflow are ready. The project should first make incomplete data safe to represent, then make data entry repeatable, then verify and freeze public beta data.

## What Can Remain Placeholder Now

- Skeleton character fields for unreleased or lightly sourced characters.
- Sparse guide/community/apartment content.
- Draft material catalog rows.
- Estimated or unknown stat values when clearly labeled.
- Tier list explanations until editorial/source policy is ready.
- Recommendation logic for weapons/modules/builds.

## What Must Be Structurally Supported Before Mass Data Entry

- `sourceStatus` on imported/data-backed rows.
- Patch/version or `lastUpdated` tracking.
- `sourceNotes` and `verificationNotes` fields or equivalent documented storage path.
- Admin draft/review/publish workflow before production writes.
- Import/export round-trip for reviewed data.
- Durable audit logging before production admin edits.
- Clear UI treatment for incomplete, estimated, placeholder, and needs-verification values.

## What Should Be Verified Before Public Beta

- No duplicate ids/slugs.
- No broken core media references.
- Cartridge compatible shapes must remain `needs_verification` unless sourced.
- Code statuses and expiry display should be reviewed.
- Fan-site disclaimer and source/legal posture should be reviewed.
- Empty guide/community/apartment routes should be intentionally labeled, hidden, or scoped.

## What Can Be Filled After Launch

- Full character material paths.
- Detailed skill scaling for every character.
- Weapon recommendations.
- Build/team recommendations.
- Guide articles.
- Patch history and changelogs.
- Community/source reference expansion.
- Advanced planner expected-value fixtures.

## SourceStatus Policy

Use:

- `verified`: source-backed and reviewed.
- `needs_verification`: plausible but not source-confirmed.
- `estimated`: calculated or inferred values.
- `placeholder`: intentionally incomplete.
- `unknown`: imported or legacy value with unclear provenance.
- `mock`: test/demo data only.

The UI should avoid presenting non-verified values as official. For public beta, sourceStatus badges or contextual notes should appear on high-risk data such as formulas, cartridge compatibility, materials, rankings, and recommendations.

Phase 121-135 started this UI pattern on cartridge Set Data. Bonus rows can display available text while labeling `needs_verification`, `estimated`, `placeholder`, `mock`, or `unknown` honestly. This is display confidence only; it does not verify data or change sourceStatus.

Phase 136-150 expanded the display pattern to weapon growth/refinement sections, character detail hero metadata, vehicle handling, codes, and news where current view models already expose `sourceStatus`. This remains display-only confidence labeling. It does not promote rows to verified and does not fill missing source fields.

## Patch/Verification Metadata

Future data workflow should track:

- `patchVersion`
- `lastUpdated`
- `sourceUrl`
- `sourceLabel`
- `sourceNotes`
- `verificationNotes`
- `verifiedBy`
- `verifiedAt`

These do not all need to be implemented immediately, but the workflow should not mass-fill data until the target fields and admin review process are known.

## Safe Order For Data Entry

1. Schema/fields readiness.
2. Source policy.
3. Admin workflow.
4. Import/export.
5. Manual data fill.
6. Verification pass.
7. Public beta data freeze.

## Characters

Current acceptable state: 18 characters exist, with Nanally much richer than many others. Public beta can show partial profiles if incomplete sections are clear.

Before mass fill: define required detail sections, sourceStatus rules for skills/materials, patch metadata, and a changelog plan.

Beta focus: no broken pages, clear incomplete states, no invented official values.

Phase 256-275 note: the local `nevernest-intel` character corpus can now be inventoried and extracted into generated candidate reports. These candidates are not live data. Canonical site identity fields remain protected, Nanally remains compare-only, and every corpus-derived snippet is `needs_verification` until a manual reviewer accepts it.

Phase 276-295 note: Lacrimosa received a tiny source-pending intel pilot from manually reviewed candidate notes. The notes live outside canonical character objects, contain no protected identity/stat fields, and do not feed Build Planner formulas. Nanally remains untouched.

Phase 296-315 note: mobile/visual polish did not change character data. Source-pending intel remains display-only and Build Planner formulas still do not consume extracted character notes.

## Weapons

Current acceptable state: 42 weapons with refinements/growth stats in the import plan.

Before mass fill: verify stat growth, refinement wording, weapon type taxonomy, and recommendation model.

Beta focus: browse/search/filter reliability and clear source status.

## Cartridges/Modules

Current acceptable state: 12 cartridge sets, 12 module shapes, 36 module pieces, and compatible shape rows that need verification.

Before mass fill: verify compatible shapes, main stat templates, substat rules, and shape/source evidence.

Beta focus: never label missing-compatible-shapes as verified.

Phase 151-160 note: the prior 36 vs 24 module-piece concern was pagination, not missing import data. Static/audit/dry-run/seed preview/local import all show 36 module pieces; unqualified `/api/modules/pieces` returns 24 because the shared API list default is `limit=24`. Use `limit=100` for full parity checks.

## Vehicles

Current acceptable state: 16 vehicles with showcase assets and stats.

Before mass fill: verify acquisition, price/currency, performance stats, and asset naming.

Beta focus: browse experience and source notes for uncertain values.

## Codes

Current acceptable state: 13 codes and local code write QA.

Before mass fill: expiry/source tracking, status policy, and update review.

Beta focus: avoid stale active/expired labels.

Phase 151-160 note: current static code data has 7 active and 6 expired codes, but no expiry dates, source URLs, or source labels. Do not infer expiry dates or exact rewards without evidence.

## News

Current acceptable state: 3 news posts and local news write QA.

Before mass fill: editorial source, category taxonomy, publish dates, and archive policy.

Beta focus: clear unofficial/news-source posture.

## Guides

Current acceptable state: placeholder/sparse.

Before mass fill: guide IA, author/source policy, changelog, and review workflow.

Beta focus: decide whether to show placeholder route publicly.

## Tier Lists

Current acceptable state: official/personal modes exist, with localStorage personal lists.

Before mass fill: ranking rationale, patch version, source/author notes, and review policy.

Beta focus: avoid unexplained “official” claims if source is not validated.

## Materials

Current acceptable state: draft material candidates and blocked character material rows.

Before mass fill: canonical material catalog, aliases, icons, sourceStatus, and usage mapping.

Beta focus: keep blocked rows blocked until verified.

## Media Assets

Current acceptable state: assets render with explicit media aliases for known mismatches.

Before mass fill: asset naming policy, source/license notes, dimensions, formats, and future media manager plan.

Beta focus: no broken core assets and no unreviewed licensing claims.
