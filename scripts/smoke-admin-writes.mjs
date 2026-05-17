/**
 * Smoke test for administrative write operations.
 * Verifies the full pipeline: CSRF -> Login -> Authenticated -> Mutation -> Public Verify -> Restore -> Logout.
 * 
 * Required Environment Variables:
 * - LOCAL_ADMIN_EMAIL: Admin email for login.
 * - LOCAL_ADMIN_PASSWORD: Admin password for login.
 * - VITE_API_BASE_URL: Backend URL (optional, defaults to 127.0.0.1:4000).
 */

import { randomBytes } from 'node:crypto'

const baseUrl = (process.env.API_BASE_URL || process.env.VITE_API_BASE_URL || 'http://127.0.0.1:4000').replace(/\/+$/, '')
const adminEmail = process.env.LOCAL_ADMIN_EMAIL
const adminPassword = process.env.LOCAL_ADMIN_PASSWORD

if (!adminEmail || !adminPassword) {
  console.error('ERROR: LOCAL_ADMIN_EMAIL and LOCAL_ADMIN_PASSWORD environment variables are required.')
  process.exit(1)
}

const url = new URL(baseUrl)
if (!['127.0.0.1', 'localhost'].includes(url.hostname)) {
  console.error(`ERROR: Target host ${url.hostname} is not allowed. This script is for local/dev use only.`)
  process.exit(1)
}

console.log(`Starting Admin Write Smoke Test against ${baseUrl}`)

const results = []
let sessionCookies = []

function redact(value) {
  return value ? '[REDACTED]' : 'null'
}

function parseCookies(setCookieHeader) {
  if (!setCookieHeader) return []
  const headers = Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader]
  return headers.map(h => h.split(';')[0])
}

async function request(path, options = {}) {
  const method = options.method || 'GET'
  const headers = {
    ...options.headers,
    'Cookie': sessionCookies.join('; '),
  }

  try {
    const res = await fetch(`${baseUrl}${path}`, { ...options, headers })
    const body = await res.json().catch(() => null)
    
    // Update cookies if Set-Cookie is present
    const newCookies = parseCookies(res.headers.get('set-cookie'))
    if (newCookies.length > 0) {
      // Very basic cookie jar: overwrite same-named cookies
      newCookies.forEach(nc => {
        const name = nc.split('=')[0]
        sessionCookies = sessionCookies.filter(c => !c.startsWith(`${name}=`))
        sessionCookies.push(nc)
      })
    }

    return { status: res.status, ok: res.ok, body }
  } catch (error) {
    return { status: 'unreachable', ok: false, error: error.message }
  }
}

function addResult(step, ok, note = '') {
  results.push({ step, ok, note })
  if (ok) {
    console.log(`[PASS] ${step}${note ? ': ' + note : ''}`)
  } else {
    console.error(`[FAIL] ${step}${note ? ': ' + note : ''}`)
  }
}

