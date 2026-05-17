import { isApiMode } from '../dataSource.js'
import { getAllCodes } from '../codesRepository.js'
import { getAllNews, getNewsByIdOrSlug as getStaticNewsByIdOrSlug } from '../newsRepository.js'
import { getAllCodesFromApi, getAllNewsFromApi, getNewsByIdOrSlugFromApi } from '../api/contentApiRepository.js'
import { mapApiCode, mapApiNews } from './entityMappers.js'

export async function getCodes(sourceData = []) {
  if (isApiMode()) {
    const rows = await getAllCodesFromApi({ query: { limit: 100 } })
    return rows.map(mapApiCode)
  }
  return getAllCodes(sourceData)
}

export async function getNews(sourceData = []) {
  if (isApiMode()) {
    const rows = await getAllNewsFromApi({ query: { limit: 100 } })
    return rows.map(mapApiNews)
  }
  return getAllNews(sourceData)
}

export async function getNewsByIdOrSlug(sourceData = [], idOrSlug) {
  if (isApiMode()) {
    return mapApiNews(await getNewsByIdOrSlugFromApi(idOrSlug))
  }
  return getStaticNewsByIdOrSlug(sourceData, idOrSlug)
}

export const getNewsByIdOrSlugUnified = getNewsByIdOrSlug
