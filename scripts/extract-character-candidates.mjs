import path from 'node:path'
import {
  buildAliasLookup,
  buildCanonicalRecords,
  clampSnippet,
  compactText,
  confidenceForSnippet,
  detectSlugFromPath,
  findNamesInText,
  generatedRoot,
  loadCharacters,
  parseArgs,
  readSafeText,
  resolveCorpusRoot,
  scanFiles,
  slugify,
  snippetFingerprint,
  sourceTimestamp,
  toCorpusRelative,
  writeJson,
  writeMarkdown,
} from './character-corpus-utils.mjs'

const args = parseArgs()
const corpusRoot = resolveCorpusRoot(args)
const batchId = args.batch || process.env.CHARACTER_BATCH_ID || `character-corpus-${new Date().toISOString().replace(/[:.]/g, '-')}`
const characterLimit = Number(args.limit || process.env.CHARACTER_LIMIT || 0)
const requestedSlugs = new Set(
  String(args.slugs || process.env.CHARACTER_SLUGS || '')
    .split(',')
    .map((value) => slugify(value))
    .filter(Boolean)
)

const characters = await loadCharacters()
const canonicalRecords = buildCanonicalRecords(characters)
const canonicalBySlug = new Map(canonicalRecords.map((record) => [record.slug, record]))
const aliasLookup = buildAliasLookup(canonicalRecords)
const { files, skipped } = scanFiles(corpusRoot)

const selectedSlugs = new Set()
const candidatesBySlug = new Map()
const conflicts = []
const unmatchedFiles = []
const skippedFiles = [...skipped.map((entry) => ({ path: entry.path, reason: entry.reason }))]
const dedupe = new Map()

function getCandidate(slug) {
  const canonical = canonicalBySlug.get(slug)
  if (!candidatesBySlug.has(slug)) {
    candidatesBySlug.set(slug, {
      characterSlug: slug,
      canonicalName: canonical?.name || slug,
      candidate: {
        summary: [],
        skills: [],
        passives: [],
        combatNotes: [],
        buildNotes: [],
        recommendedWeapons: [],
        recommendedCartridges: [],
        teamNotes: [],
        rotationNotes: [],
        rawSnippets: [],
      },
      conflicts: [],
      sourceFiles: [],
      sourceStatus: 'needs_verification',
      confidence: 'low',
      batchId,
      extractedAt: sourceTimestamp(),
      notes: ['Corpus-derived data is candidate-only and has not been verified.'],
    })
  }
  return candidatesBySlug.get(slug)
}

function addConflict(slug, filePath, field, canonicalValue, corpusValue, reason) {
  const conflict = {
    characterSlug: slug,
    canonicalName: canonicalBySlug.get(slug)?.name || slug,
    field,
    canonicalValue,
    corpusValue,
    sourceFile: toCorpusRelative(corpusRoot, filePath),
    sourceStatus: 'needs_verification',
    confidence: 'low',
    reason,
  }
  conflicts.push(conflict)
  const candidate = getCandidate(slug)
  candidate.conflicts.push(conflict)
}

function addSnippet(slug, category, filePath, text, foundNames, note = '') {
  const candidate = getCandidate(slug)
  const cleaned = clampSnippet(text)
  if (cleaned.length < 24) return
  const fingerprint = `${slug}:${category}:${snippetFingerprint(cleaned)}`
  if (dedupe.has(fingerprint)) return
  dedupe.set(fingerprint, true)

  const sourceFile = toCorpusRelative(corpusRoot, filePath)
  const confidence = confidenceForSnippet(sourceFile, cleaned, slug, foundNames)
  candidate.candidate[category].push({
    text: cleaned,
    sourceFile,
    sourceStatus: 'needs_verification',
    confidence,
    batchId,
    notes: note || (confidence === 'low' ? 'Weak match or mixed corpus context.' : 'Matched by character path/name context.'),
  })

  if (!candidate.sourceFiles.includes(sourceFile)) candidate.sourceFiles.push(sourceFile)
  if (confidence === 'medium' && candidate.confidence === 'low') candidate.confidence = 'medium'
}

