# Source Provenance Workflow

Date: 2026-05-18

## Purpose

Future data completion must make the database more trusted, not just larger. Every imported or edited value should carry enough provenance to explain whether it is official, observed, inferred, estimated, placeholder, or unknown.

## Source Status Definitions

| Status | Meaning | Public posture |
| --- | --- | --- |
| `verified` | Confirmed against trusted evidence and reviewed. | May be presented as verified, with source details when available. |
| `needs_verification` | Plausible or imported from draft/static data, but not yet checked against trusted evidence. | Show as unverified on high-risk sections. |
| `estimated` | Calculated, inferred, or approximated from observed data. | Label as estimated and explain method in notes. |
| `placeholder` | Intentional placeholder copy/data exists so structure can render. | Do not present as real game data. |
| `mock` | Test-only/mock contract data. | Must not ship as production content. |
| `unknown` | Source evidence is not recorded yet. | Treat as unverified; do not imply official status. |

## Field Plan

Future import/export and admin draft workflows should preserve these fields where applicable:

| Field | Purpose |
| --- | --- |
| `sourceStatus` | Evidence confidence enum. |
| `sourceUrl` | Canonical URL to official post, stream, video, screenshot archive, or community source. |
| `sourceLabel` | Human-readable source name. |
| `sourceNotes` | Short evidence notes, including where in a video/screenshot the value appears. |
| `verificationNotes` | Reviewer notes explaining why data was accepted, rejected, or left pending. |
| `patchVersion` | Game/client patch or test build where the value was observed. |
| `lastUpdated` | Last content update timestamp. |
| `verifiedBy` | Future admin reviewer identifier. |
| `verifiedAt` | Future review timestamp. |

No production auth/admin workflow exists yet. `verifiedBy` and `verifiedAt` are future fields for a real admin workflow, not browser-local AdminMode.

## Evidence Policy

Official streams, developer posts, patch notes, official websites, and official social posts are strongest. Record the exact URL and timestamp/context when possible.

Community-inferred data can be useful, but it remains `needs_verification` or `estimated` unless independently checked against trusted evidence.

Screenshots, videos, and manual observations should include where the observation came from, the observed patch/build, and any uncertainty. If the value is read visually and could be misread, keep `needs_verification`.

Estimated/calculated values must be labeled `estimated` and should include the formula or method in notes. Do not make calculated values look official.

Placeholders stay `placeholder`. They are structure scaffolding, not game facts.

## UI Display Policy

- Show source confidence on high-risk public surfaces: character headers, weapon growth/refinement, cartridge set data, vehicle handling/stats, codes, and news.
- Keep badges visually subtle and close to the data they qualify.
- Avoid badge spam in dense list views unless the status materially changes trust.
- Missing data must render as missing/pending, not as zero.
- Unknown/unverified values must never be presented as official.

## Import/Export Policy

- Import/export must preserve provenance fields.
- Imports must never promote `unknown`, `needs_verification`, `estimated`, or `placeholder` to `verified`.
- Existing verified DB data must not be downgraded by lower-confidence generated imports.
- Browser localStorage AdminMode overrides must never be silently imported.
- Import reports must include blocked rows, sourceStatus distribution, unresolved labels, and source/provenance warnings.

## Draft/Publish Policy

Future production admin writes should use draft/publish:

- Draft edits can hold incomplete provenance.
- Publishing public data requires sourceStatus review.
- `verified` requires reviewer identity and timestamp.
- High-risk entity writes for characters, weapons, modules, cartridges, vehicles, and tier lists must wait for relational update plans and provenance review.

## Public Beta Blocks

Public beta is blocked by:

- Broken static route/data rendering.
- API failures that look like empty zero-data states.
- Stale active code labels that cannot be defended.
- Unofficial/inferred data presented as official.
- Missing sourceStatus on high-risk public sections.
- Any accidental enabling of production auth/admin writes.

## Production Blocks

Production mutable workflows are blocked by:

- No production auth threat model.
- No durable admin audit log.
- No backup/restore rehearsal.
- No moderation/review process for public contributions.
- No import/export provenance preservation.
- No sourceStatus editor/reviewer workflow.

## Must Never Happen

- Never mark unknown data as verified.
- Never hide missing data as zero.
- Never present unofficial data as official.
- Never silently import browser localStorage overrides.
- Never store tokens, cookies, CSRF tokens, or passwords in localStorage, sessionStorage, or IndexedDB.
