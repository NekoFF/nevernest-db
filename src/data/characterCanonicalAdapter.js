import { getStatById } from './stats.js'
import { weapons } from './weapons.js'
import { cartridgeSets } from './cartridges.js'
import { normalizeRegistryStatKey, normalizeStatKey } from '../utils/statAliases.js'

const VALID_SKILL_TYPES = new Set([
  'Basic Attack',
  'Skill',
  'Ultimate',
  'Passive',
  'Life Skill',
  'Awakening',
  'Breakthrough',
  'Other',
])

const VOICE_LOCALES = ['EN', 'JP', 'KO', 'CN']
const VALID_RARITIES = new Set(['S', 'A', 'B'])
const VALID_ELEMENTS = new Set(['incantation', 'cosmos', 'chaos', 'psyche', 'anima', 'lakshana'])
const VALID_ARC_TYPES = new Set(['bose', 'gas', 'liquid', 'plasma', 'solid'])
const VALID_WEAPON_IDS = new Set(weapons.flatMap((weapon) => [weapon.id, weapon.slug].filter(Boolean)))
const VALID_CARTRIDGE_IDS = new Set(cartridgeSets.flatMap((cartridge) => [cartridge.id, cartridge.slug, cartridge.sourceId].filter(Boolean)))

function asArray(value) {
  return Array.isArray(value) ? value : []
}

function asObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value) ? value : {}
}

function nonEmptyString(value) {
  return typeof value === 'string' && value.trim() ? value.trim() : ''
}

function cleanText(value) {
  return String(value ?? '')
    .replace(/â€”/g, '-')
    .replace(/Ã—/g, 'x')
    .replace(/â€™/g, "'")
    .replace(/â€œ|â€/g, '"')
    .replace(/\s+/g, ' ')
    .trim()
}

function addIssue(issues, severity, code, message, path = '') {
  issues.push({ severity, code, message, path })
}

function sourceStatusOf(value) {
  if (!value || typeof value !== 'object') return ''
  return String(value.sourceStatus || value.status || '').trim()
}

function hasNeedsVerification(value) {
  return /needs[_ -]?verification|needs[_ -]?manual[_ -]?verification|partial|ambiguous|unmapped/i.test(sourceStatusOf(value))
}

function normalizeSkillType(type) {
  const raw = String(type || '').trim()
  if (VALID_SKILL_TYPES.has(raw)) return raw
  if (/redirect/i.test(raw)) return 'Skill'
  if (/support/i.test(raw)) return 'Other'
  if (/passive/i.test(raw)) return 'Passive'
  if (/life/i.test(raw)) return 'Life Skill'
  if (/awaken/i.test(raw)) return 'Awakening'
  if (/breakthrough|bonus/i.test(raw)) return 'Breakthrough'
  return raw ? 'Other' : 'Other'
}

function slugify(value, fallback = 'item') {
  const slug = String(value || '')
    .trim()
    .toLowerCase()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return slug || fallback
}

function formatStatValue(value, suffix = '') {
  if (value == null || value === '') return ''
  const numeric = Number(value)
  const text = Number.isFinite(numeric) ? (Number.isInteger(numeric) ? String(numeric) : numeric.toFixed(1)) : String(value)
  return suffix && !text.includes(suffix) ? `${text}${suffix}` : text
}

function normalizeRarity(value) {
  const raw = cleanText(value).toUpperCase().replace(/-?RANK$/, '').trim()
  return VALID_RARITIES.has(raw) ? raw : cleanText(value)
}

function normalizeElementId(value) {
  return cleanText(value).toLowerCase()
}

function normalizeArcTypeId(value) {
  return cleanText(value).toLowerCase()
}

function getMaterialSources(canonical) {
  return new Map(asArray(canonical?.materials?.materialSources).map((entry) => [entry.materialId, asArray(entry.sources)]))
}

function normalizeMaterialItem(item, index, sourceMap = new Map()) {
  const id = item?.materialId || item?.id || slugify(item?.name, `material-${index + 1}`)
  return {
    id: String(id),
    materialId: String(id),
    name: cleanText(item?.name || `Material ${index + 1}`),
    amount: Number(item?.amount ?? item?.count) || 0,
    image: String(item?.image || item?.icon || ''),
    sources: asArray(item?.sources).length ? asArray(item.sources).map(String) : asArray(sourceMap.get(id)).map(String),
    sourceStatus: item?.sourceStatus || '',
  }
}

function resolveMaterialRefs(materials = [], canonical, fallbackItems = []) {
  const sourceMap = getMaterialSources(canonical)
  const refs = asArray(materials)
  const hasSkillRef = refs.some((item) => item?.ref === 'materials.skillMaterials')
  if (hasSkillRef) {
    return asArray(canonical?.materials?.skillMaterials).map((item, index) => normalizeMaterialItem(item, index, sourceMap))
  }
  return (refs.length ? refs : fallbackItems).map((item, index) => normalizeMaterialItem(item, index, sourceMap))
}

