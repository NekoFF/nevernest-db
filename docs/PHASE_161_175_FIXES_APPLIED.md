# Phase 161-175 Fixes Applied

Date: 2026-05-18

| File | Issue fixed | Before | After | Why low-risk | Verification |
| --- | --- | --- | --- | --- | --- |
| `index.html` | Default SEO metadata was sparse. | Basic title/description only. | Improved description plus OG/Twitter defaults and theme/application metadata. | Static HTML metadata only. | `npm run build` passed. |
| `scripts/generate-sitemap.mjs` | Sitemap required production HTTPS URL and omitted detail routes. | Only top-level routes; no preview mode. | Preview mode generates 122 public read-only routes to `.generated/sitemap-preview.xml`; production still requires HTTPS `SITE_URL`. | Script-only; excludes local/admin routes. | `npm run sitemap:preview` passed. |
| `package.json` | No sitemap preview command. | `sitemap:generate` only. | Added cross-platform `sitemap:preview`. | Script alias only. | `npm run sitemap:preview` passed. |
| `public/robots.txt` | Comment was vague. | Said add Sitemap after domain selected. | Clarifies production sitemap generation after canonical HTTPS host. | Comment-only. | Inspected. |
| `src/pages/CodesPage.jsx` | Codes copy could imply active/expiry certainty. | "Redeem active NTE codes" copy. | Says source review is pending and status/expiry/rewards may need verification. | Copy-only; no data/status changes. | `npm run build` passed. |
| `src/pages/TierListPage.jsx` | Visible "Official" wording risked public confusion. | "Official ranking" / "Official Tier List". | Visible labels use "Reference" and explain source review pending. | Copy-only; internal mode unchanged. | `npm run build` passed. |
| `src/pages/LegalInfoPage.jsx` | Legal/privacy copy lacked explicit asset/takedown and no-account details. | General disclaimer/privacy. | Added asset/takedown and no-public-accounts sections. | Copy-only. | `npm run build` passed. |

No backend endpoints, DB schema, auth behavior, admin write behavior, or data values changed.
