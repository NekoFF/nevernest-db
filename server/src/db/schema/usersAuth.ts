import { inet, jsonb, pgTable, primaryKey, text, timestamp, unique, uuid } from 'drizzle-orm/pg-core'
import { createdAt, id, publicationStatusEnum, updatedAt } from './common.js'

export const users = pgTable('users', {
  id,
  externalId: text('external_id').unique(),
  email: text('email').unique(),
  displayName: text('display_name'),
  avatarMediaId: uuid('avatar_media_id'),
  status: publicationStatusEnum('status').notNull().default('draft'),
  createdAt,
  updatedAt,
})

export const authAccounts = pgTable('auth_accounts', {
  id,
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  provider: text('provider').notNull(),
  providerAccountId: text('provider_account_id').notNull(),
  email: text('email'),
  passwordHash: text('password_hash'),
  metadata: jsonb('metadata').notNull().default({}),
  createdAt,
  updatedAt,
}, (table) => [
  unique().on(table.provider, table.providerAccountId),
])

export const authRoles = pgTable('auth_roles', {
  id,
  externalId: text('external_id').notNull().unique(),
  name: text('name').notNull(),
  permissions: jsonb('permissions').notNull().default({}),
  createdAt,
  updatedAt,
})

export const userRoles = pgTable('user_roles', {
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  authRoleId: uuid('auth_role_id').notNull().references(() => authRoles.id, { onDelete: 'cascade' }),
  createdAt,
}, (table) => [
  primaryKey({ columns: [table.userId, table.authRoleId] }),
])

export const sessions = pgTable('sessions', {
  id,
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  sessionTokenHash: text('session_token_hash').notNull().unique(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  createdAt,
})

export const adminLogs = pgTable('admin_logs', {
  id,
  adminUserId: uuid('admin_user_id').references(() => users.id, { onDelete: 'set null' }),
  entityType: text('entity_type').notNull(),
  entityId: uuid('entity_id'),
  entityExternalId: text('entity_external_id'),
  action: text('action').notNull(),
  beforeJson: jsonb('before_json'),
  afterJson: jsonb('after_json'),
  ipAddress: inet('ip_address'),
  userAgent: text('user_agent'),
  createdAt,
})
