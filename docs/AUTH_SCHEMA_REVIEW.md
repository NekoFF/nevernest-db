# Auth Schema Review

Date: 2026-05-17

## Files Reviewed

- `server/src/db/schema/usersAuth.ts`
- `server/src/db/schema/index.ts`
- `db/schema.draft.sql`

No migrations were run and no schema was changed in this phase.

## Drizzle Schema Mirror

The current Drizzle mirror includes:

- `users`
- `auth_accounts`
- `auth_roles`
- `user_roles`
- `sessions`
- `admin_logs`

The Drizzle mirror is enough for a future local-only prototype of:

- user identity records
- local password credential records
- server-side role assignment
- server-side session token hash lookup
- admin audit logging

## Draft SQL Schema

The draft SQL also includes `auth_accounts`, with:

- `user_id`
- `provider`
- `provider_account_id`
- `email`
- `password_hash`
- `metadata`
- unique provider account constraint

This is the right shape for future password credentials and OAuth/provider account linking, and Phase 44-46 now mirrors it in `server/src/db/schema/usersAuth.ts`.

## Session Token Hash

The `sessions` table already has `session_token_hash`, `expires_at`, and `created_at`.

Missing later-session fields to consider:

- `revoked_at`
- `rotated_at`
- `last_seen_at`
- `ip_address`
- `user_agent`
- optional device/client metadata

These are not required for the current disabled scaffold.

## Provider Accounts

Provider account storage now exists in both `db/schema.draft.sql` and the Drizzle schema mirror. The local auth prototype stores password credentials through `auth_accounts` with provider `password`.

## Roles And Permissions

`auth_roles.permissions` is currently JSONB. This is flexible enough for the initial prototype. If permissions become heavily queried, a normalized permission table can be considered later.

## Admin Logs

`admin_logs` is a reasonable starting point. It captures:

- admin user id
- entity type
- entity id or external id
- action
- before/after JSON
- IP address
- user agent
- timestamp

Future additions to consider:

- request id
- reason/comment
- source status before/after
- route/method
- result status

## Needed Later Migrations

Before hardening local auth toward production:

- Add session revocation and last-seen metadata if needed.
- Add indexes for session expiry cleanup and admin log review if query volume grows.
- Add explicit seed/bootstrap policy for the first local admin user.
