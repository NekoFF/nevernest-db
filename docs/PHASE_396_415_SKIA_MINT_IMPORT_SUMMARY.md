# Phase 396-415 Skia / Mint Structured Import Summary

Date: 2026-05-19

## XLSX Readability Gate

Both XLSX workbooks were readable before code changes were made.

- `skia_character_data_v1_1_source_pending.xlsx`: sheets `README`, `Overview`, `Stats`, `Skills`, `Awakenings`, `Build`, `Teams`, `Console`, `Materials`, `Conflicts`; all readable, no empty/corrupt/inaccessible sheet detected.
- `mint_character_data_v1_1_source_pending.xlsx`: sheets `README`, `Overview`, `Stats`, `Skills`, `SkillAttributes`, `SkillMaterials`, `Awakenings`, `Build`, `Console`, `Teams`, `Materials`, `Conflicts`; all readable, no empty/corrupt/inaccessible sheet detected.

## Applied Characters

Exactly two characters were applied:

- Skia
- Mint

Nanally was not edited. No other character was batch-filled.

## Data Applied

Skia:

- Source-pending profile, faction, birthday, voice actors, overview notes, gameplay identity, source/conflict notes.
- Lv.1/Lv.40/Lv.80 HP/ATK/DEF snapshots with CRIT Rate 5% and CRIT DMG 50%.
- Structured skills, awakenings, resonance notes, life skill, build recommendations, console trait, materials, teams, and synergies.
- Existing site `arcType: plasma` was preserved because the XLSX lists Gas as source-pending and explicitly calls for current-site comparison before overwrite.

Mint:

- Source-pending profile, faction, birthday, voice actors, overview notes, gameplay identity, source/conflict notes.
- Lv.1/Lv.40/Lv.80 HP/ATK/DEF snapshots with CRIT Rate 5% and CRIT DMG 50%.
- Structured skills, skill attributes, awakenings, resonance notes, life skill, build recommendations, console trait, materials, teams, and synergies.
- Mint card `arcType` was updated to `liquid` because the XLSX and user-provided notes both lock Mint as Anima / Liquid.

## References Resolved

Resolved weapon IDs:

- `watch-your-heads`
- `fluff-of-fleetness`
- `mind-royale`
- `shiny-days`
- `clear-skies`

Resolved cartridge IDs:

- `street-boxer`
- `shadow-creed`
- `fireflies-and-the-forest`

Unconfirmed team-member icons were not assigned fake character IDs.

## Source Pending / Conflicts

- All imported Skia and Mint detail records remain `needs_verification`.
- Skia Arc type conflict: XLSX says Gas, current site card had Plasma. Plasma remains active and the conflict is visible in Skia source notes.
- Skia Employee of the Month resistance-reduction per-stack value remains source-pending.
- Skia exact console grid placement was not forced.
- Mint JP voice actor conflict is documented; Akari Kito is stored source-pending.
- Mint Perfect Containment Lv.1 first ratio conflict is documented; screenshot value `10.4% + 23.1%` is stored.
- Mint Thunderous Whirlwind Slash cooldown conflict remains visible and is not used in formulas.
- Mint unknown material item names remain placeholders rather than invented item IDs.

## Build Planner

Build Planner formulas/runtime were not changed.

The new data is available through the existing structured character fields:

- `levelStats`
- `stats`
- `build.recommendedWeapons`
- `build.recommendedCartridges`
- `build.mainStats`
- `build.subStats`
- `build.endgameStats`
- `build.skillPriority`
- `buildTraits`
- `consoleTrait`

Existing Build Planner logic may read these fields where it already supports them. No new formula, scaling curve, or source-pending skill damage calculation was added.

## Safety

- Backend endpoints were not changed.
- DB schema was not changed.
- Auth, registration, production admin writes, broad CRUD, comments, submissions, and API mode default were not changed.
- Browser AdminMode and `/dev/admin` behavior were not changed.
