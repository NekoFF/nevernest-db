import { getCurrentAuthState, localLogin as localLoginRequest, logout as logoutRequest } from '../../auth/apiAuthClient.js'

export async function getMe(options = {}) {
  return getCurrentAuthState(options)
}

export async function localLogin(email, password, options = {}) {
  return localLoginRequest(email, password, options)
}

export async function logout(options = {}) {
  return logoutRequest(options)
}
