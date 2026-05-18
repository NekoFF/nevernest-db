# Phase 161-175 Legal/Source Review

Date: 2026-05-18

## Result

The public posture is acceptable for continued beta preparation if the site remains clearly unofficial and read-only. Copy was strengthened for assets/takedown, no public accounts, code confidence, and tier-list source risk.

## Review

| Area | Finding | Fix/decision |
| --- | --- | --- |
| Fan-site disclaimer | Already says unofficial and not endorsed. | Kept and added asset/takedown concern copy. |
| About page | Good community-project posture. | No code change needed. |
| Privacy page | Correctly says no accounts/auth/tracking/payment in current phase. | Added no-public-accounts/local draft clarification. |
| Contact page | Says stable public channel should be selected before launch. | Kept; no fake contact channel invented. |
| Source/provenance wording | SourceStatus and provenance docs exist. | Keep badges and source workflow. |
| Unofficial data wording | Legal pages note placeholders/estimates/needs verification. | Kept. |
| Image/media risk | Assets are public-facing and need rights/takedown review. | Added explicit assets/takedown section. |
| Codes/source/expiry risk | No source URLs/labels/end dates. | Codes page now says status/expiry/rewards may need verification. |
| Build Planner prototype | Existing copy says formula outputs need verification. | Keep public only as prototype-labelled tool. |
| Tier list "official" wording | Visible "Official" labels risk confusion. | Changed visible copy to "Reference" while internal mode id remains unchanged. |
| Public confusion | Main risk is "is this official?" | Public pages and docs now reinforce unofficial posture. |

## Public Copy Changes

- `src/pages/LegalInfoPage.jsx`: added asset/takedown and no-public-accounts copy.
- `src/pages/CodesPage.jsx`: changed header/SEO copy to emphasize source review and unverified expiry/reward details.
- `src/pages/TierListPage.jsx`: changed visible "Official" labels to "Reference" and added ranking caveat.

## Still Needed Before Beta

- Select a real public contact/takedown channel.
- Review asset licensing and ownership posture.
- Review every active code against trusted evidence.
- Add source URLs only when verified.
- Decide whether Build Planner should be linked prominently or kept as a clearly labelled beta/prototype tool.
