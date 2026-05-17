# Phase 10 Backend Route Contract Tests

Date: 2026-05-16

## What Changed

Phase 10 added a backend-only contract test layer with mock read adapters. The backend can now exercise routes, validation, response envelopes, services, and repository boundaries without PostgreSQL.

## Test Setup

The project uses Node's built-in test runner through `tsx`.

Scripts added:

- `npm.cmd run server:test`
- `npm.cmd run server:test:watch`

No frontend test/build scripts were changed.

## Mock Read Adapters

Mock repositories live in `server/src/repositories/mock/`.

They cover:

- characters
- weapons
- cartridges
- modules
- vehicles
- tier lists
- content
- media

The mocks use tiny in-memory fixtures from `server/tests/fixtures/`. They do not import frontend seed data, React components, or browser APIs.

## Coverage Summary

Route tests:

- `GET /health` response shape
- `GET /api/status` response shape
- valid unimplemented route returns stable `501`
- invalid query params return validation errors
- invalid `idOrSlug` does not leak stack traces

Service tests:

- services call repository methods
- valid ids/slugs return fixture data
- invalid ids/slugs throw `NotFoundError`
- missing repository behavior remains controlled via `NotImplementedError`

Validation tests:

- `idOrSlug`
- pagination query
- search query
- filter query
- source/publication status validation

Response helper tests:

- `ok`
- `notImplemented`
- `error`
- domain error conversion

## Intentionally Not Tested Yet

- real PostgreSQL queries
- migrations
- admin mutations
- real authentication
- frontend API integration
- Build Planner persistence
- production seed imports

## Why No Database Is Required

The goal is contract safety before persistence. Mock repositories verify backend boundaries while the Drizzle schema mirror and database client remain disconnected.

## Recommended Phase 11

Phase 11 should add route dependency injection and optional mock-backed read endpoints for local backend previews, still behind explicit test/dev mode and still not connected to PostgreSQL.
