import { isApiMode } from '../dataSource.js'
import { getAllVehicles } from '../vehiclesRepository.js'
import { getAllVehiclesFromApi } from '../api/vehiclesApiRepository.js'
import { mapApiVehicle } from './entityMappers.js'

export async function getVehicles(sourceData = []) {
  if (isApiMode()) {
    const rows = await getAllVehiclesFromApi({ query: { limit: 100 } })
    return rows.map(mapApiVehicle)
  }
  return getAllVehicles(sourceData)
}
