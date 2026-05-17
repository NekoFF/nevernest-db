import { useCallback, useEffect, useState } from 'react'

export default function CharacterPortrait({
  src,
  name,
  localAsset = false,
  portrait = { from: '#f4f4f5', to: '#ffffff' },
  className = '',
  imageClassName = '',
  loading = 'lazy',
}) {
  const [imgError, setImgError] = useState(false)
  const hasImage = Boolean(src && !imgError)
  const onImgError = useCallback(() => setImgError(true), [])

  useEffect(() => {
    setImgError(false)
  }, [src])

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={!hasImage ? { backgroundImage: `linear-gradient(165deg, ${portrait.from}, ${portrait.to})` } : undefined}
    >
      {hasImage ? (
        <img
          src={src}
          alt=""
          className={[
            'h-full w-full object-bottom',
            localAsset ? 'object-contain scale-[1.03] p-1.5' : 'object-cover scale-[1.02]',
            imageClassName,
          ].filter(Boolean).join(' ')}
          loading={loading}
          decoding="async"
          onError={onImgError}
        />
      ) : null}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_35%_18%,rgba(255,255,255,0.34),transparent_55%)]" />
      {!hasImage ? <span className="relative flex h-full w-full items-center justify-center text-sm font-bold text-[#111111]">{String(name || '?').slice(0, 1)}</span> : null}
    </div>
  )
}
