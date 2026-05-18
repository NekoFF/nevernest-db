import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
export const repoRoot = path.resolve(__dirname, '..')
export const generatedRoot = path.join(repoRoot, '.generated')

export const DEFAULT_CORPUS_ROOT = path.resolve(repoRoot, '..', 'nevernest-intel')

export const SKIP_DIR_NAMES = new Set([
  '.git',
  '.cache',
  '.next',
  '.vite',
  'build',
  'cache',
  'coverage',
  'dist',
  'node_modules',
  'out',
])

export const TEXT_EXTENSIONS = new Set(['.json', '.md', '.txt', '.html', '.htm', '.csv'])
export const BINARY_EXTENSIONS = new Set([
  '.avif',
  '.bmp',
  '.gif',
  '.ico',
  '.jpeg',
  '.jpg',
  '.mp3',
  '.mp4',
  '.ogg',
  '.pdf',
  '.png',
  '.psd',
  '.svg',
  '.webm',
  '.webp',
  '.zip',
])

export const MAX_TEXT_FILE_BYTES = 1_000_000
export const MAX_SNIPPET_CHARS = 360

export function parseArgs(argv = process.argv.slice(2)) {
  return argv.reduce((acc, arg) => {
    if (!arg.startsWith('--')) return acc
    const [rawKey, ...rest] = arg.slice(2).split('=')
    const key = rawKey.trim()
    const value = rest.length ? rest.join('=').trim() : 'true'
    if (key) acc[key] = value
    return acc
  }, {})
}

export function resolveCorpusRoot(args = parseArgs()) {
  return path.resolve(args.root || process.env.CHARACTER_CORPUS_ROOT || DEFAULT_CORPUS_ROOT)
}

export function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function compactText(value) {
  return String(value || '').replace(/\s+/g, ' ').trim()
}

export function normalizeForCompare(value) {
  return compactText(value).toLowerCase()
}

export function classifyFileType(filePath) {
  const ext = path.extname(filePath).toLowerCase()
  if (ext === '.json') return 'json'
  if (ext === '.md' || ext === '.markdown') return 'markdown'
  if (ext === '.txt') return 'txt'
  if (ext === '.html' || ext === '.htm') return 'html'
  if (ext === '.csv') return 'csv'
  return 'unknown'
}

export function isTextLike(filePath) {
  return TEXT_EXTENSIONS.has(path.extname(filePath).toLowerCase())
}

export function isLikelyBinary(filePath) {
  return BINARY_EXTENSIONS.has(path.extname(filePath).toLowerCase())
}

export function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true })
}

export function writeJson(filePath, data) {
  ensureDir(path.dirname(filePath))
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8')
}

export function writeMarkdown(filePath, content) {
  ensureDir(path.dirname(filePath))
  fs.writeFileSync(filePath, `${content.trim()}\n`, 'utf8')
}

export function toRepoRelative(filePath) {
  return path.relative(repoRoot, filePath).replace(/\\/g, '/')
}

export function toCorpusRelative(corpusRoot, filePath) {
  return path.relative(corpusRoot, filePath).replace(/\\/g, '/')
}

export function readTextSample(filePath, maxBytes = 4096) {
  const fd = fs.openSync(filePath, 'r')
  try {
    const buffer = Buffer.alloc(maxBytes)
    const bytesRead = fs.readSync(fd, buffer, 0, maxBytes, 0)
    return buffer.subarray(0, bytesRead).toString('utf8').replace(/\0/g, '').trim()
  } finally {
    fs.closeSync(fd)
  }
}

export function readSafeText(filePath) {
  const stat = fs.statSync(filePath)
  if (stat.size > MAX_TEXT_FILE_BYTES) {
    return { skipped: true, reason: `larger than ${MAX_TEXT_FILE_BYTES} bytes`, text: '' }
  }
  if (!isTextLike(filePath) || isLikelyBinary(filePath)) {
    return { skipped: true, reason: 'not a supported text-like corpus file', text: '' }
  }
  return { skipped: false, reason: '', text: fs.readFileSync(filePath, 'utf8').replace(/\0/g, '') }
}