function detectFieldConflicts(slug, filePath, text, foundNames) {
  const canonical = canonicalBySlug.get(slug)
  if (!canonical) return
  if (foundNames.length > 1 && foundNames.some((foundSlug) => foundSlug !== slug)) {
    addConflict(slug, filePath, 'identity-context', canonical.name, foundNames.join(', '), 'File references multiple canonical characters.')
  }

  const compact = compactText(text)
  const rarityMatch = compact.match(/\b(?:rarity|rank)\s*[:\-]?\s*(S|A|B)\s*(?:rank)?\b/i) || compact.match(/\b(S|A|B)\s*[- ]?Rank\b/i)
  if (rarityMatch && canonical.rarity && rarityMatch[1].toUpperCase() !== String(canonical.rarity).toUpperCase()) {
    addConflict(slug, filePath, 'rarity', canonical.rarity, rarityMatch[1].toUpperCase(), 'Corpus rarity/rank differs from canonical site value.')
  }

  const elementMatch = compact.match(/\b(?:element|attribute)\s*[:\-]?\s*(anima|chaos|cosmos|incantation|lakshana|psyche|cognitive)\b/i)
  if (elementMatch && canonical.element && slugify(elementMatch[1]) !== slugify(canonical.element)) {
    addConflict(slug, filePath, 'element', canonical.element, elementMatch[1], 'Corpus element differs from canonical site value.')
  }

  const arcMatch = compact.match(/\b(?:arc type|weapon type|weapon|arc)\s*[:\-]?\s*(bose|gas|liquid|plasma|solid)\b/i)
  if (arcMatch && canonical.arcType && slugify(arcMatch[1]) !== slugify(canonical.arcType)) {
    addConflict(slug, filePath, 'arcType', canonical.arcType, arcMatch[1], 'Corpus weapon/arc type differs from canonical site value.')
  }
}

function classifySnippet(line) {
  const value = line.toLowerCase()
  if (/\b(rotation|combo|cycle|opener|playstyle|how to play)\b/.test(value)) return 'rotationNotes'
  if (/\b(team|teammate|composition|party|synergy)\b/.test(value)) return 'teamNotes'
  if (/\b(cartridge|module|console|stat priority|main stat|sub stat|substat|build|best in slot|bis)\b/.test(value)) return 'buildNotes'
  if (/\b(weapon|arc)\b/.test(value)) return 'recommendedWeapons'
  if (/\b(skill|ultimate|normal attack|ability|technique)\b/.test(value)) return 'skills'
  if (/\b(passive|talent|trait|awakening|breakthrough)\b/.test(value)) return 'passives'
  if (/\b(damage|dps|shield|heal|buff|debuff|defense|attack|crit)\b/.test(value)) return 'combatNotes'
  if (/\b(summary|overview|profile)\b/.test(value)) return 'summary'
  return 'rawSnippets'
}

