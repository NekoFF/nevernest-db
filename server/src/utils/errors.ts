import type { ApiErrorResponse } from '../contracts/common.js'

export class NotImplementedError extends Error {
  statusCode = 501
  status = 'not_implemented'

  constructor(message = 'Database-backed endpoint planned for a later phase.') {
    super(message)
    this.name = 'NotImplementedError'
  }
}

export class NotFoundError extends Error {
  statusCode = 404
  status = 'not_found'

  constructor(message = 'Resource not found.') {
    super(message)
    this.name = 'NotFoundError'
  }
}

export class ValidationError extends Error {
  statusCode = 400
  status = 'validation_error'
  issues?: unknown[]

  constructor(message = 'Invalid request.', issues?: unknown[]) {
    super(message)
    this.name = 'ValidationError'
    this.issues = issues
  }
}

export function toApiError(error: unknown): { statusCode: number; body: ApiErrorResponse } {
  if (error instanceof NotImplementedError || error instanceof NotFoundError || error instanceof ValidationError) {
    return {
      statusCode: error.statusCode,
      body: {
        ok: false,
        status: error.status,
        message: error.message,
        issues: error instanceof ValidationError ? error.issues : undefined,
      },
    }
  }

  return {
    statusCode: 500,
    body: {
      ok: false,
      status: 'internal_error',
      message: 'Internal server error',
    },
  }
}
