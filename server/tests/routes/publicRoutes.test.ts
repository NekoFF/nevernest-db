import assert from 'node:assert/strict'
import test from 'node:test'
import { buildApp } from '../../src/app.js'

test('GET /health returns safe status shape', async () => {
  const app = await buildApp()
  const res = await app.inject({ method: 'GET', url: '/health' })
  await app.close()
  assert.equal(res.statusCode, 200)
  const body = res.json()
  assert.equal(body.ok, true)
  assert.equal(body.service, 'nte-community-database-api')
  assert.equal(body.database, 'not_connected')
  assert.equal(typeof body.timestamp, 'string')
})

test('GET /api/status returns feature flags', async () => {
  const app = await buildApp()
  const res = await app.inject({ method: 'GET', url: '/api/status' })
  await app.close()
  assert.equal(res.statusCode, 200)
  const body = res.json()
  assert.equal(body.ok, true)
  assert.equal(body.features.auth, 'not_implemented')
  assert.equal(body.features.databaseBackedReads, 'not_implemented')
})
