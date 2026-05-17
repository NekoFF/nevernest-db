import type { TierListRepository } from '../repositories/TierListRepository.js'
import type { FindManyOptions } from '../repositories/types.js'
import { NotFoundError } from '../utils/errors.js'
import { plannedServiceMethod } from './base.js'

export class TierListService {
  constructor(private readonly repository?: TierListRepository) {}

  async list(filters?: FindManyOptions) {
    if (this.repository) return this.repository.findMany(filters)
    return plannedServiceMethod('Tier list')
  }

  async getByIdOrSlug(idOrSlug: string) {
    if (!this.repository) return plannedServiceMethod('Tier list')
    const tierList = await this.repository.findByIdOrSlug(idOrSlug)
    if (!tierList) throw new NotFoundError('Tier list not found.')
    return tierList
  }
}
