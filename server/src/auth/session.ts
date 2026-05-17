import crypto from 'node:crypto'

export const SESSION_COOKIE_NAME = 'nte_session'
export const SESSION_TTL_DAYS = 7

export function createOpaqueSessionToken(): string {
  return crypto.randomBytes(32).toString('base64url')
}

export function hashSessionToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex')
}

export function sessionExpiresAt(now = new Date()): Date {
  return new Date(now.getTime() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000)
}

export function parseCookieHeader(header: unknown): Record<string, string> {
  if (typeof header !== 'string') return {}
  return Object.fromEntries(
    header
      .split(';')
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const separatorIndex = part.indexOf('=')
        if (separatorIndex === -1) return [part, '']
        return [part.slice(0, separatorIndex), decodeURIComponent(part.slice(separatorIndex + 1))]
      })
  )
}

export function readSessionCookie(headers: { cookie?: unknown }): string | null {
  return parseCookieHeader(headers.cookie)[SESSION_COOKIE_NAME] || null
}

export function serializeSessionCookie(token: string, options: { expires: Date; secure: boolean }): string {
  const parts = [
    `${SESSION_COOKIE_NAME}=${encodeURIComponent(token)}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    `Expires=${options.expires.toUTCString()}`,
  ]
  if (options.secure) parts.push('Secure')
  return parts.join('; ')
}

export function serializeClearSessionCookie(options: { secure: boolean }): string {
  const parts = [
    `${SESSION_COOKIE_NAME}=`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    'Expires=Thu, 01 Jan 1970 00:00:00 GMT',
    'Max-Age=0',
  ]
  if (options.secure) parts.push('Secure')
  return parts.join('; ')
}
