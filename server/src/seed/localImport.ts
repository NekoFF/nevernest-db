import pg from 'pg'
import type { LoadedGeneratedPayloads, SeedPlan, SeedPlanStep, SeedRow, SeedValidationResult } from './seedTypes.js'
import { sanitizeDatabaseUrl } from './dbPreview.js'
import { SeedValueValidationError, normalizeNullableNumber, normalizeNullablePercentNumber, normalizeNumber, normalizePercentNumber } from './seedValueNormalizers.js'

const { Client } = pg

export type SeedImportMode = 'dry-run' | 'write'

export type SeedImportTableAction = {
  table: string
  plannedRows: number
  inserted: number
  updated: number
  skipped: number
  failed: number
  skippedReason: string | null
}

export type SeedImportReport = {
  generatedAt: string
  mode: SeedImportMode
  database: ReturnType<typeof sanitizeDatabaseUrl>
  transaction: 'not_started' | 'committed' | 'rolled_back'
  plannedRows: number
  inserted: number
  updated: number
  skipped: number
  failed: number
  blockedRows: number
  needsVerificationRows: number
  tables: SeedImportTableAction[]
  errors: Array<{ table: string; message: string; row?: unknown; identifier?: string | null; field?: string | null; rawValue?: unknown; dbTable?: string }>
}

type IdMaps = {
  elements: Map<string, string>
  arcTypes: Map<string, string>
  rarities: Map<string, string>
  roles: Map<string, string>
  tags: Map<string, string>
  stats: Map<string, string>
  mediaAssets: Map<string, string>
  characters: Map<string, string>
  weapons: Map<string, string>
  cartridgeSets: Map<string, string>
  moduleShapes: Map<string, string>
  vehicles: Map<string, string>
  tierLists: Map<string, string>
  tierRows: Map<string, string>
}

type ImportContext = {
  client: pg.Client
  maps: IdMaps
}

type TableImporter = {
  planTable: string
  dbTable: string
  source: (loaded: LoadedGeneratedPayloads) => SeedRow[]
  keyColumns: string[]
  mapRow: (row: SeedRow, context: ImportContext) => Record<string, unknown> | null
  refreshMaps?: (context: ImportContext) => Promise<void>
}

const tablesWithoutUpdatedAt = new Set(['character_roles', 'character_tags', 'weapon_recommended_characters'])

function createReport(databaseUrl: string, mode: SeedImportMode, plan: SeedPlan): SeedImportReport {
  return {
    generatedAt: new Date().toISOString(),
    mode,
    database: sanitizeDatabaseUrl(databaseUrl),
    transaction: 'not_started',
    plannedRows: plan.totals.futureLocalImportRows,
    inserted: 0,
    updated: 0,
    skipped: plan.totals.blockedRows,
    failed: 0,
    blockedRows: plan.totals.blockedRows,
    needsVerificationRows: plan.steps.reduce((total, step) => total + (step.sourceStatusNotes.needs_verification ?? 0), 0),
    tables: [],
    errors: [],
  }
}

function emptyMaps(): IdMaps {
  return {
    elements: new Map(),
    arcTypes: new Map(),
    rarities: new Map(),
    roles: new Map(),
    tags: new Map(),
    stats: new Map(),
    mediaAssets: new Map(),
    characters: new Map(),
    weapons: new Map(),
    cartridgeSets: new Map(),
    moduleShapes: new Map(),
    vehicles: new Map(),
    tierLists: new Map(),
    tierRows: new Map(),
  }
}

function value(row: SeedRow, key: string) {
  return row[key] ?? null
}

function jsonValue(row: SeedRow, key: string, fallback: unknown) {
  return JSON.stringify(row[key] ?? fallback)
}

function arrayValue(row: SeedRow, key: string, fallback: unknown[]) {
  return row[key] ?? fallback
}

function rowIdentifier(row: SeedRow): string | null {
  const keys = ['external_id', 'weapon_external_id', 'character_external_id', 'cartridge_set_external_id', 'vehicle_external_id', 'tier_list_external_id']
  for (const key of keys) {
    if (typeof row[key] === 'string' && String(row[key]).length > 0) return String(row[key])
  }
  return null
}

function q(identifier: string) {
  return `"${identifier.replaceAll('"', '""')}"`
}

async function refreshMap(client: pg.Client, table: string, target: Map<string, string>) {
  target.clear()
  const result = await client.query(`select id, external_id from ${q(table)}`)
  for (const row of result.rows) {
    target.set(row.external_id, row.id)
  }
}

