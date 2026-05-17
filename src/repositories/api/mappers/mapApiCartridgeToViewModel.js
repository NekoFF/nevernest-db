import { cartridges as staticCartridges } from '../../../data/cartridges.js'
import { displayValue, findStaticEntity, idOf } from './taxonomyLookups.js'

export function mapApiCartridgeToViewModel(row) {
  const raw = row?.raw && typeof row.raw === 'object' ? row.raw : {}
  const staticMatch = findStaticEntity(staticCartridges, row) || {}

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
    bonuses: row.bonuses?.length ? row.bonuses : raw.bonuses || staticMatch.bonuses || [],
    icon: row.media?.path || raw.icon || staticMatch.icon,
    compatibleModules: row.compatibleShapes?.length ? row.compatibleShapes.map((item) => item.shape?.name || item.shapeExternalId).filter(Boolean) : raw.compatibleModules || staticMatch.compatibleModules || [],
    compatibleModuleShapeIds: row.compatibleShapes?.length ? row.compatibleShapes.map((item) => item.shape?.externalId || item.shapeExternalId).filter(Boolean) : raw.compatibleModuleShapeIds || staticMatch.compatibleModuleShapeIds || [],
    compatibleModulesStatus: raw.compatibleModulesStatus || staticMatch.compatibleModulesStatus || row.dataStatus || '',
    dataStatus: row.dataStatus || raw.dataStatus || staticMatch.dataStatus,
    sourceStatus: row.sourceStatus,
    publicationStatus: row.publicationStatus,
  }
}
