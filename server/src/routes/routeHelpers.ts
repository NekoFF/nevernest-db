import type { FastifyInstance } from 'fastify'
import { ValiError, parse } from 'valibot'
import type { ListQuery } from '../contracts/common.js'
import { listQuerySchema, routeIdOrSlugParamsSchema } from '../schemas/index.js'
import { notImplemented } from '../utils/apiResponse.js'
import { ValidationError, toApiError } from '../utils/errors.js'
import type { ServiceContainer } from '../services/container.js'

export function parseListQuery(input: unknown): ListQuery {
  return parse(listQuerySchema, input)
}

export function parseIdOrSlugParam(input: unknown): string {
  return parse(routeIdOrSlugParamsSchema, input).idOrSlug
}

export function listMeta(source: string, mode: string, rows: unknown[], query: ListQuery) {
  const limit = query.limit ?? 24
  return {
    source,
    mode,
    count: rows.length,
    page: query.page ?? 1,
    limit,
    total: rows.length,
    hasMore: rows.length >= limit,
    query,
  }
}

export function sendDomainError(reply: { code: (statusCode: number) => { send: (body: unknown) => unknown } }, error: unknown) {
  const domainError = error instanceof ValiError ? new ValidationError('Invalid route parameters or query.', error.issues) : error
  const response = toApiError(domainError)
  return reply.code(response.statusCode).send(response.body)
}

export function hasReadSource(services?: ServiceContainer): services is ServiceContainer {
  return services?.source === 'mock' || services?.source === 'db'
}

export async function registerNotImplementedRoutes(app: FastifyInstance, routes: Array<{ method: 'GET'; url: string; message: string }>) {
  for (const route of routes) {
    app.route({
      method: route.method,
      url: route.url,
      handler: async (request, reply) => {
        try {
          parse(listQuerySchema, request.query)
          if (route.url.includes(':idOrSlug')) {
            parse(routeIdOrSlugParamsSchema, request.params)
          }
          return reply.code(501).send(notImplemented(route.message))
        } catch (error) {
          return sendDomainError(reply, error)
        }
      },
    })
  }
}
