# Phase 316-335 Codes Confidence Review

Date: 2026-05-19

## Reviewed

- `src/pages/CodesPage.jsx`
- `src/data/codes.js`
- prior code confidence docs

## Result

Codes are useful for private preview but not verified enough for uncaveated public beta claims.

## Findings

- Current active/expired statuses remain in place.
- No expiry dates or source URLs were invented.
- Rewards remain broad summaries; exact reward details are not expanded.
- Copy buttons are public and read-only.
- Admin edit/delete/add controls remain hidden unless browser-local AdminMode is enabled in static mode.
- `sourceStatus` now normalizes to `needs_verification` when a code has no stronger recorded status, allowing existing confidence badges to render.

## Fix Applied

`src/pages/CodesPage.jsx` now states that active labels reflect the local list rather than a live redemption check and recommends manual redemption/source checking before public launch.

## Public Beta Gate

Manual redemption/source review is required before public beta. If not completed, active codes may remain visible only with clear source/expiry caveats.

