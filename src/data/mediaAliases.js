import { slugifyEntityName } from '../utils/entityIdentity.js'

/**
 * Explicit filename/asset aliases for media records whose filename-derived id does not match
 * the canonical entity id. Keep these mappings visible for SQL media import instead of relying
 * only on name-based fallback behavior in asset helpers.
 */
export const mediaEntityAliases = Object.freeze({
  characters: Object.freeze({
    daffodill: 'daffodil',
    haniel: 'hanizel',
    zero: 'zero-female',
    'zero-2': 'zero-male',
  }),
  vehicles: Object.freeze({
    a1: 'rover-a1',
    lavelox: 'la-velox',
    'novis-st-x-950': 'novis-stx-950',
    rivok: 'future-surge',
  }),
  cartridges: Object.freeze({
    'fireflies-and-the-forest-a': 'fireflies-and-the-forest',
  }),
})

const singularToPlural = Object.freeze({
  character: 'characters',
  weapon: 'weapons',
  cartridge: 'cartridges',
  vehicle: 'vehicles',
  misc: 'misc',
})

export function getMediaAliasGroup(entityType) {
  return singularToPlural[entityType] || entityType
}

export function resolveMediaEntityId(entityType, entityId) {
  const normalizedId = slugifyEntityName(entityId)
  const aliasGroup = getMediaAliasGroup(entityType)
  return mediaEntityAliases[aliasGroup]?.[normalizedId] || normalizedId
}

export function isResolvedMediaAlias(entityType, entityId) {
  const normalizedId = slugifyEntityName(entityId)
  return resolveMediaEntityId(entityType, normalizedId) !== normalizedId
}
