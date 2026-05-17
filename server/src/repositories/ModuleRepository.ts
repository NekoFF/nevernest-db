import type { ModulePieceSummary, ModuleShapeSummary } from '../contracts/modules.js'
import type { FindManyOptions } from './types.js'

export interface ModuleRepository {
  findShapes(filters?: FindManyOptions): Promise<ModuleShapeSummary[]>
  findShapeByIdOrSlug(idOrSlug: string): Promise<ModuleShapeSummary | null>
  findPieces(filters?: FindManyOptions): Promise<ModulePieceSummary[]>
}
