import assert from 'node:assert/strict'
import test from 'node:test'
import { buildApp } from '../../src/app.js'

test('mock mode returns character list', async () => {
  const app = await buildApp({ mode: 'mock' })
  const res = await app.inject({ method: 'GET', url: '/api/characters?page=1&limit=10' })
  await app.close()
  assert.equal(res.statusCode, 200)
  const body = res.json()
  assert.equal(body.ok, true)
  assert.equal(body.meta.source, 'mock')
  assert.equal(body.meta.mode, 'mock')
  assert.equal(body.meta.count, 2)
  assert.equal(body.data[0].externalId, 'nanally')
})

test('mock mode returns character detail by slug', async () => {
  const app = await buildApp({ mode: 'mock' })
  const res = await app.inject({ method: 'GET', url: '/api/characters/nanally' })
  await app.close()
  assert.equal(res.statusCode, 200)
  assert.equal(res.json().data.name, 'Nanally')
})

test('mock mode returns 404 for missing character', async () => {
  const app = await buildApp({ mode: 'mock' })
  const res = await app.inject({ method: 'GET', url: '/api/characters/missing-character' })
  await app.close()
  assert.equal(res.statusCode, 404)
  assert.equal(res.json().status, 'not_found')
})

test('mock mode returns weapon, cartridge, vehicle, tier list, codes, and news lists', async () => {
  const app = await buildApp({ mode: 'mock' })
  const urls = [
    '/api/weapons',
    '/api/cartridges',
    '/api/modules/shapes',
    '/api/modules/pieces',
    '/api/vehicles',
    '/api/tier-lists/official',
    '/api/codes',
    '/api/news',
    '/api/guides',
    '/api/community-links',
    '/api/apartments/items',
  ]
  for (const url of urls) {
    const res = await app.inject({ method: 'GET', url })
    assert.equal(res.statusCode, 200, url)
    const body = res.json()
    assert.equal(body.ok, true, url)
    assert.equal(body.meta.source, 'mock', url)
    assert.ok(Array.isArray(body.data), url)
    assert.ok(body.data.length > 0, url)
  }
  await app.close()
})

test('mock mode returns content details and 404s for missing details', async () => {
  const app = await buildApp({ mode: 'mock' })
  const news = await app.inject({ method: 'GET', url: '/api/news/phase-note' })
  const guide = await app.inject({ method: 'GET', url: '/api/guides/starter-guide' })
  const missingGuide = await app.inject({ method: 'GET', url: '/api/guides/missing-guide' })
  await app.close()
  assert.equal(news.statusCode, 200)
  assert.equal(news.json().data.slug, 'phase-note')
  assert.equal(guide.statusCode, 200)
  assert.equal(guide.json().data.slug, 'starter-guide')
  assert.equal(missingGuide.statusCode, 404)
})

test('default mode still returns 501 for read route', async () => {
  const app = await buildApp()
  const res = await app.inject({ method: 'GET', url: '/api/characters' })
  await app.close()
  assert.equal(res.statusCode, 501)
  assert.equal(res.json().status, 'not_implemented')
})

test('mock mode still validates invalid query params', async () => {
  const app = await buildApp({ mode: 'mock' })
  const res = await app.inject({ method: 'GET', url: '/api/characters?page=0' })
  await app.close()
  assert.equal(res.statusCode, 400)
  assert.equal(res.json().status, 'validation_error')
})
