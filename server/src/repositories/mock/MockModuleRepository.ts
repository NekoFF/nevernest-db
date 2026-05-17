import type { ModulePieceSummary, ModuleShapeSummary } from '../../contracts/modules.js'
import type { FindManyOptions } from '../types.js'
import type { ModuleRepository } from '../ModuleRepository.js'

export class MockModuleRepository implements ModuleRepository {
  constructor(private readonly shapes: ModuleShapeSummary[] = [], private readonly pieces: ModulePieceSummary[] = []) {}

  async findShapes(_filters?: FindManyOptions) {
    return this.shapes
  }

  async findShapeByIdOrSlug(idOrSlug: string) {
    return this.shapes.find((item) => item.id === idOrSlug || item.externalId === idOrSlug || item.slug === idOrSlug) || null
  }

  async findPieces(_filters?: FindManyOptions) {
    return this.pieces
  }
}
