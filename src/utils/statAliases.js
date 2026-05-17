const KNOWN_WARNINGS = new Set()

const CANONICAL_STATS = {
  hp: { label: 'HP', registryId: 'hp' },
  hpPercent: { label: 'HP%', registryId: 'hp_percent' },
  atk: { label: 'ATK', registryId: 'atk' },
  atkPercent: { label: 'ATK%', registryId: 'atk_percent' },
  def: { label: 'DEF', registryId: 'def' },
  defPercent: { label: 'DEF%', registryId: 'def_percent' },
  critRate: { label: 'CRIT Rate', registryId: 'crit_rate' },
  critDmg: { label: 'CRIT DMG', registryId: 'crit_dmg' },
  chargeEfficiency: { label: 'Charge Efficiency', registryId: 'charge_efficiency' },
  essence: { label: 'Essence', registryId: 'essentia' },
  destructionIntensity: { label: 'Destruction Intensity', registryId: 'break_intensity' },
  damageBonus: { label: 'DMG Bonus', registryId: 'dmg_bonus' },
  cosmosDmg: { label: 'Cosmos DMG', registryId: 'cosmos_dmg_bonus' },
  animaDmg: { label: 'Anima DMG', registryId: 'anima_dmg_bonus' },
  incantationDmg: { label: 'Incantation DMG', registryId: 'incantation_dmg_bonus' },
  chaosDmg: { label: 'Chaos DMG', registryId: 'chaos_dmg_bonus' },
  psycheDmg: { label: 'Psyche DMG', registryId: 'psyche_dmg_bonus' },
  lakshanaDmg: { label: 'Lakshana DMG', registryId: 'lakshana_dmg_bonus' },
  // Stable internal key kept for backward compatibility. User-facing game term is Mental DMG.
  cognitiveDmg: { label: 'Mental DMG', registryId: 'cognitive_dmg_bonus' },
  healingBonus: { label: 'Healing Bonus', registryId: 'healing_bonus' },
  shieldBonus: { label: 'Shield Bonus', registryId: 'shield_bonus' },
}

function compact(value) {
  return String(value || '')
    .trim()
    .replace(/[%+]/g, ' percent ')
    .replace(/[_-]+/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\s+/g, ' ')
    .toLowerCase()
}

function key(value) {
  return compact(value).replace(/\s+/g, '')
}

const STAT_ALIASES = new Map()

function add(canonicalKey, aliases) {
  ;[canonicalKey, CANONICAL_STATS[canonicalKey]?.label, CANONICAL_STATS[canonicalKey]?.registryId, ...aliases]
    .filter(Boolean)
    .forEach((alias) => {
      STAT_ALIASES.set(compact(alias), canonicalKey)
      STAT_ALIASES.set(key(alias), canonicalKey)
    })
}

