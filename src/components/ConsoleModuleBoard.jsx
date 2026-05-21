import { useEffect, useMemo, useRef, useState } from 'react'
import { Check, ChevronDown, Layers3, RotateCcw, Trash2 } from 'lucide-react'
import ModuleShape from './ModuleShape.jsx'
import { getModuleColor, getModuleShape } from '../data/moduleCatalog.js'
import {
  formatModuleStatValue,
  getModuleMainStats,
  getModulePieceByShapeAndRarity,
  getModulePossibleSubStats,
  getModuleShapeOptions,
} from '../data/modulePieces.js'
import {
  getCartridgeBonus,
  normalizeBlockedCells,
  normalizeModuleShapeRef,
  normalizePlacements,
} from '../utils/moduleShapeRefs.js'

const REAL_RARITIES = ['S', 'A', 'B']
const typeFilters = ['All', 'II', 'III', 'IV']
const shapeOptions = getModuleShapeOptions()

const BLOCKED_STYLE = {
  backgroundColor: '#eef0f3',
  backgroundImage:
    'repeating-linear-gradient(135deg, rgba(107, 114, 128, 0.12) 0px, rgba(107, 114, 128, 0.12) 4px, rgba(255, 255, 255, 0.55) 4px, rgba(255, 255, 255, 0.55) 9px)',
}

function keyOf(row, col) {
  return `${row},${col}`
}

function normalizedRarity(rarity = 'S') {
  return String(rarity || 'S').toUpperCase()
}

function layoutColorKey(value, fallback = 's') {
  const raw = String(value || fallback || 's').toLowerCase()
  const aliases = {
    'helper-1': 'group-green',
    'helper-2': 'group-blue',
    'helper-3': 'group-pink',
  }
  return aliases[raw] || raw
}

function visualColorForPlacement(placement, fallback = 's') {
  return layoutColorKey(
    placement?.pieceColor ||
      placement?.visualColor ||
      placement?.visualGroup ||
      placement?.layoutColor ||
      placement?.placementColor ||
      placement?.colorKey ||
      fallback,
  )
}

function placementIdOf(placement) {
  return String(placement?.placementId || placement?.id || '')
}

function createPlacementId(count = 0) {
  return `module-${Date.now()}-${count}-${Math.random().toString(36).slice(2, 8)}`
}

function pieceFor(shapeId, rarity) {
  return getModulePieceByShapeAndRarity(shapeId, normalizedRarity(rarity)) || getModulePieceByShapeAndRarity(shapeId, 'S')
}

function cellsForDraft(draft) {
  if (!draft) return []
  const shape = getModuleShape(draft.moduleShapeId || draft.shapeId)
  if (!shape?.matrix) return []
  const baseRow = Number.isFinite(Number(draft.row)) ? Number(draft.row) : 0
  const baseCol = Number.isFinite(Number(draft.col)) ? Number(draft.col) : 0
  return (shape.matrix || [[1]]).flatMap((row, rowOffset) =>
    row.map((cell, colOffset) => (cell ? [baseRow + rowOffset, baseCol + colOffset] : null)).filter(Boolean),
  )
}

function normalizePlacement(placement, index) {
  const source = placement && typeof placement === 'object' ? placement : {}
  const row = Number.isFinite(Number(source.row)) ? Number(source.row) : Number(source.y) || 0
  const col = Number.isFinite(Number(source.col)) ? Number(source.col) : Number(source.x) || 0
  const shapeId = source.moduleShapeId || source.shapeId || 'type-ii-horizontal'
  const rarity = normalizedRarity(source.rarity)
  const piece = pieceFor(shapeId, rarity)
  const fallbackId = `placed:${shapeId}:${row}:${col}`
  const placementId = placementIdOf(source) || fallbackId
  const draft = {
    id: placementId,
    placementId,
    modulePieceId: source.modulePieceId || piece?.id || '',
    moduleShapeId: piece?.shapeId || shapeId,
    shapeId: piece?.shapeId || shapeId,
    shapeName: piece?.shapeName || source.shapeName || getModuleShape(shapeId)?.name || '',
    rarity: piece?.rarity || rarity,
    pieceColor: visualColorForPlacement(source, piece?.rarity || rarity),
    visualColor: visualColorForPlacement(source, piece?.rarity || rarity),
    colorKey: visualColorForPlacement(source, piece?.rarity || rarity),
    visualGroup: visualColorForPlacement(source, piece?.rarity || rarity),
    moduleType: piece?.moduleType || source.moduleType || 'II',
    cellCount: piece?.cellCount || source.cellCount || 2,
    row,
    col,
    position: source.position || { row, col },
    cells: Array.isArray(source.cells) ? source.cells : [],
    mainStats: Array.isArray(source.mainStats) ? source.mainStats : [],
    subStats: Array.isArray(source.subStats) ? source.subStats.slice(0, 4).filter(Boolean) : [],
  }
  const serialized = serializePlacement(draft)
  if (!Array.isArray(source.cells) || !source.cells.length) return { ...serialized, cells: [] }
  return serialized
}

function serializePlacement(placement) {
  const piece = pieceFor(placement.moduleShapeId || placement.shapeId, placement.rarity)
  const placementId = placementIdOf(placement)
  const row = Number(placement.row) || 0
  const col = Number(placement.col) || 0
  const moduleType = piece?.moduleType || placement.moduleType || 'II'
  const cellCount = piece?.cellCount || placement.cellCount || cellsForDraft({ ...placement, row, col }).length
  return {
    id: placementId,
    placementId,
    modulePieceId: piece?.id || placement.modulePieceId || '',
    shapeId: piece?.shapeId || placement.shapeId || placement.moduleShapeId,
    moduleShapeId: piece?.shapeId || placement.moduleShapeId || placement.shapeId,
    shapeName: piece?.shapeName || placement.shapeName || '',
    rarity: piece?.rarity || normalizedRarity(placement.rarity),
    pieceColor: visualColorForPlacement(placement, piece?.rarity || placement.rarity),
    visualColor: visualColorForPlacement(placement, piece?.rarity || placement.rarity),
    colorKey: visualColorForPlacement(placement, piece?.rarity || placement.rarity),
    visualGroup: visualColorForPlacement(placement, piece?.rarity || placement.rarity),
    cells: cellsForDraft({ ...placement, moduleShapeId: piece?.shapeId || placement.moduleShapeId || placement.shapeId, row, col }),
    position: { row, col },
    row,
    col,
    moduleType,
    cellCount,
    mainStats: getModuleMainStats({ rarity: piece?.rarity || placement.rarity, moduleType }),
    subStats: Array.isArray(placement.subStats) ? placement.subStats.slice(0, 4).filter(Boolean) : [],
  }
}