async function refreshTierRows(client: pg.Client, maps: IdMaps) {
  maps.tierRows.clear()
  const result = await client.query(`
    select tr.id, tr.external_id, tl.external_id as tier_list_external_id
    from tier_rows tr
    join tier_lists tl on tl.id = tr.tier_list_id
  `)
  for (const row of result.rows) {
    maps.tierRows.set(`${row.tier_list_external_id}:${row.external_id}`, row.id)
  }
}

function requireMap(map: Map<string, string>, externalId: unknown, label: string): string | null {
  if (typeof externalId !== 'string') return null
  return map.get(externalId) ?? null
}

async function upsertRow(client: pg.Client, table: string, row: Record<string, unknown>, keyColumns: string[]) {
  const whereValues = keyColumns.map((column) => row[column])
  const where = keyColumns.map((column, index) => `${q(column)} = $${index + 1}`).join(' and ')
  const existing = await client.query(`select 1 from ${q(table)} where ${where} limit 1`, whereValues)

  if (existing.rowCount && existing.rowCount > 0) {
    const updateColumns = Object.keys(row).filter((column) => !keyColumns.includes(column))
    if (updateColumns.length === 0) return 'updated' as const
    const values = updateColumns.map((column) => row[column])
    const assignments = updateColumns.map((column, index) => {
      const paramIndex = index + 1
      if (column === 'source_status') {
        return `${q(column)} = case when ${q(table)}.${q(column)} = 'verified' and $${paramIndex}::source_status <> 'verified' then ${q(table)}.${q(column)} else $${paramIndex}::source_status end`
      }
      return `${q(column)} = $${paramIndex}`
    })
    if (!tablesWithoutUpdatedAt.has(table)) {
      assignments.push('updated_at = now()')
    }
    await client.query(`update ${q(table)} set ${assignments.join(', ')} where ${where.replace(/\$(\d+)/g, (_, n) => `$${Number(n) + values.length}`)}`, [...values, ...whereValues])
    return 'updated' as const
  }

  const columns = Object.keys(row)
  const params = columns.map((_, index) => `$${index + 1}`).join(', ')
  await client.query(`insert into ${q(table)} (${columns.map(q).join(', ')}) values (${params})`, columns.map((column) => row[column]))
  return 'inserted' as const
}

class SeedImportRowError extends Error {
  table: string
  dbTable: string
  identifier: string | null
  field: string | null
  rawValue: unknown
  row: SeedRow

  constructor(options: { table: string; dbTable: string; row: SeedRow; error: unknown; mapped?: Record<string, unknown> | null }) {
    const originalMessage = options.error instanceof Error ? options.error.message : String(options.error)
    const validationError = options.error instanceof SeedValueValidationError ? options.error : null
    const field = validationError?.field ?? findFieldFromError(originalMessage, options.row, options.mapped)
    const rawValue = validationError?.rawValue ?? (field ? options.row[field] ?? options.mapped?.[field] : undefined)
    const identifier = rowIdentifier(options.row)
    super(`${originalMessage} [table=${options.table}, dbTable=${options.dbTable}, identifier=${identifier ?? 'unknown'}${field ? `, field=${field}` : ''}${rawValue !== undefined ? `, rawValue=${JSON.stringify(rawValue)}` : ''}]`)
    this.name = 'SeedImportRowError'
    this.table = options.table
    this.dbTable = options.dbTable
    this.identifier = identifier
    this.field = field
    this.rawValue = rawValue
    this.row = options.row
  }
}

function findFieldFromError(message: string, sourceRow: SeedRow, mapped?: Record<string, unknown> | null): string | null {
  const quoted = message.match(/"([^"]+)"/)?.[1]
  if (!quoted) return null
  for (const [key, value] of Object.entries(sourceRow)) {
    if (value === quoted) return key
  }
  for (const [key, value] of Object.entries(mapped ?? {})) {
    if (value === quoted) return key
  }
  return null
}

