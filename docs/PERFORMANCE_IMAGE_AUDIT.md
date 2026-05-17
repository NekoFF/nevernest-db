# Performance Image Audit

Date: 2026-05-17

## Current Build Output

Latest observed `npm.cmd run build` before this phase showed:

- Main `index` chunk: about 484.75 kB.
- `CharacterDetailPage`: about 209.22 kB.
- `BuildPlannerPage`: about 122.23 kB.
- CSS: about 163.62 kB.

The app already uses route-level lazy loading for major pages, which is the right first layer. The biggest remaining risks are the shared app shell bundle, dense detail pages, Build Planner, and image-heavy views.

## Route Lazy Loading

Current lazy-loaded pages include home, characters, character detail, weapons, weapon detail, modules, cartridge detail, module detail, codes, tier list, vehicles, news, guides, Build Planner, legal/info, and Dev Admin.

Potential later improvements:

- Split admin/editor code further from default visitor paths.
- Split Build Planner sub-tabs if the chunk keeps growing.
- Consider manual vendor chunks only after measuring cache behavior.

## Image Loading Behavior

Existing good patterns:

- Many card/list images already use `loading="lazy"`.
- Asset wrappers generally use fixed dimensions or aspect-ratio-like containers.
- Images use `object-contain` for game assets to avoid distortion.

Applied this phase:

- Added `decoding="async"` to character portrait images.
- Added `decoding="async"` to topbar suggestion thumbnails.
- Added lazy/async hints to vehicle showcase/reflection images.
- Added async decoding to optional hero image.

## High-Risk Image Areas

| Area | Risk | Recommendation |
| --- | --- | --- |
| Character detail/full art | Large detail chunk and rich sections | Audit image dimensions and defer non-critical art |
| Vehicle showcase | Large PNG assets and animated stage | Keep stable wrappers; consider mobile-specific dimensions later |
| Modules/cartridges | Many transparent PNG assets | Verify dimensions and compression |
| Build Planner | Many icons/assets plus large logic chunk | Split sub-tabs later after formula audit |
| Home hero | Optional custom image can be large | Add guidance for image dimensions before public admin workflow |

## CDN/Cache Future Plan

- Serve hashed build assets with long-lived immutable cache.
- Serve `index.html` with short cache.
- Use CDN for `/assets/nte` public media.
- Consider WebP/AVIF variants for heavy non-transparent assets.
- Keep transparent PNG where UI composition needs alpha.
- Define asset invalidation policy before production admin/media manager.

## Performance Budget Proposal

Before public beta:

- Main JS chunk target: under 500 kB uncompressed, then reduce if practical.
- Route chunk target: under 250 kB uncompressed for public pages.
- Largest above-the-fold image: documented and intentionally loaded.
- Mobile route interaction: no obvious layout shift or delayed tap response.

After beta:

- Add bundle analyzer.
- Track Lighthouse/mobile performance in CI or release checklist.
- Create image dimension/format inventory.

## Deferred Work

- No asset pipeline rewrite.
- No mass image conversion.
- No Build Planner chunk splitting.
- No manual Rollup chunk tuning.

These should be measured and planned after mobile QA and formula inventory.
