import assert from 'node:assert/strict'
import test from 'node:test'
import { mapApiWeaponToViewModel } from '../../../src/repositories/api/mappers/mapApiWeaponToViewModel.js'

test('weapon API mapper groups growth stat rows by level for detail table display', () => {
  const weapon = mapApiWeaponToViewModel({
    id: 'weapon-db-id',
    externalId: 'test-arc',
    slug: 'test-arc',
    name: 'Test Arc',
    mainStatId: 'stat-atk',
    mainStat: { externalId: 'atk', label: 'ATK', displayName: 'ATK' },
    mainStatValue: 666,
    subStatId: 'stat-crit-rate',
    subStat: { externalId: 'crit_rate', label: 'Critical Rate', displayName: 'Critical Rate' },
    subStatValue: 12,
    growthScaling: [
      { level: 1, statId: 'stat-atk', stat: { externalId: 'atk', label: 'ATK' }, value: 31, valueText: '31', sourceStatus: 'needs_verification' },
      { level: 1, statId: 'stat-crit-rate', stat: { externalId: 'crit_rate', label: 'Critical Rate' }, value: 4.8, valueText: '4.8', sourceStatus: 'needs_verification' },
      { level: 20, statId: 'stat-atk', stat: { externalId: 'atk', label: 'ATK' }, value: 129, valueText: '129', sourceStatus: 'needs_verification' },
      { level: 20, statId: 'stat-crit-rate', stat: { externalId: 'crit_rate', label: 'Critical Rate' }, value: 6, valueText: '6', sourceStatus: 'needs_verification' },
    ],
  })

  assert.equal(weapon.growthScaling.length, 2)
  assert.equal(weapon.subStat.value, '12%')
  assert.deepEqual(weapon.growthScaling[0], {
    level: 1,
    atk: '31',
    subStatType: 'Critical Rate',
    subStatValue: '4.8%',
    sourceStatus: 'needs_verification',
  })
  assert.equal(weapon.growthScaling[1].atk, '129')
  assert.equal(weapon.growthScaling[1].subStatValue, '6%')
})

test('weapon API mapper normalizes refinement effectText for detail display', () => {
  const weapon = mapApiWeaponToViewModel({
    id: 'weapon-db-id',
    externalId: 'test-arc',
    slug: 'test-arc',
    name: 'Test Arc',
    refinements: [
      { rank: 2, effectText: 'Rank two text.' },
      { rank: 1, effectText: 'Rank one text.' },
    ],
  })

  assert.equal(weapon.refinements[0].effect, 'Rank one text.')
  assert.equal(weapon.refinements[0].effectText, 'Rank one text.')
  assert.equal(weapon.refinements[1].effect, 'Rank two text.')
})
