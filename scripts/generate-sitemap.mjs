import fs from 'node:fs'
import path from 'node:path'

const siteUrl = (process.env.SITE_URL || '').trim().replace(/\/+$/, '')

if (!siteUrl) {
  console.error('SITE_URL is required to generate public/sitemap.xml.')
  console.error('Example: $env:SITE_URL="https://example.com"; npm.cmd run sitemap:generate')
  process.exit(1)
}

if (!/^https:\/\/[^/]+/i.test(siteUrl)) {
  console.error('SITE_URL must be an HTTPS origin, for example https://example.com.')
  process.exit(1)
}

const routes = [
  '/',
  '/characters',
  '/weapons',
  '/modules',
  '/vehicles',
  '/tier-list',
  '/codes',
  '/news',
  '/about',
  '/disclaimer',
  '/privacy',
  '/contact',
]

const now = new Date().toISOString().slice(0, 10)
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map((route) => `  <url>
    <loc>${siteUrl}${route}</loc>
    <lastmod>${now}</lastmod>
  </url>`).join('\n')}
</urlset>
`

const outputPath = path.join(process.cwd(), 'public', 'sitemap.xml')
fs.writeFileSync(outputPath, xml)
console.log(`Generated ${outputPath}`)
console.log('Dynamic detail routes are intentionally deferred until public route policy is approved.')
