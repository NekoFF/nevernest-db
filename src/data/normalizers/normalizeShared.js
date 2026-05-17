import { getEntitySlug, slugifyEntityName } from '../../utils/entityIdentity.js'

export function cloneRaw(value) {
  if (!value || typeof value !== 'object') return value
  return Array.isArray(value) ? value.map(cloneRaw) : { ...value }
}

export function stringOrEmpty(value) {
  return String(value ?? '').trim()
}

export function arrayOfStrings(value) {
  return Array.isArray(value) ? value.map((item) => stringOrEmpty(item)).filter(Boolean) : []
}

export function entityBase(entity, fallback = 'entity') {
  const name = stringOrEmpty(entity?.name || fallback)
  const id = stringOrEmpty(entity?.id || slugifyEntityName(name || fallback))
  return {
    id,
    slug: stringOrEmpty(getEntitySlug(entity)) || id,
    name,
  }
}