function extractLines(text) {
  return text
    .split(/\r?\n/)
    .map((line) => compactText(line.replace(/^#+\s*/, '').replace(/^\s*[-*|>]+\s*/, '')))
    .filter((line) => line.length >= 28 && line.length <= 1000)
    .filter((line) => !/^[-|:\s]+$/.test(line))
}

let processedFiles = 0
let mappedFiles = 0

for (const filePath of files) {
  const rel = toCorpusRelative(corpusRoot, filePath)
  const read = readSafeText(filePath)
  if (read.skipped) {
    skippedFiles.push({ path: rel, reason: read.reason })
    continue
  }

  const pathSlug = detectSlugFromPath(corpusRoot, filePath, aliasLookup)
  const foundNames = findNamesInText(read.text.slice(0, 60_000), canonicalRecords)
  let slug = pathSlug

  if (!slug && foundNames.length === 1) slug = foundNames[0]
  if (!slug || !canonicalBySlug.has(slug)) {
    unmatchedFiles.push({ path: rel, reason: foundNames.length > 1 ? 'ambiguous character mentions' : 'no canonical character match', foundNames })
    continue
  }
  if (requestedSlugs.size && !requestedSlugs.has(slug)) continue
  if (characterLimit && !selectedSlugs.has(slug) && selectedSlugs.size >= characterLimit) continue

  selectedSlugs.add(slug)
  processedFiles += 1
  mappedFiles += 1

  detectFieldConflicts(slug, filePath, read.text.slice(0, 80_000), foundNames)
  const lines = extractLines(read.text)
  for (const line of lines.slice(0, 250)) {
    const category = classifySnippet(line)
    addSnippet(slug, category, filePath, line, foundNames)
  }
}

for (const candidate of candidatesBySlug.values()) {
  for (const category of Object.keys(candidate.candidate)) {
    candidate.candidate[category] = candidate.candidate[category].slice(0, category === 'rawSnippets' ? 12 : 10)
  }
  const hasMedium = Object.values(candidate.candidate).flat().some((item) => item.confidence === 'medium')
  candidate.confidence = hasMedium && candidate.conflicts.length < 5 ? 'medium' : 'low'
}

const charactersOut = Array.from(candidatesBySlug.values()).sort((a, b) => a.characterSlug.localeCompare(b.characterSlug))
const summary = {
  batchId,
  extractedAt: new Date().toISOString(),
  corpusRoot,
  filesScanned: files.length,
  filesProcessed: processedFiles,
  mappedFiles,
  candidatesExtracted: charactersOut.length,
  conflictsFound: conflicts.length,
  unmatchedFiles: unmatchedFiles.length,
  skippedFiles: skippedFiles.length,
  sourceStatus: 'needs_verification',
  dryRun: String(args.dryRun || process.env.DRY_RUN || 'false').toLowerCase() === 'true',
  canonicalFieldsOverwritten: false,
  siteDataModified: false,
}

const outputDir = path.join(generatedRoot, 'character-candidates')
writeJson(path.join(outputDir, 'characters.json'), charactersOut)
writeJson(path.join(outputDir, 'conflicts.json'), conflicts)
writeJson(path.join(outputDir, 'unmatched-files.json'), unmatchedFiles)
writeJson(path.join(outputDir, 'summary.json'), summary)

const candidateRows = charactersOut
  .map((candidate) => {
    const counts = Object.entries(candidate.candidate)
      .map(([category, items]) => `${category}: ${items.length}`)
      .join(', ')
    return `- \`${candidate.characterSlug}\` (${candidate.confidence}) - ${counts}; conflicts: ${candidate.conflicts.length}`
  })
  .join('\n') || '- No candidates extracted.'

const conflictRows = conflicts
  .slice(0, 40)
  .map((conflict) => `- \`${conflict.characterSlug}\` ${conflict.field}: canonical \`${conflict.canonicalValue}\`, corpus \`${conflict.corpusValue}\` from \`${conflict.sourceFile}\` - ${conflict.reason}`)
  .join('\n') || '- No conflicts detected.'

writeMarkdown(
  path.join(process.cwd(), 'docs', 'PHASE_256_275_CHARACTER_EXTRACTION_REPORT.md'),
  `# Phase 256-275 Character Extraction Report

## Summary

- Batch id: \`${batchId}\`
- Corpus root: \`${corpusRoot}\`
- Files scanned: ${summary.filesScanned}
- Files processed: ${summary.filesProcessed}
- Candidates extracted: ${summary.candidatesExtracted}
- Conflicts found: ${summary.conflictsFound}
- Unmatched files: ${summary.unmatchedFiles}
- Skipped files/folders: ${summary.skippedFiles}
- Source status assigned: \`needs_verification\`
- Site data modified: no
- Canonical fields overwritten: no

## Candidate Output

- \`.generated/character-candidates/characters.json\`
- \`.generated/character-candidates/conflicts.json\`
- \`.generated/character-candidates/unmatched-files.json\`
- \`.generated/character-candidates/summary.json\`

## Candidates

${candidateRows}

## Notes

- Candidate snippets are capped and deduplicated to avoid importing repeated scraper text.
- Mapping uses canonical site slugs/names/aliases and does not create new canonical characters.
- Mixed-character files remain candidate evidence only and are flagged through conflict or unmatched output.
`
)

writeMarkdown(
  path.join(process.cwd(), 'docs', 'PHASE_256_275_CHARACTER_CONFLICT_REPORT.md'),
  `# Phase 256-275 Character Conflict Report

## Summary

- Conflicts found: ${summary.conflictsFound}
- Canonical fields overwritten: no
- Source status assigned to conflicts: \`needs_verification\`

## Conflicts

${conflictRows}

## Handling

- Existing site values remain canonical.
- Corpus values are retained only in generated candidate/conflict reports.
- Any pilot apply must avoid conflicted canonical fields and keep source-pending copy.
`
)

console.log(`Character candidate extraction complete: ${summary.candidatesExtracted} candidates, ${summary.conflictsFound} conflicts.`)