function canPlace(grid, draft, ignoreId = null) {
  const blocked = new Set(normalizeBlockedCells(grid.blockedCells).map(([row, col]) => keyOf(row, col)))
  const occupied = new Set()
  ;(grid.placements || []).forEach((placement) => {
    if (placementIdOf(placement) === ignoreId) return
    cellsForDraft(placement).forEach(([row, col]) => occupied.add(keyOf(row, col)))
  })
  return cellsForDraft(draft).every(([row, col]) => {
    const key = keyOf(row, col)
    return row >= 0 && col >= 0 && row < grid.rows && col < grid.cols && !blocked.has(key) && !occupied.has(key)
  })
}

function dedupePlacementsById(placements = []) {
  const seen = new Set()
  return placements.filter((placement, index) => {
    const id = placementIdOf(placement)
    if (!id) return false
    if (seen.has(id)) {
      if (import.meta.env?.DEV) console.warn(`[NTE] Duplicate module placement ignored: ${id}`, { placement, index })
      return false
    }
    seen.add(id)
    return true
  })
}

function isValidPlacementOnBoard(placement, rows, cols, blockedCells = []) {
  if (!placement || placement.preview || placement.dragging || placement.deleted) return false
  const id = placementIdOf(placement)
  if (!id) return false
  const cells = Array.isArray(placement.cells) ? placement.cells : []
  if (!cells.length) return false
  const blocked = new Set(normalizeBlockedCells(blockedCells).map(([row, col]) => keyOf(row, col)))
  return cells.every((cell) => {
    if (!Array.isArray(cell)) return false
    const row = Number(cell[0])
    const col = Number(cell[1])
    return Number.isFinite(row) && Number.isFinite(col) && row >= 0 && col >= 0 && row < rows && col < cols && !blocked.has(keyOf(row, col))
  })
}

function isPointInside(element, x, y) {
  if (!element || !Number.isFinite(Number(x)) || !Number.isFinite(Number(y))) return false
  const rect = element.getBoundingClientRect()
  return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom
}

function rarityStyles(rarity = 'S') {
  const key = normalizedRarity(rarity)
  if (key === 'A') return { fill: '#d946ef', soft: '#fdf4ff', ring: 'rgba(217,70,239,0.30)', text: 'text-fuchsia-900', chip: 'bg-fuchsia-50 text-fuchsia-800 ring-fuchsia-100' }
  if (key === 'B') return { fill: '#22d3ee', soft: '#ecfeff', ring: 'rgba(34,211,238,0.28)', text: 'text-cyan-900', chip: 'bg-cyan-50 text-cyan-800 ring-cyan-100' }
  return { fill: '#f59e0b', soft: '#fffbeb', ring: 'rgba(245,158,11,0.30)', text: 'text-amber-900', chip: 'bg-amber-50 text-amber-800 ring-amber-100' }
}

function placementColor(placement) {
  return getModuleColor(visualColorForPlacement(placement, placement?.rarity)).hex
}

function countByShape(shapeIds) {
  const map = new Map()
  shapeIds.filter(Boolean).forEach((shapeId) => map.set(shapeId, (map.get(shapeId) || 0) + 1))
  return map
}

function getSetProgress(placements, requiredShapeIds) {
  const requiredCounts = countByShape(requiredShapeIds)
  const placedCounts = countByShape(placements.map((placement) => placement.shapeId || placement.moduleShapeId))
  const matched = [...requiredCounts.entries()].reduce((total, [shapeId, count]) => total + Math.min(count, placedCounts.get(shapeId) || 0), 0)
  const matchedShapeIds = [...requiredCounts.keys()].filter((shapeId) => (placedCounts.get(shapeId) || 0) > 0)
  const total = requiredShapeIds.length || 4
  return {
    matched,
    total,
    matchedShapeIds,
    twoPieceActive: requiredShapeIds.length >= 2 && matched >= 2,
    fourPieceActive: requiredShapeIds.length >= 4 && matched >= 4,
  }
}

