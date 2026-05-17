import { eq } from 'drizzle-orm'
import type { VehicleDetail, VehicleSummary } from '../../contracts/vehicles.js'
import type { DbClient } from '../../db/client.js'
import { vehicleAcquisition, vehicles, vehicleStats } from '../../db/schema/index.js'
import type { VehicleRepository } from '../VehicleRepository.js'
import type { FindManyOptions } from '../types.js'
import { loadDisplayMaps, type DisplayMaps } from './dtoDisplayHelpers.js'
import { asIsoString, asNumber, asSourceStatus, entityBase, findByIdExternalIdOrSlug } from './helpers.js'

function labelFromToken(value: string): string {
  return value.replace(/[-_]+/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function toSummary(row: typeof vehicles.$inferSelect, maps: DisplayMaps): VehicleSummary {
  return {
    ...entityBase(row),
    vehicleType: row.vehicleType,
    vehicleTypeLabel: labelFromToken(row.vehicleType),
    mediaAssetId: row.mediaAssetId,
    media: row.mediaAssetId ? maps.mediaById.get(row.mediaAssetId) ?? null : maps.mediaByEntity.get(`vehicle:${row.externalId}`)?.[0] ?? null,
  }
}

function toDetail(row: typeof vehicles.$inferSelect, maps: DisplayMaps): VehicleDetail {
  return {
    ...toSummary(row, maps),
    description: row.description,
    raw: row.raw,
    createdAt: asIsoString(row.createdAt),
    updatedAt: asIsoString(row.updatedAt),
    stats: null,
  }
}

export class DbVehicleRepository implements VehicleRepository {
  constructor(private readonly db: DbClient) {}

  async findMany(filters: FindManyOptions = {}): Promise<VehicleSummary[]> {
    const maps = await loadDisplayMaps(this.db)
    const rows = await this.db.select().from(vehicles).limit(filters.limit ?? 50)
    return rows.map((row) => toSummary(row, maps))
  }

  async findByIdOrSlug(idOrSlug: string): Promise<VehicleDetail | null> {
    const maps = await loadDisplayMaps(this.db)
    const row = await findByIdExternalIdOrSlug(this.db, vehicles, idOrSlug)
    if (!row) return null

    const detail = toDetail(row, maps)
    const [statsRow, acquisitionRows] = await Promise.all([
      this.db.select().from(vehicleStats).where(eq(vehicleStats.vehicleId, row.id)).limit(1),
      this.db.select().from(vehicleAcquisition).where(eq(vehicleAcquisition.vehicleId, row.id)),
    ])
    const stats = statsRow[0]
    detail.stats = stats
      ? {
          maxSpeed: asNumber(stats.maxSpeed),
          acceleration: asNumber(stats.acceleration),
          durability: asNumber(stats.durability),
          handling: stats.handlingJson,
        }
      : null
    detail.acquisition = acquisitionRows.map((acquisition) => ({
      currency: acquisition.currency,
      price: asNumber(acquisition.price),
      acquisitionText: acquisition.acquisitionText,
      sourceStatus: asSourceStatus(acquisition.sourceStatus),
    }))
    return detail
  }
}
