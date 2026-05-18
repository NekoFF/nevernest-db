# Phase 161-175 Public Beta Security Gate

Date: 2026-05-18

## Safe Beta Conditions

- Static/localStorage frontend remains default.
- API mode remains opt-in.
- Public beta is read-only and unauthenticated.
- Production auth remains disabled.
- Public registration remains disabled.
- Production admin writes remain disabled.
- `/dev/admin` remains hidden/disabled unless local dev flag is enabled.
- Browser-local AdminMode is not authorization.
- No tokens, cookies, CSRF tokens, or passwords are stored in localStorage/sessionStorage/IndexedDB.
- No production DB connection or mutation workflow is configured.

## Review

| Area | Status | Beta impact |
| --- | --- | --- |
| Auth | Disabled by default; local prototype only | Safe if no public login. |
| Registration | Disabled | Safe. |
| Admin writes | Local code/news QA only behind flags | Safe if production flags absent. |
| `/dev/admin` | Dev/local route only | Must stay hidden/disabled in production UI. |
| API mode | Opt-in | Safe for static beta; API beta needs host/CORS review. |
| localStorage AdminMode | Browser-local | Safe only as local draft tooling. |
| Token storage | Policy forbids browser storage tokens | Must keep. |
| CORS | Local defaults only | Blocks public API beta until production origins chosen. |
| Security headers | Host config missing | Blocks public deployment until configured. |
| Monitoring/backups | Missing | Blocks production platform; static beta can proceed with rollback plan. |
| Production DB | Disabled | Safe for static beta. |
| Rate limiting | Local/in-memory only | Blocks production auth/write surfaces. |

## Blocks Public Beta

- No SPA fallback/HTTPS/security headers on chosen host.
- Legal/source/image review unresolved.
- Mobile route sweep finds blocking defects.
- `/dev/admin` or admin controls are publicly exposed.
- Public copy implies official affiliation.

## Blocks Production

- Production auth/session threat model missing.
- Production DB backups/restore missing.
- Durable audit logs missing.
- Shared rate limiting missing.
- Monitoring/error tracking missing.
- Production CORS policy missing.
- Source provenance review/publish workflow missing.

## Decision

Proceed only toward static read-only beta preparation. Do not enable production API writes, production auth, accounts, or production DB mutations.
