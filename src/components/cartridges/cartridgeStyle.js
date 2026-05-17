export const rarityOrder = { S: 0, A: 1, B: 2 }

export function cartridgeInitials(name = '') {
  return String(name)
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'C'
}

export function rarityGlow(rarity = 'S') {
  const key = String(rarity || 'S').toUpperCase()
  if (key === 'B') return 'from-cyan-200/70 via-sky-100/55 to-transparent'
  if (key === 'A') return 'from-fuchsia-200/70 via-violet-100/55 to-transparent'
  return 'from-amber-200/80 via-orange-100/55 to-transparent'
}

export function rarityBadgeClass(rarity = 'S') {
  const key = String(rarity || 'S').toUpperCase()
  if (key === 'B') return 'border-cyan-300/60 bg-cyan-50 text-cyan-700'
  if (key === 'A') return 'border-fuchsia-300/60 bg-fuchsia-50 text-fuchsia-700'
  return 'border-amber-300/70 bg-amber-50 text-amber-700'
}

export function categoryBadgeClass(category = 'support') {
  const key = String(category || 'support').toLowerCase()
  if (key === 'damage') return 'border-rose-200 bg-rose-50 text-rose-700'
  if (key === 'defense') return 'border-sky-200 bg-sky-50 text-sky-700'
  if (key === 'healing') return 'border-emerald-200 bg-emerald-50 text-emerald-700'
  if (key === 'utility') return 'border-violet-200 bg-violet-50 text-violet-700'
  if (key === 'break') return 'border-orange-200 bg-orange-50 text-orange-700'
  return 'border-black/[0.06] bg-white text-[#6b7280]'
}
