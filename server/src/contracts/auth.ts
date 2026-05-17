export type AuthRole = 'anonymous' | 'user' | 'editor' | 'admin'

export type AuthPermission =
  | 'content/read'
  | 'content/write'
  | 'content/publish'
  | 'characters/write'
  | 'weapons/write'
  | 'modules/write'
  | 'vehicles/write'
  | 'codes/write'
  | 'news/write'
  | 'users/manage'
  | 'admin/audit/read'

export type AuthUserSummary = {
  id: string
  externalId?: string | null
  email?: string | null
  displayName?: string | null
  avatarUrl?: string | null
}

export type SessionMetadata = {
  authenticated: boolean
  expiresAt?: string | null
  issuedAt?: string | null
  provider?: string | null
}

export type CurrentUserResponse = {
  authenticated: boolean
  user: AuthUserSummary | null
  roles: AuthRole[]
  permissions: AuthPermission[]
  session: SessionMetadata
}

export type LoginRequest = {
  email: string
  password: string
  provider?: string
}

export type LogoutResponse = {
  authenticated: false
  revoked: boolean
}

export type LoginResult = {
  token: string
  expiresAt: Date
  currentUser: CurrentUserResponse
}
