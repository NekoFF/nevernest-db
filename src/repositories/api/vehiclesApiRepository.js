import { getApiData } from '../../api/client.js'
import { expectArray, expectObject } from './normalizeApiData.js'

export async function getAllVehiclesFromApi(options = {}) {
  return expectArray(await getApiData('/api/vehicles', options), 'vehicles')
}

export async function getVehicleByIdOrSlugFromApi(idOrSlug, options = {}) {
  return expectObject(await getApiData(`/api/vehicles/${encodeURIComponent(idOrSlug)}`, options), 'vehicle detail')
}
