import { isApiMode } from '../dataSource.js'
import { getAllCharacters, getCharacterByIdOrSlug as getStaticCharacterByIdOrSlug } from '../charactersRepository.js'
import { getAllCharactersFromApi, getCharacterByIdOrSlugFromApi } from '../api/charactersApiRepository.js'
import { mapApiCharacter } from './entityMappers.js'

export async function getCharacters(sourceData = []) {
  if (isApiMode()) {
    const rows = await getAllCharactersFromApi({ query: { limit: 100 } })
    return rows.map(mapApiCharacter)
  }
  return getAllCharacters(sourceData)
}

export async function getCharacterByIdOrSlug(sourceData = [], idOrSlug) {
  if (isApiMode()) {
    return mapApiCharacter(await getCharacterByIdOrSlugFromApi(idOrSlug))
  }
  return getStaticCharacterByIdOrSlug(sourceData, idOrSlug)
}

export const getCharacterByIdOrSlugUnified = getCharacterByIdOrSlug
