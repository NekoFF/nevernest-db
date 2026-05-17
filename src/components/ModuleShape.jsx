import { getModuleColor, getModuleShape, MODULE_RARITIES } from '../data/moduleCatalog.js'

export default function ModuleShape({ shapeId, shape, rarity = 'S', colorKey, size = 16, compact = false }) {
  const moduleShape = shape || getModuleShape(shapeId)
  const matrix = moduleShape?.matrix || [[1]]
  const rarityKey = String(rarity || 'S').toUpperCase()
  const style = colorKey ? getModuleColor(colorKey) : MODULE_RARITIES[rarityKey] || MODULE_RARITIES.S
  const cellSize = compact ? Math.max(7, Math.round(size * 0.68)) : size

  return (
    <div
      className="inline-grid gap-0.5"
      style={{ gridTemplateColumns: `repeat(${matrix[0]?.length || 1}, ${cellSize}px)` }}
      title={moduleShape?.name}
    >
      {matrix.flatMap((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <span
            key={`${rowIndex}-${colIndex}`}
            className={[
              'rounded-[4px] ring-1',
              cell ? style.className : 'bg-transparent ring-transparent',
            ].join(' ')}
            style={{ width: cellSize, height: cellSize }}
            aria-hidden
          />
        )),
      )}
    </div>
  )
}
