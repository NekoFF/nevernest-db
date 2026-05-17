import type { FastifyReply, FastifyRequest } from 'fastify'
import { parse, ValiError, type BaseSchema } from 'valibot'
import type { AuthPermission } from '../contracts/auth.js'
import { adminAuditService } from '../services/AdminAuditService.js'
import type { AuthService } from '../services/AuthService.js'
import type { ServiceContainer } from '../services/container.js'
import { ok } from '../utils/apiResponse.js'
import { ValidationError, toApiError } from '../utils/errors.js'
import { adminWritesDisabledResponse, requirePermission, validateCsrf } from './adminGuard.js'

export type AdminMutationOptions<TSchema extends BaseSchema<any, any, any>, TResult> = {
  permission: AuthPermission
  schema: TSchema
  entityType: string
  action: string
  handler: (params: { 
    body: any, 
    request: FastifyRequest, 
    services: ServiceContainer,
    currentUser: any
  }) => Promise<TResult>
}

/**
 * Shared administrative mutation pipeline.
 * Coordinates safety checks, validation, execution, and audit logging.
 */
export async function runAdminMutation<TSchema extends BaseSchema<any, any, any>, TResult>(
  request: FastifyRequest,
  reply: FastifyReply,
  authService: AuthService,
  services: ServiceContainer | undefined,
  options: AdminMutationOptions<TSchema, TResult>
) {
  const { permission, schema, entityType, action, handler } = options

  // 1. Safety flag check
  if (process.env.ENABLE_LOCAL_ADMIN_WRITES !== '1') {
    return reply.code(501).send(adminWritesDisabledResponse({ requiredPermission: permission }))
  }

  // 2. CSRF validation
  const csrfValid = validateCsrf(request, reply)
  if (csrfValid !== true) return

  // 3. Session and Permission check
  const authorized = await requirePermission(request, reply, authService, permission)
  if (authorized !== true) return

  // 4. Service availability check
  if (!services) {
    return reply.code(501).send(adminWritesDisabledResponse({ requiredPermission: permission }))
  }

  try {
    // 5. Body validation
    const body = parse(schema, request.body)
    if (Object.keys(body as object).length === 0) {
      throw new ValidationError('Empty update body.')
    }

    const currentUser = await authService.getCurrentUser(request)

    // 6. Execute mutation
    const result = await handler({ body, request, services, currentUser })

    // 7. Audit Logging (successful mutation only)
    const entityId = (result as any).slug || (result as any).externalId || (result as any).id || 'unknown'
    
    await adminAuditService.logAction({
      action,
      entityType,
      entityId,
      userId: currentUser.authenticated ? (currentUser as any).id || 'unknown-admin' : 'unknown-admin',
      timestamp: new Date().toISOString(),
      metadata: adminAuditService.formatMetadata({
        ip: request.ip,
        userAgent: request.headers['user-agent'],
      }),
      after: result,
    })

    return ok(result)
  } catch (error) {
    const domainError = error instanceof ValiError ? new ValidationError(`Invalid ${entityType} ${action}.`, error.issues) : error
    const response = toApiError(domainError)
    return reply.code(response.statusCode).send(response.body)
  }
}
