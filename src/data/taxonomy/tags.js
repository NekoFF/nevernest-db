import { slugifyEntityName } from '../../utils/entityIdentity.js'

/**
 * Tags are descriptive/freeform labels. They can overlap with roles in legacy data, but SQL
 * should store them separately in `tags` and `character_tags`.
 */
export const canonicalTags = Object.freeze([
  { id: 'damage', label: 'Damage', aliases: ['dmg'], notes: 'Generic damage descriptor; not specific enough to be a role.' },
  { id: 'main-dps', label: 'Main DPS', aliases: ['main damage', 'on-field dps'], notes: 'Legacy tag alias for the gameplay role; keep for current seed compatibility.' },
  { id: 'burst-dps', label: 'Burst DPS', aliases: ['burst damage'], notes: 'Legacy tag alias for the gameplay role; keep for current seed compatibility.' },
  { id: 'dot', label: 'DoT', aliases: ['damage-over-time'], notes: 'Damage over time descriptor.' },
  { id: 'healing', label: 'Healing', aliases: ['healer'], notes: 'Legacy tag alias for healer/sustain function.' },
  { id: 'shield', label: 'Shield', aliases: ['shielder'], notes: 'Legacy tag alias for shielder/sustain function.' },
  { id: 'buff', label: 'Buff', aliases: ['team-buff'], notes: 'Positive effect descriptor.' },
  { id: 'control', label: 'Control', aliases: ['cc'], notes: 'Legacy tag alias for control gameplay function.' },
  { id: 'dmg-boost', label: 'DMG Boost', aliases: ['damage-boost'], notes: 'Damage increase descriptor.' },
  { id: 'dmg-redirection', label: 'DMG Redirection', aliases: ['damage-redirection'], notes: 'Damage transfer/redirect descriptor.' },
  { id: 'follow-up-attack', label: 'Follow-up Attack', aliases: ['follow-up'], notes: 'Trigger/combat pattern descriptor.' },
  { id: 'instant-cycle', label: 'Instant Cycle', aliases: ['cycle'], notes: 'Esper/rotation descriptor.' },
  { id: 'survival', label: 'Survival', aliases: ['sustain'], notes: 'General survivability descriptor.' },
  { id: 'break-boost', label: 'Break Boost', aliases: ['break'], notes: 'Break/destruction enhancement descriptor.' },
  { id: 'special', label: 'Special', aliases: ['unique'], notes: 'Legacy catch-all until better source data exists.' },
])

const tagAliasMap = new Map()
for (const tag of canonicalTags) {
  ;[tag.id, tag.label, ...(tag.aliases || [])].forEach((alias) => {
    tagAliasMap.set(slugifyEntityName(alias), tag.id)
  })
}

export function normalizeTagId(value) {
  const normalized = slugifyEntityName(value)
  return tagAliasMap.get(normalized) || normalized
}

export function getTagById(value) {
  const id = normalizeTagId(value)
  return canonicalTags.find((tag) => tag.id === id) || null
}
