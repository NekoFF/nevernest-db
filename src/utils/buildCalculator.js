import { getCartridgeStatValue } from '../data/cartridges.js'
import { getEsperCyclePreview } from '../data/esperCycles.js'
import { getModuleMainStats, getModulePossibleSubStats } from '../data/modulePieces.js'
import { getCartridgeBonus, getCartridgeModuleShapeIds } from './moduleShapeRefs.js'
import { normalizeStatKey } from './statAliases.js'

export const PLANNER_STAT_DEFS = [
  { key: 'hp', label: 'HP', type: 'number' },
  { key: 'atk', label: 'ATK', type: 'number' },
  { key: 'def', label: 'DEF', type: 'number' },
  { key: 'critRate', label: 'Crit Rate', type: 'percent' },
  { key: 'critDmg', label: 'Crit DMG', type: 'percent' },
  { key: 'chargeEfficiency', label: 'Charge Efficiency', type: 'percent' },
  { key: 'essence', label: 'Essence', type: 'number' },
  { key: 'destructionIntensity', label: 'Destruction Intensity', type: 'number' },
  { key: 'cosmosDmg', label: 'Cosmos DMG', type: 'percent' },
  { key: 'animaDmg', label: 'Anima DMG', type: 'percent' },
  { key: 'incantationDmg', label: 'Incantation DMG', type: 'percent' },
  { key: 'chaosDmg', label: 'Chaos DMG', type: 'percent' },
  { key: 'psycheDmg', label: 'Psyche DMG', type: 'percent' },
  { key: 'lakshanaDmg', label: 'Lakshana DMG', type: 'percent' },
  { key: 'cognitiveDmg', label: 'Mental DMG', type: 'percent' },
  { key: 'healingBonus', label: 'Healing Bonus', type: 'percent' },
  { key: 'shieldBonus', label: 'Shield Bonus', type: 'percent' },
  { key: 'damageBonus', label: 'Damage Bonus', type: 'percent' },
]

export const BASE_STAT_KEYS = PLANNER_STAT_DEFS.map((stat) => stat.key)

export function createNormalizedStats(seed = {}) {
  const stats = {}
  BASE_STAT_KEYS.forEach((key) => {
    stats[key] = 0
  })
  return mergeStatBonuses(stats, seed)
}

export function createEmptyBuildSlot() {
  return {
    characterId: null,
    level: 80,
    weaponId: null,
    arcId: null,
    arcLevel: 80,
    weaponLevel: 80,
    console: {
      cartridgeId: null,
      rarity: 'S',
      mainStat: null,
      subStats: [],
    },
    modules: [],
    awakening: {},
    abilities: {},
    activeCycles: [],
  }
}

export function createEmptyBuildState() {
  return {
    slots: Array.from({ length: 4 }, () => createEmptyBuildSlot()),
    activeSlotIndex: 0,
    teamEffects: [],
    esperCycles: [],
  }
}

export function parseStatValue(value) {
  if (value == null || value === '') return 0
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0
  const cleaned = String(value).replace(/,/g, '').replace(/%/g, '').trim()
  const number = Number(cleaned)
  return Number.isFinite(number) ? number : 0
}

export function mergeStatBonuses(...sources) {
  const merged = {}
  BASE_STAT_KEYS.forEach((key) => {
    merged[key] = 0
  })
  sources.filter(Boolean).forEach((source) => {
    Object.entries(source).forEach(([key, value]) => {
      const normalized = normalizeStatKey(key)
      merged[normalized] = (merged[normalized] || 0) + parseStatValue(value)
    })
  })
  return merged
}

function applyTypedStat(stats, statType, value) {
  const normalized = normalizeStatKey(statType)
  const amount = parseStatValue(value)
  const next = createNormalizedStats(stats)

  if (normalized === 'hpPercent') next.hp += next.hp * (amount / 100)
  else if (normalized === 'atkPercent') next.atk += next.atk * (amount / 100)
  else if (normalized === 'defPercent') next.def += next.def * (amount / 100)
  else next[normalized] = (next[normalized] || 0) + amount

  return createNormalizedStats(next)
}

