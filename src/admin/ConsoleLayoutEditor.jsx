import { useEffect, useMemo, useRef, useState } from 'react'
import { Trash2, X } from 'lucide-react'
import ModuleShape from '../components/ModuleShape.jsx'
import { getModuleColor, getModuleShape, MODULE_LAYOUT_COLORS } from '../data/moduleCatalog.js'
import { normalizeConsole } from '../data/consoleBlocks.js'
import {
  getModulePieceById,
  getModulePieceByShapeAndRarity,
  getModulePieceStats,
  getModuleShapeOptions,
} from '../data/modulePieces.js'

const BLOCKED_STYLE = {
  backgroundColor: '#eef0f3',
  backgroundImage:
    'repeating-linear-gradient(135deg, rgba(107, 114, 128, 0.13) 0px, rgba(107, 114, 128, 0.13) 4px, rgba(255, 255, 255, 0.42) 4px, rgba(255, 255, 255, 0.42) 9px)',
}

const REAL_RARITIES = ['S', 'A', 'B']
const VISUAL_GROUP_COLORS = ['group-pink', 'group-blue', 'group-green', 'group-purple', 'group-amber', 'group-cyan']
const typeFilters = ['All', 'II', 'III', 'IV']
const shapeOptions = getModuleShapeOptions()

function keyOf(row, col) {
  return `${row},${col}`
}

function realRarityFromColor(color) {
  const value = String(color || 'S').toUpperCase()
  return REAL_RARITIES.includes(value) ? value : 'S'
}

function layoutColorKey(value) {
  const raw = String(value || 's').toLowerCase()
  const aliases = {
    'helper-1': 'group-green',
    'helper-2': 'group-blue',
    'helper-3': 'group-pink',
  }
  return aliases[raw] || raw
}

function visualColorForPlacement(placement) {
  return layoutColorKey(placement.visualGroup || placement.layoutColor || placement.placementColor || placement.colorKey || placement.rarity)
}

function cellsForPlacement(placement) {
  const shape = getModuleShape(placement.moduleShapeId)
  return shape.matrix.flatMap((row, rowOffset) =>
    row.map((cell, colOffset) => (cell ? [placement.row + rowOffset, placement.col + colOffset] : null)).filter(Boolean),
  )
}

function canPlace(grid, draft, ignoreId = null) {
  const blocked = new Set((grid.blockedCells || []).map(([row, col]) => keyOf(row, col)))
  const occupied = new Set()
  ;(grid.placements || []).forEach((placement) => {
    if (placement.id === ignoreId) return
    cellsForPlacement(placement).forEach(([row, col]) => occupied.add(keyOf(row, col)))
  })

  return cellsForPlacement(draft).every(([row, col]) => {
    const key = keyOf(row, col)
    return row >= 0 && col >= 0 && row < grid.rows && col < grid.cols && !blocked.has(key) && !occupied.has(key)
  })
}

function cleanConsole(consoleData) {
  return {
    ...consoleData,
    grid: {
      rows: Number(consoleData.grid.rows) || 7,
      cols: Number(consoleData.grid.cols) || 7,
      blockedCells: consoleData.grid.blockedCells || [],
      placements: (consoleData.grid.placements || [])
        .filter((placement) => canPlace(consoleData.grid, placement, placement.id))
        .map((placement) => {
          const visualGroup = visualColorForPlacement(placement)
          return { ...placement, colorKey: visualGroup, visualGroup }
        }),
    },
  }
}

function colorHex(placement) {
  return getModuleColor(visualColorForPlacement(placement)).hex
}

function placementFromShape(shapeId, color) {
  const rarity = realRarityFromColor(color)
  const piece = getModulePieceByShapeAndRarity(shapeId, rarity) || getModulePieceByShapeAndRarity(shapeId, 'S')
  return {
    modulePieceId: piece.id,
    moduleShapeId: piece.shapeId,
    rarity: piece.rarity,
    colorKey: layoutColorKey(color || piece.rarity),
    visualGroup: layoutColorKey(color || piece.rarity),
    moduleType: `Type ${piece.moduleType}`,
    fixedMainStats: piece.fixedMainStats,
    subStats: [],
  }
}

