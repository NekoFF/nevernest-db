import assert from 'node:assert/strict'
import test from 'node:test'
import { mapApiModulePieceToViewModel } from '../../../src/repositories/api/mappers/mapApiModuleToViewModel.js'

test('module API mapper preserves DB shape external id and rarity label', () => {
  const piece = mapApiModulePieceToViewModel({
    id: 'module-db-id',
    externalId: 'module-s-type-iv-z-left',
    slug: 'module-s-type-iv-z-left',
    name: 'S Rank Type IV Module',
    moduleType: 'IV',
    moduleShapeId: 'shape-db-id',
    moduleShape: {
      id: 'shape-db-id',
      externalId: 'type-iv-z-left',
      slug: 'type-iv-z-left',
      name: 'Type IV Z left',
      cellCount: 4,
    },
    rarity: {
      id: 'rarity-db-id',
      externalId: 's',
      label: 'S',
      displayName: 'S',
    },
    sourceStatus: 'unknown',
  })

  assert.equal(piece.id, 'module-s-type-iv-z-left')
  assert.equal(piece.shapeId, 'type-iv-z-left')
  assert.equal(piece.rarity, 'S')
  assert.equal(piece.moduleType, 'IV')
  assert.equal(piece.cellCount, 4)
})
