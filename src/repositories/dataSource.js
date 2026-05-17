import { DATA_SOURCE_MODES, normalizeDataSourceMode } from '../api/apiConfig.js'

export function getDataSourceMode() {
  return normalizeDataSourceMode()
}

export function isApiMode() {
  return getDataSourceMode() === DATA_SOURCE_MODES.API
}

export function isStaticMode() {
  return getDataSourceMode() === DATA_SOURCE_MODES.STATIC
}
