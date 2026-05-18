export function normalizeSearchText(value = '') {
  return String(value || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

export function tokenizeSearchQuery(query = '') {
  return normalizeSearchText(query).split(/\s+/).filter(Boolean)
}

export function scoreSearchItem(item, query) {
  const tokens = tokenizeSearchQuery(query)
  if (!tokens.length) return 0

  const name = normalizeSearchText(item.name)
  const id = normalizeSearchText(item.id)
  const category = normalizeSearchText(item.categoryLabel || item.category)
  const meta = normalizeSearchText(item.meta)
  const haystack = normalizeSearchText([item.searchText, item.name, item.id, item.categoryLabel, item.category, item.meta].filter(Boolean).join(' '))

  let score = 0
  for (const token of tokens) {
    if (!haystack.includes(token)) return 0
    if (name === token || id === token) score += 120
    else if (name.startsWith(token) || id.startsWith(token)) score += 80
    else if (name.includes(token)) score += 55
    else if (category.includes(token)) score += 34
    else if (meta.includes(token)) score += 24
    else score += 12
  }

  score += Math.max(0, 30 - name.length / 3)
  if (item.priority) score += item.priority
  return score
}

export function searchItems(items = [], query = '', limit = 24) {
  return (items || [])
    .map((item) => ({ ...item, score: scoreSearchItem(item, query) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || String(a.name || '').localeCompare(String(b.name || '')))
    .slice(0, limit)
}
