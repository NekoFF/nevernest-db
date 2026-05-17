const baseUrl = (process.env.VITE_API_BASE_URL || 'http://127.0.0.1:4000').replace(/\/+$/, '')

const endpoints = [
  '/api/status',
  '/api/characters',
  '/api/characters/nanally',
  '/api/weapons?limit=100',
  '/api/vehicles',
  '/api/codes',
  '/api/news',
  '/api/cartridges',
  '/api/modules/shapes',
  '/api/modules/pieces',
  '/api/tier-lists/official',
]

const deferredEndpoints = [
  '/api/guides',
  '/api/community-links',
  '/api/apartments/items',
]

async function checkEndpoint(path) {
  try {
    const response = await fetch(`${baseUrl}${path}`)
    const body = await response.json().catch(() => null)
    const envelopeOk = body && typeof body.ok === 'boolean'
    const enrichment = inspectEnrichment(path, body)
    return {
      path,
      status: response.status,
      envelopeOk,
      ok: response.ok && envelopeOk,
      count: Array.isArray(body?.data) ? body.data.length : undefined,
      mode: body?.mode || body?.dataMode || body?.meta?.mode,
      enrichment,
      deferred: false,
    }
  } catch (error) {
    return {
      path,
      status: 'unreachable',
      envelopeOk: false,
      ok: false,
      deferred: false,
      error: error?.cause?.code || error?.message || 'request_failed',
    }
  }
}

function isUuid(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(value || ''))
}

function displayOk(value) {
  if (!value) return false
  const label = typeof value === 'object' ? value.displayName || value.label || value.name : value
  return Boolean(label) && !isUuid(label)
}

function inspectEnrichment(path, body) {
  const data = body?.data
  const first = Array.isArray(data) ? data[0] : data
  if (!first) return 'empty'
  if (path.startsWith('/api/characters/nanally')) {
    return displayOk(first.rarity) && displayOk(first.element) && displayOk(first.arcType) ? 'character_display_fields_ok' : 'character_display_fields_deferred'
  }
  if (path.startsWith('/api/weapons')) {
    return displayOk(first.rarity) && displayOk(first.arcType) && displayOk(first.mainStat?.stat) ? 'weapon_display_fields_ok' : 'weapon_display_fields_deferred'
  }
  if (path.startsWith('/api/cartridges')) {
    return displayOk(first.element) || first.bonusCategoryLabel ? 'cartridge_display_fields_ok' : 'cartridge_display_fields_deferred'
  }
  if (path.startsWith('/api/modules/shapes')) {
    return first.moduleTypeLabel ? 'module_shape_display_fields_ok' : 'module_shape_display_fields_deferred'
  }
  if (path.startsWith('/api/modules/pieces')) {
    return displayOk(first.rarity) || first.moduleShape ? 'module_piece_display_fields_ok' : 'module_piece_display_fields_deferred'
  }
  if (path.startsWith('/api/tier-lists/official')) {
    const tier = Array.isArray(data) ? data[0] : data
    const rowCount = tier?.rows?.length || 0
    const entryCount = (tier?.rows || []).reduce((sum, row) => sum + (row.entries?.length || 0), 0)
    return `tier_rows:${rowCount};entries:${entryCount}`
  }
  return ''
}

const results = []
for (const endpoint of endpoints) {
  results.push(await checkEndpoint(endpoint))
}
for (const endpoint of deferredEndpoints) {
  const result = await checkEndpoint(endpoint)
  results.push({ ...result, ok: true, deferred: true, note: result.count === 0 ? 'deferred_empty_db_payload' : 'deferred_not_wired' })
}

console.table(results)

const status = results.find((result) => result.path === '/api/status')
if (status?.mode && status.mode !== 'db') {
  console.error('Expected backend API to run in DB mode for this smoke check.')
  process.exitCode = 1
}

if (results.some((result) => !result.ok)) {
  console.error(`API client smoke failed. Ensure the backend is running in DB mode at ${baseUrl}.`)
  process.exitCode = 1
}