async function run() {
  // 1. Connectivity
  const statusRes = await request('/api/status')
  if (!statusRes.ok) {
    addResult('Backend Reachable', false, statusRes.error)
    process.exit(1)
  }
  addResult('Backend Reachable', true, `Mode: ${statusRes.body?.dataMode || 'unknown'}`)

  if (statusRes.body?.dataMode !== 'db') {
    addResult('Database Mode Enabled', false, 'Backend is not in DB mode. Cannot verify writes.')
    process.exit(1)
  }

  // 2. CSRF
  const csrfRes = await request('/api/auth/csrf')
  if (!csrfRes.ok || !csrfRes.body?.data?.token) {
    addResult('Fetch CSRF Token', false)
    process.exit(1)
  }
  const csrfToken = csrfRes.body.data.token
  addResult('Fetch CSRF Token', true)

  // 3. Login
  const loginRes = await request('/api/auth/local-login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: adminEmail, password: adminPassword })
  })

  const loginSuccess = loginRes.ok && loginRes.body?.ok === true && loginRes.body?.data?.authenticated === true
  
  if (!loginSuccess) {
    const diag = `Status: ${loginRes.status}, ok: ${loginRes.body?.ok}, status: ${loginRes.body?.status || 'none'}, message: ${loginRes.body?.message || 'none'}`
    addResult('Admin Login', false, diag)
    process.exit(1)
  }
  addResult('Admin Login', true, `User: ${loginRes.body?.data?.user?.displayName || 'Unknown'}`)

  // 4. Verify Identity
  const meRes = await request('/api/me')
  if (!meRes.ok || !meRes.body?.data?.authenticated) {
    addResult('Verify Auth Session', false)
    process.exit(1)
  }
  addResult('Verify Auth Session', true)

  // 5. Code Mutation
  const codesRes = await request('/api/codes')
  const testCode = codesRes.body?.data?.[0]
  if (!testCode) {
    addResult('Find Test Code', false, 'No codes found in seeded DB.')
  } else {
    const originalReward = testCode.rewardSummary
    const smokeReward = `E2E Smoke Update ${new Date().toISOString()}`
    
    // Update
    const updateRes = await request(`/api/admin/codes/${testCode.externalId}`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken
      },
      body: JSON.stringify({ rewardSummary: smokeReward })
    })
    
    if (updateRes.ok) {
      addResult('PATCH Admin Code', true)
      
      // Verify Public
      const verifyRes = await request('/api/codes')
      const updatedCode = verifyRes.body?.data?.find(c => c.externalId === testCode.externalId)
      addResult('Verify Code Persistence', updatedCode?.rewardSummary === smokeReward)

      // Restore
      const restoreRes = await request(`/api/admin/codes/${testCode.externalId}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken
        },
        body: JSON.stringify({ rewardSummary: originalReward })
      })
      addResult('Restore Admin Code', restoreRes.ok)
    } else {
      addResult('PATCH Admin Code', false, `Status: ${updateRes.status} ${JSON.stringify(updateRes.body)}`)
    }
  }

  // 6. News Mutation
  const newsRes = await request('/api/news')
  const testNews = newsRes.body?.data?.[0]
  if (!testNews) {
    addResult('Find Test News', false, 'No news found in seeded DB.')
  } else {
    const originalTitle = testNews.title
    const smokeTitle = `E2E Smoke Update ${new Date().toISOString()}`
    
    // Update
    const updateRes = await request(`/api/admin/news/${testNews.slug}`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken
      },
      body: JSON.stringify({ title: smokeTitle })
    })
    
    if (updateRes.ok) {
      addResult('PATCH Admin News', true)
      
      // Verify Public
      const verifyRes = await request('/api/news')
      const updatedNews = verifyRes.body?.data?.find(n => n.slug === testNews.slug)
      addResult('Verify News Persistence', updatedNews?.title === smokeTitle)

      // Restore
      const restoreRes = await request(`/api/admin/news/${testNews.slug}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken
        },
        body: JSON.stringify({ title: originalTitle })
      })
      addResult('Restore Admin News', restoreRes.ok)
    } else {
      addResult('PATCH Admin News', false, `Status: ${updateRes.status} ${JSON.stringify(updateRes.body)}`)
    }
  }

  // 7. Logout
  const logoutRes = await request('/api/auth/logout', {
    method: 'POST',
    headers: { 'X-CSRF-Token': csrfToken }
  })
  addResult('Admin Logout', logoutRes.ok)

  const finalMeRes = await request('/api/me')
  addResult('Verify Logout Session', finalMeRes.ok && !finalMeRes.body?.data?.authenticated)

  console.log('\nAdmin Write Smoke Test Summary:')
  console.table(results)

  const allOk = results.every(r => r.ok)
  if (!allOk) {
    console.error('\nSmoke test failed.')
    process.exit(1)
  } else {
    console.log('\nAll administrative write tests passed.')
    process.exit(0)
  }
}

run().catch(error => {
  console.error('Fatal Smoke Test Error:', error)
  process.exit(1)
})
