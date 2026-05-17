# Phase 59-61 Reviewer Handoff

### Copy for reviewer
> **Phase 59-61 Status: COMPLETE & VERIFIED**
> - Implemented second real admin write: `PATCH /api/admin/news/:slug`.
> - Gated by safety flag: `ENABLE_LOCAL_ADMIN_WRITES=1`.
> - Full security pipeline: CSRF -> Auth -> Permission (`news/write`) -> Validation -> Audit.
> - Verified with comprehensive mock tests.
> - Audit: Sanitized logs recorded for all successful news updates.
> - Safety: Broad CRUD, characters/weapons writes, and production auth remain disabled.

## Changed Files
- `server/src/schemas/adminWrites.ts`: Added `newsUpdateSchema`.
- `server/src/contracts/adminWrites.ts`: Added `NewsUpdateRequest` type.
- `server/src/repositories/ContentRepository.ts`: Added `update` signature to news.
- `server/src/repositories/db/DbContentRepository.ts`: Implemented `update` for news.
- `server/src/repositories/mock/MockContentRepository.ts`: Implemented `update` for mock news.
- `server/src/services/ContentService.ts`: Added `updateNews` method.
- `server/src/routes/admin.ts`: Implemented `PATCH /api/admin/news/:slug`.
- `server/tests/routes/authRoutes.test.ts`: Added exhaustive tests for the new endpoint.

## Commands Run & Results
| Command | Result |
|---------|--------|
| `npm.cmd run server:check` | PASS |
| `npm.cmd run server:build` | PASS |
| `npm.cmd run server:test` | PASS (113 tests) |
| `npm.cmd run build` | PASS |
| `npm.cmd run smoke:static` | PASS |

## Admin News Write Behavior
| Scenario | Status | Response |
|----------|--------|----------|
| Flag `ENABLE_LOCAL_ADMIN_WRITES` missing | 501 | `not_implemented` |
| Missing/Invalid CSRF | 403 | `csrf_error` |
| No Session | 401 | `unauthorized` |
| Missing `news/write` permission | 403 | `forbidden` |
| Empty Body | 400 | `validation_error` |
| Valid Admin + CSRF + Permission | 200 | Updated News DTO |

## Safety & Infrastructure
- **Audit:** Records action `update`, entity `news`, and sanitizes sensitive fields.
- **Validation:** Strict Valibot schema for news. Disallows ID/Slug mutations.
- **DB Schema:** No changes made.
- **Public Auth:** Remains disabled.
- **Static Mode:** Remains default.

## Remaining Risks / TODOs
- New administrative routes must continue to follow the established guard pattern.
- Audit logs remain fire-and-forget in the current scaffold.
