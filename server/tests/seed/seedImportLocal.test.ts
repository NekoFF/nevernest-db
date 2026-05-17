import assert from 'node:assert/strict'
import test from 'node:test'
import { assertLocalDatabaseUrl } from '../../src/db/safety.js'
import { buildSeedImportDryRun, buildSeedPlan, runSeedImportLocal, validateSeedPayloads } from '../../src/seed/index.js'
import type { GeneratedSeedPayloads, LoadedGeneratedPayloads, SeedRow } from '../../src/seed/index.js'

function group(tables: Record<string, SeedRow[]> = {}) {
  return tables
}

function payloads(): GeneratedSeedPayloads {
  return {
    taxonomy: group({
      elements: [{ external_id: 'incantation', slug: 'incantation', name: 'Incantation', source_status: 'unknown' }],
      arcTypes: [{ external_id: 'bose', slug: 'bose', name: 'Bose', source_status: 'unknown' }],
      rarities: [{ external_id: 'ssr', name: 'SSR', source_status: 'unknown' }],
      roles: [{ external_id: 'dps', slug: 'dps', name: 'DPS', source_status: 'unknown' }],
      tags: [{ external_id: 'starter', slug: 'starter', name: 'Starter', source_status: 'unknown' }],
      stats: [
        { external_id: 'atk', name: 'ATK', category: 'combat', value_type: 'number', source_status: 'unknown' },
        { external_id: 'atk_percent', name: 'ATK%', category: 'combat', value_type: 'percent', source_status: 'unknown' },
      ],
    }),
    media: group({ mediaAssets: [] }),
    characters: group({
      characters: [{ external_id: 'nanally', slug: 'nanally', name: 'Nanally', rarity_external_id: 'ssr', element_external_id: 'incantation', arc_type_external_id: 'bose', source_status: 'unknown', publication_status: 'draft' }],
      characterRoles: [{ character_external_id: 'nanally', role_external_id: 'dps', source_status: 'unknown' }],
      characterTags: [],
      characterStats: [],
      characterSkills: [],
      characterSkillScaling: [],
      characterMaterials: [{ character_external_id: 'nanally', material_name: 'CO', amount: 1, source_status: 'needs_verification' }],
      characterVoiceActors: [],
      characterBannerHistory: [],
      characterQuotes: [],
      characterPersonalItems: [],
      characterBuildRecommendations: [],
      characterTeamRecommendations: [],
    }),
    weapons: group({ weapons: [], weaponRefinements: [], weaponGrowthStats: [], weaponRecommendedCharacters: [] }),
    cartridgesModules: group({ cartridgeSets: [], cartridgeSetBonuses: [], moduleShapes: [], modulePieces: [], cartridgeCompatibleShapes: [], moduleStatTemplates: [] }),
    vehicles: group({ vehicles: [], vehicleStats: [], vehicleAcquisition: [] }),
    tierLists: group({ tierLists: [], tierRows: [], tierEntries: [] }),
    content: group({ codes: [], newsPosts: [], guides: [], communityLinks: [], apartmentItems: [] }),
  }
}

function loaded(seedPayloads = payloads()): LoadedGeneratedPayloads {
  return { payloads: seedPayloads, summary: { snapshot: { source: 'test' } }, issues: [] }
}

test('local seed import dry-run requires confirmation for writes by remaining dry-run only', () => {
  const input = loaded()
  const validation = validateSeedPayloads(input)
  const plan = buildSeedPlan(input.payloads, validation)
  const report = buildSeedImportDryRun(input, validation, plan, 'postgres://postgres:postgres@localhost:5432/nte_database')

  assert.equal(report.mode, 'dry-run')
  assert.equal(report.transaction, 'not_started')
  assert.equal(report.inserted > 0, true)
})

test('validation blockers prevent import before connecting', async () => {
  const input = loaded({
    ...payloads(),
    taxonomy: group({
      elements: [
        { external_id: 'incantation', slug: 'incantation', name: 'Incantation', source_status: 'unknown' },
        { external_id: 'incantation', slug: 'incantation-two', name: 'Incantation 2', source_status: 'unknown' },
      ],
    }),
  })
  const validation = validateSeedPayloads(input)
  const plan = buildSeedPlan(input.payloads, validation)
  const report = await runSeedImportLocal(input, validation, plan, 'postgres://postgres:postgres@localhost:5432/nte_database')

  assert.equal(report.failed > 0, true)
  assert.equal(report.transaction, 'not_started')
  assert.match(report.errors[0].message, /validation blockers/)
})

