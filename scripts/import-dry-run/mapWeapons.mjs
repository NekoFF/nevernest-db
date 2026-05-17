import { slug, toArray } from './loadSnapshot.mjs'
import { normalizeCanonicalStatId } from '../../src/data/taxonomy/statNaming.js'

export function mapWeapons(snapshot) {
  const weapons = []
  const weaponRefinements = []
  const weaponGrowthStats = []
  const weaponRecommendedCharacters = []

  for (const item of snapshot.data.weapons || []) {
    weapons.push({
      external_id: item.id,
      slug: item.slug || slug(item.name || item.id),
      name: item.name,
      rarity_external_id: item.rarity,
      arc_type_external_id: slug(item.type),
      quote: item.quote || '',
      description: item.shortDescription || '',
      main_stat_external_id: normalizeCanonicalStatId(item.mainStat?.type),
      main_stat_value: item.mainStat?.value ?? null,
      sub_stat_external_id: normalizeCanonicalStatId(item.subStat?.type),
      sub_stat_value: item.subStat?.value ?? null,
      source_status: 'unknown',
      raw: item,
    })
    for (const refinement of toArray(item.refinements)) {
      weaponRefinements.push({
        weapon_external_id: item.id,
        rank: refinement.rank,
        effect_text: refinement.effect || '',
        effect_json: {},
        source_status: 'unknown',
      })
    }
    for (const growth of toArray(item.growthScaling)) {
      weaponGrowthStats.push({
        weapon_external_id: item.id,
        level: Number(growth.level),
        stat_external_id: 'atk',
        value: growth.atk,
        source_status: 'unknown',
      })
      if (growth.subStatType && growth.subStatValue !== '' && growth.subStatValue != null) {
        weaponGrowthStats.push({
          weapon_external_id: item.id,
          level: Number(growth.level),
          stat_external_id: normalizeCanonicalStatId(growth.subStatType),
          value: growth.subStatValue,
          source_status: 'unknown',
        })
      }
    }
    for (const characterId of toArray(item.recommendedCharacters)) {
      weaponRecommendedCharacters.push({
        weapon_external_id: item.id,
        character_external_id: characterId,
        priority: 0,
        source_status: 'unknown',
      })
    }
  }

  return { weapons, weaponRefinements, weaponGrowthStats, weaponRecommendedCharacters }
}
