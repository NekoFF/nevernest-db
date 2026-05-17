import type { EntitySummary, SourceStatus } from './common.js'

export type MediaAssetSummary = Omit<EntitySummary, 'slug' | 'name'> & {
  entityType: string
  entityExternalId: string
  resolvedEntityExternalId: string
  kind: string
  path: string
  alt?: string | null
  sourceStatus: SourceStatus
}
