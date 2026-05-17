import type { CurrentUserResponse, LoginResult, LogoutResponse } from '../contracts/auth.js'
import type { AuthRepository } from '../repositories/AuthRepository.js'

export const anonymousCurrentUser: CurrentUserResponse = {
  authenticated: false,
  user: null,
  roles: [],
  permissions: [],
  session: {
    authenticated: false,
    expiresAt: null,
    issuedAt: null,
    provider: null,
  },
}

export class AuthService {
  constructor(private readonly repository?: AuthRepository) {}

  async getCurrentUser(request?: unknown): Promise<CurrentUserResponse> {
    if (this.repository) return this.repository.getCurrentUserFromRequest(request)
    return anonymousCurrentUser
  }

  async loginWithPassword(email: string, password: string): Promise<LoginResult | null> {
    if (!this.repository) return null
    return this.repository.loginWithPassword(email, password)
  }

  async logout(request?: unknown): Promise<LogoutResponse> {
    if (this.repository) return this.repository.logoutFromRequest(request)
    return {
      authenticated: false,
      revoked: false,
    }
  }
}
