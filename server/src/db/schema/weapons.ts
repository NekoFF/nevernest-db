import { integer, jsonb, numeric, pgTable, primaryKey, text, uuid } from 'drizzle-orm/pg-core'
import { characters } from './characters.js'
import { createdAt, id, publicationStatusEnum, sourceStatusEnum, updatedAt } from './common.js'
import { arcTypes, rarities, stats } from './taxonomy.js'

export const weapons = pgTable('weapons', {
  id,
  externalId: text('external_id').notNull().unique(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  rarityId: uuid('rarity_id').references(() => rarities.id, { onDelete: 'set null' }),
  arcTypeId: uuid('arc_type_id').references(() => arcTypes.id, { onDelete: 'set null' }),
  quote: text('quote'),
  description: text('description'),
  mainStatId: uuid('main_stat_id').references(() => stats.id, { onDelete: 'set null' }),
  mainStatValue: numeric('main_stat_value'),
  subStatId: uuid('sub_stat_id').references(() => stats.id, { onDelete: 'set null' }),
  subStatValue: numeric('sub_stat_value'),
  sourceStatus: sourceStatusEnum('source_status').notNull().default('unknown'),
  publicationStatus: publicationStatusEnum('publication_status').notNull().default('draft'),
  raw: jsonb('raw').notNull().default({}),
  createdAt,
  updatedAt,
})

export const weaponRefinements = pgTable('weapon_refinements', {
  id,
  weaponId: uuid('weapon_id').notNull().references(() => weapons.id, { onDelete: 'cascade' }),
  rank: integer('rank').notNull(),
  effectText: text('effect_text').notNull(),
  effectJson: jsonb('effect_json').notNull().default({}),
  sourceStatus: sourceStatusEnum('source_status').notNull().default('unknown'),
  createdAt,
  updatedAt,
})

export const weaponGrowthStats = pgTable('weapon_growth_stats', {
  id,
  weaponId: uuid('weapon_id').notNull().references(() => weapons.id, { onDelete: 'cascade' }),
  level: integer('level').notNull(),
  statId: uuid('stat_id').notNull().references(() => stats.id, { onDelete: 'restrict' }),
  value: numeric('value').notNull(),
  sourceStatus: sourceStatusEnum('source_status').notNull().default('unknown'),
  createdAt,
  updatedAt,
})

export const weaponRecommendedCharacters = pgTable('weapon_recommended_characters', {
  weaponId: uuid('weapon_id').notNull().references(() => weapons.id, { onDelete: 'cascade' }),
  characterId: uuid('character_id').notNull().references(() => characters.id, { onDelete: 'cascade' }),
  priority: integer('priority').notNull().default(0),
  note: text('note'),
  sourceStatus: sourceStatusEnum('source_status').notNull().default('unknown'),
  createdAt,
}, (table) => [
  primaryKey({ columns: [table.weaponId, table.characterId] }),
])
