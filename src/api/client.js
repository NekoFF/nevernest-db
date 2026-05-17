import { getApiBaseUrl } from './apiConfig.js'
import { ApiError, ApiTimeoutError, toApiError } from './apiErrors.js'
import { parseApiEnvelope } from './responseEnvelope.js'

const DEFAULT_TIMEOUT_MS = 10000

function buildUrl(path, baseUrl) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${baseUrl}${normalizedPath}`
}

function pathWithQuery(path, query) {
  if (!query || typeof query !== 'object') return path
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(query)) {
    if (value === null || value === undefined || value === '') continue
    params.set(key, String(value))
  }
  const queryString = params.toString()
  if (!queryString) return path
  return `${path}${path.includes('?') ? '&' : '?'}${queryString}`
}

export async function apiFetch(path, options = {}) {
  const {
    baseUrl = getApiBaseUrl(),
    timeoutMs = DEFAULT_TIMEOUT_MS,
    signal,
    query,
    ...fetchOptions
  } = options

  const url = buildUrl(pathWithQuery(path, query), baseUrl)
  const controller = new AbortController()
  const timeoutId = timeoutMs > 0
    ? globalThis.setTimeout(() => controller.abort(), timeoutMs)
    : null

  if (signal) {
    signal.addEventListener('abort', () => controller.abort(), { once: true })
  }

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        ...(fetchOptions.headers || {}),
      },
    })

    const contentType = response.headers.get('content-type') || ''
    const body = contentType.includes('application/json') ? await response.json() : null

    if (!response.ok && body?.ok !== false) {
      throw new ApiError(`API request failed with status ${response.status}.`, {
        statusCode: response.status,
        status: 'http_error',
        details: body,
        url,
      })
    }

    return parseApiEnvelope(body, { statusCode: response.status, url })
  } catch (error) {
    if (error?.name === 'AbortError') {
      throw new ApiTimeoutError('API request timed out.', { url })
    }
    throw toApiError(error, { url })
  } finally {
    if (timeoutId) globalThis.clearTimeout(timeoutId)
  }
}

export async function getApiData(path, options = {}) {
  const response = await apiFetch(path, { ...options, method: 'GET' })
  return response.data
}
