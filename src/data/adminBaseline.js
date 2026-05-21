import { adminBaselineExport } from './adminBaselineExport.js'

const PLACEHOLDER_PATTERNS = [
  /^$/,
  /^-+$/,
  /^tbd\b/i,
  /^todo\b/i,
  /^unknown$/i,
  /^source unknown$/i,
  /^source pending$/i,
  /^needs manual cleanup$/i,
  /^raw pdf table row$/i,
  /^generated\/pdf-extract$/i,
]

const PUBLIC_DEBUG_PATTERNS = [
  /source unknown/i,
  /source[- ]pending/i,
  /raw source/i,
  /rawSourceText/i,
  /PDF extraction/i,
  /retained in rawSourceText/i,
  /manual cleanup/i,
  /Raw PDF table row/i,
  /generated\/pdf-extract/i,
  /source-pending structured data/i,
  /needs manual cleanup/i,
  /needs verification/i,
]

function isPlainObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function isWeakString(value) {
  const text = String(value || '').trim()
  return PLACEHOLDER_PATTERNS.some((pattern) => pattern.test(text))
}

function isEmptyObject(value) {
  return isPlainObject(value) && Object.keys(value).length === 0
}

function shouldKeepExisting(incoming, existing) {
  if (incoming === null || incoming === undefined) return true
  if (typeof incoming === 'string' && isWeakString(incoming) && existing) return true
  if (Array.isArray(incoming) && incoming.length === 0 && Array.isArray(existing) && existing.length > 0) return true
  if (isEmptyObject(incoming) && isPlainObject(existing) && Object.keys(existing).length > 0) return true
  return false
}

export function mergeApprovedBaseline(existing, incoming) {
  if (shouldKeepExisting(incoming, existing)) return existing

  if (Array.isArray(incoming)) {
    return incoming.map((item, index) => mergeApprovedBaseline(Array.isArray(existing) ? existing[index] : undefined, item))
  }

  if (isPlainObject(incoming)) {
    const base = isPlainObject(existing) ? { ...existing } : {}
    Object.entries(incoming).forEach(([key, value]) => {
      base[key] = mergeApprovedBaseline(base[key], value)
    })
    return base
  }

  return incoming
}

function hasPublicDebugText(value) {
  return PUBLIC_DEBUG_PATTERNS.some((pattern) => pattern.test(String(value || '')))
}

export function stripPublicDebugText(value) {
  if (typeof value === 'string') return hasPublicDebugText(value) ? '' : value
  if (Array.isArray(value)) {
    return value
      .map(stripPublicDebugText)
      .filter((item) => {
        if (item === '') return false
        if (Array.isArray(item)) return item.length > 0
        if (isPlainObject(item)) return Object.keys(item).length > 0
        return true
      })
  }
  if (!isPlainObject(value)) return value

  return Object.entries(value).reduce((acc, [key, item]) => {
    if (key === 'rawSourceText' || key === 'extractedTextPath' || key === 'sourceNotes' || key === 'importNotes') return acc
    const cleaned = stripPublicDebugText(item)
    if (cleaned === '') return acc
    if (Array.isArray(cleaned) && cleaned.length === 0) return acc
    if (isPlainObject(cleaned) && Object.keys(cleaned).length === 0) return acc
    acc[key] = cleaned
    return acc
  }, {})
}

export const adminBaselineCharacters = adminBaselineExport.characters?.entries || {}
export const adminBaselineCartridges = adminBaselineExport.cartridges || {}

export const adminBaselineStats = {
  sourceFile: 'nte-admin-data-2026-05-21.json5',
  characterCount: Object.keys(adminBaselineCharacters).length,
  cartridgeCount: Object.keys(adminBaselineCartridges).length,
  consoleLayoutCount: Object.values(adminBaselineCharacters).filter((character) => character?.console?.grid).length,
}
