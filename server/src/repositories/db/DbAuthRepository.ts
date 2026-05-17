import { and, eq, gt } from 'drizzle-orm'
import type { AuthPermission, AuthRole, CurrentUserResponse, LoginResult, LogoutResponse } from '../../contracts/auth.js'
import type { DbClient } from '../../db/client.js'
import { authAccounts, authRoles, sessions, userRoles, users } from '../../db/schema/index.js'
import { verifyPassword } from '../../auth/password.js'
import { createOpaqueSessionToken, hashSessionToken, readSessionCookie, sessionExpiresAt } from '../../auth/session.js'
import { anonymousCurrentUser } from '../../services/AuthService.js'
import type { AuthRepository } from '../AuthRepository.js'

type RequestLike = {
  headers?: {
    cookie?: unknown
  }
}

function roleFromName(name: string): AuthRole {
  if (name === 'admin' || name === 'editor' || name === 'user') return name
  return 'user'
}

function permissionsFromJson(value: unknown): AuthPermission[] {
  if (Array.isArray(value)) return value.filter((item): item is AuthPermission => typeof item === 'string')
  if (value && typeof value === 'object' && Array.isArray((value as { permissions?: unknown }).permissions)) {
    return (value as { permissions: unknown[] }).permissions.filter((item): item is AuthPermission => typeof item === 'string')
  }
  return []
}

export class DbAuthRepository implements AuthRepository {
  constructor(private readonly db: DbClient) {}

  async getCurrentUserFromRequest(request: unknown): Promise<CurrentUserResponse> {
    const token = readSessionCookie((request as RequestLike | undefined)?.headers ?? {})
    if (!token) return anonymousCurrentUser

    const rows = await this.db
      .select({
        userId: users.id,
        externalId: users.externalId,
        email: users.email,
        displayName: users.displayName,
        expiresAt: sessions.expiresAt,
        createdAt: sessions.createdAt,
      })
      .from(sessions)
      .innerJoin(users, eq(users.id, sessions.userId))
      .where(and(eq(sessions.sessionTokenHash, hashSessionToken(token)), gt(sessions.expiresAt, new Date())))
      .limit(1)

    const session = rows[0]
    if (!session) return anonymousCurrentUser

    return this.currentUserForSessionUser(session)
  }

  async loginWithPassword(email: string, password: string): Promise<LoginResult | null> {
    const normalizedEmail = email.trim().toLowerCase()
    const rows = await this.db
      .select({
        userId: users.id,
        externalId: users.externalId,
        userEmail: users.email,
        displayName: users.displayName,
        passwordHash: authAccounts.passwordHash,
      })
      .from(authAccounts)
      .innerJoin(users, eq(users.id, authAccounts.userId))
      .where(and(eq(authAccounts.provider, 'password'), eq(authAccounts.email, normalizedEmail)))
      .limit(1)

    const account = rows[0]
    if (!account?.passwordHash) return null

    const validPassword = await verifyPassword(password, account.passwordHash)
    if (!validPassword) return null

    const token = createOpaqueSessionToken()
    const expiresAt = sessionExpiresAt()
    await this.db.insert(sessions).values({
      userId: account.userId,
      sessionTokenHash: hashSessionToken(token),
      expiresAt,
    })

    const currentUser = await this.currentUserForSessionUser({
      userId: account.userId,
      externalId: account.externalId,
      email: account.userEmail,
      displayName: account.displayName,
      expiresAt,
      createdAt: new Date(),
    })

    return { token, expiresAt, currentUser }
  }

  async logoutFromRequest(request: unknown): Promise<LogoutResponse> {
    const token = readSessionCookie((request as RequestLike | undefined)?.headers ?? {})
    if (!token) return { authenticated: false, revoked: false }

    await this.db.delete(sessions).where(eq(sessions.sessionTokenHash, hashSessionToken(token)))
    return { authenticated: false, revoked: true }
  }

  private async currentUserForSessionUser(session: {
    userId: string
    externalId: string | null
    email: string | null
    displayName: string | null
    expiresAt: Date
    createdAt: Date
  }): Promise<CurrentUserResponse> {
    const roleRows = await this.db
      .select({
        name: authRoles.name,
        permissions: authRoles.permissions,
      })
      .from(userRoles)
      .innerJoin(authRoles, eq(authRoles.id, userRoles.authRoleId))
      .where(eq(userRoles.userId, session.userId))

    const roles = roleRows.map((role) => roleFromName(role.name))
    const permissions = [...new Set(roleRows.flatMap((role) => permissionsFromJson(role.permissions)))]

    return {
      authenticated: true,
      user: {
        id: session.userId,
        externalId: session.externalId,
        email: session.email,
        displayName: session.displayName,
        avatarUrl: null,
      },
      roles,
      permissions,
      session: {
        authenticated: true,
        expiresAt: session.expiresAt.toISOString(),
        issuedAt: session.createdAt.toISOString(),
        provider: 'password',
      },
    }
  }
}
