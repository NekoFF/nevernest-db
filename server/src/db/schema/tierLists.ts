import { integer, jsonb, pgTable, text, uniqueIndex, uuid } from 'drizzle-orm/pg-core'
import { characters } from './characters.js'
import { createdAt, id, publicationStatusEnum, sourceStatusEnum, tierListTypeEnum, updatedAt, visibilityStatusEnum } from './common.js'
import { users } from './usersAuth.js'

export const tierLists = pgTable('tier_lists', {
  id,
  externalId: text('external_id').notNull().unique(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  description: text('description'),
  listType: tierListTypeEnum('list_type').notNull().default('official'),
  ownerUserId: uuid('owner_user_id').references(() => users.id, { onDelete: 'set null' }),
  settingsJson: jsonb('settings_json').notNull().default({}),
  sourceStatus: sourceStatusEnum('source_status').notNull().default('unknown'),
  publicationStatus: publicationStatusEnum('publication_status').notNull().default('draft'),
  createdAt,
  updatedAt,
})

export const tierRows = pgTable('tier_rows', {
  id,
  tierListId: uuid('tier_list_id').notNull().references(() => tierLists.id, { onDelete: 'cascade' }),
  externalId: text('external_id'),
  label: text('label').notNull(),
  subtitle: text('subtitle'),
  color: text('color'),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt,
  updatedAt,
})

export const tierEntries = pgTable('tier_entries', {
  id,
  tierListId: uuid('tier_list_id').notNull().references(() => tierLists.id, { onDelete: 'cascade' }),
  tierRowId: uuid('tier_row_id').notNull().references(() => tierRows.id, { onDelete: 'cascade' }),
  characterId: uuid('character_id').notNull().references(() => characters.id, { onDelete: 'cascade' }),
  position: integer('position').notNull().default(0),
  note: text('note'),
  sourceStatus: sourceStatusEnum('source_status').notNull().default('unknown'),
  createdAt,
  updatedAt,
}, (table) => [
  uniqueIndex('idx_tier_entries_list_character').on(table.tierListId, table.characterId),
])

export const userTierLists = pgTable('user_tier_lists', {
  id,
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  tierListId: uuid('tier_list_id').notNull().references(() => tierLists.id, { onDelete: 'cascade' }),
  visibility: visibilityStatusEnum('visibility').notNull().default('private'),
  createdAt,
  updatedAt,
})
