import pg from 'pg'
import type { SeedDbPreview, SeedDbTableComparison, SeedPlan } from './seedTypes.js'

const { Client } = pg

const tableNameByPlanTable = new Map<string, string>([
  ['elements', 'elements'],
  ['arcTypes', 'arc_types'],
  ['rarities', 'rarities'],
  ['roles', 'roles'],
  ['tags', 'tags'],
  ['stats', 'stats'],
  ['mediaAssets', 'media_assets'],
  ['characters', 'characters'],
  ['characterRoles', 'character_roles'],
  ['characterTags', 'character_tags'],
  ['characterStats', 'character_stats'],
  ['characterSkills', 'character_skills'],
  ['characterMaterials', 'character_materials'],
  ['characterVoiceActors', 'character_voice_actors'],
  ['materials', 'materials'],
  ['weapons', 'weapons'],
  ['weaponRefinements', 'weapon_refinements'],
  ['weaponGrowthStats', 'weapon_growth_stats'],
  ['cartridgeSets', 'cartridge_sets'],
  ['cartridgeSetBonuses', 'cartridge_set_bonuses'],
  ['moduleShapes', 'module_shapes'],
  ['modulePieces', 'module_pieces'],
  ['cartridgeCompatibleShapes', 'cartridge_compatible_shapes'],
  ['vehicles', 'vehicles'],
  ['vehicleStats', 'vehicle_stats'],
  ['vehicleAcquisition', 'vehicle_acquisition'],
  ['tierLists', 'tier_lists'],
  ['tierRows', 'tier_rows'],
  ['tierEntries', 'tier_entries'],
  ['codes', 'codes'],
  ['newsPosts', 'news_posts'],
  ['guides', 'guides'],
  ['communityLinks', 'community_links'],
  ['apartmentItems', 'apartment_items'],
])

export function sanitizeDatabaseUrl(databaseUrl: string) {
  const parsed = new URL(databaseUrl)
  const database = parsed.pathname.replace(/^\/+/, '')
  return {
    host: parsed.hostname,
    database,
    sanitizedUrl: `${parsed.protocol}//${parsed.hostname}${parsed.port ? `:${parsed.port}` : ''}/${database}`,
  }
}

export function compareSeedPlanToCounts(seedPlan: SeedPlan, counts: Map<string, number | null>): SeedDbTableComparison[] {
  const comparisons: SeedDbTableComparison[] = seedPlan.steps.map((step) => {
    const dbTable = tableNameByPlanTable.get(step.table)
    if (!dbTable) {
      return {
        planTable: step.table,
        dbTable: '',
        plannedRows: step.rowCount,
        existingRows: null,
        difference: null,
        status: 'skipped',
        allowedForFutureLocalImport: step.allowedForFutureLocalImport,
        blockedReason: 'No DB table mapping exists for this preview step.',
      }
    }

    const existingRows = counts.get(dbTable)
    if (existingRows === undefined || existingRows === null) {
      return {
        planTable: step.table,
        dbTable,
        plannedRows: step.rowCount,
        existingRows: null,
        difference: null,
        status: 'missing',
        allowedForFutureLocalImport: step.allowedForFutureLocalImport,
        blockedReason: step.blockedReason,
      }
    }

    return {
      planTable: step.table,
      dbTable,
      plannedRows: step.rowCount,
      existingRows,
      difference: step.rowCount - existingRows,
      status: existingRows === 0 ? 'empty' : 'non_empty',
      allowedForFutureLocalImport: step.allowedForFutureLocalImport,
      blockedReason: step.blockedReason,
    }
  })

  if (!comparisons.some((row) => row.dbTable === 'materials')) {
    const existingRows = counts.get('materials')
    const status: SeedDbTableComparison['status'] = existingRows === undefined || existingRows === null ? 'missing' : existingRows === 0 ? 'empty' : 'non_empty'
    comparisons.splice(14, 0, {
      planTable: 'materials',
      dbTable: 'materials',
      plannedRows: 0,
      existingRows: existingRows ?? null,
      difference: existingRows === undefined || existingRows === null ? null : -existingRows,
      status,
      allowedForFutureLocalImport: false,
      blockedReason: 'Material catalog seed rows are draft-only and are not part of the current import plan.',
    })
  }

  return comparisons
}

async function tableExists(client: pg.Client, tableName: string): Promise<boolean> {
  const result = await client.query('select to_regclass($1) as table_name', [`public.${tableName}`])
  return result.rows[0]?.table_name !== null
}

