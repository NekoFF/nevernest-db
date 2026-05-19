export const baseCodes = [
  {
    id: 'ntegift',
    code: 'NTEGIFT',
    rewardSummary: 'Annulith x50 + Materials',
    status: 'active',
    startDate: '',
    endDate: '',
    enabled: true,
    sortOrder: 10,
  },
  {
    id: 'ntehavefun',
    code: 'NTEHAVEFUN',
    rewardSummary: 'Materials',
    status: 'active',
    startDate: '',
    endDate: '',
    enabled: true,
    sortOrder: 20,
  },
  {
    id: 'ntevtuber200',
    code: 'NTEVTUBER200',
    rewardSummary: 'Materials',
    status: 'active',
    startDate: '',
    endDate: '',
    enabled: true,
    sortOrder: 30,
  },
  {
    id: 'ntefree',
    code: 'NTEFREE',
    rewardSummary: 'Coins',
    status: 'active',
    startDate: '',
    endDate: '',
    enabled: true,
    sortOrder: 40,
  },
  {
    id: 'ntevtuber',
    code: 'NTEVTUBER',
    rewardSummary: 'Coins',
    status: 'active',
    startDate: '',
    endDate: '',
    enabled: true,
    sortOrder: 50,
  },
  {
    id: 'ntenene',
    code: 'NTENENE',
    rewardSummary: 'Coins + ?',
    status: 'active',
    startDate: '',
    endDate: '',
    enabled: true,
    sortOrder: 60,
  },
  {
    id: 'nte429vtuber',
    code: 'NTE429VTUBER',
    rewardSummary: 'Coins',
    status: 'active',
    startDate: '',
    endDate: '',
    enabled: true,
    sortOrder: 70,
  },
  {
    id: 'nte0429',
    code: 'NTE0429',
    rewardSummary: 'Annulith x100 + Materials',
    status: 'expired',
    startDate: '',
    endDate: '',
    enabled: true,
    sortOrder: 110,
  },
  {
    id: 'ntenanallygo',
    code: 'NTENANALLYGO',
    rewardSummary: 'Annulith x100 + Materials',
    status: 'expired',
    startDate: '',
    endDate: '',
    enabled: true,
    sortOrder: 120,
  },
  {
    id: 'ntenowtoenjoy',
    code: 'NTENOWTOENJOY',
    rewardSummary: 'Annulith x100 + Materials',
    status: 'expired',
    startDate: '',
    endDate: '',
    enabled: true,
    sortOrder: 130,
  },
  {
    id: '504980102fkgovns',
    code: '504980102FKGOVNS',
    rewardSummary: 'Annulith x30 + Materials',
    status: 'expired',
    startDate: '',
    endDate: '',
    enabled: true,
    sortOrder: 140,
  },
  {
    id: 'ntefungame',
    code: 'NTEFUNGAME',
    rewardSummary: 'Coins',
    status: 'expired',
    startDate: '',
    endDate: '',
    enabled: true,
    sortOrder: 150,
  },
  {
    id: 'ntewinfons',
    code: 'NTEWINFONS',
    rewardSummary: 'Coins',
    status: 'expired',
    startDate: '',
    endDate: '',
    enabled: true,
    sortOrder: 160,
  },
]

export function normalizeCodeEntry(entry = {}, index = 0) {
  const code = String(entry.code || '').trim().toUpperCase()
  const id = String(entry.id || code || `code-${index + 1}`)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return {
    id,
    code,
    rewardSummary: String(entry.rewardSummary || '').trim(),
    status: entry.status === 'expired' ? 'expired' : 'active',
    sourceStatus: String(entry.sourceStatus || 'needs_verification').trim(),
    startDate: String(entry.startDate || '').trim(),
    endDate: String(entry.endDate || entry.expiry || '').trim(),
    enabled: entry.enabled !== false,
    sortOrder: Number.isFinite(Number(entry.sortOrder)) ? Number(entry.sortOrder) : index * 10,
  }
}

export function mergeCodesWithOverrides(base = baseCodes, overrides = {}) {
  const deleted = new Set(overrides?.deleted || [])
  const edited = overrides?.entries && typeof overrides.entries === 'object' ? overrides.entries : {}
  const created = Array.isArray(overrides?.created) ? overrides.created : []
  const mergedBase = base
    .filter((entry) => !deleted.has(entry.id))
    .map((entry, index) => normalizeCodeEntry({ ...entry, ...(edited[entry.id] || {}) }, index))
  const normalizedCreated = created.map((entry, index) => normalizeCodeEntry(entry, mergedBase.length + index))
  return [...mergedBase, ...normalizedCreated].sort((a, b) => a.sortOrder - b.sortOrder || a.code.localeCompare(b.code))
}
