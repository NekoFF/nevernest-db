# Source Verification Plan

Date: 2026-05-16

## Purpose

This plan defines how current draft seed data should be reviewed before any future SQL import marks rows as verified. It does not create a backend, connect a database, or change UI behavior.

## Verification Shape

Future reviewed data should use the reusable model in `src/data/sourceVerification.js`:

- `sourceStatus`
- `sourceUrl`
- `sourceNote`
- `evidenceType`
- `verifiedAt`
- `verifiedBy`

Allowed evidence types:

- `official_site`
- `official_social`
- `in_game_screenshot`
- `wiki_reference`
- `community_spreadsheet`
- `manual_entry`
- `unknown`

## Trusted Sources

Strongest sources:

- Official NTE site, patch notes, announcements, or published databases.
- Official social posts when they clearly identify the item, stat, code, or release detail.
- In-game screenshots captured from the relevant version and reviewed by a maintainer.

Secondary sources:

- Maintained wikis with visible citations.
- Community spreadsheets with source notes and reviewer history.

Do not mark rows `verified` from unsourced Discord messages, guesses, OCR-only extraction, placeholder local data, or copied UI labels without evidence.

## Cartridge Compatible Shapes

Current policy remains unchanged: cartridge compatible shape rows stay `needs_verification`.

Review checklist:

- Confirm the cartridge set and rarity.
- Confirm each slot's compatible module shape from an official or in-game source.
- Record evidence type and URL or screenshot reference.
- Keep uncertainty at row level; do not verify the whole cartridge set because one slot was confirmed.

## Character Stats

Current character stat rows are `estimated` unless source data explicitly says otherwise.

Review checklist:

- Confirm character id, level, stat key, and value from an in-game screenshot or official reference.
- Record whether the value is base, modified, interpolated, or affected by gear/build.
- Do not mix level 80 and level 90 references without source notes.
- Keep interpolated rows `estimated`.

## Materials

Current material catalog and usage rows are draft-only.

Review checklist:

- Confirm official material name and spelling.
- Resolve abbreviations such as `CO` and `FNG`.
- Confirm rarity, category, and acquisition sources.
- Confirm whether currencies such as `Fons` and `Beetle Coin` belong in the same material catalog or a separate currency catalog.
- Link character/skill usage only after material identity is confirmed.

## Codes And News

Codes:

- Verify code text, reward, start/end date, region, and redemption status.
- Expired or unknown-window codes should stay `needs_verification`.

News:

- Placeholder/internal posts should stay `placeholder`.
- Real posts need source URL, publication date, and source type.

## Future Admin Review Workflow

Recommended future workflow:

- Add review fields to admin/backend models after the backend scaffold exists.
- Require reviewer identity and timestamp for `verified`.
- Store evidence URL or asset reference for screenshots.
- Preserve previous values in audit logs when a verified row changes.
- Keep localStorage Admin Mode overrides out of production imports until an explicit reviewed export exists.
