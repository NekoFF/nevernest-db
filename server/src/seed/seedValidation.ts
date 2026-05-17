import type { DryRunIssue, GeneratedSeedPayloads, LoadedGeneratedPayloads, SeedPayloadGroup, SeedRow, SeedSeverity, SeedSourceStatus, SeedValidationIssue, SeedValidationResult } from './seedTypes.js'
import { normalizeNullableNumber, normalizeNullablePercentNumber, normalizeNumber, normalizePercentNumber } from './seedValueNormalizers.js'

const allowedSourceStatuses = new Set<SeedSourceStatus>(['verified', 'needs_verification', 'estimated', 'placeholder', 'mock', 'unknown'])
const severityOrder: SeedSeverity[] = ['OK', 'INFO', 'WARNING', 'NEEDS_VERIFICATION', 'BLOCKER']
const tablesRequiringSlug = new Set([
  'elements',
  'arcTypes',
  'roles',
  'tags',
  'mediaAssets',
  'characters',
  'weapons',
  'cartridgeSets',
  'moduleShapes',
  'modulePieces',
  'vehicles',
  'tierLists',
  'newsPosts',
  'guides',
  'apartmentItems',
])

const emptyAllowedTables = new Set([
  'characterSkillScaling',
  'characterBannerHistory',
  'characterQuotes',
  'characterPersonalItems',
  'characterBuildRecommendations',
  'characterTeamRecommendations',
  'weaponRecommendedCharacters',
  'moduleStatTemplates',
  'guides',
  'communityLinks',
  'apartmentItems',
])

const blockedDraftTables = new Set(['characterMaterials', 'guides', 'communityLinks', 'apartmentItems'])

function createCounts(): Record<SeedSeverity, number> {
  return { OK: 0, INFO: 0, WARNING: 0, NEEDS_VERIFICATION: 0, BLOCKER: 0 }
}

function addIssue(issues: SeedValidationIssue[], issue: SeedValidationIssue) {
  issues.push(issue)
}

function sourceStatusOf(row: SeedRow): string | undefined {
  return typeof row.source_status === 'string' ? row.source_status : undefined
}

function externalIdOf(row: SeedRow): string | undefined {
  return typeof row.external_id === 'string' ? row.external_id : undefined
}

function rowIdentifier(row: SeedRow): string {
  const keys = ['external_id', 'weapon_external_id', 'character_external_id', 'cartridge_set_external_id', 'vehicle_external_id', 'tier_list_external_id']
  for (const key of keys) {
    if (typeof row[key] === 'string' && String(row[key]).length > 0) return String(row[key])
  }
  return 'unknown'
}

function hasTableSpecificExternalId(row: SeedRow, keys: string[]): boolean {
  return keys.some((key) => typeof row[key] === 'string' && String(row[key]).length > 0)
}

function validateDuplicateExternalIds(issues: SeedValidationIssue[], table: string, rows: SeedRow[]) {
  const seen = new Set<string>()
  const duplicates = new Set<string>()

  for (const row of rows) {
    const externalId = externalIdOf(row)
    if (!externalId) continue
    if (seen.has(externalId)) duplicates.add(externalId)
    seen.add(externalId)
  }

  for (const duplicate of duplicates) {
    addIssue(issues, {
      severity: 'BLOCKER',
      area: 'seed-validation',
      table,
      message: `Duplicate external_id "${duplicate}" in ${table}.`,
    })
  }
}

function validateRows(issues: SeedValidationIssue[], table: string, rows: SeedRow[]) {
  validateDuplicateExternalIds(issues, table, rows)

  if (rows.length === 0 && !emptyAllowedTables.has(table)) {
    addIssue(issues, {
      severity: 'WARNING',
      area: 'seed-validation',
      table,
      message: `${table} is empty in generated payloads.`,
    })
  }

  rows.forEach((row, index) => {
    if ('external_id' in row && !externalIdOf(row)) {
      addIssue(issues, {
        severity: 'BLOCKER',
        area: 'seed-validation',
        table,
        message: `${table}[${index}] is missing required external_id.`,
      })
    }

    if (tablesRequiringSlug.has(table) && table !== 'mediaAssets' && 'slug' in row && !row.slug) {
      addIssue(issues, {
        severity: 'BLOCKER',
        area: 'seed-validation',
        table,
        message: `${table}[${index}] is missing required slug.`,
      })
    }

    if ('source_status' in row) {
      const sourceStatus = sourceStatusOf(row)
      if (!sourceStatus) {
        addIssue(issues, {
          severity: 'BLOCKER',
          area: 'seed-validation',
          table,
          message: `${table}[${index}] is missing required source_status.`,
        })
      } else if (!allowedSourceStatuses.has(sourceStatus as SeedSourceStatus)) {
        addIssue(issues, {
          severity: 'BLOCKER',
          area: 'seed-validation',
          table,
          message: `${table}[${index}] has invalid source_status "${sourceStatus}".`,
        })
      }
    }
  })
}

