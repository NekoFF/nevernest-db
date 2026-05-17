import { normalizeRegistryStatKey } from '../utils/statAliases.js'

/**
 * @typedef {'core' | 'offense' | 'defense' | 'healing' | 'elemental-damage' | 'elemental-resistance' | 'special'} StatCategory
 * @typedef {'flat' | 'percent' | 'integer'} StatValueType
 * @typedef {{
 *   id: string,
 *   name: string,
 *   shortName?: string,
 *   ruName?: string,
 *   description?: string,
 *   category: StatCategory,
 *   valueType: StatValueType,
 *   iconKey: string,
 *   allowedAsMainStat: boolean,
 *   allowedAsSubStat: boolean,
 *   allowedAsWeaponSubStat?: boolean,
 *   allowedAsCharacterStat?: boolean,
 *   sortOrder: number,
 * }} StatDefinition
 */

const MAIN_STAT_IDS = new Set([
  'atk_percent',
  'hp_percent',
  'def_percent',
  'crit_rate',
  'crit_dmg',
  'dmg_bonus',
  'cosmos_dmg_bonus',
  'anima_dmg_bonus',
  'incantation_dmg_bonus',
  'chaos_dmg_bonus',
  'psyche_dmg_bonus',
  'lakshana_dmg_bonus',
  'cognitive_dmg_bonus',
  'healing_bonus',
  'essentia',
  'break_intensity',
])

const SUB_STAT_IDS = new Set([
  'atk',
  'atk_percent',
  'hp',
  'hp_percent',
  'def',
  'def_percent',
  'crit_rate',
  'crit_dmg',
  'dmg_bonus',
  'essentia',
  'break_intensity',
])

const WEAPON_SUB_STAT_IDS = new Set([
  'atk_percent',
  'hp',
  'hp_percent',
  'def',
  'def_percent',
  'crit_rate',
  'crit_dmg',
  'break_intensity',
  'charge_efficiency',
  'healing_bonus',
])

function stat(def) {
  return {
    allowedAsMainStat: MAIN_STAT_IDS.has(def.id),
    allowedAsSubStat: SUB_STAT_IDS.has(def.id),
    allowedAsWeaponSubStat: WEAPON_SUB_STAT_IDS.has(def.id),
    allowedAsCharacterStat: true,
    shortName: def.name,
    ...def,
  }
}

