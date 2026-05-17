import { MODULE_RARITIES as MODULE_RARITY_COLORS, MODULE_SHAPES } from './moduleCatalog.js'
import { formatStatValue, getStatById } from './stats.js'

export const MODULE_RARITIES = ['S', 'A', 'B']
export const MODULE_TYPES = ['II', 'III', 'IV']
export const MODULE_MAX_LEVEL = 20

export const MODULE_FIXED_MAIN_STATS = ['atk', 'hp']
export const MODULE_ALLOWED_SUB_STATS = [
  'atk',
  'atk_percent',
  'hp',
  'hp_percent',
  'def',
  'def_percent',
  'crit_rate',
  'crit_dmg',
  'dmg_bonus',
  'essentia',
  'break_intensity',
]

export const MODULE_MAIN_STAT_VALUES = {
  B: {
    II: { atk: 25, hp: 336 },
    III: { atk: 38, hp: 504 },
    IV: { atk: 50, hp: 672 },
  },
  A: {
    II: { atk: 34, hp: 448 },
    III: { atk: 50, hp: 672 },
    IV: { atk: 67, hp: 896 },
  },
  S: {
    II: { atk: 42, hp: 560 },
    III: { atk: 63, hp: 840 },
    IV: { atk: 84, hp: 1120 },
  },
}

export const MODULE_SUB_STAT_BASE_VALUES = {
  B: {
    atk: 10,
    atk_percent: 1.5,
    hp: 120,
    hp_percent: 1.5,
    def: 10,
    def_percent: 2.1,
    crit_rate: 1.2,
    crit_dmg: 2.4,
    dmg_bonus: 1.2,
    essentia: 7,
    break_intensity: 7,
  },
  A: {
    atk: 13,
    atk_percent: 2,
    hp: 150,
    hp_percent: 2,
    def: 13,
    def_percent: 2.8,
    crit_rate: 1.6,
    crit_dmg: 3.2,
    dmg_bonus: 1.6,
    essentia: 7,
    break_intensity: 10,
  },
  S: {
    atk: 18,
    atk_percent: 2.5,
    hp: 200,
    hp_percent: 2.5,
    def: 18,
    def_percent: 3.5,
    crit_rate: 2,
    crit_dmg: 4,
    dmg_bonus: 2,
    essentia: 13,
    break_intensity: 13,
  },
}

export const modulePieceRarities = MODULE_RARITIES
export const modulePieceTypes = MODULE_TYPES
export const modulePieceFixedMainStats = MODULE_FIXED_MAIN_STATS
export const modulePieceAllowedSubStats = MODULE_ALLOWED_SUB_STATS

function typeCodeFromShape(shape) {
  const match = String(shape.type || '').match(/Type\s+([IVX]+)/i)
  return match?.[1] || 'II'
}

function cellCountFromMatrix(matrix) {
  return matrix.flat().filter(Boolean).length
}

function slug(value) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

function pieceName(rarity, typeCode, shape) {
  return `${rarity} Rank Type ${typeCode} Module`
}

export function getModuleTypeFromCellCount(cellCount) {
  if (Number(cellCount) === 3) return 'III'
  if (Number(cellCount) === 4) return 'IV'
  return 'II'
}

export function getModuleRarityColor(rarity = 'S') {
  return MODULE_RARITY_COLORS[String(rarity || 'S').toUpperCase()] || MODULE_RARITY_COLORS.S
}

export function calculateModuleSubStatValue(rarity = 'S', cellCount = 2, statId) {
  const key = String(rarity || 'S').toUpperCase()
  const base = MODULE_SUB_STAT_BASE_VALUES[key]?.[statId]
  if (base == null) return null
  const multiplier = Number(cellCount || 2) / 2
  return Number((base * multiplier).toFixed(2))
}

export function formatModuleStatValue(statId, value) {
  if (value == null) return ''
  const rounded = Number.isInteger(value) ? value : Number(value.toFixed(1))
  return formatStatValue(statId, rounded)
}

export function getModuleMainStats({ rarity = 'S', moduleType = 'II' } = {}) {
  const values = MODULE_MAIN_STAT_VALUES[String(rarity || 'S').toUpperCase()]?.[moduleType] || MODULE_MAIN_STAT_VALUES.S.II
  return MODULE_FIXED_MAIN_STATS.map((statId) => ({
    statId,
    stat: getStatById(statId),
    value: values[statId],
    formattedValue: formatModuleStatValue(statId, values[statId]),
  }))
}

export function getModulePossibleSubStats({ rarity = 'S', cellCount = 2 } = {}) {
  return MODULE_ALLOWED_SUB_STATS.map((statId) => {
    const value = calculateModuleSubStatValue(rarity, cellCount, statId)
    return {
      statId,
      stat: getStatById(statId),
      value,
      formattedValue: formatModuleStatValue(statId, value),
    }
  })
}

export const modulePieces = MODULE_RARITIES.flatMap((rarity) =>
  MODULE_SHAPES.map((shape) => {
    const moduleType = typeCodeFromShape(shape)
    const cellCount = cellCountFromMatrix(shape.matrix)
    return {
      id: `module-${rarity.toLowerCase()}-${slug(shape.id)}`,
      name: pieceName(rarity, moduleType, shape),
      rarity,
      moduleType,
      cellCount,
      shapeId: shape.id,
      shapeName: shape.name,
      shape: shape.matrix,
      shapeMatrix: shape.matrix,
      image: '',
      icon: '',
      mainStats: getModuleMainStats({ rarity, moduleType }),
      fixedMainStats: MODULE_FIXED_MAIN_STATS,
      allowedSubStats: MODULE_ALLOWED_SUB_STATS,
      subStatValues: getModulePossibleSubStats({ rarity, cellCount }),
      maxSubStats: 4,
      maxLevel: MODULE_MAX_LEVEL,
    }
  }),
)

export const modulePieceById = new Map(modulePieces.map((piece) => [piece.id, piece]))

export function getModulePieceById(id) {
  return modulePieceById.get(String(id || '')) || null
}

export function getModulePieceStats(piece) {
  const target = typeof piece === 'string' ? getModulePieceById(piece) : piece
  return {
    fixedMainStats: (target?.fixedMainStats || modulePieceFixedMainStats).map(getStatById).filter(Boolean),
    allowedSubStats: (target?.allowedSubStats || modulePieceAllowedSubStats).map(getStatById).filter(Boolean),
  }
}

export function getDefaultModulePiece({ rarity = 'S', moduleType = 'II', shapeId } = {}) {
  return modulePieces.find((piece) =>
    piece.rarity === rarity &&
    (shapeId ? piece.shapeId === shapeId : piece.moduleType === moduleType)
  ) || modulePieces[0]
}

export function getModulePieceByShapeAndRarity(shapeId, rarity = 'S') {
  const rank = String(rarity || 'S').toUpperCase()
  return modulePieces.find((piece) => piece.shapeId === shapeId && piece.rarity === rank) || null
}

export function getModuleShapeOptions() {
  return MODULE_SHAPES.map((shape) => {
    const cellCount = cellCountFromMatrix(shape.matrix)
    return {
      ...shape,
      moduleType: getModuleTypeFromCellCount(cellCount),
      cellCount,
    }
  })
}
