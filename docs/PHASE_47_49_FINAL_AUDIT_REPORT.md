# Phase 47-49 Final Audit Report

Date: 2026-05-17
Verdict: **COMPLETE**

## 1. Executive Summary
Phase 47-49 has been successfully repaired and verified. The primary build blocker (missing API response helpers) was resolved in the smallest safe way, and all verification suites (build, test, audit, smoke) now pass. Admin guard, CSRF, and audit scaffolds are correctly implemented and behave as expected without enabling production writes or registration.

## 2. What Was Broken
- **Build Error:** `server/src/plugins/adminGuard.ts` was importing `forbidden` and `unauthorized` from `../utils/apiResponse.js`, but these helpers were not exported from `server/src/utils/apiResponse.ts`.
- **Test Failure:** `server/tests/routes/authRoutes.test.ts` was failing on the CSRF scaffold test because it triggered a `DATABASE_URL` check in `buildApp()` without a fake auth service provided.

## 3. What Was Fixed
- **API Helpers:** Added exported `unauthorized` (401) and `forbidden` (403) helpers to [apiResponse.ts](file:///h:/Cursor/NevernestDB/nevernest-db/server/src/utils/apiResponse.ts). They use the project's stable `ApiErrorResponse` shape.
- **Verification Tests:** Added unit tests for the new helpers in [apiResponse.test.ts](file:///h:/Cursor/NevernestDB/nevernest-db/server/tests/utils/apiResponse.test.ts).
- **Test Environment Fix:** Updated [authRoutes.test.ts](file:///h:/Cursor/NevernestDB/nevernest-db/server/tests/routes/authRoutes.test.ts) to provide a `FakeAuthService` during the CSRF scaffold check, bypassing the local DB safety check.

## 4. Admin Guard Behavior
The representative skeleton routes `POST /api/admin/characters` and `PATCH /api/admin/characters/:id` behave as follows:
- **No session:** `401 Unauthorized` (Verified by test)
- **Valid session, missing permission:** `403 Forbidden` (Verified by test)
- **Valid session, correct permission:** `501 Not Implemented` (Verified by test)
- **Side effects:** No database writes occur.

## 5. Permission Constants Status
Stable permission constants are verified in [permissions.ts](file:///h:/Cursor/NevernestDB/nevernest-db/server/src/auth/permissions.ts):
- `content/read`, `content/write`, `content/publish`
- `characters/write`, `weapons/write`, `modules/write`, `vehicles/write`, `codes/write`, `news/write`
- `users/manage`
- `admin/audit/read`

*Legacy `manage:content` has been removed from active guard logic.*

## 6. CSRF & Audit Scaffold Status
- **CSRF Scaffold:** `GET /api/auth/csrf` is active only when `ENABLE_LOCAL_AUTH=1`. It returns a dummy token (`csrf-scaffold-token-not-validated-yet`) and does not affect GET endpoints.
- **Audit Scaffold:** `AdminAuditService.ts` provides the `logAction` signature and `formatMetadata` helper. It is not called by skeleton routes yet, preserving the "no writes" policy.

## 7. Command Results
| Command | Result |
|---------|--------|
| `npm.cmd run server:check` | **PASS** |
| `npm.cmd run server:build` | **PASS** |
| `npm.cmd run server:test` | **PASS** (102 tests, 97 pass, 5 skipped) |
| `npm.cmd run build` | **PASS** |
| `npm.cmd run audit:data` | **PASS** |
| `npm.cmd run import:dry-run` | **PASS** |
| `npm.cmd run server:seed:preview` | **PASS** |
| `npm.cmd run smoke:static` | **PASS** |

## 8. Remaining Intentionally Disabled Features
- Public registration and production authentication.
- Real admin content CRUD/writes.
- Persistent sessions and user accounts.
- API mode as default (Static/localStorage remains primary).
- Production database connection.

## 9. Known Risks & Follow-ups
- **CSRF Validation:** Full token validation on unsafe methods is deferred.
- **Audit Integration:** Real logging will be wired once mutations are enabled.
- **Database Dependency:** Some local auth tests still require a DB URL unless a fake service is provided.
