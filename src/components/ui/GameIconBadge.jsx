import { getArcTypeMeta, getElementMeta } from '../../data/gameMeta.jsx'

const arcTone = {
  bose: { color: '#64748b', bg: 'rgba(100,116,139,0.12)', border: 'rgba(100,116,139,0.20)' },
  gas: { color: '#16a34a', bg: 'rgba(22,163,74,0.12)', border: 'rgba(22,163,74,0.20)' },
  liquid: { color: '#0284c7', bg: 'rgba(2,132,199,0.12)', border: 'rgba(2,132,199,0.20)' },
  plasma: { color: '#dc2626', bg: 'rgba(220,38,38,0.12)', border: 'rgba(220,38,38,0.20)' },
  solid: { color: '#92400e', bg: 'rgba(146,64,14,0.12)', border: 'rgba(146,64,14,0.20)' },
}

function normalize(value) {
  return String(value || '').trim().toLowerCase()
}

function resolveTone(kind, value, color) {
  if (kind === 'arc') {
    return arcTone[normalize(value)] || { color: '#4b5563', bg: 'rgba(75,85,99,0.10)', border: 'rgba(75,85,99,0.18)' }
  }
  return {
    color: color || '#4b5563',
    bg: color ? `${color}18` : 'rgba(75,85,99,0.10)',
    border: color ? `${color}30` : 'rgba(75,85,99,0.18)',
  }
}

export function getArcTone(value) {
  return resolveTone('arc', value)
}

export default function GameIconBadge({
  kind = 'element',
  value,
  label,
  assetIcon,
  fallbackIcon: FallbackIcon,
  size = 'md',
  className = '',
}) {
  const meta = kind === 'arc' ? getArcTypeMeta(normalize(value)) : getElementMeta(normalize(value))
  const tone = resolveTone(kind, value || meta?.id, meta?.color)
  const sizes = size === 'sm'
    ? 'h-5 w-5'
    : size === 'lg'
      ? 'h-11 w-11'
      : 'h-7 w-7'
  const iconSize = size === 'sm' ? 'h-3.5 w-3.5' : size === 'lg' ? 'h-6 w-6' : 'h-4 w-4'

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full shadow-[0_5px_14px_rgba(0,0,0,0.10),inset_0_1px_0_rgba(255,255,255,0.92),inset_0_0_0_999px_rgba(255,255,255,0.24)] backdrop-blur ${sizes} ${className}`}
      style={{ backgroundColor: tone.bg, border: `1px solid ${tone.border}`, color: tone.color }}
      title={label || meta?.label || value}
    >
      {assetIcon ? (
        <img
          src={assetIcon}
          alt=""
          className={`${iconSize} object-contain drop-shadow-[0_1px_1px_rgba(0,0,0,0.25)] [filter:contrast(1.18)_saturate(1.18)]`}
          loading="lazy"
        />
      ) : FallbackIcon ? (
        <FallbackIcon className={iconSize} style={{ color: tone.color }} />
      ) : null}
    </span>
  )
}
