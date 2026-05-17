import type { FindManyOptions, ReadOnlyRepository } from '../types.js'

type SearchableItem = {
  id?: string
  externalId?: string
  slug?: string
  name?: string
  title?: string
}

function matchesQuery(item: SearchableItem, q?: string) {
  if (!q) return true
  const needle = q.toLowerCase()
  return [item.name, item.title, item.slug, item.externalId].filter(Boolean).some((value) => String(value).toLowerCase().includes(needle))
}

export class MockReadOnlyRepository<TSummary extends SearchableItem, TDetail extends TSummary = TSummary> implements ReadOnlyRepository<TSummary, TDetail> {
  constructor(private readonly items: TDetail[]) {}

  async findMany(filters: FindManyOptions = {}): Promise<TSummary[]> {
    const page = filters.page || 1
    const limit = filters.limit || this.items.length || 24
    const filtered = this.items.filter((item) => matchesQuery(item, filters.q))
    return filtered.slice((page - 1) * limit, page * limit)
  }

  async findByIdOrSlug(idOrSlug: string): Promise<TDetail | null> {
    return this.items.find((item) => item.id === idOrSlug || item.externalId === idOrSlug || item.slug === idOrSlug) || null
  }
}
