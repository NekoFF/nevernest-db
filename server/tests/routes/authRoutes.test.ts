import assert from 'node:assert/strict'
import test from 'node:test'
import { buildApp } from '../../src/app.js'
import type { CurrentUserResponse, LoginResult, LogoutResponse } from '../../src/contracts/auth.js'
import { AuthService, anonymousCurrentUser } from '../../src/services/AuthService.js'
import { adminAuditService } from '../../src/services/AdminAuditService.js'

const authenticatedUser: CurrentUserResponse = {
  authenticated: true,
  user: {
    id: 'local-admin-user',
    externalId: 'local-admin',
    email: 'admin@example.test',
    displayName: 'Local Admin',
    avatarUrl: null,
  },
  roles: ['admin'],
  permissions: ['content/read', 'content/write', 'characters/write', 'codes/write', 'news/write'],
  session: {
    authenticated: true,
    expiresAt: new Date(Date.now() + 60_000).toISOString(),
    issuedAt: new Date().toISOString(),
    provider: 'password',
  },
}

class FakeAuthService extends AuthService {
  constructor(private readonly options: { login?: LoginResult | null; currentUser?: CurrentUserResponse } = {}) {
    super()
  }

  async getCurrentUser(): Promise<CurrentUserResponse> {
    return this.options.currentUser || anonymousCurrentUser
  }

  async loginWithPassword(): Promise<LoginResult | null> {
    return this.options.login ?? null
  }

  async logout(): Promise<LogoutResponse> {
    return { authenticated: false, revoked: true }
  }
}

function withLocalAuthEnabled<T>(fn: () => Promise<T>): Promise<T> {
  const previous = process.env.ENABLE_LOCAL_AUTH
  process.env.ENABLE_LOCAL_AUTH = '1'
  return fn().finally(() => {
    if (previous === undefined) delete process.env.ENABLE_LOCAL_AUTH
    else process.env.ENABLE_LOCAL_AUTH = previous
  })
}

function withLocalAdminWritesEnabled<T>(fn: () => Promise<T>): Promise<T> {
  const previous = process.env.ENABLE_LOCAL_ADMIN_WRITES
  process.env.ENABLE_LOCAL_ADMIN_WRITES = '1'
  return fn().finally(() => {
    if (previous === undefined) delete process.env.ENABLE_LOCAL_ADMIN_WRITES
    else process.env.ENABLE_LOCAL_ADMIN_WRITES = previous
  })
}

test('GET /api/me returns explicit unauthenticated envelope', async () => {
  const app = await buildApp()
  const res = await app.inject({ method: 'GET', url: '/api/me' })
  await app.close()

  assert.equal(res.statusCode, 200)
  const body = res.json()
  assert.equal(body.ok, true)
  assert.equal(body.data.authenticated, false)
  assert.equal(body.data.user, null)
  assert.deepEqual(body.data.roles, [])
  assert.deepEqual(body.data.permissions, [])
  assert.equal(body.data.session.authenticated, false)
  assert.equal(body.meta.source, 'auth-disabled')
  assert.equal('stack' in body, false)
})

test('CSRF endpoint is disabled unless explicitly enabled', async () => {
  const app = await buildApp()
  const res = await app.inject({
    method: 'GET',
    url: '/api/auth/csrf',
  })
  await app.close()

  assert.equal(res.statusCode, 501)
})

test('CSRF endpoint returns scaffold token when enabled', async () => {
  await withLocalAuthEnabled(async () => {
    const app = await buildApp({ authService: new FakeAuthService() })
    const res = await app.inject({
      method: 'GET',
      url: '/api/auth/csrf',
    })
    await app.close()

    assert.equal(res.statusCode, 200)
    const body = res.json()
    assert.equal(body.ok, true)
    assert.ok(body.data.token)
  })
})