function getWeaponLevelStats(weapon, level) {
  const rows = Array.isArray(weapon?.growthScaling) ? weapon.growthScaling : []
  if (!rows.length) return null
  const target = Number(level) || Number(rows[rows.length - 1]?.level) || 80
  const sorted = [...rows].sort((a, b) => Number(a.level) - Number(b.level))
  const row = [...sorted].reverse().find((item) => Number(item.level) <= target) || sorted[0]
  if (!row) return null
  return {
    mainStat: { type: 'ATK', value: row.atk ?? weapon.mainStat?.value },
    subStat: { type: row.subStatType || weapon.subStat?.type, value: row.subStatValue ?? weapon.subStat?.value },
  }
}

export function getWeaponStats(weapon, level = null) {
  if (!weapon) return createNormalizedStats()
  const levelStats = getWeaponLevelStats(weapon, level)
  if (levelStats) {
    let stats = createNormalizedStats()
    if (levelStats.mainStat?.type) stats = applyTypedStat(stats, levelStats.mainStat.type, levelStats.mainStat.value)
    if (levelStats.subStat?.type) stats = applyTypedStat(stats, levelStats.subStat.type, levelStats.subStat.value)
    return stats
  }
  let stats = createNormalizedStats()
  if (weapon.mainStat?.type) stats = applyTypedStat(stats, weapon.mainStat.type, weapon.mainStat.value)
  if (weapon.subStat?.type) stats = applyTypedStat(stats, weapon.subStat.type, weapon.subStat.value)
  return stats
}

function statsFromObject(stats = {}) {
  const next = {}
  Object.entries(stats || {}).forEach(([key, value]) => {
    if (key === 'level') return
    if (value == null || value === '') return
    next[normalizeStatKey(key)] = parseStatValue(value)
  })
  return next
}

function interpolateLevelStats(levelStats, level) {
  if (!levelStats || typeof levelStats !== 'object') return null

  if (Array.isArray(levelStats.keyframes) && levelStats.keyframes.length) {
    const frames = [...levelStats.keyframes].sort((a, b) => Number(a.level || 0) - Number(b.level || 0))
    const targetLevel = Number(level) || Number(frames[frames.length - 1]?.level) || 80
    const lower = [...frames].reverse().find((frame) => Number(frame.level || 0) <= targetLevel) || frames[0]
    const upper = frames.find((frame) => Number(frame.level || 0) >= targetLevel) || frames[frames.length - 1]
    if (!lower || !upper) return null
    if (lower === upper || Number(lower.level) === Number(upper.level)) return statsFromObject(lower)
    const ratio = (targetLevel - Number(lower.level)) / (Number(upper.level) - Number(lower.level))
    const result = {}
    PLANNER_STAT_DEFS.forEach((stat) => {
      const low = parseStatValue(lower[stat.key])
      const high = parseStatValue(upper[stat.key])
      if (low || high) result[stat.key] = low + (high - low) * ratio
    })
    return result
  }

  if (levelStats.level1 && levelStats.level90) {
    const min = Number(levelStats.minLevel || 1)
    const max = Number(levelStats.maxLevel || 90)
    const targetLevel = Math.min(max, Math.max(min, Number(level) || max))
    const ratio = max === min ? 1 : (targetLevel - min) / (max - min)
    const result = {}
    PLANNER_STAT_DEFS.forEach((stat) => {
      const low = parseStatValue(levelStats.level1[stat.key])
      const high = parseStatValue(levelStats.level90[stat.key])
      if (low || high) result[stat.key] = low + (high - low) * ratio
    })
    return result
  }

  return null
}

export function getBaseCharacterStats(character, level = 80) {
  if (!character) return createNormalizedStats()
  const fallbackStats = {
    ...statsFromObject(character.stats),
    ...statsFromObject(character.combatBaseStats?.values || character.combatBaseStats),
  }
  const levelStats = interpolateLevelStats(character.levelStats, level)
  return createNormalizedStats({
    ...fallbackStats,
    ...(levelStats || {}),
  })
}

export function applyWeaponStats(stats, weapon, level = null) {
  if (!weapon) return createNormalizedStats(stats)
  const levelStats = getWeaponLevelStats(weapon, level)
  if (levelStats) {
    let next = createNormalizedStats(stats)
    if (levelStats.mainStat?.type) next = applyTypedStat(next, levelStats.mainStat.type, levelStats.mainStat.value)
    if (levelStats.subStat?.type) next = applyTypedStat(next, levelStats.subStat.type, levelStats.subStat.value)
    return createNormalizedStats(next)
  }
  if (weapon.stats || weapon.maxStats) return mergeStatBonuses(stats, weapon.stats || weapon.maxStats)
  let next = createNormalizedStats(stats)
  if (weapon.mainStat?.type) next = applyTypedStat(next, weapon.mainStat.type, weapon.mainStat.value)
  if (weapon.subStat?.type) next = applyTypedStat(next, weapon.subStat.type, weapon.subStat.value)
  return createNormalizedStats(next)
}

