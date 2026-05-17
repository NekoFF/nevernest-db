export const DATA_SOURCE_MODES = Object.freeze({
  STATIC: 'static',
  API: 'api',
})

const DEFAULT_API_BASE_URL = 'http://127.0.0.1:4000'

function readViteEnv(key) {
  return import.meta.env?.[key] ?? globalThis.process?.env?.[key]
}

export function normalizeDataSourceMode(value = readViteEnv('VITE_DATA_SOURCE')) {
  const mode = String(value || DATA_SOURCE_MODES.STATIC).trim().toLowerCase()
  return mode === DATA_SOURCE_MODES.API ? DATA_SOURCE_MODES.API : DATA_SOURCE_MODES.STATIC
}

export function getApiBaseUrl() {
  return String(readViteEnv('VITE_API_BASE_URL') || DEFAULT_API_BASE_URL).replace(/\/+$/, '')
}

export function getApiConfig() {
  return {
    baseUrl: getApiBaseUrl(),
    dataSource: normalizeDataSourceMode(),
  }
}