export function scanFiles(root) {
  const files = []
  const skipped = []
  let folderCount = 0

  function visit(dir) {
    let entries = []
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true })
    } catch (error) {
      skipped.push({ path: dir, type: 'folder', reason: error.message })
      return
    }

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        if (SKIP_DIR_NAMES.has(entry.name.toLowerCase())) {
          skipped.push({ path: fullPath, type: 'folder', reason: 'skipped generated/dependency folder' })
          continue
        }
        folderCount += 1
        visit(fullPath)
      } else if (entry.isFile()) {
        files.push(fullPath)
      }
    }
  }

  if (!fs.existsSync(root)) {
    return { files, skipped: [{ path: root, type: 'root', reason: 'corpus root not found' }], folderCount: 0 }
  }

  visit(root)
  return { files, skipped, folderCount }
}

export async function loadCharacters() {
  const modulePath = pathToFileURL(path.join(repoRoot, 'src', 'data', 'characters.js')).href
  const module = await import(modulePath)
  return module.characters
}

export function buildCanonicalRecords(characters) {
  return characters.map((character) => {
    const slug = character.slug || character.id
    const detailSignals = [
      character.overview?.length,
      character.skills?.length,
      character.passives?.length,
      character.awakenings?.length,
      character.breakthroughs?.length,
      character.build?.statPriority?.length,
      character.build?.weapons?.length,
      character.build?.cartridges?.length,
      character.teams?.length,
      character.materials?.ascension?.length,
      character.consoleSetup?.pieces?.length,
    ].filter(Boolean)

    return {
      slug,
      id: character.id,
      name: character.name,
      rarity: character.rarity,
      element: character.element,
      arcType: character.arcType,
      roles: character.roles || [],
      sourceStatus: character.sourceStatus || 'unknown',
      hasRichDetailData: detailSignals.length >= 4 || character.detailReady === true,
      isReferenceQuality: slug === 'nanally',
      aliases: buildAliases(character),
    }
  })
}

export function buildAliases(character) {
  const aliases = new Set([
    character.id,
    character.slug,
    character.name,
    slugify(character.id),
    slugify(character.slug),
    slugify(character.name),
  ].filter(Boolean))

  if (character.id === 'zero-female' || character.id === 'zero-male') {
    aliases.add('zero')
    aliases.add('esper-zero')
    aliases.add('mc')
  }
  if (character.id === 'hathor') aliases.add('hator')
  if (character.id === 'hanizel') aliases.add('haniel')
  if (character.id === 'daffodil') aliases.add('daffodill')

  return Array.from(aliases).filter(Boolean)
}

export function buildAliasLookup(canonicalRecords) {
  const lookup = new Map()
  for (const record of canonicalRecords) {
    for (const alias of record.aliases) {
      const normalized = slugify(alias)
      if (!normalized) continue
      const current = lookup.get(normalized)
      if (current && current !== record.slug) {
        lookup.set(normalized, null)
      } else {
        lookup.set(normalized, record.slug)
      }
    }
  }
  return lookup
}

export function detectSlugFromPath(corpusRoot, filePath, aliasLookup) {
  const parts = toCorpusRelative(corpusRoot, filePath).split(/[\\/]/).map(slugify).filter(Boolean)
  for (let index = 0; index < parts.length; index += 1) {
    const part = parts[index]
    const mapped = aliasLookup.get(part)
    if (mapped) return mapped
  }
  return null
}

export function findNamesInText(text, canonicalRecords) {
  const haystack = normalizeForCompare(text)
  const found = new Set()
  for (const record of canonicalRecords) {
    for (const alias of record.aliases) {
      const normalized = normalizeForCompare(alias).replace(/-/g, ' ')
      if (normalized.length < 4) continue
      const pattern = new RegExp(`(^|[^a-z0-9])${escapeRegExp(normalized)}([^a-z0-9]|$)`, 'i')
      if (pattern.test(haystack.replace(/-/g, ' '))) {
        found.add(record.slug)
        break
      }
    }
  }
  return Array.from(found)
}

export function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export function snippetFingerprint(text) {
  return normalizeForCompare(text).replace(/[^a-z0-9]+/g, ' ').trim()
}

export function clampSnippet(text) {
  const compact = compactText(text)
  if (compact.length <= MAX_SNIPPET_CHARS) return compact
  return `${compact.slice(0, MAX_SNIPPET_CHARS - 3).trim()}...`
}

export function confidenceForSnippet(filePath, text, mappedSlug, foundNames) {
  const rel = filePath.replace(/\\/g, '/').toLowerCase()
  if (rel.includes(`/characters/${mappedSlug}/`) && foundNames.length <= 1) return 'medium'
  if (foundNames.length === 1 && foundNames[0] === mappedSlug) return 'medium'
  return 'low'
}

export function sourceTimestamp() {
  return new Date().toISOString()
}
