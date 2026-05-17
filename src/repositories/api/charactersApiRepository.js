import { getApiData } from '../../api/client.js'
import { expectArray, expectObject } from './normalizeApiData.js'

export async function getAllCharactersFromApi(options = {}) {
  return expectArray(await getApiData('/api/characters', options), 'characters')
}

export async function getCharacterByIdOrSlugFromApi(idOrSlug, options = {}) {
  return expectObject(await getApiData(`/api/characters/${encodeURIComponent(idOrSlug)}`, options), 'character detail')
}
