import type { FastifyReply, FastifyRequest } from 'fastify'
import type { AuthPermission } from '../contracts/auth.js'
import type { AuthService } from '../services/AuthService.js'
import { forbidden, notImplemented, unauthorized } from '../utils/apiResponse.js'
import { parseCookieHeader } from '../auth/session.js'

export type AdminWriteContext = {
  requiredPermission?: AuthPermission
}

export function adminWritesDisabledResponse(context: AdminWriteContext = {}) {
  return {
    ...notImplemented('Admin write endpoints are disabled until real authentication, authorization, CSRF protection, and audit logging are implemented.'),
    requiredPermission: context.requiredPermission || 'content/write',
  }
}

export function validateCsrf(request: FastifyRequest, reply: FastifyReply) {
  const cookies = parseCookieHeader(request.headers.cookie)
  const cookieToken = cookies['nte_csrf']
  const headerToken = request.headers['x-csrf-token']

  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    return reply.code(403).send({
      ok: false,
      status: 'csrf_error',
      message: 'Invalid or missing CSRF token.',
    })
  }

  return true
}

export async function requirePermission(
  request: FastifyRequest,
  reply: FastifyReply,
  authService: AuthService,
  permission: AuthPermission
) {
  const currentUser = await authService.getCurrentUser(request)

  if (!currentUser.authenticated) {
    return reply.code(401).send(unauthorized('Authentication required.'))
  }

  if (!currentUser.permissions.includes(permission)) {
    return reply.code(403).send(forbidden(`Permission required: ${permission}`))
  }

  return true
}
