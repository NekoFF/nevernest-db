import { getApiData } from '../../api/client.js'
import { expectArray, expectObject } from './normalizeApiData.js'

export async function getAllCartridgesFromApi(options = {}) {
  return expectArray(await getApiData('/api/cartridges', options), 'cartridges')
}

export async function getCartridgeByIdOrSlugFromApi(idOrSlug, options = {}) {
  return expectObject(await getApiData(`/api/cartridges/${encodeURIComponent(idOrSlug)}`, options), 'cartridge detail')
}
