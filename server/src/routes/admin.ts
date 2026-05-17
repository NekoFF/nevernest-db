import type { FastifyInstance } from 'fastify'
import { adminWritesDisabledResponse, requirePermission, validateCsrf } from '../plugins/adminGuard.js'
import { runAdminMutation } from '../plugins/adminMutationPipeline.js'
import { codeUpdateSchema, newsUpdateSchema } from '../schemas/adminWrites.js'
import type { AuthService } from '../services/AuthService.js'
import type { ServiceContainer } from '../services/container.js'

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
    const { idOrSlug } = request.params as { idOrSlug: string }
    
    return runAdminMutation(request, reply, authService, services, {
      permission: 'codes/write',
      schema: codeUpdateSchema,
      entityType: 'code',
      action: 'update',
      handler: ({ body, services }) => services.content.updateCode(idOrSlug, body)
    })
  })

  // Second functional admin write: News update
  app.patch('/api/admin/news/:slug', async (request, reply) => {
    const { slug } = request.params as { slug: string }
    
    return runAdminMutation(request, reply, authService, services, {
      permission: 'news/write',
      schema: newsUpdateSchema,
      entityType: 'news',
      action: 'update',
      handler: ({ body, services }) => services.content.updateNews(slug, body)
    })
  })
}
