export const newsCategories = ['All', 'Official', 'Updates', 'Events', 'Banners', 'Videos', 'Community']

export const newsSortOptions = [
  { id: 'newest', label: 'Newest first' },
  { id: 'oldest', label: 'Oldest first' },
  { id: 'featured', label: 'Featured first' },
]

export const baseNews = [
  {
    id: 'nte-news-hub-ready',
    title: 'NTE Database News Hub Ready',
    description: 'A central place for official updates, banners, videos, events, and community notes as new information is added.',
    category: 'Community',
    date: '2026-05-15',
    sourceLabel: 'NTE Database',
    sourceUrl: '',
    imageUrl: '',
    featured: true,
    pinned: true,
  },
  {
    id: 'official-announcements-tracker',
    title: 'Official Announcements Tracker',
    description: 'Use Admin Mode to add verified official posts here with source links, thumbnails, and dates.',
    category: 'Official',
    date: '2026-05-15',
    sourceLabel: 'Manual tracker',
    sourceUrl: '',
    imageUrl: '',
    featured: false,
    pinned: false,
  },
  {
    id: 'video-preview-import-support',
    title: 'YouTube Preview Import Support',
    description: 'Paste a YouTube URL in Admin Mode to prepare a lightweight video news draft with an automatic thumbnail.',
    category: 'Videos',
    date: '2026-05-15',
    sourceLabel: 'NTE Database',
    sourceUrl: '',
    imageUrl: '',
    featured: false,
    pinned: false,
  },
]

const VALID_CATEGORIES = new Set(newsCategories.filter((category) => category !== 'All'))

export function getYoutubeVideoId(url = '') {
  try {
    const parsed = new URL(String(url).trim())
    const host = parsed.hostname.replace(/^www\./, '')
    if (host === 'youtu.be') return parsed.pathname.split('/').filter(Boolean)[0] || ''
    if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'music.youtube.com') {
      if (parsed.pathname.startsWith('/shorts/') || parsed.pathname.startsWith('/embed/')) {
        return parsed.pathname.split('/').filter(Boolean)[1] || ''
      }
      return parsed.searchParams.get('v') || ''
    }
  } catch {
    return ''
  }
  return ''
}

export function youtubeThumbnailFromUrl(url = '') {
  const videoId = getYoutubeVideoId(url)
  return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : ''
}

export function prepareNewsDraftFromUrl(url = '') {
  const sourceUrl = String(url || '').trim()
  const youtubeThumbnail = youtubeThumbnailFromUrl(sourceUrl)

  // Future importers should call backend/serverless endpoints for YouTube RSS,
  // official site RSS, Twitter/X API, and Discord webhook/manual announcement
  // intake. This frontend helper intentionally avoids scraping/CORS metadata.
  return {
    sourceUrl,
    sourceLabel: youtubeThumbnail ? 'YouTube' : '',
    category: youtubeThumbnail ? 'Videos' : 'Community',
    imageUrl: youtubeThumbnail,
    title: youtubeThumbnail ? 'YouTube video' : '',
    description: '',
    date: new Date().toISOString().slice(0, 10),
    featured: false,
    pinned: false,
  }
}

function slugify(value = '') {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function normalizeNewsEntry(entry = {}, index = 0) {
  const title = String(entry.title || '').trim()
  const category = VALID_CATEGORIES.has(entry.category) ? entry.category : 'Community'
  const sourceUrl = String(entry.sourceUrl || '').trim()
  const imageUrl = String(entry.imageUrl || youtubeThumbnailFromUrl(sourceUrl) || '').trim()
  const id = slugify(entry.id || title || `news-${index + 1}`) || `news-${index + 1}`

  return {
    id,
    title: title || 'Untitled news',
    description: String(entry.description || '').trim(),
    category,
    date: String(entry.date || '').trim(),
    sourceLabel: String(entry.sourceLabel || '').trim(),
    sourceUrl,
    imageUrl,
    featured: Boolean(entry.featured),
    pinned: Boolean(entry.pinned),
  }
}

export function mergeNewsWithOverrides(base = baseNews, overrides = {}) {
  const deleted = new Set(overrides?.deleted || [])
  const edited = overrides?.entries && typeof overrides.entries === 'object' ? overrides.entries : {}
  const created = Array.isArray(overrides?.created) ? overrides.created : []
  const mergedBase = base
    .filter((entry) => !deleted.has(entry.id))
    .map((entry, index) => normalizeNewsEntry({ ...entry, ...(edited[entry.id] || {}) }, index))
  const normalizedCreated = created.map((entry, index) => normalizeNewsEntry(entry, mergedBase.length + index))
  return [...mergedBase, ...normalizedCreated]
}

export function newsSearchText(entry) {
  return [
    entry.title,
    entry.description,
    entry.category,
    entry.date,
    entry.sourceLabel,
    entry.sourceUrl,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
}
