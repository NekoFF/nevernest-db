# Local Seed Import Report

Generated: 2026-05-17T22:37:48.950Z

## Summary

- Mode: write
- Database: postgres://localhost:5432/nte_database
- Transaction: committed
- Planned rows: 1759
- Inserted rows: 0
- Updated/upserted rows: 1759
- Skipped rows: 42
- Blocked rows: 42
- Needs verification rows: 141
- Failed rows: 0

This command is local-only. It must never be used against production databases.

## Table Actions

| Table | Planned | Inserted | Updated | Skipped | Failed | Note |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| elements | 6 | 0 | 6 | 0 | 0 |  |
| arcTypes | 5 | 0 | 5 | 0 | 0 |  |
| rarities | 3 | 0 | 3 | 0 | 0 |  |
| roles | 10 | 0 | 10 | 0 | 0 |  |
| tags | 15 | 0 | 15 | 0 | 0 |  |
| stats | 28 | 0 | 28 | 0 | 0 |  |
| mediaAssets | 126 | 0 | 126 | 0 | 0 |  |
| characters | 18 | 0 | 18 | 0 | 0 |  |
| characterRoles | 20 | 0 | 20 | 0 | 0 |  |
| characterTags | 47 | 0 | 47 | 0 | 0 |  |
| characterStats | 240 | 0 | 240 | 0 | 0 |  |
| characterSkills | 16 | 0 | 16 | 0 | 0 |  |
| characterVoiceActors | 4 | 0 | 4 | 0 | 0 |  |
| weapons | 42 | 0 | 42 | 0 | 0 |  |
| weaponRefinements | 210 | 0 | 210 | 0 | 0 |  |
| weaponGrowthStats | 748 | 0 | 748 | 0 | 0 |  |
| cartridgeSets | 12 | 0 | 12 | 0 | 0 |  |
| cartridgeSetBonuses | 24 | 0 | 24 | 0 | 0 |  |
| moduleShapes | 12 | 0 | 12 | 0 | 0 |  |
| modulePieces | 36 | 0 | 36 | 0 | 0 |  |
| cartridgeCompatibleShapes | 48 | 0 | 48 | 0 | 0 |  |
| vehicles | 16 | 0 | 16 | 0 | 0 |  |
| vehicleStats | 16 | 0 | 16 | 0 | 0 |  |
| vehicleAcquisition | 16 | 0 | 16 | 0 | 0 |  |
| tierLists | 1 | 0 | 1 | 0 | 0 |  |
| tierRows | 6 | 0 | 6 | 0 | 0 |  |
| tierEntries | 18 | 0 | 18 | 0 | 0 |  |
| codes | 13 | 0 | 13 | 0 | 0 |  |
| newsPosts | 3 | 0 | 3 | 0 | 0 |  |
| characterMaterials | 42 | 0 | 0 | 42 | 0 | Draft material references need source verification and canonical material review before import. |

## Errors

- None

## Policy

- Character material draft rows are skipped.
- Auth, user, session, admin, Build Planner, localStorage, and personal data are not imported.
- Existing verified source status is not downgraded by lower-confidence generated data.
- Unverified data is not marked verified.
