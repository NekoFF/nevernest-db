import { getApiData } from '../../api/client.js'
import { expectArray, expectObject } from './normalizeApiData.js'

export async function getAllCodesFromApi(options = {}) {
  return expectArray(await getApiData('/api/codes', options), 'codes')
}

export async function getAllNewsFromApi(options = {}) {
  return expectArray(await getApiData('/api/news', options), 'news')
}

export async function getNewsByIdOrSlugFromApi(idOrSlug, options = {}) {
  return expectObject(await getApiData(`/api/news/${encodeURIComponent(idOrSlug)}`, options), 'news detail')
}
