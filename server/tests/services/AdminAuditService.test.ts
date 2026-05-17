import assert from 'node:assert/strict'
import test from 'node:test'
import { AdminAuditService } from '../../src/services/AdminAuditService.js'

test('AdminAuditService formats metadata safely', () => {
  const service = new AdminAuditService()
  const metadata = service.formatMetadata({ ip: '127.0.0.1', userAgent: 'Mozilla/5.0' })
  
  assert.equal(metadata.ip, '127.0.0.1')
  assert.equal(metadata.userAgent, 'Mozilla/5.0')
})

test('AdminAuditService sanitizes sensitive data in payloads', async () => {
  const service = new AdminAuditService()
  
  // We need to use any here to access the private sanitizePayload for testing,
  // or just call logAction and verify it doesn't throw and would have sanitized.
  // Since logAction is async and returns void, we'll verify it handles sensitive keys.
  
  const payload = {
    action: 'test',
    entityType: 'user',
    userId: 'admin-1',
    timestamp: new Date().toISOString(),
    metadata: {
      ip: '127.0.0.1',
      sessionToken: 'secret-token',
    },
    before: {
      passwordHash: 'old-hash',
    },
    after: {
      passwordHash: 'new-hash',
    }
  }

  // logAction calls sanitizePayload internally
  await service.logAction(payload)

  assert.equal(payload.metadata.sessionToken, '[REDACTED]')
  assert.equal((payload.before as any).passwordHash, '[REDACTED]')
  assert.equal((payload.after as any).passwordHash, '[REDACTED]')
})

test('AdminAuditService handles nested sensitive data', async () => {
  const service = new AdminAuditService()
  
  const payload = {
    action: 'test',
    entityType: 'user',
    userId: 'admin-1',
    timestamp: new Date().toISOString(),
    metadata: {
      nested: {
        user_password: '123',
      }
    }
  }

  await service.logAction(payload)

  assert.equal((payload.metadata.nested as any).user_password, '[REDACTED]')
})

test('AdminAuditService redacts CSRF tokens', async () => {
  const service = new AdminAuditService()
  
  const payload = {
    action: 'test',
    entityType: 'user',
    userId: 'admin-1',
    timestamp: new Date().toISOString(),
    metadata: {
      'x-csrf-token': 'should-be-redacted',
    }
  }

  await service.logAction(payload)

  assert.equal((payload.metadata as any)['x-csrf-token'], '[REDACTED]')
})