export default function ConsoleModuleBoard({
  placements = [],
  onChange,
  rows = 7,
  cols = 7,
  blockedCells = [],
  compatibleShapeIds = [],
  compatibilityPending = true,
  selectedCartridge = null,
  requiredSetPieces = [],
}) {
  const [selectedShapeId, setSelectedShapeId] = useState('')
  const [selectedRarity, setSelectedRarity] = useState('S')
  const [typeFilter, setTypeFilter] = useState('All')
  const [selectedPlacementId, setSelectedPlacementId] = useState(null)
  const [drag, setDrag] = useState(null)
  const [ghost, setGhost] = useState(null)
  const [deleteHover, setDeleteHover] = useState(false)
  const gridRef = useRef(null)
  const deleteZoneRef = useRef(null)
  const suppressCellClickRef = useRef(false)

  const placementList = useMemo(() => normalizePlacements(placements), [placements])
  const normalizedPlacements = useMemo(() => dedupePlacementsById(placementList.map(normalizePlacement)), [placementList])
  const safeBlockedCells = useMemo(() => normalizeBlockedCells(blockedCells), [blockedCells])
  const validPlacedModules = useMemo(
    () => normalizedPlacements.filter((placement) => isValidPlacementOnBoard(placement, rows, cols, safeBlockedCells)),
    [cols, normalizedPlacements, rows, safeBlockedCells],
  )
  const availableShapes = useMemo(() => {
    return shapeOptions.filter((shape) => typeFilter === 'All' || shape.moduleType === typeFilter)
  }, [typeFilter])
  const setPieces = useMemo(() => {
    const fromCartridge = Array.isArray(requiredSetPieces) && requiredSetPieces.length
      ? requiredSetPieces
      : compatibleShapeIds.map((moduleShapeId, index) => ({ slot: index + 1, moduleShapeId }))
    return fromCartridge
      .map(normalizeModuleShapeRef)
      .filter(Boolean)
      .slice(0, 4)
  }, [compatibleShapeIds, requiredSetPieces])
  const requiredShapeIds = useMemo(() => setPieces.map((piece) => piece.moduleShapeId).filter(Boolean), [setPieces])
  const setProgress = useMemo(() => getSetProgress(validPlacedModules, requiredShapeIds), [validPlacedModules, requiredShapeIds])

  useEffect(() => {
    if (validPlacedModules.length !== normalizedPlacements.length) {
      if (import.meta.env?.DEV) {
        console.warn('[NTE] Invalid or stale module placements were ignored and cleaned from the board state.', {
          totalPlacements: normalizedPlacements.length,
          validPlacements: validPlacedModules.length,
          invalidPlacements: normalizedPlacements.filter((placement) => !isValidPlacementOnBoard(placement, rows, cols, safeBlockedCells)),
        })
      }
      onChange?.(validPlacedModules.map(serializePlacement))
      if (selectedPlacementId && !validPlacedModules.some((placement) => placementIdOf(placement) === selectedPlacementId)) setSelectedPlacementId(null)
    }
  }, [cols, normalizedPlacements, onChange, rows, safeBlockedCells, selectedPlacementId, validPlacedModules])

  useEffect(() => {
    if (!availableShapes.length) {
      setSelectedShapeId('')
      return
    }
    if (!availableShapes.some((shape) => shape.id === selectedShapeId)) setSelectedShapeId(availableShapes[0].id)
  }, [availableShapes, selectedShapeId])

  const grid = useMemo(() => ({ rows, cols, blockedCells: safeBlockedCells, placements: validPlacedModules }), [cols, rows, safeBlockedCells, validPlacedModules])
  const selectedShape = availableShapes.find((shape) => shape.id === selectedShapeId) || availableShapes[0] || null
  const selectedPlacement = validPlacedModules.find((placement) => placementIdOf(placement) === selectedPlacementId) || null
  const hasSetRequirements = Boolean(selectedCartridge && requiredShapeIds.length)

  const placementByCell = useMemo(() => {
    const map = new Map()
    validPlacedModules.forEach((placement) => {
      cellsForDraft(placement).forEach(([row, col]) => map.set(keyOf(row, col), placement))
    })
    return map
  }, [validPlacedModules])

  const emitPlacements = (next) => onChange?.(dedupePlacementsById(next.map(serializePlacement)))

  const draftAt = (row, col, shapeId = selectedShape?.id, rarity = selectedRarity, placementId = '', visualColor = rarity) => {
    const piece = pieceFor(shapeId, rarity)
    const color = visualColorForPlacement({ pieceColor: visualColor }, piece?.rarity || rarity)
    return {
      id: placementId,
      placementId,
      modulePieceId: piece?.id || '',
      moduleShapeId: piece?.shapeId || shapeId,
      shapeId: piece?.shapeId || shapeId,
      rarity: piece?.rarity || normalizedRarity(rarity),
      pieceColor: color,
      visualColor: color,
      colorKey: color,
      visualGroup: color,
      moduleType: piece?.moduleType || 'II',
      cellCount: piece?.cellCount || 2,
      row,
      col,
      subStats: [],
    }
  }

  const cellFromPointer = (clientX, clientY) => {
    const rect = gridRef.current?.getBoundingClientRect()
    if (!rect) return null
    const gap = 6
    const style = window.getComputedStyle(gridRef.current)
    const padding = Number.parseFloat(style.paddingLeft) || 24
    const cellSize = (rect.width - padding * 2 - gap * (cols - 1)) / cols
    const x = clientX - rect.left - padding
    const y = clientY - rect.top - padding
    const col = Math.floor(x / (cellSize + gap))
    const row = Math.floor(y / (cellSize + gap))
    if (row < 0 || col < 0 || row >= rows || col >= cols) return null
    return { row, col }
  }

  const updateGhostFromPointer = (clientX, clientY, dragState = drag) => {
    if (!dragState) {
      setGhost(null)
      return
    }
    const cell = cellFromPointer(clientX, clientY)
    if (!cell) {
      setGhost(null)
      return
    }
    const draft = draftAt(cell.row, cell.col, dragState.shapeId, dragState.rarity, dragState.placementId || '', dragState.visualColor || dragState.pieceColor || dragState.colorKey || dragState.rarity)
    setGhost({ ...draft, valid: canPlace(grid, draft, dragState.mode === 'move' ? dragState.placementId : null) })
  }

  const startDrag = (event, shapeId) => {
    event.preventDefault()
    event.currentTarget.setPointerCapture?.(event.pointerId)
    setSelectedShapeId(shapeId)
    const shape = getModuleShape(shapeId)
    const nextDrag = { mode: 'create', pointerId: event.pointerId, shapeId, type: shape?.type || '', rarity: selectedRarity, x: event.clientX, y: event.clientY }
    setDrag(nextDrag)
    updateGhostFromPointer(event.clientX, event.clientY, nextDrag)
  }

  const moveDrag = (event) => {
    if (!drag) return
    const nextDrag = { ...drag, x: event.clientX, y: event.clientY }
    setDrag(nextDrag)
    setDeleteHover(nextDrag.mode === 'move' && isPointInside(deleteZoneRef.current, event.clientX, event.clientY))
    updateGhostFromPointer(event.clientX, event.clientY, nextDrag)
  }

  const finishDrag = (event) => {
    const pointerX = Number.isFinite(Number(event?.clientX)) ? event.clientX : drag?.x
    const pointerY = Number.isFinite(Number(event?.clientY)) ? event.clientY : drag?.y
    const overDeleteZone = drag?.mode === 'move' && isPointInside(deleteZoneRef.current, pointerX, pointerY)
    suppressCellClickRef.current = Boolean(drag)
    window.setTimeout(() => {
      suppressCellClickRef.current = false
    }, 0)
    if (overDeleteZone) {
      removePlacement(drag.placementId)
      setDrag(null)
      setGhost(null)
      setDeleteHover(false)
      return
    }
    if (ghost?.valid) {
      const { valid, ...placement } = ghost
      if (drag?.mode === 'move') {
        emitPlacements(validPlacedModules.map((item) => (
          placementIdOf(item) === drag.placementId
            ? {
                ...item,
                row: placement.row,
                col: placement.col,
                position: placement.position,
                cells: placement.cells,
                id: drag.placementId,
                placementId: drag.placementId,
              }
            : item
        )))
        setSelectedPlacementId(drag.placementId)
      } else if (drag?.mode === 'create') {
        const placementId = createPlacementId(validPlacedModules.length)
        emitPlacements([...validPlacedModules, { ...placement, id: placementId, placementId }])
        setSelectedPlacementId(placementId)
      }
    }
    setDrag(null)
    setGhost(null)
    setDeleteHover(false)
  }

  const handleCellClick = (row, col) => {
    if (suppressCellClickRef.current || drag) return
    const existing = placementByCell.get(keyOf(row, col))
    if (existing) {
      setSelectedPlacementId(existing.id)
      return
    }
    const draft = draftAt(row, col)
    if (selectedShape && canPlace(grid, draft)) {
      const placementId = createPlacementId(validPlacedModules.length)
      emitPlacements([...validPlacedModules, { ...draft, id: placementId, placementId }])
      setSelectedPlacementId(placementId)
    }
  }

  const startPlacementDrag = (event, placement) => {
    if (!placement) return
    event.preventDefault()
    event.stopPropagation()
    event.currentTarget.setPointerCapture?.(event.pointerId)
    const placementId = placementIdOf(placement)
    setSelectedPlacementId(placementId)
    suppressCellClickRef.current = true
    const nextDrag = {
      mode: 'move',
      pointerId: event.pointerId,
      placementId,
      originalCells: placement.cells,
      payload: placement,
      shapeId: placement.shapeId || placement.moduleShapeId,
      type: placement.moduleType || placement.typeCode || '',
      rarity: placement.rarity,
      pieceColor: visualColorForPlacement(placement, placement.rarity),
      visualColor: visualColorForPlacement(placement, placement.rarity),
      colorKey: visualColorForPlacement(placement, placement.rarity),
      x: event.clientX,
      y: event.clientY,
    }
    setDrag(nextDrag)
    updateGhostFromPointer(event.clientX, event.clientY, nextDrag)
  }

  useEffect(() => {
    if (!drag) return undefined
    const handlePointerMove = (event) => {
      if (drag.pointerId != null && event.pointerId != null && event.pointerId !== drag.pointerId) return
      event.preventDefault()
      moveDrag(event)
    }
    const handlePointerUp = (event) => {
      if (drag.pointerId != null && event.pointerId != null && event.pointerId !== drag.pointerId) return
      event.preventDefault()
      finishDrag(event)
    }
    const handlePointerCancel = (event) => {
      if (drag.pointerId != null && event.pointerId != null && event.pointerId !== drag.pointerId) return
      setDrag(null)
      setGhost(null)
      setDeleteHover(false)
    }
    window.addEventListener('pointermove', handlePointerMove, { passive: false })
    window.addEventListener('pointerup', handlePointerUp, { passive: false })
    window.addEventListener('pointercancel', handlePointerCancel)
    document.body.style.userSelect = 'none'
    document.body.style.cursor = drag.mode === 'move' ? 'grabbing' : 'grab'
    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
      window.removeEventListener('pointercancel', handlePointerCancel)
      document.body.style.userSelect = ''
      document.body.style.cursor = ''
    }
  }, [drag, finishDrag, moveDrag])

  const updatePlacement = (id, patch) => {
    emitPlacements(validPlacedModules.map((placement) => (placementIdOf(placement) === id ? { ...placement, ...patch } : placement)))
  }

  const removePlacement = (id) => {
    emitPlacements(validPlacedModules.filter((placement) => placementIdOf(placement) !== id))
    if (selectedPlacementId === id) setSelectedPlacementId(null)
  }

  const cells = []
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const key = keyOf(row, col)
      const ghostPlacement = ghost && cellsForDraft(ghost).some(([r, c]) => r === row && c === col) ? ghost : null
      cells.push({ row, col, key, placement: placementByCell.get(key), ghost: ghostPlacement })
    }
  }

  return (
    <div className="space-y-4">
      <SetRequirementPanel
        cartridge={selectedCartridge}
        pieces={setPieces}
        progress={setProgress}
        rarity={selectedRarity}
        compatibilityPending={compatibilityPending}
      />

      <div className="grid gap-3 xl:grid-cols-[minmax(0,500px)_minmax(300px,1fr)] xl:items-stretch">
        <div className="rounded-[28px] border border-black/[0.06] bg-[#fafafa] p-3 shadow-inner sm:p-4">
          <div className="mb-2.5 flex flex-wrap items-start justify-between gap-2.5">
            <div>
              <h3 className="text-sm font-black uppercase tracking-wide text-[#111111]">Console Board</h3>
              <p className="mt-1 text-xs font-semibold text-[#6b7280]">Drag a module in, or select a shape and click a valid cell.</p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <StatusPill label="Placed modules" value={String(validPlacedModules.length)} />
              {hasSetRequirements ? <StatusPill label="Required matched" value={`${setProgress.matched} / ${setProgress.total}`} active={setProgress.matched > 0} /> : null}
            </div>
          </div>

          <div
            ref={gridRef}
            className="grid w-full max-w-[min(100%,456px)] rounded-[24px] border border-black/[0.06] bg-white p-3 shadow-[0_18px_52px_rgba(0,0,0,0.06)] sm:p-3.5 xl:mr-auto"
            style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gap: '6px' }}
            onMouseLeave={() => setGhost(null)}
          >
            {cells.map(({ row, col, key, placement, ghost: cellGhost }) => {
              const isBlocked = safeBlockedCells.some(([r, c]) => r === row && c === col)
              const activePlacement = placement && placement.id === selectedPlacementId
              const ghostColor = cellGhost ? placementColor(cellGhost) : null
              const setMatch = placement && requiredShapeIds.includes(placement.shapeId)
              return (
                <button
                  key={key}
                  type="button"
                  draggable={false}
                  onPointerDown={(event) => placement && startPlacementDrag(event, placement)}
                  onDragStart={(event) => event.preventDefault()}
                  onClick={() => handleCellClick(row, col)}
                  className="aspect-square touch-none select-none rounded-lg ring-1 ring-black/[0.06] transition hover:ring-[#ff2f6d]/30"
                  style={
                    cellGhost
                      ? {
                          backgroundColor: ghostColor,
                          opacity: cellGhost.valid ? 0.5 : 0.22,
                          boxShadow: cellGhost.valid ? `inset 0 0 0 2px ${rarityStyles(cellGhost.rarity).ring}, 0 0 0 2px rgba(255,47,109,0.08)` : 'inset 0 0 0 2px rgba(107,114,128,0.42)',
                        }
                      : isBlocked
                        ? BLOCKED_STYLE
                        : placement
                          ? {
                              backgroundColor: placementColor(placement),
                              boxShadow: activePlacement
                                ? `0 0 0 2px ${rarityStyles(placement.rarity).ring}, inset 0 1px 0 rgba(255,255,255,0.45)`
                                : setMatch
                                  ? '0 0 0 2px rgba(255,47,109,0.12), inset 0 1px 0 rgba(255,255,255,0.45)'
                                  : 'inset 0 1px 0 rgba(255,255,255,0.45)',
                            }
                          : { backgroundColor: '#fbfbfa' }
                  }
                  aria-label={`Console cell ${row + 1}, ${col + 1}`}
                >
                  <span className="sr-only">{placement ? `${placement.rarity} module` : 'Empty cell'}</span>
                </button>
              )
            })}
          </div>
        </div>

        <ModuleShapeLibrary
          deleteZoneRef={deleteZoneRef}
          shapes={availableShapes}
          selectedShapeId={selectedShape?.id}
          rarity={selectedRarity}
          typeFilter={typeFilter}
          onTypeFilterChange={setTypeFilter}
          onRarityChange={setSelectedRarity}
          onSelectShape={setSelectedShapeId}
          onStartDrag={startDrag}
          drag={drag}
          deleteHover={deleteHover}
        />
      </div>

      <ModuleEditorPanel
          placement={selectedPlacement}
          onUpdate={(patch) => selectedPlacement && updatePlacement(selectedPlacement.id, patch)}
          onRemove={() => selectedPlacement && removePlacement(selectedPlacement.id)}
          onClear={() => {
            emitPlacements([])
            setSelectedPlacementId(null)
          }}
        />

      {drag ? (
        <>
          {drag.mode === 'move' ? (
            <div className="pointer-events-none fixed bottom-5 left-1/2 z-[130] -translate-x-1/2 rounded-full border border-rose-100 bg-rose-50/95 px-4 py-2 text-xs font-black text-rose-700 shadow-[0_18px_60px_rgba(0,0,0,0.12)]">
              Drop on the remove zone to delete
            </div>
          ) : null}
          <div className="pointer-events-none fixed z-[130] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-black/[0.08] bg-white/70 p-2.5 opacity-80 shadow-[0_18px_60px_rgba(0,0,0,0.12)] backdrop-blur-md" style={{ left: drag.x + 18, top: drag.y + 18 }}>
            <ModuleShape shapeId={drag.shapeId} rarity={drag.rarity} colorKey={drag.pieceColor || drag.visualColor || drag.colorKey || drag.rarity} size={10} />
          </div>
        </>
      ) : null}
    </div>
  )
}

