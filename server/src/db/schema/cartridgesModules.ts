import { boolean, integer, jsonb, numeric, pgTable, text, uuid } from 'drizzle-orm/pg-core'
import { createdAt, id, publicationStatusEnum, sourceStatusEnum, updatedAt } from './common.js'
import { elements, rarities, stats } from './taxonomy.js'

export const cartridgeSets = pgTable('cartridge_sets', {
  id,
  externalId: text('external_id').notNull().unique(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  elementId: uuid('element_id').references(() => elements.id, { onDelete: 'set null' }),
  bonusCategory: text('bonus_category'),
  description: text('description'),
  dataStatus: text('data_status'),
  sourceStatus: sourceStatusEnum('source_status').notNull().default('unknown'),
  publicationStatus: publicationStatusEnum('publication_status').notNull().default('draft'),
  raw: jsonb('raw').notNull().default({}),
  createdAt,
  updatedAt,
})

export const cartridgeSetBonuses = pgTable('cartridge_set_bonuses', {
  id,
  cartridgeSetId: uuid('cartridge_set_id').notNull().references(() => cartridgeSets.id, { onDelete: 'cascade' }),
  pieces: integer('pieces').notNull(),
  effectText: text('effect_text').notNull(),
  effectJson: jsonb('effect_json').notNull().default({}),
  isConditional: boolean('is_conditional').notNull().default(false),
  sourceStatus: sourceStatusEnum('source_status').notNull().default('unknown'),
  createdAt,
  updatedAt,
})

export const moduleShapes = pgTable('module_shapes', {
  id,
  externalId: text('external_id').notNull().unique(),
  slug: text('slug').notNull().unique(),
  moduleType: text('module_type').notNull(),
  name: text('name').notNull(),
  width: integer('width'),
  height: integer('height'),
  cellCount: integer('cell_count'),
  matrixJson: jsonb('matrix_json').notNull().default([]),
  sourceStatus: sourceStatusEnum('source_status').notNull().default('unknown'),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt,
  updatedAt,
})

export const modulePieces = pgTable('module_pieces', {
  id,
  externalId: text('external_id').notNull().unique(),
  slug: text('slug').notNull().unique(),
  moduleShapeId: uuid('module_shape_id').references(() => moduleShapes.id, { onDelete: 'set null' }),
  rarityId: uuid('rarity_id').references(() => rarities.id, { onDelete: 'set null' }),
  moduleType: text('module_type').notNull(),
  name: text('name').notNull(),
  mainStatId: uuid('main_stat_id').references(() => stats.id, { onDelete: 'set null' }),
  mainStatValue: numeric('main_stat_value'),
  substatsJson: jsonb('substats_json').notNull().default([]),
  sourceStatus: sourceStatusEnum('source_status').notNull().default('unknown'),
  raw: jsonb('raw').notNull().default({}),
  createdAt,
  updatedAt,
})

export const cartridgeCompatibleShapes = pgTable('cartridge_compatible_shapes', {
  id,
  cartridgeSetId: uuid('cartridge_set_id').notNull().references(() => cartridgeSets.id, { onDelete: 'cascade' }),
  slotIndex: integer('slot_index').notNull(),
  moduleShapeId: uuid('module_shape_id').references(() => moduleShapes.id, { onDelete: 'set null' }),
  shapeExternalId: text('shape_external_id'),
  sourceStatus: sourceStatusEnum('source_status').notNull().default('needs_verification'),
  createdAt,
  updatedAt,
})
