import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8')
const warn = []
const ok = []
const needs = []
const blockers = []
const resolvedAliases = []

function slug(value) {
  return String(value || '').toLowerCase().replace(/['"]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

function checkDuplicates(items, label, key = 'id') {
  const seen = new Map()
  for (const item of items) {
    const value = item?.[key]
    if (!value) continue
    if (seen.has(value)) warn.push(`${label}: duplicate ${key} "${value}"`)
    seen.set(value, true)
  }
}

async function loadPureModule(rel) {
  return import(pathToFileURL(path.join(root, rel)).href)
}

function extractCharacters() {
  const dir = path.join(root, 'src/data/characters')
  const files = fs.readdirSync(dir).filter((file) => file.endsWith('.js') && file !== 'index.js' && file !== 'helpers.js')
  const chars = []
  for (const file of files) {
    const text = fs.readFileSync(path.join(dir, file), 'utf8')
    const cardMatches = [...text.matchAll(/export const \w+Card\s*=\s*T\('([^']+)'\s*,\s*\{([\s\S]*?)\n\s*\}\)/g)]
    for (const match of cardMatches) {
      const body = match[2]
      chars.push({
        name: match[1],
        id: body.match(/id:\s*'([^']+)'/)?.[1] || slug(match[1]),
        rarity: body.match(/rarity:\s*'([^']+)'/)?.[1] || '',
        element: body.match(/element:\s*'([^']+)'/)?.[1] || '',
        arcType: body.match(/arcType:\s*'([^']+)'/)?.[1] || '',
        file,
      })
    }
  }
  return chars
}

const characters = extractCharacters()
const { weapons } = await loadPureModule('src/data/weapons.js')
const cartridgesMod = await loadPureModule('src/data/cartridges.js')
const { MODULE_SHAPES } = await loadPureModule('src/data/moduleCatalog.js')
const { modulePieces } = await loadPureModule('src/data/modulePieces.js')
const { vehicles } = await loadPureModule('src/data/vehicles.js')
const { officialTierList } = await loadPureModule('src/data/tierList.js')
const { baseCodes } = await loadPureModule('src/data/codes.js')
const { baseNews } = await loadPureModule('src/data/news.js')
const { mediaRegistry } = await loadPureModule('src/data/mediaRegistry.js')
const { resolveMediaEntityId, isResolvedMediaAlias } = await loadPureModule('src/data/mediaAliases.js')

const cartridges = cartridgesMod.baseCartridgeSets || cartridgesMod.cartridgeSets || []
const characterIds = new Set(characters.map((item) => item.id))
const weaponIds = new Set(weapons.map((item) => item.id))
const cartridgeIds = new Set(cartridges.map((item) => item.id))
const shapeIds = new Set(MODULE_SHAPES.map((item) => item.id))

checkDuplicates(characters, 'Characters')
checkDuplicates(characters.map((item) => ({ slug: slug(item.name) })), 'Characters', 'slug')
checkDuplicates(weapons, 'Weapons')
checkDuplicates(weapons, 'Weapons', 'slug')
checkDuplicates(cartridges, 'Cartridges')
checkDuplicates(cartridges, 'Cartridges', 'slug')
checkDuplicates(vehicles, 'Vehicles')
checkDuplicates(baseCodes, 'Codes')
checkDuplicates(baseNews, 'News')
checkDuplicates(mediaRegistry, 'Media')

for (const c of characters) {
  if (!c.id) blockers.push(`Character in ${c.file} missing id`)
  if (!c.name) blockers.push(`Character ${c.id || c.file} missing name`)
  if (!c.rarity) warn.push(`Character ${c.id} missing rarity`)
  if (!c.element) warn.push(`Character ${c.id} missing element`)
  if (!c.arcType) warn.push(`Character ${c.id} missing arcType`)
}

for (const weapon of weapons) {
  for (const id of weapon.recommendedCharacters || []) {
    if (!characterIds.has(id)) warn.push(`Weapon ${weapon.id} recommendedCharacters references missing character "${id}"`)
  }
}

