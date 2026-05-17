import assert from 'node:assert/strict'
import { mkdtemp } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'
import { buildSeedPlan, createSeedPreview, loadGeneratedPayloads, validateSeedPayloads } from '../../src/seed/index.js'
import type { GeneratedSeedPayloads, LoadedGeneratedPayloads, SeedRow } from '../../src/seed/index.js'

function group(tables: Record<string, SeedRow[]> = {}) {
  return tables
}

function fixturePayloads(overrides: Partial<GeneratedSeedPayloads> = {}): GeneratedSeedPayloads {
  const payloads: GeneratedSeedPayloads = {
    taxonomy: group({
      elements: [{ external_id: 'incantation', slug: 'incantation', name: 'Incantation', source_status: 'unknown' }],
      arcTypes: [],
      rarities: [],
      roles: [],
      tags: [],
      stats: [],
    }),
    media: group({ mediaAssets: [] }),
    characters: group({
      characters: [{ external_id: 'nanally', slug: 'nanally', name: 'Nanally', source_status: 'unknown' }],
      characterRoles: [],
      characterTags: [],
      characterStats: [],
      characterSkills: [],
      characterSkillScaling: [],
      characterMaterials: [{ character_external_id: 'nanally', material_name: 'CO', source_status: 'needs_verification' }],
      characterVoiceActors: [],
      characterBannerHistory: [],
      characterQuotes: [],
      characterPersonalItems: [],
      characterBuildRecommendations: [],
      characterTeamRecommendations: [],
    }),
    weapons: group({
      weapons: [],
      weaponRefinements: [],
      weaponGrowthStats: [],
      weaponRecommendedCharacters: [],
    }),
    cartridgesModules: group({
      cartridgeSets: [{ external_id: 'lost-radiance', slug: 'lost-radiance', name: 'Lost Radiance', source_status: 'unknown' }],
      cartridgeSetBonuses: [],
      moduleShapes: [{ external_id: 'type-ii-horizontal', slug: 'type-ii-horizontal', name: 'Type II', module_type: 'cartridge', source_status: 'unknown' }],
      modulePieces: [],
      cartridgeCompatibleShapes: [{ cartridge_set_external_id: 'lost-radiance', module_shape_external_id: 'type-ii-horizontal', slot: 1, source_status: 'needs_verification' }],
      moduleStatTemplates: [],
    }),
    vehicles: group({ vehicles: [], vehicleStats: [], vehicleAcquisition: [] }),
    tierLists: group({ tierLists: [], tierRows: [], tierEntries: [] }),
    content: group({ codes: [], newsPosts: [], guides: [], communityLinks: [], apartmentItems: [] }),
  }

  return { ...payloads, ...overrides }
}

function loaded(payloads: GeneratedSeedPayloads): LoadedGeneratedPayloads {
  return {
    payloads,
    summary: { snapshot: { source: 'test' } },
    issues: [],
  }
}

test('missing generated artifacts error tells user to run import dry-run', async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'nte-missing-seed-'))
  await assert.rejects(loadGeneratedPayloads(dir), /Run npm run import:dry-run first/)
})

test('validation catches duplicate external ids', () => {
  const payloads = fixturePayloads({
    taxonomy: group({
      elements: [
        { external_id: 'incantation', slug: 'incantation', name: 'Incantation', source_status: 'unknown' },
        { external_id: 'incantation', slug: 'incantation-2', name: 'Incantation 2', source_status: 'unknown' },
      ],
    }),
  })

  const result = validateSeedPayloads(loaded(payloads))
  assert.equal(result.severityCounts.BLOCKER, 1)
  assert.match(result.issues[0].message, /Duplicate external_id/)
})

test('validation catches invalid source_status', () => {
  const payloads = fixturePayloads({
    characters: group({
      ...fixturePayloads().characters,
      characters: [{ external_id: 'nanally', slug: 'nanally', name: 'Nanally', source_status: 'trusted' }],
    }),
  })

  const result = validateSeedPayloads(loaded(payloads))
  assert.equal(result.severityCounts.BLOCKER, 1)
  assert.match(result.issues[0].message, /invalid source_status/)
})

test('seed plan order is stable', () => {
  const validation = validateSeedPayloads(loaded(fixturePayloads()))
  const plan = buildSeedPlan(fixturePayloads(), validation)
  assert.deepEqual(plan.steps.slice(0, 5).map((step) => step.table), ['elements', 'arcTypes', 'rarities', 'roles', 'tags'])
  assert.equal(plan.steps.at(-1)?.table, 'apartmentItems')
})

test('blocked and unverified areas are marked correctly', () => {
  const preview = createSeedPreview(loaded(fixturePayloads()))
  const materials = preview.plan.steps.find((step) => step.table === 'characterMaterials')
  const shapes = preview.validation.issues.filter((issue) => issue.table === 'cartridgeCompatibleShapes')

  assert.equal(materials?.allowedForFutureLocalImport, false)
  assert.match(materials?.blockedReason || '', /Draft material/)
  assert.ok(shapes.some((issue) => issue.severity === 'NEEDS_VERIFICATION'))
})

test('seed module exposes no write helpers', async () => {
  const seedModule = await import('../../src/seed/index.js')
  const exportedNames = Object.keys(seedModule)
  assert.equal(exportedNames.some((name) => /(insert|update|delete|writeToDb|migrate)/i.test(name)), false)
})
