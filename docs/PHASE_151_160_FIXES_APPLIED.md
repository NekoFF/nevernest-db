# Phase 151-160 Fixes Applied

Date: 2026-05-18

| File | Issue fixed | Before | After | Why low-risk | Manual verification |
| --- | --- | --- | --- | --- | --- |
| `scripts/check-api-client.mjs` | Module piece API smoke could report only the default first page. | Checked `/api/modules/pieces`, which defaults to 24 rows. | Checks `/api/modules/pieces?limit=100`, matching frontend API-mode repository behavior for full seeded module coverage. | Script-only change; no runtime app behavior, schema, auth, or endpoint change. | Confirmed static/import/seed counts are 36 and inspected frontend repository limit. |
| `server/tests/frontend/apiModuleMapper.test.ts` | No focused regression test for API module mapper shape/rarity preservation. | Mapper behavior was covered indirectly only. | Added test asserting DB `moduleShape.externalId` maps to UI `shapeId` and rarity label remains `S`. | Test-only coverage; no production code path changed. | `npx tsx --test server/tests/frontend/apiModuleMapper.test.ts` passed. |

No data values were invented or mass-filled. No backend mutation endpoint, production auth, DB schema, or admin behavior changed.
