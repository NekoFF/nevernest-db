import { getApiData } from '../../api/client.js'
import { expectArray } from './normalizeApiData.js'

export async function getAllModuleShapesFromApi(options = {}) {
  return expectArray(await getApiData('/api/modules/shapes', options), 'module shapes')
}

export async function getAllModulePiecesFromApi(options = {}) {
  return expectArray(await getApiData('/api/modules/pieces', options), 'module pieces')
}
