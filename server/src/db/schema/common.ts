import { pgEnum, timestamp, uuid } from 'drizzle-orm/pg-core'

export const sourceStatusEnum = pgEnum('source_status', ['verified', 'needs_verification', 'estimated', 'placeholder', 'mock', 'unknown'])
export const publicationStatusEnum = pgEnum('publication_status', ['draft', 'published', 'archived', 'hidden'])
export const tierListTypeEnum = pgEnum('tier_list_type', ['official', 'user', 'event', 'draft'])
export const visibilityStatusEnum = pgEnum('visibility_status', ['private', 'unlisted', 'public'])

export const id = uuid('id').primaryKey().defaultRandom()
export const createdAt = timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
export const updatedAt = timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
