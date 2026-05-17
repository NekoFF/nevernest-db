import assert from 'node:assert/strict'
import test from 'node:test'
import { buildApp } from '../../src/app.js'

test('valid unimplemented route returns consistent 501 response', async () => {
  const app = await buildApp()
  const res = await app.inject({ method: 'GET', url: '/api/characters/nanally?page=1&limit=10' })
  await app.close()
  assert.equal(res.statusCode, 501)
  const body = res.json()
  assert.equal(body.ok, false)
  assert.equal(body.status, 'not_implemented')
  assert.match(body.message, /later phase/)
})

test('invalid query params return validation error without stack trace', async () => {
  const app = await buildApp()
  const res = await app.inject({ method: 'GET', url: '/api/characters?page=0&limit=999' })
  await app.close()
  assert.equal(res.statusCode, 400)
  const body = res.json()
  assert.equal(body.ok, false)
  assert.equal(body.status, 'validation_error')
  assert.equal('stack' in body, false)
})

test('invalid idOrSlug returns validation error', async () => {
  const app = await buildApp()
  const res = await app.inject({ method: 'GET', url: '/api/weapons/bad%20slug' })
  await app.close()
  assert.equal(res.statusCode, 400)
  assert.equal(res.json().status, 'validation_error')
})
