import { getModulePieceById, getModulePieceByShapeAndRarity, getModuleShapeOptions, modulePieces } from '../../../data/modulePieces.js'
import { displayValue, findStaticEntity, idOf, resolveRarity } from './taxonomyLookups.js'

function normalizeModuleType(value) {
  const match = String(value || '').match(/([IVX]+)/i)
  return match?.[1] || 'II'
}

export function mapApiModuleShapeToViewModel(row) {
  const staticShape = getModuleShapeOptions().find((shape) => shape.id === row?.externalId || shape.id === row?.slug) || {}
  const moduleType = normalizeModuleType(row?.moduleType || staticShape.moduleType)
  return {
    ...staticShape,
    id: row?.externalId || row?.slug || staticShape.id || idOf(row),
    externalId: row?.externalId,
    slug: row?.slug || row?.externalId,
    name: row?.name || staticShape.name || `Type ${moduleType} Module`,
    moduleType,
    width: row?.width ?? staticShape.width,
    height: row?.height ?? staticShape.height,
    cellCount: row?.cellCount ?? staticShape.cellCount,
    sourceStatus: row?.sourceStatus,
  }
}

export function mapApiModulePieceToViewModel(row) {
  const staticPiece = getModulePieceById(row?.externalId)
    || findStaticEntity(modulePieces, row)
    || null
  const rarity = displayValue(row?.rarity) || staticPiece?.rarity || resolveRarity(row?.rarity)
  const shapeId = row?.moduleShape?.externalId || staticPiece?.shapeId || row?.moduleShapeExternalId || row?.shapeId
  const fallback = shapeId ? getModulePieceByShapeAndRarity(shapeId, rarity) : null
  const base = staticPiece || fallback || {}

  return {
    ...base,
    id: row?.externalId || base.id || idOf(row),
    externalId: row?.externalId,
    slug: row?.slug || row?.externalId || base.slug,
    name: row?.name || base.name || `Type ${normalizeModuleType(row?.moduleType)} Module`,
    rarity: base.rarity || rarity || 'Unknown',
    moduleType: normalizeModuleType(row?.moduleType || base.moduleType),
    shapeId: base.shapeId || shapeId || row?.moduleShapeId,
    shapeName: row?.moduleShape?.name || base.shapeName,
    cellCount: row?.moduleShape?.cellCount ?? base.cellCount,
    mainStats: row?.mainStat ? [{ type: displayValue(row.mainStat.stat), value: row.mainStat.valueText || row.mainStat.value }] : base.mainStats || [],
    sourceStatus: row?.sourceStatus,
  }
}