function SetRequirementPanel({ cartridge, pieces, progress, rarity, compatibilityPending }) {
  if (!cartridge) {
    return (
      <section className="rounded-[24px] border border-dashed border-black/[0.08] bg-white/80 p-4 shadow-sm">
        <p className="text-[11px] font-black uppercase tracking-wide text-[#ff2f6d]">Selected Cartridge / Set Requirements</p>
        <p className="mt-2 text-sm font-semibold text-[#6b7280]">Select a cartridge first to see required set pieces.</p>
      </section>
    )
  }

  const hasShapes = pieces.some((piece) => piece.moduleShapeId)
  const bonus2 = getCartridgeBonus(cartridge, 2)
  const bonus4 = getCartridgeBonus(cartridge, 4)

  return (
    <section className="rounded-[24px] border border-black/[0.06] bg-[#fafafa] p-4 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <p className="text-[11px] font-black uppercase tracking-wide text-[#ff2f6d]">Selected Cartridge / Set Requirements</p>
          <h3 className="mt-1 truncate text-lg font-black text-[#111111]">{cartridge.name || 'Selected cartridge'}</h3>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <StatusPill label="Required placed" value={`${progress.matched} / ${progress.total}`} active={progress.matched > 0} />
          <StatusPill label="2-piece" value={progress.twoPieceActive ? 'Active' : 'Inactive'} active={progress.twoPieceActive} />
          <StatusPill label="4-piece" value={progress.fourPieceActive ? 'Active' : 'Inactive'} active={progress.fourPieceActive} />
        </div>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(180px,0.45fr)]">
        <div className="grid gap-2 md:grid-cols-2">
          <BonusTextCard title="2-piece bonus" text={bonus2?.text || '2-piece bonus data pending.'} active={progress.twoPieceActive} />
          <BonusTextCard title="4-piece bonus" text={bonus4?.text || '4-piece bonus data pending.'} active={progress.fourPieceActive} />
        </div>
        <div className="rounded-2xl bg-white p-3 ring-1 ring-black/[0.05]">
          <p className="text-[10px] font-black uppercase tracking-wide text-[#9ca3af]">Required Shapes</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {pieces.length ? pieces.map((piece, index) => {
              const shapeId = piece.moduleShapeId
              const placed = shapeId ? progress.matchedShapeIds?.includes(shapeId) : false
              return (
                <div key={`${piece.slot}-${shapeId || index}`} className={['flex h-9 min-w-9 items-center justify-center rounded-xl border bg-white px-1.5 shadow-sm', placed ? 'border-[#ff2f6d]/20 ring-2 ring-[#ff2f6d]/8' : 'border-black/[0.06]'].join(' ')} title={`Piece ${piece.slot || index + 1}`}>
                  {shapeId ? <ModuleShape shapeId={shapeId} rarity={rarity} size={6} compact /> : <span className="text-[10px] font-bold text-[#9ca3af]">?</span>}
                </div>
              )
            }) : (
              <span className="rounded-full bg-[#fafafa] px-2.5 py-1.5 text-[11px] font-bold text-[#9ca3af] ring-1 ring-black/[0.05]">Unavailable</span>
            )}
          </div>
          {compatibilityPending || !hasShapes ? <p className="mt-2 text-[11px] font-semibold text-[#9ca3af]">Shape IDs are not populated for this cartridge yet.</p> : null}
        </div>
      </div>
    </section>
  )
}

