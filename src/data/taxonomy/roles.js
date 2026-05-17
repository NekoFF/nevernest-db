import { slugifyEntityName } from '../../utils/entityIdentity.js'

/**
 * Canonical gameplay roles are filterable combat functions. Descriptive labels that are not
 * gameplay functions belong in `tags.js` and later `character_tags`, not `character_roles`.
 */
export const canonicalRoles = Object.freeze([
  { id: 'attack', label: 'Attack', aliases: ['attacker', 'damage', 'dps'], notes: 'Broad offensive role currently used by admin filters; Damage is a legacy broad alias.' },
  { id: 'defense', label: 'Defense', aliases: ['tank', 'defender'], notes: 'Defensive role; keep separate from shield tags until source data is verified.' },
  { id: 'support', label: 'Support', aliases: ['utility'], notes: 'Buffing, healing, control, or team utility role.' },
  { id: 'main-dps', label: 'Main DPS', aliases: ['main damage', 'on-field dps'], notes: 'Primary damage dealer.' },
  { id: 'burst-dps', label: 'Burst DPS', aliases: ['burst damage', 'nuke'], notes: 'Short-window damage role.' },
  { id: 'healer', label: 'Healer', aliases: ['healing'], notes: 'Sustain role through healing.' },
  { id: 'shielder', label: 'Shielder', aliases: ['shield'], notes: 'Sustain role through shields.' },
  { id: 'control', label: 'Control', aliases: ['cc'], notes: 'Crowd-control or disruption role.' },
  { id: 'follow-up-attack', label: 'Follow-up Attack', aliases: ['follow-up', 'follow up attack'], notes: 'Follow-up trigger/combat pattern treated as a gameplay function for import joins.' },
  { id: 'special', label: 'Special', aliases: ['unique', 'legacy-special'], notes: 'Legacy fallback role. Review and replace with a more precise role when source data improves.' },
])

const roleAliasMap = new Map()
for (const role of canonicalRoles) {
  ;[role.id, role.label, ...(role.aliases || [])].forEach((alias) => {
    roleAliasMap.set(slugifyEntityName(alias), role.id)
  })
}

export function normalizeRoleId(value) {
  const normalized = slugifyEntityName(value)
  return roleAliasMap.get(normalized) || normalized
}

export function getRoleById(value) {
  const id = normalizeRoleId(value)
  return canonicalRoles.find((role) => role.id === id) || null
}