const importers: TableImporter[] = [
  {
    planTable: 'elements',
    dbTable: 'elements',
    source: (loaded) => loaded.payloads.taxonomy.elements,
    keyColumns: ['external_id'],
    mapRow: (row) => ({ external_id: value(row, 'external_id'), slug: value(row, 'slug'), name: value(row, 'name'), color: value(row, 'color'), sort_order: value(row, 'sort_order') ?? 0, source_status: value(row, 'source_status') ?? 'unknown' }),
    refreshMaps: (context) => refreshMap(context.client, 'elements', context.maps.elements),
  },
  {
    planTable: 'arcTypes',
    dbTable: 'arc_types',
    source: (loaded) => loaded.payloads.taxonomy.arcTypes,
    keyColumns: ['external_id'],
    mapRow: (row) => ({ external_id: value(row, 'external_id'), slug: value(row, 'slug'), name: value(row, 'name'), sort_order: value(row, 'sort_order') ?? 0, source_status: value(row, 'source_status') ?? 'unknown' }),
    refreshMaps: (context) => refreshMap(context.client, 'arc_types', context.maps.arcTypes),
  },
  {
    planTable: 'rarities',
    dbTable: 'rarities',
    source: (loaded) => loaded.payloads.taxonomy.rarities,
    keyColumns: ['external_id'],
    mapRow: (row) => ({ external_id: value(row, 'external_id'), name: value(row, 'name'), rank_label: value(row, 'rank_label'), color: value(row, 'color'), sort_order: value(row, 'sort_order') ?? 0, source_status: value(row, 'source_status') ?? 'unknown' }),
    refreshMaps: (context) => refreshMap(context.client, 'rarities', context.maps.rarities),
  },
  {
    planTable: 'roles',
    dbTable: 'roles',
    source: (loaded) => loaded.payloads.taxonomy.roles,
    keyColumns: ['external_id'],
    mapRow: (row) => ({ external_id: value(row, 'external_id'), slug: value(row, 'slug'), name: value(row, 'name'), description: value(row, 'description'), aliases: arrayValue(row, 'aliases', []), sort_order: value(row, 'sort_order') ?? 0, source_status: value(row, 'source_status') ?? 'unknown' }),
    refreshMaps: (context) => refreshMap(context.client, 'roles', context.maps.roles),
  },
  {
    planTable: 'tags',
    dbTable: 'tags',
    source: (loaded) => loaded.payloads.taxonomy.tags,
    keyColumns: ['external_id'],
    mapRow: (row) => ({ external_id: value(row, 'external_id'), slug: value(row, 'slug'), name: value(row, 'name'), description: value(row, 'description'), aliases: arrayValue(row, 'aliases', []), sort_order: value(row, 'sort_order') ?? 0, source_status: value(row, 'source_status') ?? 'unknown' }),
    refreshMaps: (context) => refreshMap(context.client, 'tags', context.maps.tags),
  },
  {
    planTable: 'stats',
    dbTable: 'stats',
    source: (loaded) => loaded.payloads.taxonomy.stats,
    keyColumns: ['external_id'],
    mapRow: (row) => ({ external_id: value(row, 'external_id'), name: value(row, 'name'), display_name: value(row, 'display_name'), category: value(row, 'category'), value_type: value(row, 'value_type'), icon_key: value(row, 'icon_key'), allowed_as_main_stat: value(row, 'allowed_as_main_stat') ?? false, allowed_as_sub_stat: value(row, 'allowed_as_sub_stat') ?? false, allowed_as_weapon_sub_stat: value(row, 'allowed_as_weapon_sub_stat') ?? false, allowed_as_character_stat: value(row, 'allowed_as_character_stat') ?? true, aliases: arrayValue(row, 'aliases', []), sort_order: value(row, 'sort_order') ?? 0, source_status: value(row, 'source_status') ?? 'unknown' }),
    refreshMaps: (context) => refreshMap(context.client, 'stats', context.maps.stats),
  },
  {
    planTable: 'mediaAssets',
    dbTable: 'media_assets',
    source: (loaded) => loaded.payloads.media.mediaAssets,
    keyColumns: ['external_id'],
    mapRow: (row) => ({ external_id: value(row, 'external_id'), entity_type: value(row, 'entity_type'), entity_external_id: value(row, 'entity_external_id'), resolved_entity_external_id: value(row, 'resolved_entity_external_id'), kind: value(row, 'kind'), path: value(row, 'path'), alt: value(row, 'alt'), source_url: value(row, 'source_url'), license_note: value(row, 'license_note'), width: value(row, 'width'), height: value(row, 'height'), source_status: value(row, 'source_status') ?? 'unknown', metadata: jsonValue(row, 'metadata', {}) }),
    refreshMaps: (context) => refreshMap(context.client, 'media_assets', context.maps.mediaAssets),
  },
  {
    planTable: 'characters',
    dbTable: 'characters',
    source: (loaded) => loaded.payloads.characters.characters,
    keyColumns: ['external_id'],
    mapRow: (row, context) => ({ external_id: value(row, 'external_id'), slug: value(row, 'slug'), name: value(row, 'name'), rarity_id: requireMap(context.maps.rarities, row.rarity_external_id, 'rarity'), element_id: requireMap(context.maps.elements, row.element_external_id, 'element'), arc_type_id: requireMap(context.maps.arcTypes, row.arc_type_external_id, 'arc type'), faction: value(row, 'faction'), birthday: value(row, 'birthday'), description: value(row, 'description'), source_status: value(row, 'source_status') ?? 'unknown', publication_status: value(row, 'publication_status') ?? 'draft', raw: jsonValue(row, 'raw', {}) }),
    refreshMaps: (context) => refreshMap(context.client, 'characters', context.maps.characters),
  },
  {
    planTable: 'characterRoles',
    dbTable: 'character_roles',
    source: (loaded) => loaded.payloads.characters.characterRoles,
    keyColumns: ['character_id', 'role_id'],
    mapRow: (row, context) => ({ character_id: requireMap(context.maps.characters, row.character_external_id, 'character'), role_id: requireMap(context.maps.roles, row.role_external_id, 'role'), source_status: value(row, 'source_status') ?? 'unknown' }),
  },
  {
    planTable: 'characterTags',
    dbTable: 'character_tags',
    source: (loaded) => loaded.payloads.characters.characterTags,
    keyColumns: ['character_id', 'tag_id'],
    mapRow: (row, context) => ({ character_id: requireMap(context.maps.characters, row.character_external_id, 'character'), tag_id: requireMap(context.maps.tags, row.tag_external_id, 'tag'), source_status: value(row, 'source_status') ?? 'unknown' }),
  },
  {
    planTable: 'characterStats',
    dbTable: 'character_stats',
    source: (loaded) => loaded.payloads.characters.characterStats,
    keyColumns: ['character_id', 'stat_id', 'level'],
    mapRow: (row, context) => ({ character_id: requireMap(context.maps.characters, row.character_external_id, 'character'), stat_id: requireMap(context.maps.stats, row.stat_external_id, 'stat'), level: normalizeNullableNumber(value(row, 'level'), 'level'), value: normalizeNullablePercentNumber(value(row, 'value'), 'value'), source_status: value(row, 'source_status') ?? 'unknown', metadata: {} }),
  },
  {
    planTable: 'characterSkills',
    dbTable: 'character_skills',
    source: (loaded) => loaded.payloads.characters.characterSkills,
    keyColumns: ['external_id'],
    mapRow: (row, context) => ({ external_id: value(row, 'external_id'), character_id: requireMap(context.maps.characters, row.character_external_id, 'character'), name: value(row, 'name'), skill_type: value(row, 'skill_type'), description: value(row, 'description'), max_level: value(row, 'max_level'), effect_json: jsonValue(row, 'effect_json', {}), source_status: value(row, 'source_status') ?? 'unknown', sort_order: value(row, 'sort_order') ?? 0 }),
  },
  {
    planTable: 'characterVoiceActors',
    dbTable: 'character_voice_actors',
    source: (loaded) => loaded.payloads.characters.characterVoiceActors,
    keyColumns: ['character_id', 'locale', 'actor_name'],
    mapRow: (row, context) => ({ character_id: requireMap(context.maps.characters, row.character_external_id, 'character'), locale: value(row, 'language'), actor_name: value(row, 'actor_name'), source_status: value(row, 'source_status') ?? 'unknown' }),
  },
  {
    planTable: 'weapons',
    dbTable: 'weapons',
    source: (loaded) => loaded.payloads.weapons.weapons,
    keyColumns: ['external_id'],
    mapRow: (row, context) => ({ external_id: value(row, 'external_id'), slug: value(row, 'slug'), name: value(row, 'name'), rarity_id: requireMap(context.maps.rarities, row.rarity_external_id, 'rarity'), arc_type_id: requireMap(context.maps.arcTypes, row.arc_type_external_id, 'arc type'), quote: value(row, 'quote'), description: value(row, 'description'), main_stat_id: requireMap(context.maps.stats, row.main_stat_external_id, 'stat'), main_stat_value: normalizeNullablePercentNumber(value(row, 'main_stat_value'), 'main_stat_value'), sub_stat_id: requireMap(context.maps.stats, row.sub_stat_external_id, 'stat'), sub_stat_value: normalizeNullablePercentNumber(value(row, 'sub_stat_value'), 'sub_stat_value'), source_status: value(row, 'source_status') ?? 'unknown', raw: jsonValue(row, 'raw', {}) }),
    refreshMaps: (context) => refreshMap(context.client, 'weapons', context.maps.weapons),
  },
  {
    planTable: 'weaponRefinements',
    dbTable: 'weapon_refinements',
    source: (loaded) => loaded.payloads.weapons.weaponRefinements,
    keyColumns: ['weapon_id', 'rank'],
    mapRow: (row, context) => ({ weapon_id: requireMap(context.maps.weapons, row.weapon_external_id, 'weapon'), rank: value(row, 'rank'), effect_text: value(row, 'effect_text'), effect_json: jsonValue(row, 'effect_json', {}), source_status: value(row, 'source_status') ?? 'unknown' }),
  },
  {
    planTable: 'weaponGrowthStats',
    dbTable: 'weapon_growth_stats',
    source: (loaded) => loaded.payloads.weapons.weaponGrowthStats,
    keyColumns: ['weapon_id', 'level', 'stat_id'],
    mapRow: (row, context) => ({ weapon_id: requireMap(context.maps.weapons, row.weapon_external_id, 'weapon'), level: normalizeNumber(value(row, 'level'), 'level'), stat_id: requireMap(context.maps.stats, row.stat_external_id, 'stat'), value: normalizePercentNumber(value(row, 'value'), 'value'), source_status: value(row, 'source_status') ?? 'unknown' }),
  },
  {
    planTable: 'cartridgeSets',
    dbTable: 'cartridge_sets',
    source: (loaded) => loaded.payloads.cartridgesModules.cartridgeSets,
    keyColumns: ['external_id'],
    mapRow: (row, context) => ({ external_id: value(row, 'external_id'), slug: value(row, 'slug'), name: value(row, 'name'), element_id: requireMap(context.maps.elements, row.element_external_id, 'element'), bonus_category: value(row, 'bonus_category'), description: value(row, 'description'), data_status: value(row, 'data_status'), source_status: value(row, 'source_status') ?? 'unknown', raw: jsonValue(row, 'raw', {}) }),
    refreshMaps: (context) => refreshMap(context.client, 'cartridge_sets', context.maps.cartridgeSets),
  },
  {
    planTable: 'cartridgeSetBonuses',
    dbTable: 'cartridge_set_bonuses',
    source: (loaded) => loaded.payloads.cartridgesModules.cartridgeSetBonuses,
    keyColumns: ['cartridge_set_id', 'pieces'],
    mapRow: (row, context) => ({ cartridge_set_id: requireMap(context.maps.cartridgeSets, row.cartridge_set_external_id, 'cartridge set'), pieces: value(row, 'pieces'), effect_text: value(row, 'effect_text'), effect_json: jsonValue(row, 'effect_json', {}), is_conditional: value(row, 'is_conditional') ?? false, source_status: value(row, 'source_status') ?? 'unknown' }),
  },
  {
    planTable: 'moduleShapes',
    dbTable: 'module_shapes',
    source: (loaded) => loaded.payloads.cartridgesModules.moduleShapes,
    keyColumns: ['external_id'],
    mapRow: (row) => ({ external_id: value(row, 'external_id'), slug: value(row, 'slug'), module_type: value(row, 'module_type'), name: value(row, 'name'), width: normalizeNullableNumber(value(row, 'width'), 'width'), height: normalizeNullableNumber(value(row, 'height'), 'height'), cell_count: normalizeNullableNumber(value(row, 'cell_count'), 'cell_count'), matrix_json: jsonValue(row, 'matrix_json', []), source_status: value(row, 'source_status') ?? 'unknown', sort_order: normalizeNullableNumber(value(row, 'sort_order') ?? 0, 'sort_order') ?? 0 }),
    refreshMaps: (context) => refreshMap(context.client, 'module_shapes', context.maps.moduleShapes),
  },
  {
    planTable: 'modulePieces',
    dbTable: 'module_pieces',
    source: (loaded) => loaded.payloads.cartridgesModules.modulePieces,
    keyColumns: ['external_id'],
    mapRow: (row, context) => ({ external_id: value(row, 'external_id'), slug: value(row, 'slug'), module_shape_id: requireMap(context.maps.moduleShapes, row.module_shape_external_id, 'module shape'), rarity_id: requireMap(context.maps.rarities, row.rarity_external_id, 'rarity'), module_type: value(row, 'module_type'), name: value(row, 'display_name'), source_status: value(row, 'source_status') ?? 'unknown', raw: { generated_from_template: value(row, 'generated_from_template') } }),
  },
  {
    planTable: 'cartridgeCompatibleShapes',
    dbTable: 'cartridge_compatible_shapes',
    source: (loaded) => loaded.payloads.cartridgesModules.cartridgeCompatibleShapes,
    keyColumns: ['cartridge_set_id', 'slot_index'],
    mapRow: (row, context) => ({ cartridge_set_id: requireMap(context.maps.cartridgeSets, row.cartridge_set_external_id, 'cartridge set'), slot_index: normalizeNumber(value(row, 'slot'), 'slot'), module_shape_id: requireMap(context.maps.moduleShapes, row.module_shape_external_id, 'module shape'), shape_external_id: value(row, 'module_shape_external_id'), source_status: value(row, 'source_status') ?? 'needs_verification' }),
  },
  {
    planTable: 'vehicles',
    dbTable: 'vehicles',
    source: (loaded) => loaded.payloads.vehicles.vehicles,
    keyColumns: ['external_id'],
    mapRow: (row) => ({ external_id: value(row, 'external_id'), slug: value(row, 'slug'), name: value(row, 'name'), vehicle_type: value(row, 'vehicle_type'), description: value(row, 'description'), source_status: value(row, 'source_status') ?? 'unknown', raw: jsonValue(row, 'raw', {}) }),
    refreshMaps: (context) => refreshMap(context.client, 'vehicles', context.maps.vehicles),
  },
  {
    planTable: 'vehicleStats',
    dbTable: 'vehicle_stats',
    source: (loaded) => loaded.payloads.vehicles.vehicleStats,
    keyColumns: ['vehicle_id'],
    mapRow: (row, context) => ({ vehicle_id: requireMap(context.maps.vehicles, row.vehicle_external_id, 'vehicle'), max_speed: normalizeNullableNumber(value(row, 'max_speed'), 'max_speed'), acceleration: normalizeNullableNumber(value(row, 'acceleration'), 'acceleration'), durability: normalizeNullableNumber(value(row, 'durability'), 'durability'), handling_json: jsonValue(row, 'handling_json', {}), source_status: value(row, 'source_status') ?? 'unknown' }),
  },
  {
    planTable: 'vehicleAcquisition',
    dbTable: 'vehicle_acquisition',
    source: (loaded) => loaded.payloads.vehicles.vehicleAcquisition,
    keyColumns: ['vehicle_id'],
    mapRow: (row, context) => ({ vehicle_id: requireMap(context.maps.vehicles, row.vehicle_external_id, 'vehicle'), currency: value(row, 'currency'), price: normalizeNullableNumber(value(row, 'price'), 'price'), acquisition_text: value(row, 'acquisition_text'), source_status: value(row, 'source_status') ?? 'unknown' }),
  },
  {
    planTable: 'tierLists',
    dbTable: 'tier_lists',
    source: (loaded) => loaded.payloads.tierLists.tierLists,
    keyColumns: ['external_id'],
    mapRow: (row) => ({ external_id: value(row, 'external_id'), slug: value(row, 'slug'), title: value(row, 'title'), description: value(row, 'description'), list_type: value(row, 'list_type') ?? 'official', settings_json: jsonValue(row, 'settings_json', {}), source_status: value(row, 'source_status') ?? 'unknown', publication_status: value(row, 'publication_status') ?? 'draft' }),
    refreshMaps: (context) => refreshMap(context.client, 'tier_lists', context.maps.tierLists),
  },
  {
    planTable: 'tierRows',
    dbTable: 'tier_rows',
    source: (loaded) => loaded.payloads.tierLists.tierRows,
    keyColumns: ['tier_list_id', 'external_id'],
    mapRow: (row, context) => ({ tier_list_id: requireMap(context.maps.tierLists, row.tier_list_external_id, 'tier list'), external_id: value(row, 'external_id'), label: value(row, 'label'), subtitle: value(row, 'subtitle'), color: value(row, 'color'), sort_order: value(row, 'sort_order') ?? 0 }),
    refreshMaps: (context) => refreshTierRows(context.client, context.maps),
  },
  {
    planTable: 'tierEntries',
    dbTable: 'tier_entries',
    source: (loaded) => loaded.payloads.tierLists.tierEntries,
    keyColumns: ['tier_list_id', 'tier_row_id', 'character_id'],
    mapRow: (row, context) => ({ tier_list_id: requireMap(context.maps.tierLists, row.tier_list_external_id, 'tier list'), tier_row_id: context.maps.tierRows.get(`${row.tier_list_external_id}:${row.tier_row_external_id}`) ?? null, character_id: requireMap(context.maps.characters, row.character_external_id, 'character'), position: value(row, 'position') ?? 0, source_status: value(row, 'source_status') ?? 'unknown' }),
  },
  {
    planTable: 'codes',
    dbTable: 'codes',
    source: (loaded) => loaded.payloads.content.codes,
    keyColumns: ['external_id'],
    mapRow: (row) => ({ external_id: value(row, 'external_id'), code: value(row, 'code'), reward_summary: value(row, 'reward_summary'), status: value(row, 'status') ?? 'unknown', start_date: value(row, 'start_date'), end_date: value(row, 'end_date'), source_url: value(row, 'source_url'), source_status: value(row, 'source_status') ?? 'unknown' }),
  },
  {
    planTable: 'newsPosts',
    dbTable: 'news_posts',
    source: (loaded) => loaded.payloads.content.newsPosts,
    keyColumns: ['external_id'],
    mapRow: (row) => ({ external_id: value(row, 'external_id'), slug: value(row, 'slug'), title: value(row, 'title'), description: value(row, 'description'), category: value(row, 'category'), posted_at: value(row, 'posted_at'), source_url: value(row, 'source_url'), featured: value(row, 'featured') ?? false, pinned: value(row, 'pinned') ?? false, source_status: value(row, 'source_status') ?? 'placeholder', publication_status: value(row, 'publication_status') ?? 'draft' }),
  },
]

