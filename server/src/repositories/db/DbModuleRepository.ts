import { eq } from 'drizzle-orm'
import type { ModulePieceSummary, ModuleShapeSummary } from '../../contracts/modules.js'
import type { DbClient } from '../../db/client.js'
import { modulePieces, moduleShapes } from '../../db/schema/index.js'
import type { ModuleRepository } from '../ModuleRepository.js'
import type { FindManyOptions } from '../types.js'
import { loadDisplayMaps, statValue, type DisplayMaps } from './dtoDisplayHelpers.js'
import { asSourceStatus, entityBase, findByIdExternalIdOrSlug } from './helpers.js'

function toShape(row: typeof moduleShapes.$inferSelect): ModuleShapeSummary {
  return {
    ...entityBase(row),
    moduleType: row.moduleType,
    moduleTypeLabel: `Type ${row.moduleType}`,
    width: row.width,
    height: row.height,
    cellCount: row.cellCount,
  }
}

function toPiece(row: typeof modulePieces.$inferSelect, maps: DisplayMaps, shape?: typeof moduleShapes.$inferSelect | null): ModulePieceSummary {
  return {
    ...entityBase(row),
    moduleShapeId: row.moduleShapeId || '',
    moduleShape: shape ? toShape(shape) : null,
    rarityId: row.rarityId,
    rarity: row.rarityId ? maps.rarities.get(row.rarityId) ?? null : null,
    moduleType: row.moduleType,
    moduleTypeLabel: `Type ${row.moduleType}`,
    mainStatId: row.mainStatId,
    mainStat: row.mainStatId ? statValue(maps.stats.get(row.mainStatId) ?? null, row.mainStatValue) : null,
    substats: Array.isArray(row.substatsJson) ? row.substatsJson : [],
    sourceStatus: asSourceStatus(row.sourceStatus),
  }
}

export class DbModuleRepository implements ModuleRepository {
  constructor(private readonly db: DbClient) {}

  async findShapes(filters: FindManyOptions = {}): Promise<ModuleShapeSummary[]> {
    const rows = await this.db.select().from(moduleShapes).limit(filters.limit ?? 50)
    return rows.map(toShape)
  }

  async findShapeByIdOrSlug(idOrSlug: string): Promise<ModuleShapeSummary | null> {
    const row = await findByIdExternalIdOrSlug(this.db, moduleShapes, idOrSlug)
    return row ? toShape(row) : null
  }

  async findPieces(filters: FindManyOptions = {}): Promise<ModulePieceSummary[]> {
    const maps = await loadDisplayMaps(this.db)
    const rows = await this.db
      .select({ piece: modulePieces, shape: moduleShapes })
      .from(modulePieces)
      .leftJoin(moduleShapes, eq(modulePieces.moduleShapeId, moduleShapes.id))
      .limit(filters.limit ?? 50)
    return rows.map(({ piece, shape }) => toPiece(piece, maps, shape))
  }
}
