# Nanally Import Readiness

Date: 2026-05-16

Source reviewed: local Nanally reference PDF (`Document 7.pdf`) plus current Nanally implementation in `src/data/characters/nanally.js`.

## Verdict

Nanally is a strong reference character for designing the canonical character schema because the PDF includes identity, combat taxonomy, Lv.1-Lv.80 stats, ascension materials, skill text, several skill attribute levels, skill materials, passives, life skill costs, awakenings, awakening bonuses, and lore/intel.

Nanally should not be bulk-imported over the current app record yet. Several fields differ between the PDF and current implementation, and some data is richer than the current UI/admin shape can safely preserve.

## Readiness Checklist

| Area | Status | Notes |
|---|---|---|
| identity | Ready | Name, tagline, rarity by current site, element, arc type, role tags, faction, esper ability, and birthday can be structured. Faction spelling needs verification: PDF says `Eibon Antique Shop`; current data says `Elbon Antique Shop`. |
| roles | Ready | PDF says Damage, Main DPS, Follow-up Attack. Current data matches. |
| faction | Needs verification | PDF/current spelling conflict. Import template uses PDF value with verification note. |
| esper ability | Ready | PDF gives `Genius Ichi-daime: Earth Flip`; current data lacks first-class field. |
| birthday | Ready | PDF says August 20. |
| voice actors | Partial | EN is present as Brittany Lauda. PDF extraction did not expose JP/KO/CN names reliably; current file has mojibake/encoding-corrupted non-English names. Needs manual verification before import. |
| Lv.1-Lv.80 stats | Ready | PDF provides exact HP/ATK/DEF for levels 1-80. CRIT Rate/CRIT DMG appear constant in current data but are not in the level table; mark as inherited/current-site values until verified. |
| ascension materials | Ready | PDF provides totals and source lists for A Page from Delusion's Shore, Chaos Silhouette, Beetle Coin, Blurred Silhouette, and Fading Silhouette. |
| skills | Ready | Four combat skills are present with descriptions and flavor text. Type labels differ from current site for some entries: PDF says Redirect Skill and Support Skill. |
| skill attributes | Partial | PDF extraction shows multiple known levels for several skills, apparently sparse Lv.1/mid/max style rows, but level labels were not preserved in the text extraction. Import only known row sets with `sourceStatus: needs_level_mapping` unless manually verified against the PDF layout. |
| skill materials | Ready | PDF provides max totals and sources. Current Nanally file has smaller placeholder totals and should not be treated as final. |
| passive skills | Ready | More Than Passionate and Fair Duel are present, with material unlock costs in PDF. |
| life skills | Ready | Family Business Lv.1-Lv.5 effects and costs are present. |
| awakenings | Needs verification | PDF order is Gang Formation, Second Member, Call Me the Boss, Not a Troublemaker, Followers Everywhere, Because We're Family. Current file swaps A5/A6 names/effects. Manual verification required before overwrite. |
| lore/intel | Ready | PDF includes Intel, personal items, stories, and quote collection. Can import as structured lore text after proofreading. |
| build recommendations | Partial | Current site has build recommendations and teams, but the PDF is character reference data, not necessarily build guide source. Keep current build as site-authored data and mark source separately. |
| skins | Missing | No skin/outfit data in source. |
| voice lines | Missing | No voice line data in source. |

## Import-Now Candidates

- `identity.name`
- `identity.title`
- `identity.roles`
- `identity.birthday`
- `identity.esperAbility`
- `stats.levelStats` HP/ATK/DEF Lv.1-Lv.80
- Ascension material totals and source lists
- Skill names, descriptions, flavor text
- Passive names/descriptions
- Life skill levels/effects/materials
- Lore/intel buckets after proofreading

## Hold For Manual Verification

- Faction spelling (`Eibon` vs `Elbon`)
- JP/KO/CN voice actor names
- Skill attribute level mapping for sparse rows
- Awakening order and A5/A6 effect mapping
- Whether current CRIT Rate and CRIT DMG should be repeated on every level row
- Whether PDF skill type labels should replace current UI labels
- Build recommendations, because they are guide data rather than raw character source data

## Data Differences Found

| Field | Current app | PDF/source | Action |
|---|---|---|---|
| Faction | Elbon Antique Shop | Eibon Antique Shop | Verify spelling before import. |
| Esper ability | Missing first-class field | Genius Ichi-daime: Earth Flip | Add canonical field. |
| Lv.80 stats | HP 15998 / ATK 636 / DEF 909 in current keyframe | HP 9662 / ATK 396 / DEF 549 in PDF table | Do not overwrite until source context is understood. Current note mentions old Lv.90/checkpoint uncertainty; PDF table appears base Lv.1-Lv.80. |
| Skill material totals | Current small totals like 437000 currency and 10/16 item counts | PDF max totals include Beetle Coin 2647000 and larger material quantities | Treat PDF as import candidate, current as placeholder. |
| Basic Attack Heavy Hitter chain | Current says 1st, 2nd, 3rd, and 4th attacks | PDF says 1st, 2nd, 3rd, and 5th attacks | Verify against game/source screenshot. |
| Plunge max increase | Current says up to 200% | PDF says up to 100% | Verify before overwrite. |
| Awakenings A5/A6 | Current A5 `Because We're Family` is ATK stacks; A6 `Followers Everywhere` is duration | PDF has Followers Everywhere as ATK stacks, Because We're Family as duration | Verify and correct import template only after confirmation. |

## Before Importing All Characters

1. Adopt the canonical template shape.
2. Write an adapter from canonical JSON to the current React character shape.
3. Add sparse skill-level support (`attributesByLevel`, known levels, disabled missing levels).
4. Add source status and verification flags to imported fields.
5. Add planner effect taxonomy before importing passive/awakening effects as calculator data.
6. Keep SQL work for later, after canonical JSON proves stable across multiple characters.
