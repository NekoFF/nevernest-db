import { integer, jsonb, pgTable, text } from 'drizzle-orm/pg-core'
import { createdAt, id, sourceStatusEnum, updatedAt } from './common.js'

export const mediaAssets = pgTable('media_assets', {
  id,
  externalId: text('external_id').notNull().unique(),
  entityType: text('entity_type').notNull(),
  entityExternalId: text('entity_external_id').notNull(),
  resolvedEntityExternalId: text('resolved_entity_external_id').notNull(),
  kind: text('kind').notNull(),
  path: text('path').notNull(),
  alt: text('alt'),
  sourceUrl: text('source_url'),
  licenseNote: text('license_note'),
  width: integer('width'),
  height: integer('height'),
  sourceStatus: sourceStatusEnum('source_status').notNull().default('unknown'),
  metadata: jsonb('metadata').notNull().default({}),
  createdAt,
  updatedAt,
})
