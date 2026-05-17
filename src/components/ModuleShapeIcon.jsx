import { getModuleBySlug, getModuleShape, getModuleVisualStyle } from '../data/modules.js'

function resolveShape({ moduleSlug, rarity, type, typeCode, shapeKey }) {
  const catalogModule = moduleSlug ? getModuleBySlug(moduleSlug) : null
  const resolvedType = catalogModule?.typeCode || typeCode || type
  const shape = catalogModule?.shape || getModuleShape(resolvedType, shapeKey)
  const rarityCode = catalogModule?.rarityCode || rarity || 'S'
  const displayName = catalogModule?.displayName

  return { shape, rarityCode, displayName }
}

export default function ModuleShapeIcon({
  moduleSlug,
  rarity,
  type,
  typeCode,
  shapeKey,
  gradient,
  className = '',
  size = 'normal',
}) {
  const { shape, rarityCode, displayName } = resolveShape({ moduleSlug, rarity, type, typeCode, shapeKey })
  const style = getModuleVisualStyle(rarityCode)

  if (!shape) {
    return <div className={`shrink-0 rounded-xl bg-white ring-1 ring-black/[0.05] ${className}`} />
  }

  const compact = size === 'compact'
  const cellSize = compact ? 10 : 12
  const gap = compact ? 2 : 3
  const padding = compact ? 3 : 5
  const occupied = new Set(shape.cells.map(([x, y]) => `${x},${y}`))
  const activeBackground = gradient || style.gradient

  return (
    <div
      className={`grid shrink-0 rounded-xl bg-white ring-1 ring-black/[0.05] ${className}`}
      style={{
        gridTemplateColumns: `repeat(${shape.width}, ${cellSize}px)`,
        gridTemplateRows: `repeat(${shape.height}, ${cellSize}px)`,
        gap: `${gap}px`,
        padding,
        width: shape.width * cellSize + (shape.width - 1) * gap + padding * 2,
        height: shape.height * cellSize + (shape.height - 1) * gap + padding * 2,
      }}
      title={displayName || shape.shapeKey}
      aria-label={displayName || shape.shapeKey}
    >
      {Array.from({ length: shape.width * shape.height }).map((_, index) => {
        const x = index % shape.width
        const y = Math.floor(index / shape.width)
        const active = occupied.has(`${x},${y}`)
        return (
          <span
            key={`${x}-${y}`}
            className="rounded-[3px]"
            style={active ? { background: activeBackground, boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.45)' } : { background: 'transparent' }}
          />
        )
      })}
    </div>
  )
}
