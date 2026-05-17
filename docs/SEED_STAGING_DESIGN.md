# Seed Staging Design

Date: 2026-05-17

## Purpose

This document describes the future local seed import strategy. Phase 16 does not implement seed writes; it only designs the staging rules and adds DB-aware preview comparison.

## Import Scope

Future seed import should only include rows allowed by the seed preview plan:

- taxonomy
- media
- character core rows
- reviewed character joins/details
- weapons
- cartridges/modules
- vehicles
- tier lists
- reviewed content rows

Rows blocked by the preview plan must be skipped.

## Transaction Strategy

Local import should run inside one transaction per logical batch or one transaction for the entire seed, depending on final table count and runtime cost.

On failure:

- roll back the transaction
- write an import summary
- include failed table, row identifier, and error message
- leave the database unchanged

## Identity And Upsert Policy

Use stable public identifiers:

- `external_id` for canonical seed entities
- unique natural keys where a table has no standalone `external_id`
- join-table composite keys where appropriate

Use upsert only after review. Upsert rules must preserve the existing `source_status` policy and never rewrite reviewed data with lower-confidence generated data.

## Source Status Policy

Seed import must preserve `source_status`.

Rules:

- never upgrade `needs_verification`, `estimated`, `placeholder`, or `unknown` to `verified`
- never mark unverified source data as verified
- preserve `needs_verification` rows unless the table is blocked
- require explicit review evidence before verified status is allowed

## Blocked Data

Skip until reviewed:

- character material draft rows
- draft material catalog rows
- placeholder guides
- community links without production seed policy
- apartment items without production seed policy
- auth/user/session/admin data
- localStorage overrides

## Safety Rules

Seed import must:

- run local-only first
- require the local DB safety guard
- refuse production-looking URLs
- write a before/after table count summary
- write inserted/updated/skipped counts per table
- allow rollback on failure
- never run automatically during app startup

Production import requires separate explicit approval after local import reports are reviewed.

## Phase 16 Status

Implemented:

- DB-aware row count preview design
- local safety guard requirement
- table count comparison report
- no-write seed staging policy

## Phase 17 Status

Implemented:

- local seed import command
- dry-run default behavior
- explicit `CONFIRM_LOCAL_SEED_IMPORT=1` write gate
- single-transaction confirmed import path
- stable-key insert/update matching
- blocked draft material row skipping
- local import report artifacts

Still not implemented:

- production import
- admin review UI
- confirmed local runtime verification in this environment