export default function ConsoleLayoutEditor({ character, open, onClose, onSave }) {
  const [consoleData, setConsoleData] = useState(null)
  const [mode, setMode] = useState('place')
  const [selectedShapeId, setSelectedShapeId] = useState(shapeOptions[0]?.id || 'type-ii-horizontal')
  const [selectedColor, setSelectedColor] = useState('S')
  const [typeFilter, setTypeFilter] = useState('All')
  const [message, setMessage] = useState('')
  const [drag, setDrag] = useState(null)
  const [ghost, setGhost] = useState(null)
  const gridRef = useRef(null)

  useEffect(() => {
    if (!open || !character) return
    setConsoleData(normalizeConsole(character) || normalizeConsole({ console: { title: 'Console Setup', grid: { rows: 7, cols: 7, blockedCells: [], placements: [] } } }))
    setMessage('')
    setDrag(null)
    setGhost(null)
  }, [character, open])

  const placementByCell = useMemo(() => {
    const map = new Map()
    ;(consoleData?.grid.placements || []).forEach((placement) => {
      cellsForPlacement(placement).forEach(([row, col]) => map.set(keyOf(row, col), placement))
    })
    return map
  }, [consoleData])

  if (!open || !character || !consoleData) return null

  const grid = consoleData.grid
  const blocked = new Set((grid.blockedCells || []).map(([row, col]) => keyOf(row, col)))
  const selectedPiece = getModulePieceByShapeAndRarity(selectedShapeId, realRarityFromColor(selectedColor))
  const selectedColorMeta = getModuleColor(selectedColor)
  const filteredShapes = shapeOptions.filter((shape) => typeFilter === 'All' || shape.moduleType === typeFilter)

  const updateGrid = (patch) => setConsoleData((current) => ({ ...current, grid: { ...current.grid, ...patch } }))

  const draftAt = (row, col, shapeId = selectedShapeId, color = selectedColor) => ({
    id: `layout-piece-${Date.now()}`,
    ...placementFromShape(shapeId, color),
    row,
    col,
    rotation: 0,
  })

  const cellFromPointer = (clientX, clientY) => {
    const rect = gridRef.current?.getBoundingClientRect()
    if (!rect) return null
    const gap = 6
    const innerPadding = 16
    const x = clientX - rect.left - innerPadding
    const y = clientY - rect.top - innerPadding
    const cellSize = (rect.width - innerPadding * 2 - gap * (grid.cols - 1)) / grid.cols
    const col = Math.floor(x / (cellSize + gap))
    const row = Math.floor(y / (cellSize + gap))
    if (row < 0 || col < 0 || row >= grid.rows || col >= grid.cols) return null
    return { row, col }
  }

  const updateGhostFromPointer = (clientX, clientY, dragState = drag) => {
    if (!dragState || mode !== 'place') {
      setGhost(null)
      return
    }
    const cell = cellFromPointer(clientX, clientY)
    if (!cell) {
      setGhost(null)
      return
    }
    const draft = draftAt(cell.row, cell.col, dragState.shapeId, dragState.color)
    setGhost({ ...draft, valid: canPlace(grid, draft) })
  }

  const startDrag = (event, shapeId) => {
    if (mode !== 'place') return
    event.currentTarget.setPointerCapture?.(event.pointerId)
    setSelectedShapeId(shapeId)
    const nextDrag = { shapeId, color: selectedColor, x: event.clientX, y: event.clientY }
    setDrag(nextDrag)
    updateGhostFromPointer(event.clientX, event.clientY, nextDrag)
  }

  const moveDrag = (event) => {
    if (!drag) return
    const nextDrag = { ...drag, x: event.clientX, y: event.clientY }
    setDrag(nextDrag)
    updateGhostFromPointer(event.clientX, event.clientY, nextDrag)
  }

  const finishDrag = () => {
    if (ghost?.valid) {
      const { valid, ...placement } = ghost
      updateGrid({ placements: [...grid.placements, placement] })
      setMessage('Module placed.')
    } else if (drag) {
      setMessage('Cannot place module there.')
    }
    setDrag(null)
    setGhost(null)
  }

  const handleCellClick = (row, col) => {
    const key = keyOf(row, col)
    if (mode === 'blocked') {
      const nextBlocked = blocked.has(key)
        ? grid.blockedCells.filter(([r, c]) => r !== row || c !== col)
        : [...grid.blockedCells, [row, col]]
      updateGrid({ blockedCells: nextBlocked })
      return
    }

    const existing = placementByCell.get(key)
    if (existing) {
      updateGrid({ placements: grid.placements.filter((placement) => placement.id !== existing.id) })
      setMessage('Removed module.')
    }
  }

  const save = () => {
    onSave?.(character.id, { console: cleanConsole(consoleData) })
    onClose?.()
  }

  const updatePlacement = (id, patch) => {
    updateGrid({ placements: grid.placements.map((placement) => placement.id === id ? { ...placement, ...patch } : placement) })
  }

  const cells = []
  for (let row = 0; row < grid.rows; row += 1) {
    for (let col = 0; col < grid.cols; col += 1) {
      const key = keyOf(row, col)
      const ghostPlacement = ghost && cellsForPlacement(ghost).some(([r, c]) => r === row && c === col) ? ghost : null
      cells.push({ row, col, key, placement: placementByCell.get(key), ghost: ghostPlacement })
    }
  }

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4" role="dialog" aria-modal="true" onPointerMove={moveDrag} onPointerUp={finishDrag} onPointerCancel={finishDrag}>
      <button type="button" className="absolute inset-0 bg-black/35 backdrop-blur-sm" aria-label="Close console layout editor" onClick={onClose} />
      <div className="relative z-[111] flex max-h-[min(90vh,860px)] w-full max-w-5xl flex-col overflow-hidden rounded-[28px] border border-white/70 bg-white/95 shadow-[0_30px_100px_rgba(0,0,0,0.2)] backdrop-blur-xl">
        <div className="flex items-start justify-between gap-4 border-b border-black/[0.06] px-6 py-5 sm:px-8">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-[#111111]">Edit Console Layout</h2>
            <p className="mt-1 text-sm text-[#6b7280]">{character.name} grid and module placement</p>
          </div>
          <button type="button" onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-2xl border border-black/[0.06] bg-[#fafafa] text-[#6b7280]"><X className="h-4 w-4" /></button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 sm:px-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex rounded-[14px] border border-black/[0.06] bg-[#fafafa] p-1">
              {[
                ['place', 'Place Modules'],
                ['blocked', 'Edit Blocked Cells'],
              ].map(([id, label]) => (
                <button key={id} type="button" onClick={() => { setMode(id); setGhost(null); setDrag(null) }} className={['rounded-xl px-3 py-2 text-xs font-semibold', mode === id ? 'bg-white text-[#111111] shadow-sm' : 'text-[#6b7280]'].join(' ')}>
                  {label}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => updateGrid({ placements: [] })} className="rounded-full border border-black/[0.08] bg-white px-4 py-2 text-sm font-semibold text-[#b45309]">Clear placements</button>
              <button type="button" onClick={() => updateGrid({ blockedCells: [] })} className="rounded-full border border-black/[0.08] bg-white px-4 py-2 text-sm font-semibold text-[#6b7280]">Clear blocked</button>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <div>
              <div ref={gridRef} className="mx-auto grid w-full max-w-[min(100%,460px)] rounded-3xl border border-black/[0.06] bg-white p-4 shadow-[0_18px_50px_rgba(0,0,0,0.05)]" style={{ gridTemplateColumns: `repeat(${grid.cols}, minmax(0, 1fr))`, gap: '6px' }}>
                {cells.map(({ row, col, key, placement, ghost: cellGhost }) => {
                  const isBlocked = blocked.has(key)
                  const placementColor = placement ? colorHex(placement) : null
                  const ghostColor = cellGhost ? colorHex(cellGhost) : null
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleCellClick(row, col)}
                      className="aspect-square rounded-lg ring-1 ring-black/[0.06] transition hover:ring-[#ff2f6d]/30"
                      style={
                        cellGhost
                          ? { backgroundColor: ghostColor, opacity: cellGhost.valid ? 0.42 : 0.2, boxShadow: cellGhost.valid ? 'inset 0 0 0 2px rgba(17,17,17,0.12)' : 'inset 0 0 0 2px rgba(220,38,38,0.45)' }
                          : isBlocked
                            ? BLOCKED_STYLE
                            : placement
                              ? { backgroundColor: placementColor, opacity: mode === 'blocked' ? 0.28 : 1 }
                              : { backgroundColor: '#fbfbfa' }
                      }
                      aria-label={`Console cell ${row + 1}, ${col + 1}`}
                    />
                  )
                })}
              </div>
              {message ? <p className="mt-3 text-center text-sm font-semibold text-[#6b7280]">{message}</p> : null}
            </div>

            <aside className="space-y-4 rounded-3xl border border-black/[0.06] bg-white p-4 shadow-[0_16px_48px_rgba(0,0,0,0.05)]">
              <div>
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#6b7280]">Module Shapes</p>
                    <p className="mt-1 text-[11px] text-[#9ca3af]">S/A/B are real rarity. Extra colors are visual groups only.</p>
                  </div>
                  <span className="rounded-full bg-[#fafafa] px-2 py-1 text-[10px] font-semibold text-[#6b7280] ring-1 ring-black/[0.05]">{filteredShapes.length} shapes</span>
                </div>
                <div className="mt-3 space-y-2">
                  <FilterPills label="Type" options={typeFilters} value={typeFilter} onChange={setTypeFilter} />
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="w-16 text-[10px] font-bold uppercase tracking-wide text-[#9ca3af]">Rarity</span>
                    {REAL_RARITIES.map((rarity) => (
                      <button key={rarity} type="button" onClick={() => setSelectedColor(rarity)} className={['rounded-full px-2.5 py-1 text-[11px] font-bold ring-1', selectedColor === rarity ? 'bg-[#111111] text-white ring-[#111111]' : 'bg-white text-[#6b7280] ring-black/[0.06]'].join(' ')}>
                        {rarity}
                      </button>
                    ))}
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="w-16 text-[10px] font-bold uppercase tracking-wide text-[#9ca3af]">Visual</span>
                    {VISUAL_GROUP_COLORS.map((key) => {
                      const color = MODULE_LAYOUT_COLORS[key]
                      return (
                        <button key={key} type="button" onClick={() => setSelectedColor(key)} className={['h-7 w-7 rounded-full ring-2 transition', selectedColor === key ? 'ring-[#111111]' : 'ring-black/[0.08]'].join(' ')} style={{ backgroundColor: color.hex }} title={`${color.label} visual group color`}>
                          <span className="sr-only">{color.label}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[#6b7280]">Picker</p>
                <div className="mt-2 max-h-[300px] overflow-y-auto pr-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  <div className="grid grid-cols-4 gap-2">
                    {filteredShapes.map((shape) => (
                      <button
                        key={shape.id}
                        type="button"
                        title={shape.name}
                        onPointerDown={(event) => startDrag(event, shape.id)}
                        onClick={() => setSelectedShapeId(shape.id)}
                        className={['flex aspect-square items-center justify-center rounded-2xl border bg-[#fafafa] p-2 transition hover:bg-white hover:shadow-sm', selectedShapeId === shape.id ? 'border-[#ff2f6d]/30 ring-2 ring-[#ff2f6d]/10' : 'border-black/[0.06]'].join(' ')}
                      >
                        <ModuleShape shapeId={shape.id} rarity={realRarityFromColor(selectedColor)} colorKey={selectedColor} size={10} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[#6b7280]">Selected</p>
                <div className="mt-2 flex items-center gap-3 rounded-2xl bg-[#fafafa] px-3 py-3 ring-1 ring-black/[0.04]">
                  <ModuleShape shapeId={selectedShapeId} rarity={realRarityFromColor(selectedColor)} colorKey={selectedColor} size={12} />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#111111]">Type {selectedPiece?.moduleType || '?'} Module</p>
                    <p className="text-xs text-[#6b7280]">{selectedColorMeta.isRarity ? `${realRarityFromColor(selectedColor)} rarity` : `${selectedColorMeta.label} visual group`} - ATK + HP locked</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[#6b7280]">Placed</p>
                <div className="mt-2 max-h-44 space-y-2 overflow-y-auto pr-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {grid.placements?.length ? grid.placements.map((placement) => {
                    const piece = getModulePieceById(placement.modulePieceId)
                    const { fixedMainStats, allowedSubStats } = getModulePieceStats(piece)
                    const subStats = Array.isArray(placement.subStats) ? placement.subStats.slice(0, piece?.maxSubStats || 4) : []
                    return (
                      <div key={placement.id} className="space-y-2 rounded-2xl bg-[#fafafa] px-3 py-2 ring-1 ring-black/[0.04]">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <ModuleShape shapeId={placement.moduleShapeId} rarity={placement.rarity} colorKey={visualColorForPlacement(placement)} size={9} compact />
                            <span className="text-xs font-semibold text-[#6b7280]">{placement.rarity} Type {piece?.moduleType || '?'} - {getModuleColor(visualColorForPlacement(placement)).isRarity ? 'rarity color' : 'visual group'}</span>
                          </div>
                          <button type="button" onClick={() => updateGrid({ placements: grid.placements.filter((item) => item.id !== placement.id) })} className="text-[#b45309]" aria-label="Remove placement"><Trash2 className="h-4 w-4" /></button>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {fixedMainStats.map((stat) => (
                            <span key={stat.id} className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-[#111111] ring-1 ring-black/[0.05]">{stat.name}</span>
                          ))}
                        </div>
                        <div className="grid gap-1.5">
                          {[0, 1, 2, 3].map((index) => (
                            <select key={index} value={subStats[index] || ''} onChange={(event) => {
                              const next = [...subStats]
                              next[index] = event.target.value
                              updatePlacement(placement.id, { subStats: next.filter(Boolean) })
                            }} className="h-8 rounded-xl border border-black/[0.08] bg-white px-2 text-xs">
                              <option value="">Sub stat {index + 1}</option>
                              {allowedSubStats.map((stat) => <option key={stat.id} value={stat.id}>{stat.name}</option>)}
                            </select>
                          ))}
                        </div>
                      </div>
                    )
                  }) : <p className="text-sm text-[#9ca3af]">No modules placed.</p>}
                </div>
              </div>
            </aside>
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-black/[0.06] px-6 py-5 sm:px-8">
          <button type="button" onClick={onClose} className="rounded-full border border-black/[0.08] bg-[#fafafa] px-5 py-2 text-sm font-semibold text-[#6b7280]">Cancel</button>
          <button type="button" onClick={save} className="rounded-full bg-[#111111] px-5 py-2 text-sm font-semibold text-white">Save</button>
        </div>
      </div>

      {drag ? (
        <div className="pointer-events-none fixed z-[130] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-black/[0.08] bg-white/85 p-3 shadow-[0_18px_60px_rgba(0,0,0,0.16)] backdrop-blur-md" style={{ left: drag.x, top: drag.y }}>
          <ModuleShape shapeId={drag.shapeId} rarity={realRarityFromColor(drag.color)} colorKey={drag.color} size={14} />
        </div>
      ) : null}
    </div>
  )
}

function FilterPills({ label, options, value, onChange }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="w-12 text-[10px] font-bold uppercase tracking-wide text-[#9ca3af]">{label}</span>
      {options.map((option) => (
        <button key={option} type="button" onClick={() => onChange(option)} className={['rounded-full px-2.5 py-1 text-[11px] font-bold ring-1', value === option ? 'bg-[#111111] text-white ring-[#111111]' : 'bg-white text-[#6b7280] ring-black/[0.06]'].join(' ')}>
          {option}
        </button>
      ))}
    </div>
  )
}