function normalizeDescriptionBlocks(blocks, fallbackDescription, ownerId) {
  const fromBlocks = asArray(blocks)
  if (fromBlocks.length) {
    return fromBlocks.map((block, index) => ({
      id: String(block?.id || `${ownerId}-description-${index + 1}`),
      title: cleanText(block?.title || block?.name || 'Description'),
      content: cleanText(block?.content || block?.text || block?.description || ''),
      sourceStatus: block?.sourceStatus || '',
    }))
  }
  if (fallbackDescription) {
    return [{ id: `${ownerId}-description-1`, title: 'Description', content: cleanText(fallbackDescription) }]
  }
  return []
}

function numericLevelKeys(attributesByLevel) {
  return Object.keys(asObject(attributesByLevel))
    .filter((level) => /^\d+$/.test(level))
    .map(Number)
    .sort((a, b) => a - b)
}

function normalizeAttributeRow(row) {
  return {
    label: cleanText(row?.label || ''),
    value: cleanText(row?.value || ''),
    valueType: row?.valueType || '',
    notes: cleanText(row?.notes || ''),
    sourceStatus: row?.sourceStatus || '',
    estimated: row?.estimated === true,
  }
}

function attributesByLevelToAttributeLevels(skill) {
  const attributesByLevel = asObject(skill?.attributesByLevel)
  return numericLevelKeys(attributesByLevel).map((level) => ({
    level,
    rows: asArray(attributesByLevel[String(level)]).map(normalizeAttributeRow),
    sourceStatus: skill?.sourceStatus || '',
  }))
}

function normalizeSkill(skill, index, canonical) {
  const id = String(skill?.id || slugify(skill?.name, `skill-${index + 1}`))
  const type = normalizeSkillType(skill?.type)
  const upgradeMaterials = resolveMaterialRefs(skill?.materials, canonical)
  return {
    id,
    name: cleanText(skill?.name || `Skill ${index + 1}`),
    type,
    canonicalType: cleanText(skill?.type || type),
    icon: String(skill?.icon || ''),
    enabled: skill?.enabled !== false,
    descriptionBlocks: normalizeDescriptionBlocks(skill?.descriptionBlocks, skill?.description, id),
    quote: cleanText(skill?.flavorText || skill?.quote || ''),
    flavorText: cleanText(skill?.flavorText || skill?.quote || ''),
    attributesByLevel: asObject(skill?.attributesByLevel),
    knownLevels: asArray(skill?.knownLevels).map(Number).filter(Number.isFinite),
    maxLevel: Number(skill?.maxLevel) || null,
    attributeLevels: attributesByLevelToAttributeLevels(skill),
    missingLevelBehavior: 'data_coming_soon',
    cooldown: skill?.cooldown ?? null,
    energyCost: skill?.energyCost ?? null,
    cycleEnergy: skill?.cycleEnergy ?? null,
    tags: asArray(skill?.tags).map(String),
    upgradeMaterials,
    materials: {
      items: upgradeMaterials,
      currency: upgradeMaterials.find((item) => /coin|currency|beetle/i.test(item.name))?.amount || 0,
    },
    sourceStatus: skill?.sourceStatus || '',
    canonical: skill,
  }
}

function passiveToSkill(passive, index, canonical) {
  const id = String(passive?.id || slugify(passive?.name, `passive-${index + 1}`))
  const upgradeMaterials = resolveMaterialRefs(passive?.unlockMaterials, canonical)
  return {
    id,
    name: cleanText(passive?.name || `Passive ${index + 1}`),
    type: 'Passive',
    canonicalType: cleanText(passive?.type || 'Passive'),
    icon: 'PS',
    enabled: passive?.enabled !== false,
    descriptionBlocks: normalizeDescriptionBlocks(null, passive?.description, id),
    quote: cleanText(passive?.flavorText || ''),
    attributeLevels: [],
    attributesByLevel: {},
    knownLevels: [],
    maxLevel: null,
    upgradeMaterials,
    sourceStatus: passive?.sourceStatus || '',
    effects: asArray(passive?.effects),
    conditionalEffects: asArray(passive?.conditionalEffects),
    canonical: passive,
  }
}

