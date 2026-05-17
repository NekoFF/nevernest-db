import type { WeaponRepository } from '../repositories/WeaponRepository.js'
import type { FindManyOptions } from '../repositories/types.js'
import { NotFoundError } from '../utils/errors.js'
import { plannedServiceMethod } from './base.js'

export class WeaponService {
  constructor(private readonly repository?: WeaponRepository) {}

  async list(filters?: FindManyOptions) {
    if (this.repository) return this.repository.findMany(filters)
    return plannedServiceMethod('Weapon')
  }

  async getByIdOrSlug(idOrSlug: string) {
    if (!this.repository) return plannedServiceMethod('Weapon')
    const weapon = await this.repository.findByIdOrSlug(idOrSlug)
    if (!weapon) throw new NotFoundError('Weapon not found.')
    return weapon
  }
}
