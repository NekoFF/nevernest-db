import assert from 'node:assert/strict'
import test from 'node:test'
import { logout } from '../../../src/auth/apiAuthClient.js'
import { normalizeAuthState } from '../../../src/auth/authState.js'

test('logout client sends CSRF header when provided', async () => {
  const originalFetch = globalThis.fetch
  let request: { url: string, options: RequestInit } | null = null

  globalThis.fetch = (async (url: string | URL | Request, options?: RequestInit) => {
    request = { url: String(url), options: options || {} }
    return new Response(JSON.stringify({ ok: true, data: { authenticated: false, revoked: true } }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    })
  }) as typeof fetch

  try {
    await logout('csrf-test-token', { baseUrl: 'http://127.0.0.1:4000' })
  } finally {
    globalThis.fetch = originalFetch
  }

  assert.ok(request)
  assert.equal(request.url, 'http://127.0.0.1:4000/api/auth/logout')
  assert.equal(request.options.method, 'POST')
  assert.equal(request.options.credentials, 'include')
  assert.equal((request.options.headers as Record<string, string>)['X-CSRF-Token'], 'csrf-test-token')
})

test('auth state normalizer reads backend envelope data', () => {
  const state = normalizeAuthState({
    ok: true,
    data: {
      authenticated: true,
      user: { displayName: 'Local Admin' },
      roles: ['admin'],
      permissions: ['codes/write', 'news/write'],
    },
  })

  assert.equal(state.authenticated, true)
  assert.equal(state.user.displayName, 'Local Admin')
  assert.deepEqual(state.roles, ['admin'])
  assert.deepEqual(state.permissions, ['codes/write', 'news/write'])
})
