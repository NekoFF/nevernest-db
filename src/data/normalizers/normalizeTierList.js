import { cloneRaw, stringOrEmpty } from './normalizeShared.js'

export function normalizeTierListForExport(list = {}, listType = 'official') {
  const id = stringOrEmpty(list.id || `${listType}-tier-list`)
  return {
    id,
    title: stringOrEmpty(list.title),
    description: stringOrEmpty(list.description),
    updatedAt: stringOrEmpty(list.updatedAt),
    listType,
    settings: list.settings && typeof list.settings === 'object' ? { ...list.settings } : {},
    tiers: Array.isArray(list.tiers) ? list.tiers.map((tier) => ({
      id: stringOrEmpty(tier.id),
      tierListId: id,
      label: stringOrEmpty(tier.label),
      subtitle: stringOrEmpty(tier.subtitle),
      color: stringOrEmpty(tier.color),
      entries: (tier.characterIds || []).map((characterId, index) => ({
        tierListId: id,
        tierId: stringOrEmpty(tier.id),
        characterId: stringOrEmpty(characterId),
        position: index,
      })),
    })) : [],
    raw: cloneRaw(list),
  }
}

