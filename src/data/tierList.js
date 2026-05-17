export const tierTemplates = {
  standard: {
    name: 'Standard',
    tiers: [
      { id: 's', label: 'S', subtitle: 'Best overall picks', color: '#f59e0b', characterIds: [] },
      { id: 'a', label: 'A', subtitle: 'Strong and flexible', color: '#a855f7', characterIds: [] },
      { id: 'b', label: 'B', subtitle: 'Good with setup', color: '#06b6d4', characterIds: [] },
      { id: 'c', label: 'C', subtitle: 'Situational value', color: '#22c55e', characterIds: [] },
      { id: 'd', label: 'D', subtitle: 'Needs investment', color: '#94a3b8', characterIds: [] },
    ],
  },
  competitive: {
    name: 'Competitive',
    tiers: [
      { id: 's-plus', label: 'S+', subtitle: 'Meta defining', color: '#f97316', characterIds: [] },
      { id: 's', label: 'S', subtitle: 'Top meta picks', color: '#f59e0b', characterIds: [] },
      { id: 'a', label: 'A', subtitle: 'Excellent choices', color: '#a855f7', characterIds: [] },
      { id: 'b', label: 'B', subtitle: 'Reliable options', color: '#06b6d4', characterIds: [] },
      { id: 'c', label: 'C', subtitle: 'Niche or developing', color: '#22c55e', characterIds: [] },
      { id: 'unranked', label: 'Unranked', subtitle: 'Pending evaluation', color: '#94a3b8', characterIds: [] },
    ],
  },
  role: {
    name: 'Role-based',
    tiers: [
      { id: 'main-dps', label: 'Main DPS', subtitle: 'Primary field damage', color: '#f97316', characterIds: [] },
      { id: 'sub-dps', label: 'Sub DPS', subtitle: 'Follow-up and burst value', color: '#a855f7', characterIds: [] },
      { id: 'sustain', label: 'Sustain', subtitle: 'Defensive comfort', color: '#22c55e', characterIds: [] },
      { id: 'support', label: 'Support', subtitle: 'Buffs and utility', color: '#06b6d4', characterIds: [] },
      { id: 'extra', label: 'Extra', subtitle: 'Flexible pocket picks', color: '#94a3b8', characterIds: [] },
    ],
  },
  simple: {
    name: 'Simple',
    tiers: [
      { id: 'good', label: 'Good', subtitle: 'Recommended', color: '#f59e0b', characterIds: [] },
      { id: 'average', label: 'Average', subtitle: 'Usable', color: '#06b6d4', characterIds: [] },
      { id: 'bad', label: 'Bad', subtitle: 'Low priority', color: '#94a3b8', characterIds: [] },
    ],
  },
}

export const officialTierList = {
  id: 'official-character-tier-list',
  title: 'Official Character Tier List',
  description: 'Compare characters by role, strength, flexibility, and current meta value.',
  updatedAt: '2026-05-15',
  settings: {
    showWatermark: true,
    showNames: false,
    compactMode: false,
  },
  tiers: [
    { id: 's-plus', label: 'S+', subtitle: 'Meta defining', color: '#f97316', characterIds: ['nanally', 'zero-female', 'hotori'] },
    { id: 's', label: 'S', subtitle: 'Top meta picks', color: '#f59e0b', characterIds: ['sakiri', 'hathor', 'baicang'] },
    { id: 'a', label: 'A', subtitle: 'Excellent choices', color: '#a855f7', characterIds: ['fadia', 'lacrimosa', 'daffodil', 'jiuyuan'] },
    { id: 'b', label: 'B', subtitle: 'Reliable options', color: '#06b6d4', characterIds: ['chiz', 'skia', 'mint', 'adler'] },
    { id: 'c', label: 'C', subtitle: 'Situational value', color: '#22c55e', characterIds: ['edgar', 'aurelia', 'hanizel'] },
    { id: 'unranked', label: 'Unranked', subtitle: 'Pending evaluation', color: '#94a3b8', characterIds: ['zero-male'] },
  ],
}

export const defaultPersonalTierList = {
  ...officialTierList,
  id: 'personal-character-tier-list',
  title: 'My Character Tier List',
  description: 'Personal lists are saved locally in this browser. Public sharing will come later.',
  updatedAt: '',
  settings: {
    showWatermark: true,
    showNames: false,
    compactMode: false,
  },
  tiers: tierTemplates.competitive.tiers.map((tier) => ({ ...tier, characterIds: [] })),
}

export function cloneTierList(list) {
  return {
    ...list,
    settings: { showWatermark: true, showNames: false, compactMode: false, ...(list.settings || {}) },
    tiers: (list.tiers || []).map((tier) => ({
      id: tier.id,
      label: tier.label,
      subtitle: tier.subtitle || '',
      color: tier.color || '#94a3b8',
      characterIds: Array.isArray(tier.characterIds) ? [...tier.characterIds] : [],
    })),
  }
}

export function normalizeTierList(list, fallback = defaultPersonalTierList) {
  const base = cloneTierList(fallback)
  if (!list || typeof list !== 'object') return base
  return {
    ...base,
    ...list,
    settings: { ...base.settings, ...(list.settings || {}) },
    tiers: Array.isArray(list.tiers) && list.tiers.length ? list.tiers.map((tier, index) => ({
      id: String(tier.id || `tier-${index + 1}`),
      label: String(tier.label || `Tier ${index + 1}`),
      subtitle: String(tier.subtitle || ''),
      color: String(tier.color || '#94a3b8'),
      characterIds: Array.isArray(tier.characterIds) ? [...new Set(tier.characterIds.map(String))] : [],
    })) : base.tiers,
  }
}
