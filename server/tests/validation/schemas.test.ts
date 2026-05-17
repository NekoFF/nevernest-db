import assert from 'node:assert/strict'
import test from 'node:test'
import { ValiError, parse } from 'valibot'
import { filterQuerySchema, idOrSlugSchema, listQuerySchema, paginationQuerySchema, searchQuerySchema } from '../../src/schemas/index.js'

test('idOrSlug accepts stable ids and slugs', () => {
  assert.equal(parse(idOrSlugSchema, 'nanally'), 'nanally')
  assert.equal(parse(idOrSlugSchema, 'zero-female'), 'zero-female')
})

test('idOrSlug rejects spaces', () => {
  assert.throws(() => parse(idOrSlugSchema, 'bad slug'), ValiError)
})

test('pagination query coerces strings and enforces bounds', () => {
  const parsed = parse(paginationQuerySchema, { page: '2', limit: '10' })
  assert.equal(parsed.page, 2)
  assert.equal(parsed.limit, 10)
  assert.throws(() => parse(paginationQuerySchema, { page: '0', limit: '101' }), ValiError)
})

test('search and filter query basics validate', () => {
  assert.equal(parse(searchQuerySchema, { q: 'nan' }).q, 'nan')
  const filters = parse(filterQuerySchema, { rarity: 'S', element: 'anima', arcType: 'plasma', role: 'damage', sourceStatus: 'unknown', status: 'draft' })
  assert.equal(filters.rarity, 'S')
})

test('list query rejects invalid source status', () => {
  assert.throws(() => parse(listQuerySchema, { sourceStatus: 'done' }), ValiError)
})
