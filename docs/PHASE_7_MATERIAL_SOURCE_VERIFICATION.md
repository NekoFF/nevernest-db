# Phase 7 Material Source Verification

Date: 2026-05-16

## What Changed

- Expanded `src/data/materialCatalogDraft.js` into a reviewed draft catalog for the seven Phase 7 material candidates.
- Added `src/data/materialAliases.js` for preserving observed labels and resolving short names such as `CO` and `FNG`.
- Added `src/data/sourceVerification.js` with reusable verification fields and allowed evidence types.
- Updated `scripts/import-dry-run/mapMaterialsDraft.mjs` to use character material payloads instead of regex scanning.
- Updated dry-run generated artifacts with material candidates, usage rows, and unresolved labels.
- Added review docs for material catalog and source verification policy.

## Material Catalog Status

The catalog is draft-only. No candidate is verified.

Material candidates: 7

Material usage rows: 28

Unresolved labels: 3

Unresolved labels:

- `Beetle Coin`
- `Dreamless Seed`
- `Fons`

## Source Verification Model

`src/data/sourceVerification.js` defines:

- reusable verification fields
- allowed evidence types
- allowed source status values

This is not wired into the UI or backend yet.

## Remaining Blockers

- Material identities, categories, rarities, and acquisition sources need trusted-source verification.
- `CO` and `FNG` may be abbreviations and need official full-name review.
- Currency-like labels need a cataloging decision before import.
- Cartridge compatible shapes remain `needs_verification`.
- Character stats remain `estimated` unless directly verified.

## Backend Scaffold Readiness

A backend scaffold can start next if it stays schema/API-only and does not run migrations or import production data yet.

The source verification and material draft files provide enough shape for backend planning, but not enough verified data for production seeding.

## Recommended Next Phase

Phase 8 should scaffold backend boundaries without connecting a production database:

- define API/data-access contracts
- add local validation schemas around import payloads
- create no-op seed/import command shells
- keep PostgreSQL writes and migrations disabled until explicitly approved
