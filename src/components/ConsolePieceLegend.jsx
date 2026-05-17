import ModuleShapeIcon from './ModuleShapeIcon.jsx'
import { getModuleType } from '../data/modules.js'

function typeLabel(piece) {
  return piece.typeLabel || getModuleType(piece.type || piece.typeCode)?.name || piece.type || 'Module Piece'
}

export default function ConsolePieceLegend({ pieces = [] }) {
  if (!pieces.length) return null

  return (
    <div className="flex flex-wrap gap-3 rounded-2xl border border-black/[0.06] bg-[#fafafa] px-4 py-3">
      {pieces.map((piece, index) => (
        <div key={`${piece.id || piece.pieceId || piece.label}-${index}`} className="flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-[#111111] ring-1 ring-black/[0.05]">
          <ModuleShapeIcon
            moduleSlug={piece.moduleSlug}
            type={piece.type}
            typeCode={piece.typeCode}
            shapeKey={piece.shapeKey}
            gradient={piece.layoutGradient}
            size="compact"
            className="rounded-md"
          />
          <span className="font-semibold">{piece.label || piece.pieceLabel || `Piece ${index + 1}`}</span>
          <span className="text-[#6b7280]">{typeLabel(piece)}</span>
        </div>
      ))}
    </div>
  )
}
