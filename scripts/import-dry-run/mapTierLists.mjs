import { slug, toArray } from './loadSnapshot.mjs'

export function mapTierLists(snapshot) {
  const tierLists = []
  const tierRows = []
  const tierEntries = []
  const list = snapshot.data.tierList
  if (!list) return { tierLists, tierRows, tierEntries }

  tierLists.push({
    external_id: list.id,
    slug: slug(list.id || list.title),
    title: list.title,
    description: list.description || '',
    list_type: 'official',
    settings_json: list.settings || {},
    source_status: 'unknown',
    publication_status: 'draft',
  })
  for (const [rowIndex, tier] of toArray(list.tiers).entries()) {
    tierRows.push({
      tier_list_external_id: list.id,
      external_id: tier.id,
      label: tier.label,
      subtitle: tier.subtitle || '',
      color: tier.color || '',
      sort_order: rowIndex,
    })
    for (const [position, characterId] of toArray(tier.characterIds).entries()) {
      tierEntries.push({
        tier_list_external_id: list.id,
        tier_row_external_id: tier.id,
        character_external_id: characterId,
        position,
        source_status: 'unknown',
      })
    }
  }

  return { tierLists, tierRows, tierEntries }
}

