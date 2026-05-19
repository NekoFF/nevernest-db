# Phase 316-335 Fixes Applied

Date: 2026-05-19

| File | Issue fixed | Before | After | Why low-risk | Verification |
| --- | --- | --- | --- | --- | --- |
| `src/pages/LegalInfoPage.jsx` | Contact/takedown missing status could be softer than launch gate requires. | Stable channel "should be confirmed." | States no email/private URL is configured and private intake is required before beta. | Copy only. | Build/tests. |
| `src/pages/CodesPage.jsx` | Active codes could read as more certain than source data supports. | Active status may need verification. | Active labels are local-list status, not live redemption checks; per-card manual check caveat. | Copy only. | Build/tests. |
| `src/data/codes.js` | Existing SourceStatusBadge often had no status to render. | Missing `sourceStatus` normalized away. | Missing status defaults to `needs_verification`. | Display metadata only; no codes removed or promoted. | Build/tests. |
| `src/pages/BuildPlannerPage.jsx` | Prototype warning was present but easy to skim. | Header caveat only. | Adds warning band and unofficial export source label. | Copy/export metadata only; no formula changes. | Build/tests. |

