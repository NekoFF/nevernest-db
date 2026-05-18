# Codes Source/Expiry Review

Date: 2026-05-18

## Current Counts

| Status | Count |
| --- | ---: |
| active | 7 |
| expired | 6 |
| unknown | 0 |
| total | 13 |

## Findings

| Area | Result |
| --- | --- |
| Source labels | No static code has `sourceLabel`. |
| Source URLs | No static code has source URL data. |
| Expiry dates | No static code has `endDate`/expiry date data. |
| Reward text | Present for all 13, but several are broad labels such as `Materials`, `Coins`, or `Coins + ?`. |
| Status | Active/expired is manually encoded in static data. |
| API sourceStatus | Import maps codes without dates as `needs_verification`. |
| Local admin write QA | Existing local-only code update/restore flow remains scoped to codes/news behind explicit local flags. |

## Risk

Stale codes can look active because active/expired status is not derived from a trusted expiry date or source URL. This phase did not invent expiry dates or change code statuses.

The code card already shows SourceStatus when API data includes it. Static mode currently has no sourceStatus values for codes.

## Before Public Beta

- Verify every active code against current redemption behavior or trusted source evidence.
- Add source URL/label where available.
- Add expiry date only when known from evidence.
- Keep missing expiry as missing, not guessed.
- Review vague rewards and replace only when a source confirms exact rewards.
- Decide whether `needs_verification` should be shown for static codes or only API/imported code data.

## Update Workflow

1. Add or update code status from trusted evidence.
2. Record `sourceUrl`, `sourceLabel`, and notes.
3. Record `endDate` only when known.
4. Keep status `unknown` or `needs_verification` if evidence is insufficient.
5. Run static and API smoke checks after local-only code write QA.

No code data was changed in this phase.
