import { arrayOfStrings, cloneRaw, entityBase, stringOrEmpty } from './normalizeShared.js'

function normalizeLevelStats(character) {
  const levelStats = character?.levelStats
  if (!levelStats || typeof levelStats !== 'object') return []
  const rows = []
  if (levelStats.level1) rows.push({ level: 1, stats: levelStats.level1, sourceStatus: 'estimated' })
  if (levelStats.level80) rows.push({ level: 80, stats: levelStats.level80, sourceStatus: 'verified' })
  if (levelStats.level90) rows.push({ level: 90, stats: levelStats.level90, sourceStatus: 'estimated' })
  if (Array.isArray(levelStats.keyframes)) {
    levelStats.keyframes.forEach((frame) => rows.push({ level: Number(frame.level), stats: { ...frame }, sourceStatus: frame.sourceStatus || 'verified' }))
  }
  return rows.filter((row) => Number.isFinite(row.level)).map((row) => ({ characterId: character.id, ...row }))
}

export function normalizeCharacterForExport(character = {}) {
  const base = entityBase(character, 'character')
  return {
    ...base,
    rarity: stringOrEmpty(character.rarity),
    elementId: stringOrEmpty(character.element).toLowerCase(),
    arcTypeId: stringOrEmpty(character.arcType).toLowerCase(),
    roleIds: arrayOfStrings(character.roles).map((role) => role.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')),
    tagIds: arrayOfStrings(character.tags),
    faction: stringOrEmpty(character.faction),
    birthday: stringOrEmpty(character.birthday),
    shortDescription: stringOrEmpty(character.shortDescription),
    profileText: stringOrEmpty(character.profileText || character.profile?.text),
    statsByLevel: normalizeLevelStats(character),
    skills: Array.isArray(character.skills) ? character.skills.map((skill) => ({ ...skill, characterId: base.id })) : [],
    materials: character.materials || null,
    voiceActors: Array.isArray(character.voiceActors) ? character.voiceActors.map((actor) => ({ ...actor, characterId: base.id })) : [],
    build: character.build || null,
    consoleSetup: character.consoleSetup || character.console || null,
    raw: cloneRaw(character),
  }
}

