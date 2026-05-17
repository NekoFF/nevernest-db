import { dateOnly, idOf } from './taxonomyLookups.js'

export function mapApiCodeToViewModel(row) {
  return {
    id: idOf(row),
    externalId: row.externalId,
    code: row.code,
    rewardSummary: row.rewardSummary || '',
    status: row.status || 'unknown',
    enabled: true,
    sourceStatus: row.sourceStatus,
  }
}

export function mapApiNewsToViewModel(row) {
  const raw = row?.raw && typeof row.raw === 'object' ? row.raw : {}
  return {
    ...raw,
    id: idOf(row),
    externalId: row.externalId,
    slug: row.slug || row.externalId || row.id,
    title: row.title || row.name || raw.title,
    name: row.name || row.title || raw.name,
    description: row.description || raw.description || '',
    category: row.category || raw.category || 'Official',
    date: dateOnly(row.postedAt || raw.date),
    postedAt: row.postedAt,
    featured: Boolean(row.featured ?? raw.featured),
    pinned: Boolean(row.pinned ?? raw.pinned),
    sourceUrl: row.sourceUrl || raw.sourceUrl || '',
    sourceLabel: raw.sourceLabel || '',
    imageUrl: raw.imageUrl || '',
    sourceStatus: row.sourceStatus,
    publicationStatus: row.publicationStatus,
  }
}
