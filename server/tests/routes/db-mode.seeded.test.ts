import assert from 'node:assert/strict'
import test from 'node:test'
import { assertLocalDatabaseUrl } from '../../src/db/safety.js'

const runSeededDbTests = process.env.RUN_DB_TESTS === '1' && process.env.RUN_SEEDED_DB_TESTS === '1'

function assertSuccessListEnvelope(body: any, endpoint: string) {
  assert.equal(body.ok, true, endpoint)
  assert.ok(Array.isArray(body.data), endpoint)
  assert.equal(body.meta.source, 'db', endpoint)
  assert.equal(body.meta.mode, 'db', endpoint)
  assert.equal(typeof body.meta.count, 'number', endpoint)
  assert.equal('stack' in body, false, endpoint)
}

function assertNoStackTrace(body: any, endpoint: string) {
  assert.equal('stack' in body, false, endpoint)
  assert.equal(JSON.stringify(body).includes('Error:'), false, endpoint)
}

test('seeded db mode returns seeded read data through API contracts', { skip: !runSeededDbTests }, async () => {
  assertLocalDatabaseUrl(process.env.DATABASE_URL)

  const { buildApp } = await import('../../src/app.js')
  const app = await buildApp({ mode: 'db' })

  try {
    const status = await app.inject({ method: 'GET', url: '/api/status' })
    assert.equal(status.statusCode, 200)
    const statusBody = status.json()
    assert.equal(statusBody.database, 'configured')
    assert.equal(statusBody.mode, 'db')
    assert.equal(statusBody.dataMode, 'db')
    assertNoStackTrace(statusBody, '/api/status')

    const characters = await app.inject({ method: 'GET', url: '/api/characters' })
    assert.equal(characters.statusCode, 200)
    const charactersBody = characters.json()
    assertSuccessListEnvelope(charactersBody, '/api/characters')
    assert.ok(charactersBody.data.length > 0, '/api/characters seeded rows')
    assert.equal(charactersBody.meta.count, charactersBody.data.length, '/api/characters count')

    const nanally = await app.inject({ method: 'GET', url: '/api/characters/nanally' })
    assert.equal(nanally.statusCode, 200)
    const nanallyBody = nanally.json()
    assert.equal(nanallyBody.ok, true)
    assert.ok(nanallyBody.data)
    assert.equal(nanallyBody.data.name, 'Nanally')
    assertNoStackTrace(nanallyBody, '/api/characters/nanally')

    const weapons = await app.inject({ method: 'GET', url: '/api/weapons' })
    assert.equal(weapons.statusCode, 200)
    const weaponsBody = weapons.json()
    assertSuccessListEnvelope(weaponsBody, '/api/weapons')
    assert.ok(weaponsBody.data.length > 0, '/api/weapons seeded rows')

    const vehicles = await app.inject({ method: 'GET', url: '/api/vehicles' })
    assert.equal(vehicles.statusCode, 200)
    const vehiclesBody = vehicles.json()
    assertSuccessListEnvelope(vehiclesBody, '/api/vehicles')
    assert.ok(vehiclesBody.data.length > 0, '/api/vehicles seeded rows')

    const codes = await app.inject({ method: 'GET', url: '/api/codes' })
    assert.equal(codes.statusCode, 200)
    const codesBody = codes.json()
    assertSuccessListEnvelope(codesBody, '/api/codes')
    assert.equal(codesBody.data.length, 13, '/api/codes stable seeded rows')
    assert.equal(codesBody.meta.count, 13, '/api/codes stable count')

    const news = await app.inject({ method: 'GET', url: '/api/news' })
    assert.equal(news.statusCode, 200)
    const newsBody = news.json()
    assertSuccessListEnvelope(newsBody, '/api/news')
    assert.equal(newsBody.data.length, 3, '/api/news stable seeded rows')
    assert.equal(newsBody.meta.count, 3, '/api/news stable count')

    const tierList = await app.inject({ method: 'GET', url: '/api/tier-lists/official' })
    assert.equal(tierList.statusCode, 200)
    const tierListBody = tierList.json()
    assertSuccessListEnvelope(tierListBody, '/api/tier-lists/official')
    assert.ok(tierListBody.data.length >= 0, '/api/tier-lists/official stable empty allowed')

    for (const body of [statusBody, charactersBody, nanallyBody, weaponsBody, vehiclesBody, codesBody, newsBody, tierListBody]) {
      assertNoStackTrace(body, 'seeded db envelope')
    }
  } finally {
    await app.close()
  }
})
