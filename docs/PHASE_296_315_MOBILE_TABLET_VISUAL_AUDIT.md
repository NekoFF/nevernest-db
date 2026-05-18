# Phase 296-315 Mobile / Tablet / Visual Audit

## Scope

Viewport assumptions: 375px phone, 430px large phone, 768px tablet portrait, 1024px tablet/laptop, desktop.

This was a practical code/layout audit, not a real-device screenshot pass. Public beta still needs screenshots on a deployed preview URL.

## Route Audit

| Route | Mobile Risk | Tablet Risk | Desktop Risk | Issue Found | Decision | Reason |
| --- | --- | --- | --- | --- | --- | --- |
| `/` | medium | low | low | Hero media panel was tall on 375px and community count looked like real data. | fix now | Launch first screen should be compact and honest. |
| `/characters` | low | low | low | Filters wrap and mini filters already scroll. | defer | No concrete overflow found in code pass. |
| `/characters/nanally` | low | low | low | Rich detail uses horizontal tabs and responsive cards. | defer | Existing layout is acceptable pending screenshot QA. |
| `/characters/lacrimosa` | medium | low | low | Source-pending intel panel needed softer mobile padding. | fix now | Prevents the pilot notes from feeling oversized on phone. |
| `/weapons` | low | low | low | Filters and compact rows already wrap/scroll. | defer | No immediate fix needed. |
| `/weapons/good-boys-grand-adventure` | low | low | low | Growth table already has horizontal overflow container. | defer | Existing detail layout is contained. |
| `/modules` | low | low | low | Filters/cards and mini filters already wrap/scroll. | defer | No immediate fix needed. |
| `/modules/devils-blood-curse` | low | low | low | Set data and tables are carded/scroll-safe. | defer | Keep source-pending copy as-is. |
| `/modules/pieces/type-ii-horizontal/s` | low | low | low | Detail surface routes through module detail and module shapes. | defer | Full parity still uses `/api/modules/pieces?limit=100`. |
| `/vehicles` | high | medium | low | Vehicle stage used 340/430px minimum height on phones. | fix now | Reduced phone/large-phone vertical pressure. |
| `/tier-list` | medium | low | low | Horizontal board already has `overflow-x-auto` and source caveat. | defer | Needs screenshot QA for scroll discoverability. |
| `/codes` | medium | low | low | Edit modal lacked max-height scrolling on short screens. | fix now | Admin-local modal should not trap content offscreen. |
| `/news` | low | low | low | Cards and modal already use max-height/overflow. | defer | No immediate fix needed. |
| `/guides` | low | low | low | Planned/source-pending state is clear. | defer | Not broken-empty. |
| `/build-planner` | medium | medium | low | Dense, but controls already wrap and prototype copy is visible. | defer | No formula/runtime changes; screenshot QA still needed. |
| `/about` | low | low | low | Legal icon used nonstandard size utility. | fix now | Small class fix improves consistency. |
| `/disclaimer` | low | low | low | Copy is readable and unofficial posture is visible. | defer | No legal guarantees added. |
| `/privacy` | low | low | low | No-account/privacy posture is clear. | defer | No immediate fix needed. |
| `/contact` | low | low | low | Contact/takedown channel is not invented and launch gap is explicit. | defer | Correct launch posture. |
| `/dev/admin` | medium | medium | low | Direct route remains local/dev-gated by panel copy and excluded from sitemap. | defer | No public nav exposure unless existing dev flag is set. |

## Key Findings

- The highest phone risk was vertical density on the Home hero and Vehicle showroom.
- Search dropdown containment was improved for narrow screens by using full viewport-width positioning on mobile.
- Placeholder community/support labels were softened so they do not read like live production systems.
- Codes edit modal and legal page utility sizing received low-risk containment fixes.

## Still Requires Manual QA

- Real preview URL fallback/header verification.
- Screenshot pass at 375px, 430px, 768px, 1024px, and desktop.
- Build Planner dense interaction pass on tablet.
- Tier List horizontal scroll cue confirmation.