function planStepByTable(plan: SeedPlan, table: string): SeedPlanStep | undefined {
  return plan.steps.find((step) => step.table === table)
}

export function buildSeedImportDryRun(loaded: LoadedGeneratedPayloads, validation: SeedValidationResult, plan: SeedPlan, databaseUrl: string): SeedImportReport {
  const report = createReport(databaseUrl, 'dry-run', plan)
  if (validation.severityCounts.BLOCKER > 0) {
    report.failed = validation.severityCounts.BLOCKER
    report.errors.push({ table: 'seed-validation', message: 'Seed import refused because validation blockers exist.' })
  }

  for (const importer of importers) {
    const step = planStepByTable(plan, importer.planTable)
    const rows = importer.source(loaded)
    const allowed = step?.allowedForFutureLocalImport ?? false
    const action: SeedImportTableAction = {
      table: importer.planTable,
      plannedRows: rows.length,
      inserted: 0,
      updated: 0,
      skipped: allowed ? 0 : rows.length,
      failed: 0,
      skippedReason: allowed ? null : step?.blockedReason ?? 'Not allowed by seed plan.',
    }
    preflightNormalizeImporter(importer, rows, report, action)
    if (allowed && action.failed === 0) {
      action.inserted = rows.length
    }
    report.tables.push(action)
  }

  for (const step of plan.steps) {
    if (importers.some((importer) => importer.planTable === step.table)) continue
    if (step.rowCount === 0) continue
    report.tables.push({
      table: step.table,
      plannedRows: step.rowCount,
      inserted: 0,
      updated: 0,
      skipped: step.rowCount,
      failed: 0,
      skippedReason: step.blockedReason ?? 'No local seed importer exists for this table in v1.',
    })
  }

  report.inserted = report.tables.reduce((total, table) => total + table.inserted, 0)
  report.updated = report.tables.reduce((total, table) => total + table.updated, 0)
  report.skipped = report.tables.reduce((total, table) => total + table.skipped, 0)
  report.failed += report.tables.reduce((total, table) => total + table.failed, 0)
  return report
}

