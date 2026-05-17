import { weapons as staticWeapons } from '../../../data/weapons.js'
import { displayValue, findStaticEntity, formatViewStat, idOf, resolveArcType, resolveRarity, resolveStatName } from './taxonomyLookups.js'

function statBlock(apiStat, rawStat, staticStat, idValue, numericValue) {
  if (apiStat?.stat || apiStat?.externalId || apiStat?.valueText) {
    const statId = apiStat.stat?.externalId || apiStat.externalId || apiStat.statId || idValue
    return {
      type: displayValue(apiStat.stat || apiStat) || resolveStatName(apiStat.statId || statId),
      value: formatViewStat(statId, apiStat.value ?? numericValue) || apiStat.valueText,
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
  if (!row.growthScaling?.length) return raw.growthScaling?.length ? raw.growthScaling : staticMatch.growthScaling || []

  const mainStat = statBlock(row.mainStat, raw.mainStat, staticMatch.mainStat, row.mainStatId, row.mainStatValue)
  const subStat = statBlock(row.subStat, raw.subStat, staticMatch.subStat, row.subStatId, row.subStatValue)
  const mainLabel = String(mainStat?.type || '').trim().toLowerCase()
  const subLabel = String(subStat?.type || '').trim().toLowerCase()
  const byLevel = new Map()

  for (const entry of row.growthScaling) {
    const label = displayValue(entry.stat) || resolveStatName(entry.statId || entry.subStatType)
    const normalizedLabel = String(label || '').trim().toLowerCase()
    const value = formatViewStat(entry.stat?.externalId || entry.statId || label, entry.value ?? entry.subStatValue) || entry.valueText || entry.subStatValue
    const current = byLevel.get(entry.level) || { level: entry.level }

    if (entry.statId && entry.statId === row.mainStatId) current.atk = value
    else if (entry.statId && entry.statId === row.subStatId) {
      current.subStatType = label
      current.subStatValue = value
    } else if (normalizedLabel === mainLabel || normalizedLabel === 'atk' || normalizedLabel === 'attack') current.atk = value
    else if (normalizedLabel === subLabel) {
      current.subStatType = label
      current.subStatValue = value
    } else if (!current.subStatValue) {
      current.subStatType = label
      current.subStatValue = value
    }

    current.sourceStatus = current.sourceStatus || entry.sourceStatus
    byLevel.set(entry.level, current)
  }

  return [...byLevel.values()].sort((a, b) => Number(a.level) - Number(b.level))
}

function refinementRows(row, raw, staticMatch) {
  const rows = row.refinements?.length ? row.refinements : raw.refinements || staticMatch.refinements || []
  return rows.map((entry) => ({
    ...entry,
    effect: entry.effect || entry.effectText || '',
    effectText: entry.effectText || entry.effect || '',
  })).sort((a, b) => Number(a.rank) - Number(b.rank))
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
    refinements: refinementRows(row, raw, staticMatch),
    growthScaling: growthRows(row, raw, staticMatch),
    sourceStatus: row.sourceStatus,
    publicationStatus: row.publicationStatus,
  }
}
