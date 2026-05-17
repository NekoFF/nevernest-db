import { env } from '../config/env.js'

export function isLocalAuthEnabled(): boolean {
  return process.env.ENABLE_LOCAL_AUTH === '1'
}

export function shouldUseSecureSessionCookie(): boolean {
  if (process.env.LOCAL_AUTH_SECURE_COOKIE === '1') return true
  if (process.env.LOCAL_AUTH_SECURE_COOKIE === '0') return false
  return env.nodeEnv === 'production'
}
