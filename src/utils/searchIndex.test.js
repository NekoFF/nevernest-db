import test from 'node:test'
import assert from 'node:assert/strict'
import { buildGlobalSearchIndex, searchGlobalIndex } from './searchIndex.js'
import { discoverySourceStatus, matchesDiscoverySourceStatus } from './sourceStatusFilters.js'

const fixtures = {
  characters: [{ id: 'nanally', name: 'Nanally', rarity: 'S', element: 'Psyche', arcType: 'Bose', roles: ['Main DPS'], tags: ['Damage'], sourceStatus: 'needs_verification' }],
  weapons: [{ id: 'ready-ready', slug: 'ready-ready', name: 'Ready Ready', rarity: 'S', type: 'Bose', subStat: { type: 'CRIT Rate' } }],
  cartridges: [{ id: 'devils-blood-curse', slug: 'devils-blood-curse', name: "Devil's Blood Curse", theme: 'Chaos', bonusCategory: 'damage', dataStatus: 'missing-compatible-shapes', bonuses: [{ text: 'Damage bonus' }] }],
  vehicles: [{ id: 'pendragon', name: 'Pendragon', type: 'Hypercar', maxSpeed: 202, description: 'Future performance' }],
  codes: [{ id: 'ntegift', code: 'NTEGIFT', status: 'active', rewardSummary: 'Annulith x50 + Materials' }],
  news: [{ id: 'news', title: 'Official Tracker', category: 'Official', date: '2026-05-15', sourceLabel: 'Manual tracker' }],
}

test('global search index includes primary read-only entity types', () => {
  const index = buildGlobalSearchIndex(fixtures)
  const categories = new Set(index.map((item) => item.category))
  assert.ok(categories.has('character'))
  assert.ok(categories.has('weapon'))
  assert.ok(categories.has('cartridge'))
  assert.ok(categories.has('modulePiece'))
  assert.ok(categories.has('vehicle'))
  assert.ok(categories.has('code'))
  assert.ok(categories.has('news'))
  assert.ok(categories.has('guide'))
})

test('global search returns expected entities without DB access', () => {
  const index = buildGlobalSearchIndex(fixtures)
  assert.equal(searchGlobalIndex(index, 'nanally')[0].category, 'character')
  assert.equal(searchGlobalIndex(index, 'ready')[0].category, 'weapon')
  assert.equal(searchGlobalIndex(index, 'devil')[0].category, 'cartridge')
  assert.equal(searchGlobalIndex(index, 'annulith')[0].category, 'code')
  assert.equal(searchGlobalIndex(index, 'vehicle').some((item) => item.category === 'vehicle'), true)
  assert.equal(searchGlobalIndex(index, 'news').some((item) => item.category === 'news'), true)
  assert.equal(searchGlobalIndex(index, 'type ii module').some((item) => item.category === 'modulePiece'), true)
  assert.equal(searchGlobalIndex(index, 'nothing-matches-this').length, 0)
})

test('global search entries include public routes', () => {
  const index = buildGlobalSearchIndex(fixtures)
  assert.equal(searchGlobalIndex(index, 'nanally')[0].route, '/characters/nanally')
  assert.equal(searchGlobalIndex(index, 'ready')[0].route, '/weapons/ready-ready')
  assert.equal(searchGlobalIndex(index, 'annulith')[0].route, '/codes')
})

test('source status discovery maps public confidence filters', () => {
  assert.equal(discoverySourceStatus('verified'), 'verified')
  assert.equal(discoverySourceStatus('missing-compatible-shapes'), 'needs_review')
  assert.equal(discoverySourceStatus('placeholder'), 'needs_review')
  assert.equal(matchesDiscoverySourceStatus('needs_verification', 'needs_review'), true)
  assert.equal(matchesDiscoverySourceStatus('', 'unknown'), true)
})
