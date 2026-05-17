import type { CartridgeRepository } from '../repositories/CartridgeRepository.js'
import type { FindManyOptions } from '../repositories/types.js'
import { NotFoundError } from '../utils/errors.js'
import { plannedServiceMethod } from './base.js'

export class CartridgeService {
  constructor(private readonly repository?: CartridgeRepository) {}

  async list(filters?: FindManyOptions) {
    if (this.repository) return this.repository.findMany(filters)
    return plannedServiceMethod('Cartridge')
  }

  async getByIdOrSlug(idOrSlug: string) {
    if (!this.repository) return plannedServiceMethod('Cartridge')
    const cartridge = await this.repository.findByIdOrSlug(idOrSlug)
    if (!cartridge) throw new NotFoundError('Cartridge not found.')
    return cartridge
  }
}
