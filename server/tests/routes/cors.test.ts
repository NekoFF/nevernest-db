import assert from 'node:assert/strict'
import test from 'node:test'
import { buildApp } from '../../src/app.js'

test('CORS headers are correctly set for allowed origin (localhost)', async () => {
  const app = await buildApp({ mode: 'mock' })
  const res = await app.inject({
    method: 'GET',
    url: '/health',
    headers: {
      origin: 'http://localhost:5173',
    },
  })
  await app.close()

  assert.equal(res.statusCode, 200)
  assert.equal(res.headers['access-control-allow-origin'], 'http://localhost:5173')
  assert.equal(res.headers['access-control-allow-credentials'], 'true')
})

test('CORS headers are correctly set for allowed origin (127.0.0.1)', async () => {
  const app = await buildApp({ mode: 'mock' })
  const res = await app.inject({
    method: 'GET',
    url: '/health',
    headers: {
      origin: 'http://127.0.0.1:5173',
    },
  })
  await app.close()

  assert.equal(res.statusCode, 200)
  assert.equal(res.headers['access-control-allow-origin'], 'http://127.0.0.1:5173')
  assert.equal(res.headers['access-control-allow-credentials'], 'true')
})

test('CORS preflight (OPTIONS) returns correct headers', async () => {
  const app = await buildApp({ mode: 'mock' })
  const res = await app.inject({
    method: 'OPTIONS',
    url: '/api/auth/csrf',
    headers: {
      origin: 'http://localhost:5173',
      'access-control-request-method': 'GET',
      'access-control-request-headers': 'x-csrf-token',
    },
  })
  await app.close()

  assert.equal(res.statusCode, 204)
  assert.equal(res.headers['access-control-allow-origin'], 'http://localhost:5173')
  assert.equal(res.headers['access-control-allow-credentials'], 'true')
  assert.match(res.headers['access-control-allow-headers'] as string, /x-csrf-token/i)
})

test('CORS blocks disallowed origins', async () => {
  const app = await buildApp({ mode: 'mock' })
  const res = await app.inject({
    method: 'GET',
    url: '/health',
    headers: {
      origin: 'http://malicious.example.com',
    },
  })
  await app.close()

  // Fastify-cors behavior: if origin is not allowed, it might either omit the header or return 200 without it
  // depending on configuration. With multiple origins it usually omits it.
  assert.equal(res.headers['access-control-allow-origin'], undefined)
})