function ModuleShapeLibrary({ deleteZoneRef, shapes, selectedShapeId, rarity, typeFilter, onTypeFilterChange, onRarityChange, onSelectShape, onStartDrag, drag, deleteHover }) {
  return (
    <aside className="flex min-h-[360px] flex-col rounded-[24px] border border-black/[0.06] bg-[#fafafa] p-3 shadow-sm xl:min-h-[560px]">
      <div className="mb-2 space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-sm font-black uppercase tracking-wide text-[#111111]">Module Library</h3>
            <p className="mt-0.5 text-xs font-semibold text-[#6b7280]">All module shapes.</p>
          </div>
          <span className="rounded-full bg-white px-2 py-1 text-[10px] font-black text-[#6b7280] ring-1 ring-black/[0.05]">{shapes.length}</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <ModuleRaritySelector value={rarity} onChange={onRarityChange} />
          <FilterPills options={typeFilters} value={typeFilter} onChange={onTypeFilterChange} />
        </div>
      </div>
      <div className="scrollbar-hide flex-1 overflow-y-auto pr-0.5">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(52px,1fr))] gap-2">
          {shapes.map((shape) => (
            <button
              key={shape.id}
              type="button"
              draggable={false}
              title={shape.name}
              onPointerDown={(event) => onStartDrag(event, shape.id)}
              onDragStart={(event) => event.preventDefault()}
              onClick={() => onSelectShape(shape.id)}
              className={['flex aspect-square min-h-[52px] touch-none select-none items-center justify-center rounded-[14px] border bg-white/80 p-0 transition hover:bg-white hover:shadow-sm', selectedShapeId === shape.id ? 'border-[#ff2f6d]/30 ring-2 ring-[#ff2f6d]/10' : 'border-black/[0.06]'].join(' ')}
            >
              <ModuleShape shapeId={shape.id} rarity={rarity} size={6.5} />
            </button>
          ))}
        </div>
      </div>
      {drag?.mode === 'move' ? (
        <div
          ref={deleteZoneRef}
          className={[
            'mt-3 rounded-2xl border px-3 py-3 shadow-sm transition',
            deleteHover ? 'border-rose-200 bg-rose-50 text-rose-800 ring-2 ring-rose-100' : 'border-rose-100 bg-white/80 text-rose-700',
          ].join(' ')}
        >
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600 ring-1 ring-rose-100">
              <Trash2 className="h-4 w-4" strokeWidth={1.8} />
            </span>
            <div>
              <p className="text-xs font-black">Drop here to remove</p>
              <p className="mt-0.5 text-[11px] font-semibold opacity-80">Remove this placed module from the board</p>
            </div>
          </div>
        </div>
      ) : null}
    </aside>
  )
}

