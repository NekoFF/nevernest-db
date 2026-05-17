# Phase 1 Stabilization

Date: 2026-05-16

Scope: production-readiness preparation for the current frontend while preserving the existing visual design. This phase did not redesign the website, add full art support, migrate to SQL, add real authentication, remove localStorage, or rewrite the app.

## Summary of Changes

- Added real character detail routes at `/characters/:idOrSlug`.
- Added a lightweight repository/data access layer for future API/SQL migration.
- Added shared entity id/slug helpers.
- Added a media registry foundation while keeping existing asset helpers backward-compatible.
- Added safe storage helpers and moved low-risk localStorage use to those helpers.
- Added inactive auth/account scaffolding with explicit comments that real auth must be backend-based.
- Added lightweight SEO metadata support for major SPA routes.
- Added reusable `EmptyState` and `NotFoundState` components.
- Improved invalid character/weapon/cartridge/module not-found states without changing detail layouts.
- Verified `npm.cmd run build` passes.

## Files Changed

### Routing and App Shell

- `src/App.jsx`
  - Parses `/characters/:idOrSlug`.
  - Opens character cards/search results through `/characters/<slug-or-id>`.
  - Restores character detail state on refresh/deep link.
  - Uses repository lookup to resolve route params against merged admin data.

- `src/main.jsx`
  - Wraps the app in inactive `AuthProvider`.

### Repository/Data Access Helpers

- `src/repositories/charactersRepository.js`
- `src/repositories/weaponsRepository.js`
- `src/repositories/cartridgesRepository.js`
- `src/repositories/vehiclesRepository.js`
- `src/repositories/tierListRepository.js`
- `src/repositories/codesRepository.js`
- `src/repositories/newsRepository.js`
- `src/repositories/index.js`

These are intentionally thin wrappers. They accept source data as arguments so the same call shape can later receive API/SQL data instead of static JS/admin-merged arrays.

### Identity Helpers

- `src/utils/entityIdentity.js`
  - `normalizeId(value)`
  - `slugifyEntityName(value)`
  - `getEntitySlug(entity)`
  - `matchesEntityIdOrSlug(entity, idOrSlug)`

Important note: stable entity ids should remain future SQL/API external keys. Slugs are route/display helpers and should not replace existing ids.

### Media Registry Foundation

- `src/data/mediaRegistry.js`
  - Adds local seed media records for character avatars, weapon images, cartridge/module images, vehicle images, and misc icons.
  - Uses records shaped like `{ id, entityType, entityId, kind, path, alt, status }`.

- `src/utils/assetHelpers.js`
  - Existing public API continues to work.
  - Registry lookup is preferred where safe, with old name/alias lookup preserved as fallback.
  - No full art support was added in this phase.

### Safe Storage

- `src/utils/safeStorage.js`
  - Safe string read/write/remove helpers.
  - JSON read/write helpers with parse-error handling.
  - Legacy-key read support.
  - Versioned payload helpers for future migrations.

Low-risk storage updated:

- `src/pages/BuildPlannerPage.jsx`
  - Planner drafts still use `nte.admin.plannerDrafts`.
  - Legacy `nte-build-planner-drafts` still migrates/read-falls back.

- `src/pages/TierListPage.jsx`
  - Personal tier list and presets still use existing keys:
    - `nte-personal-tier-list`
    - `nte-personal-tier-list-presets`

Admin storage remains compatible and was not heavily refactored in this phase.

### Auth/Account Preparation

- `src/auth/authModel.js`
  - Defines future role/permission/session model comments/constants.
  - Explicitly states real auth must be backend-based.

- `src/auth/AuthContext.jsx`
  - Inactive default unauthenticated context.
  - No fake registration.
  - No fake password storage.
  - No security-sensitive fake auth.

- `src/components/Topbar.jsx`
  - Adds non-functional account menu placeholders:
    - `Sign in later`
    - `Saved Builds later`
    - `Profile later`

### SEO Foundation

- `src/utils/seo.js`
  - Sets `document.title`.
  - Sets/updates meta description.
  - Prepares basic OpenGraph fields.

- `src/components/Seo.jsx`
  - Tiny React component wrapper for route/page use.

Pages using SEO now:

- `src/pages/HomePage.jsx`
- `src/pages/CharactersPage.jsx`
- `src/pages/CharacterDetailPage.jsx`
- `src/pages/WeaponsPage.jsx`
- `src/pages/WeaponDetailPage.jsx`
- `src/pages/ModulesPage.jsx`
- `src/pages/CartridgeDetailPage.jsx`
- `src/pages/ModuleDetailPage.jsx`
- `src/pages/VehiclesPage.jsx`
- `src/pages/BuildPlannerPage.jsx`
- `src/pages/TierListPage.jsx`
- `src/pages/CodesPage.jsx`
- `src/pages/NewsPage.jsx`

### Empty and Not Found States

- `src/components/ui/EmptyState.jsx`
- `src/components/ui/NotFoundState.jsx`

Used in low-risk places:

- Invalid character route.
- Invalid weapon route.
- Invalid cartridge route.
- Invalid module route.
- Empty Characters/Weapons/Modules/Vehicles/Codes/News filtered states.

## New Route Behavior

### Character Detail

Confirmed implemented behavior:

- `/characters/nanally` opens Nanally directly on refresh.
- `/characters/<character-id>` attempts to resolve against current merged character data.
- Matching accepts:
  - `id`
  - `slug`
  - slugified `name`
- Opening a character from the grid/search now pushes `/characters/<slug-or-id>`.
- Browser back/forward works through the existing custom `popstate` handler.
- Invalid character routes render a clean not-found state inside the existing layout.

The character detail visual design, tabs, and admin edit buttons were preserved.

## What Still Remains Before SQL Migration

- Convert static JS seed data into canonical JSON-safe data or a generated source format.
- Define complete schemas for characters, weapons, cartridges, modules, vehicles, codes, news, tier lists, and build drafts.
- Remove legacy name-based write paths after migration tooling exists.
- Add backend/API repository implementations behind the new repository function shapes.
- Move admin overrides from localStorage to authenticated backend records.
- Move Build Planner drafts from localStorage to user-owned backend drafts.
- Normalize media into real `media_assets` records with source/license/dimensions.
- Add server-side auth, roles, permissions, and admin audit logs.
- Add sitemap, robots.txt, route-specific OpenGraph image generation, and production legal/fan-site disclaimer.

## Risks and TODOs

- The app still uses a custom router. It is stable enough for this phase, but future nested route growth may justify a routing library after the backend plan is clearer.
- Character detail now has deep links, but other entity details should eventually use the same repository helpers consistently.
- The media registry is a foundation only. Some legacy aliases are still needed, and full art was intentionally not touched.
- `assetHelpers.js` still contains hardcoded asset file lists. Later production work should replace this with generated registry data or backend media records.
- Admin storage is still localStorage-only. This is useful for the current frontend but not production-secure.
- Build Planner Awakening/Abilities tabs remain placeholder/incomplete.
- Vite reports a large JS chunk after build. This existed before and should be handled later with code splitting/manual chunks.

## Build Verification

Command:

```powershell
npm.cmd run build
```

Result: passed.

Build warning:

- Vite reports that the main JS chunk is larger than 500 kB after minification.
- Recommended later fix: route/page-level dynamic imports or Rollup manual chunks.

