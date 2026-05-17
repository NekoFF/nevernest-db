import { matchesEntityIdOrSlug } from '../utils/entityIdentity.js'

export function getAllNews(sourceData = []) {
  return Array.isArray(sourceData) ? sourceData : []
}

export function getNewsByIdOrSlug(sourceData = [], idOrSlug) {
  return getAllNews(sourceData).find((entry) => matchesEntityIdOrSlug(entry, idOrSlug)) || null
}

