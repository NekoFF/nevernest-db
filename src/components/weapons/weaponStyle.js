export const rarityStyles = {
  S: 'border-[#f59e0b]/25 bg-gradient-to-br from-white to-amber-50/85 text-[#8a5b12] shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_8px_18px_rgba(245,158,11,0.10)]',
  A: 'border-slate-200/80 bg-gradient-to-br from-white to-sky-50/70 text-slate-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]',
  B: 'border-[#06b6d4]/18 bg-[#ecfeff]/85 text-[#0e7490]',
}

export const typeStyles = {
  Bose: 'border-[#ff2f6d]/20 bg-[#fff1f5] text-[#be123c]',
  Gas: 'border-[#22c55e]/20 bg-[#f0fdf4] text-[#15803d]',
  Liquid: 'border-[#0ea5e9]/20 bg-[#f0f9ff] text-[#0369a1]',
  Plasma: 'border-[#a855f7]/20 bg-[#faf5ff] text-[#7e22ce]',
  Solid: 'border-[#64748b]/20 bg-[#f8fafc] text-[#475569]',
  Synthesis: 'border-[#f59e0b]/20 bg-[#fffbeb] text-[#b45309]',
}

export function badgeClass(kind, value) {
  const styles = kind === 'rarity' ? rarityStyles : typeStyles
  return [
    'inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]',
    styles[value] || 'border-black/[0.08] bg-[#fafafa] text-[#6b7280]',
  ].join(' ')
}

export function rarityAccent(value) {
  if (value === 'S') return 'from-[#f59e0b]/22 via-[#fff7ed]/70 to-[#ff2f6d]/10'
  if (value === 'A') return 'from-[#a855f7]/18 via-[#faf5ff]/75 to-[#ff2f6d]/10'
  if (value === 'B') return 'from-[#06b6d4]/18 via-[#ecfeff]/75 to-[#ff2f6d]/10'
  return 'from-[#ff2f6d]/12 via-white to-[#06b6d4]/10'
}

export function weaponInitials(name = '') {
  const parts = name
    .replace(/["']/g, '')
    .split(/\s+/)
    .filter(Boolean)
  if (parts.length === 0) return 'NTE'
  return parts
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}