function assertMappedRow(table: string, sourceRow: SeedRow, mapped: Record<string, unknown> | null): Record<string, unknown> | null {
  if (!mapped) return null
  for (const [key, mappedValue] of Object.entries(mapped)) {
    if (key.endsWith('_id') && mappedValue === null) {
      const sourceExternalKey = `${key.slice(0, -3)}_external_id`
      if (sourceExternalKey in sourceRow && (sourceRow[sourceExternalKey] === null || sourceRow[sourceExternalKey] === undefined || sourceRow[sourceExternalKey] === '')) {
        continue
      }
      throw new Error(`Unable to resolve ${key} for ${table}: ${JSON.stringify(sourceRow)}`)
    }
  }
  return mapped
}

function preflightNormalizeImporter(importer: TableImporter, rows: SeedRow[], report: SeedImportReport, action: SeedImportTableAction) {
  const context = { client: null as unknown as pg.Client, maps: emptyMaps() }
  for (const row of rows) {
    try {
      importer.mapRow(row, context)
    } catch (error) {
      const rowError = new SeedImportRowError({ table: importer.planTable, dbTable: importer.dbTable, row, error })
      action.failed += 1
      report.errors.push({
        table: rowError.table,
        dbTable: rowError.dbTable,
        identifier: rowError.identifier,
        field: rowError.field,
        rawValue: rowError.rawValue,
        message: rowError.message,
        row,
      })
    }
  }
}

