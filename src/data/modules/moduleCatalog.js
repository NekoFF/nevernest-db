import { moduleShapes } from './moduleShapes.js'

export const moduleRarities = [
  { id: 1, code: 'B', name: 'B Module', colorToken: 'module-b', sortOrder: 1 },
  { id: 2, code: 'A', name: 'A Module', colorToken: 'module-a', sortOrder: 2 },
  { id: 3, code: 'S', name: 'S Module', colorToken: 'module-s', sortOrder: 3 },
]

export const moduleTypes = [
  { id: 1, code: 'II', name: 'Type II Module', cellCount: 2, sortOrder: 1 },
  { id: 2, code: 'III', name: 'Type III Module', cellCount: 3, sortOrder: 2 },
  { id: 3, code: 'IV', name: 'Type IV Module', cellCount: 4, sortOrder: 3 },
]

const moduleSlug = (rarity, type, shape) => `${rarity.toLowerCase()}-type-${type.toLowerCase()}-${shape}`

export const modules = moduleRarities.flatMap((rarity) =>
  moduleShapes.map((shape, index) => {
    const type = moduleTypes.find((item) => item.code === shape.typeCode)
    return {
      id: `${rarity.code}-${shape.id}`,
      rarityCode: rarity.code,
      typeCode: type.code,
      shapeKey: shape.shapeKey,
      displayName: type.name,
      slug: moduleSlug(rarity.code, type.code, shape.shapeKey),
      isActive: true,
      sortOrder: rarity.sortOrder * 100 + type.sortOrder * 10 + index,
    }
  }),
)

export const moduleVisualStyles = {
  S: {
    label: 'S Module',
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg, #fef3c7 0%, #fbbf24 55%, #f59e0b 100%)',
    badgeClassName: 'bg-amber-50 text-amber-800 ring-amber-200',
  },
  A: {
    label: 'A Module',
    color: '#c026d3',
    gradient: 'linear-gradient(135deg, #fae8ff 0%, #e879f9 55%, #a855f7 100%)',
    badgeClassName: 'bg-fuchsia-50 text-fuchsia-800 ring-fuchsia-200',
  },
  B: {
    label: 'B Module',
    color: '#0284c7',
    gradient: 'linear-gradient(135deg, #ecfeff 0%, #67e8f9 50%, #0284c7 100%)',
    badgeClassName: 'bg-cyan-50 text-cyan-800 ring-cyan-200',
  },
}

export function getModuleRarity(code) {
  return moduleRarities.find((rarity) => rarity.code === code)
}

export function getModuleType(code) {
  return moduleTypes.find((type) => type.code === code)
}

function normalizeShapeKey(typeCode, shapeKey) {
  if (!shapeKey) return shapeKey
  const prefixes = {
    II: 'type-ii-',
    III: 'type-iii-',
    IV: 'type-iv-',
  }
  const prefix = prefixes[typeCode]
  if (!prefix || !shapeKey.startsWith(prefix)) return shapeKey

  return shapeKey
    .slice(prefix.length)
    .replace('l-bottom-left', 'l-bl')
    .replace('l-top-left', 'l-tl')
    .replace('l-top-right', 'l-tr')
    .replace('l-bottom-right', 'l-br')
}

export function getModuleShape(typeCode, shapeKey) {
  const normalizedShapeKey = normalizeShapeKey(typeCode, shapeKey)
  return moduleShapes.find((shape) => shape.typeCode === typeCode && shape.shapeKey === normalizedShapeKey)
}

export function getModuleBySlug(slug) {
  const module = modules.find((item) => item.slug === slug)
  if (!module) return null

  return {
    ...module,
    rarity: getModuleRarity(module.rarityCode),
    type: getModuleType(module.typeCode),
    shape: getModuleShape(module.typeCode, module.shapeKey),
  }
}

export function getModuleVisualStyle(rarityCode) {
  return moduleVisualStyles[rarityCode] || moduleVisualStyles.B
}