export function applyConsoleStats(stats, consoleSetup) {
  if (!consoleSetup) return createNormalizedStats(stats)
  let next = createNormalizedStats(stats)
  const rarity = consoleSetup.rarity || 'S'
  if (consoleSetup.mainStat) {
    const main = getCartridgeStatValue(rarity, 'main', consoleSetup.mainStat)
    if (main) next = applyTypedStat(next, consoleSetup.mainStat, main.value)
  }
  const subStats = Array.isArray(consoleSetup.subStats) ? consoleSetup.subStats : []
  subStats.filter(Boolean).forEach((statId) => {
    const sub = getCartridgeStatValue(rarity, 'sub', statId)
    if (sub) next = applyTypedStat(next, statId, sub.value)
  })
  return createNormalizedStats(next)
}

export function applyModuleStats(stats, modules = []) {
  let next = createNormalizedStats(stats)
  const safeModules = getValidPlacedModules(modules)
  safeModules.filter(Boolean).forEach((module) => {
    const rarity = module.rarity || 'S'
    const moduleType = module.moduleType || module.typeCode || 'II'
    getModuleMainStats({ rarity, moduleType }).forEach((item) => {
      next = applyTypedStat(next, item.statId, item.value)
    })
    ;(module.subStats || []).filter(Boolean).forEach((statId) => {
      const sub = getModulePossibleSubStats({ rarity, cellCount: module.cellCount || 2 }).find((item) => item.statId === statId)
      if (sub) next = applyTypedStat(next, sub.statId, sub.value)
    })
  })
  return createNormalizedStats(next)
}

export function applySetBonuses(stats, activeSets = []) {
  const safeSets = Array.isArray(activeSets) ? activeSets : []
  return mergeStatBonuses(stats, ...safeSets.map((set) => set?.stats || set?.bonusStats || {}))
}

function normalizeEffect(effect = {}) {
  if (!effect || typeof effect !== 'object') return null
  return {
    type: effect.type || (effect.condition ? 'conditional' : 'stat'),
    stat: effect.stat ? normalizeStatKey(effect.stat) : null,
    operation: effect.operation || 'add',
    value: parseStatValue(effect.value),
    valueType: effect.valueType || 'percent',
    condition: effect.condition || null,
    autoApply: effect.autoApply !== false && !effect.condition && (effect.type || 'stat') === 'stat',
    reason: effect.reason || null,
    effectKey: effect.effectKey || null,
  }
}

function getStructuredBonusEffects(bonus) {
  return Array.isArray(bonus?.effects)
    ? bonus.effects.map(normalizeEffect).filter(Boolean)
    : []
}

function getAutoAppliedStatsFromEffects(effects = []) {
  const stats = {}
  effects.forEach((effect) => {
    if (effect.type !== 'stat' || !effect.autoApply || !effect.stat || effect.operation !== 'add') return
    stats[effect.stat] = (stats[effect.stat] || 0) + parseStatValue(effect.value)
  })
  return stats
}

function createConditionalEffectRecord({ cartridge, pieces, bonus, effect, reason }) {
  return {
    source: cartridge?.name || cartridge?.id || 'Unknown cartridge',
    sourceId: cartridge?.id || cartridge?.slug || null,
    bonusType: `${pieces}-piece`,
    description: bonus?.description || bonus?.text || '',
    effects: [effect],
    autoApplied: false,
    reason: reason || effect.reason || 'Conditional effect requires battle-state toggle',
  }
}

function countByShape(shapeIds) {
  const counts = new Map()
  shapeIds.filter(Boolean).forEach((shapeId) => counts.set(shapeId, (counts.get(shapeId) || 0) + 1))
  return counts
}

function getSetMatchCount(modules = [], requiredShapeIds = []) {
  const requiredCounts = countByShape(requiredShapeIds)
  const placedCounts = countByShape(modules.map((module) => module.moduleShapeId || module.shapeId))
  return [...requiredCounts.entries()].reduce((total, [shapeId, count]) => total + Math.min(count, placedCounts.get(shapeId) || 0), 0)
}