function lifeSkillToSkill(lifeSkill, index, canonical) {
  const id = String(lifeSkill?.id || slugify(lifeSkill?.name, `life-skill-${index + 1}`))
  const sourceMap = getMaterialSources(canonical)
  const upgradeMaterials = asArray(lifeSkill?.levels).flatMap((level) =>
    asArray(level?.materials).map((material, materialIndex) => ({
      ...normalizeMaterialItem(material, materialIndex, sourceMap),
      id: `${material?.materialId || material?.name || materialIndex}-life-${level.level}`,
      group: `Lv.${level.level}`,
    })),
  )
  return {
    id,
    name: cleanText(lifeSkill?.name || `Life Skill ${index + 1}`),
    type: 'Life Skill',
    canonicalType: 'Life Skill',
    icon: 'LS',
    enabled: lifeSkill?.enabled !== false,
    descriptionBlocks: asArray(lifeSkill?.levels).map((level) => ({
      id: `${id}-level-${level.level}`,
      title: `Level ${level.level}`,
      content: cleanText(level.description || level.text || level.effect || ''),
    })),
    quote: '',
    attributeLevels: [],
    attributesByLevel: {},
    knownLevels: [],
    maxLevel: asArray(lifeSkill?.levels).length || null,
    upgradeMaterials,
    materials: { items: upgradeMaterials, currency: 0 },
    sourceStatus: lifeSkill?.sourceStatus || '',
    canonical: lifeSkill,
  }
}

function awakeningToSkill(awakening, index) {
  const id = String(awakening?.id || `a${awakening?.index || index + 1}`)
  return {
    id,
    name: cleanText(awakening?.name || `Awakening ${index + 1}`),
    type: 'Awakening',
    canonicalType: 'Awakening',
    icon: `A${awakening?.index || index + 1}`,
    enabled: awakening?.enabled !== false,
    descriptionBlocks: normalizeDescriptionBlocks(null, awakening?.description, id),
    quote: '',
    attributeLevels: [],
    attributesByLevel: {},
    knownLevels: [],
    maxLevel: null,
    sourceStatus: awakening?.sourceStatus || '',
    effects: asArray(awakening?.effects),
    conditionalEffects: asArray(awakening?.conditionalEffects),
    canonical: awakening,
  }
}

function awakeningBonusToSkill(bonus, index) {
  const id = String(bonus?.id || slugify(bonus?.name, `awakening-bonus-${index + 1}`))
  return {
    id,
    name: cleanText(bonus?.name || `Awakening Bonus ${index + 1}`),
    type: 'Breakthrough',
    canonicalType: 'Awakening Bonus',
    icon: `${bonus?.unlockAwakeningCount || index + 1}`,
    enabled: bonus?.enabled !== false,
    descriptionBlocks: normalizeDescriptionBlocks(null, bonus?.description, id),
    quote: '',
    attributeLevels: [],
    attributesByLevel: {},
    knownLevels: [],
    maxLevel: null,
    sourceStatus: bonus?.sourceStatus || '',
    effects: asArray(bonus?.effects),
    conditionalEffects: asArray(bonus?.conditionalEffects),
    canonical: bonus,
  }
}

function adaptLevelStats(canonical) {
  const combatBaseStats = {
    values: {
      critRate: Number(canonical?.stats?.combatBaseStats?.values?.critRate ?? canonical?.stats?.combatBaseStats?.critRate ?? 5),
      critDmg: Number(canonical?.stats?.combatBaseStats?.values?.critDmg ?? canonical?.stats?.combatBaseStats?.critDmg ?? 50),
    },
    sourceStatus: canonical?.stats?.combatBaseStats?.sourceStatus || 'current-site-default-needs-official-verification',
  }
  const rows = asArray(canonical?.stats?.levelStats)
    .map((row) => ({
      level: Number(row?.level),
      hp: row?.hp == null ? null : Number(row.hp),
      atk: row?.atk == null ? null : Number(row.atk),
      def: row?.def == null ? null : Number(row.def),
      critRate: row?.critRate == null ? null : Number(row.critRate),
      critDmg: row?.critDmg == null ? null : Number(row.critDmg),
    }))
    .filter((row) => Number.isFinite(row.level))
    .sort((a, b) => a.level - b.level)

  const minLevel = rows[0]?.level || 1
  const maxLevel = rows[rows.length - 1]?.level || 80
  const level80 = rows.find((row) => row.level === 80) || rows[rows.length - 1] || {}
  return {
    stats: {
      hp: formatStatValue(level80.hp),
      atk: formatStatValue(level80.atk),
      def: formatStatValue(level80.def),
      critRate: formatStatValue(level80.critRate ?? combatBaseStats.values.critRate, '%'),
      critDmg: formatStatValue(level80.critDmg ?? combatBaseStats.values.critDmg, '%'),
    },
    combatBaseStats,
    levelStats: {
      mode: 'exact',
      minLevel,
      maxLevel,
      rows,
      keyframes: rows,
      baseStatsSource: canonical?.stats?.baseStatsSource || 'levelStats',
      statSourceStatus: canonical?.stats?.statSourceStatus || '',
      note: canonical?.stats?.growthNotes || '',
      growthNotes: canonical?.stats?.growthNotes || '',
      baseLevelStats: asArray(canonical?.stats?.baseLevelStats).length ? asArray(canonical.stats.baseLevelStats) : rows,
      ascensionPhaseStats: asArray(canonical?.stats?.ascensionPhaseStats),
      selectedAscensionPhase: canonical?.stats?.selectedAscensionPhase ?? null,
      selectedLevel: canonical?.stats?.selectedLevel ?? maxLevel,
      ascensionPhaseSourceStatus: canonical?.stats?.ascensionPhaseSourceStatus || '',
    },
  }
}

