import { NotImplementedError } from '../utils/errors.js'
import type { FindManyOptions, ReadOnlyRepository } from './types.js'

export class NotImplementedRepository<TSummary, TDetail = TSummary> implements ReadOnlyRepository<TSummary, TDetail> {
  constructor(private readonly resourceName: string) {}

  async findMany(_filters?: FindManyOptions): Promise<TSummary[]> {
    throw new NotImplementedError(`${this.resourceName} repository reads are planned for a later phase.`)
  }

  async findByIdOrSlug(_idOrSlug: string): Promise<TDetail | null> {
    throw new NotImplementedError(`${this.resourceName} repository detail reads are planned for a later phase.`)
  }
}