const DIRECT_BONUS_PATTERNS = [
  { key: 'cosmosDmg', patterns: [/cosmos\s+(dmg|damage)/i] },
  { key: 'animaDmg', patterns: [/anima\s+(dmg|damage)/i] },
  { key: 'incantationDmg', patterns: [/incantation\s+(dmg|damage)/i] },
  { key: 'chaosDmg', patterns: [/chaos\s+(dmg|damage)/i] },
  { key: 'psycheDmg', patterns: [/psyche\s+(dmg|damage)/i] },
  { key: 'lakshanaDmg', patterns: [/lakshana\s+(dmg|damage)/i] },
  { key: 'cognitiveDmg', patterns: [/(cognitive|mental)\s+(dmg|damage)/i] },
  { key: 'chargeEfficiency', patterns: [/charge\s+efficiency/i] },
  { key: 'critRate', patterns: [/(crit\s+rate|crit\s+chance)/i] },
  { key: 'critDmg', patterns: [/crit\s+dmg/i] },
  { key: 'damageBonus', patterns: [/(^|\s)(dmg|damage)\s+(bonus|\+)/i] },
  { key: 'healingBonus', patterns: [/healing\s+bonus/i] },
  { key: 'shieldBonus', patterns: [/(shield|shields)/i] },
  { key: 'hpPercent', patterns: [/(^|\s)hp\s*\+/i] },
  { key: 'atkPercent', patterns: [/(^|\s)atk\s*\+/i] },
  { key: 'defPercent', patterns: [/(^|\s)def\s*\+/i] },
]

function isConditionalBonusText(text = '') {
  return /\b(when|after|nearby|affected|participates|triggering|taking|casts?|casting|stack|stacks|lasts?|for\s+\d+s|up to)\b/i.test(text)
}

export function parseDirectSetBonusStats(text = '') {
  const raw = String(text || '')
  if (!raw || isConditionalBonusText(raw)) return {}
  const valueMatch = raw.match(/\+\s*(\d+(?:\.\d+)?)\s*%/i) || raw.match(/\bby\s+(\d+(?:\.\d+)?)\s*%/i)
  if (!valueMatch) return {}
  const value = Number(valueMatch[1])
  if (!Number.isFinite(value)) return {}
  const pattern = DIRECT_BONUS_PATTERNS.find((item) => item.patterns.some((regex) => regex.test(raw)))
  return pattern ? { [pattern.key]: value } : {}
}

export function getCartridgeSetBonusState(consoleSetup, modules = [], cartridges = []) {
  const cartridgeId = consoleSetup?.cartridgeId
  const cartridge = Array.isArray(cartridges)
    ? cartridges.find((item) => item.id === cartridgeId || item.slug === cartridgeId)
    : null
  if (!cartridge) return { activeSetBonuses: [], conditionalEffects: [], progress: { matched: 0, total: 0 } }
  const requiredShapeIds = getCartridgeModuleShapeIds(cartridge)
  if (!requiredShapeIds.length) return { activeSetBonuses: [], conditionalEffects: [], progress: { matched: 0, total: 0 } }
  const matched = getSetMatchCount(modules, requiredShapeIds)
  const conditionalEffects = []
  const activeSetBonuses = [2, 4].flatMap((pieces) => {
    const active = pieces === 2
      ? requiredShapeIds.length >= 2 && matched >= 2
      : requiredShapeIds.length >= 4 && matched >= 4
    const bonus = active ? getCartridgeBonus(cartridge, pieces) : null
    if (!bonus) return []
    const structuredEffects = getStructuredBonusEffects(bonus)
    const stats = structuredEffects.length
      ? getAutoAppliedStatsFromEffects(structuredEffects)
      : parseDirectSetBonusStats(bonus.text)
    structuredEffects
      .filter((effect) => !effect.autoApply)
      .forEach((effect) => {
        conditionalEffects.push(createConditionalEffectRecord({ cartridge, pieces, bonus, effect }))
      })
    return [{
      id: `${cartridge.id || cartridge.slug}-${pieces}`,
      cartridgeId: cartridge.id || cartridge.slug,
      pieces,
      text: bonus.text,
      description: bonus.description || bonus.text,
      effects: structuredEffects,
      active,
      stats,
      direct: Object.keys(stats).length > 0,
      structured: structuredEffects.length > 0,
    }]
  })
  return {
    activeSetBonuses,
    conditionalEffects,
    progress: {
      matched,
      total: requiredShapeIds.length,
      requiredShapeIds,
      twoPieceActive: requiredShapeIds.length >= 2 && matched >= 2,
      fourPieceActive: requiredShapeIds.length >= 4 && matched >= 4,
    },
  }
}

