import type { FastifyInstance } from 'fastify'
import type { ServiceContainer } from '../services/container.js'
import { notImplemented, ok } from '../utils/apiResponse.js'
import { hasReadSource, listMeta, parseListQuery, sendDomainError } from './routeHelpers.js'

export async function tierListRoutes(app: FastifyInstance, services?: ServiceContainer) {
  app.get('/api/tier-lists/official', async (request, reply) => {
    try {
      const query = parseListQuery(request.query)
      if (!hasReadSource(services)) return reply.code(501).send(notImplemented('Database-backed official tier list planned for a later phase.'))
      const rows = await services.tierLists.list(query)
      return ok(rows, listMeta(services.source, services.mode, rows, query))
    } catch (error) {
      return sendDomainError(reply, error)
    }
  })
}
