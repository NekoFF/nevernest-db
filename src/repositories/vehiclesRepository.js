import { matchesEntityIdOrSlug } from '../utils/entityIdentity.js'

export function getAllVehicles(sourceData = []) {
  return Array.isArray(sourceData) ? sourceData : []
}

export function getVehicleByIdOrSlug(sourceData = [], idOrSlug) {
  return getAllVehicles(sourceData).find((vehicle) => matchesEntityIdOrSlug(vehicle, idOrSlug)) || null
}

