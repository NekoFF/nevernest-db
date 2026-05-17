import test from 'node:test'
import { buildApp } from '../../src/app.js'
import { assertMatchesSnapshot } from '../helpers/snapshot.js'

const mockSnapshots = [
  ['/health', 'health.json'],
  ['/api/status', 'status.json'],
  ['/api/characters', 'characters.list.json'],
  ['/api/characters/nanally', 'characters.detail.json'],
  ['/api/weapons', 'weapons.list.json'],
  ['/api/cartridges', 'cartridges.list.json'],
  ['/api/modules/shapes', 'modules.shapes.list.json'],
  ['/api/modules/pieces', 'modules.pieces.list.json'],
  ['/api/vehicles', 'vehicles.list.json'],
  ['/api/tier-lists/official', 'tier-list.official.json'],
  ['/api/codes', 'codes.list.json'],
  ['/api/news', 'news.list.json'],
  ['/api/news/phase-note', 'news.detail.json'],
  ['/api/guides', 'guides.list.json'],
  ['/api/guides/starter-guide', 'guides.detail.json'],
  ['/api/community-links', 'community-links.list.json'],
  ['/api/apartments/items', 'apartments.items.list.json'],
] as const

for (const [url, snapshot] of mockSnapshots) {
  test(`mock response matches ${snapshot}`, async () => {
    const app = await buildApp({ mode: 'mock' })
    const res = await app.inject({ method: 'GET', url })
    await app.close()
    assertMatchesSnapshot(snapshot, res.json())
  })
}

test('validation error response matches snapshot', async () => {
  const app = await buildApp({ mode: 'mock' })
  const res = await app.inject({ method: 'GET', url: '/api/characters?page=0' })
  await app.close()
  assertMatchesSnapshot('error.validation.json', res.json())
})

test('not found response matches snapshot', async () => {
  const app = await buildApp({ mode: 'mock' })
  const res = await app.inject({ method: 'GET', url: '/api/news/missing-news' })
  await app.close()
  assertMatchesSnapshot('error.not-found.json', res.json())
})

test('not implemented response matches snapshot', async () => {
  const app = await buildApp()
  const res = await app.inject({ method: 'GET', url: '/api/characters' })
  await app.close()
  assertMatchesSnapshot('error.not-implemented.json', res.json())
})
