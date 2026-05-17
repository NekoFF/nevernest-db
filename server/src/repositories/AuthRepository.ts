import type { CurrentUserResponse, LoginResult, LogoutResponse } from '../contracts/auth.js'

export interface AuthRepository {
  getCurrentUserFromRequest(request: unknown): Promise<CurrentUserResponse>
  loginWithPassword(email: string, password: string): Promise<LoginResult | null>
  logoutFromRequest(request: unknown): Promise<LogoutResponse>
}
