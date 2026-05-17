import { useCallback, useEffect, useState } from 'react'
import { getWeaponAsset } from '../../utils/assetHelpers.js'
import { weaponInitials } from './weaponStyle.js'

export default function WeaponImagePlaceholder({ weapon, large = false }) {
  const [imgError, setImgError] = useState(false)
  const localAsset = getWeaponAsset(weapon?.name)
  const image = localAsset || weapon?.image || weapon?.icon || ''
  const sizeClass = large ? 'min-h-[220px] sm:min-h-[240px]' : 'h-36'
  const glow = rarityGlow(weapon?.rarity)
  const onImgError = useCallback(() => setImgError(true), [])

  useEffect(() => {
    setImgError(false)
  }, [image])

  if (image && !imgError) {
    return (
      <div className={`relative overflow-hidden rounded-[24px] border border-white/80 ${glow} shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_14px_34px_rgba(0,0,0,0.05)] ring-1 ring-black/[0.04] ${sizeClass}`}>
        <div className="absolute inset-x-8 bottom-4 h-10 rounded-full bg-black/[0.06] blur-2xl" aria-hidden />
        <img src={image} alt={weapon.name} className="relative z-10 h-full w-full object-contain p-4 drop-shadow-sm" loading="lazy" onError={onImgError} />
      </div>
    )
  }

  return (
    <div
      className={[
        'relative flex items-center justify-center overflow-hidden rounded-[24px] border border-white/80 ring-1 ring-black/[0.04]',
        glow,
        'shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_14px_34px_rgba(0,0,0,0.05)]',
        sizeClass,
      ].join(' ')}
      aria-label={`${weapon?.name || 'Weapon'} image placeholder`}
    >
      <div className="absolute inset-x-8 bottom-4 h-10 rounded-full bg-black/[0.06] blur-2xl" />
      <div className="relative flex h-20 w-20 items-center justify-center rounded-[22px] border border-white/80 bg-white/78 text-2xl font-bold tracking-tight text-[#111111] shadow-[0_18px_50px_rgba(0,0,0,0.08)] backdrop-blur">
        {weaponInitials(weapon?.name)}
      </div>
    </div>
  )
}

function rarityGlow(rarity) {
  if (rarity === 'S') return 'bg-[radial-gradient(circle_at_18%_18%,rgba(245,158,11,0.18),transparent_35%),radial-gradient(circle_at_82%_26%,rgba(251,191,36,0.14),transparent_36%),linear-gradient(135deg,#ffffff,#fff7ed)]'
  if (rarity === 'A') return 'bg-[radial-gradient(circle_at_18%_18%,rgba(168,85,247,0.16),transparent_35%),radial-gradient(circle_at_82%_26%,rgba(217,70,239,0.13),transparent_36%),linear-gradient(135deg,#ffffff,#faf5ff)]'
  return 'bg-[radial-gradient(circle_at_18%_18%,rgba(6,182,212,0.16),transparent_35%),radial-gradient(circle_at_82%_26%,rgba(14,165,233,0.12),transparent_36%),linear-gradient(135deg,#ffffff,#ecfeff)]'
}
