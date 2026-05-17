import { matchesEntityIdOrSlug } from '../utils/entityIdentity.js'

export function getAllWeapons(sourceData = []) {
  return Array.isArray(sourceData) ? sourceData : []
}

export function getWeaponByIdOrSlug(sourceData = [], idOrSlug) {
  return getAllWeapons(sourceData).find((weapon) => matchesEntityIdOrSlug(weapon, idOrSlug)) || null
}