function validateReferences(issues: SeedValidationIssue[], payloads: GeneratedSeedPayloads) {
  const characterIds = new Set(payloads.characters.characters.map((row) => row.external_id))
  const weaponIds = new Set(payloads.weapons.weapons.map((row) => row.external_id))
  const cartridgeIds = new Set(payloads.cartridgesModules.cartridgeSets.map((row) => row.external_id))
  const moduleShapeIds = new Set(payloads.cartridgesModules.moduleShapes.map((row) => row.external_id))
  const tierListIds = new Set(payloads.tierLists.tierLists.map((row) => row.external_id))
  const tierRowIds = new Set(payloads.tierLists.tierRows.map((row) => row.external_id))

  const checks: Array<{ table: string; rows: SeedRow[]; key: string; known: Set<unknown> }> = [
    { table: 'characterRoles', rows: payloads.characters.characterRoles, key: 'character_external_id', known: characterIds },
    { table: 'characterTags', rows: payloads.characters.characterTags, key: 'character_external_id', known: characterIds },
    { table: 'characterStats', rows: payloads.characters.characterStats, key: 'character_external_id', known: characterIds },
    { table: 'characterSkills', rows: payloads.characters.characterSkills, key: 'character_external_id', known: characterIds },
    { table: 'characterMaterials', rows: payloads.characters.characterMaterials, key: 'character_external_id', known: characterIds },
    { table: 'weaponRefinements', rows: payloads.weapons.weaponRefinements, key: 'weapon_external_id', known: weaponIds },
    { table: 'weaponGrowthStats', rows: payloads.weapons.weaponGrowthStats, key: 'weapon_external_id', known: weaponIds },
    { table: 'cartridgeSetBonuses', rows: payloads.cartridgesModules.cartridgeSetBonuses, key: 'cartridge_set_external_id', known: cartridgeIds },
    { table: 'cartridgeCompatibleShapes', rows: payloads.cartridgesModules.cartridgeCompatibleShapes, key: 'cartridge_set_external_id', known: cartridgeIds },
    { table: 'cartridgeCompatibleShapes', rows: payloads.cartridgesModules.cartridgeCompatibleShapes, key: 'module_shape_external_id', known: moduleShapeIds },
    { table: 'modulePieces', rows: payloads.cartridgesModules.modulePieces, key: 'module_shape_external_id', known: moduleShapeIds },
    { table: 'vehicleStats', rows: payloads.vehicles.vehicleStats, key: 'vehicle_external_id', known: new Set(payloads.vehicles.vehicles.map((row) => row.external_id)) },
    { table: 'tierRows', rows: payloads.tierLists.tierRows, key: 'tier_list_external_id', known: tierListIds },
    { table: 'tierEntries', rows: payloads.tierLists.tierEntries, key: 'tier_list_external_id', known: tierListIds },
    { table: 'tierEntries', rows: payloads.tierLists.tierEntries, key: 'tier_row_external_id', known: tierRowIds },
    { table: 'tierEntries', rows: payloads.tierLists.tierEntries, key: 'character_external_id', known: characterIds },
  ]

  for (const check of checks) {
    check.rows.forEach((row, index) => {
      const value = row[check.key]
      if (typeof value === 'string' && !check.known.has(value)) {
        addIssue(issues, {
          severity: 'BLOCKER',
          area: 'seed-validation',
          table: check.table,
          message: `${check.table}[${index}] references missing ${check.key} "${value}".`,
        })
      }
    })
  }
}

function validateKnownUnverifiedAreas(issues: SeedValidationIssue[], payloads: GeneratedSeedPayloads) {
  for (const row of payloads.cartridgesModules.cartridgeCompatibleShapes) {
    if (row.source_status === 'verified') {
      addIssue(issues, {
        severity: 'BLOCKER',
        area: 'source-verification',
        table: 'cartridgeCompatibleShapes',
        message: 'Cartridge compatible shapes must not be marked verified until trusted source review exists.',
        detail: row,
      })
    } else if (row.source_status === 'needs_verification') {
      addIssue(issues, {
        severity: 'NEEDS_VERIFICATION',
        area: 'source-verification',
        table: 'cartridgeCompatibleShapes',
        message: 'Cartridge compatible shape is allowed for preview but needs trusted source verification before production import.',
        detail: row,
      })
    }
  }

  for (const table of blockedDraftTables) {
    const rows = Object.values(payloads).flatMap((group: SeedPayloadGroup) => group[table] ?? [])
    if (rows.length > 0) {
      addIssue(issues, {
        severity: table === 'characterMaterials' ? 'NEEDS_VERIFICATION' : 'WARNING',
        area: 'seed-policy',
        table,
        message: `${table} is draft/placeholder-level and blocked from future local import for now.`,
      })
    }
  }
}

function validateNoUserOrAdminPayloads(issues: SeedValidationIssue[], payloads: GeneratedSeedPayloads) {
  const forbiddenPattern = /(admin|user|session|localStorage)/i
  for (const [groupName, group] of Object.entries(payloads)) {
    for (const table of Object.keys(group)) {
      if (forbiddenPattern.test(table)) {
        addIssue(issues, {
          severity: 'BLOCKER',
          area: 'seed-policy',
          table,
          message: `Forbidden admin/user/localStorage seed table found in ${groupName}.${table}.`,
        })
      }
    }
  }
}

