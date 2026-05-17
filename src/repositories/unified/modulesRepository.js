import { getModulePieceByShapeAndRarity, getModuleShapeOptions } from '../../data/modulePieces.js'
import { isApiMode } from '../dataSource.js'
import { getAllCartridges, getCartridgeByIdOrSlug as getStaticCartridgeByIdOrSlug } from '../cartridgesRepository.js'
import { getAllCartridgesFromApi, getCartridgeByIdOrSlugFromApi } from '../api/cartridgesApiRepository.js'
import { getAllModulePiecesFromApi, getAllModuleShapesFromApi } from '../api/modulesApiRepository.js'
import {
  mapApiCartridgeToViewModel,
  mapApiModulePieceToViewModel,
  mapApiModuleShapeToViewModel,
} from '../api/mappers/index.js'

export async function getCartridges(sourceData = []) {
  if (isApiMode()) {
    const rows = await getAllCartridgesFromApi({ query: { limit: 100 } })
    return rows.map(mapApiCartridgeToViewModel)
  }
  return getAllCartridges(sourceData)
}

export async function getCartridgeByIdOrSlug(sourceData = [], idOrSlug) {
  if (isApiMode()) {
    return mapApiCartridgeToViewModel(await getCartridgeByIdOrSlugFromApi(idOrSlug))
  }
  return getStaticCartridgeByIdOrSlug(sourceData, idOrSlug)
}

export async function getModuleShapes() {
  if (isApiMode()) {
    const rows = await getAllModuleShapesFromApi({ query: { limit: 100 } })
    return rows.map(mapApiModuleShapeToViewModel)
  }
  return getModuleShapeOptions()
}

export async function getModulePieces() {
  if (isApiMode()) {
    const rows = await getAllModulePiecesFromApi({ query: { limit: 100 } })
    return rows.map(mapApiModulePieceToViewModel)
  }
  return []
}

export function getModulePieceForShapeAndRarity(modulePieces, shapeId, rarity = 'S') {
  if (isApiMode()) {
    const rank = String(rarity || 'S').toUpperCase()
    return modulePieces.find((piece) => piece.shapeId === shapeId && piece.rarity === rank)
      || getModulePieceByShapeAndRarity(shapeId, rank)
      || null
  }
  return getModulePieceByShapeAndRarity(shapeId, rarity)
}
