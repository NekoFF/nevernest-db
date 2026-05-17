import { integer, jsonb, numeric, pgTable, primaryKey, text, uniqueIndex, uuid } from 'drizzle-orm/pg-core'
import { createdAt, id, publicationStatusEnum, sourceStatusEnum, updatedAt } from './common.js'
import { mediaAssets } from './media.js'
import { arcTypes, elements, rarities, roles, stats, tags } from './taxonomy.js'

export const characters = pgTable('characters', {
  id,
  externalId: text('external_id').notNull().unique(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  rarityId: uuid('rarity_id').references(() => rarities.id, { onDelete: 'set null' }),
  elementId: uuid('element_id').references(() => elements.id, { onDelete: 'set null' }),
  arcTypeId: uuid('arc_type_id').references(() => arcTypes.id, { onDelete: 'set null' }),
  faction: text('faction'),
  birthday: text('birthday'),
  esperAbility: text('esper_ability'),
  profileText: text('profile_text'),
  description: text('description'),
  quote: text('quote'),
  sourceStatus: sourceStatusEnum('source_status').notNull().default('unknown'),
  publicationStatus: publicationStatusEnum('publication_status').notNull().default('draft'),
  raw: jsonb('raw').notNull().default({}),
  createdAt,
  updatedAt,
}, (table) => [
  uniqueIndex('idx_characters_external_id').on(table.externalId),
  uniqueIndex('idx_characters_slug').on(table.slug),
])

export const characterRoles = pgTable('character_roles', {
  characterId: uuid('character_id').notNull().references(() => characters.id, { onDelete: 'cascade' }),
  roleId: uuid('role_id').notNull().references(() => roles.id, { onDelete: 'restrict' }),
  sourceStatus: sourceStatusEnum('source_status').notNull().default('unknown'),
  createdAt,
}, (table) => [
  primaryKey({ columns: [table.characterId, table.roleId] }),
])

export const characterTags = pgTable('character_tags', {
  characterId: uuid('character_id').notNull().references(() => characters.id, { onDelete: 'cascade' }),
  tagId: uuid('tag_id').notNull().references(() => tags.id, { onDelete: 'restrict' }),
  sourceStatus: sourceStatusEnum('source_status').notNull().default('unknown'),
  createdAt,
}, (table) => [
  primaryKey({ columns: [table.characterId, table.tagId] }),
])

export const characterStats = pgTable('character_stats', {
  id,
  characterId: uuid('character_id').notNull().references(() => characters.id, { onDelete: 'cascade' }),
  statId: uuid('stat_id').notNull().references(() => stats.id, { onDelete: 'restrict' }),
  level: integer('level'),
  value: numeric('value'),
  valueText: text('value_text'),
  sourceStatus: sourceStatusEnum('source_status').notNull().default('unknown'),
  metadata: jsonb('metadata').notNull().default({}),
  createdAt,
  updatedAt,
})

export const characterSkills = pgTable('character_skills', {
  id,
  externalId: text('external_id'),
  characterId: uuid('character_id').notNull().references(() => characters.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  skillType: text('skill_type').notNull(),
  description: text('description'),
  maxLevel: integer('max_level'),
  effectJson: jsonb('effect_json').notNull().default({}),
  sourceStatus: sourceStatusEnum('source_status').notNull().default('unknown'),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt,
  updatedAt,
})

export const materials = pgTable('materials', {
  id,
  externalId: text('external_id').notNull().unique(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  rarityId: uuid('rarity_id').references(() => rarities.id, { onDelete: 'set null' }),
  category: text('category'),
  sourceText: text('source_text'),
  mediaAssetId: uuid('media_asset_id').references(() => mediaAssets.id, { onDelete: 'set null' }),
  sourceStatus: sourceStatusEnum('source_status').notNull().default('unknown'),
  raw: jsonb('raw').notNull().default({}),
  createdAt,
  updatedAt,
})

export const characterMaterials = pgTable('character_materials', {
  id,
  characterId: uuid('character_id').notNull().references(() => characters.id, { onDelete: 'cascade' }),
  materialId: uuid('material_id').references(() => materials.id, { onDelete: 'set null' }),
  materialName: text('material_name'),
  context: text('context').notNull(),
  level: integer('level'),
  amount: integer('amount'),
  sourceStatus: sourceStatusEnum('source_status').notNull().default('unknown'),
  createdAt,
  updatedAt,
})

export const characterVoiceActors = pgTable('character_voice_actors', {
  id,
  characterId: uuid('character_id').notNull().references(() => characters.id, { onDelete: 'cascade' }),
  locale: text('locale').notNull(),
  actorName: text('actor_name').notNull(),
  sourceUrl: text('source_url'),
  sourceStatus: sourceStatusEnum('source_status').notNull().default('unknown'),
  createdAt,
  updatedAt,
})
