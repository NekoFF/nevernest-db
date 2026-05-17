import { jsonb, numeric, pgTable, text, uuid } from 'drizzle-orm/pg-core'
import { createdAt, id, publicationStatusEnum, sourceStatusEnum, updatedAt } from './common.js'
import { mediaAssets } from './media.js'

export const vehicles = pgTable('vehicles', {
  id,
  externalId: text('external_id').notNull().unique(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  vehicleType: text('vehicle_type').notNull(),
  description: text('description'),
  mediaAssetId: uuid('media_asset_id').references(() => mediaAssets.id, { onDelete: 'set null' }),
  sourceStatus: sourceStatusEnum('source_status').notNull().default('unknown'),
  publicationStatus: publicationStatusEnum('publication_status').notNull().default('draft'),
  raw: jsonb('raw').notNull().default({}),
  createdAt,
  updatedAt,
})

export const vehicleStats = pgTable('vehicle_stats', {
  vehicleId: uuid('vehicle_id').primaryKey().references(() => vehicles.id, { onDelete: 'cascade' }),
  maxSpeed: numeric('max_speed'),
  acceleration: numeric('acceleration'),
  durability: numeric('durability'),
  handlingJson: jsonb('handling_json').notNull().default({}),
  sourceStatus: sourceStatusEnum('source_status').notNull().default('unknown'),
  createdAt,
  updatedAt,
})

export const vehicleAcquisition = pgTable('vehicle_acquisition', {
  id,
  vehicleId: uuid('vehicle_id').notNull().references(() => vehicles.id, { onDelete: 'cascade' }),
  currency: text('currency'),
  price: numeric('price'),
  acquisitionText: text('acquisition_text'),
  sourceStatus: sourceStatusEnum('source_status').notNull().default('unknown'),
  createdAt,
  updatedAt,
})
