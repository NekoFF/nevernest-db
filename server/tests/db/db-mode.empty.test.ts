import assert from 'node:assert/strict'
import test from 'node:test'

const runEmptyDbTests = process.env.RUN_DB_TESTS === '1' && process.env.RUN_EMPTY_DB_TESTS === '1' && process.env.RUN_SEEDED_DB_TESTS !== '1'

test('db mode status and empty list routes use db response metadata', { skip: !runEmptyDbTests }, async () => {
  const { buildApp } = await import('../../src/app.js')

  const app = await buildApp({ mode: 'db' })
  try {
    const status = await app.inject({ method: 'GET', url: '/api/status' })
    assert.equal(status.statusCode, 200)
    assert.equal(status.json().database, 'configured')
    assert.equal(status.json().mode, 'db')

    const characters = await app.inject({ method: 'GET', url: '/api/characters' })
    assert.equal(characters.statusCode, 200)
    assert.deepEqual(characters.json().data, [])
    assert.equal(characters.json().meta.source, 'db')
    assert.equal(characters.json().meta.mode, 'db')
    assert.equal(characters.json().meta.count, 0)
  } finally {
    await app.close()
  }
})

test('db mode detail routes return clean 404 for empty database', { skip: !runEmptyDbTests }, async () => {
  const { buildApp } = await import('../../src/app.js')

  const app = await buildApp({ mode: 'db' })
  try {
    const response = await app.inject({ method: 'GET', url: '/api/characters/missing-character' })
    assert.equal(response.statusCode, 404)
    assert.equal(response.json().ok, false)
    assert.equal(response.json().status, 'not_found')
    assert.equal('stack' in response.json(), false)
  } finally {
    await app.close()
  }
})
