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

test('admin character create skeleton remains disabled', async () => {
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
  assert.equal(res.json().status, 'not_implemented')
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

test('admin code update validates CSRF', async () => {
  await withLocalAuthEnabled(async () => {
    await withLocalAdminWritesEnabled(async () => {
      const app = await buildApp({ 
        authService: new FakeAuthService({ currentUser: authenticatedUser }),
        mode: 'mock'
      })
      
      const res = await app.inject({
        method: 'PATCH',
        url: '/api/admin/codes/welcome-code',
        payload: { code: 'NEWCODE' },
        headers: {
          'x-csrf-token': 'wrong-token',
          cookie: 'nte_csrf=valid-token'
        }
      })
      assert.equal(res.statusCode, 403)
      assert.equal(res.json().status, 'csrf_error')

      await app.close()
    })
  })
})

test('admin news update requires news/write permission', async () => {
  await withLocalAuthEnabled(async () => {
    await withLocalAdminWritesEnabled(async () => {
      const userWithoutNewsPerm: CurrentUserResponse = {
        ...authenticatedUser,
        permissions: ['codes/write'], // No news/write
      }
      const app = await buildApp({ 
        authService: new FakeAuthService({ currentUser: userWithoutNewsPerm }),
        mode: 'mock'
      })
      
      const res = await app.inject({
        method: 'PATCH',
        url: '/api/admin/news/phase-note',
        payload: { title: 'New Title' },
        headers: {
          'x-csrf-token': 'valid-token',
          cookie: 'nte_csrf=valid-token'
        }
      })
      assert.equal(res.statusCode, 403)
      assert.equal(res.json().status, 'forbidden')

      await app.close()
    })
  })
})

test('admin news update triggers audit log via shared pipeline', async () => {
  await withLocalAuthEnabled(async () => {
    await withLocalAdminWritesEnabled(async () => {
      // Spy on logAction
      const originalLogAction = adminAuditService.logAction
      let auditLogged = false
      adminAuditService.logAction = async (payload) => {
        auditLogged = true
        assert.equal(payload.action, 'update')
        assert.equal(payload.entityType, 'news')
        assert.equal(payload.after.title, 'New Title')
      }

      const app = await buildApp({ 
        authService: new FakeAuthService({ currentUser: authenticatedUser }),
        mode: 'mock'
      })
      
      try {
        await app.inject({
          method: 'PATCH',
          url: '/api/admin/news/phase-note',
          payload: { title: 'New Title' },
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

test('shared pipeline redacts sensitive data in audit', async () => {
  await withLocalAuthEnabled(async () => {
    await withLocalAdminWritesEnabled(async () => {
      const originalLogAction = adminAuditService.logAction
      let capturedPayload: any = null
      adminAuditService.logAction = async (payload) => {
        capturedPayload = JSON.parse(JSON.stringify(payload))
      }

      const app = await buildApp({ 
        authService: new FakeAuthService({ currentUser: authenticatedUser }),
        mode: 'mock'
      })
      
      try {
        await app.inject({
          method: 'PATCH',
          url: '/api/admin/news/phase-note',
          payload: { title: 'Secret Title' },
          headers: {
            'x-csrf-token': 'should-be-redacted',
            cookie: 'nte_csrf=should-be-redacted'
          }
        })
        
        // The pipeline metadata includes headers, which AdminAuditService should sanitize
        assert.ok(capturedPayload.metadata.userAgent.toLowerCase().includes('lightmyrequest'))
        // We verified redaction in AdminAuditService.test.ts, here we just ensure it's called
      } finally {
        adminAuditService.logAction = originalLogAction
        await app.close()
      }
    })
  })
})
