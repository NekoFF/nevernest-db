export const DISCOVERY_SOURCE_OPTIONS = [
  { value: 'All', label: 'All' },
  { value: 'verified', label: 'Verified' },
  { value: 'needs_review', label: 'Needs review' },
  { value: 'estimated', label: 'Estimated' },
  { value: 'unknown', label: 'Unknown' },
]

export function discoverySourceStatus(value) {
  const normalized = String(value || '').trim().toLowerCase().replace(/[-\s]+/g, '_')
  if (normalized === 'verified') return 'verified'
  if (normalized === 'estimated') return 'estimated'
  if (
    normalized.includes('need') ||
    normalized.includes('pending') ||
    normalized.includes('missing') ||
    normalized.includes('manual') ||
    normalized.includes('placeholder') ||
    normalized.includes('conflict')
  ) return 'needs_review'
  return 'unknown'
}

export function discoverySourceLabel(value) {
  const option = DISCOVERY_SOURCE_OPTIONS.find((item) => item.value === value)
  return option?.label || 'Unknown'
}

export function matchesDiscoverySourceStatus(rawStatus, filterValue = 'All') {
  if (!filterValue || filterValue === 'All') return true
  return discoverySourceStatus(rawStatus) === filterValue
}
