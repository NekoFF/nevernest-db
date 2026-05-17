export const MODULE_RARITIES = {
  S: { label: 'S', colorKey: 's', className: 'bg-amber-400 ring-amber-500/30', hex: '#f59e0b' },
  A: { label: 'A', colorKey: 'a', className: 'bg-fuchsia-400 ring-fuchsia-500/30', hex: '#d946ef' },
  B: { label: 'B', colorKey: 'b', className: 'bg-cyan-400 ring-cyan-500/30', hex: '#22d3ee' },
}

export const MODULE_LAYOUT_COLORS = {
  s: { label: 'S', className: 'bg-amber-400 ring-amber-500/30', hex: '#f59e0b', isRarity: true },
  a: { label: 'A', className: 'bg-fuchsia-400 ring-fuchsia-500/30', hex: '#d946ef', isRarity: true },
  b: { label: 'B', className: 'bg-cyan-400 ring-cyan-500/30', hex: '#22d3ee', isRarity: true },
  'helper-1': { label: 'H1', className: 'bg-emerald-400 ring-emerald-500/30', hex: '#34d399', isRarity: false },
  'helper-2': { label: 'H2', className: 'bg-sky-400 ring-sky-500/30', hex: '#38bdf8', isRarity: false },
  'helper-3': { label: 'H3', className: 'bg-rose-400 ring-rose-500/30', hex: '#fb7185', isRarity: false },
}

export function getModuleColor(value = 's') {
  const key = String(value).toLowerCase()
  return MODULE_LAYOUT_COLORS[key] || MODULE_RARITIES[String(value).toUpperCase()] || MODULE_LAYOUT_COLORS.s
}

export const MODULE_SHAPES = [
  { id: 'type-ii-horizontal', type: 'Type II', name: 'Type II horizontal', matrix: [[1, 1]] },
  { id: 'type-ii-vertical', type: 'Type II', name: 'Type II vertical', matrix: [[1], [1]] },
  { id: 'type-iii-horizontal', type: 'Type III', name: 'Type III horizontal', matrix: [[1, 1, 1]] },
  { id: 'type-iii-vertical', type: 'Type III', name: 'Type III vertical', matrix: [[1], [1], [1]] },
  { id: 'type-iii-l-bottom-right', type: 'Type III', name: 'Type III L bottom right', matrix: [[1, 0], [1, 1]] },
  { id: 'type-iii-l-top-right', type: 'Type III', name: 'Type III L top right', matrix: [[1, 1], [1, 0]] },
  { id: 'type-iii-l-top-left', type: 'Type III', name: 'Type III L top left', matrix: [[0, 1], [1, 1]] },
  { id: 'type-iii-l-bottom-left', type: 'Type III', name: 'Type III L bottom left', matrix: [[1, 1], [0, 1]] },
  { id: 'type-iv-horizontal', type: 'Type IV', name: 'Type IV horizontal', matrix: [[1, 1, 1, 1]] },
  { id: 'type-iv-vertical', type: 'Type IV', name: 'Type IV vertical', matrix: [[1], [1], [1], [1]] },
  { id: 'type-iv-z-left', type: 'Type IV', name: 'Type IV Z left', matrix: [[0, 1, 1], [1, 1, 0]] },
  { id: 'type-iv-z-right', type: 'Type IV', name: 'Type IV Z right', matrix: [[0, 1], [1, 1], [1, 0]] },
]

export const MODULE_SHAPE_BY_ID = new Map(MODULE_SHAPES.map((shape) => [shape.id, shape]))

export function getModuleShape(id) {
  const key = String(id || '')
  return MODULE_SHAPE_BY_ID.get(key) || { id: key || 'shape-missing', type: 'Missing', name: 'Shape pending', matrix: [[1]], isPlaceholder: true }
}

export function normalizeShapeId(id) {
  const aliases = {
    'type-iii-line-vertical': 'type-iii-vertical',
    'type-iii-line-horizontal': 'type-iii-horizontal',
    'type-iv-z-vertical': 'type-iv-z-right',
  }
  return aliases[id] || id || 'type-ii-horizontal'
}