export function getActiveCartridgeSetBonuses(consoleSetup, modules = [], cartridges = []) {
  return getCartridgeSetBonusState(consoleSetup, modules, cartridges).activeSetBonuses
}

function normalizeModuleType(value = '') {
  const match = String(value || '').toUpperCase().match(/(III|IV|II|V|I)/)
  return match?.[1] || String(value || '').toUpperCase()
}

function hasValidModuleCells(module) {
  if (!module || typeof module !== 'object' || module.preview || module.dragging || module.deleted) return false
  const cells = Array.isArray(module.cells) ? module.cells : []
  return cells.length > 0 && cells.every((cell) => {
    if (!Array.isArray(cell)) return false
    return Number.isFinite(Number(cell[0])) && Number.isFinite(Number(cell[1]))
  })
}

function moduleIdentity(module, index) {
  if (!module || typeof module !== 'object') return `invalid-${index}`
  if (module.id) return `id:${module.id}`
  if (module.moduleInstanceId) return `instance:${module.moduleInstanceId}`
  const row = module.position?.row ?? module.row ?? module.y
  const col = module.position?.col ?? module.col ?? module.x
  const shapeId = module.moduleShapeId || module.shapeId || module.modulePieceId || 'shape'
  if (row != null && col != null) return `placed:${shapeId}:${row}:${col}`
  return `placed:${shapeId}:fallback:${index}`
}

