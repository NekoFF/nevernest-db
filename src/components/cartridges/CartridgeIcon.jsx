import { useCallback, useEffect, useState } from 'react'
import { getModuleAsset } from '../../utils/assetHelpers.js'
import { cartridgeInitials, rarityGlow } from './cartridgeStyle.js'

export default function CartridgeIcon({ cartridge, rarity = 'S', className = 'h-16 w-16' }) {
  const [imgError, setImgError] = useState(false)
  const normalizedRarity = String(rarity || 'S').match(/[SAB]/i)?.[0]?.toUpperCase() || 'S'
  const localAsset = getModuleAsset(cartridge?.name, normalizedRarity)
  const image = localAsset || cartridge?.icon || cartridge?.image || ''
  const onImgError = useCallback(() => setImgError(true), [])

  useEffect(() => {
    setImgError(false)
  }, [image])
  return (
    <div className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-[22px] bg-white ring-1 ring-black/[0.05] ${className}`}>
      <div className={`absolute inset-[-18%] bg-gradient-to-br ${rarityGlow(normalizedRarity)} blur-xl`} aria-hidden />
      {image && !imgError ? (
        <img src={image} alt={cartridge.name} className="relative z-10 h-[84%] w-[84%] object-contain drop-shadow-sm" loading="lazy" onError={onImgError} />
      ) : (
        <span className="relative z-10 text-sm font-black tracking-tight text-[#111111]">
          {cartridgeInitials(cartridge?.name)}
        </span>
      )}
    </div>
  )
}
