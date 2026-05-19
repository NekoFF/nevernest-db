import test from 'node:test'
import assert from 'node:assert/strict'
import { normalizeConsole } from './consoleBlocks.js'

test('normalizeConsole preserves visualGroup separately from real rarity', () => {
  const consoleData = normalizeConsole({
    console: {
      grid: {
        rows: 7,
        cols: 7,
        placements: [
          {
            modulePieceId: 'module-s-type-ii-horizontal',
            moduleShapeId: 'type-ii-horizontal',
            rarity: 'S',
            visualGroup: 'group-purple',
            row: 1,
            col: 1,
          },
        ],
      },
    },
  })

  assert.equal(consoleData.grid.placements[0].rarity, 'S')
  assert.equal(consoleData.grid.placements[0].visualGroup, 'group-purple')
  assert.equal(consoleData.grid.placements[0].colorKey, 'group-purple')
})

test('normalizeConsole migrates legacy helper colors to visual groups', () => {
  const consoleData = normalizeConsole({
    console: {
      grid: {
        placements: [
          {
            moduleShapeId: 'type-ii-horizontal',
            rarity: 'S',
            colorKey: 'helper-1',
            row: 0,
            col: 0,
          },
        ],
      },
    },
  })

  assert.equal(consoleData.grid.placements[0].rarity, 'S')
  assert.equal(consoleData.grid.placements[0].visualGroup, 'group-green')
})
