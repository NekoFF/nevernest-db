import { eq } from 'drizzle-orm'
import type { WeaponDetail, WeaponSummary } from '../../contracts/weapons.js'
import type { DbClient } from '../../db/client.js'
import { weaponGrowthStats, weaponRefinements, weapons } from '../../db/schema/index.js'
import type { WeaponRepository } from '../WeaponRepository.js'
import type { FindManyOptions } from '../types.js'
import { firstMediaForEntity, loadDisplayMaps, statValue, type DisplayMaps } from './dtoDisplayHelpers.js'
import { asIsoString, asSourceStatus, entityBase, findByIdExternalIdOrSlug } from './helpers.js'

function toSummary(row: typeof weapons.$inferSelect, maps: DisplayMaps): WeaponSummary {
  return {
    ...entityBase(row),
    rarityId: row.rarityId,
    rarity: row.rarityId ? maps.rarities.get(row.rarityId) ?? null : null,
    arcTypeId: row.arcTypeId,
    arcType: row.arcTypeId ? maps.arcTypes.get(row.arcTypeId) ?? null : null,
    mainStatId: row.mainStatId,
    mainStat: row.mainStatId ? statValue(maps.stats.get(row.mainStatId) ?? null, row.mainStatValue) : null,
    subStatId: row.subStatId,
    subStat: row.subStatId ? statValue(maps.stats.get(row.subStatId) ?? null, row.subStatValue) : null,
    media: firstMediaForEntity(maps, 'weapon', row.externalId),
  }
}

function toDetail(row: typeof weapons.$inferSelect, maps: DisplayMaps): WeaponDetail {
  return {
    ...toSummary(row, maps),
    description: row.description,
    quote: row.quote,
    raw: row.raw,
    createdAt: asIsoString(row.createdAt),
    updatedAt: asIsoString(row.updatedAt),
    refinements: [],
  }
}

export class DbWeaponRepository implements WeaponRepository {
  constructor(private readonly db: DbClient) {}

  async findMany(filters: FindManyOptions = {}): Promise<WeaponSummary[]> {
    const maps = await loadDisplayMaps(this.db)
    const rows = await this.db.select().from(weapons).limit(filters.limit ?? 50)
    return rows.map((row) => toSummary(row, maps))
  }

  async findByIdOrSlug(idOrSlug: string): Promise<WeaponDetail | null> {
    const maps = await loadDisplayMaps(this.db)
    const row = await findByIdExternalIdOrSlug(this.db, weapons, idOrSlug)
    if (!row) return null

    const detail = toDetail(row, maps)
    const [refinementRows, growthRows] = await Promise.all([
      this.db.select().from(weaponRefinements).where(eq(weaponRefinements.weaponId, row.id)),
      this.db.select().from(weaponGrowthStats).where(eq(weaponGrowthStats.weaponId, row.id)),
    ])
    detail.refinements = refinementRows.map((refinement) => ({
      rank: refinement.rank,
      effectText: refinement.effectText,
    }))
    detail.growthScaling = growthRows.map((growth) => ({
      level: growth.level,
      ...statValue(maps.stats.get(growth.statId) ?? null, growth.value),
      sourceStatus: asSourceStatus(growth.sourceStatus),
    }))
    return detail
  }
}
