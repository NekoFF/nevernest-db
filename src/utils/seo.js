const DEFAULT_TITLE = 'NTE Community Database'
const DEFAULT_DESCRIPTION = 'Unofficial Neverness to Everness community database for characters, weapons, modules, vehicles, builds, tier lists, codes, and news.'
const DEFAULT_SITE_URL = ''

function ensureMeta(name, attr = 'name') {
  let tag = document.head.querySelector(`meta[${attr}="${name}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(attr, name)
    document.head.appendChild(tag)
  }
  return tag
}

function ensureLink(rel) {
  let tag = document.head.querySelector(`link[rel="${rel}"]`)
  if (!tag) {
    tag = document.createElement('link')
    tag.setAttribute('rel', rel)
    document.head.appendChild(tag)
  }
  return tag
}

function absolutePath(path) {
  if (!path) return ''
  if (/^https?:\/\//i.test(path)) return path
  const normalized = path.startsWith('/') ? path : `/${path}`
  return DEFAULT_SITE_URL ? `${DEFAULT_SITE_URL}${normalized}` : normalized
}

export function setSeo({ title, description = DEFAULT_DESCRIPTION, canonicalPath, ogTitle, ogDescription, ogImage, twitterCard = 'summary' } = {}) {
  if (typeof document === 'undefined') return
  const fullTitle = title ? `${title} | ${DEFAULT_TITLE}` : DEFAULT_TITLE
  const canonical = absolutePath(canonicalPath || window.location.pathname || '/')
  document.title = fullTitle
  ensureMeta('description').setAttribute('content', description)
  ensureMeta('og:title', 'property').setAttribute('content', ogTitle || fullTitle)
  ensureMeta('og:description', 'property').setAttribute('content', ogDescription || description)
  ensureMeta('og:type', 'property').setAttribute('content', 'website')
  ensureMeta('og:site_name', 'property').setAttribute('content', DEFAULT_TITLE)
  ensureMeta('og:url', 'property').setAttribute('content', canonical)
  ensureMeta('twitter:card').setAttribute('content', twitterCard)
  ensureMeta('twitter:title').setAttribute('content', ogTitle || fullTitle)
  ensureMeta('twitter:description').setAttribute('content', ogDescription || description)
  ensureLink('canonical').setAttribute('href', canonical)
  if (ogImage) ensureMeta('og:image', 'property').setAttribute('content', ogImage)
  if (ogImage) ensureMeta('twitter:image').setAttribute('content', ogImage)
}

export const seoDefaults = {
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
}
