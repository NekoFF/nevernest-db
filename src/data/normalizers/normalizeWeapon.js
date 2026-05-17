import { cloneRaw, entityBase, stringOrEmpty } from './normalizeShared.js'

export function normalizeWeaponForExport(weapon = {}) {
  const base = entityBase(weapon, 'weapon')
  return {
    ...base,
    rarity: stringOrEmpty(weapon.rarity),
    arcTypeId: stringOrEmpty(weapon.type).toLowerCase(),
    quote: stringOrEmpty(weapon.quote),
    shortDescription: stringOrEmpty(weapon.shortDescription),
    mainStat: { statId: stringOrEmpty(weapon.mainStat?.type || 'ATK'), value: weapon.mainStat?.value ?? null },
    subStat: { statId: stringOrEmpty(weapon.subStat?.type), value: weapon.subStat?.value ?? null },
    refinements: Array.isArray(weapon.refinements) ? weapon.refinements.map((row) => ({ weaponId: base.id, rank: Number(row.rank), effectText: stringOrEmpty(row.effect) })) : [],
    growthStats: Array.isArray(weapon.growthScaling) ? weapon.growthScaling.map((row) => ({
      weaponId: base.id,
      level: Number(row.level),
      atk: Number(row.atk),
      subStatId: stringOrEmpty(row.subStatType || weapon.subStat?.type),
      subStatValue: row.subStatValue ?? weapon.subStat?.value ?? null,
    })) : [],
    recommendedCharacterIds: Array.isArray(weapon.recommendedCharacters) ? weapon.recommendedCharacters.map(String) : [],
    raw: cloneRaw(weapon),
  }
}

