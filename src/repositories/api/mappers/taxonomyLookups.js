import { arcTypeTaxonomy, elementTaxonomy, rarityTaxonomy } from '../../../data/gameTaxonomy.js'
import { findStatByLabel, formatStatValue, getStatById } from '../../../data/stats.js'
import { slugifyEntityName } from '../../../utils/entityIdentity.js'

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

function normalize(value) {
  return String(value || '').trim().toLowerCase()
}

function isUuid(value) {
  return UUID_PATTERN.test(String(value || '').trim())
}

export function idOf(row) {
  return row?.externalId || row?.slug || row?.id || ''
}

export function findStaticEntity(rows, row) {
  const candidates = [
    row?.externalId,
    row?.slug,
    row?.raw?.id,
    row?.raw?.slug,
    row?.name ? slugifyEntityName(row.name) : '',
  ].map(normalize).filter(Boolean)

  return rows.find((item) => {
    const values = [item.id, item.slug, item.externalId, item.name ? slugifyEntityName(item.name) : ''].map(normalize)
    return candidates.some((candidate) => values.includes(candidate))
  }) || null
}

function resolveTaxonomyValue(value, taxonomy, fallback = 'Unknown') {
  if (!value || isUuid(value)) return fallback
  const text = String(value).trim()
  const direct = taxonomy.find((item) => normalize(item.id) === normalize(text) || normalize(item.label) === normalize(text) || normalize(item.shortLabel) === normalize(text))
  return direct?.id || text
}

export function resolveRarity(value) {
  return resolveTaxonomyValue(value, rarityTaxonomy)
}

export function displayValue(value) {
  if (!value) return ''
  if (typeof value === 'object') {
    return value.displayName || value.label || value.name || value.externalId || ''
  }
  return isUuid(value) ? '' : String(value).trim()
}

export function resolveElement(value) {
  return resolveTaxonomyValue(value, elementTaxonomy)
}

export function resolveArcType(value) {
  const resolved = resolveTaxonomyValue(value, arcTypeTaxonomy)
  if (resolved === 'Unknown') return resolved
  return arcTypeTaxonomy.find((item) => item.id === resolved)?.label || resolved
}

export function resolveStatName(value) {
  if (!value || isUuid(value)) return 'Unknown'
  const stat = getStatById(value) || findStatByLabel(value)
  return stat?.name || String(value).trim()
}

export function formatViewStat(statIdOrName, value) {
  if (value == null || value === '') return null
  const stat = getStatById(statIdOrName) || findStatByLabel(statIdOrName)
  return stat ? formatStatValue(stat.id, value) : String(value)
}

export function dateOnly(value) {
  if (!value) return ''
  return String(value).slice(0, 10)
}
