import fs from 'node:fs'
import path from 'node:path'
import {
  buildAliasLookup,
  buildCanonicalRecords,
  classifyFileType,
  generatedRoot,
  isLikelyBinary,
  isTextLike,
  loadCharacters,
  readTextSample,
  resolveCorpusRoot,
  scanFiles,
  toCorpusRelative,
  writeJson,
  writeMarkdown,
} from './character-corpus-utils.mjs'

const corpusRoot = resolveCorpusRoot()
const characters = await loadCharacters()
const canonicalRecords = buildCanonicalRecords(characters)
const aliasLookup = buildAliasLookup(canonicalRecords)
const { files, skipped, folderCount } = scanFiles(corpusRoot)

const fileCountsByExtension = {}
const fileCountsByType = { json: 0, markdown: 0, txt: 0, html: 0, csv: 0, unknown: 0 }
const likelyCharacters = new Map()
const likelyUsefulFiles = []
const skippedFiles = [...skipped]

for (const filePath of files) {
  const ext = path.extname(filePath).toLowerCase() || '[none]'
  const type = classifyFileType(filePath)
  const rel = toCorpusRelative(corpusRoot, filePath)
  fileCountsByExtension[ext] = (fileCountsByExtension[ext] || 0) + 1
  fileCountsByType[type] = (fileCountsByType[type] || 0) + 1

  if (isLikelyBinary(filePath)) {
    skippedFiles.push({ path: rel, type: 'file', reason: 'binary/media extension' })
    continue
  }

  const parts = rel.split(/[\\/]/).map((part) => part.toLowerCase())
  for (const part of parts) {
    const normalized = part.replace(/\.[^.]+$/, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
    const slug = aliasLookup.get(normalized)
    if (slug) {
      const current = likelyCharacters.get(slug) || { slug, files: 0, samplePaths: [] }
      current.files += 1
      if (current.samplePaths.length < 8) current.samplePaths.push(rel)
      likelyCharacters.set(slug, current)
    }
  }

  if (isTextLike(filePath) && likelyUsefulFiles.length < 80) {
    const stat = fs.statSync(filePath)
    likelyUsefulFiles.push({
      path: rel,
      type,
      bytes: stat.size,
      sample: readTextSample(filePath, 700).slice(0, 700),
    })
  }
}

const result = {
  scannedAt: new Date().toISOString(),
  corpusRoot,
  folderCount,
  fileCount: files.length,
  fileCountsByExtension,
  fileCountsByType,
  likelyCharacters: Array.from(likelyCharacters.values()).sort((a, b) => a.slug.localeCompare(b.slug)),
  likelyUsefulFiles,
  skipped: skippedFiles.map((entry) => ({
    ...entry,
    path: path.isAbsolute(entry.path) ? toCorpusRelative(corpusRoot, entry.path) : entry.path,
  })),
}

writeJson(path.join(generatedRoot, 'character-corpus-inventory.json'), result)

const topExtensions = Object.entries(fileCountsByExtension)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 20)
  .map(([ext, count]) => `- \`${ext}\`: ${count}`)
  .join('\n')

const characterRows = result.likelyCharacters
  .map((item) => `- \`${item.slug}\`: ${item.files} likely files; samples: ${item.samplePaths.slice(0, 3).map((sample) => `\`${sample}\``).join(', ')}`)
  .join('\n') || '- None detected.'

const usefulRows = likelyUsefulFiles
  .slice(0, 25)
  .map((item) => `- \`${item.path}\` (${item.type}, ${item.bytes} bytes)`)
  .join('\n') || '- None detected.'

const skippedRows = result.skipped
  .slice(0, 25)
  .map((item) => `- \`${item.path}\` - ${item.reason}`)
  .join('\n') || '- None.'

writeMarkdown(
  path.join(process.cwd(), 'docs', 'PHASE_256_275_CHARACTER_CORPUS_INVENTORY.md'),
  `# Phase 256-275 Character Corpus Inventory

## Root Scanned

\`${corpusRoot}\`

## Counts

- Folders scanned: ${folderCount}
- Files scanned: ${files.length}
- Text-like files sampled: ${likelyUsefulFiles.length}

## File Counts By Type

- json: ${fileCountsByType.json}
- markdown: ${fileCountsByType.markdown}
- txt: ${fileCountsByType.txt}
- html: ${fileCountsByType.html}
- csv: ${fileCountsByType.csv}
- unknown: ${fileCountsByType.unknown}

## Top Extensions

${topExtensions || '- None.'}

## Likely Characters Discovered

${characterRows}

## Likely Useful Files

${usefulRows}

## Skipped Folders/Files

${skippedRows}

## Risks / Unknowns

- Corpus character folders can contain cross-character pages and aggregated guide pages.
- Text extracted from raw pages may contain OCR/scrape artifacts, duplicated snippets, and stale recommendations.
- Inventory does not trust or apply any values; it only identifies candidate evidence for extraction.
`
)

console.log(`Character corpus inventory complete: ${files.length} files, ${result.likelyCharacters.length} likely characters.`)