function CompactSetBonusGuide({ cartridge, pieces, progress, rarity, compatibilityPending }) {
  if (!cartridge) {
    return (
      <div className="mb-3 rounded-2xl border border-dashed border-black/[0.08] bg-white/80 p-3 text-sm font-semibold text-[#6b7280] shadow-sm">
        Select a console cartridge first to see required set pieces.
      </div>
    )
  }
  const hasShapes = pieces.some((piece) => piece.moduleShapeId)
  const bonus2 = getCartridgeBonus(cartridge, 2)
  const bonus4 = getCartridgeBonus(cartridge, 4)
  return (
    <div className="mb-2.5 rounded-2xl border border-black/[0.05] bg-white/80 p-2 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-[10px] font-black uppercase tracking-wide text-[#ff2f6d]">Required Module Shapes</p>
          <p className="mt-0.5 text-xs font-semibold text-[#6b7280]">{cartridge.name || 'Selected set'} activation pieces</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {pieces.length ? pieces.map((piece, index) => {
            const shapeId = piece.moduleShapeId
            const placed = shapeId ? progress.matchedShapeIds?.includes(shapeId) : false
            return (
              <div key={`${piece.slot}-${shapeId || index}`} className={['flex h-8 min-w-8 items-center justify-center rounded-xl border bg-white px-1 shadow-sm', placed ? 'border-[#ff2f6d]/20 ring-2 ring-[#ff2f6d]/8' : 'border-black/[0.06]'].join(' ')} title={`Piece ${piece.slot || index + 1}`}>
                {shapeId ? <ModuleShape shapeId={shapeId} rarity={rarity} size={5.5} compact /> : <span className="text-[10px] font-bold text-[#9ca3af]">?</span>}
              </div>
            )
          }) : <span className="rounded-full bg-[#fafafa] px-2 py-1 text-[10px] font-bold text-[#9ca3af] ring-1 ring-black/[0.05]">Set pieces unavailable</span>}
        </div>
      </div>
      <div className="mt-2 grid gap-2 lg:grid-cols-2">
        <BonusTextCard title="2-piece bonus" text={bonus2?.text || '2-piece bonus data pending.'} active={progress.twoPieceActive} />
        <BonusTextCard title="4-piece bonus" text={bonus4?.text || '4-piece bonus data pending.'} active={progress.fourPieceActive} />
      </div>
      {compatibilityPending || !hasShapes ? <p className="mt-2 text-[11px] font-semibold text-[#9ca3af]">Required set pieces are unavailable for this cartridge until valid module shape IDs are added. The Module Library still shows all available shapes.</p> : null}
    </div>
  )
}

