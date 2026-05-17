import {
  DbCartridgeRepository,
  DbCharacterRepository,
  DbContentRepository,
  DbModuleRepository,
  DbTierListRepository,
  DbVehicleRepository,
  DbWeaponRepository,
} from '../repositories/db/index.js'
import {
  MockCartridgeRepository,
  MockCharacterRepository,
  MockContentRepository,
  MockModuleRepository,
  MockTierListRepository,
  MockVehicleRepository,
  MockWeaponRepository,
  mockApartmentItems,
  mockCartridges,
  mockCharacters,
  mockCodes,
  mockCommunityLinks,
  mockGuides,
  mockModulePieces,
  mockModuleShapes,
  mockNews,
  mockTierLists,
  mockVehicles,
  mockWeapons,
} from '../repositories/mock/index.js'
import { createDbClient } from '../db/client.js'
import { assertLocalDatabaseUrl } from '../db/safety.js'
import { env } from '../config/env.js'
import { CartridgeService } from './CartridgeService.js'
import { CharacterService } from './CharacterService.js'
import { ContentService } from './ContentService.js'
import { ModuleService } from './ModuleService.js'
import { TierListService } from './TierListService.js'
import { VehicleService } from './VehicleService.js'
import { WeaponService } from './WeaponService.js'

export type ServiceMode = 'disabled' | 'mock' | 'db' | 'dev' | 'test' | 'production'

export type ServiceContainer = {
  mode: ServiceMode
  source: 'disabled' | 'mock' | 'db'
  characters: CharacterService
  weapons: WeaponService
  cartridges: CartridgeService
  modules: ModuleService
  vehicles: VehicleService
  tierLists: TierListService
  content: ContentService
}

export function createServiceContainer(options: { mode?: ServiceMode } = {}): ServiceContainer {
  const mode = options.mode || 'disabled'
  if (mode === 'db') {
    assertLocalDatabaseUrl(env.databaseUrl)
    const db = createDbClient(env.databaseUrl)
    return {
      mode,
      source: 'db',
      characters: new CharacterService(new DbCharacterRepository(db)),
      weapons: new WeaponService(new DbWeaponRepository(db)),
      cartridges: new CartridgeService(new DbCartridgeRepository(db)),
      modules: new ModuleService(new DbModuleRepository(db)),
      vehicles: new VehicleService(new DbVehicleRepository(db)),
      tierLists: new TierListService(new DbTierListRepository(db)),
      content: new ContentService(new DbContentRepository(db)),
    }
  }

  if (mode === 'mock' || mode === 'test') {
    return {
      mode,
      source: 'mock',
      characters: new CharacterService(new MockCharacterRepository(mockCharacters)),
      weapons: new WeaponService(new MockWeaponRepository(mockWeapons)),
      cartridges: new CartridgeService(new MockCartridgeRepository(mockCartridges)),
      modules: new ModuleService(new MockModuleRepository(mockModuleShapes, mockModulePieces)),
      vehicles: new VehicleService(new MockVehicleRepository(mockVehicles)),
      tierLists: new TierListService(new MockTierListRepository(mockTierLists)),
      content: new ContentService(new MockContentRepository(mockCodes, mockNews, mockGuides, mockCommunityLinks, mockApartmentItems)),
    }
  }

  return {
    mode,
    source: 'disabled',
    characters: new CharacterService(),
    weapons: new WeaponService(),
    cartridges: new CartridgeService(),
    modules: new ModuleService(),
    vehicles: new VehicleService(),
    tierLists: new TierListService(),
    content: new ContentService(),
  }
}
