import { ApiError } from './apiErrors.js'

export function isSuccessEnvelope(value) {
  return Boolean(value && value.ok === true && 'data' in value)
}

export function isErrorEnvelope(value) {
  return Boolean(value && value.ok === false)
}

export function parseApiEnvelope(envelope, context = {}) {
  if (isSuccessEnvelope(envelope)) {
    return {
      data: envelope.data,
      meta: envelope.meta || {},
      envelope,
    }
  }

  if (isErrorEnvelope(envelope)) {
    throw new ApiError(envelope.message || envelope.error || 'API request failed.', {
      statusCode: context.statusCode ?? envelope.statusCode,
      status: envelope.status || 'api_error',
      details: envelope,
      url: context.url,
    })
  }

  throw new ApiError('API response did not match the expected envelope.', {
    statusCode: context.statusCode,
    status: 'invalid_envelope',
    details: envelope,
    url: context.url,
  })
}
