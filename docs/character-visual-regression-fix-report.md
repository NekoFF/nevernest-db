# Character Visual Regression Fix Report

## 1. Files Changed

- `src/components/CharacterPortrait.jsx`
- `src/components/CharacterCard.jsx`
- `src/components/CharacterHero.jsx`
- `src/components/TeamSection.jsx`
- `src/components/ConsoleTab.jsx`
- `src/components/cartridges/CartridgeIcon.jsx`
- `src/components/weapons/weaponStyle.js`
- `src/admin/ConsoleInfoEditor.jsx`
- `src/pages/CharacterDetailPage.jsx`
- `src/index.css`
- `docs/character-visual-regression-fix-report.md`

## 2. Root Cause Of Missing Avatars

The shared portrait refactor used nested absolute layers. In several contexts the image layer could collapse or sit behind fallback/overlay treatment, causing valid character image paths to appear as empty gradient placeholders.

## 3. Image Fields / Components Fixed

`CharacterPortrait` now renders the actual image directly inside the portrait frame and only falls back to a gradient if no image exists or the image fails to load. It uses existing resolved fields:

- local asset from `getCharacterAsset(character.name)`
- `portraitImageUrl`
- character `portrait` gradient only as fallback

The fixed portrait component is used by character list cards, the detail header, recommended teams, and synergy avatars.

## 4. Duplicate Chip Cleanup

Character list image overlays no longer show rarity/element chips. The card body owns one clean identity row: rarity, element, arc type. Role chips render separately.

Character detail keeps S-Rank / element / arc near the name and shows only role chips under the portrait.

## 5. Rarity Chip Redesign

S-Rank now uses a soft glass-gold capsule treatment rather than flat orange text. The shared weapon/build rarity style was also softened so S-rank chips feel more premium and consistent.

## 6. Console Weapon/Cartridge Entity Linking

Console display resolves cartridge and weapon/arc records from merged database data by id/slug/name where possible. Display now shows:

- cartridge icon + name
- weapon/arc image + name
- clean fallback only if the entity image is truly missing

`CartridgeIcon` now normalizes rarity strings before asset lookup, so values like `S > A > B` no longer break Fireflies and the Forest icon resolution.

## 7. Cartridge Admin Picker Improvement

`ConsoleInfoEditor` now uses an icon-based searchable cartridge picker instead of a plain select. Selecting a cartridge stores `mainCartridgeId`, updates the display name, clears manual bonuses, and reapplies compatible pieces from the selected cartridge entity.

## 8. Build Show-More Behavior

The existing top-2 default plus `Show more weapons` / `Show more cartridges` behavior remains intact. Weapon and cartridge recommendation rows continue to render entity icons/images.

## 9. Teams Avatar/Capsule Improvements

Recommended teams and synergy cards use restored character portraits. Team member cards now include proper element icon badges instead of tiny colored dots, while keeping the connected soft glass team capsule layout.

## 10. Materials Source/Debug Cleanup

Public Materials rendering still filters document/source/debug labels. Scan-sensitive strings remain only in admin-only notes or the internal filter regex, not public display paths.

## 11. Element Accent System Notes

The pass continues using existing element metadata and `getElementAccent`-style color flow for character detail accents, level slider color, materials glow, build accents, and team/icon treatments. No Nanally-only element styling was added.

## 12. Build Result

`npm.cmd run build` passed.

Preview smoke check:

- `/characters` returned `200`
- `/build-planner` returned `200`

Vite still reports the existing large chunk warning, but the production build completes successfully.
