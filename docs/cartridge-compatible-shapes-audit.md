# Cartridge Compatible Shapes Audit

Date: 2026-05-15

## Summary

Seed cartridge compatible module IDs no longer use `module_shape_1` style placeholders in `compatibleModules[].moduleShapeId`. Each seed cartridge now references existing module shape IDs from `src/data/moduleCatalog.js`:

`type-ii-horizontal`, `type-ii-vertical`, `type-iii-horizontal`, `type-iii-vertical`

These IDs are resolvable and safe for Build Planner matching. The original source still marks exact screenshot shape verification as pending, so each seed cartridge is flagged with `dataStatus: "missing-compatible-shapes"` until exact per-cartridge shape requirements are confirmed.

## Activation Rules

- 2-piece activates only when at least 2 real, resolvable required module shapes are matched by placed module objects.
- 4-piece activates only when at least 4 real, resolvable required module shapes are matched by placed module objects.
- Missing or invalid shape IDs are ignored for set matching and produce dev warnings.

## Cartridge Status

| Cartridge | Required shape IDs | All IDs resolve? | 2-piece status | 4-piece status | Incomplete data |
|---|---|---:|---|---|---|
| Lost Radiance | `type-ii-horizontal`, `type-ii-vertical`, `type-iii-horizontal`, `type-iii-vertical` | Yes | Can activate with 2 matched required modules | Can activate with 4 matched required modules | `missing-compatible-shapes` |
| Fireflies and the Forest | `type-ii-horizontal`, `type-ii-vertical`, `type-iii-horizontal`, `type-iii-vertical` | Yes | Can activate with 2 matched required modules | Can activate with 4 matched required modules | `missing-compatible-shapes` |
| Crimson: Twin Butterflies | `type-ii-horizontal`, `type-ii-vertical`, `type-iii-horizontal`, `type-iii-vertical` | Yes | Can activate with 2 matched required modules | Can activate with 4 matched required modules | `missing-compatible-shapes` |
| Diabolos | `type-ii-horizontal`, `type-ii-vertical`, `type-iii-horizontal`, `type-iii-vertical` | Yes | Can activate with 2 matched required modules | Can activate with 4 matched required modules | `missing-compatible-shapes` |
| Devil's Blood: Curse | `type-ii-horizontal`, `type-ii-vertical`, `type-iii-horizontal`, `type-iii-vertical` | Yes | Can activate with 2 matched required modules | Can activate with 4 matched required modules | `missing-compatible-shapes` |
| Street Boxer | `type-ii-horizontal`, `type-ii-vertical`, `type-iii-horizontal`, `type-iii-vertical` | Yes | Can activate with 2 matched required modules | Can activate with 4 matched required modules | `missing-compatible-shapes`; 4-piece text still needs wording check |
| Kingdom's Guard | `type-ii-horizontal`, `type-ii-vertical`, `type-iii-horizontal`, `type-iii-vertical` | Yes | Can activate with 2 matched required modules | Can activate with 4 matched required modules | `missing-compatible-shapes` |
| Shadow Creed | `type-ii-horizontal`, `type-ii-vertical`, `type-iii-horizontal`, `type-iii-vertical` | Yes | Can activate with 2 matched required modules | Can activate with 4 matched required modules | `missing-compatible-shapes` |
| Thea's Night Tavern | `type-ii-horizontal`, `type-ii-vertical`, `type-iii-horizontal`, `type-iii-vertical` | Yes | Can activate with 2 matched required modules | Can activate with 4 matched required modules | `missing-compatible-shapes` |
| Tiny Big Adventure | `type-ii-horizontal`, `type-ii-vertical`, `type-iii-horizontal`, `type-iii-vertical` | Yes | Can activate with 2 matched required modules | Can activate with 4 matched required modules | `missing-compatible-shapes` |
| Speedy Hedgehog | `type-ii-horizontal`, `type-ii-vertical`, `type-iii-horizontal`, `type-iii-vertical` | Yes | Can activate with 2 matched required modules | Can activate with 4 matched required modules | `missing-compatible-shapes` |
| Quiet Manor | `type-ii-horizontal`, `type-ii-vertical`, `type-iii-horizontal`, `type-iii-vertical` | Yes | Can activate with 2 matched required modules | Can activate with 4 matched required modules | `missing-compatible-shapes` |

## Validation Notes

- Fireflies and the Forest with 2 matched required modules activates its 2-piece bonus and adds `Anima DMG +10%`.
- Removing one required module deactivates the 2-piece bonus and returns Anima DMG from the set bonus to `0%`.
- Fireflies and the Forest 4-piece appears only after 4 required module objects match.
- The required matched counter is based on valid placed module objects and real required shape IDs, not placeholder strings.
