import { getCartridgeById } from './cartridgeCatalog.js'
import { getModuleShape, normalizeShapeId } from './moduleCatalog.js'
import { getDefaultModulePiece, getModulePieceById } from './modulePieces.js'
import { getWeaponById, getWeaponByName } from './weapons.js'

const DEFAULT_BLOCKED_CELLS = [
  [0, 0], [0, 1], [0, 5], [0, 6],
  [1, 0], [1, 6],
  [2, 0], [2, 6],
  [3, 0], [3, 6],
  [4, 0], [4, 6],
  [5, 0], [5, 6],
  [6, 0], [6, 1], [6, 5], [6, 6],
]

function slugify(value) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

function parseBonus(effect, index) {
  const match = String(effect || '').match(/^\((\d+)\)\s*(.*)$/)
  return { pieces: match ? Number(match[1]) : index === 0 ? 2 : 4, text: match ? match[2] : String(effect || '') }
}

function normalizeLayoutColor(value, fallback = 's') {
  const raw = String(value || fallback || 's').toLowerCase()
  const aliases = {
    'helper-1': 'group-green',
    'helper-2': 'group-blue',
    'helper-3': 'group-pink',
  }
  return aliases[raw] || raw
}

function layoutColorForPlacement(placement, fallback = 's') {
  return normalizeLayoutColor(
    placement?.visualColor ||
      placement?.pieceColor ||
      placement?.colorKey ||
      placement?.visualGroup ||
      placement?.layoutColor ||
      placement?.placementColor ||
      fallback,
  )
}

function normalizeRequiredPiece(piece, index) {
  const shapeId = normalizeShapeId(piece?.moduleShapeId || piece?.shapeKey || piece?.moduleSlug)
  const shape = getModuleShape(shapeId)
  const colorKey = layoutColorForPlacement(piece, piece?.preferredRarity || 's')
  return {
    id: String(piece?.id || `piece-${index + 1}`),
    label: String(piece?.label || `Piece ${String.fromCharCode(65 + index)}`),
    moduleShapeId: shapeId,
    moduleType: String(piece?.moduleType || piece?.type || shape?.type || ''),
    preferredRarity: String(piece?.preferredRarity || 'S').toUpperCase(),
    pieceColor: colorKey,
    visualColor: colorKey,
    colorKey,
    visualGroup: colorKey,
  }
}

function placementFromCells(placement, piece, index) {
  if (!Array.isArray(placement?.cells) || !placement.cells.length) return null
  const minRow = Math.min(...placement.cells.map((cell) => cell[0]))
  const minCol = Math.min(...placement.cells.map((cell) => cell[1]))
  const colorKey = layoutColorForPlacement(placement, piece?.preferredRarity || 's')
  return {
    id: String(placement.id || `layout-piece-${index + 1}`),
    moduleShapeId: piece?.moduleShapeId || 'type-ii-horizontal',
    rarity: String(piece?.preferredRarity || placement.rarity || 'S').toUpperCase(),
    pieceColor: colorKey,
    visualColor: colorKey,
    colorKey,
    visualGroup: colorKey,
    row: minRow,
    col: minCol,
    rotation: Number(placement.rotation) || 0,
  }
}

function normalizePlacement(placement, index, requiredPieces = []) {
  const piece = getModulePieceById(placement?.modulePieceId) || getDefaultModulePiece({
    rarity: String(placement?.rarity || 'S').toUpperCase(),
    shapeId: normalizeShapeId(placement?.moduleShapeId || placement?.shapeKey || 'type-ii-horizontal'),
  })
  if (placement?.pieceId) {
    const piece = requiredPieces.find((item) => item.id === placement.pieceId)
    const fromCells = placementFromCells(placement, piece, index)
    if (fromCells) return fromCells
  }
  const colorKey = layoutColorForPlacement(placement, piece?.rarity || placement?.rarity || 's')
  return {
    id: String(placement?.id || `layout-piece-${index + 1}`),
    modulePieceId: piece?.id || '',
    moduleShapeId: piece?.shapeId || normalizeShapeId(placement?.moduleShapeId || placement?.shapeKey || 'type-ii-horizontal'),
    moduleType: piece ? `Type ${piece.moduleType}` : placement?.moduleType,
    rarity: String(piece?.rarity || placement?.rarity || 'S').toUpperCase(),
    pieceColor: colorKey,
    visualColor: colorKey,
    colorKey,
    visualGroup: colorKey,
    fixedMainStats: piece?.fixedMainStats || placement?.fixedMainStats || ['atk', 'hp'],
    subStats: Array.isArray(placement?.subStats) ? placement.subStats.slice(0, piece?.maxSubStats || 4) : [],
    row: Number(placement?.row) || 0,
    col: Number(placement?.col) || 0,
    rotation: Number(placement?.rotation) || 0,
  }
}

