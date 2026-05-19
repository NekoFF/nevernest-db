export const BROWSER_ADMIN_MODE_FLAG = 'VITE_ENABLE_BROWSER_ADMIN_MODE'

export function computeBrowserAdminModeAvailability(metaEnv = import.meta.env) {
  return Boolean(metaEnv?.DEV) && metaEnv?.[BROWSER_ADMIN_MODE_FLAG] === '1'
}

export const isBrowserAdminModeAvailable = computeBrowserAdminModeAvailability()

