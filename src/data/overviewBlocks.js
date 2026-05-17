const DEFAULT_OVERVIEW_BLOCKS = [
  {
    id: 'at-a-glance',
    type: 'text',
    title: 'At a glance',
    enabled: true,
    content: 'Data coming soon',
  },
  {
    id: 'strengths',
    type: 'list',
    title: 'Strengths',
    enabled: true,
    items: ['Data coming soon'],
  },
  {
    id: 'tradeoffs',
    type: 'list',
    title: 'Tradeoffs',
    enabled: true,
    items: ['Data coming soon'],
  },
  {
    id: 'recommended-playstyle',
    type: 'text',
    title: 'Recommended playstyle',
    enabled: true,
    content: 'Data coming soon',
  },
]

export const OVERVIEW_BLOCK_TYPES = [
  'text',
  'list',
  'meta',
  'heroSummary',
  'profileGrid',
  'voiceActors',
  'bannerHistory',
  'gameplaySummary',
  'gameplayIdentity',
  'prosCons',
  'triviaList',
  'loreList',
  'itemCards',
  'quoteCards',
  'quoteList',
  'keyValueGrid',
  'languageTable',
  'loreCards',
  'compactBannerHistory',
]

export const OVERVIEW_BLOCK_SIZES = ['full', 'half', 'third', 'twoThird', 'compact']
export const OVERVIEW_LAYOUT_STYLES = [
  'default',
  'fullWidth',
  'halfWidth',
  'twoColumnItems',
  'cardGrid',
  'quoteGrid',
  'keyValueGrid',
  'heroSummary',
  'materialSection',
  'teamRow',
]

export const OVERVIEW_LIST_TYPES = new Set([
  'list',
  'triviaList',
  'loreList',
  'itemCards',
  'quoteCards',
  'quoteList',
  'loreCards',
  'compactBannerHistory',
  'bannerHistory',
])
export const OVERVIEW_META_TYPES = new Set(['meta', 'profileGrid', 'voiceActors', 'keyValueGrid', 'languageTable'])
export const OVERVIEW_TEXT_TYPES = new Set(['text', 'heroSummary', 'gameplaySummary', 'gameplayIdentity'])

const TYPE_ALIASES = {
  bannerHistory: 'compactBannerHistory',
  gameplayIdentity: 'gameplaySummary',
  triviaList: 'list',
  loreList: 'list',
  itemCards: 'loreCards',
  quoteCards: 'quoteList',
}

function normalizeType(type) {
  const rawType = String(type || '')
  if (OVERVIEW_BLOCK_TYPES.includes(rawType)) return TYPE_ALIASES[rawType] || rawType
  return 'text'
}

function blockOptions(block) {
  return {
    size: OVERVIEW_BLOCK_SIZES.includes(block?.size) ? block.size : '',
    icon: String(block?.icon || ''),
    accentColor: String(block?.accentColor || block?.accent || ''),
    accent: String(block?.accent || block?.accentColor || ''),
    layout: String(block?.layout || block?.layoutStyle || block?.style || ''),
    style: String(block?.style || block?.layout || block?.layoutStyle || ''),
  }
}

function textBlock(id, title, content) {
  return {
    id,
    type: 'text',
    title,
    enabled: true,
    content: typeof content === 'string' ? content : '',
  }
}

function listBlock(id, title, items) {
  return {
    id,
    type: 'list',
    title,
    enabled: true,
    items: Array.isArray(items) ? items.filter((item) => typeof item === 'string' && item.trim()) : [],
  }
}

function metaBlock(id, title, rows) {
  return {
    id,
    type: 'meta',
    title,
    enabled: true,
    rows: Array.isArray(rows) ? rows.filter((row) => row?.label && row?.value) : [],
  }
}

function normalizeBlock(block, index) {
  const type = normalizeType(block?.type)
  const fallback = DEFAULT_OVERVIEW_BLOCKS[index]
  const id = String(block?.id || fallback?.id || `${type}-${index + 1}`)
  const title = String(block?.title || fallback?.title || 'Overview block')
  const enabled = block?.enabled !== false
  const options = blockOptions(block)

  if (OVERVIEW_LIST_TYPES.has(type)) {
    return {
      id,
      type,
      title,
      enabled,
      ...options,
      items: Array.isArray(block.items) ? block.items.map((item) => String(item)) : [],
    }
  }

  if (OVERVIEW_META_TYPES.has(type)) {
    return {
      id,
      type,
      title,
      enabled,
      ...options,
      rows: Array.isArray(block.rows)
        ? block.rows.map((row) => ({
            label: String(row?.label || ''),
            value: String(row?.value || ''),
          }))
        : [],
    }
  }

  return {
    id,
    type,
    title,
    enabled,
    ...options,
    content: String(block?.content || ''),
  }
}

export function createDefaultOverviewBlocks() {
  return DEFAULT_OVERVIEW_BLOCKS.map((block) => ({ ...block, items: block.items ? [...block.items] : undefined }))
}

export function normalizeOverviewBlocks(overview) {
  if (!overview || typeof overview !== 'object') return []

  if (Array.isArray(overview.blocks)) {
    return overview.blocks.map(normalizeBlock)
  }

  const strengths = overview.strengths || overview.pros
  const tradeoffs = overview.tradeoffs || overview.cons
  const playstyle = overview.recommendedPlaystyle || overview.playstyle
  const glance = overview.tagline || overview.introduction || overview.roleSummary || ''
  const blocks = []

  if (glance) blocks.push(textBlock('at-a-glance', 'At a glance', glance))
  if (Array.isArray(strengths) && strengths.length) blocks.push(listBlock('strengths', 'Strengths', strengths))
  if (Array.isArray(tradeoffs) && tradeoffs.length) blocks.push(listBlock('tradeoffs', 'Tradeoffs', tradeoffs))
  if (playstyle) blocks.push(textBlock('recommended-playstyle', 'Recommended playstyle', playstyle))
  if (Array.isArray(overview.quickNotes) && overview.quickNotes.length) blocks.push(listBlock('quick-notes', 'Quick notes', overview.quickNotes))
  if (Array.isArray(overview.rotation) && overview.rotation.length) blocks.push(listBlock('rotation', 'Rotation', overview.rotation))
  if (overview.review) blocks.push(textBlock('review', 'Review', overview.review))
  if (overview.updateTracker && typeof overview.updateTracker === 'object') {
    blocks.push(
      metaBlock(
        'update-tracker',
        'Update Tracker',
        [
          ['Last Review Update', overview.updateTracker.lastReviewUpdate],
          ['Last Major Build Update', overview.updateTracker.lastMajorBuildUpdate],
          ['Last Profile Update', overview.updateTracker.lastProfileUpdate],
        ].map(([label, value]) => ({ label, value })),
      ),
    )
  }

  return blocks
}

export function normalizeOverview(overview) {
  const blocks = normalizeOverviewBlocks(overview)
  return { blocks }
}

export function hasRenderableOverviewBlocks(overview) {
  return normalizeOverviewBlocks(overview).some((block) => {
    if (block.enabled === false) return false
    if (OVERVIEW_LIST_TYPES.has(block.type)) return block.items.some((item) => item.trim())
    if (OVERVIEW_META_TYPES.has(block.type)) return block.rows.some((row) => row.label.trim() || row.value.trim())
    return block.content.trim()
  })
}
