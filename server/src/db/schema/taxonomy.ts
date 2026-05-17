import { boolean, integer, jsonb, pgTable, text, uniqueIndex } from 'drizzle-orm/pg-core'
import { createdAt, id, sourceStatusEnum, updatedAt } from './common.js'

export const elements = pgTable('elements', {
  id,
  externalId: text('external_id').notNull().unique(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  color: text('color'),
  iconKey: text('icon_key'),
  sortOrder: integer('sort_order').notNull().default(0),
  sourceStatus: sourceStatusEnum('source_status').notNull().default('unknown'),
  createdAt,
  updatedAt,
})

export const arcTypes = pgTable('arc_types', {
  id,
  externalId: text('external_id').notNull().unique(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  iconKey: text('icon_key'),
  sortOrder: integer('sort_order').notNull().default(0),
  sourceStatus: sourceStatusEnum('source_status').notNull().default('unknown'),
  createdAt,
  updatedAt,
})

export const rarities = pgTable('rarities', {
  id,
  externalId: text('external_id').notNull().unique(),
  name: text('name').notNull(),
  rankLabel: text('rank_label'),
  color: text('color'),
  sortOrder: integer('sort_order').notNull().default(0),
  sourceStatus: sourceStatusEnum('source_status').notNull().default('unknown'),
  createdAt,
  updatedAt,
})

export const roles = pgTable('roles', {
  id,
  externalId: text('external_id').notNull().unique(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  description: text('description'),
  aliases: text('aliases').array().notNull().default([]),
  sortOrder: integer('sort_order').notNull().default(0),
  sourceStatus: sourceStatusEnum('source_status').notNull().default('unknown'),
  createdAt,
  updatedAt,
})

export const tags = pgTable('tags', {
  id,
  externalId: text('external_id').notNull().unique(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  description: text('description'),
  aliases: text('aliases').array().notNull().default([]),
  sortOrder: integer('sort_order').notNull().default(0),
  sourceStatus: sourceStatusEnum('source_status').notNull().default('unknown'),
  createdAt,
  updatedAt,
})

export const stats = pgTable('stats', {
  id,
  externalId: text('external_id').notNull().unique(),
  name: text('name').notNull(),
  displayName: text('display_name'),
  category: text('category').notNull(),
  valueType: text('value_type').notNull(),
  iconKey: text('icon_key'),
  allowedAsMainStat: boolean('allowed_as_main_stat').notNull().default(false),
  allowedAsSubStat: boolean('allowed_as_sub_stat').notNull().default(false),
  allowedAsWeaponSubStat: boolean('allowed_as_weapon_sub_stat').notNull().default(false),
  allowedAsCharacterStat: boolean('allowed_as_character_stat').notNull().default(true),
  aliases: text('aliases').array().notNull().default([]),
  metadata: jsonb('metadata').notNull().default({}),
  sortOrder: integer('sort_order').notNull().default(0),
  sourceStatus: sourceStatusEnum('source_status').notNull().default('unknown'),
  createdAt,
  updatedAt,
}, (table) => [
  uniqueIndex('idx_stats_external_id').on(table.externalId),
])