function adaptVoiceActors(voiceActors = {}) {
  const actorObject = asObject(voiceActors)
  return VOICE_LOCALES.map((locale) => {
    const entry = actorObject[locale]
    const name = typeof entry === 'string' ? entry : entry?.name
    return {
      lang: locale,
      name: cleanText(name || ''),
      sourceStatus: typeof entry === 'object'
        ? entry?.sourceStatus || (entry?.name ? 'verified' : 'needs_manual_verification')
        : (name ? 'verified' : 'needs_manual_verification'),
    }
  })
}

function adaptOverview(canonical) {
  const identity = asObject(canonical?.identity)
  const lore = asObject(canonical?.lore)
  const supplemental = asObject(canonical?.supplemental)
  const profile = asObject(supplemental?.profile)
  const guide = asObject(canonical?.guide)
  const localizedNames = asObject(supplemental?.localizedNames)
  const localizedRows = Object.entries(localizedNames).flatMap(([groupName, values]) =>
    Object.entries(asObject(values)).map(([language, entry]) => {
      const item = asObject(entry)
      const label = groupName === 'nanallyColuccis' ? `Nanally Coluccis - ${language}` : `Nanally - ${language}`
      return {
        label,
        value: cleanText([item.name, item.romanization].filter(Boolean).join(' / ')),
      }
    }),
  )
  const blocks = [
    {
      id: 'at-a-glance',
      type: 'heroSummary',
      title: 'At a glance',
      enabled: true,
      size: 'full',
      content: cleanText(identity.title || ''),
    },
    {
      id: 'profile-snapshot',
      type: 'profileGrid',
      title: 'Profile Snapshot',
      enabled: true,
      size: 'full',
      rows: [
        { label: 'Real Name', value: cleanText(profile.realName || identity.realName || '') },
        { label: 'Gender', value: cleanText(profile.gender || '') },
        { label: 'Birthday', value: cleanText(profile.birthday || identity.birthday || '') },
        { label: 'Affiliation', value: cleanText(profile.affiliation || identity.faction || '') },
        { label: 'How to Obtain', value: cleanText(profile.howToObtain || '') },
        { label: 'Release Date', value: cleanText(profile.releaseDate || identity.releaseDate || '') },
        { label: 'Rarity', value: cleanText(`${identity.rarity || ''}${identity.rarity ? '-Rank' : ''}`) },
        { label: 'Element', value: cleanText(profile.element || identity.element || '') },
        { label: 'Arc Type', value: cleanText(profile.arcType || identity.arcType || '') },
        { label: 'Combat Roles', value: asArray(identity.roles).join(' / ') },
        { label: 'Esper Ability', value: cleanText(identity.esperAbility || '') },
      ],
    },
    {
      id: 'voice-actors',
      type: 'voiceActors',
      title: 'Voice Actors',
      enabled: true,
      size: 'half',
      rows: adaptVoiceActors(canonical.voiceActors).map((actor) => ({ label: actor.lang, value: actor.name })),
    },
  ]
  if (asArray(supplemental.availability).length) {
      blocks.push({
        id: 'availability',
        type: 'compactBannerHistory',
      title: 'Availability / Banner History',
      enabled: true,
      size: 'half',
      items: asArray(supplemental.availability).map((entry) => cleanText(`${entry.bannerType}: ${entry.bannerName} (${entry.date})`)),
    })
  }
  if (guide.reviewSummary) {
    blocks.push({
      id: 'gameplay-identity',
      type: 'gameplaySummary',
      title: 'Gameplay Identity',
      enabled: true,
      size: 'full',
      content: cleanText(guide.reviewSummary),
    })
  }
  if (asArray(guide.pros).length) {
    blocks.push({ id: 'pros', type: 'list', title: 'Pros', enabled: true, size: 'full', items: asArray(guide.pros).map(cleanText) })
  }
  if (asArray(guide.cons).length) {
    blocks.push({ id: 'cons', type: 'list', title: 'Cons', enabled: true, size: 'full', items: asArray(guide.cons).map(cleanText) })
  }
  if (asArray(guide.ratings).length) {
    blocks.push({
      id: 'rating',
      type: 'meta',
      title: 'Rating',
      enabled: true,
      size: 'half',
      rows: asArray(guide.ratings).map((rating) => ({ label: rating.category || 'Rating', value: cleanText(`${rating.rating} - ${rating.context || ''}`) })),
    })
  }
  if (canonical?.stats?.ascensionPhaseSourceStatus) {
    blocks.push({
      id: 'stat-model-note',
      type: 'text',
      title: 'Stat Model Note',
      enabled: true,
      size: 'half',
      content: 'Ascension-phase stats are being prepared for calculator support. The level slider currently uses base level stats.',
    })
  }
  if (asArray(supplemental.trivia).length) {
    blocks.push({ id: 'trivia', type: 'list', title: 'Trivia', enabled: true, size: 'half', items: asArray(supplemental.trivia).map(cleanText) })
  }
  if (asArray(lore.intel).length) {
    blocks.push({
      id: 'intel',
      type: 'list',
      title: 'Intel',
      enabled: true,
      size: 'half',
      items: asArray(lore.intel),
    })
  }
  if (asArray(lore.personalItems).length) {
    blocks.push({
      id: 'personal-items',
      type: 'loreCards',
      title: 'Personal Items',
      enabled: true,
      size: 'full',
      items: asArray(lore.personalItems).map((item) => cleanText(`${item.name}: ${item.description}`)),
    })
  }
  if (asArray(lore.stories).length) {
    blocks.push({
      id: 'stories',
      type: 'loreCards',
      title: 'Stories',
      enabled: true,
      size: 'full',
      items: asArray(lore.stories).map((item) => cleanText(`${item.title}: ${item.summary || item.description || ''}`)),
    })
  }
  if (asArray(lore.quotes).length) {
    blocks.push({
      id: 'quotes',
      type: 'quoteList',
      title: 'Quotes',
      enabled: true,
      size: 'full',
      items: asArray(lore.quotes).map(cleanText),
    })
  }
  if (localizedRows.length) {
    blocks.push({ id: 'other-languages', type: 'languageTable', title: 'Other Languages', enabled: true, size: 'full', rows: localizedRows })
  }
  return {
    blocks,
    updateTracker: {
      lastReviewUpdate: canonical?.source?.reviewedAt || '',
      lastMajorBuildUpdate: '',
      lastProfileUpdate: canonical?.source?.reviewedAt || '',
    },
  }
}

