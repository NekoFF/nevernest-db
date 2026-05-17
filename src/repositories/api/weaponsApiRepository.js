import { getApiData } from '../../api/client.js'
import { expectArray, expectObject } from './normalizeApiData.js'

export async function getAllWeaponsFromApi(options = {}) {
  return expectArray(await getApiData('/api/weapons', options), 'weapons')
}

export async function getWeaponByIdOrSlugFromApi(idOrSlug, options = {}) {
  return expectObject(await getApiData(`/api/weapons/${encodeURIComponent(idOrSlug)}`, options), 'weapon detail')
}
