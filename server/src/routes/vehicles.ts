import type { FastifyInstance } from 'fastify'
import type { ServiceContainer } from '../services/container.js'
import { notImplemented, ok } from '../utils/apiResponse.js'
import { hasReadSource, listMeta, parseIdOrSlugParam, parseListQuery, sendDomainError } from './routeHelpers.js'

export async function vehicleRoutes(app: FastifyInstance, services?: ServiceContainer) {
  app.get('/api/vehicles', async (request, reply) => {
    try {
      const query = parseListQuery(request.query)
      if (!hasReadSource(services)) return reply.code(501).send(notImplemented('Database-backed vehicle list planned for a later phase.'))
      const rows = await services.vehicles.list(query)
      return ok(rows, listMeta(services.source, services.mode, rows, query))
    } catch (error) {
      return sendDomainError(reply, error)
    }
  })

  app.get('/api/vehicles/:idOrSlug', async (request, reply) => {
    try {
      const idOrSlug = parseIdOrSlugParam(request.params)
      if (!hasReadSource(services)) return reply.code(501).send(notImplemented('Database-backed vehicle detail planned for a later phase.'))
      return ok(await services.vehicles.getByIdOrSlug(idOrSlug), { source: services.source, mode: services.mode })
    } catch (error) {
      return sendDomainError(reply, error)
    }
  })
}
