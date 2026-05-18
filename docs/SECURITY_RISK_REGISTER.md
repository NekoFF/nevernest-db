# Security Risk Register

Date: 2026-05-17

| Risk ID | Area | Severity | Current status | Why it matters | Mitigation | Blocks public beta | Blocks production |
| --- | --- | --- | --- | --- | --- | --- | --- |
| SEC-001 | Production auth | Critical | Disabled; local prototype only | Public accounts/admin access cannot rely on local prototype assumptions | Complete auth design, threat model, tests, and deployment review | No, if beta is read-only/no-login | Yes |
| SEC-002 | Public registration | High | Disabled | Registration introduces account abuse, privacy, moderation, and auth attack surface | Keep disabled for beta; design separately | No | Yes for account platform |
| SEC-003 | Admin writes | Critical | Codes/news local-only behind flags; no production writes | Writes can corrupt public data or expose privileged actions | Keep production writes disabled; require auth, CSRF, audit, backups, rate limits | No, if disabled | Yes |
| SEC-004 | Rate limiting | High | In-memory login/CSRF limiter only | In-memory limits reset and do not work across multiple instances | Add Redis/shared production limiter and tests | No for read-only beta | Yes |
| SEC-005 | CORS | High | Local dev origins configured with credentials | Incorrect production CORS can expose cookie-backed APIs to wrong origins | Define canonical production origins; test credentials behavior | Yes for API beta | Yes |
| SEC-006 | CSRF | High | Local prototype cookie/header strategy | Cookie-backed writes need robust CSRF strategy across production domains | Review SameSite, Secure, host policy, token rotation, and tests | No, if no writes/login | Yes |
| SEC-007 | Audit logs | High | Sanitized scaffold; no durable DB write | Admin actions need forensic trail and rollback context | Implement durable audit log rows with redaction tests | No, if no production writes | Yes |
| SEC-008 | Backups | Critical | Missing | Writes/imports without restore path can permanently damage data | Add automated backups, retention, and restore rehearsal | Yes for DB-backed beta if mutable | Yes |
| SEC-009 | Monitoring | High | Missing | Incidents, downtime, and abuse may go unnoticed | Add uptime, error-rate, latency, and alerting | Yes for public API beta | Yes |
| SEC-010 | Error tracking | Medium | Missing | Frontend/backend failures need triage without exposing secrets | Add redacted error tracking | No | Yes |
| SEC-011 | Source/image licensing | High | Needs review | Public fan-site assets and copied source data can create legal risk | Review assets, sources, attribution, disclaimer, and takedown path | Yes | Yes |
| SEC-012 | Unverified data/sourceStatus | Medium | Many rows unknown/estimated/needs_verification | Users may mistake unverified values for official data | Preserve labels, cleanup sourceStatus, avoid verified claims | No, if labeled | Yes for official-quality production |
| SEC-013 | localStorage AdminMode | High | Browser-local static editor remains | Local browser state must never grant backend authority | Keep API writes server-authorized only; do not import silently | No | Yes if conflated with auth |
| SEC-014 | Production DB safety | Critical | Local URL guard exists; production DB disabled | Accidental scripts/imports against production DB are high impact | Separate production workflow, approvals, backups, dry-run, least privilege | Yes for DB beta until policy exists | Yes |
| SEC-015 | Token/password browser storage | Critical | No tokens/passwords intentionally stored; CSRF held in memory | Browser storage tokens are easy to exfiltrate via XSS | Continue no-token localStorage policy; test/review auth code | No | Yes |
| SEC-016 | Security headers | High | Plan exists; host config missing | Missing headers increase XSS/clickjacking/content sniffing risk | Configure CSP, HSTS, frame, referrer, and content-type headers | Yes for public beta if hosting allows | Yes |
| SEC-017 | Production secrets | High | No production env configured | Mishandled secrets can expose DB/session credentials | Use host secret manager; never commit `.env` | Yes for deployment | Yes |
| SEC-018 | Broad CRUD | Critical | Not implemented | Broad write surfaces multiply validation and authorization risk | Add only endpoint-by-endpoint after security gates | No | Yes if planned |
| SEC-019 | Public beta source/copy confusion | Medium | Copy improved in Phase 161-175 | Users may confuse reference rankings, active codes, or planner outputs for official/verified data | Keep unofficial/source caveats visible; verify codes; keep Build Planner prototype-labelled | Yes if misleading copy remains | Yes |
| SEC-020 | Missing contact/takedown channel | High | Strategy documented; no real channel selected | Public fan site needs a private reporting path for legal/source/privacy concerns | Select dedicated project contact before launch | Yes | Yes |

## Current Security Decision

Public beta may proceed only as read-only and unauthenticated after deployment, legal, mobile, and security-header basics are reviewed. Production auth, registration, production admin writes, and production database mutation workflows remain blocked.
