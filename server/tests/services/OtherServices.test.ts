import assert from 'node:assert/strict'
import test from 'node:test'
import { MockCartridgeRepository, MockTierListRepository, MockVehicleRepository, MockWeaponRepository } from '../../src/repositories/mock/index.js'
import { CartridgeService, TierListService, VehicleService, WeaponService } from '../../src/services/index.js'
import { cartridgeFixtures, tierListFixtures, vehicleFixtures, weaponFixtures } from '../fixtures/entities.js'

test('WeaponService returns fixture by external id', async () => {
  const service = new WeaponService(new MockWeaponRepository(weaponFixtures))
  const weapon = await service.getByIdOrSlug('ready-ready')
  assert.equal(weapon.name, 'Ready-Ready')
})

test('CartridgeService returns fixture by slug', async () => {
  const service = new CartridgeService(new MockCartridgeRepository(cartridgeFixtures))
  const cartridge = await service.getByIdOrSlug('lost-radiance')
  assert.equal(cartridge.externalId, 'lost-radiance')
})

test('VehicleService returns fixture list', async () => {
  const service = new VehicleService(new MockVehicleRepository(vehicleFixtures))
  const vehicles = await service.list()
  assert.equal(vehicles.length, 2)
})

test('TierListService returns tier rows', async () => {
  const service = new TierListService(new MockTierListRepository(tierListFixtures))
  const tierList = await service.getByIdOrSlug('official-character-tier-list')
  assert.equal(tierList.rows.length, 1)
})
