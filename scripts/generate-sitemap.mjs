import fs from 'node:fs'
import path from 'node:path'
import { characters } from '../src/data/characters.js'
import { weapons } from '../src/data/weapons.js'
import { baseCartridgeSets } from '../src/data/cartridges.js'
import { modulePieces } from '../src/data/modulePieces.js'

const previewMode = process.env.SITEMAP_PREVIEW === '1' || process.argv.includes('--preview')
const siteUrl = (process.env.SITE_URL || (previewMode ? 'http://localhost:5173' : '')).trim().replace(/\/+$/, '')

if (!siteUrl) {
  console.error('SITE_URL is required to generate public/sitemap.xml.')
  console.error('Example: SITE_URL="https://example.com" npm run sitemap:generate')
  console.error('For a non-production preview, run npm run sitemap:preview.')
  process.exit(1)
}

if (!previewMode && !/^https:\/\/[^/]+/i.test(siteUrl)) {
  console.error('SITE_URL must be an HTTPS origin, for example https://example.com.')
  process.exit(1)
}

function routeSlug(item) {
  return encodeURIComponent(item.slug || item.id)
}

function escapeXml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

const staticRoutes = [
  '/',
  '/characters',
  '/weapons',
  '/modules',
  '/vehicles',
  '/tier-list',
  '/codes',
  '/news',
  '/guides',
  '/build-planner',
  '/about',
  '/disclaimer',
  '/privacy',
  '/contact',
]

const detailRoutes = [
  ...characters.map((character) => `/characters/${routeSlug(character)}`),
  ...weapons.map((weapon) => `/weapons/${routeSlug(weapon)}`),
  ...baseCartridgeSets.map((cartridge) => `/modules/${routeSlug(cartridge)}`),
  ...modulePieces.map((piece) => `/modules/pieces/${encodeURIComponent(piece.shapeId)}/${encodeURIComponent(String(piece.rarity).toLowerCase())}`),
]

const routes = [...new Set([...staticRoutes, ...detailRoutes])]
const now = new Date().toISOString().slice(0, 10)
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map((route) => `  <url>
    <loc>${escapeXml(siteUrl)}${escapeXml(route)}</loc>
    <lastmod>${now}</lastmod>
  </url>`).join('\n')}
</urlset>
`

const outputPath = previewMode
  ? path.join(process.cwd(), '.generated', 'sitemap-preview.xml')
  : path.join(process.cwd(), 'public', 'sitemap.xml')

fs.mkdirSync(path.dirname(outputPath), { recursive: true })
fs.writeFileSync(outputPath, xml)
console.log(`Generated ${outputPath}`)
console.log(`Routes: ${routes.length}`)
console.log(previewMode ? `Preview origin: ${siteUrl}` : `Public origin: ${siteUrl}`)
console.log('Excluded local-only routes: /dev/admin, /admin-dev, admin/API write surfaces.')
