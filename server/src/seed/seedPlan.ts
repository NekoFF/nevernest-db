import type { GeneratedSeedPayloads, SeedPayloadGroup, SeedPlan, SeedPlanStep, SeedRow, SeedValidationResult } from './seedTypes.js'

const groupOrder: Array<{ group: keyof GeneratedSeedPayloads; tables: string[] }> = [
  { group: 'taxonomy', tables: ['elements', 'arcTypes', 'rarities', 'roles', 'tags', 'stats'] },
  { group: 'media', tables: ['mediaAssets'] },
  { group: 'characters', tables: ['characters'] },
  { group: 'characters', tables: ['characterRoles', 'characterTags', 'characterStats', 'characterSkills', 'characterSkillScaling', 'characterMaterials', 'characterVoiceActors', 'characterBannerHistory', 'characterQuotes', 'characterPersonalItems', 'characterBuildRecommendations', 'characterTeamRecommendations'] },
  { group: 'weapons', tables: ['weapons', 'weaponRefinements', 'weaponGrowthStats', 'weaponRecommendedCharacters'] },
  { group: 'cartridgesModules', tables: ['cartridgeSets', 'cartridgeSetBonuses', 'moduleShapes', 'modulePieces', 'cartridgeCompatibleShapes', 'moduleStatTemplates'] },
  { group: 'vehicles', tables: ['vehicles', 'vehicleStats', 'vehicleAcquisition'] },
  { group: 'tierLists', tables: ['tierLists', 'tierRows', 'tierEntries'] },
  { group: 'content', tables: ['codes', 'newsPosts', 'guides', 'communityLinks', 'apartmentItems'] },
]

const blockedForFutureImport = new Map<string, string>([
  ['characterMaterials', 'Draft material references need source verification and canonical material review before import.'],
  ['guides', 'Placeholder guide content is not mapped for production import.'],
  ['communityLinks', 'Community links do not have a reviewed production seed policy yet.'],
  ['apartmentItems', 'Apartment items do not have a reviewed production seed policy yet.'],
])

function statusNotes(rows: SeedRow[]): Record<string, number> {
  return rows.reduce<Record<string, number>>((notes, row) => {
    const status = typeof row.source_status === 'string' ? row.source_status : 'not_applicable'
    notes[status] = (notes[status] ?? 0) + 1
    return notes
  }, {})
}

function hasBlocker(validation: SeedValidationResult, table: string): boolean {
  return validation.issues.some((issue) => issue.severity === 'BLOCKER' && issue.table === table)
}

export function buildSeedPlan(payloads: GeneratedSeedPayloads, validation: SeedValidationResult): SeedPlan {
  const steps: SeedPlanStep[] = []
  let order = 1

  for (const groupPlan of groupOrder) {
    const group = payloads[groupPlan.group] as SeedPayloadGroup
    for (const table of groupPlan.tables) {
      const rows = group[table] ?? []
      const policyBlockedReason = blockedForFutureImport.get(table) ?? null
      const tableHasBlocker = hasBlocker(validation, table)
      const blockedReason = tableHasBlocker ? 'Validation blocker present for this table.' : policyBlockedReason

      steps.push({
        order,
        group: groupPlan.group,
        table,
        rowCount: rows.length,
        allowedForPreview: !tableHasBlocker,
        allowedForFutureLocalImport: !tableHasBlocker && !policyBlockedReason,
        blockedReason,
        sourceStatusNotes: statusNotes(rows),
      })
      order += 1
    }
  }

  return {
    generatedAt: new Date().toISOString(),
    steps,
    totals: {
      rows: steps.reduce((total, step) => total + step.rowCount, 0),
      previewRows: steps.filter((step) => step.allowedForPreview).reduce((total, step) => total + step.rowCount, 0),
      futureLocalImportRows: steps.filter((step) => step.allowedForFutureLocalImport).reduce((total, step) => total + step.rowCount, 0),
      blockedRows: steps.filter((step) => !step.allowedForFutureLocalImport).reduce((total, step) => total + step.rowCount, 0),
    },
  }
}
