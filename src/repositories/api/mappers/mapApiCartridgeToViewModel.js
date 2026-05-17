import { cartridges as staticCartridges } from '../../../data/cartridges.js'
import { displayValue, findStaticEntity, idOf } from './taxonomyLookups.js'

function normalizeBonus(bonus) {
  if (!bonus || typeof bonus !== 'object') return null
  const text = bonus.text || bonus.effectText || bonus.effect || ''
  if (!text) return null
  return {
    ...bonus,
    text,
    effectText: bonus.effectText || text,
  }
}

function normalizeBonuses(row, raw, staticMatch) {
  const source = row?.bonuses?.length ? row.bonuses : raw.bonuses || staticMatch.bonuses || []
  return source.map(normalizeBonus).filter(Boolean)
}

function normalizeCompatibleModules(row, raw, staticMatch) {
  if (row?.compatibleShapes?.length) {
    return row.compatibleShapes.map((item) => ({
      slot: item.slotIndex,
      moduleShapeId: item.shape?.externalId || item.shapeExternalId || null,
      shapeSignature: item.shape?.name || item.shapeExternalId || '',
      sourceStatus: item.sourceStatus,
    }))
  }
  return raw.compatibleModules || staticMatch.compatibleModules || []
}

export function mapApiCartridgeToViewModel(row) {
  const raw = row?.raw && typeof row.raw === 'object' ? row.raw : {}
  const staticMatch = findStaticEntity(staticCartridges, row) || {}
  const compatibleModules = normalizeCompatibleModules(row, raw, staticMatch)

  return {
    ...staticMatch,
    ...raw,
    id: idOf(row),
    externalId: row.externalId,
    slug: row.slug || row.externalId || row.id,
    name: row.name || raw.name || staticMatch.name,
    theme: displayValue(row.element) || raw.theme || staticMatch.theme || raw.element || staticMatch.element || 'Unknown',
    element: displayValue(row.element) || raw.element || staticMatch.element || raw.theme || staticMatch.theme || 'Unknown',
    bonusCategory: row.bonusCategoryLabel || row.bonusCategory || raw.bonusCategory || staticMatch.bonusCategory || 'support',
    description: row.description || raw.description || staticMatch.description || '',
    availableRarities: raw.availableRarities || staticMatch.availableRarities || ['B', 'A', 'S'],
    bonuses: normalizeBonuses(row, raw, staticMatch),
    icon: row.media?.path || raw.icon || staticMatch.icon,
    compatibleModules,
    compatibleModuleShapeIds: row.compatibleShapes?.length ? compatibleModules.map((item) => item.moduleShapeId).filter(Boolean) : raw.compatibleModuleShapeIds || staticMatch.compatibleModuleShapeIds || [],
    compatibleModulesStatus: raw.compatibleModulesStatus || staticMatch.compatibleModulesStatus || row.dataStatus || '',
    dataStatus: row.dataStatus || raw.dataStatus || staticMatch.dataStatus,
    sourceStatus: row.sourceStatus,
    publicationStatus: row.publicationStatus,
  }
}
