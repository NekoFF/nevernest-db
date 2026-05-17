import { asc, eq } from 'drizzle-orm'
import type { TierListDetail, TierListSummary } from '../../contracts/tierLists.js'
import type { DbClient } from '../../db/client.js'
import { characters, tierEntries, tierLists, tierRows } from '../../db/schema/index.js'
import type { TierListRepository } from '../TierListRepository.js'
import type { FindManyOptions } from '../types.js'
import { firstMediaForEntity, loadDisplayMaps } from './dtoDisplayHelpers.js'
import { asIsoString, asSourceStatus, entityBase, findByIdExternalIdOrSlug } from './helpers.js'

function toSummary(row: typeof tierLists.$inferSelect): TierListSummary {
  return {
    ...entityBase(row),
    title: row.title,
    listType: row.listType,
  }
}

function toDetail(row: typeof tierLists.$inferSelect): TierListDetail {
  return {
    ...toSummary(row),
    description: row.description,
    raw: row.settingsJson,
    createdAt: asIsoString(row.createdAt),
    updatedAt: asIsoString(row.updatedAt),
    rows: [],
  }
}

export class DbTierListRepository implements TierListRepository {
  constructor(private readonly db: DbClient) {}

  async findMany(filters: FindManyOptions = {}): Promise<TierListSummary[]> {
    const rows = await this.db.select().from(tierLists).where(eq(tierLists.listType, 'official')).limit(filters.limit ?? 50)
    const details = await Promise.all(rows.map((row) => this.findByIdOrSlug(row.externalId)))
    return details.filter((row): row is TierListDetail => Boolean(row))
  }

  async findByIdOrSlug(idOrSlug: string): Promise<TierListDetail | null> {
    const maps = await loadDisplayMaps(this.db)
    const row = await findByIdExternalIdOrSlug(this.db, tierLists, idOrSlug)
    if (!row || row.listType !== 'official') return null

    const detail = toDetail(row)
    const rows = await this.db.select().from(tierRows).where(eq(tierRows.tierListId, row.id)).orderBy(asc(tierRows.sortOrder))
    const entries = await this.db
      .select({ entry: tierEntries, character: characters })
      .from(tierEntries)
      .innerJoin(characters, eq(tierEntries.characterId, characters.id))
      .where(eq(tierEntries.tierListId, row.id))
      .orderBy(asc(tierEntries.position))

    detail.rows = rows.map((tierRow) => ({
      externalId: tierRow.externalId,
      label: tierRow.label,
      subtitle: tierRow.subtitle,
      color: tierRow.color,
      sortOrder: tierRow.sortOrder,
      entries: entries
        .filter(({ entry }) => entry.tierRowId === tierRow.id)
        .map(({ entry, character }) => ({
          characterId: entry.characterId,
          characterExternalId: character.externalId,
          characterSlug: character.slug,
          characterName: character.name,
          characterAvatar: firstMediaForEntity(maps, 'character', character.externalId),
          rarity: character.rarityId ? maps.rarities.get(character.rarityId) ?? null : null,
          position: entry.position,
          note: entry.note,
          sourceStatus: asSourceStatus(entry.sourceStatus),
        })),
    }))
    return detail
  }
}