/** @type {StatDefinition[]} */
export const stats = [
  stat({ id: 'atk', name: 'ATK', displayName: 'Attack', ruName: 'Атака', category: 'core', valueType: 'flat', iconKey: 'sword', sortOrder: 10 }),
  stat({ id: 'atk_percent', name: 'ATK%', displayName: 'Attack %', ruName: 'Атака %', category: 'core', valueType: 'percent', iconKey: 'sword-percent', sortOrder: 11 }),
  stat({ id: 'hp', name: 'HP', displayName: 'HP', ruName: 'ОЗ', category: 'core', valueType: 'flat', iconKey: 'heart', sortOrder: 20 }),
  stat({ id: 'hp_percent', name: 'HP%', displayName: 'HP %', ruName: 'ОЗ %', category: 'core', valueType: 'percent', iconKey: 'heart-percent', sortOrder: 21 }),
  stat({ id: 'def', name: 'DEF', displayName: 'Defense', ruName: 'Защита', category: 'core', valueType: 'flat', iconKey: 'shield', sortOrder: 30 }),
  stat({ id: 'def_percent', name: 'DEF%', displayName: 'Defense %', ruName: 'Защита %', category: 'core', valueType: 'percent', iconKey: 'shield-percent', sortOrder: 31 }),
  stat({ id: 'crit_rate', name: 'CRIT Rate', displayName: 'Critical Rate', ruName: 'Шанс крит. удара', category: 'offense', valueType: 'percent', iconKey: 'crosshair', sortOrder: 40 }),
  stat({ id: 'crit_dmg', name: 'CRIT DMG', displayName: 'Critical Damage', ruName: 'Крит. урон', category: 'offense', valueType: 'percent', iconKey: 'target', sortOrder: 41 }),
  stat({ id: 'charge_efficiency', name: 'Charge Efficiency', displayName: 'Charge Efficiency', ruName: 'Эффективность зарядки', category: 'special', valueType: 'percent', iconKey: 'energy', sortOrder: 50 }),
  stat({ id: 'essentia', name: 'Essentia', displayName: 'Essentia', ruName: 'Эссентия', category: 'special', valueType: 'flat', iconKey: 'essentia', sortOrder: 51 }),
  stat({ id: 'break_intensity', name: 'Break Intensity', displayName: 'Break Intensity', ruName: 'Интенсивность разрушения', category: 'special', valueType: 'flat', iconKey: 'break', sortOrder: 52 }),
  stat({ id: 'dmg_bonus', name: 'DMG Bonus', displayName: 'Damage Bonus', ruName: 'Бонус к урону', category: 'offense', valueType: 'percent', iconKey: 'triangle', sortOrder: 60 }),
  stat({ id: 'cosmos_dmg_bonus', name: 'Cosmos DMG Bonus', displayName: 'Cosmos Damage Bonus', ruName: 'Бонус к урону космоса', category: 'elemental-damage', valueType: 'percent', iconKey: 'cosmos', sortOrder: 70 }),
  stat({ id: 'anima_dmg_bonus', name: 'Anima DMG Bonus', displayName: 'Anima Damage Bonus', ruName: 'Бонус к урону анимы', category: 'elemental-damage', valueType: 'percent', iconKey: 'anima', sortOrder: 71 }),
  stat({ id: 'incantation_dmg_bonus', name: 'Incantation DMG Bonus', displayName: 'Incantation Damage Bonus', ruName: 'Бонус к урону чар', category: 'elemental-damage', valueType: 'percent', iconKey: 'incantation', sortOrder: 72 }),
  stat({ id: 'chaos_dmg_bonus', name: 'Chaos DMG Bonus', displayName: 'Chaos Damage Bonus', ruName: 'Бонус к урону хаоса', category: 'elemental-damage', valueType: 'percent', iconKey: 'chaos', sortOrder: 73 }),
  stat({ id: 'psyche_dmg_bonus', name: 'Psyche DMG Bonus', displayName: 'Psyche Damage Bonus', ruName: 'Бонус к урону психики', category: 'elemental-damage', valueType: 'percent', iconKey: 'psyche', sortOrder: 74 }),
  stat({ id: 'lakshana_dmg_bonus', name: 'Lakshana DMG Bonus', displayName: 'Lakshana Damage Bonus', ruName: 'Бонус к урону лакшаны', category: 'elemental-damage', valueType: 'percent', iconKey: 'lakshana', sortOrder: 75 }),
  stat({ id: 'cognitive_dmg_bonus', name: 'Mental DMG Bonus', displayName: 'Mental Damage Bonus', ruName: 'Бонус к урону когнитивности', category: 'elemental-damage', valueType: 'percent', iconKey: 'cognitive', sortOrder: 76 }),
  stat({ id: 'healing_bonus', name: 'Healing Bonus', displayName: 'Healing Bonus', ruName: 'Бонус к лечению', category: 'healing', valueType: 'percent', iconKey: 'healing', sortOrder: 80 }),
  stat({ id: 'incoming_healing_bonus', name: 'Incoming Healing Bonus', displayName: 'Incoming Healing Bonus', ruName: 'Бонус к полученному лечению', category: 'healing', valueType: 'percent', iconKey: 'incoming-healing', sortOrder: 81 }),
  stat({ id: 'cosmos_res', name: 'Cosmos RES', displayName: 'Cosmos Resistance', ruName: 'Сопр. урону космоса', category: 'elemental-resistance', valueType: 'percent', iconKey: 'cosmos-res', sortOrder: 90 }),
  stat({ id: 'anima_res', name: 'Anima RES', displayName: 'Anima Resistance', ruName: 'Сопр. урону анимы', category: 'elemental-resistance', valueType: 'percent', iconKey: 'anima-res', sortOrder: 91 }),
  stat({ id: 'incantation_res', name: 'Incantation RES', displayName: 'Incantation Resistance', ruName: 'Сопр. урону чар', category: 'elemental-resistance', valueType: 'percent', iconKey: 'incantation-res', sortOrder: 92 }),
  stat({ id: 'chaos_res', name: 'Chaos RES', displayName: 'Chaos Resistance', ruName: 'Сопр. урону хаоса', category: 'elemental-resistance', valueType: 'percent', iconKey: 'chaos-res', sortOrder: 93 }),
  stat({ id: 'psyche_res', name: 'Psyche RES', displayName: 'Psyche Resistance', ruName: 'Сопр. урону психики', category: 'elemental-resistance', valueType: 'percent', iconKey: 'psyche-res', sortOrder: 94 }),
  stat({ id: 'lakshana_res', name: 'Lakshana RES', displayName: 'Lakshana Resistance', ruName: 'Сопр. урону лакшаны', category: 'elemental-resistance', valueType: 'percent', iconKey: 'lakshana-res', sortOrder: 95 }),
  stat({ id: 'cognitive_res', name: 'Cognitive RES', displayName: 'Cognitive Resistance', ruName: 'Сопр. урону когнитивности', category: 'elemental-resistance', valueType: 'percent', iconKey: 'cognitive-res', sortOrder: 96 }),
].sort((a, b) => a.sortOrder - b.sortOrder)

