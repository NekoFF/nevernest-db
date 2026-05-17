import { validateTableBasics, refCheck, issue, SEVERITY, setOf } from './shared.mjs'

export function validateWeaponPayloads(payloads) {
  const issues = []
  const rarityIds = setOf(payloads.taxonomy.rarities)
  const arcTypeIds = setOf(payloads.taxonomy.arcTypes)
  const statIds = setOf(payloads.taxonomy.stats)
  const weaponIds = setOf(payloads.weapons.weapons)
  const characterIds = setOf(payloads.characters.characters)
  validateTableBasics(issues, 'weapons', payloads.weapons.weapons, ['external_id', 'slug', 'name'])
  refCheck(issues, 'weapons', payloads.weapons.weapons, 'rarity_external_id', rarityIds, 'rarities')
  refCheck(issues, 'weapons', payloads.weapons.weapons, 'arc_type_external_id', arcTypeIds, 'arc_types')
  refCheck(issues, 'weapons', payloads.weapons.weapons, 'main_stat_external_id', statIds, 'stats', SEVERITY.BLOCKER)
  refCheck(issues, 'weapons', payloads.weapons.weapons, 'sub_stat_external_id', statIds, 'stats', SEVERITY.BLOCKER)
  refCheck(issues, 'weapon_growth_stats', payloads.weapons.weaponGrowthStats, 'weapon_external_id', weaponIds, 'weapons')
  refCheck(issues, 'weapon_growth_stats', payloads.weapons.weaponGrowthStats, 'stat_external_id', statIds, 'stats', SEVERITY.BLOCKER)
  refCheck(issues, 'weapon_recommended_characters', payloads.weapons.weaponRecommendedCharacters, 'character_external_id', characterIds, 'characters')
  if (!payloads.weapons.weaponRecommendedCharacters.length) issues.push(issue(SEVERITY.INFO, 'weapon_recommended_characters', 'No weapon recommended character rows mapped from current seed data.'))
  return issues
}

