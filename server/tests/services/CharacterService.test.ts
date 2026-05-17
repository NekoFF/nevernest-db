import assert from 'node:assert/strict'
import test from 'node:test'
import { CharacterService } from '../../src/services/CharacterService.js'
import { MockCharacterRepository } from '../../src/repositories/mock/MockCharacterRepository.js'
import { NotFoundError, NotImplementedError } from '../../src/utils/errors.js'
import { characterFixtures } from '../fixtures/entities.js'

test('CharacterService calls repository findMany', async () => {
  const service = new CharacterService(new MockCharacterRepository(characterFixtures))
  const rows = await service.list()
  assert.equal(rows.length, 2)
  assert.equal(rows[0].externalId, 'nanally')
})

test('CharacterService returns data for a valid slug', async () => {
  const service = new CharacterService(new MockCharacterRepository(characterFixtures))
  const row = await service.getByIdOrSlug('baicang')
  assert.equal(row.name, 'Baicang')
})

test('CharacterService throws NotFoundError for unknown id', async () => {
  const service = new CharacterService(new MockCharacterRepository(characterFixtures))
  await assert.rejects(() => service.getByIdOrSlug('missing'), NotFoundError)
})

test('CharacterService without repository stays controlled', async () => {
  const service = new CharacterService()
  await assert.rejects(() => service.list(), NotImplementedError)
})