function adaptMaterials(canonical) {
  const sourceMap = getMaterialSources(canonical)
  const ascension = asArray(canonical?.materials?.ascensionMaterials || canonical?.materials?.ascension).map((item, index) => normalizeMaterialItem(item, index, sourceMap))
  const currency = ascension.filter((item) => /coin|currency|beetle/i.test(item.name)).reduce((sum, item) => sum + item.amount, 0)
  return {
    title: 'Character Ascension Materials',
    notes: canonical?.stats?.statSourceStatus ? `Source status: ${canonical.stats.statSourceStatus}` : '',
    items: ascension.filter((item) => !/coin|currency|beetle/i.test(item.name)),
    currencyCost: currency,
    ascensionMaterials: ascension,
    skillMaterials: asArray(canonical?.materials?.skillMaterials).map((item, index) => normalizeMaterialItem(item, index, sourceMap)),
    lifeSkillMaterials: asArray(canonical?.materials?.lifeSkillMaterials),
    materialSources: asArray(canonical?.materials?.materialSources),
    ascensionTotals: asArray(canonical?.materials?.ascensionTotals).map((section) => ({
      ...section,
      items: asArray(section?.items).map((item, index) => normalizeMaterialItem(item, index, sourceMap)),
    })),
  }
}

function adaptBuild(canonical) {
  const build = asObject(canonical?.build)
  return {
    recommendedWeaponIds: asArray(build.recommendedWeaponIds).map(String),
    recommendedWeapons: asArray(build.recommendedWeaponIds).map((weaponId, index) => ({
      id: `recommended-weapon-${index + 1}`,
      weaponId: String(weaponId),
      priority: index + 1,
      label: index === 0 ? 'Best in Slot' : 'Alternative',
      note: '',
      enabled: true,
    })),
    recommendedCartridges: asArray(build.recommendedCartridgeIds).map((cartridgeId, index) => ({
      id: `recommended-cartridge-${index + 1}`,
      cartridgeId: String(cartridgeId),
      rarity: 'S',
      priority: index + 1,
      label: index === 0 ? 'Best in Slot' : 'Alternative',
      note: '',
      enabled: true,
    })),
    mainStats: asArray(build.recommendedMainStats).map((statId, index) => ({ id: `main-stat-${index + 1}`, statId: String(statId), priority: index + 1, enabled: true })),
    subStats: asArray(build.recommendedSubStats).map((statId, index) => ({ id: `sub-stat-${index + 1}`, statId: String(statId), priority: index + 1, enabled: true })),
    teams: asArray(build.recommendedTeams),
    notes: asArray(build.buildNotes).map((note, index) => ({ id: `build-note-${index + 1}`, title: 'Build note', content: String(note), enabled: true })),
    sourceStatus: build.sourceStatus || '',
  }
}

