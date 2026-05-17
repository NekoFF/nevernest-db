import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const requiredFiles = [
  'src/App.jsx',
  'src/components/Seo.jsx',
  'src/components/ErrorBoundary.jsx',
  'src/pages/LegalInfoPage.jsx',
  'public/robots.txt',
  'public/site.webmanifest',
  'docs/QA_CHECKLIST.md',
]

const requiredRoutes = [
  '/',
  'characters',
  'weapons',
  'modules',
  'vehicles',
  'tier-list',
  'codes',
  'news',
  'about',
  'disclaimer',
  'privacy',
  'contact',
]

const failures = []

for (const file of requiredFiles) {
  if (!fs.existsSync(path.join(root, file))) {
    failures.push(`missing file: ${file}`)
  }
}

const appSource = fs.existsSync(path.join(root, 'src/App.jsx'))
  ? fs.readFileSync(path.join(root, 'src/App.jsx'), 'utf8')
  : ''

if (!appSource.includes('lazy(() => import(')) failures.push('App.jsx does not appear to use route-level lazy imports.')
if (!appSource.includes('<Suspense fallback=')) failures.push('App.jsx does not appear to wrap routed pages in Suspense.')
if (!appSource.includes('RouteLoadingFallback')) failures.push('App.jsx is missing the route loading fallback.')

for (const route of requiredRoutes) {
  if (route === '/') continue
  if (!appSource.includes(route)) failures.push(`route token not found in App.jsx: ${route}`)
}

const robots = fs.existsSync(path.join(root, 'public/robots.txt'))
  ? fs.readFileSync(path.join(root, 'public/robots.txt'), 'utf8')
  : ''
if (/Sitemap:/i.test(robots)) failures.push('robots.txt should not include a production sitemap URL yet.')

const authFiles = [
  'src/auth/AuthContext.jsx',
  'src/auth/authModel.js',
  'src/auth/apiAuthClient.js',
  'src/auth/authState.js',
  'src/repositories/api/authApiRepository.js',
]

for (const file of authFiles) {
  const source = fs.existsSync(path.join(root, file))
    ? fs.readFileSync(path.join(root, file), 'utf8')
    : ''
  if (/localStorage\s*\.(getItem|setItem|removeItem|clear)|localStorage\s*\[/.test(source)) {
    failures.push(`auth scaffold must not trust or store auth state in localStorage: ${file}`)
  }
}

if (failures.length) {
  console.error('Static smoke failed:')
  for (const failure of failures) console.error(`- ${failure}`)
  process.exitCode = 1
} else {
  console.log('Static smoke passed.')
  console.log(`Checked ${requiredFiles.length + authFiles.length} files and ${requiredRoutes.length} route tokens.`)
}
