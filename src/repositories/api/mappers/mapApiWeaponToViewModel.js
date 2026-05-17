import { weapons as staticWeapons } from '../../../data/weapons.js'
import { displayValue, findStaticEntity, formatViewStat, idOf, resolveArcType, resolveRarity, resolveStatName } from './taxonomyLookups.js'

function statBlock(apiStat, rawStat, staticStat, idValue, numericValue) {
  if (apiStat?.stat || apiStat?.valueText) {
    return {
      type: displayValue(apiStat.stat) || resolveStatName(apiStat.statId),
      value: apiStat.valueText || formatViewStat(apiStat.stat?.externalId || apiStat.statId, apiStat.value),
    }
  }
  if (rawStat?.type || rawStat?.value) return rawStat
  if (staticStat?.type || staticStat?.value) return staticStat
  const type = resolveStatName(idValue)
  return {
    type,
    value: formatViewStat(idValue, numericValue),
  }
}

function growthRows(row, raw, staticMatch) {
  const rows = row.growthScaling?.length ? row.growthScaling : raw.growthScaling?.length ? raw.growthScaling : staticMatch.growthScaling || []
  return rows.map((entry) => ({
    ...entry,
    subStatType: displayValue(entry.stat) || resolveStatName(entry.subStatType || entry.statId),
    subStatValue: entry.valueText || (formatViewStat(entry.stat?.externalId || entry.statId || entry.subStatType, entry.subStatValue ?? entry.value) ?? entry.subStatValue),
  }))
}

export function mapApiWeaponToViewModel(row) {
  const raw = row?.raw && typeof row.raw === 'object' ? row.raw : {}
  const staticMatch = findStaticEntity(staticWeapons, row) || {}
  const mainStat = statBlock(row.mainStat, raw.mainStat, staticMatch.mainStat, row.mainStatId, row.mainStatValue)
  const subStat = statBlock(row.subStat, raw.subStat, staticMatch.subStat, row.subStatId, row.subStatValue)

  return {
    ...staticMatch,
    ...raw,
    id: idOf(row),
    externalId: row.externalId,
    slug: row.slug || row.externalId || row.id,
    name: row.name || raw.name || staticMatch.name,
    rarity: resolveRarity(displayValue(row.rarity) || raw.rarity || staticMatch.rarity),
    type: resolveArcType(displayValue(row.arcType) || raw.type || staticMatch.type || row.type),
    image: row.media?.path || raw.image || staticMatch.image,
    quote: row.quote || raw.quote || staticMatch.quote || '',
    shortDescription: raw.shortDescription || staticMatch.shortDescription || row.description || '',
    description: row.description || raw.description || staticMatch.description || raw.shortDescription || '',
    mainStat,
    subStat,
    refinements: row.refinements?.length ? row.refinements : raw.refinements || staticMatch.refinements || [],
    growthScaling: growthRows(row, raw, staticMatch),
    sourceStatus: row.sourceStatus,
    publicationStatus: row.publicationStatus,
  }
}
