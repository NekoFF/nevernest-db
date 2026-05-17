import type { FastifyInstance } from 'fastify'
import type { ServiceContainer } from '../services/container.js'
import { notImplemented, ok } from '../utils/apiResponse.js'
import { hasReadSource, listMeta, parseIdOrSlugParam, parseListQuery, sendDomainError } from './routeHelpers.js'

export async function contentRoutes(app: FastifyInstance, services?: ServiceContainer) {
  app.get('/api/codes', async (request, reply) => {
    try {
      const query = parseListQuery(request.query)
      if (!hasReadSource(services)) return reply.code(501).send(notImplemented('Database-backed codes endpoint planned for a later phase.'))
      const rows = await services.content.listCodes(query)
      return ok(rows, listMeta(services.source, services.mode, rows, query))
    } catch (error) {
      return sendDomainError(reply, error)
    }
  })

  app.get('/api/news', async (request, reply) => {
    try {
      const query = parseListQuery(request.query)
      if (!hasReadSource(services)) return reply.code(501).send(notImplemented('Database-backed news list planned for a later phase.'))
      const rows = await services.content.listNews(query)
      return ok(rows, listMeta(services.source, services.mode, rows, query))
    } catch (error) {
      return sendDomainError(reply, error)
    }
  })

  app.get('/api/news/:idOrSlug', async (request, reply) => {
    try {
      const slug = parseIdOrSlugParam(request.params)
      if (!hasReadSource(services)) return reply.code(501).send(notImplemented('Database-backed news detail planned for a later phase.'))
      return ok(await services.content.getNewsBySlug(slug), { source: services.source, mode: services.mode })
    } catch (error) {
      return sendDomainError(reply, error)
    }
  })

  app.get('/api/guides', async (request, reply) => {
    try {
      const query = parseListQuery(request.query)
      if (!hasReadSource(services)) return reply.code(501).send(notImplemented('Database-backed guides endpoint planned for a later phase.'))
      const rows = await services.content.listGuides(query)
      return ok(rows, listMeta(services.source, services.mode, rows, query))
    } catch (error) {
      return sendDomainError(reply, error)
    }
  })

  app.get('/api/guides/:idOrSlug', async (request, reply) => {
    try {
      const slug = parseIdOrSlugParam(request.params)
      if (!hasReadSource(services)) return reply.code(501).send(notImplemented('Database-backed guide detail planned for a later phase.'))
      return ok(await services.content.getGuideBySlug(slug), { source: services.source, mode: services.mode })
    } catch (error) {
      return sendDomainError(reply, error)
    }
  })

  app.get('/api/community-links', async (request, reply) => {
    try {
      const query = parseListQuery(request.query)
      if (!hasReadSource(services)) return reply.code(501).send(notImplemented('Database-backed community links endpoint planned for a later phase.'))
      const rows = await services.content.listCommunityLinks(query)
      return ok(rows, listMeta(services.source, services.mode, rows, query))
    } catch (error) {
      return sendDomainError(reply, error)
    }
  })

  app.get('/api/apartments/items', async (request, reply) => {
    try {
      const query = parseListQuery(request.query)
      if (!hasReadSource(services)) return reply.code(501).send(notImplemented('Database-backed apartment items endpoint planned for a later phase.'))
      const rows = await services.content.listApartmentItems(query)
      return ok(rows, listMeta(services.source, services.mode, rows, query))
    } catch (error) {
      return sendDomainError(reply, error)
    }
  })
}
