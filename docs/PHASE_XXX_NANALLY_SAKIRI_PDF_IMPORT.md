# Phase XXX - Nanally + Sakiri PDF Import

Date: 2026-05-21

## Source Files Read

- `H:\Cursor\NevernestDB\characters\Nanally\date.pdf`
- `H:\Cursor\NevernestDB\characters\Sakiri\date.pdf`

The PDFs were extracted locally with `scripts/extract-local-pdf-text.mjs`.
Generated extraction artifacts:

- `.generated/pdf-extract/nanally.txt`
- `.generated/pdf-extract/nanally.objects.json`
- `.generated/pdf-extract/sakiri.txt`
- `.generated/pdf-extract/sakiri.objects.json`

## Import Scope

- Public read-only frontend data only.
- No backend endpoint changes.
- No DB schema changes.
- No auth/admin/write system changes.
- No Build Planner formula/runtime changes.
- Public source-status badges and source-verification labels were hidden from the visitor UI while retaining internal metadata.

## Nanally Imported Sections

- Skills:
  - Colucci Secret Skill
  - Colucci Howling Technique
  - Colucci Ultimate Technique
  - Justice from Above
- Passives:
  - More than Passionate
  - Fair Duel
- Awakening:
  - A1 Gang Formation
  - A2 Second Member
  - A3 Call Me the Boss
  - A4 Not a Troublemaker
  - A5 Because We're Family
  - A6 Followers Everywhere
- Resonance / breakthrough:
  - Colucci Part 1
  - Colucci Secrets Part 2
- Life skill:
  - Family Business Lv.1-Lv.5
- Materials:
  - Per-skill material set with acquisition sources and total `$437,000`
  - Breakthrough material set with acquisition sources and total `$525,000`
- Internal preservation:
  - `sourceNotes`
  - `rawSourceText`
  - `unmappedSourceData`

## Sakiri Imported Sections

- Profile:
  - S-Rank
  - Incantation
  - Gas
  - Eibon Antique Shop
  - Buff / Control / DMG Boost
  - Birthday: November 7
  - EN voice actor: Brianna Knickerbocker
- Skills:
  - Kiroumaru Headbutt
  - Devour Whole
  - Feast of Gluttony
  - Squash!
- Passives:
  - Can I Eat This?
  - Impish Trick
- Awakening:
  - A1 Diffusive Haze
  - A2 Dextrous Separation
  - A3 Adhesive Grip
  - A4 Wishful Reliance
  - A5 Sensory Collapse
  - A6 Gluttonous Dissolution
- Resonance / breakthrough:
  - Insatiable Appetite
  - Fog Penetration
- Life skill:
  - No Work, No Reward Lv.1-Lv.5
- Materials:
  - Per-skill material set with acquisition sources and total `$437,000`
  - Breakthrough material set with acquisition sources and total `$525,000`
- Internal preservation:
  - `sourceNotes`
  - `rawSourceText`
  - `unmappedSourceData`

## Lv.1-Lv.13 Table Preservation

- Sakiri:
  - Kiroumaru Headbutt: Lv.1-Lv.13 structured rows preserved.
  - Devour Whole: Lv.1-Lv.13 structured rows preserved.
  - Feast of Gluttony: Lv.1-Lv.13 structured rows preserved.
  - Squash!: Lv.1-Lv.13 structured rows preserved.
- Nanally:
  - Colucci Howling Technique: Lv.1-Lv.13 structured rows preserved.
  - Justice from Above: Lv.1-Lv.13 structured rows preserved.
  - Colucci Secret Skill: Lv.1 structured columns preserved; Lv.2-Lv.13 public rows use clean empty values while raw extraction remains internal.
  - Colucci Ultimate Technique: Lv.1 structured columns preserved; Lv.2-Lv.13 public rows use clean empty values while raw extraction remains internal.

## Naming Conflicts / MT Wording

- Nanally:
  - Colucci / Kolucci / Collucci / Kollucci variants preserved internally.
  - Broken phrases such as "damage of the anima" and "specimen of animation" are not exposed publicly.
  - A4 changed to PDF value: Underboss deals 30% increased damage.
  - R2 changed to PDF value: Nanally damage +10%.
  - A5/A6 label ordering was kept in the clean site structure because the PDF extraction interleaves Followers Everywhere with the duration-extension text.
- Sakiri:
  - Kiroumaru / Kirumar / Kirumara variants preserved internally.
  - Broken phrases such as "techin mode", "enemized enemy", and "Critical Watch: Ill-Assortment" are not exposed publicly.
  - A4 ATK amount is incomplete in the extracted text.
  - A5 restored resource/cooldown target is incomplete in the extracted text.

## Unmapped Data

- Nanally Basic Attack Lv.2-Lv.13 and Ultimate Lv.2-Lv.13 table columns need a second manual pass against the extracted PDF objects or the PDF visual layout.
- Sakiri CN and JP voice actor fields were blank in the PDF extraction and are intentionally omitted from the public UI.
- Sakiri A4 and A5 incomplete wording is preserved internally and public copy avoids inventing exact values.

## Public UI Source Labels

Public-facing source labels were removed or hidden:

- Character hero source badges no longer render.
- Topbar search result source-status pills no longer render.
- Character source filter row no longer renders.
- Internal character-intel notes only render in admin mode.
- Weapon growth/refinement fallbacks no longer say "Source pending".
- Guide/category copy no longer uses public "Source pending" wording.

Internal metadata fields remain available for developer/admin review.

## Sections Intentionally Not Rendered

- Sakiri CN/JP voice actors are omitted because the PDF extraction had no values.
- Public source/verifier notes are hidden from normal visitors.
- Empty UI cards were not added for missing Sakiri build/team/console recommendations.

## Commands Run

- `npm.cmd run build` - PASS.
- `npm.cmd run smoke:static` - PASS, checked 12 files and 12 route tokens.
- `npm.cmd run sitemap:preview` - PASS, generated 122 preview routes and excluded `/dev/admin`.
- `npm.cmd run test:character-intel` - PASS, 4 tests.
- `npm.cmd run test:search` - PASS, 9 tests.
- `npm.cmd run audit:data` - PASS, 0 blockers, 0 warnings, 12 cartridge compatibility items still marked for verification.
- `npm.cmd run import:dry-run` - PASS, 0 blockers; report updated at `docs/IMPORT_DRY_RUN_REPORT.md`.
- Additional data sanity command - PASS:
  - Nanally has 15 total skill/passive/awakening/resonance/life entries.
  - Sakiri has 15 total skill/passive/awakening/resonance/life entries.
  - Both characters expose 13 level rows for each imported combat skill.

## Final Status

GO for public read-only shell with the imported Nanally/Sakiri data, with one data-quality follow-up:

- Before treating Nanally's Basic Attack and Ultimate level tables as fully human-readable, manually reconstruct their Lv.2-Lv.13 columns from the raw PDF extraction or visual PDF table. Public rows use clean empty values until then; the raw extracted data was retained and not discarded.
