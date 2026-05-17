import assert from 'node:assert/strict'
import test from 'node:test'

const runEmptyDbTests = process.env.RUN_DB_TESTS === '1' && process.env.RUN_EMPTY_DB_TESTS === '1' && process.env.RUN_SEEDED_DB_TESTS !== '1'

test('DB repositories return empty lists against an empty migrated local DB', { skip: !runEmptyDbTests }, async () => {
  const { createDbClient, closeDbClient } = await import('../../src/db/client.js')
  const {
    DbCartridgeRepository,
    DbCharacterRepository,
    DbContentRepository,
    DbModuleRepository,
    DbTierListRepository,
    DbVehicleRepository,
    DbWeaponRepository,
  } = await import('../../src/repositories/db/index.js')

  const db = createDbClient()
  try {
    const characters = new DbCharacterRepository(db)
    const weapons = new DbWeaponRepository(db)
    const cartridges = new DbCartridgeRepository(db)
    const modules = new DbModuleRepository(db)
    const vehicles = new DbVehicleRepository(db)
    const tierLists = new DbTierListRepository(db)
    const content = new DbContentRepository(db)

    assert.deepEqual(await characters.findMany(), [])
    assert.deepEqual(await weapons.findMany(), [])
    assert.deepEqual(await cartridges.findMany(), [])
    assert.deepEqual(await modules.findShapes(), [])
    assert.deepEqual(await modules.findPieces(), [])
    assert.deepEqual(await vehicles.findMany(), [])
    assert.deepEqual(await tierLists.findMany(), [])
    assert.deepEqual(await content.codes.findMany(), [])
    assert.deepEqual(await content.news.findMany(), [])
    assert.deepEqual(await content.guides.findMany(), [])
    assert.deepEqual(await content.communityLinks.findMany(), [])
    assert.deepEqual(await content.apartmentItems.findMany(), [])
  } finally {
    await closeDbClient()
  }
})

test('DB repositories return null for missing detail rows', { skip: !runEmptyDbTests }, async () => {
  const { createDbClient, closeDbClient } = await import('../../src/db/client.js')
  const { DbCharacterRepository, DbWeaponRepository } = await import('../../src/repositories/db/index.js')

  const db = createDbClient()
  try {
    assert.equal(await new DbCharacterRepository(db).findByIdOrSlug('missing-character'), null)
    assert.equal(await new DbWeaponRepository(db).findByIdOrSlug('missing-weapon'), null)
  } finally {
    await closeDbClient()
  }
})
