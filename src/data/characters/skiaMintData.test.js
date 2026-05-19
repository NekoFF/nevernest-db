import assert from 'node:assert/strict'
import test from 'node:test'

import { getCharacterById } from './index.js'
import { getWeaponsByIds } from '../weapons.js'
import { getCartridgeById } from '../cartridges.js'

test('Skia and Mint structured detail data loads', () => {
  const skia = getCharacterById('skia')
  const mint = getCharacterById('mint')

  assert.equal(skia?.sourceStatus, 'needs_verification')
  assert.equal(mint?.sourceStatus, 'needs_verification')
  assert.equal(skia.levelStats.keyframes.length, 3)
  assert.equal(mint.levelStats.keyframes.length, 3)
  assert.equal(skia.skills.some((skill) => skill.id === 'shadow-hound-chase'), true)
  assert.equal(mint.skills.some((skill) => skill.id === 'perfect-containment'), true)
})

test('Nanally canonical detail data remains untouched', () => {
  const nanally = getCharacterById('nanally')

  assert.equal(nanally?.rarity, 'S')
  assert.equal(nanally?.levelStats?.keyframes?.[0]?.hp, 1320)
  assert.equal(nanally?.consoleTrait?.moduleType, 'II')
})

test('Skia and Mint recommendations resolve existing ids where possible', () => {
  const skia = getCharacterById('skia')
  const mint = getCharacterById('mint')

  const weaponIds = [
    ...skia.build.recommendedWeapons.map((item) => item.weaponId),
    ...mint.build.recommendedWeapons.map((item) => item.weaponId),
  ]
  const resolvedWeapons = getWeaponsByIds(weaponIds)
  assert.equal(resolvedWeapons.length, new Set(weaponIds).size)

  const cartridgeIds = [
    ...skia.build.recommendedCartridges.map((item) => item.cartridgeId),
    ...mint.build.recommendedCartridges.map((item) => item.cartridgeId),
  ]
  cartridgeIds.forEach((id) => assert.ok(getCartridgeById(id), `Expected cartridge id to resolve: ${id}`))
})

test('source-pending conflicts remain visible in structured notes', () => {
  const skia = getCharacterById('skia')
  const mint = getCharacterById('mint')
  const skiaConflictText = skia.overview.blocks.find((block) => block.id === 'skia-source-conflicts')?.items.join(' ')
  const mintConflictText = mint.overview.blocks.find((block) => block.id === 'mint-source-conflicts')?.items.join(' ')

  assert.match(skiaConflictText, /Gas/)
  assert.match(skiaConflictText, /Plasma/)
  assert.match(mintConflictText, /Thunderous Whirlwind Slash/)
  assert.match(mint.skills.find((skill) => skill.id === 'ultimate-thunderous-whirlwind-slash').attributes[0].values.find((value) => value.label === 'CD').value, /25s \/ possible 15s conflict/)
})
