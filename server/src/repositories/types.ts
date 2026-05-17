import type { ListQuery } from '../contracts/common.js'

export type FindManyOptions = ListQuery

export interface ReadOnlyRepository<TSummary, TDetail = TSummary> {
  findMany(filters?: FindManyOptions): Promise<TSummary[]>
  findByIdOrSlug(idOrSlug: string): Promise<TDetail | null>
}
