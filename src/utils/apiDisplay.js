export function apiCountValue(apiMode, loading, error, value) {
  if (apiMode && error) return 'API error'
  if (apiMode && loading) return '...'
  return value
}

export function apiFailureDescription(error, fallback) {
  if (!error) return fallback
  if (!error.statusCode) {
    return 'Could not reach the local API. Confirm the backend is running, VITE_API_BASE_URL matches the backend host, and localhost/127.0.0.1 are not mixed across frontend and backend origins.'
  }
  return error.message || fallback
}
