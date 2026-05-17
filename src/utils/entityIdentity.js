// Stable entity ids should remain the future SQL/API external keys.
// Slugs are route/display helpers and must not replace existing ids.
export function normalizeId(value) {
  return String(value ?? '').trim().toLowerCase()
}

export function slugifyEntityName(value) {
  return normalizeId(value)
    .replace(/['"]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function getEntitySlug(entity) {
  if (!entity || typeof entity !== 'object') return ''
  return String(entity.slug || entity.id || slugifyEntityName(entity.name || '')).trim()
}

export function matchesEntityIdOrSlug(entity, idOrSlug) {
  if (!entity || !idOrSlug) return false
  const needle = normalizeId(decodeURIComponent(String(idOrSlug)))
  const candidates = [
    entity.id,
    entity.slug,
    entity.sourceId,
    entity.assetKey,
    slugifyEntityName(entity.name || ''),
  ]
  return candidates.some((candidate) => normalizeId(candidate) === needle)
}

