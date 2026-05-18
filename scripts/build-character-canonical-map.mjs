import path from 'node:path'
import { buildCanonicalRecords, generatedRoot, loadCharacters, writeJson, writeMarkdown } from './character-corpus-utils.mjs'

const characters = await loadCharacters()
const records = buildCanonicalRecords(characters)

writeJson(path.join(generatedRoot, 'character-canonical-map.json'), {
  generatedAt: new Date().toISOString(),
  count: records.length,
  characters: records,
})

const rows = records
  .map((record) => `| ${record.slug} | ${record.name} | ${record.rarity || 'unknown'} | ${record.element || 'unknown'} | ${record.arcType || 'unknown'} | ${record.sourceStatus || 'unknown'} | ${record.hasRichDetailData ? 'yes' : 'no'} | ${record.isReferenceQuality ? 'yes' : 'no'} |`)
  .join('\n')

writeMarkdown(
  path.join(process.cwd(), 'docs', 'PHASE_256_275_CHARACTER_CANONICAL_MAP.md'),
  `# Phase 256-275 Character Canonical Map

## Rule

Existing site data is canonical for identity fields. Corpus values can be candidates only and must not overwrite ids, slugs, display names, rarity/rank, element, arc type, curated roles, or avatar/card identity.

## Output

- Machine-readable map: \`.generated/character-canonical-map.json\`
- Characters mapped: ${records.length}

## Canonical Characters

| Slug | Name | Rarity | Element | Arc Type | Source Status | Rich Detail | Reference |
| --- | --- | --- | --- | --- | --- | --- | --- |
${rows}

## Notes

- Nanally is reference-quality and must be compare-only unless a reviewer intentionally appends source-pending notes.
- Aliases are generated only for mapping and conflict detection; they do not create new canonical characters.
- Ambiguous external names such as Esper Zero stay protected because the site has separate Zero entries.
`
)

console.log(`Character canonical map complete: ${records.length} characters.`)
