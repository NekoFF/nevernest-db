export function readStorageValue(key, fallback = null) {
  try {
    const value = localStorage.getItem(key)
    return value == null ? fallback : value
  } catch {
    return fallback
  }
}

export function writeStorageValue(key, value) {
  try {
    localStorage.setItem(key, value)
    return true
  } catch {
    return false
  }
}

export function removeStorageValue(key) {
  try {
    localStorage.removeItem(key)
    return true
  } catch {
    return false
  }
}

export function readJsonStorage(key, fallback = null, legacyKeys = []) {
  const keys = [key, ...legacyKeys].filter(Boolean)
  for (const candidate of keys) {
    const raw = readStorageValue(candidate, null)
    if (raw == null) continue
    try {
      const parsed = JSON.parse(raw)
      if (candidate !== key) writeJsonStorage(key, parsed)
      return parsed
    } catch {
      continue
    }
  }
  return fallback
}

export function writeJsonStorage(key, value) {
  return writeStorageValue(key, JSON.stringify(value))
}

export function makeVersionedPayload(data, version = 1, meta = {}) {
  return {
    version,
    savedAt: new Date().toISOString(),
    data,
    ...meta,
  }
}

export function unwrapVersionedPayload(payload, fallback = null) {
  if (!payload || typeof payload !== 'object') return fallback
  return Object.prototype.hasOwnProperty.call(payload, 'data') ? payload.data : payload
}