export function createRequiredPiecesFromCartridge(cartridgeId, cartridgeList) {
  const cartridge = cartridgeList?.find((item) => item.id === cartridgeId || item.slug === cartridgeId) || getCartridgeById(cartridgeId)
  const shapes = cartridge?.requiredSetPieceShapeIds || cartridge?.compatibleModuleShapeIds || cartridge?.requiredSetPieces?.map((module) => module.moduleShapeId) || cartridge?.compatibleModules?.map((module) => module.moduleShapeId) || []
  return shapes.map((shapeId, index) => normalizeRequiredPiece({ moduleShapeId: shapeId }, index))
}

export function normalizeConsole(characterOrConsole) {
  const direct = characterOrConsole?.console
  const setup = direct || characterOrConsole?.consoleSetup || characterOrConsole || null
  if (!setup || typeof setup !== 'object') return null

  const mainCartridgeName = setup.mainCartridgeName || setup.mainCartridge || ''
  const cartridge = getCartridgeById(setup.mainCartridgeId) || getCartridgeById(slugify(mainCartridgeName))
  const mainCartridgeId = cartridge?.id || setup.mainCartridgeId || slugify(mainCartridgeName)
  const arcWeapon = getWeaponById(setup.arcId) || getWeaponByName(setup.arcName || setup.arc)
  const cartridgePieces = createRequiredPiecesFromCartridge(mainCartridgeId)
  const requiredPieces = cartridgePieces.length
    ? cartridgePieces
    : Array.isArray(setup.requiredPieces)
      ? setup.requiredPieces.map(normalizeRequiredPiece).slice(0, 4)
      : []
  const grid = setup.grid || {}
  const rawPlacements = grid.placements || grid.placedPieces || grid.modules || grid.placedModules || []

  return {
    title: String(setup.title || 'Console Setup'),
    description: String(setup.description || ''),
    mainCartridgeId: String(mainCartridgeId || ''),
    mainCartridgeName: String(cartridge?.name || mainCartridgeName || ''),
    arcId: String(arcWeapon?.id || setup.arcId || slugify(setup.arcName || setup.arc || '')),
    arcName: String(arcWeapon?.name || setup.arcName || setup.arc || ''),
    rarityPriority: Array.isArray(setup.rarityPriority) ? setup.rarityPriority.join(' > ') : String(setup.rarityPriority || 'S > A > B'),
    trait: {
      title: String(setup.trait?.title || 'Console Trait'),
      description: String(setup.trait?.description || setup.description || ''),
    },
    cartridgeBonuses: Array.isArray(setup.cartridgeBonuses) && setup.cartridgeBonuses.length
      ? setup.cartridgeBonuses.map((bonus, index) => ({ pieces: Number(bonus.pieces) || (index === 0 ? 2 : 4), text: String(bonus.text || '') }))
      : Array.isArray(setup.cartridgeEffects)
        ? setup.cartridgeEffects.map(parseBonus)
        : cartridge?.bonuses || [],
    requiredPieces,
    grid: {
      rows: Number(grid.rows) || 7,
      cols: Number(grid.cols) || 7,
      blockedCells: Array.isArray(grid.blockedCells) ? grid.blockedCells : DEFAULT_BLOCKED_CELLS,
      placements: Array.isArray(rawPlacements) ? rawPlacements.map((placement, index) => normalizePlacement(placement, index, requiredPieces)) : [],
    },
    notes: Array.isArray(setup.notes) ? setup.notes.map((note) => String(note)) : [
      'Layout colors are used only to distinguish module placement. They do not indicate required rarity. Prioritize S-rank modules whenever possible; use A-rank or B-rank as fallback options.',
    ],
  }
}
