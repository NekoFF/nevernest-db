# Future Build Planner / Calculator TODO

This is a planning note only. Do not implement the calculator until the data model is ready.

The future Build Planner should support:

- Selecting a character.
- Selecting an arc/weapon.
- Selecting a console cartridge.
- Choosing cartridge rarity, main stat, and substats.
- Placing modules on the character console grid.
- Selecting module rarity and substats.
- Calculating total stats from the selected build pieces.
- Applying cartridge set bonuses only when their conditions are fulfilled.
- Showing active Esper cycles based on selected characters/elements.
- Saving a build as a local browser template.
- Exporting a build image.
- Comparing two or more builds.
- Assuming weapons, cartridges, and modules are max level for the first version, not level-by-level.

Likely architecture:

- Keep shared game data in central source files and reference records by IDs.
- Keep planner state local-first until account/profile support exists.
- Separate pure stat calculation utilities from UI components.
- Add export rendering after the planner state is stable.