test('blocked material rows are skipped', () => {
  const input = loaded()
  const validation = validateSeedPayloads(input)
  const plan = buildSeedPlan(input.payloads, validation)
  const report = buildSeedImportDryRun(input, validation, plan, 'postgres://postgres:postgres@localhost:5432/nte_database')
  const materials = report.tables.find((table) => table.table === 'characterMaterials')

  assert.equal(materials?.skipped, 1)
  assert.match(materials?.skippedReason || '', /Draft material/)
})

test('local seed import order is stable', () => {
  const input = loaded()
  const validation = validateSeedPayloads(input)
  const plan = buildSeedPlan(input.payloads, validation)
  const report = buildSeedImportDryRun(input, validation, plan, 'postgres://postgres:postgres@localhost:5432/nte_database')

  assert.deepEqual(report.tables.slice(0, 6).map((table) => table.table), ['elements', 'arcTypes', 'rarities', 'roles', 'tags', 'stats'])
})

test('upsert payload grouping counts allowed rows', () => {
  const input = loaded()
  const validation = validateSeedPayloads(input)
  const plan = buildSeedPlan(input.payloads, validation)
  const report = buildSeedImportDryRun(input, validation, plan, 'postgres://postgres:postgres@localhost:5432/nte_database')

  assert.equal(report.tables.find((table) => table.table === 'characters')?.inserted, 1)
  assert.equal(report.tables.find((table) => table.table === 'characterRoles')?.inserted, 1)
})

test('unsafe database URL is rejected for local import', () => {
  assert.throws(() => assertLocalDatabaseUrl('postgres://postgres:postgres@prod.example.com:5432/nte_database'), /Refusing non-local/)
})

test('seed import dry-run normalizes numeric percent strings before DB write', () => {
  const input = loaded({
    ...payloads(),
    weapons: group({
      weapons: [
        {
          external_id: 'good-boys-grand-adventure',
          slug: 'good-boys-grand-adventure',
          name: "Good Boy's Grand Adventure",
          rarity_external_id: 'ssr',
          arc_type_external_id: 'bose',
          main_stat_external_id: 'atk',
          main_stat_value: 474,
          sub_stat_external_id: 'atk_percent',
          sub_stat_value: '45%',
          source_status: 'unknown',
        },
      ],
      weaponRefinements: [],
      weaponGrowthStats: [
        { weapon_external_id: 'good-boys-grand-adventure', level: 70, stat_external_id: 'atk_percent', value: '45%', source_status: 'unknown' },
        { weapon_external_id: 'good-boys-grand-adventure', level: 80, stat_external_id: 'atk_percent', value: '27.5%', source_status: 'unknown' },
      ],
      weaponRecommendedCharacters: [],
    }),
  })
  const validation = validateSeedPayloads(input)
  const plan = buildSeedPlan(input.payloads, validation)
  const report = buildSeedImportDryRun(input, validation, plan, 'postgres://postgres:postgres@localhost:5432/nte_database')

  assert.equal(validation.severityCounts.BLOCKER, 0)
  assert.equal(report.failed, 0)
  assert.equal(report.tables.find((table) => table.table === 'weapons')?.inserted, 1)
  assert.equal(report.tables.find((table) => table.table === 'weaponGrowthStats')?.inserted, 2)
})

test('failing row context is included in seed import dry-run reports', () => {
  const input = loaded({
    ...payloads(),
    weapons: group({
      weapons: [
        {
          external_id: 'bad-weapon',
          slug: 'bad-weapon',
          name: 'Bad Weapon',
          rarity_external_id: 'ssr',
          arc_type_external_id: 'bose',
          main_stat_external_id: 'atk',
          main_stat_value: 474,
          sub_stat_external_id: 'atk_percent',
          sub_stat_value: 'forty five%',
          source_status: 'unknown',
        },
      ],
      weaponRefinements: [],
      weaponGrowthStats: [],
      weaponRecommendedCharacters: [],
    }),
  })
  const validation = validateSeedPayloads(input)
  const plan = buildSeedPlan(input.payloads, validation)
  const report = buildSeedImportDryRun(input, validation, plan, 'postgres://postgres:postgres@localhost:5432/nte_database')
  const error = report.errors.find((item) => item.table === 'weapons' && item.identifier === 'bad-weapon')

  assert.equal(validation.severityCounts.BLOCKER > 0, true)
  assert.ok(error)
  assert.equal(error?.field, 'sub_stat_value')
  assert.equal(error?.rawValue, 'forty five%')
  assert.match(error?.message ?? '', /table=weapons/)
})
