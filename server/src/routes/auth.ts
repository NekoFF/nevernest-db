import type { FastifyInstance } from 'fastify'
import { ValiError, parse } from 'valibot'
import { isLocalAuthEnabled, shouldUseSecureSessionCookie } from '../auth/localAuthConfig.js'
import { isCsrfRateLimited, isLoginRateLimited } from '../auth/loginRateLimit.js'
import { serializeClearSessionCookie, serializeSessionCookie } from '../auth/session.js'
import { randomBytes } from 'node:crypto'
import { loginRequestSchema } from '../schemas/auth.js'
import { AuthService } from '../services/AuthService.js'
import { ok } from '../utils/apiResponse.js'
import { ValidationError, toApiError } from '../utils/errors.js'
import { validateCsrf } from '../plugins/adminGuard.js'

export async function authRoutes(app: FastifyInstance, authService = new AuthService()) {
  app.get('/api/me', async (request) => {
    const currentUser = await authService.getCurrentUser(request)
    return ok(currentUser, {
      source: currentUser.authenticated ? 'local-auth' : 'auth-disabled',
      mode: currentUser.authenticated ? 'local' : 'disabled',
    })
  })

  app.post('/api/auth/local-login', async (request, reply) => {
    if (!isLocalAuthEnabled()) {
      return reply.code(501).send({
        ok: false,
        status: 'not_implemented',
        message: 'Local auth is disabled.',
      })
    }

    try {
      const body = parse(loginRequestSchema, request.body)
      const key = `${request.ip}:${body.email.toLowerCase()}`
      if (isLoginRateLimited(key)) {
        return reply.code(401).send({
          ok: false,
          status: 'invalid_credentials',
          message: 'Invalid email or password.',
        })
      }

      const login = await authService.loginWithPassword(body.email, body.password)
      if (!login) {
        return reply.code(401).send({
          ok: false,
          status: 'invalid_credentials',
          message: 'Invalid email or password.',
        })
      }

      reply.header('Set-Cookie', serializeSessionCookie(login.token, {
        expires: login.expiresAt,
        secure: shouldUseSecureSessionCookie(),
      }))

      return ok(login.currentUser, {
        source: 'local-auth',
        mode: 'local',
      })
    } catch (error) {
      const domainError = error instanceof ValiError ? new ValidationError('Invalid login request.', error.issues) : error
      const response = toApiError(domainError)
      return reply.code(response.statusCode).send(response.body)
    }
  })

  app.post('/api/auth/logout', async (request, reply) => {
    if (!isLocalAuthEnabled()) {
      return reply.code(501).send({
        ok: false,
        status: 'not_implemented',
        message: 'Local auth is disabled.',
      })
    }

    const csrfValid = validateCsrf(request, reply)
    if (csrfValid !== true) return

    const result = await authService.logout(request)
    reply.header('Set-Cookie', serializeClearSessionCookie({ secure: shouldUseSecureSessionCookie() }))
    return ok(result, {
      source: 'local-auth',
      mode: 'local',
    })
  })

  app.get('/api/auth/csrf', async (request, reply) => {
    if (!isLocalAuthEnabled()) {
      return reply.code(501).send({
        ok: false,
        status: 'not_implemented',
        message: 'Local auth is disabled.',
      })
    }

    if (isCsrfRateLimited(request.ip)) {
      return reply.code(429).send({
        ok: false,
        status: 'rate_limited',
        message: 'Too many CSRF requests. Please try again later.',
      })
    }

    const token = randomBytes(32).toString('hex')
    
    // Set a non-HttpOnly cookie so the frontend can read it if needed for the header,
    // though the preferred way is to use the response body.
    // The validation will compare this cookie with the X-CSRF-Token header.
    reply.header('Set-Cookie', `nte_csrf=${token}; Path=/; SameSite=Lax${shouldUseSecureSessionCookie() ? '; Secure' : ''}`)

    return ok({
      token,
    }, {
      source: 'csrf-local',
      mode: 'local', 
    })
  })
}
