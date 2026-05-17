import type { ModuleRepository } from '../repositories/ModuleRepository.js'
import type { FindManyOptions } from '../repositories/types.js'
import { plannedServiceMethod } from './base.js'

export class ModuleService {
  constructor(private readonly repository?: ModuleRepository) {}

  async listShapes(filters?: FindManyOptions) {
    if (this.repository) return this.repository.findShapes(filters)
    return plannedServiceMethod('Module')
  }

  async listPieces(filters?: FindManyOptions) {
    if (this.repository) return this.repository.findPieces(filters)
    return plannedServiceMethod('Module')
  }
}