function adaptBuildTraits(canonical) {
  return asArray(canonical?.buildPlannerIntegration?.activeTraits).map((trait) => ({
    id: String(trait.id || slugify(trait.name, 'character-trait')),
    title: String(trait.name || trait.title || trait.id || 'Character Trait'),
    trigger: trait.trigger || '',
    moduleType: trait.moduleType || '',
    stat: normalizeStatKey(trait.stat || trait.statId || ''),
    operation: trait.operation || 'add',
    valuePerModule: trait.valuePerModule,
    valueType: trait.valueType || 'percent',
    maxStacks: trait.maxStacks ?? null,
    autoApply: trait.autoApply === true && trait.trigger === 'module_type_count',
    description: trait.description || trait.reason || '',
    canonical: trait,
  }))
}

function adaptAwakenings(canonical) {
  return asArray(canonical?.awakenings).map((awakening, index) => ({
    id: String(awakening.id || `a${index + 1}`),
    label: `A${awakening.index || index + 1}`,
    type: `Awakening ${awakening.index || index + 1}`,
    name: String(awakening.name || `Awakening ${index + 1}`),
    description: String(awakening.description || ''),
    effects: asArray(awakening.effects),
    conditionalEffects: asArray(awakening.conditionalEffects),
    affectsBuildPlanner: awakening.affectsBuildPlanner === true,
    sourceStatus: awakening.sourceStatus || '',
  }))
}

function adaptAwakeningBonuses(canonical) {
  return asArray(canonical?.awakeningBonuses).map((bonus, index) => ({
    id: String(bonus.id || `awakening-bonus-${index + 1}`),
    label: bonus.unlockAwakeningCount ? `${bonus.unlockAwakeningCount}-Awakening` : `Bonus ${index + 1}`,
    type: bonus.unlockAwakeningCount ? `${bonus.unlockAwakeningCount}-Awakening Bonus` : 'Awakening Bonus',
    name: String(bonus.name || `Awakening Bonus ${index + 1}`),
    description: String(bonus.description || ''),
    effects: asArray(bonus.effects),
    conditionalEffects: asArray(bonus.conditionalEffects),
    affectsBuildPlanner: bonus.affectsBuildPlanner === true,
    sourceStatus: bonus.sourceStatus || '',
  }))
}

export function adaptCanonicalCharacter(canonicalCharacter) {
  const canonical = asObject(canonicalCharacter)
  const identity = asObject(canonical.identity)
  const media = asObject(canonical.media)
  const id = String(canonical.id || identity.id || slugify(identity.name, 'character'))
  const { stats, combatBaseStats, levelStats } = adaptLevelStats(canonical)
  const skills = [
    ...asArray(canonical.skills).map((skill, index) => normalizeSkill(skill, index, canonical)),
    ...asArray(canonical.passives).map((passive, index) => passiveToSkill(passive, index, canonical)),
    ...asArray(canonical.lifeSkills).map((lifeSkill, index) => lifeSkillToSkill(lifeSkill, index, canonical)),
    ...asArray(canonical.awakenings).map((awakening, index) => awakeningToSkill(awakening, index)),
    ...asArray(canonical.awakeningBonuses).map((bonus, index) => awakeningBonusToSkill(bonus, index)),
  ]
  const buildTraits = adaptBuildTraits(canonical)

  return {
    id,
    slug: id,
    name: cleanText(identity.name || canonical.name || id),
    rarity: normalizeRarity(identity.rarity || 'A'),
    element: normalizeElementId(identity.element || ''),
    arcType: normalizeArcTypeId(identity.arcType || ''),
    roles: asArray(identity.roles).map(String),
    tags: asArray(identity.tags).length ? asArray(identity.tags).map(String) : asArray(identity.roles).map(String),
    shortDescription: cleanText(identity.title || ''),
    profileText: cleanText(identity.title || ''),
    faction: cleanText(identity.faction || '') || null,
    birthday: cleanText(identity.birthday || '') || null,
    esperAbility: cleanText(identity.esperAbility || '') || null,
    releaseStatus: identity.releaseStatus || null,
    versionLabel: identity.version || null,
    portraitImageUrl: media.portraitImageUrl || '',
    cardImageUrl: media.cardImageUrl || '',
    fullBodyImageUrl: media.fullBodyImageUrl || '',
    skins: asArray(media.skins),
    voiceLines: asArray(media.voiceLines),
    voiceActors: adaptVoiceActors(canonical.voiceActors),
    stats,
    combatBaseStats,
    levelStats,
    ascensionPhaseStats: asArray(canonical?.stats?.ascensionPhaseStats),
    overview: adaptOverview(canonical),
    skills,
    passives: asArray(canonical.passives),
    lifeSkills: asArray(canonical.lifeSkills).map((skill) => ({
      id: skill.id,
      name: skill.name,
      effects: asArray(skill.levels).map((level) => ({ level: level.level, text: cleanText(level.description || level.text || level.effect || '') })),
      materials: skill.materials || [],
    })),
    awakenings: adaptAwakenings(canonical),
    breakthroughs: adaptAwakeningBonuses(canonical),
    awakeningBonuses: asArray(canonical.awakeningBonuses),
    materials: adaptMaterials(canonical),
    lore: canonical.lore || {},
    build: adaptBuild(canonical),
    buildTraits,
    consoleTrait: buildTraits.find((trait) => trait.trigger === 'module_type_count') || null,
    buildPlannerIntegration: {
      baseStatsSource: canonical?.buildPlannerIntegration?.baseStatsSource || canonical?.stats?.baseStatsSource || 'stats.levelStats',
      activeTraits: buildTraits,
      awakeningsAvailable: asArray(canonical?.buildPlannerIntegration?.awakeningsAvailable),
      conditionalEffects: [
        ...asArray(canonical?.buildPlannerIntegration?.conditionalEffects),
        ...asArray(canonical?.passives).flatMap((passive) => asArray(passive.conditionalEffects)),
        ...asArray(canonical?.awakenings).flatMap((awakening) => asArray(awakening.conditionalEffects)),
      ],
      calculatedEffects: asArray(canonical?.buildPlannerIntegration?.calculatedEffects),
    },
    source: canonical.source || null,
    sourceStatus: canonical.importReadiness?.status || canonical.source?.status || '',
    canonical,
    detailReady: true,
  }
}

