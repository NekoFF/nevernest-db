import { or, eq } from 'drizzle-orm'
import type { MediaAssetSummary } from '../../contracts/media.js'
import type { DbClient } from '../../db/client.js'
import { mediaAssets } from '../../db/schema/index.js'
import type { MediaRepository } from '../MediaRepository.js'
import type { FindManyOptions } from '../types.js'
import { asSourceStatus, isUuidLike } from './helpers.js'

function toSummary(row: typeof mediaAssets.$inferSelect): MediaAssetSummary {
  return {
    id: row.id,
    externalId: row.externalId,
    entityType: row.entityType,
    entityExternalId: row.entityExternalId,
    resolvedEntityExternalId: row.resolvedEntityExternalId,
    kind: row.kind,
    path: row.path,
    alt: row.alt,
    sourceStatus: asSourceStatus(row.sourceStatus),
  }
}

export class DbMediaRepository implements MediaRepository {
  constructor(private readonly db: DbClient) {}

  async findMany(filters: FindManyOptions = {}): Promise<MediaAssetSummary[]> {
    const rows = await this.db.select().from(mediaAssets).limit(filters.limit ?? 50)
    return rows.map(toSummary)
  }

  async findByIdOrSlug(idOrSlug: string): Promise<MediaAssetSummary | null> {
    const conditions = [eq(mediaAssets.externalId, idOrSlug)]
    if (isUuidLike(idOrSlug)) {
      conditions.unshift(eq(mediaAssets.id, idOrSlug))
    }

    const rows = await this.db
      .select()
      .from(mediaAssets)
      .where(or(...conditions))
      .limit(1)
    const row = rows[0] ?? null
    return row ? toSummary(row) : null
  }
}
