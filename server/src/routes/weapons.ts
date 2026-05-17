import type { FastifyInstance } from 'fastify'
import type { ServiceContainer } from '../services/container.js'
import { notImplemented, ok } from '../utils/apiResponse.js'
import { hasReadSource, listMeta, parseIdOrSlugParam, parseListQuery, sendDomainError } from './routeHelpers.js'

export async function weaponRoutes(app: FastifyInstance, services?: ServiceContainer) {
  app.get('/api/weapons', async (request, reply) => {
    try {
      const query = parseListQuery(request.query)
      if (!hasReadSource(services)) return reply.code(501).send(notImplemented('Database-backed weapon list planned for a later phase.'))
      const rows = await services.weapons.list(query)
      return ok(rows, listMeta(services.source, services.mode, rows, query))
    } catch (error) {
      return sendDomainError(reply, error)
    }
  })

  app.get('/api/weapons/:idOrSlug', async (request, reply) => {
    try {
      const idOrSlug = parseIdOrSlugParam(request.params)
      if (!hasReadSource(services)) return reply.code(501).send(notImplemented('Database-backed weapon detail planned for a later phase.'))
      return ok(await services.weapons.getByIdOrSlug(idOrSlug), { source: services.source, mode: services.mode })
    } catch (error) {
      return sendDomainError(reply, error)
    }
  })
}
