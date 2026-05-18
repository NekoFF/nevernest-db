const rawPreviewUrl = (process.env.PREVIEW_URL || '').trim()

if (!rawPreviewUrl) {
  console.error('PREVIEW_URL is required.')
  console.error('Example: PREVIEW_URL="https://preview.example.pages.dev" npm run check:preview-headers')
  process.exit(1)
}

let previewUrl
try {
  previewUrl = new URL(rawPreviewUrl)
} catch {
  console.error(`Invalid PREVIEW_URL: ${rawPreviewUrl}`)
  process.exit(1)
}

const expectedHeaders = [
  'content-security-policy',
  'x-content-type-options',
  'referrer-policy',
  'permissions-policy',
  'cross-origin-opener-policy',
  'cross-origin-resource-policy',
]

const expectedEither = [
  ['x-frame-options', 'content-security-policy'],
]

if (previewUrl.protocol === 'https:') {
  expectedHeaders.push('strict-transport-security')
}

async function fetchHeaders(method) {
  const response = await fetch(previewUrl, { method, redirect: 'manual' })
  return {
    method,
    status: response.status,
    headers: response.headers,
  }
}

const result = await fetchHeaders('HEAD').catch(async (error) => {
  console.warn(`HEAD request failed: ${error.message}`)
  return fetchHeaders('GET')
})

const missing = expectedHeaders.filter((header) => !result.headers.has(header))
const missingEither = expectedEither.filter((options) => !options.some((header) => result.headers.has(header)))

console.log(`Checked ${previewUrl.href}`)
console.log(`${result.method} status: ${result.status}`)

for (const header of expectedHeaders) {
  console.log(`${header}: ${result.headers.get(header) || 'MISSING'}`)
}
for (const options of expectedEither) {
  console.log(`${options.join(' or ')}: ${options.map((header) => `${header}=${result.headers.get(header) || 'MISSING'}`).join('; ')}`)
}

if (missing.length || missingEither.length) {
  if (missing.length) console.error(`Missing required headers: ${missing.join(', ')}`)
  if (missingEither.length) console.error(`Missing required header alternatives: ${missingEither.map((options) => options.join(' or ')).join(', ')}`)
  process.exit(1)
}

console.log('Preview security headers present.')