test('local login is disabled unless explicitly enabled', async () => {
  const app = await buildApp()
  const res = await app.inject({
    method: 'POST',
    url: '/api/auth/local-login',
    payload: { email: 'admin@example.test', password: 'wrong-password' },
  })
  await app.close()

  assert.equal(res.statusCode, 501)
  const body = res.json()
  assert.equal(body.ok, false)
  assert.equal(body.status, 'not_implemented')
})

test('invalid local login returns generic credential error when enabled', async () => {
  await withLocalAuthEnabled(async () => {
    const app = await buildApp({ authService: new FakeAuthService({ login: null }) })
    const res = await app.inject({
      method: 'POST',
      url: '/api/auth/local-login',
      payload: { email: 'admin@example.test', password: 'wrong-password' },
    })
    await app.close()

    assert.equal(res.statusCode, 401)
    const body = res.json()
    assert.equal(body.ok, false)
    assert.equal(body.status, 'invalid_credentials')
    assert.equal(body.message, 'Invalid email or password.')
    assert.equal('user' in body, false)
  })
})

test('valid local login returns safe user state and session cookie when enabled', async () => {
  await withLocalAuthEnabled(async () => {
    const expiresAt = new Date(Date.now() + 60_000)
    const app = await buildApp({
      authService: new FakeAuthService({
        login: {
          token: 'opaque-test-token',
          expiresAt,
          currentUser: authenticatedUser,
        },
      }),
    })
    const res = await app.inject({
      method: 'POST',
      url: '/api/auth/local-login',
      payload: { email: 'admin@example.test', password: 'CorrectHorseBattery1!' },
    })
    await app.close()

    assert.equal(res.statusCode, 200)
    assert.match(String(res.headers['set-cookie']), /nte_session=/)
    assert.match(String(res.headers['set-cookie']), /HttpOnly/)
    assert.match(String(res.headers['set-cookie']), /SameSite=Lax/)
    const body = res.json()
    assert.equal(body.ok, true)
    assert.equal(body.data.authenticated, true)
    assert.equal(body.data.user.email, 'admin@example.test')
    assert.equal('token' in body.data, false)
  })
})

test('/api/me can return authenticated local session state without secrets', async () => {
  await withLocalAuthEnabled(async () => {
    const app = await buildApp({ authService: new FakeAuthService({ currentUser: authenticatedUser }) })
    const res = await app.inject({ method: 'GET', url: '/api/me', headers: { cookie: 'nte_session=opaque-test-token' } })
    await app.close()

    assert.equal(res.statusCode, 200)
    const body = res.json()
    assert.equal(body.ok, true)
    assert.equal(body.data.authenticated, true)
    assert.equal(body.data.user.externalId, 'local-admin')
    assert.deepEqual(body.data.roles, ['admin'])
    assert.equal('passwordHash' in body.data, false)
    assert.equal('token' in body.data, false)
  })
})

test('local logout clears session cookie when enabled', async () => {
  await withLocalAuthEnabled(async () => {
    const app = await buildApp({ authService: new FakeAuthService() })
    const res = await app.inject({
      method: 'POST',
      url: '/api/auth/logout',
      headers: { 
        cookie: 'nte_session=opaque-test-token; nte_csrf=valid-token',
        'x-csrf-token': 'valid-token'
      },
    })
    await app.close()

    assert.equal(res.statusCode, 200)
    assert.match(String(res.headers['set-cookie']), /nte_session=/)
    assert.match(String(res.headers['set-cookie']), /Max-Age=0/)
    const body = res.json()
    assert.equal(body.ok, true)
    assert.equal(body.data.revoked, true)
  })
})

test('public GET routes do not require CSRF', async () => {
  const app = await buildApp()
  const res = await app.inject({
    method: 'GET',
    url: '/api/characters',
  })
  // Should return 200 or 501 depending on mode, but NOT 403 CSRF error
  assert.notEqual(res.statusCode, 403)
  await app.close()
})