function validateNumericSeedFields(issues: SeedValidationIssue[], payloads: GeneratedSeedPayloads) {
  const checks: Array<{ table: string; rows: SeedRow[]; fields: Array<{ key: string; normalize: (value: unknown, field: string) => unknown }> }> = [
    {
      table: 'characterStats',
      rows: payloads.characters.characterStats,
      fields: [
        { key: 'level', normalize: normalizeNullableNumber },
        { key: 'value', normalize: normalizeNullablePercentNumber },
      ],
    },
    {
      table: 'weapons',
      rows: payloads.weapons.weapons,
      fields: [
        { key: 'main_stat_value', normalize: normalizeNullablePercentNumber },
        { key: 'sub_stat_value', normalize: normalizeNullablePercentNumber },
      ],
    },
    {
      table: 'weaponGrowthStats',
      rows: payloads.weapons.weaponGrowthStats,
      fields: [
        { key: 'level', normalize: normalizeNumber },
        { key: 'value', normalize: normalizePercentNumber },
      ],
    },
    {
      table: 'moduleShapes',
      rows: payloads.cartridgesModules.moduleShapes,
      fields: [
        { key: 'width', normalize: normalizeNullableNumber },
        { key: 'height', normalize: normalizeNullableNumber },
        { key: 'cell_count', normalize: normalizeNullableNumber },
        { key: 'sort_order', normalize: normalizeNullableNumber },
      ],
    },
    {
      table: 'cartridgeCompatibleShapes',
      rows: payloads.cartridgesModules.cartridgeCompatibleShapes,
      fields: [{ key: 'slot', normalize: normalizeNumber }],
    },
    {
      table: 'vehicleStats',
      rows: payloads.vehicles.vehicleStats,
      fields: [
        { key: 'max_speed', normalize: normalizeNullableNumber },
        { key: 'acceleration', normalize: normalizeNullableNumber },
        { key: 'durability', normalize: normalizeNullableNumber },
      ],
    },
    {
      table: 'vehicleAcquisition',
      rows: payloads.vehicles.vehicleAcquisition,
      fields: [{ key: 'price', normalize: normalizeNullableNumber }],
    },
  ]

  for (const check of checks) {
    check.rows.forEach((row, index) => {
      for (const field of check.fields) {
        try {
          field.normalize(row[field.key], field.key)
        } catch (error) {
          addIssue(issues, {
            severity: 'BLOCKER',
            area: 'seed-validation',
            table: check.table,
            message: `${check.table}[${index}] has invalid numeric value for ${field.key}; identifier=${rowIdentifier(row)}; rawValue=${JSON.stringify(row[field.key])}; ${error instanceof Error ? error.message : String(error)}`,
            detail: { row, field: field.key, rawValue: row[field.key], identifier: rowIdentifier(row) },
          })
        }
      }
    })
  }
}

function carryDryRunIssues(issues: SeedValidationIssue[], dryRunIssues: DryRunIssue[]) {
  for (const issue of dryRunIssues) {
    if (issue.severity === 'OK' || issue.severity === 'INFO') continue
    issues.push({
      severity: issue.severity,
      area: issue.area,
      message: issue.message,
      detail: issue.detail,
    })
  }
}

export function validateSeedPayloads(input: LoadedGeneratedPayloads): SeedValidationResult {
  const issues: SeedValidationIssue[] = []

  for (const group of Object.values(input.payloads)) {
    for (const [table, rows] of Object.entries(group)) {
      validateRows(issues, table, rows)
      rows.forEach((row, index) => {
        if (!('source_status' in row) && !hasTableSpecificExternalId(row, ['external_id', 'character_external_id', 'weapon_external_id', 'cartridge_set_external_id', 'vehicle_external_id', 'tier_list_external_id'])) {
          addIssue(issues, {
            severity: 'WARNING',
            area: 'seed-validation',
            table,
            message: `${table}[${index}] has no source_status and no detectable external reference.`,
          })
        }
      })
    }
  }

  validateReferences(issues, input.payloads)
  validateNumericSeedFields(issues, input.payloads)
  validateKnownUnverifiedAreas(issues, input.payloads)
  validateNoUserOrAdminPayloads(issues, input.payloads)
  carryDryRunIssues(issues, input.issues)

  const severityCounts = createCounts()
  for (const issue of issues) severityCounts[issue.severity] += 1
  if (issues.length === 0) severityCounts.OK = 1

  return {
    generatedAt: new Date().toISOString(),
    severityCounts,
    issues: issues.sort((a, b) => severityOrder.indexOf(b.severity) - severityOrder.indexOf(a.severity)),
    canPreview: severityCounts.BLOCKER === 0,
    canFutureLocalImport: severityCounts.BLOCKER === 0 && severityCounts.NEEDS_VERIFICATION === 0,
  }
}
