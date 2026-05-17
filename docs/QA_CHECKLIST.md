# QA Checklist

Date: 2026-05-17

Use this checklist before public beta candidates. Do not enable API mode by default during QA.

## Static Mode

Start static mode with:

```sh
npm.cmd run dev
```

Verify:

- Home loads and category navigation works.
- Characters list loads, filters work, character detail opens and returns.
- Weapons list loads, filters work, weapon detail opens and returns.
- Modules / Cartridges list loads, filters work, cartridge detail opens and returns.
- Vehicles page loads and selector controls work.
- Tier List page loads.
- Codes page loads and search/filter behavior works.
- News page loads.
- About page loads.
- Disclaimer page loads.
- Privacy page loads.
- Contact page loads.
- Build Planner opens and existing local runtime behavior is unchanged.
- AdminMode local editing is available only in static mode and remains browser-local.

## API Mode

Start backend DB mode against a safe local seeded DB, then start the frontend with `VITE_DATA_SOURCE=api`.

Verify:

- Backend `/api/status` reports DB mode.
- Characters list loads from API mode.
- Character detail loads from API mode.
- Weapons list loads from API mode.
- Weapon detail loads from API mode.
- Modules / Cartridges list loads from API mode.
- Cartridge detail loads from API mode.
- Vehicles page loads from API mode.
- Tier List page loads from API mode.
- Codes page loads from API mode.
- News page loads from API mode.
- Loading states are readable.
- API error states show controlled retry/error UI.
- Empty states do not show raw backend stack traces or raw UUID labels.
- AdminMode editing is not exposed in API mode.

## Mobile And Tablet

Check:

- 375px mobile viewport.
- 768px tablet viewport.
- Desktop viewport.
- Sidebar open/close behavior.
- Topbar search and suggestions.
- Cards and grids do not overflow.
- Detail pages keep media/text readable.
- Filters wrap and scroll cleanly.
- Buttons and chips do not overlap.

## Smoke Commands

```sh
npm.cmd run build
npm.cmd run smoke:static
npm.cmd run server:test
```

With a DB-mode backend running:

```sh
npm.cmd run smoke:api-mode
```
