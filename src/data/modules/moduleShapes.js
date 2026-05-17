/** Geometry adapter for DB-style modules. Source shapes live in `../moduleCatalog.js`. */
import { MODULE_SHAPES } from '../moduleCatalog.js'

const shapeMeta = [
  ['type-ii-horizontal', 1, 'II', 'horizontal', 1],
  ['type-ii-vertical', 2, 'II', 'vertical', 2],
  ['type-iii-horizontal', 3, 'III', 'line-horizontal', 1],
  ['type-iii-vertical', 4, 'III', 'line-vertical', 2],
  ['type-iii-l-bottom-right', 5, 'III', 'l-bl', 3],
  ['type-iii-l-top-right', 6, 'III', 'l-tl', 4],
  ['type-iii-l-top-left', 7, 'III', 'l-tr', 5],
  ['type-iii-l-bottom-left', 8, 'III', 'l-br', 6],
  ['type-iv-horizontal', 9, 'IV', 'line-horizontal', 1],
  ['type-iv-vertical', 10, 'IV', 'line-vertical', 2],
  ['type-iv-z-left', 11, 'IV', 'z-horizontal', 3],
  ['type-iv-z-right', 12, 'IV', 'z-vertical', 4],
]

function cellsFromMatrix(matrix) {
  return matrix.flatMap((row, y) => row.map((cell, x) => (cell ? [x, y] : null)).filter(Boolean))
}

export const moduleShapes = shapeMeta.map(([sourceId, id, typeCode, shapeKey, sortOrder]) => {
  const shape = MODULE_SHAPES.find((item) => item.id === sourceId)
  const matrix = shape?.matrix || [[1]]
  return {
    id,
    typeCode,
    shapeKey,
    width: matrix[0]?.length || 1,
    height: matrix.length || 1,
    cells: cellsFromMatrix(matrix),
    sortOrder,
  }
})
