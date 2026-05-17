import { matchesEntityIdOrSlug } from '../utils/entityIdentity.js'

export function getAllCartridges(sourceData = []) {
  return Array.isArray(sourceData) ? sourceData : []
}

export function getCartridgeByIdOrSlug(sourceData = [], idOrSlug) {
  return getAllCartridges(sourceData).find((cartridge) => matchesEntityIdOrSlug(cartridge, idOrSlug)) || null
}

