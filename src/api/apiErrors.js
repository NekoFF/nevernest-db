export class ApiError extends Error {
  constructor(message, options = {}) {
    super(message)
    this.name = 'ApiError'
    this.statusCode = options.statusCode ?? 0
    this.status = options.status ?? 'api_error'
    this.details = options.details ?? null
    this.url = options.url ?? null
  }
}

export class ApiTimeoutError extends ApiError {
  constructor(message = 'API request timed out.', options = {}) {
    super(message, { ...options, status: 'timeout' })
    this.name = 'ApiTimeoutError'
  }
}

export function toApiError(error, fallback = {}) {
  if (error instanceof ApiError) return error
  if (error?.name === 'AbortError') {
    return new ApiTimeoutError('API request was aborted.', fallback)
  }
  return new ApiError(error instanceof Error ? error.message : 'API request failed.', fallback)
}
