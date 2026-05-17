import type { FastifyInstance } from 'fastify'
import { parse, ValiError } from 'valibot'
import { adminWritesDisabledResponse, requirePermission, validateCsrf } from '../plugins/adminGuard.js'
import { codeUpdateSchema } from '../schemas/adminWrites.js'
import { AuthService } from '../services/AuthService.js'
import { adminAuditService } from '../services/AdminAuditService.js'
import type { ServiceContainer } from '../services/container.js'
import { ok } from '../utils/apiResponse.js'
import { ValidationError, toApiError } from '../utils/errors.js'

/**
 * Admin routes for administrative mutations.
 * All routes here must be gated by ENABLE_LOCAL_ADMIN_WRITES=1 and require CSRF/Auth.
 */
export async function adminRoutes(app: FastifyInstance, authService: AuthService, services?: ServiceContainer) {
  // Skeleton for character create/patch
  app.post('/api/admin/characters', async (request, reply) => {
    const csrfValid = validateCsrf(request, reply)
    if (csrfValid !== true) return

    const authorized = await requirePermission(request, reply, authService, 'characters/write')
    if (authorized !== true) return

    return reply.code(501).send(adminWritesDisabledResponse({ requiredPermission: 'characters/write' }))
  })

  app.patch('/api/admin/characters/:id', async (request, reply) => {
    const csrfValid = validateCsrf(request, reply)
    if (csrfValid !== true) return

    const authorized = await requirePermission(request, reply, authService, 'characters/write')
    if (authorized !== true) return

    return reply.code(501).send(adminWritesDisabledResponse({ requiredPermission: 'characters/write' }))
  })

  // First functional admin write: Codes update
  app.patch('/api/admin/codes/:idOrSlug', async (request, reply) => {
    // 1. Safety flag check
    if (process.env.ENABLE_LOCAL_ADMIN_WRITES !== '1') {
      return reply.code(501).send(adminWritesDisabledResponse({ requiredPermission: 'codes/write' }))
    }

    // 2. CSRF validation
    const csrfValid = validateCsrf(request, reply)
    if (csrfValid !== true) return

    // 3. Permission check
    const authorized = await requirePermission(request, reply, authService, 'codes/write')
    if (authorized !== true) return

    // 4. Service availability check
    if (!services) {
      return reply.code(501).send(adminWritesDisabledResponse({ requiredPermission: 'codes/write' }))
    }

    try {
      const { idOrSlug } = request.params as { idOrSlug: string }
      
      // 5. Body validation
      const body = parse(codeUpdateSchema, request.body)
      if (Object.keys(body).length === 0) {
        throw new ValidationError('Empty update body.')
      }

      const currentUser = await authService.getCurrentUser(request)
      
      // 6. DB Update
      const updated = await services.content.updateCode(idOrSlug, body)

      // 7. Audit Logging (successful update only)
      await adminAuditService.logAction({
        action: 'update',
        entityType: 'code',
        entityId: updated.externalId,
        userId: currentUser.authenticated ? (currentUser as any).id || 'unknown-admin' : 'unknown-admin',
        timestamp: new Date().toISOString(),
        metadata: adminAuditService.formatMetadata({
          ip: request.ip,
          userAgent: request.headers['user-agent'],
        }),
        after: updated,
      })

      return ok(updated)
    } catch (error) {
      const domainError = error instanceof ValiError ? new ValidationError('Invalid code update.', error.issues) : error
      const response = toApiError(domainError)
      return reply.code(response.statusCode).send(response.body)
    }
  })
}