export async function runSeedImportLocal(loaded: LoadedGeneratedPayloads, validation: SeedValidationResult, plan: SeedPlan, databaseUrl: string): Promise<SeedImportReport> {
  if (validation.severityCounts.BLOCKER > 0) {
    const report = createReport(databaseUrl, 'write', plan)
    report.errors.push({ table: 'seed-validation', message: 'Seed import refused because validation blockers exist.' })
    report.failed = validation.severityCounts.BLOCKER
    return report
  }

  const report = createReport(databaseUrl, 'write', plan)
  const client = new Client({ connectionString: databaseUrl })
  const context: ImportContext = { client, maps: emptyMaps() }

  try {
    await client.connect()
    await client.query('begin')

    for (const importer of importers) {
      const step = planStepByTable(plan, importer.planTable)
      const rows = importer.source(loaded)
      const action: SeedImportTableAction = {
        table: importer.planTable,
        plannedRows: rows.length,
        inserted: 0,
        updated: 0,
        skipped: 0,
        failed: 0,
        skippedReason: null,
      }

      if (!step?.allowedForFutureLocalImport) {
        action.skipped = rows.length
        action.skippedReason = step?.blockedReason ?? 'Not allowed by seed plan.'
        report.tables.push(action)
        continue
      }

      for (const row of rows) {
        try {
          const mapped = assertMappedRow(importer.planTable, row, importer.mapRow(row, context))
          if (!mapped) {
            action.skipped += 1
            continue
          }
          const result = await upsertRow(client, importer.dbTable, mapped, importer.keyColumns)
          if (result === 'inserted') action.inserted += 1
          else action.updated += 1
        } catch (error) {
          action.failed += 1
          throw new SeedImportRowError({ table: importer.planTable, dbTable: importer.dbTable, row, error })
        }
      }

      report.tables.push(action)
      if (importer.refreshMaps) {
        await importer.refreshMaps(context)
      }
    }

    for (const step of plan.steps) {
      if (importers.some((importer) => importer.planTable === step.table)) continue
      if (step.rowCount === 0) continue
      report.tables.push({
        table: step.table,
        plannedRows: step.rowCount,
        inserted: 0,
        updated: 0,
        skipped: step.rowCount,
        failed: 0,
        skippedReason: step.blockedReason ?? 'No local seed importer exists for this table in v1.',
      })
    }

    await client.query('commit')
    report.transaction = 'committed'
  } catch (error) {
    await client.query('rollback').catch(() => undefined)
    report.transaction = 'rolled_back'
    report.failed += 1
    if (error instanceof SeedImportRowError) {
      report.errors.push({
        table: error.table,
        dbTable: error.dbTable,
        identifier: error.identifier,
        field: error.field,
        rawValue: error.rawValue,
        message: error.message,
        row: error.row,
      })
    } else {
      report.errors.push({ table: 'transaction', message: error instanceof Error ? error.message : String(error) })
    }
  } finally {
    await client.end().catch(() => undefined)
  }

  report.inserted = report.tables.reduce((total, table) => total + table.inserted, 0)
  report.updated = report.tables.reduce((total, table) => total + table.updated, 0)
  report.skipped = report.tables.reduce((total, table) => total + table.skipped, 0)
  report.failed += report.tables.reduce((total, table) => total + table.failed, 0)
  return report
}

