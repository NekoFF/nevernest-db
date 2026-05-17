import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
export const root = path.resolve(__dirname, '../..')

export const SOURCE_STATUSES = new Set(['verified', 'needs_verification', 'estimated', 'placeholder', 'mock', 'unknown'])

export function slug(value) {
  return String(value || '').toLowerCase().replace(/['"]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

export function toArray(value) {
  return Array.isArray(value) ? value : []
}

export async function loadModule(rel) {
  return import(pathToFileURL(path.join(root, rel)).href)
}

function extractArrayLiteral(body, field) {
  const match = body.match(new RegExp(`${field}:\\s*\\[([^\\]]*)\\]`))
  if (!match) return []
  return [...match[1].matchAll(/'([^']+)'|"([^"]+)"/g)].map((item) => item[1] || item[2]).filter(Boolean)
}

function extractString(body, field) {
  return body.match(new RegExp(`${field}:\\s*'([^']*)'`))?.[1] ||
    body.match(new RegExp(`${field}:\\s*"([^"]*)"`))?.[1] ||
    ''
}

function extractCharacters() {
  const dir = path.join(root, 'src/data/characters')
  const files = fs.readdirSync(dir).filter((file) => file.endsWith('.js') && file !== 'index.js' && file !== 'helpers.js')
  const characters = []
  for (const file of files) {
    const text = fs.readFileSync(path.join(dir, file), 'utf8')
    const matches = [...text.matchAll(/export const \w+Card\s*=\s*T\('([^']+)'\s*,\s*\{([\s\S]*?)\n\s*\}\)/g)]
    for (const match of matches) {
      const body = match[2]
      const name = match[1]
      const id = extractString(body, 'id') || slug(name)
      characters.push({
        id,
        slug: slug(name),
        name,
        rarity: extractString(body, 'rarity'),
        element: extractString(body, 'element'),
        arcType: extractString(body, 'arcType'),
        faction: extractString(body, 'faction'),
        birthday: extractString(body, 'birthday'),
        shortDescription: extractString(body, 'shortDescription') || extractString(body, 'description'),
        roles: extractArrayLiteral(body, 'roles'),
        tags: extractArrayLiteral(body, 'tags'),
        sourceFile: `src/data/characters/${file}`,
      })
    }
  }
  return characters
}

export async function loadSnapshot() {
  let source = 'fallback-node-loader'
  let snapshot = null

  try {
    const mod = await loadModule('src/data/exportDataIndex.js')
    snapshot = mod.getExportDataSnapshot()
    source = 'exportDataIndex-node-safe'
  } catch (error) {
    // Emergency fallback for keeping dry runs Node-only if the canonical snapshot entrypoint regresses.
    const { weapons } = await loadModule('src/data/weapons.js')
    const cartridgesMod = await loadModule('src/data/cartridges.js')
    const { MODULE_SHAPES } = await loadModule('src/data/moduleCatalog.js')
    const { modulePieces } = await loadModule('src/data/modulePieces.js')
    const { vehicles } = await loadModule('src/data/vehicles.js')
    const { officialTierList } = await loadModule('src/data/tierList.js')
    const { baseCodes } = await loadModule('src/data/codes.js')
    const { baseNews } = await loadModule('src/data/news.js')
    const { mediaRegistry } = await loadModule('src/data/mediaRegistry.js')
    const { mediaEntityAliases } = await loadModule('src/data/mediaAliases.js')
    snapshot = {
      generatedAt: new Date().toISOString(),
      version: 1,
      loaderWarning: error.message,
      data: {
        characters: extractCharacters(),
        weapons,
        cartridges: cartridgesMod.baseCartridgeSets || cartridgesMod.cartridgeSets || [],
        moduleShapes: MODULE_SHAPES,
        modulePieces,
        vehicles,
        tierList: officialTierList,
        codes: baseCodes,
        news: baseNews,
        media: mediaRegistry,
        mediaAliases: mediaEntityAliases,
      },
    }
  }

  const { stats } = await loadModule('src/data/stats.js')
  const { canonicalRoles } = await loadModule('src/data/taxonomy/roles.js')
  const { canonicalTags } = await loadModule('src/data/taxonomy/tags.js')
  const { arcTypeTaxonomy, elementTaxonomy, rarityTaxonomy } = await loadModule('src/data/gameTaxonomy.js')

  return {
    ...snapshot,
    source,
    taxonomy: {
      elements: elementTaxonomy.map((item) => ({ id: item.id, name: item.label, color: item.color, sourceStatus: item.sourceStatus })),
      arcTypes: arcTypeTaxonomy.map((item) => ({ id: item.id, name: item.label, sourceStatus: item.sourceStatus })),
      rarities: rarityTaxonomy.map((item) => ({
        id: item.id,
        name: item.label,
        rankLabel: item.shortLabel,
        color: item.color,
        sourceStatus: item.sourceStatus,
      })),
      roles: canonicalRoles,
      tags: canonicalTags,
      stats,
    },
  }
}
