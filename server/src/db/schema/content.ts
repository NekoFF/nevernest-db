import { boolean, jsonb, numeric, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { createdAt, id, publicationStatusEnum, sourceStatusEnum, updatedAt } from './common.js'
import { mediaAssets } from './media.js'
import { users } from './usersAuth.js'

export const guides = pgTable('guides', {
  id,
  externalId: text('external_id').notNull().unique(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  category: text('category'),
  summary: text('summary'),
  authorUserId: uuid('author_user_id').references(() => users.id, { onDelete: 'set null' }),
  sourceStatus: sourceStatusEnum('source_status').notNull().default('placeholder'),
  publicationStatus: publicationStatusEnum('publication_status').notNull().default('draft'),
  createdAt,
  updatedAt,
})

export const guideSections = pgTable('guide_sections', {
  id,
  guideId: uuid('guide_id').notNull().references(() => guides.id, { onDelete: 'cascade' }),
  heading: text('heading'),
  body: text('body'),
  sortOrder: numeric('sort_order').notNull().default('0'),
  metadata: jsonb('metadata').notNull().default({}),
  createdAt,
  updatedAt,
})

export const codes = pgTable('codes', {
  id,
  externalId: text('external_id').notNull().unique(),
  code: text('code').notNull().unique(),
  rewardSummary: text('reward_summary'),
  status: text('status').notNull().default('unknown'),
  startDate: timestamp('start_date', { withTimezone: true }),
  endDate: timestamp('end_date', { withTimezone: true }),
  sourceUrl: text('source_url'),
  sourceStatus: sourceStatusEnum('source_status').notNull().default('unknown'),
  createdAt,
  updatedAt,
})

export const newsPosts = pgTable('news_posts', {
  id,
  externalId: text('external_id').notNull().unique(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  description: text('description'),
  body: text('body'),
  category: text('category'),
  postedAt: timestamp('posted_at', { withTimezone: true }),
  sourceUrl: text('source_url'),
  imageMediaAssetId: uuid('image_media_asset_id').references(() => mediaAssets.id, { onDelete: 'set null' }),
  featured: boolean('featured').notNull().default(false),
  pinned: boolean('pinned').notNull().default(false),
  sourceStatus: sourceStatusEnum('source_status').notNull().default('placeholder'),
  publicationStatus: publicationStatusEnum('publication_status').notNull().default('draft'),
  createdAt,
  updatedAt,
})

export const communityLinks = pgTable('community_links', {
  id,
  externalId: text('external_id').notNull().unique(),
  label: text('label').notNull(),
  url: text('url').notNull(),
  category: text('category'),
  description: text('description'),
  sourceStatus: sourceStatusEnum('source_status').notNull().default('placeholder'),
  publicationStatus: publicationStatusEnum('publication_status').notNull().default('draft'),
  createdAt,
  updatedAt,
})

export const apartmentItems = pgTable('apartment_items', {
  id,
  externalId: text('external_id').notNull().unique(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  category: text('category'),
  description: text('description'),
  price: numeric('price'),
  currency: text('currency'),
  mediaAssetId: uuid('media_asset_id').references(() => mediaAssets.id, { onDelete: 'set null' }),
  sourceStatus: sourceStatusEnum('source_status').notNull().default('placeholder'),
  publicationStatus: publicationStatusEnum('publication_status').notNull().default('draft'),
  raw: jsonb('raw').notNull().default({}),
  createdAt,
  updatedAt,
})