function SetBonusRequirements({ cartridge, pieces, progress, rarity, compatibilityPending }) {
  if (!cartridge) return null
  const bonus2 = getCartridgeBonus(cartridge, 2)
  const bonus4 = getCartridgeBonus(cartridge, 4)
  const hasShapes = pieces.some((piece) => piece.moduleShapeId)

  return (
    <section className="rounded-[24px] border border-black/[0.06] bg-[#fafafa] p-4 shadow-sm">
      <div className="flex flex-col gap-3">
        <div>
          <p className="text-[11px] font-black uppercase tracking-wide text-[#ff2f6d]">Required Set Pieces</p>
          <h3 className="mt-1 text-lg font-black tracking-tight text-[#111111]">{cartridge.name || 'Selected cartridge'}</h3>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-[#6b7280]">Place these module shapes to activate the selected cartridge&apos;s 2-piece and 4-piece bonuses.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label="Required pieces placed" value={`${progress.matched} / ${progress.total}`} />
          <StatusPill label="2-piece" value={progress.twoPieceActive ? 'Active' : 'Inactive'} active={progress.twoPieceActive} />
          <StatusPill label="4-piece" value={progress.fourPieceActive ? 'Active' : 'Inactive'} active={progress.fourPieceActive} />
        </div>
      </div>

      <div className="mt-4 grid gap-3">
        <div className="grid gap-2">
          <BonusTextCard title="2-piece bonus" text={bonus2?.text || '2-piece bonus data pending.'} active={progress.twoPieceActive} />
          <BonusTextCard title="4-piece bonus" text={bonus4?.text || '4-piece bonus data pending.'} active={progress.fourPieceActive} />
        </div>
        <div className="grid grid-cols-2 gap-2">
          {pieces.length ? pieces.map((piece, index) => {
            const shapeId = piece.moduleShapeId
            const placed = shapeId ? progress.matchedShapeIds?.includes(shapeId) : false
            return (
              <div key={`${piece.slot}-${shapeId || index}`} className={['rounded-2xl border bg-white p-3 text-center shadow-sm', placed ? 'border-[#ff2f6d]/18 ring-2 ring-[#ff2f6d]/8' : 'border-black/[0.06]'].join(' ')}>
                {shapeId ? (
                  <ModuleShape shapeId={shapeId} rarity={rarity} size={10} />
                ) : (
                  <div className="flex h-[42px] items-center justify-center rounded-xl border border-dashed border-black/[0.08] bg-[#fafafa] text-[10px] font-bold text-[#9ca3af]">Pending</div>
                )}
                <p className="mt-2 text-[11px] font-black uppercase tracking-wide text-[#6b7280]">Piece {piece.slot || index + 1}</p>
              </div>
            )
          }) : (
            <p className="col-span-2 rounded-2xl border border-dashed border-black/[0.08] bg-white px-4 py-5 text-center text-sm font-semibold text-[#9ca3af]">Set activation pieces are pending for this cartridge.</p>
          )}
        </div>
      </div>
      {compatibilityPending || !hasShapes ? <p className="mt-3 text-xs font-semibold text-[#9ca3af]">Required set pieces are unavailable for this cartridge until valid module shape IDs are added. The Module Library still shows all available shapes.</p> : null}
    </section>
  )
}

function BonusTextCard({ title, text, active }) {
  return (
    <article className={['rounded-2xl border p-3 shadow-sm', active ? 'border-[#ff2f6d]/14 bg-white' : 'border-black/[0.05] bg-white/75'].join(' ')}>
      <div className={['mb-2 inline-flex rounded-full px-2.5 py-1 text-[11px] font-black ring-1', active ? 'bg-[#fff7fa] text-[#ff2f6d] ring-[#ff2f6d]/12' : 'bg-[#fafafa] text-[#9ca3af] ring-black/[0.05]'].join(' ')}>
        {title}: {active ? 'Active' : 'Inactive'}
      </div>
      <p className="text-sm leading-5 text-[#4b5563]">{text}</p>
    </article>
  )
}

function ModuleRaritySelector({ value, onChange }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="w-12 text-[10px] font-bold uppercase tracking-wide text-[#9ca3af]">Rarity</span>
      {REAL_RARITIES.map((rarity) => (
        <button key={rarity} type="button" onClick={() => onChange(rarity)} className={['rounded-full px-2.5 py-1 text-[11px] font-black ring-1 transition', value === rarity ? rarityStyles(rarity).chip : 'bg-white text-[#6b7280] ring-black/[0.06]'].join(' ')}>
          {rarity}
        </button>
      ))}
    </div>
  )
}

function FilterPills({ options, value, onChange }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="w-12 text-[10px] font-bold uppercase tracking-wide text-[#9ca3af]">Type</span>
      {options.map((option) => (
        <button key={option} type="button" onClick={() => onChange(option)} className={['rounded-full px-2.5 py-1 text-[11px] font-black ring-1 transition', value === option ? 'bg-[#111111] text-white ring-[#111111]' : 'bg-white text-[#6b7280] ring-black/[0.06]'].join(' ')}>
          {option}
        </button>
      ))}
    </div>
  )
}

