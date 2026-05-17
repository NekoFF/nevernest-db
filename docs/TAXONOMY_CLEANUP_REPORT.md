# Taxonomy Cleanup Report

Date: 2026-05-16

Generated during Phase 5 canonical export validation.

## Summary

Role/tag import warnings were reduced by expanding canonical taxonomy and using import-time normalizers.

Before Phase 5:

- Missing role references: `special`, `damage`, `follow-up-attack`
- Missing tag references: `control`, `healing`, `burst-dps`, `main-dps`, `shield`

After Phase 5:

- Unresolved role labels: none in the dry-run payload.
- Unresolved tag labels: none in the dry-run payload.

## Canonical Gameplay Roles

| Role id | Label | Important aliases | Notes |
| --- | --- | --- | --- |
| `attack` | Attack | `attacker`, `damage`, `dps` | `damage` is treated as a broad legacy alias, not a precise final role. |
| `defense` | Defense | `tank`, `defender` | Defensive function. |
| `support` | Support | `utility` | Team utility role. |
| `main-dps` | Main DPS | `main damage`, `on-field dps` | Primary damage role. |
| `burst-dps` | Burst DPS | `burst damage`, `nuke` | Short-window damage role. |
| `healer` | Healer | `healing` | Healing sustain role. |
| `shielder` | Shielder | `shield` | Shield sustain role. |
| `control` | Control | `cc` | Crowd-control/disruption role. |
| `follow-up-attack` | Follow-up Attack | `follow-up`, `follow up attack` | Gameplay function used by current seed data. |
| `special` | Special | `unique`, `legacy-special` | Legacy fallback role; should be reviewed later. |

## Canonical Tags

| Tag id | Label | Important aliases | Notes |
| --- | --- | --- | --- |
| `damage` | Damage | `dmg` | Generic descriptor. |
| `main-dps` | Main DPS | `main damage`, `on-field dps` | Legacy tag compatibility for role-like source labels. |
| `burst-dps` | Burst DPS | `burst damage` | Legacy tag compatibility. |
| `dot` | DoT | `damage-over-time` | Damage over time descriptor. |
| `healing` | Healing | `healer` | Legacy tag compatibility. |
| `shield` | Shield | `shielder` | Legacy tag compatibility. |
| `buff` | Buff | `team-buff` | Positive effect descriptor. |
| `control` | Control | `cc` | Legacy tag compatibility. |
| `dmg-boost` | DMG Boost | `damage-boost` | Damage increase descriptor. |
| `dmg-redirection` | DMG Redirection | `damage-redirection` | Damage transfer/redirect descriptor. |
| `follow-up-attack` | Follow-up Attack | `follow-up` | Combat pattern descriptor. |
| `instant-cycle` | Instant Cycle | `cycle` | Rotation/cycle descriptor. |
| `survival` | Survival | `sustain` | Survivability descriptor. |
| `break-boost` | Break Boost | `break` | Break enhancement descriptor. |
| `special` | Special | `unique` | Legacy catch-all. |

## Current Seed Label Resolution

| Source label | Import role resolution | Import tag resolution | Recommendation |
| --- | --- | --- | --- |
| `Attack` | `attack` | none unless explicitly tagged | Keep as role. |
| `Defense` | `defense` | none unless explicitly tagged | Keep as role. |
| `Support` | `support` | none unless explicitly tagged | Keep as role. |
| `Special` | `special` | `special` | Review later; replace with precise role/tag. |
| `Damage` | `attack` | `damage` | Prefer role `attack` plus tag `damage` only when descriptive. |
| `Main DPS` | `main-dps` | `main-dps` | Prefer role, tag is compatibility-only. |
| `Burst DPS` | `burst-dps` | `burst-dps` | Prefer role, tag is compatibility-only. |
| `Healing` | `healer` | `healing` | Prefer role `healer`. |
| `Shield` | `shielder` | `shield` | Prefer role `shielder`. |
| `Control` | `control` | `control` | Prefer role when used as gameplay function. |
| `Follow-up Attack` | `follow-up-attack` | `follow-up-attack` | Keep as role/function. |

## Recommended Cleanup

- Move role-like labels out of `tags` in character records over time.
- Keep compatibility tag ids until all current seed records are normalized.
- Review `special` manually; it is a legacy fallback, not a production-quality category.
- Keep import metadata `sourceLabel` so cleanup can be audited.