function getUniquePlacedModules(modules = []) {
  const safeModules = Array.isArray(modules) ? modules : []
  const seen = new Set()
  return safeModules.filter((module, index) => {
    if (!module || typeof module !== 'object') return false
    const key = moduleIdentity(module, index)
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

function getValidPlacedModules(modules = []) {
  return getUniquePlacedModules(modules).filter(hasValidModuleCells)
}

export function getCharacterConsoleTraitState(character, modules = []) {
  const trait = Array.isArray(character?.buildTraits) && character.buildTraits.length
    ? character.buildTraits.find((item) => item.trigger === 'module_type_count')
    : character?.consoleTrait
  const placedModules = getValidPlacedModules(modules)
  const statId = trait?.stat || trait?.statId
  if (!statId || !trait?.valuePerModule || !trait?.moduleType) {
    return trait ? { trait, count: 0, value: 0, statId: statId || null, active: false } : null
  }
  const targetType = normalizeModuleType(trait.moduleType)
  const rawCount = placedModules.filter((module) => normalizeModuleType(module?.moduleType || module?.typeCode || module?.type) === targetType).length
  const maxStacks = trait.maxStacks == null || trait.maxStacks === '' ? null : Number.isFinite(Number(trait.maxStacks)) ? Number(trait.maxStacks) : null
  const count = maxStacks == null ? rawCount : Math.min(rawCount, maxStacks)
  const value = count * parseStatValue(trait.valuePerModule)
  return {
    trait,
    count,
    rawCount,
    value,
    statId,
    active: count > 0 && value > 0,
  }
}

export function applyCharacterConsoleTrait(stats, character, modules = []) {
  const state = getCharacterConsoleTraitState(character, modules)
  if (!state?.active) return createNormalizedStats(stats)
  return applyTypedStat(stats, state.statId, state.value)
}

export function applyTeamCycleBonuses(stats, teamState = {}) {
  // Esper Cycle effects are represented structurally, but current game data is
  // informational/conditional. Only explicit auto-applied stat effects are merged.
  const cycleEffects = Array.isArray(teamState.esperCycles) ? teamState.esperCycles : []
  const autoAppliedCycleStats = cycleEffects.flatMap((cycle) => Array.isArray(cycle.effects) ? cycle.effects : [])
    .map(normalizeEffect)
    .filter((effect) => effect?.type === 'stat' && effect.autoApply && effect.stat)
    .reduce((acc, effect) => {
      acc[effect.stat] = (acc[effect.stat] || 0) + parseStatValue(effect.value)
      return acc
    }, {})
  return mergeStatBonuses(stats, ...(teamState.teamEffects || []), autoAppliedCycleStats)
}

function getSlots(buildState = {}) {
  return Array.isArray(buildState.slots)
    ? buildState.slots
    : Array.isArray(buildState.team)
      ? buildState.team
      : []
}

export function calculateBuildStats(buildState, dataSources = {}) {
  const characters = dataSources.characters || []
  const slots = getSlots(buildState)
  const activeSlotIndex = Number.isFinite(Number(buildState?.activeSlotIndex))
    ? Number(buildState.activeSlotIndex)
    : Number(buildState?.activeSlot || 0)
  const slot = slots[activeSlotIndex] || createEmptyBuildSlot()
  const character = characters.find((item) => item.id === slot.characterId) || null
  const modules = getValidPlacedModules(slot.modules)

  const base = getBaseCharacterStats(character, slot.level)
  const weapon = dataSources.weapons?.find?.((item) => item.id === slot.weaponId || item.slug === slot.weaponId) || null
  const cartridgeSetBonusState = getCartridgeSetBonusState(slot.console, modules, dataSources.cartridges)
  const activeSets = [
    ...(Array.isArray(slot.activeSets) ? slot.activeSets : []),
    ...cartridgeSetBonusState.activeSetBonuses,
  ]
  const esperCyclePreview = getEsperCyclePreview({ slots, characters })
  const activeEsperCycles = esperCyclePreview.activeCycles || []
  const cycleConditionalEffects = activeEsperCycles.flatMap((cycle) => (
    Array.isArray(cycle.effects) && cycle.effects.length
      ? cycle.effects.filter((effect) => effect.autoApply === false || effect.type !== 'stat').map((effect) => ({
          source: cycle.name,
          sourceId: cycle.id,
          bonusType: 'esper-cycle',
          description: cycle.description,
          effects: [effect],
          autoApplied: false,
          reason: effect.reason || 'Esper Cycle effect is informational or conditional and is not included in stat totals yet.',
        }))
      : [{
          source: cycle.name,
          sourceId: cycle.id,
          bonusType: 'esper-cycle',
          description: cycle.description,
          effects: [],
          autoApplied: false,
          reason: 'Esper Cycle stat calculation is not implemented for this effect.',
        }]
  ))

  // Calculation order: character -> weapon -> cartridge -> modules -> direct
  // set bonuses -> character traits -> explicit/auto-applied team cycle stats.
  // Conditional set and cycle effects are returned in sources only.
  const withWeapon = applyWeaponStats(base, weapon, slot.weaponLevel || slot.arcLevel)
  const withConsole = applyConsoleStats(withWeapon, slot.console)
  const withModules = applyModuleStats(withConsole, modules)
  const withSets = applySetBonuses(withModules, activeSets)
  const withCharacterTrait = applyCharacterConsoleTrait(withSets, character, modules)
  const finalStats = applyTeamCycleBonuses(withCharacterTrait, {
    teamEffects: Array.isArray(buildState?.teamEffects) ? buildState.teamEffects : [],
    esperCycles: activeEsperCycles,
  })
  const characterConsoleTrait = getCharacterConsoleTraitState(character, modules)

  return {
    activeSlot: slot,
    activeSlotIndex,
    character,
    stats: finalStats,
    sources: {
      base,
      weapon: getWeaponStats(weapon, slot.weaponLevel || slot.arcLevel),
      console: {
        cartridgeId: slot.console?.cartridgeId || null,
        rarity: slot.console?.rarity || 'S',
        mainStat: slot.console?.mainStat || null,
        subStats: slot.console?.subStats || [],
      },
      modules,
      characterConsoleTrait,
      setBonuses: activeSets,
      setProgress: cartridgeSetBonusState.progress,
      conditionalEffects: [
        ...cartridgeSetBonusState.conditionalEffects,
        ...cycleConditionalEffects,
      ],
      teamEffects: Array.isArray(buildState?.teamEffects) ? buildState.teamEffects : [],
      esperCycles: activeEsperCycles,
      esperCyclePreview,
    },
  }
}

export function formatPlannerStat(value, type = 'number') {
  const number = parseStatValue(value)
  if (type === 'percent') {
    return `${Number.isInteger(number) ? number : number.toFixed(1)}%`
  }
  return Math.round(number).toLocaleString()
}
