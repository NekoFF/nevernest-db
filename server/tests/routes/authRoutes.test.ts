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
  permissions: ['content/read', 'content/write', 'characters/write', 'codes/write'],
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

test('admin character create skeleton requires authentication and permission', async () => {
  const app = await buildApp()
  const res = await app.inject({
    method: 'POST',
    url: '/api/admin/characters',
    payload: { name: 'Should Not Persist' },
    headers: {
      'x-csrf-token': 'valid-token',
      cookie: 'nte_csrf=valid-token'
    }
  })
  await app.close()

  // No session -> 401
  assert.equal(res.statusCode, 401)
})

test('admin character create returns 403 for authenticated user without permission', async () => {
  const userWithoutPermission: CurrentUserResponse = {
    ...authenticatedUser,
    permissions: ['content/read'],
  }
  const app = await buildApp({ authService: new FakeAuthService({ currentUser: userWithoutPermission }) })
  const res = await app.inject({
    method: 'POST',
    url: '/api/admin/characters',
    payload: { name: 'Should Not Persist' },
    headers: {
      'x-csrf-token': 'valid-token',
      cookie: 'nte_csrf=valid-token'
    }
  })
  await app.close()

  assert.equal(res.statusCode, 403)
})

test('admin character create returns 501 for authenticated admin with permission', async () => {
  const app = await buildApp({ authService: new FakeAuthService({ currentUser: authenticatedUser }) })
  const res = await app.inject({
    method: 'POST',
    url: '/api/admin/characters',
    payload: { name: 'Should Not Persist' },
    headers: {
      'x-csrf-token': 'valid-token',
      cookie: 'nte_csrf=valid-token'
    }
  })
  await app.close()

  assert.equal(res.statusCode, 501)
  const body = res.json()
  assert.equal(body.ok, false)
  assert.equal(body.status, 'not_implemented')
  assert.equal(body.requiredPermission, 'characters/write')
})

test('admin character patch skeleton requires authentication and permission', async () => {
  const app = await buildApp()
  const res = await app.inject({
    method: 'PATCH',
    url: '/api/admin/characters/nanally',
    payload: { name: 'Should Not Persist' },
    headers: {
      'x-csrf-token': 'valid-token',
      cookie: 'nte_csrf=valid-token'
    }
  })
  await app.close()

  assert.equal(res.statusCode, 401)
})

