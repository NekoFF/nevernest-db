import { getModuleShape } from '../data/moduleCatalog.js'

const warnedShapeIds = new Set()
const warnedCartridges = new Set()

export function asArray(value) {
  return Array.isArray(value) ? value : []
}

export function normalizePlacements(value) {
  return asArray(value).filter((item) => item && typeof item === 'object')
}

export function normalizeBlockedCells(value) {
  return asArray(value)
    .map((cell) => {
      if (Array.isArray(cell)) return [Number(cell[0]), Number(cell[1])]
      return [Number(cell?.row), Number(cell?.col)]
    })
    .filter(([row, col]) => Number.isFinite(row) && Number.isFinite(col))
}

export function getSafeCartridgeBonuses(cartridge) {
  return asArray(cartridge?.bonuses)
    .map((bonus) => {
      if (!bonus || typeof bonus !== 'object') return null
      return {
        ...bonus,
        pieces: Number(bonus.pieces),
        text: String(bonus.text || bonus.description || ''),
      }
    })
    .filter((bonus) => Number.isFinite(bonus.pieces))
}

export function getCartridgeBonus(cartridge, pieces) {
  return getSafeCartridgeBonuses(cartridge).find((bonus) => Number(bonus.pieces) === Number(pieces)) || null
}

export function normalizeModuleShapeRef(piece, index = 0) {
  const source = piece && typeof piece === 'object' ? piece : {}
  const rawShapeId = typeof piece === 'string' ? piece : source.moduleShapeId || source.shapeId || ''
  const shapeId = String(rawShapeId || '')
  const shape = shapeId ? getModuleShape(shapeId) : null
  if (!shapeId || shape?.isPlaceholder) {
    if (shapeId && import.meta.env?.DEV && !warnedShapeIds.has(shapeId)) {
      warnedShapeIds.add(shapeId)
      console.warn(`[NTE] Cartridge references unknown module shape "${shapeId}". The set piece will be treated as pending until cartridge data is updated.`)
    }
    return null
  }
  return {
    ...source,
    id: String(source.id || `compatible-piece-${index + 1}`),
    label: source.label || `Slot ${Number(source.slot) || index + 1}`,
    slot: Number(source.slot) || index + 1,
    moduleShapeId: shapeId,
    shapeId,
    moduleType: source.moduleType || shape?.type || shape?.moduleType || '',
    preferredRarity: source.preferredRarity || source.rarity || 'S',
  }
}

export function getCartridgeModuleShapeRefs(cartridge, fallbackPieces = []) {
  const directPieces = asArray(cartridge?.requiredSetPieces)
  const compatiblePieces = asArray(cartridge?.compatibleModules)
  const shapeIds = [
    ...asArray(cartridge?.requiredSetPieceShapeIds),
    ...asArray(cartridge?.compatibleModuleShapeIds),
  ].filter(Boolean)
  const rawPieces = directPieces.length
    ? directPieces
    : compatiblePieces.length
      ? compatiblePieces
      : shapeIds.length
        ? shapeIds
        : asArray(fallbackPieces)

  const refs = rawPieces.map(normalizeModuleShapeRef).filter(Boolean)
  if (cartridge && import.meta.env?.DEV) {
    const key = cartridge.id || cartridge.slug || cartridge.name || 'unknown-cartridge'
    const hasIncompleteStatus = cartridge.dataStatus === 'missing-compatible-shapes'
    const hasInvalidRefs = rawPieces.length > refs.length
    if ((hasIncompleteStatus || hasInvalidRefs || refs.length < 4) && !warnedCartridges.has(key)) {
      warnedCartridges.add(key)
      console.warn(`[NTE] Cartridge "${cartridge.name || key}" has incomplete compatible module shape data. Set bonuses will only count real, resolvable required shapes; 4-piece requires four matched module objects.`, {
        cartridgeId: cartridge.id || cartridge.slug,
        dataStatus: cartridge.dataStatus || null,
        rawRequiredPieces: rawPieces,
        resolvedShapeIds: refs.map((piece) => piece.moduleShapeId),
      })
    }
  }
  return refs
}

export function getCartridgeModuleShapeIds(cartridge, fallbackPieces = []) {
  return getCartridgeModuleShapeRefs(cartridge, fallbackPieces)
    .map((piece) => piece.moduleShapeId || piece.shapeId)
    .filter(Boolean)
}
