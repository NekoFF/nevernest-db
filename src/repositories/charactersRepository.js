import { getEntitySlug, matchesEntityIdOrSlug } from '../utils/entityIdentity.js'

export function getAllCharacters(sourceData = []) {
  return Array.isArray(sourceData) ? sourceData : []
}

export function getCharacterByIdOrSlug(sourceData = [], idOrSlug) {
  return getAllCharacters(sourceData).find((character) => matchesEntityIdOrSlug(character, idOrSlug)) || null
}

export function getCharacterRouteSlug(character) {
  return getEntitySlug(character)
}