for (const cartridge of cartridges) {
  if (String(cartridge.dataStatus || '').includes('missing')) needs.push(`Cartridge ${cartridge.id} marked ${cartridge.dataStatus}`)
  for (const shape of cartridge.compatibleModules || []) {
    if (shape.moduleShapeId && !shapeIds.has(shape.moduleShapeId)) warn.push(`Cartridge ${cartridge.id} references missing module shape "${shape.moduleShapeId}"`)
  }
}

for (const tier of officialTierList.tiers || []) {
  for (const id of tier.characterIds || []) {
    if (!characterIds.has(id)) warn.push(`Tier ${tier.id} references missing character "${id}"`)
  }
}

for (const vehicle of vehicles) {
  for (const field of ['id', 'name', 'type', 'maxSpeed', 'acceleration', 'durability']) {
    if (vehicle[field] == null || vehicle[field] === '') warn.push(`Vehicle ${vehicle.id || vehicle.name} missing ${field}`)
  }
}

for (const code of baseCodes) {
  if (!code.id || !code.code) warn.push(`Code missing id/code: ${JSON.stringify(code)}`)
  if (!['active', 'expired'].includes(code.status)) warn.push(`Code ${code.id} has unexpected status "${code.status}"`)
}

for (const entry of baseNews) {
  if (!entry.id || !entry.title) warn.push(`News entry missing id/title: ${JSON.stringify(entry)}`)
  if (!entry.date) warn.push(`News ${entry.id} missing date`)
}

const entitySets = {
  character: characterIds,
  weapon: weaponIds,
  cartridge: cartridgeIds,
  vehicle: new Set(vehicles.map((item) => slug(item.id))),
}
for (const media of mediaRegistry) {
  const set = entitySets[media.entityType]
  if (!set) continue
  if (set.has(media.entityId)) continue
  const resolvedEntityId = resolveMediaEntityId(media.entityType, media.entityId)
  if (isResolvedMediaAlias(media.entityType, media.entityId) && set.has(resolvedEntityId)) {
    resolvedAliases.push(`Media ${media.id} resolves alias "${media.entityId}" -> "${resolvedEntityId}"`)
  } else {
    needs.push(`Media ${media.id} points to entityId "${media.entityId}" not found by strict id match`)
  }
}

if (!warn.length && !blockers.length) ok.push('No duplicate ids/slugs or missing required static seed ids detected by this audit.')
ok.push(`Characters audited: ${characters.length}`)
ok.push(`Weapons audited: ${weapons.length}`)
ok.push(`Cartridges audited: ${cartridges.length}`)
ok.push(`Module shapes audited: ${MODULE_SHAPES.length}`)
ok.push(`Module pieces audited: ${modulePieces.length}`)
ok.push(`Vehicles audited: ${vehicles.length}`)
ok.push(`Tier list entries audited: ${(officialTierList.tiers || []).flatMap((tier) => tier.characterIds || []).length}`)
ok.push(`Codes audited: ${baseCodes.length}`)
ok.push(`News audited: ${baseNews.length}`)

function section(title, rows) {
  console.log(`\n${title}`)
  if (!rows.length) console.log('  OK: none')
  else rows.forEach((row) => console.log(`  - ${row}`))
}

console.log('NTE Data Audit Report')
section('OK', ok)
section('Warnings', warn)
section('Needs verification', needs)
section('Resolved media aliases', resolvedAliases)
section('Blockers', blockers)
console.log('\nSummary JSON')
console.log(JSON.stringify({
  counts: {
    characters: characters.length,
    weapons: weapons.length,
    cartridges: cartridges.length,
    moduleShapes: MODULE_SHAPES.length,
    modulePieces: modulePieces.length,
    vehicles: vehicles.length,
    tierListEntries: (officialTierList.tiers || []).flatMap((tier) => tier.characterIds || []).length,
    codes: baseCodes.length,
    news: baseNews.length,
  },
  warnings: warn.length,
  needsVerification: needs.length,
  resolvedMediaAliases: resolvedAliases.length,
  blockers: blockers.length,
}, null, 2))
