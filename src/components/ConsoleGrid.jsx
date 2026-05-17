import ConsolePieceLegend from './ConsolePieceLegend.jsx'
import { getModuleBySlug, getModuleShape } from '../data/modules.js'

const PLACEHOLDER = 'Data coming soon'

const BLOCKED_STYLE = {
  backgroundColor: '#eef0f3',
  backgroundImage: 'repeating-linear-gradient(135deg, rgba(107, 114, 128, 0.13) 0px, rgba(107, 114, 128, 0.13) 4px, rgba(255, 255, 255, 0.38) 4px, rgba(255, 255, 255, 0.38) 9px)',
}

const LAYOUT_GRADIENTS = {
  cyan: 'linear-gradient(135deg, #22d3ee 0%, #06b6d4 100%)',
  blue: 'linear-gradient(135deg, #93c5fd 0%, #3b82f6 100%)',
  green: 'linear-gradient(135deg, #4ade80 0%, #16a34a 100%)',
  teal: 'linear-gradient(135deg, #5eead4 0%, #14b8a6 100%)',
  purple: 'linear-gradient(135deg, #f0abfc 0%, #c026d3 100%)',
  gold: 'linear-gradient(135deg, #fcd34d 0%, #f59e0b 100%)',
}

function keyOf(row, col) {
  return `${row},${col}`
}

function normalizeCell(coord) {
  if (typeof coord === 'string') return coord
  return keyOf(coord[0], coord[1])
}

function shapeCellsFromOrigin(piece) {
  const catalogModule = piece.moduleSlug ? getModuleBySlug(piece.moduleSlug) : null
  const shape = catalogModule?.shape || getModuleShape(piece.type || piece.typeCode, piece.shapeKey)
  const origin = piece.origin || { row: piece.row || 0, col: piece.col || 0 }
  if (!shape) return []

  return shape.cells.map(([x, y]) => keyOf(origin.row + y, origin.col + x))
}

function layoutGradient(value, index) {
  if (!value) return Object.values(LAYOUT_GRADIENTS)[index % Object.values(LAYOUT_GRADIENTS).length]
  return LAYOUT_GRADIENTS[value] || value
}

function normalizePieces(grid, requiredPieces) {
  const pieceById = new Map(requiredPieces.map((piece) => [piece.id, piece]))

  if (Array.isArray(grid.placedPieces)) {
    return grid.placedPieces.map((placed, index) => {
      const definition = pieceById.get(placed.pieceId) || {}
      const merged = { ...definition, ...placed }
      return {
        ...merged,
        label: definition.label || placed.label || placed.pieceLabel || `Piece ${String.fromCharCode(65 + index)}`,
        cells: (placed.cells || shapeCellsFromOrigin(merged)).map(normalizeCell),
        layoutGradient: layoutGradient(placed.layoutColor || definition.layoutColor || placed.layoutGradient || definition.layoutGradient, index),
      }
    })
  }

  const legacy = grid.modules || grid.placedModules || []
  return legacy.map((piece, index) => ({
    ...piece,
    label: piece.label || piece.pieceLabel || `Piece ${String.fromCharCode(65 + index)}`,
    cells: (piece.cells || shapeCellsFromOrigin(piece)).map(normalizeCell),
    layoutGradient: layoutGradient(piece.layoutColor || piece.layoutGradient, index),
  }))
}

export default function ConsoleGrid({ consoleGrid, requiredPieces = [] }) {
  if (!consoleGrid || !consoleGrid.rows || !consoleGrid.cols) {
    return (
      <div className="rounded-3xl border border-dashed border-black/[0.08] bg-white/80 px-6 py-10 text-center text-sm text-[#6b7280]">
        {PLACEHOLDER}
      </div>
    )
  }

  const { rows, cols, blockedCells = [], caption } = consoleGrid
  const pieces = normalizePieces(consoleGrid, requiredPieces)
  const blocked = new Set(blockedCells.map(normalizeCell))
  const cellMeta = new Map()

  pieces.forEach((piece) => {
    piece.cells.forEach((cell) => {
      cellMeta.set(cell, { gradient: piece.layoutGradient, name: piece.label })
    })
  })

  const cells = []
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const key = keyOf(row, col)
      cells.push({
        key,
        isBlocked: blocked.has(key),
        piece: cellMeta.get(key),
      })
    }
  }

  return (
    <div className="space-y-5">
      {caption ? <p className="text-sm leading-relaxed text-[#6b7280]">{caption}</p> : null}

      <div className="flex flex-wrap gap-3 rounded-2xl border border-black/[0.06] bg-[#fafafa] px-4 py-3">
        {[
          ['Placed Piece', LAYOUT_GRADIENTS.cyan],
          ['Blocked Cell', null],
          ['Empty Cell', '#fbfbfa'],
        ].map(([label, background]) => (
          <div key={label} className="flex items-center gap-2 text-xs font-medium text-[#111111]">
            <span
              className="h-3 w-3 rounded-sm ring-1 ring-black/[0.08]"
              style={label === 'Blocked Cell' ? BLOCKED_STYLE : { background }}
            />
            {label}
          </div>
        ))}
      </div>

      <div
        className="mx-auto grid w-full max-w-[min(100%,420px)] rounded-3xl border border-black/[0.06] bg-white p-4 shadow-[0_18px_50px_rgba(0,0,0,0.05)] sm:p-5"
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          gap: '6px',
        }}
      >
        {cells.map(({ key, isBlocked, piece }) => {
          if (isBlocked) {
            return (
              <div
                key={key}
                className="aspect-square rounded-lg ring-1 ring-black/[0.06]"
                style={BLOCKED_STYLE}
                title="Blocked"
                aria-label="Blocked cell"
              />
            )
          }

          if (piece) {
            return (
              <div
                key={key}
                className="aspect-square rounded-lg ring-1 ring-black/[0.06]"
                style={{ background: piece.gradient, boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.42), 0 7px 14px rgba(15, 23, 42, 0.09)' }}
                title={piece.name}
                aria-label={`${piece.name} cell`}
              />
            )
          }

          return (
            <div
              key={key}
              className="aspect-square rounded-lg bg-[#fbfbfa] ring-1 ring-black/[0.055]"
              aria-label="Empty cell"
            />
          )
        })}
      </div>

      <ConsolePieceLegend pieces={pieces} />
    </div>
  )
}
