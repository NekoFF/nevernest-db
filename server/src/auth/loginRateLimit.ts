const WINDOW_MS = 60_000
const MAX_ATTEMPTS = 5

const attempts = new Map<string, { count: number; resetAt: number }>()

/**
 * Basic in-memory rate limiter for login attempts.
 * In production, this should be replaced with a Redis-backed or similar provider.
 */
export function isLoginRateLimited(key: string, now = Date.now()): boolean {
  const current = attempts.get(key)
  if (!current || current.resetAt <= now) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS })
    return false
  }

  current.count += 1
  return current.count > MAX_ATTEMPTS
}

const csrfAttempts = new Map<string, { count: number; resetAt: number }>()
const CSRF_WINDOW_MS = 60_000
const CSRF_MAX_ATTEMPTS = 10

/**
 * Moderate rate limiting for the CSRF token endpoint.
 */
export function isCsrfRateLimited(ip: string, now = Date.now()): boolean {
  const current = csrfAttempts.get(ip)
  if (!current || current.resetAt <= now) {
    csrfAttempts.set(ip, { count: 1, resetAt: now + CSRF_WINDOW_MS })
    return false
  }

  current.count += 1
  return current.count > CSRF_MAX_ATTEMPTS
}

/**
 * Reset all in-memory rate limits.
 */
export function resetRateLimits() {
  attempts.clear()
  csrfAttempts.clear()
}
