import { officialTierList } from '../../../data/tierList.js'
import { idOf } from './taxonomyLookups.js'

export function mapApiOfficialTierListToViewModel(row) {
  const raw = row?.raw && typeof row.raw === 'object' ? row.raw : {}
  const hasRows = Array.isArray(row?.rows) && row.rows.length > 0
  if (!hasRows) {
    return {
      ...officialTierList,
      id: row?.externalId || officialTierList.id,
      externalId: row?.externalId,
      slug: row?.slug || row?.externalId || officialTierList.id,
      title: row?.title || officialTierList.title,
      description: row?.description || officialTierList.description,
      sourceStatus: row?.sourceStatus,
      publicationStatus: row?.publicationStatus,
      apiRowsAvailable: false,
    }
  }

  return {
    ...officialTierList,
    ...raw,
    id: idOf(row),
    externalId: row.externalId,
    slug: row.slug || row.externalId || row.id,
    title: row.title || raw.title || officialTierList.title,
    description: row.description || raw.description || officialTierList.description,
    tiers: row.rows.map((tier, index) => ({
      id: tier.externalId || `tier-${index + 1}`,
      label: tier.label,
      subtitle: tier.subtitle || '',
      color: tier.color || '#94a3b8',
      characterIds: (tier.entries || []).sort((a, b) => a.position - b.position).map((entry) => entry.characterExternalId || entry.characterSlug || entry.characterId),
      entries: (tier.entries || []).sort((a, b) => a.position - b.position).map((entry) => ({
        characterId: entry.characterExternalId || entry.characterSlug || entry.characterId,
        name: entry.characterName,
        avatar: entry.characterAvatar?.path || null,
        rarity: entry.rarity?.displayName || entry.rarity?.label || null,
        note: entry.note || '',
      })),
    })),
    sourceStatus: row.sourceStatus,
    publicationStatus: row.publicationStatus,
    apiRowsAvailable: true,
  }
}
