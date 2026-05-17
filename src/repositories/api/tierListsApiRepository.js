import { getApiData } from '../../api/client.js'
import { expectArray, expectObject } from './normalizeApiData.js'

export async function getOfficialTierListFromApi(options = {}) {
  const data = await getApiData('/api/tier-lists/official', options)
  if (Array.isArray(data)) return expectObject(expectArray(data, 'official tier list')[0] || null, 'official tier list')
  return expectObject(data, 'official tier list')
}
