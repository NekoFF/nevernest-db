# Performance Baseline

Date: 2026-05-17

## Current Build Signal

The Vite production build currently completes, but Rollup reports a large JavaScript chunk warning. This is acceptable for the current local beta baseline, but it should be addressed before public launch.

## Bundle Splitting Plan

- Lazy-load heavier route pages such as Build Planner, character detail, weapon detail, vehicles, and admin editors.
- Split admin-only code from the default visitor path.
- Consider manual chunks for vendor libraries only after route-level lazy loading is measured.
- Keep static and API mode behavior identical after splitting.

## Image Optimization Plan

- Review image dimensions and formats under `public/assets/nte`.
- Prefer compressed WebP/AVIF where source quality allows.
- Keep transparent PNGs only where needed for UI composition.
- Add explicit dimensions or stable aspect-ratio wrappers for major media surfaces.
- Continue using `loading="lazy"` for below-the-fold card/list images.

## API Pagination Considerations

- List endpoints now expose `page`, `limit`, `count`, `total`, and `hasMore`.
- `total` is currently returned-row count, not a full database count.
- Add real total counts only when API consumers need them.
- Keep frontend list pages resilient to partial pages.

## Mobile And Tablet QA

- Verify sidebar, topbar search, filters, card grids, and detail pages on phone/tablet widths.
- Check text wrapping in chips, cards, and buttons.
- Confirm vehicle and module layouts remain usable on touch devices.

## Caching And CDN Plan

- Serve static assets through a CDN for public launch.
- Use long-lived cache headers for hashed build assets.
- Use shorter cache windows for HTML and API responses.
- Define cache invalidation for data updates.

## Low-Risk Fixes In This Phase

- Added SEO/public metadata files.
- Added an app-level error boundary.
- No risky code-splitting or layout refactor was performed.
