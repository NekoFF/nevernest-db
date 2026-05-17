# Phase 62-64: Shared Admin Mutation Pipeline

Date: 2026-05-17

This phase focused on refactoring the administrative mutation safety flow into a shared, reusable pipeline to ensure consistent behavior across all current and future admin writes.

## Shared Mutation Pipeline
I implemented a unified pipeline in `server/src/plugins/adminMutationPipeline.ts` that coordinates the entire security and execution flow for administrative mutations.

### Pipeline Execution Order
1.  **Safety Flag Check**: Verifies `ENABLE_LOCAL_ADMIN_WRITES=1`.
2.  **CSRF Validation**: Compares `nte_csrf` cookie with `X-CSRF-Token` header.
3.  **Authentication**: Validates the administrative session.
4.  **Authorization**: Enforces the specific permission required for the route.
5.  **Service Check**: Ensures the backend service container is available.
6.  **Input Validation**: Validates the request body against the provided Valibot schema.
7.  **Mutation Execution**: Runs the provided handler to perform the DB update.
8.  **Audit Logging**: Records the action only after a successful mutation, with automatic sensitive data redaction.

## Refactored Routes
The following routes were refactored to use the shared pipeline:
- `PATCH /api/admin/codes/:idOrSlug` (requires `codes/write`)
- `PATCH /api/admin/news/:slug` (requires `news/write`)

## Architectural Improvements
- **Isolation**: Administrative routes are now fully isolated in `server/src/routes/admin.ts`.
- **Consistency**: All mutations now share the same error responses, logging behavior, and security checks.
- **Safety**: The pipeline ensures that no database writes or audit logs occur if any security or validation check fails.

## Verified Behavior
Extensive integration tests confirm that:
- Previous success and failure behaviors are preserved for both Codes and News.
- CSRF and Permission checks are correctly enforced by the pipeline.
- Audit logs are triggered only on success.
- Sensitive data redaction remains active.
- Missing `ENABLE_LOCAL_ADMIN_WRITES` correctly disables all mutations.

## What Remains Intentionally Disabled
- Broad Admin CRUD.
- Characters, Weapons, Modules, Vehicles, and Guides writes.
- Public registration and production authentication.
- API mode as default.