function ModuleEditorPanel({ placement, onUpdate, onRemove, onClear }) {
  if (!placement) {
    return (
      <aside className="flex flex-col gap-3 rounded-[22px] border border-dashed border-black/[0.08] bg-white/80 p-4 text-center shadow-sm sm:flex-row sm:items-center sm:justify-between sm:text-left">
        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#ff2f6d]/10 text-[#ff2f6d]">
          <Layers3 className="h-5 w-5" strokeWidth={1.8} />
          </div>
          <div>
            <h3 className="text-base font-black text-[#111111]">Select a module</h3>
            <p className="mt-1 text-xs leading-5 text-[#6b7280]">Placed modules can be edited here after you select one on the board.</p>
          </div>
        </div>
        <button type="button" onClick={onClear} className="inline-flex items-center justify-center gap-2 rounded-full border border-black/[0.07] bg-white px-3 py-2 text-xs font-bold text-[#6b7280] shadow-sm transition hover:text-[#111111]">
          <RotateCcw className="h-4 w-4" strokeWidth={1.8} />
          Clear board
        </button>
      </aside>
    )
  }

  const mainStats = getModuleMainStats({ rarity: placement.rarity, moduleType: placement.moduleType })
  const subOptions = getModulePossibleSubStats({ rarity: placement.rarity, cellCount: placement.cellCount })
  const subStats = Array.from({ length: 4 }, (_, index) => placement.subStats?.[index] || '')
  const updateSubStat = (index, statId) => {
    onUpdate({ subStats: subStats.map((item, itemIndex) => (itemIndex === index ? statId : item)).filter(Boolean) })
  }

  return (
    <aside className="rounded-[22px] border border-black/[0.06] bg-white p-3.5 shadow-sm">
      <div className="grid gap-3 lg:grid-cols-[220px_minmax(170px,0.55fr)_minmax(220px,0.9fr)_minmax(260px,1.1fr)] lg:items-start">
        <div className="flex items-start justify-between gap-3 lg:block">
          <div>
            <h3 className="text-base font-black text-[#111111]">Module Config</h3>
            <p className="mt-1 text-xs font-semibold text-[#6b7280]">Max level values.</p>
          </div>
          <button type="button" onClick={onRemove} className="flex h-9 w-9 items-center justify-center rounded-full border border-black/[0.08] bg-[#fafafa] text-[#6b7280] transition hover:text-[#111111] lg:mt-3" aria-label="Remove module">
            <Trash2 className="h-4 w-4" strokeWidth={1.8} />
          </button>
          <div className="mt-3 hidden items-center gap-3 rounded-2xl bg-[#fafafa] p-2.5 ring-1 ring-black/[0.04] lg:flex">
            <ModuleShape shapeId={placement.shapeId} rarity={placement.rarity} colorKey={visualColorForPlacement(placement, placement.rarity)} size={8} />
            <div className="min-w-0">
              <p className="truncate text-sm font-black text-[#111111]">Type {placement.moduleType}</p>
              <p className="text-xs font-semibold text-[#6b7280]">{placement.cellCount} cells / {placement.rarity}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-2xl bg-[#fafafa] p-2.5 ring-1 ring-black/[0.04] lg:hidden">
          <ModuleShape shapeId={placement.shapeId} rarity={placement.rarity} colorKey={visualColorForPlacement(placement, placement.rarity)} size={8} />
          <div className="min-w-0">
            <p className="truncate text-sm font-black text-[#111111]">Type {placement.moduleType} Module</p>
            <p className="text-xs font-semibold text-[#6b7280]">{placement.cellCount} cells / {placement.rarity} rank</p>
          </div>
        </div>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wide text-[#9ca3af]">Rarity</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {REAL_RARITIES.map((rarity) => (
              <button key={rarity} type="button" onClick={() => onUpdate({ rarity })} className={['rounded-full px-3 py-1 text-xs font-black ring-1 transition', placement.rarity === rarity ? rarityStyles(rarity).chip : 'bg-white text-[#6b7280] ring-black/[0.06]'].join(' ')}>
                {rarity}
              </button>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-black/[0.05] bg-[#fafafa] p-2.5">
          <p className="text-[11px] font-bold uppercase tracking-wide text-[#9ca3af]">Locked Main Stats</p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {mainStats.map((stat) => (
              <div key={stat.statId} className="rounded-xl bg-white px-3 py-2 shadow-sm ring-1 ring-black/[0.04]">
                <p className="text-[10px] font-black uppercase tracking-wide text-[#9ca3af]">{stat.stat?.name || stat.statId}</p>
                <p className="mt-0.5 text-sm font-black text-[#111111]">{stat.formattedValue}</p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wide text-[#9ca3af]">Sub Stats</p>
          <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-1 2xl:grid-cols-2">
            {subStats.map((statId, index) => {
              const selected = subStats.filter(Boolean)
              return (
                <CustomDropdown
                  key={index}
                  value={statId}
                  placeholder={`Sub stat ${index + 1}`}
                  onChange={(value) => updateSubStat(index, value)}
                  options={[
                    { value: '', label: `Sub stat ${index + 1}` },
                    ...subOptions.map((option) => {
                    const duplicate = selected.includes(option.statId) && statId !== option.statId
                      return {
                        value: option.statId,
                        label: `${option.stat?.name || option.statId} ${formatModuleStatValue(option.statId, option.value)}`,
                        disabled: duplicate,
                      }
                    }),
                  ]}
                />
              )
            })}
          </div>
        </div>
      </div>
    </aside>
  )
}

function CustomDropdown({ value, placeholder, options, onChange }) {
  const [open, setOpen] = useState(false)
  const selected = options.find((option) => option.value === value)

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex h-10 w-full items-center justify-between gap-3 rounded-full border border-black/[0.06] bg-white px-3 text-left text-sm font-bold text-[#111111] shadow-sm outline-none transition hover:border-[#ff2f6d]/18 hover:bg-[#fffafa]"
      >
        <span className={selected?.value ? 'truncate' : 'truncate text-[#9ca3af]'}>{selected?.label || placeholder}</span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-[#9ca3af] transition ${open ? 'rotate-180' : ''}`} strokeWidth={2} />
      </button>
      {open ? (
        <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-40 max-h-56 overflow-y-auto rounded-2xl border border-black/[0.07] bg-white p-1.5 shadow-[0_18px_50px_rgba(0,0,0,0.12)]">
          {options.map((option) => {
            const active = option.value === value
            return (
              <button
                key={option.value || 'empty'}
                type="button"
                disabled={option.disabled}
                onClick={() => {
                  if (option.disabled) return
                  onChange(option.value)
                  setOpen(false)
                }}
                className={[
                  'flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2 text-left text-xs font-bold transition',
                  active ? 'bg-[#fff7fa] text-[#ff2f6d]' : 'text-[#4b5563] hover:bg-[#fafafa]',
                  option.disabled ? 'cursor-not-allowed opacity-40 hover:bg-transparent' : '',
                ].join(' ')}
              >
                <span className="min-w-0 truncate">{option.label}</span>
                {active ? <Check className="h-3.5 w-3.5 shrink-0" strokeWidth={2.2} /> : null}
              </button>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}

function StatusPill({ label, value, active = false }) {
  return (
    <span className={`rounded-full px-3 py-1.5 text-xs font-black ring-1 ${active ? 'bg-[#fff7fa] text-[#ff2f6d] ring-[#ff2f6d]/15' : 'bg-white text-[#6b7280] ring-black/[0.06]'}`}>
      {label}: <span className="text-[#111111]">{value}</span>
    </span>
  )
}
