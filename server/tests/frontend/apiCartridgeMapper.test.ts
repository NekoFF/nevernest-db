import assert from 'node:assert/strict'
import test from 'node:test'
import { mapApiCartridgeToViewModel } from '../../../src/repositories/api/mappers/mapApiCartridgeToViewModel.js'

test('cartridge API mapper normalizes detail bonus effectText for UI display', () => {
  const cartridge = mapApiCartridgeToViewModel({
    id: 'db-id',
    externalId: 'devils-blood-curse',
    slug: 'devils-blood-curse',
    name: "Devil's Blood: Curse",
    sourceStatus: 'needs_verification',
    bonuses: [
      { pieces: 2, effectText: 'Damage bonus text.', isConditional: false, sourceStatus: 'needs_verification' },
      { pieces: 4, effectText: 'Four-piece bonus text.', isConditional: true, sourceStatus: 'needs_verification' },
    ],
  })

  assert.equal(cartridge.bonuses[0].text, 'Damage bonus text.')
  assert.equal(cartridge.bonuses[0].effectText, 'Damage bonus text.')
  assert.equal(cartridge.bonuses[1].text, 'Four-piece bonus text.')
  assert.equal(cartridge.bonuses[1].sourceStatus, 'needs_verification')
})

test('cartridge API mapper keeps compatible shape objects usable by cards and details', () => {
  const cartridge = mapApiCartridgeToViewModel({
    id: 'db-id',
    externalId: 'lost-radiance',
    slug: 'lost-radiance',
    name: 'Lost Radiance',
    compatibleShapes: [
      {
        slotIndex: 1,
        shapeExternalId: 'type-ii-horizontal',
        shape: { externalId: 'type-ii-horizontal', name: 'Type II Horizontal' },
        sourceStatus: 'needs_verification',
      },
    ],
  })

  assert.equal(cartridge.compatibleModules[0].slot, 1)
  assert.equal(cartridge.compatibleModules[0].moduleShapeId, 'type-ii-horizontal')
  assert.deepEqual(cartridge.compatibleModuleShapeIds, ['type-ii-horizontal'])
})
