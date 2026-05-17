export function formatPrice(vehicle) {
  if (vehicle.price == null) return 'Price unknown'
  return `${vehicle.price.toLocaleString()} ${vehicle.currency === 'fons' ? 'FONS' : vehicle.currency === 'special' ? 'Special' : ''}`.trim()
}

export function formatCompactPrice(vehicle) {
  if (vehicle.price == null) return 'Unknown'
  const value = Number(vehicle.price)
  const compact = value >= 1000000
    ? `${Number((value / 1000000).toFixed(value % 1000000 === 0 ? 0 : 1))}M`
    : value >= 1000
      ? `${Number((value / 1000).toFixed(value % 1000 === 0 ? 0 : 1))}K`
      : value.toLocaleString()
  return `${compact} ${vehicle.currency === 'fons' ? 'FONS' : vehicle.currency === 'special' ? 'Special' : ''}`.trim()
}

export function currencyClass(currency) {
  if (currency === 'special') return 'border-[#ff2f6d]/20 bg-[#fff1f5] text-[#be123c]'
  if (currency === 'fons') return 'border-amber-200 bg-amber-50 text-amber-800'
  return 'border-black/[0.06] bg-[#fafafa] text-[#6b7280]'
}

export function statValue(value, suffix = '') {
  if (value == null || value === '') return '--'
  return `${Number(value).toLocaleString()}${suffix}`
}

export const handlingLabels = [
  ['speedShifting', 'Speed Shifting'],
  ['suspensionHeight', 'Suspension Height'],
  ['suspensionDamping', 'Suspension Damping'],
  ['handbrake', 'Handbrake'],
  ['brakingPower', 'Braking Power'],
]
