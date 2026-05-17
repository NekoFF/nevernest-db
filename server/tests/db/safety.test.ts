import assert from 'node:assert/strict'
import test from 'node:test'
import { assertLocalDatabaseUrl } from '../../src/db/safety.js'

test('allows localhost database URL', () => {
  assert.doesNotThrow(() => assertLocalDatabaseUrl('postgres://postgres:postgres@localhost:5432/nte_database'))
})

test('allows 127.0.0.1 database URL', () => {
  assert.doesNotThrow(() => assertLocalDatabaseUrl('postgres://postgres:postgres@127.0.0.1:5432/nte_dev'))
})

test('allows docker compose postgres host', () => {
  assert.doesNotThrow(() => assertLocalDatabaseUrl('postgres://postgres:postgres@postgres:5432/nte_local'))
})

test('rejects missing database URL', () => {
  assert.throws(() => assertLocalDatabaseUrl(''), /required/)
})

test('rejects production-looking host', () => {
  assert.throws(() => assertLocalDatabaseUrl('postgres://user:pass@db.example.com:5432/nte_database'), /Refusing non-local/)
})

test('rejects URL without database name', () => {
  assert.throws(() => assertLocalDatabaseUrl('postgres://postgres:postgres@localhost:5432'), /database name/)
})
