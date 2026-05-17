import { apiFetch, getApiData } from '../../api/client.js'
import { expectObject } from './normalizeApiData.js'

/**
 * Admin API client methods for content mutations.
 * These require a valid session, CSRF token, and specific permissions.
 */

export async function updateCodeAdmin(idOrSlug, payload, csrfToken, options = {}) {
  const response = await apiFetch(`/api/admin/codes/${encodeURIComponent(idOrSlug)}`, {
    method: 'PATCH',
    credentials: 'include',
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrfToken,
      ...(options.headers || {}),
    },
    body: JSON.stringify(payload),
  })
  return expectObject(response.data, 'admin code update')
}

export async function updateNewsAdmin(slug, payload, csrfToken, options = {}) {
  const response = await apiFetch(`/api/admin/news/${encodeURIComponent(slug)}`, {
    method: 'PATCH',
    credentials: 'include',
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrfToken,
      ...(options.headers || {}),
    },
    body: JSON.stringify(payload),
  })
  return expectObject(response.data, 'admin news update')
}