const legacyIds = {
  charge_speed: 'charge_efficiency',
  cognition_dmg_bonus: 'cognitive_dmg_bonus',
  cognition_res: 'cognitive_res',
  atk_flat: 'atk',
  hp_flat: 'hp',
  def_flat: 'def',
  cosmos_dmg: 'cosmos_dmg_bonus',
  anima_dmg: 'anima_dmg_bonus',
  incantation_dmg: 'incantation_dmg_bonus',
  chaos_dmg: 'chaos_dmg_bonus',
  psyche_dmg: 'psyche_dmg_bonus',
  lakshana_dmg: 'lakshana_dmg_bonus',
  cognition_dmg: 'cognitive_dmg_bonus',
  mental_dmg: 'cognitive_dmg_bonus',
  essence: 'essentia',
}

export const statAvailability = {
  mainStats: stats.filter((stat) => stat.allowedAsMainStat).map((stat) => stat.id),
  subStats: stats.filter((stat) => stat.allowedAsSubStat).map((stat) => stat.id),
  weaponSubStats: stats.filter((stat) => stat.allowedAsWeaponSubStat).map((stat) => stat.id),
  characterStats: stats.filter((stat) => stat.allowedAsCharacterStat).map((stat) => stat.id),
}

export function getAllStats() {
  return stats
}

export function getStatById(id) {
  const directId = legacyIds[id] || id
  const direct = stats.find((stat) => stat.id === directId)
  if (direct) return direct
  const resolvedId = normalizeRegistryStatKey(id, { source: 'stat-registry' }) || id
  return stats.find((stat) => stat.id === resolvedId) || null
}

export function getMainStatOptions() {
  return stats.filter((stat) => stat.allowedAsMainStat)
}

export function getSubStatOptions() {
  return stats.filter((stat) => stat.allowedAsSubStat)
}

export function getWeaponSubStatOptions() {
  return stats.filter((stat) => stat.allowedAsWeaponSubStat)
}

export function getCharacterStatOptions() {
  return stats.filter((stat) => stat.allowedAsCharacterStat)
}

export function getStatDisplayName(statId) {
  return getStatById(statId)?.name || String(statId || 'Unknown stat')
}

export function formatStatValue(statId, value) {
  if (value == null || value === '') return ''
  const stat = getStatById(statId)
  if (!stat) return String(value)
  const text = String(value)
  if (stat.valueType === 'percent' && !text.includes('%')) return `${text}%`
  return text
}

