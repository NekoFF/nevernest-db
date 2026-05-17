import { or, eq } from 'drizzle-orm'
import type { SQL } from 'drizzle-orm'
import type { EntitySummary, PublicationStatus, SourceStatus } from '../../contracts/common.js'
import type { DbClient } from '../../db/client.js'

export type DbRepositoryOptions = {
  limit?: number
}

export function asSourceStatus(value: unknown): SourceStatus {
  return (typeof value === 'string' ? value : 'unknown') as SourceStatus
}

export function asPublicationStatus(value: unknown): PublicationStatus {
  return (typeof value === 'string' ? value : 'draft') as PublicationStatus
}

export function asNumber(value: unknown): number | null {
  if (value === null || value === undefined) return null
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

export function asIsoString(value: unknown): string | undefined {
  if (!value) return undefined
  if (value instanceof Date) return value.toISOString()
  return String(value)
}

export function entityBase(row: {
  id: string
  externalId: string
  slug: string
  name?: string
  title?: string
  sourceStatus: unknown
  publicationStatus?: unknown
}): EntitySummary {
  return {
    id: row.id,
    externalId: row.externalId,
    slug: row.slug,
    name: row.name || row.title || row.slug,
    sourceStatus: asSourceStatus(row.sourceStatus),
    publicationStatus: row.publicationStatus === undefined ? undefined : asPublicationStatus(row.publicationStatus),
  }
}

export function isUuidLike(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
}

export async function findByIdExternalIdOrSlug(db: DbClient, table: any, idOrSlug: string): Promise<any | null> {
  const conditions: SQL[] = [eq(table.externalId, idOrSlug), eq(table.slug, idOrSlug)]
  if (isUuidLike(idOrSlug)) {
    conditions.unshift(eq(table.id, idOrSlug))
  }

  const rows = await db.select().from(table).where(or(...conditions)).limit(1)
  return rows[0] ?? null
}
