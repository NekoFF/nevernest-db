# Phase 256-275 Fixes Applied

## Scripts

| File | Issue Fixed | Before | After | Why Low-Risk | Verification |
| --- | --- | --- | --- | --- | --- |
| `scripts/character-corpus-utils.mjs` | No shared safe corpus utilities. | Corpus inspection/extraction would need ad hoc filesystem logic. | Added path normalization, text-file safety, canonical map helpers, alias lookup, and dedupe helpers. | Script-only; does not affect app runtime. | `npm run test:corpus` |
| `scripts/inspect-character-corpus.mjs` | No inventory of local intel/corpus files. | Corpus contents had to be inspected manually. | Recursively scans the corpus, skips generated/dependency/media files, samples text-like files, and writes inventory docs. | Read-only against corpus; writes reports only. | `npm run corpus:characters:inspect` |
| `scripts/build-character-canonical-map.mjs` | No explicit canonical protection map for character ingestion. | Existing site data was implicit. | Writes `.generated/character-canonical-map.json` and canonical docs. | Reads static data only; no site mutation. | `npm run corpus:characters:canonical` |
| `scripts/extract-character-candidates.mjs` | No safe candidate extraction pass. | Corpus data risked being copied manually or trusted too early. | Extracts candidate notes, conflicts, unmatched files, and summary with `needs_verification`. | Generated output only; no static character writes. | `npm run corpus:characters:extract` |
| `scripts/character-corpus.test.mjs` | No corpus pipeline guard tests. | Mapping, dedupe, and skip behavior were untested. | Added lightweight Node tests for normalization, canonical mapping, ambiguity, dedupe, and binary/dependency skipping. | Corpus-only test command; default app tests unaffected. | `npm run test:corpus` |
| `package.json` | No package commands for corpus pipeline. | Scripts required direct node paths. | Added `corpus:characters:*` and `test:corpus` commands. | Adds commands only; no runtime dependency changes. | Commands passed. |

## Data Apply

No live character data was applied. The corpus output showed enough conflicts and mixed-character files that pilot application was deferred for manual review.
