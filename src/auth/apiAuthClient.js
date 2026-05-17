import { apiFetch, getApiData } from '../api/client.js'
import { normalizeAuthState } from './authState.js'

export async function getCurrentAuthState(options = {}) {
  const data = await getApiData('/api/me', { credentials: 'include', ...options })
  return normalizeAuthState(data)
}

export async function localLogin(email, password, options = {}) {
  const response = await apiFetch('/api/auth/local-login', {
    method: 'POST',
    credentials: 'include',
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    body: JSON.stringify({ email, password }),
  })
  return normalizeAuthState(response.data)
}

export async function logout(csrfToken, options = {}) {
  const response = await apiFetch('/api/auth/logout', {
    method: 'POST',
    credentials: 'include',
    ...options,
    headers: {
      ...(csrfToken ? { 'X-CSRF-Token': csrfToken } : {}),
      ...(options.headers || {}),
    },
  })
  return response.data
}

export async function getCsrfToken(options = {}) {
  const response = await apiFetch('/api/auth/csrf', {
    method: 'GET',
    credentials: 'include',
    ...options,
  })
  return response.data?.token
}
