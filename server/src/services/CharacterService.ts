import type { CharacterRepository } from '../repositories/CharacterRepository.js'
import type { FindManyOptions } from '../repositories/types.js'
import { NotFoundError } from '../utils/errors.js'
import { plannedServiceMethod } from './base.js'

export class CharacterService {
  constructor(private readonly repository?: CharacterRepository) {}

  async list(filters?: FindManyOptions) {
    if (this.repository) return this.repository.findMany(filters)
    return plannedServiceMethod('Character')
  }

  async getByIdOrSlug(idOrSlug: string) {
    if (!this.repository) return plannedServiceMethod('Character')
    const character = await this.repository.findByIdOrSlug(idOrSlug)
    if (!character) throw new NotFoundError('Character not found.')
    return character
  }
}
