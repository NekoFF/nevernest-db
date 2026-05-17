import type { VehicleRepository } from '../repositories/VehicleRepository.js'
import type { FindManyOptions } from '../repositories/types.js'
import { NotFoundError } from '../utils/errors.js'
import { plannedServiceMethod } from './base.js'

export class VehicleService {
  constructor(private readonly repository?: VehicleRepository) {}

  async list(filters?: FindManyOptions) {
    if (this.repository) return this.repository.findMany(filters)
    return plannedServiceMethod('Vehicle')
  }

  async getByIdOrSlug(idOrSlug: string) {
    if (!this.repository) return plannedServiceMethod('Vehicle')
    const vehicle = await this.repository.findByIdOrSlug(idOrSlug)
    if (!vehicle) throw new NotFoundError('Vehicle not found.')
    return vehicle
  }
}