async function countTable(client: pg.Client, tableName: string): Promise<number | null> {
  if (!await tableExists(client, tableName)) return null
  const result = await client.query(`select count(*)::int as count from "${tableName}"`)
  return Number(result.rows[0]?.count ?? 0)
}

export async function inspectSeedDbPreview(databaseUrl: string, seedPlan: SeedPlan): Promise<SeedDbPreview> {
  const client = new Client({ connectionString: databaseUrl })
  const mappedTables = [...new Set([...tableNameByPlanTable.values()])]
  const counts = new Map<string, number | null>()

  try {
    await client.connect()
    for (const tableName of mappedTables) {
      counts.set(tableName, await countTable(client, tableName))
    }
  } finally {
    await client.end().catch(() => undefined)
  }

  const comparisons = compareSeedPlanToCounts(seedPlan, counts)
  const database = sanitizeDatabaseUrl(databaseUrl)

  return {
    generatedAt: new Date().toISOString(),
    database,
    comparisons,
    totals: {
      plannedRows: comparisons.reduce((total, row) => total + row.plannedRows, 0),
      existingRows: comparisons.reduce((total, row) => total + (row.existingRows ?? 0), 0),
      missingTables: comparisons.filter((row) => row.status === 'missing').length,
      skippedTables: comparisons.filter((row) => row.status === 'skipped').length,
      emptyTables: comparisons.filter((row) => row.status === 'empty').length,
      nonEmptyTables: comparisons.filter((row) => row.status === 'non_empty').length,
    },
  }
}

export function renderSeedDbPreviewReport(preview: SeedDbPreview, seedPlan: SeedPlan): string {
  const blockedRows = seedPlan.steps.filter((step) => !step.allowedForFutureLocalImport)
  const needsVerificationRows = seedPlan.steps
    .filter((step) => step.sourceStatusNotes.needs_verification)
    .map((step) => `${step.table}: ${step.sourceStatusNotes.needs_verification}`)

  const comparisonRows = preview.comparisons
    .map((row) => `| ${row.planTable} | ${row.dbTable || 'n/a'} | ${row.plannedRows} | ${row.existingRows ?? 'n/a'} | ${row.difference ?? 'n/a'} | ${row.status} | ${row.blockedReason ?? ''} |`)
    .join('\n')

  return `# Seed DB Preview Report

Generated: ${preview.generatedAt}

## Database

- Host: ${preview.database.host}
- Database: ${preview.database.database}
- Sanitized URL: ${preview.database.sanitizedUrl}

No writes were performed. This command only inspected table existence and row counts.

## Summary

- Planned seed rows: ${preview.totals.plannedRows}
- Existing DB rows across inspected tables: ${preview.totals.existingRows}
- Empty tables: ${preview.totals.emptyTables}
- Non-empty tables: ${preview.totals.nonEmptyTables}
- Missing tables: ${preview.totals.missingTables}
- Skipped tables: ${preview.totals.skippedTables}
- Future local import rows currently allowed by policy: ${seedPlan.totals.futureLocalImportRows}
- Blocked rows: ${seedPlan.totals.blockedRows}

## Table Comparison

| Plan Table | DB Table | Planned Rows | Existing Rows | Difference | Status | Note |
| --- | --- | ---: | ---: | ---: | --- | --- |
${comparisonRows}

## Empty Tables

${preview.comparisons.filter((row) => row.status === 'empty').map((row) => `- ${row.dbTable}`).join('\n') || '- None'}

## Non-empty Tables

${preview.comparisons.filter((row) => row.status === 'non_empty').map((row) => `- ${row.dbTable}: ${row.existingRows}`).join('\n') || '- None'}

## Missing Or Skipped Tables

${preview.comparisons.filter((row) => row.status === 'missing' || row.status === 'skipped').map((row) => `- ${row.planTable}: ${row.status}`).join('\n') || '- None'}

## Blocked Seed Areas

${blockedRows.length > 0 ? blockedRows.map((step) => `- ${step.table}: ${step.blockedReason}`).join('\n') : '- None'}

## Needs Verification Areas

${needsVerificationRows.length > 0 ? needsVerificationRows.map((entry) => `- ${entry}`).join('\n') : '- None'}

## Local Import Readiness

Local import is not enabled yet. A future local import would only be safe after reviewed seed staging exists, blocked rows remain excluded, and needs-verification rows are handled according to source policy.
`
}
