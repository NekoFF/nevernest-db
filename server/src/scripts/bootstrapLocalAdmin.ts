import { eq } from 'drizzle-orm'
import { hashPassword, PASSWORD_HASH_ALGORITHM, PASSWORD_HASH_COST, validateLocalAdminPassword } from '../auth/password.js'
import { ADMIN_PERMISSIONS } from '../auth/permissions.js'
import { createDbClient, closeDbClient } from '../db/client.js'
import { assertLocalDatabaseUrl } from '../db/safety.js'
import { authAccounts, authRoles, userRoles, users } from '../db/schema/index.js'

function requiredEnv(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`${name} is required.`)
  return value
}

async function main() {
  if (process.env.CONFIRM_LOCAL_ADMIN_BOOTSTRAP !== '1') {
    throw new Error('Refusing to bootstrap local admin without CONFIRM_LOCAL_ADMIN_BOOTSTRAP=1.')
  }

  const databaseUrl = requiredEnv('DATABASE_URL')
  assertLocalDatabaseUrl(databaseUrl)

  const email = requiredEnv('LOCAL_ADMIN_EMAIL').trim().toLowerCase()
  if (!email.includes('@')) throw new Error('LOCAL_ADMIN_EMAIL must be an email address.')

  const password = requiredEnv('LOCAL_ADMIN_PASSWORD')
  const passwordIssues = validateLocalAdminPassword(password)
  if (passwordIssues.length) {
    throw new Error(`LOCAL_ADMIN_PASSWORD is too weak: ${passwordIssues.join(' ')}`)
  }

  const db = createDbClient(databaseUrl)
  const passwordHash = await hashPassword(password)

  const [user] = await db
    .insert(users)
    .values({
      externalId: 'local-admin',
      email,
      displayName: 'Local Admin',
      status: 'published',
    })
    .onConflictDoUpdate({
      target: users.email,
      set: {
        externalId: 'local-admin',
        displayName: 'Local Admin',
        status: 'published',
        updatedAt: new Date(),
      },
    })
    .returning()

  const [role] = await db
    .insert(authRoles)
    .values({
      externalId: 'admin',
      name: 'admin',
      permissions: { permissions: ADMIN_PERMISSIONS },
    })
    .onConflictDoUpdate({
      target: authRoles.externalId,
      set: {
        name: 'admin',
        permissions: { permissions: ADMIN_PERMISSIONS },
        updatedAt: new Date(),
      },
    })
    .returning()

  await db
    .insert(authAccounts)
    .values({
      userId: user.id,
      provider: 'password',
      providerAccountId: email,
      email,
      passwordHash,
      metadata: {
        algorithm: PASSWORD_HASH_ALGORITHM,
        cost: PASSWORD_HASH_COST,
        localOnly: true,
      },
    })
    .onConflictDoUpdate({
      target: [authAccounts.provider, authAccounts.providerAccountId],
      set: {
        userId: user.id,
        email,
        passwordHash,
        metadata: {
          algorithm: PASSWORD_HASH_ALGORITHM,
          cost: PASSWORD_HASH_COST,
          localOnly: true,
        },
        updatedAt: new Date(),
      },
    })

  await db
    .insert(userRoles)
    .values({
      userId: user.id,
      authRoleId: role.id,
    })
    .onConflictDoNothing()

  const assignedRoles = await db
    .select({ name: authRoles.name })
    .from(userRoles)
    .innerJoin(authRoles, eq(authRoles.id, userRoles.authRoleId))
    .where(eq(userRoles.userId, user.id))

  console.log('Local admin bootstrap complete.')
  console.log(`email: ${email}`)
  console.log(`userId: ${user.id}`)
  console.log(`roles: ${assignedRoles.map((item) => item.name).join(', ') || 'none'}`)
  console.log(`passwordHash: ${PASSWORD_HASH_ALGORITHM} cost ${PASSWORD_HASH_COST}`)
  console.log('password: not printed')
}

try {
  await main()
} finally {
  await closeDbClient()
}
