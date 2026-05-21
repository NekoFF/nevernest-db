export const BROWSER_ADMIN_MODE_FLAG = 'VITE_ENABLE_BROWSER_ADMIN_MODE'
export const ADMIN_MODE_FLAG = 'VITE_ENABLE_ADMIN_MODE'

function isEnabled(value) {
  return ['1', 'true', 'yes', 'on'].includes(String(value || '').trim().toLowerCase())
}

export function hasAdminUrlFlag() {
  if (typeof window === 'undefined') return false
  try {
    const params = new URLSearchParams(window.location.search)
    return params.get('admin') === '1'
  } catch {
    return false
  }
}

export function computeBrowserAdminModeAvailability(metaEnv = import.meta.env) {
  return Boolean(metaEnv?.DEV) && (
    isEnabled(metaEnv?.[ADMIN_MODE_FLAG]) ||
    isEnabled(metaEnv?.[BROWSER_ADMIN_MODE_FLAG]) ||
    hasAdminUrlFlag()
  )
}

export const isBrowserAdminModeAvailable = computeBrowserAdminModeAvailability()
