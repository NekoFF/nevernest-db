import assert from 'node:assert/strict'
import test from 'node:test'
import { hashPassword, validateLocalAdminPassword, verifyPassword } from '../../src/auth/password.js'

test('local admin password validation rejects weak passwords', () => {
  const issues = validateLocalAdminPassword('short')
  assert.ok(issues.length >= 3)
})

test('password hash does not contain plaintext and verifies matching password', async () => {
  const password = 'CorrectHorseBattery1!'
  const hash = await hashPassword(password)

  assert.notEqual(hash, password)
  assert.equal(await verifyPassword(password, hash), true)
  assert.equal(await verifyPassword('WrongHorseBattery1!', hash), false)
})
