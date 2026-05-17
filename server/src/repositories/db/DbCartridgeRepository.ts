import { eq } from 'drizzle-orm'
import type { CartridgeSetDetail, CartridgeSetSummary } from '../../contracts/cartridges.js'
import type { DbClient } from '../../db/client.js'
import { cartridgeCompatibleShapes, cartridgeSetBonuses, cartridgeSets, moduleShapes } from '../../db/schema/index.js'
import type { CartridgeRepository } from '../CartridgeRepository.js'
import type { FindManyOptions } from '../types.js'
import { firstMediaForEntity, loadDisplayMaps, type DisplayMaps } from './dtoDisplayHelpers.js'
import { asIsoString, asSourceStatus, entityBase, findByIdExternalIdOrSlug } from './helpers.js'

function labelFromToken(value?: string | null): string | null {
  if (!value) return null
  return value.replace(/[-_]+/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function toSummary(row: typeof cartridgeSets.$inferSelect, maps: DisplayMaps): CartridgeSetSummary {
  return {
    ...entityBase(row),
    elementId: row.elementId,
    element: row.elementId ? maps.elements.get(row.elementId) ?? null : null,
    bonusCategory: row.bonusCategory,
    bonusCategoryLabel: labelFromToken(row.bonusCategory),
    dataStatus: row.dataStatus,
    media: firstMediaForEntity(maps, 'cartridge', row.externalId),
  }
}

function toDetail(row: typeof cartridgeSets.$inferSelect, maps: DisplayMaps): CartridgeSetDetail {
  return {
    ...toSummary(row, maps),
    description: row.description,
    raw: row.raw,
    createdAt: asIsoString(row.createdAt),
    updatedAt: asIsoString(row.updatedAt),
    bonuses: [],
  }
}

export class DbCartridgeRepository implements CartridgeRepository {
  constructor(private readonly db: DbClient) {}

  async findMany(filters: FindManyOptions = {}): Promise<CartridgeSetSummary[]> {
    const maps = await loadDisplayMaps(this.db)
    const rows = await this.db.select().from(cartridgeSets).limit(filters.limit ?? 50)
    return rows.map((row) => toSummary(row, maps))
  }

  async findByIdOrSlug(idOrSlug: string): Promise<CartridgeSetDetail | null> {
    const maps = await loadDisplayMaps(this.db)
    const row = await findByIdExternalIdOrSlug(this.db, cartridgeSets, idOrSlug)
    if (!row) return null

    const detail = toDetail(row, maps)
    const [bonusRows, compatibleRows] = await Promise.all([
      this.db.select().from(cartridgeSetBonuses).where(eq(cartridgeSetBonuses.cartridgeSetId, row.id)),
      this.db
        .select({ compatible: cartridgeCompatibleShapes, shape: moduleShapes })
        .from(cartridgeCompatibleShapes)
        .leftJoin(moduleShapes, eq(cartridgeCompatibleShapes.moduleShapeId, moduleShapes.id))
        .where(eq(cartridgeCompatibleShapes.cartridgeSetId, row.id)),
    ])
    detail.bonuses = bonusRows.map((bonus) => ({
      pieces: bonus.pieces,
      effectText: bonus.effectText,
      isConditional: bonus.isConditional,
      sourceStatus: asSourceStatus(bonus.sourceStatus),
    }))
    detail.compatibleShapes = compatibleRows.map(({ compatible, shape }) => ({
      slotIndex: compatible.slotIndex,
      moduleShapeId: compatible.moduleShapeId,
      shapeExternalId: compatible.shapeExternalId,
      shape: shape
        ? {
            id: shape.id,
            externalId: shape.externalId,
            slug: shape.slug,
            name: shape.name,
            moduleType: shape.moduleType,
            width: shape.width,
            height: shape.height,
            cellCount: shape.cellCount,
          }
        : null,
      sourceStatus: asSourceStatus(compatible.sourceStatus),
    }))
    return detail
  }
}
