import { Check } from 'lucide-react'
import ModuleShapeIcon from './ModuleShapeIcon.jsx'
import { getModuleType, getModuleVisualStyle } from '../data/modules.js'

const PLACEHOLDER = 'Data coming soon'

function pieceKey(piece) {
  return piece.id || `${piece.type || piece.typeCode}-${piece.shapeKey}`
}

function typeLabel(piece) {
  return piece.typeLabel || piece.labelType || getModuleType(piece.type || piece.typeCode)?.name || piece.type || PLACEHOLDER
}

function rarityText(piece) {
  const preferred = piece.preferredRarity || piece.recommendedRarity
  const fallback = piece.fallbackRarities || []
  if (!preferred) return null
  return `Prefer ${preferred}${fallback.length ? ` / fallback ${fallback.join(' or ')}` : ''}`
}

export default function RequiredPieces({ pieces = [], placedPieces = [] }) {
  if (!pieces.length) return null

  const usedIds = new Set(placedPieces.map((piece) => piece.pieceId).filter(Boolean))

  return (
    <div className="mt-5">
      <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#6b7280]">Required Pieces</h4>
      <div className="grid gap-3 md:grid-cols-2">
        {pieces.map((piece) => {
          const preferred = piece.preferredRarity || piece.recommendedRarity
          const style = getModuleVisualStyle(preferred || 'S')
          const used = usedIds.has(piece.id)

          return (
            <div key={pieceKey(piece)} className="flex items-center justify-between gap-3 rounded-2xl bg-[#fafafa] px-4 py-3 ring-1 ring-black/[0.04]">
              <div className="flex min-w-0 items-center gap-3">
                <ModuleShapeIcon
                  moduleSlug={piece.moduleSlug}
                  rarity={preferred}
                  type={piece.type}
                  typeCode={piece.typeCode}
                  shapeKey={piece.shapeKey}
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[#111111]">{piece.label || typeLabel(piece)}</p>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-[#9ca3af]">{typeLabel(piece)}</p>
                  {rarityText(piece) ? <p className="mt-0.5 text-xs text-[#6b7280]">{rarityText(piece)}</p> : null}
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {preferred ? (
                  <span className={`rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${style.badgeClassName}`}>
                    {preferred}
                  </span>
                ) : null}
                {used ? (
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-cyan-50 text-cyan-700 ring-1 ring-cyan-100" title="Used in current setup">
                    <Check className="h-3.5 w-3.5" strokeWidth={2.6} aria-hidden />
                  </span>
                ) : null}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