function checkLevelCoverage(issues, canonical) {
  const rows = asArray(canonical?.stats?.levelStats)
  if (!rows.length) {
    addIssue(issues, 'warning', 'missing_level_stats', 'Missing stats.levelStats.', 'stats.levelStats')
    return
  }
  const levels = new Set(rows.map((row) => Number(row?.level)).filter(Number.isFinite))
  const missing = []
  for (let level = 1; level <= 80; level += 1) {
    if (!levels.has(level)) missing.push(level)
  }
  if (missing.length) {
    addIssue(issues, 'warning', 'incomplete_level_stats', `levelStats does not cover Lv.1-Lv.80. Missing: ${missing.slice(0, 12).join(', ')}${missing.length > 12 ? '...' : ''}.`, 'stats.levelStats')
  }
  if (rows.some((row) => row?.critRate == null || row?.critDmg == null)) {
    addIssue(issues, 'warning', 'partial_combat_stats', 'Some level stat rows are missing CRIT Rate or CRIT DMG; this is allowed but should stay visibly unverified.', 'stats.levelStats')
  }
}

function checkEffects(issues, effects, path) {
  asArray(effects).forEach((effect, index) => {
    const stat = effect?.stat || effect?.statId
    if (!stat) return
    const registryKey = normalizeRegistryStatKey(stat, { source: 'canonical-character-validation' })
    if (!getStatById(registryKey)) {
      addIssue(issues, 'warning', 'unknown_effect_stat', `Effect references unknown stat key "${stat}".`, `${path}.${index}.stat`)
    }
    if ((effect.type === 'battle_conditional' || effect.type === 'awakening') && effect.autoApply === true) {
      addIssue(issues, 'warning', 'unsafe_auto_apply', `Conditional effect "${effect.id || stat}" is marked autoApply=true.`, `${path}.${index}.autoApply`)
    }
  })
}

export function getCharacterImportWarnings(canonicalCharacter) {
  return validateCanonicalCharacter(canonicalCharacter).issues.filter((issue) => issue.severity !== 'error')
}

