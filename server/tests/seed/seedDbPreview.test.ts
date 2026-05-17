import assert from 'node:assert/strict'
import test from 'node:test'
import { assertLocalDatabaseUrl } from '../../src/db/safety.js'
import { compareSeedPlanToCounts, sanitizeDatabaseUrl } from '../../src/seed/index.js'
import type { SeedPlan } from '../../src/seed/index.js'

function plan(): SeedPlan {
  return {
    generatedAt: '2026-05-17T00:00:00.000Z',
    steps: [
      {
        order: 1,
        group: 'taxonomy',
        table: 'elements',
        rowCount: 6,
        allowedForPreview: true,
        allowedForFutureLocalImport: true,
        blockedReason: null,
        sourceStatusNotes: { unknown: 6 },
      },
      {
        order: 2,
        group: 'characters',
        table: 'characterMaterials',
        rowCount: 42,
        allowedForPreview: true,
        allowedForFutureLocalImport: false,
        blockedReason: 'Draft material references need source verification.',
        sourceStatusNotes: { needs_verification: 42 },
      },
      {
        order: 3,
        group: 'characters',
        table: 'characterSkillScaling',
        rowCount: 0,
        allowedForPreview: true,
        allowedForFutureLocalImport: true,
        blockedReason: null,
        sourceStatusNotes: {},
      },
    ],
    totals: {
      rows: 48,
      previewRows: 48,
      futureLocalImportRows: 6,
      blockedRows: 42,
    },
  }
}

test('DB preview count comparison reports differences', () => {
  const comparisons = compareSeedPlanToCounts(plan(), new Map([
    ['elements', 0],
    ['character_materials', 3],
    ['materials', 0],
  ]))

  const elements = comparisons.find((row) => row.planTable === 'elements')
  const characterMaterials = comparisons.find((row) => row.planTable === 'characterMaterials')

  assert.equal(elements?.status, 'empty')
  assert.equal(elements?.difference, 6)
  assert.equal(characterMaterials?.status, 'non_empty')
  assert.equal(characterMaterials?.difference, 39)
})

test('DB preview reports missing and skipped tables', () => {
  const comparisons = compareSeedPlanToCounts(plan(), new Map([['elements', null]]))

  assert.equal(comparisons.find((row) => row.planTable === 'elements')?.status, 'missing')
  assert.equal(comparisons.find((row) => row.planTable === 'characterSkillScaling')?.status, 'skipped')
})

test('DB preview keeps blocked rows blocked', () => {
  const comparisons = compareSeedPlanToCounts(plan(), new Map([['character_materials', 0]]))
  const characterMaterials = comparisons.find((row) => row.planTable === 'characterMaterials')

  assert.equal(characterMaterials?.allowedForFutureLocalImport, false)
  assert.match(characterMaterials?.blockedReason || '', /Draft material/)
})

test('DB preview sanitizes database URL', () => {
  const sanitized = sanitizeDatabaseUrl('postgres://postgres:secret@localhost:5432/nte_database')
  assert.equal(sanitized.sanitizedUrl, 'postgres://localhost:5432/nte_database')
  assert.equal(sanitized.host, 'localhost')
  assert.equal(sanitized.database, 'nte_database')
})

test('DB preview safety guard rejects production-looking URLs', () => {
  assert.throws(() => assertLocalDatabaseUrl('postgres://user:pass@db.example.com:5432/nte_database'), /Refusing non-local/)
})

test('DB preview module exposes no write helpers', async () => {
  const seedModule = await import('../../src/seed/index.js')
  assert.equal(Object.keys(seedModule).some((name) => /(insert|update|delete|upsert|writeToDb|migrate)/i.test(name)), false)
})
