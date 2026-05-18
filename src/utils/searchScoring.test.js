import test from 'node:test'
import assert from 'node:assert/strict'
import { normalizeSearchText, scoreSearchItem, searchItems, tokenizeSearchQuery } from './searchScoring.js'

test('normalizes and tokenizes search text', () => {
  assert.equal(normalizeSearchText("  Good-Boy's Grand Adventure!  "), 'good boy s grand adventure')
  assert.deepEqual(tokenizeSearchQuery('Nanally psyche'), ['nanally', 'psyche'])
})

test('scores direct name matches ahead of metadata matches', () => {
  const rows = [
    { id: 'a', name: 'Psyche Support', categoryLabel: 'Character', meta: 'Nanally' },
    { id: 'nanally', name: 'Nanally', categoryLabel: 'Character', meta: 'Psyche' },
  ]
  const results = searchItems(rows, 'nanally')
  assert.equal(results[0].id, 'nanally')
  assert.ok(scoreSearchItem(results[0], 'nanally') > 0)
})

test('requires every token to match', () => {
  const item = { id: 'weapon', name: 'Ready Ready', categoryLabel: 'Weapon', meta: 'S Bose' }
  assert.equal(scoreSearchItem(item, 'ready bose') > 0, true)
  assert.equal(scoreSearchItem(item, 'ready missing'), 0)
})