export function validateCanonicalCharacter(canonicalCharacter) {
  const canonical = asObject(canonicalCharacter)
  const identity = asObject(canonical.identity)
  const build = asObject(canonical.build)
  const issues = []

  if (!nonEmptyString(canonical.id || identity.id)) addIssue(issues, 'error', 'missing_id', 'Missing character id.', 'id')
  if (!nonEmptyString(identity.name || canonical.name)) addIssue(issues, 'error', 'missing_name', 'Missing character name.', 'identity.name')
  if (!VALID_RARITIES.has(normalizeRarity(identity.rarity))) addIssue(issues, 'warning', 'unknown_rarity', `Unknown rarity "${identity.rarity}".`, 'identity.rarity')
  if (!VALID_ELEMENTS.has(normalizeElementId(identity.element))) addIssue(issues, 'warning', 'unknown_element', `Unknown element "${identity.element}".`, 'identity.element')
  if (!VALID_ARC_TYPES.has(normalizeArcTypeId(identity.arcType))) addIssue(issues, 'warning', 'unknown_arc_type', `Unknown arcType "${identity.arcType}".`, 'identity.arcType')
  if (asArray(identity.verificationNotes).some((note) => /faction/i.test(note)) || hasNeedsVerification(identity)) {
    addIssue(issues, 'warning', 'unverified_faction', 'Faction has verification notes or unverified source status.', 'identity.faction')
  }
  checkLevelCoverage(issues, canonical)
  if (canonical?.stats?.baseStatsSource && canonical.stats.baseStatsSource !== 'levelStats' && asArray(canonical?.stats?.levelStats).length) {
    addIssue(issues, 'warning', 'conflicting_stat_sources', 'baseStatsSource is not levelStats even though levelStats are present.', 'stats.baseStatsSource')
  }

  VOICE_LOCALES.forEach((locale) => {
    const entry = canonical?.voiceActors?.[locale]
    const name = typeof entry === 'string' ? entry : entry?.name
    if (!name || hasNeedsVerification(entry)) {
      addIssue(issues, 'warning', 'missing_voice_actor_locale', `${locale} voice actor is missing or needs verification.`, `voiceActors.${locale}`)
    }
  })

  asArray(canonical.skills).forEach((skill, index) => {
    const path = `skills.${index}`
    if (!nonEmptyString(skill?.id)) addIssue(issues, 'warning', 'skill_missing_id', `Skill at index ${index} has no id.`, `${path}.id`)
    if (!nonEmptyString(skill?.name)) addIssue(issues, 'warning', 'skill_missing_name', `Skill "${skill?.id || index}" has no name.`, `${path}.name`)
    const attributes = asObject(skill?.attributesByLevel)
    const keys = Object.keys(attributes)
    if (!keys.length) addIssue(issues, 'warning', 'skill_missing_attributes', `Skill "${skill?.name || skill?.id || index}" has no attributesByLevel.`, `${path}.attributesByLevel`)
    const numericKeys = new Set(numericLevelKeys(attributes))
    asArray(skill?.knownLevels).forEach((level) => {
      if (!numericKeys.has(Number(level))) {
        addIssue(issues, 'warning', 'known_level_missing_attributes', `Skill "${skill?.name || skill?.id || index}" lists known level ${level}, but attributesByLevel has no numeric key for it.`, `${path}.knownLevels`)
      }
    })
    if (keys.some((key) => !/^\d+$/.test(key))) {
      addIssue(issues, 'warning', 'unmapped_skill_attribute_level', `Skill "${skill?.name || skill?.id || index}" has nonnumeric attribute level keys that will be preserved but not rendered as level tabs yet.`, `${path}.attributesByLevel`)
    }
  })

  checkEffects(issues, canonical?.buildPlannerIntegration?.activeTraits, 'buildPlannerIntegration.activeTraits')
  checkEffects(issues, canonical?.buildPlannerIntegration?.conditionalEffects, 'buildPlannerIntegration.conditionalEffects')
  asArray(canonical.passives).forEach((passive, index) => checkEffects(issues, passive?.conditionalEffects, `passives.${index}.conditionalEffects`))
  asArray(canonical.awakenings).forEach((awakening, index) => {
    checkEffects(issues, awakening?.effects, `awakenings.${index}.effects`)
    checkEffects(issues, awakening?.conditionalEffects, `awakenings.${index}.conditionalEffects`)
  })
  asArray(canonical.awakeningBonuses).forEach((bonus, index) => checkEffects(issues, bonus?.effects, `awakeningBonuses.${index}.effects`))

  asArray(build.recommendedWeaponIds).forEach((weaponId, index) => {
    if (!VALID_WEAPON_IDS.has(weaponId)) addIssue(issues, 'warning', 'unknown_recommended_weapon', `Recommended weapon id "${weaponId}" does not exist.`, `build.recommendedWeaponIds.${index}`)
  })
  asArray(build.recommendedCartridgeIds).forEach((cartridgeId, index) => {
    if (!VALID_CARTRIDGE_IDS.has(cartridgeId)) addIssue(issues, 'warning', 'unknown_recommended_cartridge', `Recommended cartridge id "${cartridgeId}" does not exist.`, `build.recommendedCartridgeIds.${index}`)
  })
  ;[...asArray(build.recommendedMainStats), ...asArray(build.recommendedSubStats)].forEach((statId, index) => {
    if (!getStatById(statId)) addIssue(issues, 'warning', 'unknown_recommended_stat', `Recommended stat id "${statId}" does not exist.`, `build.recommendedStats.${index}`)
  })

  const errors = issues.filter((issue) => issue.severity === 'error')
  return {
    ok: errors.length === 0,
    errors,
    warnings: issues.filter((issue) => issue.severity !== 'error'),
    issues,
  }
}
