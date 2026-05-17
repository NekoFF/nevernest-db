import { runImportDryRun } from './import-dry-run/index.mjs'

const result = await runImportDryRun()

console.log('NTE Import Dry Run')
console.log(`report: ${result.reportPath}`)
console.log('severity:', JSON.stringify(result.validation.severityCounts))
console.log('sourceStatus:', JSON.stringify(result.validation.sourceStatusBreakdown))
console.log('resolvedMediaAliases:', result.validation.resolvedMediaAliases.length)
console.log('materialCandidates:', result.materialsDraft.materialCandidates.length)
console.log('materialUsageRows:', result.materialsDraft.materialUsageRows.length)
console.log('unresolvedMaterialLabels:', result.materialsDraft.unresolvedMaterialLabels.length)

const blockers = result.validation.issues.filter((issue) => issue.severity === 'BLOCKER')
if (blockers.length) {
  console.log('blockers:')
  blockers.forEach((issue) => console.log(`- [${issue.area}] ${issue.message}`))
}
