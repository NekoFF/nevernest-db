import test from 'node:test'
import assert from 'node:assert/strict'
import { computeBrowserAdminModeAvailability } from './adminModeGate.js'

test('browser admin mode is unavailable in production-like env even with flag', () => {
  assert.equal(computeBrowserAdminModeAvailability({ DEV: false, VITE_ENABLE_BROWSER_ADMIN_MODE: '1' }), false)
})

test('browser admin mode requires dev env and explicit flag', () => {
  assert.equal(computeBrowserAdminModeAvailability({ DEV: true, VITE_ENABLE_BROWSER_ADMIN_MODE: '0' }), false)
  assert.equal(computeBrowserAdminModeAvailability({ DEV: true }), false)
  assert.equal(computeBrowserAdminModeAvailability({ DEV: true, VITE_ENABLE_BROWSER_ADMIN_MODE: '1' }), true)
})

