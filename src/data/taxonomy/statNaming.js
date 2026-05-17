import { normalizeRegistryStatKey, getStatLabel } from '../../utils/statAliases.js'

/**
 * Stat naming policy for SQL readiness.
 *
 * Runtime calculators may continue using legacy camelCase planner keys. SQL/API data should use
 * registry ids such as `crit_rate` and `cognitive_dmg_bonus`. Current UI copy prefers "Mental"
 * for the damage bonus label, while the stable canonical id remains cognitive-based to avoid
 * duplicate stat rows.
 */
export const STAT_NAMING_POLICY = Object.freeze({
  canonicalIdStyle: 'snake_case_registry_id',
  cognitiveMentalPolicy: 'Use cognitive_* ids in data; show Mental labels where the current UI does.',
  duplicateIdRule: 'Do not create separate mental_* and cognitive_* stat ids for the same stat.',
})

export const statNamingAliases = Object.freeze({
  mental_dmg: 'cognitive_dmg_bonus',
  mental_damage: 'cognitive_dmg_bonus',
  mental_dmg_bonus: 'cognitive_dmg_bonus',
  cognition_dmg: 'cognitive_dmg_bonus',
  cognition_dmg_bonus: 'cognitive_dmg_bonus',
  cognitive_dmg: 'cognitive_dmg_bonus',
  cognitive_damage: 'cognitive_dmg_bonus',
})

export function normalizeCanonicalStatId(value) {
  return statNamingAliases[String(value || '').trim().toLowerCase()] || normalizeRegistryStatKey(value)
}

export function getCanonicalStatLabel(value) {
  return getStatLabel(value)
}