add('hp', ['HP', 'maxHp', 'Max HP', 'health'])
add('hpPercent', ['HP%', 'HP Percent', 'hp_percent', 'maxHpPercent', 'Max HP%', 'healthPercent'])
add('atk', ['ATK', 'attack', 'Attack'])
add('atkPercent', ['ATK%', 'Attack%', 'ATK Percent', 'Attack Percent', 'atk_percent', 'attackPercent'])
add('def', ['DEF', 'defense', 'Defense'])
add('defPercent', ['DEF%', 'Defense%', 'DEF Percent', 'Defense Percent', 'def_percent', 'defensePercent'])
add('critRate', ['critChance', 'Crit Rate', 'CRIT Rate', 'Crit Chance', 'CRIT Chance', 'crit_rate', 'cr'])
add('critDmg', ['critDamage', 'Crit DMG', 'CRIT DMG', 'Crit Damage', 'CRIT Damage', 'crit_dmg', 'cd'])
add('chargeEfficiency', ['energyRecharge', 'Charge Efficiency', 'Energy Recharge', 'charge_efficiency', 'chargeSpeed'])
add('essence', ['Essence', 'essentia', 'Essentia'])
add('destructionIntensity', ['breakIntensity', 'Destruction Intensity', 'Break Intensity', 'break_intensity'])
add('damageBonus', ['dmgBonus', 'Damage Bonus', 'DMG Bonus', 'dmg_bonus'])
add('cosmosDmg', ['cosmosDamage', 'Cosmos DMG', 'Cosmos Damage', 'cosmos_dmg', 'cosmos_dmg_bonus'])
add('animaDmg', ['animaDamage', 'Anima DMG', 'Anima Damage', 'anima_dmg', 'anima_dmg_bonus'])
add('incantationDmg', ['incantationDamage', 'Incantation DMG', 'Incantation Damage', 'incantation_dmg', 'incantation_dmg_bonus'])
add('chaosDmg', ['chaosDamage', 'Chaos DMG', 'Chaos Damage', 'chaos_dmg', 'chaos_dmg_bonus'])
add('psycheDmg', ['psycheDamage', 'Psyche DMG', 'Psyche Damage', 'psyche_dmg', 'psyche_dmg_bonus'])
add('lakshanaDmg', ['lakshanaDamage', 'Lakshana DMG', 'Lakshana Damage', 'lakshana_dmg', 'lakshana_dmg_bonus'])
add('cognitiveDmg', [
  'cognitiveDamage',
  'mentalDmg',
  'mentalDamage',
  'Cognitive DMG',
  'Cognitive Damage',
  'Mental DMG',
  'Mental Damage',
  'cognitionDmg',
  'cognitionDamage',
  'cognitive_dmg',
  'cognition_dmg',
  'mental_dmg',
  'cognitive_dmg_bonus',
])
add('healingBonus', ['Healing Bonus', 'healing_bonus'])
add('shieldBonus', ['Shield Bonus', 'shield_bonus'])

export function normalizeStatKey(input, context = null) {
  const raw = String(input || '').trim()
  if (!raw) return ''
  const normalized = STAT_ALIASES.get(compact(raw)) || STAT_ALIASES.get(key(raw))
  if (normalized) return normalized
  warnUnknownStatKey(raw, context)
  return raw
}

export function normalizeRegistryStatKey(input, context = null) {
  const canonical = normalizeStatKey(input, context)
  return CANONICAL_STATS[canonical]?.registryId || canonical
}

export function getStatLabel(input) {
  const canonical = normalizeStatKey(input)
  return CANONICAL_STATS[canonical]?.label || String(input || 'Unknown stat')
}

export function isKnownStat(input) {
  const raw = String(input || '').trim()
  if (!raw) return false
  return Boolean(STAT_ALIASES.get(compact(raw)) || STAT_ALIASES.get(key(raw)))
}

export function getStatAliasInfo(input) {
  const raw = String(input || '').trim()
  const canonicalKey = normalizeStatKey(raw)
  return {
    input: raw,
    canonicalKey,
    registryId: CANONICAL_STATS[canonicalKey]?.registryId || canonicalKey,
    label: CANONICAL_STATS[canonicalKey]?.label || raw,
    known: isKnownStat(raw),
    usedAlias: raw !== canonicalKey && raw !== CANONICAL_STATS[canonicalKey]?.registryId,
  }
}

export function warnUnknownStatKey(input, context = null) {
  const raw = String(input || '').trim()
  if (!raw) return
  const warningKey = `${context?.source || 'unknown'}:${raw}`
  if (KNOWN_WARNINGS.has(warningKey)) return
  KNOWN_WARNINGS.add(warningKey)
  if (typeof import.meta !== 'undefined' && import.meta.env?.DEV) {
    console.warn('[NTE] Unknown stat key', { stat: raw, ...context })
  }
}

export function getKnownPlannerStatKeys() {
  return Object.keys(CANONICAL_STATS)
}