test('admin character patch returns 501 for authenticated admin with permission', async () => {
  const app = await buildApp({ authService: new FakeAuthService({ currentUser: authenticatedUser }) })
  const res = await app.inject({
    method: 'PATCH',
    url: '/api/admin/characters/nanally',
    payload: { name: 'Should Not Persist' },
    headers: {
      'x-csrf-token': 'valid-token',
      cookie: 'nte_csrf=valid-token'
    }
  })
  await app.close()

  assert.equal(res.statusCode, 501)
  const body = res.json()
  assert.equal(body.ok, false)
  assert.equal(body.status, 'not_implemented')
  assert.equal(body.requiredPermission, 'characters/write')
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

test('admin routes require CSRF when enabled', async () => {
  await withLocalAuthEnabled(async () => {
    const app = await buildApp({ authService: new FakeAuthService({ currentUser: authenticatedUser }) })
    
    // 1. Missing CSRF -> 403
    const res1 = await app.inject({
      method: 'POST',
      url: '/api/admin/characters',
      payload: { name: 'Test' },
    })
    assert.equal(res1.statusCode, 403)
    assert.equal(res1.json().status, 'csrf_error')

    // 2. Invalid CSRF -> 403
    const res2 = await app.inject({
      method: 'POST',
      url: '/api/admin/characters',
      payload: { name: 'Test' },
      headers: {
        'x-csrf-token': 'wrong-token',
        cookie: 'nte_csrf=other-token'
      }
    })
    assert.equal(res2.statusCode, 403)
    assert.equal(res2.json().status, 'csrf_error')

    // 3. Valid CSRF but missing session -> 401
    const appNoSession = await buildApp({ authService: new FakeAuthService() })
    const res4 = await appNoSession.inject({
      method: 'POST',
      url: '/api/admin/characters',
      payload: { name: 'Test' },
      headers: {
        'x-csrf-token': 'valid-token',
        cookie: 'nte_csrf=valid-token'
      }
    })
    assert.equal(res4.statusCode, 401)
    await appNoSession.close()

    // 4. Valid CSRF + Valid Session + Permission -> 501
    const res5 = await app.inject({
      method: 'POST',
      url: '/api/admin/characters',
      payload: { name: 'Test' },
      headers: {
        'x-csrf-token': 'valid-token',
        cookie: 'nte_csrf=valid-token'
      }
    })
    assert.equal(res5.statusCode, 501)

    await app.close()
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

test('admin code update requires ENABLE_LOCAL_ADMIN_WRITES', async () => {
  await withLocalAuthEnabled(async () => {
    const app = await buildApp({ 
      authService: new FakeAuthService({ currentUser: authenticatedUser }),
      mode: 'mock'
    })
    
    // 1. Without the flag -> 501
    const res = await app.inject({
      method: 'PATCH',
      url: '/api/admin/codes/test-code',
      payload: { code: 'NEWCODE' },
      headers: {
        'x-csrf-token': 'valid-token',
        cookie: 'nte_csrf=valid-token'
      }
    })
    assert.equal(res.statusCode, 501)
    assert.equal(res.json().status, 'not_implemented')

    // 2. With the flag -> 200 (Mock success)
    await withLocalAdminWritesEnabled(async () => {
      const res2 = await app.inject({
        method: 'PATCH',
        url: '/api/admin/codes/welcome-code',
        payload: { code: 'NEWCODE' },
        headers: {
          'x-csrf-token': 'valid-token',
          cookie: 'nte_csrf=valid-token'
        }
      })
      assert.equal(res2.statusCode, 200)
      assert.equal(res2.json().data.code, 'NEWCODE')
    })

    await app.close()
  })
})

test('admin code update validates body', async () => {
  await withLocalAuthEnabled(async () => {
    await withLocalAdminWritesEnabled(async () => {
      const app = await buildApp({ 
        authService: new FakeAuthService({ currentUser: authenticatedUser }),
        mode: 'mock'
      })
      
      // 1. Empty body -> 400
      const res1 = await app.inject({
        method: 'PATCH',
        url: '/api/admin/codes/welcome-code',
        payload: {},
        headers: {
          'x-csrf-token': 'valid-token',
          cookie: 'nte_csrf=valid-token'
        }
      })
      assert.equal(res1.statusCode, 400)
      assert.equal(res1.json().message, 'Empty update body.')

      // 2. Invalid field -> 400 (Valibot validation)
      const res2 = await app.inject({
        method: 'PATCH',
        url: '/api/admin/codes/welcome-code',
        payload: { status: 'invalid-status' },
        headers: {
          'x-csrf-token': 'valid-token',
          cookie: 'nte_csrf=valid-token'
        }
      })
      assert.equal(res2.statusCode, 400)
      assert.equal(res2.json().status, 'validation_error')

      await app.close()
    })
  })
})

test('admin code update triggers audit log', async () => {
  await withLocalAuthEnabled(async () => {
    await withLocalAdminWritesEnabled(async () => {
      // Spy on logAction
      const originalLogAction = adminAuditService.logAction
      let auditLogged = false
      adminAuditService.logAction = async (payload) => {
        auditLogged = true
        assert.equal(payload.action, 'update')
        assert.equal(payload.entityType, 'code')
      }

      const app = await buildApp({ 
        authService: new FakeAuthService({ currentUser: authenticatedUser }),
        mode: 'mock'
      })
      
      try {
        await app.inject({
          method: 'PATCH',
          url: '/api/admin/codes/welcome-code',
          payload: { code: 'NEWCODE' },
          headers: {
            'x-csrf-token': 'valid-token',
            cookie: 'nte_csrf=valid-token'
          }
        })
        assert.equal(auditLogged, true)
      } finally {
        adminAuditService.logAction = originalLogAction
        await app.close()
      }
    })
  })
})
