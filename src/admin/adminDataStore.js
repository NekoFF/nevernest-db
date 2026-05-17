import { characters as baseCharacters } from '../data/characters.js'
import { weapons as baseWeapons } from '../data/weapons.js'
import { baseCartridgeSets, mergeCartridgeSetsWithOverrides } from '../data/cartridges.js'
import { MODULE_SHAPES as baseModuleShapes } from '../data/moduleCatalog.js'
import { vehicles as baseVehicles } from '../data/vehicles.js'
import {
  createCartridgeOverride,
  createCharacterOverride,
  createModuleShapeOverride,
  createNewsOverride,
  createCodeOverride,
  createVehicleOverride,
  createWeaponOverride,
  deleteCartridgeOverride,
  deleteCharacterOverride,
  deleteCodeOverride,
  deleteModuleShapeOverride,
  deleteNewsOverride,
  deleteVehicleOverride,
  deleteWeaponOverride,
  exportAdminData,
  exportCartridgeAdminData,
  getAdminStorageStatus,
  getCartridgeOverrides,
  getCharacterOverrides,
  getModuleShapeOverrides,
  getVehicleOverrides,
  getWeaponOverrides,
  importAdminData,
  mergeCharactersWithOverrides,
  mergeItemsWithOverrides,
  resetAdminData,
  saveCartridgeOverride,
  saveCharacterOverride,
  saveModuleShapeOverride,
  saveNewsOverride,
  saveCodeOverride,
  saveVehicleOverride,
  saveWeaponOverride,
} from './adminStorage.js'

export function loadAdminData() {
  return exportAdminData()
}

export function loadAdminOverrides() {
  return {
    status: getAdminStorageStatus(),
    characters: getCharacterOverrides(),
    weapons: getWeaponOverrides(),
    cartridges: getCartridgeOverrides(),
    moduleShapes: getModuleShapeOverrides(),
    vehicles: getVehicleOverrides(),
  }
}

export function saveAdminData(payload, options) {
  return importAdminData(payload, options)
}

const saveByEntityType = {
  characters: saveCharacterOverride,
  weapons: saveWeaponOverride,
  cartridges: saveCartridgeOverride,
  moduleShapes: saveModuleShapeOverride,
  vehicles: saveVehicleOverride,
  news: saveNewsOverride,
  codes: saveCodeOverride,
}

const createByEntityType = {
  characters: createCharacterOverride,
  weapons: createWeaponOverride,
  cartridges: createCartridgeOverride,
  moduleShapes: createModuleShapeOverride,
  vehicles: createVehicleOverride,
  news: createNewsOverride,
  codes: createCodeOverride,
}

const deleteByEntityType = {
  characters: deleteCharacterOverride,
  weapons: deleteWeaponOverride,
  cartridges: deleteCartridgeOverride,
  moduleShapes: deleteModuleShapeOverride,
  vehicles: deleteVehicleOverride,
  news: deleteNewsOverride,
  codes: deleteCodeOverride,
}

export function saveAdminOverride(entityType, id, patchOrFullEntity) {
  const save = saveByEntityType[entityType]
  if (!save) throw new Error(`Unsupported admin entity type: ${entityType}`)
  return save(id, patchOrFullEntity)
}

export function createAdminEntity(entityType, entity) {
  const create = createByEntityType[entityType]
  if (!create) throw new Error(`Unsupported admin entity type: ${entityType}`)
  return create(entity)
}

export function deleteAdminEntity(entityType, id) {
  const deleteEntity = deleteByEntityType[entityType]
  if (!deleteEntity) throw new Error(`Unsupported admin entity type: ${entityType}`)
  return deleteEntity(id)
}

export function getMergedCharacters() {
  return mergeCharactersWithOverrides(baseCharacters, getCharacterOverrides())
}

export function getMergedWeapons() {
  return mergeItemsWithOverrides(baseWeapons, getWeaponOverrides())
}

export function getMergedModules() {
  return mergeCartridgeSetsWithOverrides(baseCartridgeSets, getCartridgeOverrides())
}

export function getMergedCartridges() {
  return getMergedModules()
}

export function getMergedModuleShapes() {
  return mergeItemsWithOverrides(baseModuleShapes, getModuleShapeOverrides())
}

export function getMergedVehicles() {
  return mergeItemsWithOverrides(baseVehicles, getVehicleOverrides())
}

export {
  clearCartridgeOverride,
  clearCharacterOverride,
  clearOfficialTierListOverride,
  createCartridgeOverride,
  createCharacterOverride,
  createModuleShapeOverride,
  createCodeOverride,
  createNewsOverride,
  createVehicleOverride,
  createWeaponOverride,
  deleteCartridgeOverride,
  deleteCharacterOverride,
  deleteModuleShapeOverride,
  deleteCodeOverride,
  deleteNewsOverride,
  deleteVehicleOverride,
  deleteWeaponOverride,
  exportAdminData,
  exportCartridgeAdminData,
  getAdminStorageStatus,
  getCartridgeOverrides,
  getCharacterOverrides,
  getModuleShapeOverrides,
  getCodeOverrides,
  getNewsOverrides,
  getOfficialTierListOverride,
  getVehicleOverrides,
  getWeaponOverrides,
  importAdminData,
  mergeCharactersWithOverrides,
  mergeItemsWithOverrides,
  readAdminMode,
  resetAdminData,
  saveCartridgeOverride,
  saveCharacterOverride,
  saveModuleShapeOverride,
  saveCodeOverride,
  saveNewsOverride,
  saveOfficialTierListOverride,
  saveVehicleOverride,
  saveWeaponOverride,
  uniqueAdminId,
  writeAdminMode,
} from './adminStorage.js'
