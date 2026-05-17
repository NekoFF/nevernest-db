import assert from 'node:assert/strict'
import test from 'node:test'
import { error, forbidden, notImplemented, ok, unauthorized } from '../../src/utils/apiResponse.js'
import { NotFoundError, NotImplementedError, ValidationError, toApiError } from '../../src/utils/errors.js'

test('ok wraps data and meta', () => {
  const response = ok({ id: 'x' }, { count: 1 })
  assert.equal(response.ok, true)
  assert.equal(response.data.id, 'x')
  assert.equal(response.meta.count, 1)
})

test('notImplemented uses stable shape', () => {
  const response = notImplemented('Later.')
  assert.equal(response.ok, false)
  assert.equal(response.status, 'not_implemented')
  assert.equal(response.message, 'Later.')
})

test('unauthorized uses stable shape', () => {
  const response = unauthorized('Go away.')
  assert.equal(response.ok, false)
  assert.equal(response.status, 'unauthorized')
  assert.equal(response.statusCode, 401)
  assert.equal(response.message, 'Go away.')
})

test('forbidden uses stable shape', () => {
  const response = forbidden('No entry.')
  assert.equal(response.ok, false)
  assert.equal(response.status, 'forbidden')
  assert.equal(response.statusCode, 403)
  assert.equal(response.message, 'No entry.')
})

test('error helper uses statusCode', () => {
  const response = error('Nope', 418)
  assert.equal(response.statusCode, 418)
  assert.equal(response.error, 'Nope')
})

test('domain errors convert to API responses', () => {
  assert.equal(toApiError(new NotImplementedError()).statusCode, 501)
  assert.equal(toApiError(new NotFoundError()).statusCode, 404)
  const validation = toApiError(new ValidationError('Bad', [{ path: 'x' }]))
  assert.equal(validation.statusCode, 400)
  assert.equal(validation.body.status, 'validation_error')
})
