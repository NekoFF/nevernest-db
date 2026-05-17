import { isApiMode } from '../dataSource.js'
import { getAllWeapons, getWeaponByIdOrSlug as getStaticWeaponByIdOrSlug } from '../weaponsRepository.js'
import { getAllWeaponsFromApi, getWeaponByIdOrSlugFromApi } from '../api/weaponsApiRepository.js'
import { mapApiWeapon } from './entityMappers.js'

export async function getWeapons(sourceData = []) {
  if (isApiMode()) {
    const rows = await getAllWeaponsFromApi({ query: { limit: 100 } })
    return rows.map(mapApiWeapon)
  }
  return getAllWeapons(sourceData)
}

export async function getWeaponByIdOrSlug(sourceData = [], idOrSlug) {
  if (isApiMode()) {
    return mapApiWeapon(await getWeaponByIdOrSlugFromApi(idOrSlug))
  }
  return getStaticWeaponByIdOrSlug(sourceData, idOrSlug)
}

export const getWeaponByIdOrSlugUnified = getWeaponByIdOrSlug