export function renderSeedImportLocalReport(report: SeedImportReport): string {
  const rows = report.tables
    .map((table) => `| ${table.table} | ${table.plannedRows} | ${table.inserted} | ${table.updated} | ${table.skipped} | ${table.failed} | ${table.skippedReason ?? ''} |`)
    .join('\n')

  return `# Local Seed Import Report

Generated: ${report.generatedAt}

## Summary

- Mode: ${report.mode}
- Database: ${report.database.sanitizedUrl}
- Transaction: ${report.transaction}
- Planned rows: ${report.plannedRows}
- Inserted rows: ${report.inserted}
- Updated/upserted rows: ${report.updated}
- Skipped rows: ${report.skipped}
- Blocked rows: ${report.blockedRows}
- Needs verification rows: ${report.needsVerificationRows}
- Failed rows: ${report.failed}

This command is local-only. It must never be used against production databases.

## Table Actions

| Table | Planned | Inserted | Updated | Skipped | Failed | Note |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
${rows}

## Errors

${report.errors.length > 0 ? report.errors.map((error) => `- ${error.table}: ${error.message}`).join('\n') : '- None'}

## Policy

- Character material draft rows are skipped.
- Auth, user, session, admin, Build Planner, localStorage, and personal data are not imported.
- Existing verified source status is not downgraded by lower-confidence generated data.
- Unverified data is not marked verified.
`
}
