import type { SourceStatus } from '../../contracts/common.js'
import type { DbClient } from '../../db/client.js'
import { arcTypes, elements, mediaAssets, rarities, stats } from '../../db/schema/index.js'
import { asNumber, asSourceStatus } from './helpers.js'

export type DisplayRef = {
  id: string
  externalId: string
  label: string
  displayName: string
  slug?: string
  color?: string | null
  iconKey?: string | null
  sourceStatus?: SourceStatus
}

export type MediaDisplay = {
  id: string
  externalId: string
  kind: string
  path: string
  alt?: string | null
  sourceUrl?: string | null
  width?: number | null
  height?: number | null
  sourceStatus: SourceStatus
}

export type DisplayMaps = {
  rarities: Map<string, DisplayRef>
  elements: Map<string, DisplayRef>
  arcTypes: Map<string, DisplayRef>
  stats: Map<string, DisplayRef>
  mediaByEntity: Map<string, MediaDisplay[]>
  mediaById: Map<string, MediaDisplay>
}

function displayRef(row: {
  id: string
  externalId: string
  slug?: string
  name: string
  rankLabel?: string | null
  displayName?: string | null
  color?: string | null
  iconKey?: string | null
  sourceStatus?: unknown
}): DisplayRef {
  return {
    id: row.id,
    externalId: row.externalId,
    slug: row.slug,
    label: row.rankLabel || row.displayName || row.name,
    displayName: row.displayName || row.name,
    color: row.color ?? null,
    iconKey: row.iconKey ?? null,
    sourceStatus: row.sourceStatus === undefined ? undefined : asSourceStatus(row.sourceStatus),
  }
}

function mediaDisplay(row: typeof mediaAssets.$inferSelect): MediaDisplay {
  return {
    id: row.id,
    externalId: row.externalId,
    kind: row.kind,
    path: row.path,
    alt: row.alt,
    sourceUrl: row.sourceUrl,
    width: row.width,
    height: row.height,
    sourceStatus: asSourceStatus(row.sourceStatus),
  }
}

export async function loadDisplayMaps(db: DbClient): Promise<DisplayMaps> {
  const [rarityRows, elementRows, arcTypeRows, statRows, mediaRows] = await Promise.all([
    db.select().from(rarities),
    db.select().from(elements),
    db.select().from(arcTypes),
    db.select().from(stats),
    db.select().from(mediaAssets),
  ])

  const mediaByEntity = new Map<string, MediaDisplay[]>()
  const mediaById = new Map<string, MediaDisplay>()

  for (const row of mediaRows) {
    const display = mediaDisplay(row)
    const key = `${row.entityType}:${row.resolvedEntityExternalId || row.entityExternalId}`
    mediaByEntity.set(key, [...(mediaByEntity.get(key) || []), display])
    mediaById.set(row.id, display)
  }

  return {
    rarities: new Map(rarityRows.map((row) => [row.id, displayRef(row)])),
    elements: new Map(elementRows.map((row) => [row.id, displayRef(row)])),
    arcTypes: new Map(arcTypeRows.map((row) => [row.id, displayRef(row)])),
    stats: new Map(statRows.map((row) => [row.id, displayRef(row)])),
    mediaByEntity,
    mediaById,
  }
}

export function firstMediaForEntity(maps: DisplayMaps, entityType: string, externalId: string): MediaDisplay | null {
  return maps.mediaByEntity.get(`${entityType}:${externalId}`)?.[0] ?? null
}

export function statValue(stat: DisplayRef | null, value: unknown) {
  return {
    statId: stat?.id ?? null,
    stat,
    value: asNumber(value),
    valueText: value == null ? null : String(value),
  }
}
