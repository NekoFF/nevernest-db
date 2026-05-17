/**
 * Shared source-status vocabulary for seed data, normalizers, audits, and later SQL imports.
 * These values describe evidence quality only; they do not change UI behavior by themselves.
 */
export const SOURCE_STATUS = Object.freeze({
  verified: 'verified',
  needsVerification: 'needs_verification',
  estimated: 'estimated',
  placeholder: 'placeholder',
  mock: 'mock',
  unknown: 'unknown',
})

export const SOURCE_STATUS_LABELS = Object.freeze({
  [SOURCE_STATUS.verified]: 'Verified',
  [SOURCE_STATUS.needsVerification]: 'Needs verification',
  [SOURCE_STATUS.estimated]: 'Estimated',
  [SOURCE_STATUS.placeholder]: 'Placeholder',
  [SOURCE_STATUS.mock]: 'Mock',
  [SOURCE_STATUS.unknown]: 'Unknown',
})

export function normalizeSourceStatus(value, fallback = SOURCE_STATUS.unknown) {
  const normalized = String(value || '').trim().toLowerCase().replace(/[-\s]+/g, '_')
  return Object.values(SOURCE_STATUS).includes(normalized) ? normalized : fallback
}

