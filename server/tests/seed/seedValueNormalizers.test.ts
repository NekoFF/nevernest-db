import assert from 'node:assert/strict'
import test from 'node:test'
import { normalizeNullableNumber, normalizeNumber, normalizePercentNumber } from '../../src/seed/seedValueNormalizers.js'

test('percent strings normalize as displayed numeric values', () => {
  assert.equal(normalizePercentNumber('45%'), 45)
  assert.equal(normalizePercentNumber('12%'), 12)
})

test('decimal percent strings normalize as displayed numeric values', () => {
  assert.equal(normalizePercentNumber('27.5%'), 27.5)
})

test('plain numeric strings and numbers normalize', () => {
  assert.equal(normalizePercentNumber('12'), 12)
  assert.equal(normalizeNumber(12), 12)
})

test('nullable numeric normalization preserves empty values as null', () => {
  assert.equal(normalizeNullableNumber(null), null)
  assert.equal(normalizeNullableNumber(undefined), null)
  assert.equal(normalizeNullableNumber(''), null)
})

test('invalid numeric strings fail clearly', () => {
  assert.throws(() => normalizePercentNumber('forty five%'), /Invalid numeric seed value/)
  assert.throws(() => normalizeNumber('45 atk'), /Invalid numeric seed value/)
})