export function findStatByLabel(label) {
  const normalized = String(label || '').trim().toLowerCase()
  if (!normalized) return null
  const byAlias = getStatById(normalizeRegistryStatKey(label, { source: 'stat-label' }))
  if (byAlias) return byAlias
  const compact = normalized.replace(/\s+/g, ' ')
  const aliases = {
    atk: 'atk',
    'attack': 'atk',
    'атака': 'atk',
    'atk %': 'atk_percent',
    'atk%': 'atk_percent',
    'attack %': 'atk_percent',
    'атака %': 'atk_percent',
    hp: 'hp',
    'оз': 'hp',
    'hp %': 'hp_percent',
    'hp%': 'hp_percent',
    'оз %': 'hp_percent',
    def: 'def',
    defense: 'def',
    'защита': 'def',
    'def %': 'def_percent',
    'def%': 'def_percent',
    'защита %': 'def_percent',
    'crit rate': 'crit_rate',
    'crit rate %': 'crit_rate',
    'crit rate%': 'crit_rate',
    'шанс крит. удара': 'crit_rate',
    'шанс крит. удара %': 'crit_rate',
    'crit dmg': 'crit_dmg',
    'crit dmg %': 'crit_dmg',
    'crit dmg%': 'crit_dmg',
    'крит. урон': 'crit_dmg',
    'крит. урон %': 'crit_dmg',
    'charge speed': 'charge_efficiency',
    'charge efficiency': 'charge_efficiency',
    'скорость зарядки': 'charge_efficiency',
    'эффективность зарядки': 'charge_efficiency',
    essentia: 'essentia',
    'эссентия': 'essentia',
    'break intensity': 'break_intensity',
    'интенсивность разрушения': 'break_intensity',
    'dmg bonus': 'dmg_bonus',
    'dmg %': 'dmg_bonus',
    'dmg%': 'dmg_bonus',
    'universal dmg': 'dmg_bonus',
    'universal dmg %': 'dmg_bonus',
    'бонус к урону': 'dmg_bonus',
    'бонус к урону %': 'dmg_bonus',
    'anima dmg': 'anima_dmg_bonus',
    'anima dmg %': 'anima_dmg_bonus',
    'anima dmg%': 'anima_dmg_bonus',
    'бонус к урону анимы': 'anima_dmg_bonus',
    'бонус к урону анимы %': 'anima_dmg_bonus',
    'cosmos dmg': 'cosmos_dmg_bonus',
    'cosmos dmg %': 'cosmos_dmg_bonus',
    'бонус к урону космоса': 'cosmos_dmg_bonus',
    'бонус к урону космоса %': 'cosmos_dmg_bonus',
    'incantation dmg': 'incantation_dmg_bonus',
    'incantation dmg %': 'incantation_dmg_bonus',
    'бонус к урону чар': 'incantation_dmg_bonus',
    'бонус к урону чар %': 'incantation_dmg_bonus',
    'chaos dmg': 'chaos_dmg_bonus',
    'chaos dmg %': 'chaos_dmg_bonus',
    'бонус к урону хаоса': 'chaos_dmg_bonus',
    'бонус к урону хаоса %': 'chaos_dmg_bonus',
    'psyche dmg': 'psyche_dmg_bonus',
    'psyche dmg %': 'psyche_dmg_bonus',
    'бонус к урону психики': 'psyche_dmg_bonus',
    'бонус к урону психики %': 'psyche_dmg_bonus',
    'lakshana dmg': 'lakshana_dmg_bonus',
    'lakshana dmg %': 'lakshana_dmg_bonus',
    'бонус к урону лакшаны': 'lakshana_dmg_bonus',
    'бонус к урону лакшаны %': 'lakshana_dmg_bonus',
    'cognition dmg': 'cognitive_dmg_bonus',
    'cognition dmg %': 'cognitive_dmg_bonus',
    'cognitive dmg': 'cognitive_dmg_bonus',
    'cognitive dmg %': 'cognitive_dmg_bonus',
    'бонус к урону когнитивности': 'cognitive_dmg_bonus',
    'бонус к урону когнитивности %': 'cognitive_dmg_bonus',
    'healing bonus': 'healing_bonus',
    'бонус к лечению': 'healing_bonus',
    'бонус к лечению %': 'healing_bonus',
    'incoming healing bonus': 'incoming_healing_bonus',
    'бонус к полученному лечению': 'incoming_healing_bonus',
    'бонус к полученному лечению %': 'incoming_healing_bonus',
    'cosmos res': 'cosmos_res',
    'сопр. урону космоса': 'cosmos_res',
    'anima res': 'anima_res',
    'сопр. урону анимы': 'anima_res',
    'incantation res': 'incantation_res',
    'сопр. урону чар': 'incantation_res',
    'chaos res': 'chaos_res',
    'сопр. урону хаоса': 'chaos_res',
    'psyche res': 'psyche_res',
    'сопр. урону психики': 'psyche_res',
    'lakshana res': 'lakshana_res',
    'сопр. урону лакшаны': 'lakshana_res',
    'cognition res': 'cognitive_res',
    'cognitive res': 'cognitive_res',
    'сопр. урону когнитивности': 'cognitive_res',
  }
  if (aliases[compact]) return getStatById(aliases[compact])
  return stats.find((stat) => [stat.id, stat.name, stat.shortName, stat.displayName, stat.ruName].filter(Boolean).some((value) => String(value).toLowerCase() === compact)) || null
}

export function getStatsByIds(ids = []) {
  return ids.map((id) => getStatById(id)).filter(Boolean)
}
