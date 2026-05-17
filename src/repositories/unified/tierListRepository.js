import { isApiMode } from '../dataSource.js'
import { getTierList as getStaticTierList } from '../tierListRepository.js'
import { getOfficialTierListFromApi } from '../api/tierListsApiRepository.js'
import { mapApiOfficialTierListToViewModel } from '../api/mappers/index.js'

export async function getOfficialTierList(sourceData, fallback) {
  if (isApiMode()) {
    return mapApiOfficialTierListToViewModel(await getOfficialTierListFromApi())
  }
  return getStaticTierList(sourceData, fallback)
}
